import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  Gauge,
  Sparkles,
  Music,
} from 'lucide-react';
import { ParagraphItem, ReaderSettings } from '../types';
import { THEME_STYLES } from '../utils/themeStyles';

interface AudioControlsProps {
  settings: ReaderSettings;
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void;
  isPlaying: boolean;
  isPaused: boolean;
  currentParagraphIndex: number;
  totalParagraphs: number;
  currentParagraph: ParagraphItem | undefined;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (index: number) => void;
  onReset: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  settings,
  onUpdateSettings,
  isPlaying,
  isPaused,
  currentParagraphIndex,
  totalParagraphs,
  currentParagraph,
  onTogglePlay,
  onNext,
  onPrevious,
  onSeek,
  onReset,
}) => {
  const currentTheme = THEME_STYLES[settings.theme];
  const progressPercent =
    totalParagraphs > 0 ? ((currentParagraphIndex + 1) / totalParagraphs) * 100 : 0;

  const speedOptions = [0.8, 1.0, 1.25, 1.5, 1.75];

  const getSpeakerBadge = () => {
    if (!currentParagraph) return null;

    if (currentParagraph.speakerGender === 'female' || currentParagraph.speaker === 'female') {
      return (
        <span className="text-[11px] font-semibold tracking-wide text-rose-300 bg-rose-950/70 border border-rose-800/60 px-2 py-0.5 rounded">
          {currentParagraph.speakerLabel || 'Voz Feminina'}
        </span>
      );
    }
    if (currentParagraph.speaker === 'orsted' || currentParagraph.speaker === 'male_deep') {
      return (
        <span className="text-[11px] font-semibold tracking-wide text-sky-300 bg-sky-950/70 border border-sky-800/60 px-2 py-0.5 rounded">
          {currentParagraph.speakerLabel || 'Orsted (Grave)'}
        </span>
      );
    }
    if (currentParagraph.speaker === 'rudeus' || currentParagraph.speaker === 'male_young') {
      return (
        <span className="text-[11px] font-semibold tracking-wide text-amber-300 bg-amber-950/70 border border-amber-800/60 px-2 py-0.5 rounded">
          {currentParagraph.speakerLabel || 'Rudeus Greyrat'}
        </span>
      );
    }
    return (
      <span className="text-[11px] font-medium tracking-wide text-neutral-400 bg-neutral-900/70 border border-neutral-800 px-2 py-0.5 rounded">
        Narração / Diário
      </span>
    );
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-md shadow-2xl transition-colors duration-200 ${currentTheme.controlsBg} ${currentTheme.border}`}
    >
      {/* Visual progress bar at top border */}
      <div className="w-full bg-neutral-800/40 h-1 cursor-pointer relative group" onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickRatio = (e.clientX - rect.left) / rect.width;
        const targetIdx = Math.floor(clickRatio * totalParagraphs);
        onSeek(Math.max(0, Math.min(targetIdx, totalParagraphs - 1)));
      }}>
        <div
          className="h-full bg-amber-500 transition-all duration-300 relative"
          style={{ width: `${progressPercent}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-amber-300 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Left: Speaker state & text excerpt snippet */}
          <div className="hidden sm:flex items-center gap-2.5 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 shrink-0">
              {isPlaying && !isPaused ? (
                <div className="flex items-end gap-0.5 h-4 w-4 pb-0.5" title="Reproduzindo áudio">
                  <span className="w-1 bg-amber-400 rounded-full animate-pulse h-2" />
                  <span className="w-1 bg-amber-400 rounded-full animate-pulse h-4 delay-75" />
                  <span className="w-1 bg-amber-400 rounded-full animate-pulse h-3 delay-150" />
                </div>
              ) : (
                <Volume2 className={`w-4 h-4 ${currentTheme.textMuted}`} />
              )}
              {getSpeakerBadge()}
            </div>

            <p className={`text-xs truncate ${currentTheme.textSecondary} italic max-w-sm`}>
              {currentParagraph ? `"${currentParagraph.text.slice(0, 75)}..."` : 'Pronto para ler'}
            </p>
          </div>

          {/* Center: Playback Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Reset to beginning */}
            <button
              onClick={onReset}
              title="Voltar ao início do texto"
              className={`p-2 rounded-lg text-neutral-400 hover:${currentTheme.textPrimary} hover:${currentTheme.bgCard} transition-colors`}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Previous paragraph */}
            <button
              onClick={onPrevious}
              disabled={currentParagraphIndex <= 0}
              title="Parágrafo anterior"
              className={`p-2 rounded-lg ${currentTheme.textSecondary} hover:${currentTheme.textPrimary} hover:${currentTheme.bgCard} disabled:opacity-30 disabled:pointer-events-none transition-colors`}
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={onTogglePlay}
              title={isPlaying && !isPaused ? 'Pausar (Espaço)' : 'Ouvir Narração (Espaço)'}
              className={`px-5 py-2 rounded-lg font-medium text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 ${
                isPlaying && !isPaused
                  ? 'bg-amber-600 hover:bg-amber-500 text-neutral-950 font-semibold shadow-amber-600/30'
                  : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold shadow-amber-500/30'
              }`}
            >
              {isPlaying && !isPaused ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current translate-x-0.5" />
                  <span>{isPaused ? 'Continuar' : 'Ouvir Agora'}</span>
                </>
              )}
            </button>

            {/* Next paragraph */}
            <button
              onClick={onNext}
              disabled={currentParagraphIndex >= totalParagraphs - 1}
              title="Próximo parágrafo"
              className={`p-2 rounded-lg ${currentTheme.textSecondary} hover:${currentTheme.textPrimary} hover:${currentTheme.bgCard} disabled:opacity-30 disabled:pointer-events-none transition-colors`}
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Paragraph count tracker */}
            <span className={`text-xs font-mono px-2 py-1 rounded ${currentTheme.bgCard} ${currentTheme.border} ${currentTheme.textMuted}`}>
              {currentParagraphIndex + 1}/{totalParagraphs}
            </span>
          </div>

          {/* Right: Ambience quick control & Speed pills */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Quick medieval music / background sound toggle */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/20 border border-white/5 text-xs">
              <button
                onClick={() =>
                  onUpdateSettings({
                    ambience: settings.ambience === 'medieval' ? 'none' : 'medieval',
                  })
                }
                title={
                  settings.ambience === 'medieval'
                    ? 'Música Medieval Ativa (Clique para mutar fundo)'
                    : 'Ativar Música Medieval de Fundo'
                }
                className={`flex items-center gap-1 transition-colors ${
                  settings.ambience === 'medieval'
                    ? 'text-amber-400 font-semibold'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px]">
                  {settings.ambience === 'medieval' ? 'Lira' : 'Música'}
                </span>
              </button>

              {settings.ambience !== 'none' && (
                <input
                  type="range"
                  min="0.03"
                  max="0.45"
                  step="0.02"
                  value={settings.ambienceVolume}
                  onChange={(e) => onUpdateSettings({ ambienceVolume: parseFloat(e.target.value) })}
                  title={`Volume do som ambiente: ${Math.round(settings.ambienceVolume * 100)}%`}
                  className="w-14 h-1 accent-amber-500 cursor-pointer hidden sm:block"
                />
              )}
            </div>

            {/* Speed selector */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-black/20 border border-white/5">
              {speedOptions.map((speed) => (
                <button
                  key={speed}
                  onClick={() => onUpdateSettings({ rate: speed })}
                  className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                    settings.rate === speed
                      ? 'bg-amber-500/20 text-amber-300 font-semibold'
                      : `${currentTheme.textMuted} hover:${currentTheme.textPrimary}`
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            <span className="hidden xl:inline text-[10px] text-neutral-500">
              Espaço = Play
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
