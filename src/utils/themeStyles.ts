import { FontStyle, ThemeMode } from '../types';

export interface ThemeColors {
  bg: string;
  bgCard: string;
  bgCardHover: string;
  bgActive: string;
  border: string;
  borderActive: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  badgeBg: string;
  headerBg: string;
  controlsBg: string;
}

export const THEME_STYLES: Record<ThemeMode, ThemeColors> = {
  parchment: {
    bg: 'bg-[#18130e]',
    bgCard: 'bg-[#221b14]',
    bgCardHover: 'hover:bg-[#2a221a]',
    bgActive: 'bg-[#332516]',
    border: 'border-[#382b1f]',
    borderActive: 'border-amber-500/70',
    textPrimary: 'text-[#f0e6d6]',
    textSecondary: 'text-[#d4c1a5]',
    textMuted: 'text-[#a58e74]',
    accent: 'text-amber-400',
    accentHover: 'hover:text-amber-300',
    badgeBg: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
    headerBg: 'bg-[#15100c]/90',
    controlsBg: 'bg-[#1e1710]/95',
  },
  dark: {
    bg: 'bg-neutral-950',
    bgCard: 'bg-neutral-900',
    bgCardHover: 'hover:bg-neutral-800/70',
    bgActive: 'bg-neutral-800/90',
    border: 'border-neutral-800',
    borderActive: 'border-rose-500/70',
    textPrimary: 'text-neutral-100',
    textSecondary: 'text-neutral-300',
    textMuted: 'text-neutral-500',
    accent: 'text-rose-400',
    accentHover: 'hover:text-rose-300',
    badgeBg: 'bg-neutral-800 text-neutral-300 border-neutral-700',
    headerBg: 'bg-neutral-950/90',
    controlsBg: 'bg-neutral-900/95',
  },
  sepia: {
    bg: 'bg-[#211c18]',
    bgCard: 'bg-[#2b241e]',
    bgCardHover: 'hover:bg-[#342c25]',
    bgActive: 'bg-[#3d3229]',
    border: 'border-[#42372e]',
    borderActive: 'border-orange-500/70',
    textPrimary: 'text-[#ebdcd0]',
    textSecondary: 'text-[#c7b6a6]',
    textMuted: 'text-[#9c8978]',
    accent: 'text-orange-400',
    accentHover: 'hover:text-orange-300',
    badgeBg: 'bg-orange-950/60 text-orange-300 border-orange-800/60',
    headerBg: 'bg-[#1b1713]/90',
    controlsBg: 'bg-[#26201a]/95',
  },
  light: {
    bg: 'bg-[#fbf9f5]',
    bgCard: 'bg-[#ffffff]',
    bgCardHover: 'hover:bg-[#f6f2ec]',
    bgActive: 'bg-[#f0e8dc]',
    border: 'border-[#e4dcce]',
    borderActive: 'border-amber-600',
    textPrimary: 'text-[#2b2621]',
    textSecondary: 'text-[#5c534b]',
    textMuted: 'text-[#8c8074]',
    accent: 'text-amber-700',
    accentHover: 'hover:text-amber-800',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
    headerBg: 'bg-[#fbf9f5]/90',
    controlsBg: 'bg-[#ffffff]/95',
  },
};

export function getFontClass(font: FontStyle): string {
  switch (font) {
    case 'merriweather':
      return 'font-serif-merriweather';
    case 'lora':
      return 'font-serif-lora';
    case 'outfit':
    default:
      return 'font-sans-outfit';
  }
}
