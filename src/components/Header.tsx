import React from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Sparkles,
  Users,
  Settings,
  Edit3,
  Moon,
  Flame,
  CloudRain,
  Sun,
  ScrollText,
  Music,
} from 'lucide-react';
import { AmbienceType, FontStyle, ReaderSettings, ThemeMode } from '../types';
import { THEME_STYLES } from '../utils/themeStyles';

interface HeaderProps {
  title?: string;
  settings: ReaderSettings;
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void;
  onOpenGlossary: () => void;
  onOpenSettings: () => void;
  onOpenEditor: () => void;
  totalParagraphs: number;
  wordCount: number;
  estimatedMinutes: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  settings,
  onUpdateSettings,
  onOpenGlossary,
  onOpenSettings,
  onOpenEditor,
  totalParagraphs,
  wordCount,
  estimatedMinutes,
}) => {
  const currentTheme = THEME_STYLES[settings.theme];

  const cycleTheme = () => {
    const order: ThemeMode[] = ['parchment', 'dark', 'sepia', 'light'];
    const nextIdx = (order.indexOf(settings.theme) + 1) % order.length;
    onUpdateSettings({ theme: order[nextIdx] });
  };

  const cycleAmbience = () => {
    const list: AmbienceType[] = ['none', 'medieval', 'fire', 'rain', 'magic'];
    const next = (list.indexOf(settings.ambience) + 1) % list.length;
    onUpdateSettings({ ambience: list[next] });
  };

  const getAmbienceIcon = () => {
    switch (settings.ambience) {
      case 'medieval':
        return <Music className="w-4 h-4 text-amber-400 animate-pulse" />;
      case 'fire':
        return <Flame className="w-4 h-4 text-amber-500 animate-pulse" />;
      case 'rain':
        return <CloudRain className="w-4 h-4 text-sky-400 animate-pulse" />;
      case 'magic':
        return <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />;
      case 'none':
      default:
        return <VolumeX className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getAmbienceLabel = () => {
    switch (settings.ambience) {
      case 'medieval':
        return 'Música Medieval';
      case 'fire':
        return 'Lareira';
      case 'rain':
        return 'Chuva';
      case 'magic':
        return 'Mana';
      default:
        return 'Ambiente';
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors duration-200 ${currentTheme.headerBg} ${currentTheme.border}`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left: Title & unboxed metadata */}
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-lg border ${currentTheme.bgCard} ${currentTheme.border} shrink-0 mt-0.5`}
          >
            <BookOpen className={`w-5 h-5 ${currentTheme.accent}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`font-cinzel text-lg sm:text-xl font-bold tracking-tight truncate max-w-sm sm:max-w-md ${currentTheme.textPrimary}`}>
                {title || 'Aliança com o Deus Dragão'}
              </h1>
            </div>
            {/* Clean unboxed metadata with typographic separators */}
            <div className={`flex flex-wrap items-center gap-1.5 text-xs ${currentTheme.textMuted} mt-0.5`}>
              <span>Mushoku Tensei · Vol. 15</span>
              <span aria-hidden="true">·</span>
              <span>{totalParagraphs} parágrafos</span>
              <span aria-hidden="true">·</span>
              <span>~{wordCount} palavras</span>
              <span aria-hidden="true">·</span>
              <span>{estimatedMinutes} min de leitura em áudio</span>
            </div>
          </div>
        </div>

        {/* Right: Quick action toolbar */}
        <div className="flex items-center flex-wrap gap-1.5 self-end md:self-center">
          {/* Multi-voice character toggle button */}
          <button
            onClick={() => onUpdateSettings({ characterVoices: !settings.characterVoices })}
            title={
              settings.characterVoices
                ? 'Dramatização de Personagens e Sexos Ativa (Homem / Mulher / Narrador)'
                : 'Modo Voz Única (Narrador Padrão)'
            }
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              settings.characterVoices
                ? `${currentTheme.badgeBg} ring-1 ring-amber-500/30`
                : `${currentTheme.bgCard} ${currentTheme.border} ${currentTheme.textSecondary}`
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vozes:</span>
            <span>{settings.characterVoices ? 'Homem & Mulher' : 'Única'}</span>
          </button>

          {/* Ambience cycler */}
          <button
            onClick={cycleAmbience}
            title={`Som ambiente: ${getAmbienceLabel()} (clique para alternar: Lareira, Chuva, Mana ou Desligado)`}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              settings.ambience !== 'none'
                ? `${currentTheme.bgActive} ${currentTheme.borderActive} ${currentTheme.textPrimary}`
                : `${currentTheme.bgCard} ${currentTheme.border} ${currentTheme.textSecondary}`
            }`}
          >
            {getAmbienceIcon()}
            <span>{getAmbienceLabel()}</span>
          </button>

          {/* Lore Glossary button */}
          <button
            onClick={onOpenGlossary}
            title="Ver Personagens e Contexto do Capítulo"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border ${currentTheme.bgCard} ${currentTheme.border} ${currentTheme.textSecondary} hover:${currentTheme.textPrimary} transition-colors`}
          >
            <ScrollText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Personagens</span>
          </button>

          {/* Custom text editor / paste button */}
          <button
            onClick={onOpenEditor}
            title="Editar ou colar outro texto para leitura"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border ${currentTheme.bgCard} ${currentTheme.border} ${currentTheme.textSecondary} hover:${currentTheme.textPrimary} transition-colors`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Trocar Texto</span>
          </button>

          {/* Theme cycler button */}
          <button
            onClick={cycleTheme}
            title={`Tema: ${settings.theme} (clique para alternar)`}
            className={`p-1.5 rounded-md border ${currentTheme.bgCard} ${currentTheme.border} ${currentTheme.textSecondary} hover:${currentTheme.textPrimary} transition-colors`}
          >
            {settings.theme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-600" />
            ) : settings.theme === 'parchment' ? (
              <Flame className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-rose-400" />
            )}
          </button>

          {/* Settings modal button */}
          <button
            onClick={onOpenSettings}
            title="Configurações de Áudio, Voz e Tipografia"
            className={`p-1.5 rounded-md border ${currentTheme.bgCard} ${currentTheme.border} ${currentTheme.textSecondary} hover:${currentTheme.textPrimary} transition-colors`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
