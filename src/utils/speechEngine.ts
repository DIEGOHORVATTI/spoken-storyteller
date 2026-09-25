import { ParagraphItem, SpeakerType, GenderType, VoiceOption } from '../types';

export interface SpeechEngineCallbacks {
  onParagraphChange: (index: number) => void;
  onStateChange: (isPlaying: boolean, isPaused: boolean) => void;
  onVoicesLoaded: (voices: VoiceOption[], defaultVoice: SpeechSynthesisVoice | null) => void;
  onError?: (errorMessage: string) => void;
}

export class SpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private paragraphs: ParagraphItem[] = [];
  private currentIndex: number = 0;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;

  private selectedVoice: SpeechSynthesisVoice | null = null;
  private maleVoice: SpeechSynthesisVoice | null = null;
  private femaleVoice: SpeechSynthesisVoice | null = null;
  private consecutiveErrors: number = 0;
  private baseRate: number = 1.0;
  private basePitch: number = 1.0;
  private characterVoices: boolean = true;
  private callbacks: SpeechEngineCallbacks;

  constructor(callbacks: SpeechEngineCallbacks) {
    this.callbacks = callbacks;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  public loadVoices(): VoiceOption[] {
    if (!this.synth) return [];
    const rawVoices = this.synth.getVoices();
    const formatted: VoiceOption[] = rawVoices.map((v) => {
      const lower = (v.name + ' ' + v.lang).toLowerCase();
      let genderEstimate: 'male' | 'female' | 'unknown' = 'unknown';

      // Common voice names and gender markers
      if (
        lower.includes('female') ||
        lower.includes('mulher') ||
        lower.includes('maria') ||
        lower.includes('francisca') ||
        lower.includes('luciana') ||
        lower.includes('heloisa') ||
        lower.includes('leticia') ||
        lower.includes('victoria') ||
        lower.includes('zira') ||
        lower.includes('samantha') ||
        lower.includes('joana') ||
        lower.includes('camila') ||
        lower.includes('alice') ||
        lower.includes('eva') ||
        lower.includes('sabina') ||
        lower.includes('yara') ||
        lower.includes('laura')
      ) {
        genderEstimate = 'female';
      } else if (
        lower.includes('male') ||
        lower.includes('homem') ||
        lower.includes('daniel') ||
        lower.includes('jorge') ||
        lower.includes('ricardo') ||
        lower.includes('antonio') ||
        lower.includes('david') ||
        lower.includes('felipe') ||
        lower.includes('gustavo') ||
        lower.includes('george') ||
        lower.includes('alex')
      ) {
        genderEstimate = 'male';
      }

      return {
        voice: v,
        name: v.name,
        lang: v.lang,
        isPortuguese: v.lang.toLowerCase().startsWith('pt'),
        genderEstimate,
      };
    });

    // Sort: Portuguese voices first, then alphabetical
    formatted.sort((a, b) => {
      if (a.isPortuguese && !b.isPortuguese) return -1;
      if (!a.isPortuguese && b.isPortuguese) return 1;
      return a.name.localeCompare(b.name);
    });

    // Auto-detect male & female voices in priority order (Portuguese first)
    const ptVoices = formatted.filter((v) => v.isPortuguese);
    const searchPool = ptVoices.length > 0 ? ptVoices : formatted;

    const detectedFemale = searchPool.find((v) => v.genderEstimate === 'female');
    const detectedMale = searchPool.find((v) => v.genderEstimate === 'male');

    if (detectedFemale && !this.femaleVoice) this.femaleVoice = detectedFemale.voice;
    if (detectedMale && !this.maleVoice) this.maleVoice = detectedMale.voice;

    // Auto-select preferred Portuguese voice if not chosen
    if (!this.selectedVoice && formatted.length > 0) {
      const ptVoice = formatted.find(
        (v) => v.lang.toLowerCase().includes('pt-br') || v.lang.toLowerCase().startsWith('pt'),
      );
      this.selectedVoice = ptVoice ? ptVoice.voice : formatted[0].voice;
    }

    this.callbacks.onVoicesLoaded(formatted, this.selectedVoice);
    return formatted;
  }

  public setVoice(voice: SpeechSynthesisVoice) {
    this.selectedVoice = voice;
    if (this.isPlaying && !this.isPaused) {
      this.playFrom(this.currentIndex);
    }
  }

  public setMaleVoice(voice: SpeechSynthesisVoice | null) {
    this.maleVoice = voice;
  }

  public setFemaleVoice(voice: SpeechSynthesisVoice | null) {
    this.femaleVoice = voice;
  }

  public getSelectedVoice(): SpeechSynthesisVoice | null {
    return this.selectedVoice;
  }

  public getMaleVoice(): SpeechSynthesisVoice | null {
    return this.maleVoice;
  }

  public getFemaleVoice(): SpeechSynthesisVoice | null {
    return this.femaleVoice;
  }

  public setRate(rate: number) {
    this.baseRate = rate;
  }

  public setPitch(pitch: number) {
    this.basePitch = pitch;
  }

  public setCharacterVoices(enabled: boolean) {
    this.characterVoices = enabled;
  }

  public setParagraphs(paragraphs: ParagraphItem[]) {
    this.paragraphs = paragraphs;
  }

  public playFrom(index: number) {
    if (!this.synth || this.paragraphs.length === 0) return;
    this.stopUtterance();

    this.currentIndex = Math.max(0, Math.min(index, this.paragraphs.length - 1));
    this.isPlaying = true;
    this.isPaused = false;
    this.callbacks.onStateChange(true, false);
    this.callbacks.onParagraphChange(this.currentIndex);

    this.speakCurrent();
  }

  public togglePlayPause() {
    if (!this.synth) return;

    if (!this.isPlaying) {
      this.playFrom(this.currentIndex);
      return;
    }

    if (this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.callbacks.onStateChange(true, false);
    } else {
      this.synth.pause();
      this.isPaused = true;
      this.callbacks.onStateChange(true, true);
    }
  }

  public stop() {
    this.stopUtterance();
    this.isPlaying = false;
    this.isPaused = false;
    this.callbacks.onStateChange(false, false);
  }

  public nextParagraph() {
    if (this.currentIndex < this.paragraphs.length - 1) {
      this.playFrom(this.currentIndex + 1);
    } else {
      this.stop();
    }
  }

  public previousParagraph() {
    if (this.currentIndex > 0) {
      this.playFrom(this.currentIndex - 1);
    } else {
      this.playFrom(0);
    }
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }

  private stopUtterance() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  private calculateVoiceParameters(speaker: SpeakerType, gender: GenderType): { pitch: number; rate: number; voiceToUse: SpeechSynthesisVoice | null } {
    if (!this.characterVoices) {
      return { pitch: this.basePitch, rate: this.baseRate, voiceToUse: this.selectedVoice };
    }

    if (gender === 'female' || speaker === 'female' || speaker === 'female_young') {
      // Female voice: use female voice if available, with pleasant higher pitch
      const voiceToUse = this.femaleVoice || this.selectedVoice;
      return {
        pitch: Math.min(1.85, this.basePitch * 1.28),
        rate: this.baseRate * 1.03,
        voiceToUse,
      };
    }

    switch (speaker) {
      case 'orsted':
      case 'male_deep':
        // Deep commanding male voice: lower pitch, steady grave pace
        return {
          pitch: Math.max(0.45, this.basePitch * 0.72),
          rate: Math.max(0.5, this.baseRate * 0.92),
          voiceToUse: this.maleVoice || this.selectedVoice,
        };
      case 'rudeus':
      case 'male_young':
        // Young male dialogue: agile, slightly elevated pitch
        return {
          pitch: Math.min(1.5, this.basePitch * 1.08),
          rate: this.baseRate * 1.02,
          voiceToUse: this.maleVoice || this.selectedVoice,
        };
      case 'narrator':
      default:
        // Introspective narration
        return {
          pitch: this.basePitch * 0.98,
          rate: this.baseRate,
          voiceToUse: this.selectedVoice,
        };
    }
  }

  private cleanTextForSpeech(text: string): string {
    // Make dialogue dashes sound natural rather than saying "travessão" or pausing oddly
    let cleaned = text.replace(/^[—–-]\s*/, '');
    cleaned = cleaned.replace(/\s*[—–-]\s*/g, ', ');
    cleaned = cleaned.replace(/“|”/g, '"');
    return cleaned;
  }

  private speakCurrent() {
    if (!this.synth || !this.isPlaying || this.currentIndex >= this.paragraphs.length) {
      this.stop();
      return;
    }

    try {
      const currentItem = this.paragraphs[this.currentIndex];
      const { pitch, rate, voiceToUse } = this.calculateVoiceParameters(
        currentItem.speaker,
        currentItem.speakerGender,
      );

      const spokenText = this.cleanTextForSpeech(currentItem.text);
      const utterance = new SpeechSynthesisUtterance(spokenText);

      // Attach utterance to window to prevent Chrome garbage-collection bug mid-speech
      if (typeof window !== 'undefined') {
        (window as unknown as { __activeUtterance: SpeechSynthesisUtterance }).__activeUtterance = utterance;
      }

      if (voiceToUse) {
        utterance.voice = voiceToUse;
        utterance.lang = voiceToUse.lang;
      } else if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
        utterance.lang = this.selectedVoice.lang;
      } else {
        utterance.lang = 'pt-BR';
      }

      utterance.pitch = pitch;
      utterance.rate = rate;

      utterance.onend = () => {
        this.consecutiveErrors = 0;
        if (this.isPlaying && !this.isPaused) {
          if (this.currentIndex < this.paragraphs.length - 1) {
            this.currentIndex++;
            this.callbacks.onParagraphChange(this.currentIndex);
            this.speakCurrent();
          } else {
            this.stop();
          }
        }
      };

      utterance.onerror = (e) => {
        if (e.error === 'canceled' || e.error === 'interrupted') return;
        console.warn('Speech synthesis error details:', e.error, e);
        this.consecutiveErrors++;

        if (this.consecutiveErrors >= 2) {
          this.stop();
          const errMsg =
            e.error === 'not-allowed'
              ? 'O navegador bloqueou o áudio automático. Clique na página para habilitar permissão de som.'
              : e.error === 'language-unavailable'
              ? 'Seu sistema não possui a voz selecionada instalada. Escolha outra voz nas configurações.'
              : `Erro no sintetizador de voz do navegador (${e.error || 'falha de áudio'}).`;

          if (this.callbacks.onError) {
            this.callbacks.onError(errMsg);
          }
          return;
        }

        if (this.isPlaying && this.currentIndex < this.paragraphs.length - 1) {
          this.currentIndex++;
          this.callbacks.onParagraphChange(this.currentIndex);
          setTimeout(() => this.speakCurrent(), 100);
        } else {
          this.stop();
        }
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    } catch (err) {
      console.error('Failed to trigger speech:', err);
      this.stop();
      if (this.callbacks.onError) {
        this.callbacks.onError('Não foi possível iniciar a reprodução de voz neste navegador.');
      }
    }
  }
}
