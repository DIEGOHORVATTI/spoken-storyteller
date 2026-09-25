import React from 'react';
import {
  X,
  Volume2,
  Type,
  Palette,
  Play,
  Flame,
  CloudRain,
  Sparkles,
  Sliders,
  Check,
  Music,
  User,
  Users,
} from 'lucide-react';
import { FontStyle, ReaderSettings, ThemeMode, VoiceOption } from '../types';
import { THEME_STYLES } from '../utils/themeStyles';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  onUpdateSettings: (newSettings: Partial<ReaderSettings>) => void;
  voices: VoiceOption[];
  selectedVoice: SpeechSynthesisVoice | null;
  maleVoice: SpeechSynthesisVoice | null;
  femaleVoice: SpeechSynthesisVoice | null;
  onSelectVoice: (voice: SpeechSynthesisVoice) => void;
  onSelectMaleVoice: (voice: SpeechSynthesisVoice | null) => void;
  onSelectFemaleVoice: (voice: SpeechSynthesisVoice | null) => void;
  onTestVoice: (voice?: SpeechSynthesisVoice | null, testPitch?: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  voices,
  selectedVoice,
  maleVoice,
  femaleVoice,
  onSelectVoice,
  onSelectMaleVoice,
  onSelectFemaleVoice,
  onTestVoice,
}) => {
  if (!isOpen) return null;
  const currentTheme = THEME_STYLES[settings.theme];

  const themes: { id: ThemeMode; label: string; desc: string }[] = [
    { id: 'parchment', label: 'Pergaminho de Asura', desc: 'Tom âmbar antigo e acolhedor' },
    { id: 'dark', label: 'Cabana Noturna', desc: 'Preto obsidiana com detalhes sutis' },
    { id: 'sepia', label: 'Sépia Clássico', desc: 'Folhas de biblioteca' },
    { id: 'light', label: 'Papel Impresso', desc: 'Fundo claro com alta legibilidade' },
  ];

  const fontOptions: { id: FontStyle; label: string; family: string }[] = [
    { id: 'merriweather', label: 'Merriweather', family: 'Serif Clássico para Livros' },
    { id: 'lora', label: 'Lora', family: 'Serif Elegante & Literário' },
    { id: 'outfit', label: 'Outfit', family: 'Sans Moderno & Limpo' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className={`relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${currentTheme.bgCard} ${currentTheme.border}`}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${currentTheme.border}`}>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-cinzel font-bold text-lg ${currentTheme.textPrimary}`}>
                Configurações de Leitura & Áudio
              </h3>
              <p className={`text-xs ${currentTheme.textMuted}`}>
                Personalize sintetizador de voz, ambiência e estilo visual
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg text-neutral-400 hover:${currentTheme.textPrimary} hover:${currentTheme.bgActive} transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Settings Form */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Voice Selector Section */}
          <div className="space-y-4">
            {/* Primary Voice (Narrator) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className={`text-xs uppercase tracking-wider font-semibold font-cinzel ${currentTheme.textPrimary} flex items-center gap-1.5`}>
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  Voz Principal / Narração
                </label>
                <button
                  onClick={() => onTestVoice(selectedVoice, 1.0)}
                  className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Ouvir Teste</span>
                </button>
              </div>

              <div className="relative">
                <select
                  value={selectedVoice?.name || ''}
                  onChange={(e) => {
                    const target = voices.find((v) => v.voice.name === e.target.value);
                    if (target) onSelectVoice(target.voice);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-500 ${currentTheme.bgActive} ${currentTheme.border} ${currentTheme.textPrimary}`}
                >
                  {voices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.isPortuguese ? '🇧🇷/🇵🇹 ' : '🌐 '} {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Gender Pair: Male Voice & Female Voice for Dialogue */}
            {settings.characterVoices && (
              <div className={`p-4 rounded-xl border space-y-3.5 ${currentTheme.bgActive} ${currentTheme.border}`}>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    Atribuição por Sexo (Homem & Mulher)
                  </h4>
                  <span className="text-[10px] text-neutral-400">Alterna timbres por personagem</span>
                </div>

                {/* Male Voice Picker */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium flex items-center gap-1 ${currentTheme.textSecondary}`}>
                      <User className="w-3 h-3 text-sky-400" /> Voz Masculina (Personagens Homens)
                    </span>
                    <button
                      onClick={() => onTestVoice(maleVoice || selectedVoice, 0.75)}
                      className="text-[11px] text-sky-400 hover:underline flex items-center gap-0.5"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" /> Testar Homem
                    </button>
                  </div>
                  <select
                    value={maleVoice?.name || selectedVoice?.name || ''}
                    onChange={(e) => {
                      const target = voices.find((v) => v.voice.name === e.target.value);
                      onSelectMaleVoice(target ? target.voice : null);
                    }}
                    className={`w-full p-2 rounded-lg border text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-sky-500 ${currentTheme.bgCard} ${currentTheme.border} ${currentTheme.textPrimary}`}
                  >
                    {voices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.isPortuguese ? '🇧🇷 ' : ''}{v.name} {v.genderEstimate === 'male' ? '(Masculina recomendada)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Female Voice Picker */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium flex items-center gap-1 ${currentTheme.textSecondary}`}>
                      <User className="w-3 h-3 text-rose-400" /> Voz Feminina (Personagens Mulheres)
                    </span>
                    <button
                      onClick={() => onTestVoice(femaleVoice || selectedVoice, 1.25)}
                      className="text-[11px] text-rose-400 hover:underline flex items-center gap-0.5"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" /> Testar Mulher
                    </button>
                  </div>
                  <select
                    value={femaleVoice?.name || selectedVoice?.name || ''}
                    onChange={(e) => {
                      const target = voices.find((v) => v.voice.name === e.target.value);
                      onSelectFemaleVoice(target ? target.voice : null);
                    }}
                    className={`w-full p-2 rounded-lg border text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-rose-500 ${currentTheme.bgCard} ${currentTheme.border} ${currentTheme.textPrimary}`}
                  >
                    {voices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.isPortuguese ? '🇧🇷 ' : ''}{v.name} {v.genderEstimate === 'female' ? '(Feminina recomendada)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Voice Modulation: Speed & Pitch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className={currentTheme.textSecondary}>Velocidade de Leitura</span>
                <span className="font-mono text-amber-400 font-semibold">{settings.rate}x</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="2.0"
                step="0.1"
                value={settings.rate}
                onChange={(e) => onUpdateSettings({ rate: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className={currentTheme.textSecondary}>Tom da Voz (Pitch)</span>
                <span className="font-mono text-amber-400 font-semibold">{settings.pitch}x</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.5"
                step="0.05"
                value={settings.pitch}
                onChange={(e) => onUpdateSettings({ pitch: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Character Voices Dramatization Toggle */}
          <div
            onClick={() => onUpdateSettings({ characterVoices: !settings.characterVoices })}
            className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
              settings.characterVoices
                ? `${currentTheme.bgActive} border-amber-500/50`
                : `${currentTheme.bgCard} ${currentTheme.border}`
            }`}
          >
            <div>
              <h4 className={`text-xs font-semibold ${currentTheme.textPrimary}`}>
                Dramatização de Personagens (Multi-Vozes)
              </h4>
              <p className={`text-[11px] ${currentTheme.textMuted} mt-0.5`}>
                Altera o tom automaticamente: Orsted fala mais grave e pausado; diálogos de Rudeus mais ágeis.
              </p>
            </div>
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                settings.characterVoices
                  ? 'bg-amber-500 border-amber-500 text-neutral-950'
                  : 'border-neutral-600'
              }`}
            >
              {settings.characterVoices && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          {/* Ambient Soundscapes */}
          <div className="space-y-3">
            <label className={`text-xs uppercase tracking-wider font-semibold font-cinzel ${currentTheme.textPrimary}`}>
              Som Ambiente (Sintetizado Web Audio)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'none', label: 'Desativado', icon: null },
                { id: 'medieval', label: 'Lira Medieval', icon: <Music className="w-3.5 h-3.5 text-amber-400" /> },
                { id: 'fire', label: 'Lareira', icon: <Flame className="w-3.5 h-3.5 text-amber-500" /> },
                { id: 'rain', label: 'Chuva', icon: <CloudRain className="w-3.5 h-3.5 text-sky-400" /> },
                { id: 'magic', label: 'Mana', icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onUpdateSettings({ ambience: item.id as any })}
                  className={`p-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                    settings.ambience === item.id
                      ? `${currentTheme.bgActive} ${currentTheme.borderActive} text-amber-400 ring-1 ring-amber-500/30`
                      : `${currentTheme.bgCard} ${currentTheme.border} ${currentTheme.textSecondary} hover:${currentTheme.textPrimary}`
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {settings.ambience !== 'none' && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs">
                  <span className={currentTheme.textSecondary}>Volume do Ambiente</span>
                  <span className="font-mono text-amber-400 font-semibold">
                    {Math.round(settings.ambienceVolume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.05"
                  value={settings.ambienceVolume}
                  onChange={(e) => onUpdateSettings({ ambienceVolume: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Typography & Themes */}
          <div className="space-y-3">
            <label className={`text-xs uppercase tracking-wider font-semibold font-cinzel ${currentTheme.textPrimary}`}>
              Tipografia & Visual
            </label>

            {/* Font choice */}
            <div className="grid grid-cols-3 gap-2">
              {fontOptions.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onUpdateSettings({ fontStyle: f.id })}
                  className={`p-2 rounded-xl border text-xs text-center transition-all ${
                    settings.fontStyle === f.id
                      ? `${currentTheme.bgActive} border-amber-500 text-amber-400`
                      : `${currentTheme.bgCard} ${currentTheme.border} ${currentTheme.textSecondary}`
                  }`}
                >
                  <span className="font-semibold block">{f.label}</span>
                </button>
              ))}
            </div>

            {/* Font size slider */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs">
                <span className={currentTheme.textSecondary}>Tamanho da Fonte</span>
                <span className="font-mono text-amber-400 font-semibold">{settings.fontSize}px</span>
              </div>
              <input
                type="range"
                min="14"
                max="26"
                step="1"
                value={settings.fontSize}
                onChange={(e) => onUpdateSettings({ fontSize: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Theme options */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onUpdateSettings({ theme: t.id })}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    settings.theme === t.id
                      ? `${currentTheme.bgActive} border-amber-500 ring-1 ring-amber-500/30`
                      : `${currentTheme.bgCard} ${currentTheme.border} hover:border-neutral-600`
                  }`}
                >
                  <span className={`font-semibold block ${currentTheme.textPrimary}`}>{t.label}</span>
                  <span className={`text-[10px] ${currentTheme.textMuted}`}>{t.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-3.5 border-t flex justify-end ${currentTheme.border}`}>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors"
          >
            Concluído
          </button>
        </div>
      </div>
    </div>
  );
};
