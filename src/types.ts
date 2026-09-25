export type GenderType = 'male' | 'female' | 'neutral';

export type SpeakerType = 'narrator' | 'male_deep' | 'male_young' | 'female' | 'female_young' | 'rudeus' | 'orsted';

export interface ParagraphItem {
  id: number;
  text: string;
  speaker: SpeakerType;
  speakerGender: GenderType;
  speakerLabel?: string;
}

export type ThemeMode = 'parchment' | 'dark' | 'sepia' | 'light';
export type FontStyle = 'merriweather' | 'lora' | 'outfit';
export type AmbienceType = 'none' | 'medieval' | 'fire' | 'rain' | 'magic';

export interface VoiceOption {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
  isPortuguese: boolean;
  genderEstimate: 'male' | 'female' | 'unknown';
}

export interface ReaderSettings {
  rate: number;
  pitch: number;
  characterVoices: boolean;
  fontSize: number; // in px
  theme: ThemeMode;
  fontStyle: FontStyle;
  autoScroll: boolean;
  ambience: AmbienceType;
  ambienceVolume: number;
}
