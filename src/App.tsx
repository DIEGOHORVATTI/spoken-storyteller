import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ParagraphItem, ReaderSettings, VoiceOption } from './types';
import {
  CHAPTER_METADATA,
  RAW_CHAPTER_TEXT,
  parseTextIntoParagraphs,
} from './data/defaultChapter';
import { SpeechEngine } from './utils/speechEngine';
import { ambienceEngine } from './utils/ambience';
import { THEME_STYLES } from './utils/themeStyles';
import { Header } from './components/Header';
import { AudioControls } from './components/AudioControls';
import { ReaderView } from './components/ReaderView';
import { GlossaryModal } from './components/GlossaryModal';
import { TextEditorModal } from './components/TextEditorModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [rawText, setRawText] = useState<string>(RAW_CHAPTER_TEXT);
  const [bookTitle, setBookTitle] = useState<string>('Aliança com o Deus Dragão');
  const [isDefaultChapter, setIsDefaultChapter] = useState<boolean>(true);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [maleVoice, setMaleVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [femaleVoice, setFemaleVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals state
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);

  // App settings - configured with medieval lute music and low background volume
  const [settings, setSettings] = useState<ReaderSettings>({
    rate: 1.0,
    pitch: 1.0,
    characterVoices: true,
    fontSize: 17,
    theme: 'parchment',
    fontStyle: 'merriweather',
    autoScroll: true,
    ambience: 'medieval',
    ambienceVolume: 0.18, // Volume baixo e agradável para não ofuscar a leitura
  });

  const speechEngineRef = useRef<SpeechEngine | null>(null);

  // Parse paragraphs whenever raw text changes
  const paragraphs: ParagraphItem[] = useMemo(() => {
    return parseTextIntoParagraphs(rawText);
  }, [rawText]);

  // Total statistics
  const wordCount = useMemo(() => {
    return rawText
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
  }, [rawText]);

  const estimatedMinutes = useMemo(() => {
    // Average speech rate in pt-BR is ~130-150 words per minute
    return Math.max(1, Math.round(wordCount / 140));
  }, [wordCount]);

  // Initialize Speech Engine
  useEffect(() => {
    const engine = new SpeechEngine({
      onParagraphChange: (index) => {
        setCurrentParagraphIndex(index);
      },
      onStateChange: (playing, paused) => {
        setIsPlaying(playing);
        setIsPaused(paused);
      },
      onVoicesLoaded: (loadedVoices, defaultVoice) => {
        setVoices(loadedVoices);
        if (defaultVoice) {
          setSelectedVoice((prev) => prev || defaultVoice);
        }
      },
      onError: (msg) => {
        setErrorMessage(msg);
      },
    });

    speechEngineRef.current = engine;
    engine.setParagraphs(paragraphs);
    engine.setCharacterVoices(settings.characterVoices);
    engine.setRate(settings.rate);
    engine.setPitch(settings.pitch);

    return () => {
      engine.stop();
      ambienceEngine.stop();
    };
  }, []);

  // Update engine when paragraphs change
  useEffect(() => {
    if (speechEngineRef.current) {
      speechEngineRef.current.setParagraphs(paragraphs);
      setCurrentParagraphIndex(0);
    }
  }, [paragraphs]);

  // Update engine properties when settings change
  useEffect(() => {
    if (speechEngineRef.current) {
      speechEngineRef.current.setRate(settings.rate);
      speechEngineRef.current.setPitch(settings.pitch);
      speechEngineRef.current.setCharacterVoices(settings.characterVoices);
    }
  }, [settings.rate, settings.pitch, settings.characterVoices]);

  // Update ambience audio
  useEffect(() => {
    ambienceEngine.setVolume(settings.ambienceVolume);
    ambienceEngine.setAmbience(settings.ambience);
  }, [settings.ambience, settings.ambienceVolume]);

  const handleUpdateSettings = useCallback((newSettings: Partial<ReaderSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const handleSelectVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
    if (speechEngineRef.current) {
      speechEngineRef.current.setVoice(voice);
    }
  }, []);

  const handleTogglePlay = useCallback(() => {
    if (speechEngineRef.current) {
      speechEngineRef.current.togglePlayPause();
    }
  }, []);

  const handleSelectParagraph = useCallback((idx: number) => {
    if (speechEngineRef.current) {
      speechEngineRef.current.playFrom(idx);
    }
  }, []);

  const handleNext = useCallback(() => {
    if (speechEngineRef.current) {
      speechEngineRef.current.nextParagraph();
    }
  }, []);

  const handlePrevious = useCallback(() => {
    if (speechEngineRef.current) {
      speechEngineRef.current.previousParagraph();
    }
  }, []);

  const handleReset = useCallback(() => {
    if (speechEngineRef.current) {
      speechEngineRef.current.playFrom(0);
    }
  }, []);

  const handleSelectMaleVoice = useCallback((voice: SpeechSynthesisVoice | null) => {
    setMaleVoice(voice);
    if (speechEngineRef.current) {
      speechEngineRef.current.setMaleVoice(voice);
    }
  }, []);

  const handleSelectFemaleVoice = useCallback((voice: SpeechSynthesisVoice | null) => {
    setFemaleVoice(voice);
    if (speechEngineRef.current) {
      speechEngineRef.current.setFemaleVoice(voice);
    }
  }, []);

  const handleTestVoice = useCallback(
    (voiceToTest?: SpeechSynthesisVoice | null, testPitch: number = 1.0) => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const v = voiceToTest || selectedVoice;
        const msg =
          testPitch < 0.9
            ? 'Esta é a voz masculina grave para diálogos.'
            : testPitch > 1.1
            ? 'Esta é a voz feminina para as personagens mulheres.'
            : 'Olá! Esta é a voz de narração principal em português.';

        const testUtterance = new SpeechSynthesisUtterance(msg);
        if (v) {
          testUtterance.voice = v;
          testUtterance.lang = v.lang;
        } else {
          testUtterance.lang = 'pt-BR';
        }
        testUtterance.rate = settings.rate;
        testUtterance.pitch = testPitch;
        window.speechSynthesis.speak(testUtterance);
      }
    },
    [selectedVoice, settings.rate],
  );

  // Global Keyboard shortcuts: Space for Play/Pause, Arrows for nav
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if inside a textarea or input
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight' || e.code === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft' || e.code === 'ArrowUp') {
        e.preventDefault();
        handlePrevious();
      } else if (e.code === 'Escape') {
        setIsGlossaryOpen(false);
        setIsSettingsOpen(false);
        setIsEditorOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlay, handleNext, handlePrevious]);

  const currentTheme = THEME_STYLES[settings.theme];
  const currentParagraph = paragraphs[currentParagraphIndex];

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${currentTheme.bg} ${currentTheme.textPrimary}`}
    >
      {/* Top Application Header */}
      <Header
        title={bookTitle}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenEditor={() => setIsEditorOpen(true)}
        totalParagraphs={paragraphs.length}
        wordCount={wordCount}
        estimatedMinutes={estimatedMinutes}
      />

      {/* Main Reading Surface */}
      <ReaderView
        title={bookTitle}
        isDefaultChapter={isDefaultChapter}
        paragraphs={paragraphs}
        currentIndex={currentParagraphIndex}
        isPlaying={isPlaying}
        isPaused={isPaused}
        settings={settings}
        onSelectParagraph={handleSelectParagraph}
        onOpenEditor={() => setIsEditorOpen(true)}
      />

      {/* Sticky Bottom Audio Player Bar */}
      <AudioControls
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        isPlaying={isPlaying}
        isPaused={isPaused}
        currentParagraphIndex={currentParagraphIndex}
        totalParagraphs={paragraphs.length}
        currentParagraph={currentParagraph}
        onTogglePlay={handleTogglePlay}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSeek={handleSelectParagraph}
        onReset={handleReset}
      />

      {/* Lore Glossary Modal */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        settings={settings}
      />

      {/* Text Editor & Paste Modal */}
      <TextEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        settings={settings}
        currentRawText={rawText}
        onApplyNewText={(newText, customTitle) => {
          setRawText(newText);
          if (customTitle) {
            setBookTitle(customTitle);
            setIsDefaultChapter(false);
          } else {
            setBookTitle('Texto Personalizado');
            setIsDefaultChapter(false);
          }
          if (speechEngineRef.current) {
            speechEngineRef.current.stop();
          }
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        voices={voices}
        selectedVoice={selectedVoice}
        maleVoice={maleVoice}
        femaleVoice={femaleVoice}
        onSelectVoice={handleSelectVoice}
        onSelectMaleVoice={handleSelectMaleVoice}
        onSelectFemaleVoice={handleSelectFemaleVoice}
        onTestVoice={handleTestVoice}
      />
    </div>
  );
}
