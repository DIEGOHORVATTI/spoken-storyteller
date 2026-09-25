import React, { useEffect, useRef } from 'react';
import { Play, Volume2, Sparkles } from 'lucide-react';
import { ParagraphItem, ReaderSettings } from '../types';
import { getFontClass, THEME_STYLES } from '../utils/themeStyles';

interface ReaderViewProps {
  title?: string;
  isDefaultChapter: boolean;
  paragraphs: ParagraphItem[];
  currentIndex: number;
  isPlaying: boolean;
  isPaused: boolean;
  settings: ReaderSettings;
  onSelectParagraph: (index: number) => void;
  onOpenEditor: () => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  title,
  isDefaultChapter,
  paragraphs,
  currentIndex,
  isPlaying,
  isPaused,
  settings,
  onSelectParagraph,
  onOpenEditor,
}) => {
  const currentTheme = THEME_STYLES[settings.theme];
  const activeParagraphRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to active reading paragraph
  useEffect(() => {
    if (settings.autoScroll && activeParagraphRef.current && isPlaying) {
      activeParagraphRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentIndex, isPlaying, settings.autoScroll]);

  const fontClass = getFontClass(settings.fontStyle);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-36">
      {/* Chapter header intro banner */}
      <div className={`p-6 rounded-xl border mb-8 transition-colors ${currentTheme.bgCard} ${currentTheme.border}`}>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-amber-500 font-cinzel">
              {isDefaultChapter ? 'Mushoku Tensei: Isekai Ittara Honki Dasu' : 'Texto Personalizado'}
            </span>
            <span className="text-neutral-500 text-xs">·</span>
            <span className="text-xs text-neutral-400">
              {isDefaultChapter ? 'Volume 15' : `${paragraphs.length} parágrafos`}
            </span>
          </div>

          <button
            onClick={onOpenEditor}
            className={`text-xs px-2.5 py-1 rounded-md border font-medium ${currentTheme.bgCard} ${currentTheme.border} ${currentTheme.textSecondary} hover:${currentTheme.textPrimary} transition-colors`}
          >
            Trocar Texto
          </button>
        </div>
        <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight mb-2 font-cinzel ${currentTheme.textPrimary}`}>
          {title || (isDefaultChapter ? 'Aliança com o Deus Dragão: O Destino de Asura' : 'Obra em Leitura')}
        </h2>
        <p className={`text-sm ${currentTheme.textSecondary} leading-relaxed max-w-2xl`}>
          {isDefaultChapter
            ? 'Após a batalha contra Orsted e o pacto de subordinação para salvar sua família, Rudeus Greyrat recebe orientações estratégicas detalhadas sobre a corte do Reino Asura, o Alto-Ministro Darius, a princesa Ariel e as Bestas Guardiãs.'
            : 'Texto carregado no Leitor de Crônicas com segmentação inteligente de parágrafos, detecção de diálogos e narração em voz alta.'}
        </p>

        {/* Quick legend for character voices */}
        {settings.characterVoices && (
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-white/5 text-xs">
            <span className="text-neutral-400 font-medium">Vozes & Sexos ativos:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className={currentTheme.textSecondary}>Feminina (Mulher)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span className={currentTheme.textSecondary}>Masculina (Grave / Homem)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className={currentTheme.textSecondary}>Masculina (Jovem / 1ª Pessoa)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
              <span className={currentTheme.textSecondary}>Narração</span>
            </div>
          </div>
        )}
      </div>

      {/* Paragraphs stream */}
      <div className="space-y-4">
        {paragraphs.map((item, idx) => {
          const isActive = idx === currentIndex;
          const isDialogue = item.text.startsWith('—') || item.text.startsWith('-');

          let speakerBorderClass = 'border-transparent';
          if (settings.characterVoices && isDialogue) {
            if (item.speakerGender === 'female' || item.speaker === 'female') {
              speakerBorderClass = 'border-l-rose-500';
            } else if (item.speaker === 'orsted' || item.speaker === 'male_deep') {
              speakerBorderClass = 'border-l-sky-600';
            } else if (item.speaker === 'rudeus' || item.speaker === 'male_young') {
              speakerBorderClass = 'border-l-amber-500';
            } else {
              speakerBorderClass = 'border-l-sky-700/80';
            }
          }

          return (
            <div
              key={item.id}
              ref={isActive ? activeParagraphRef : null}
              onClick={() => onSelectParagraph(idx)}
              className={`group relative p-3 sm:p-4 rounded-xl border border-l-4 transition-all duration-200 cursor-pointer ${speakerBorderClass} ${
                isActive
                  ? `${currentTheme.bgActive} border-y-amber-500/50 border-r-amber-500/50 shadow-lg ring-1 ring-amber-500/20`
                  : `${currentTheme.bgCard} ${currentTheme.border} ${currentTheme.bgCardHover}`
              }`}
            >
              {/* Top metadata row for dialogue or active paragraph */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  {/* Subtle speaker tag when multi-voice is enabled */}
                  {settings.characterVoices && isDialogue && (
                    <span
                      className={`text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded ${
                        item.speakerGender === 'female' || item.speaker === 'female'
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                          : item.speaker === 'orsted' || item.speaker === 'male_deep'
                          ? 'bg-sky-950/60 text-sky-300 border border-sky-800/40'
                          : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                      }`}
                    >
                      {item.speakerLabel}
                    </span>
                  )}

                  {/* Paragraph number indicator */}
                  <span className={`text-[10px] font-mono ${currentTheme.textMuted}`}>
                    §{idx + 1}
                  </span>
                </div>

                {/* Status or Play-from-here trigger */}
                <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                  {isActive && isPlaying && !isPaused ? (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-amber-400">
                      <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                      <span className="hidden sm:inline">Lendo</span>
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectParagraph(idx);
                      }}
                      className={`text-[11px] flex items-center gap-1 px-2 py-0.5 rounded ${currentTheme.bgCard} ${currentTheme.textMuted} hover:${currentTheme.textPrimary}`}
                      title="Ouvir a partir deste parágrafo"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span className="hidden sm:inline">Ler daqui</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Main paragraph text */}
              <p
                style={{ fontSize: `${settings.fontSize}px` }}
                className={`leading-relaxed tracking-normal transition-all ${fontClass} ${
                  isActive
                    ? `${currentTheme.textPrimary} font-medium`
                    : currentTheme.textSecondary
                } ${isDialogue ? 'pl-1 font-serif' : ''}`}
              >
                {item.text}
              </p>
            </div>
          );
        })}
      </div>
    </main>
  );
};
