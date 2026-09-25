import React from 'react';
import { X, BookOpen, Shield, Flame, UserCheck, Scroll, Compass } from 'lucide-react';
import { CHAPTER_METADATA } from '../data/defaultChapter';
import { ReaderSettings } from '../types';
import { THEME_STYLES } from '../utils/themeStyles';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  if (!isOpen) return null;
  const currentTheme = THEME_STYLES[settings.theme];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className={`relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${currentTheme.bgCard} ${currentTheme.border}`}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${currentTheme.border}`}>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Scroll className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-cinzel font-bold text-lg ${currentTheme.textPrimary}`}>
                Glossário & Contexto do Capítulo
              </h3>
              <p className={`text-xs ${currentTheme.textMuted}`}>
                Mushoku Tensei · Conexões e Personagens do Diálogo
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

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Context Summary */}
          <div className={`p-4 rounded-xl border ${currentTheme.bgActive} ${currentTheme.border}`}>
            <h4 className="text-xs uppercase tracking-wider font-bold text-amber-400 font-cinzel mb-1 flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              O Que Está Acontecendo Nesta Cena?
            </h4>
            <p className={`text-xs sm:text-sm ${currentTheme.textSecondary} leading-relaxed`}>
              Após a terrível batalha nas montanhas e o futuro desesperador revelado pelo diário do
              Rudeus do Futuro, Rudeus concordou em se tornar o subordinado de <strong>Orsted (O Deus Dragão)</strong>.
              Nesta cabana secreta, eles traçam o plano mestre: destronar o Primeiro Príncipe Grabel
              e seu cruel conspirador, o <strong>Alto-Ministro Darius</strong>, coroando a <strong>Princesa Ariel</strong> com o apoio de <strong>Perugius Dola</strong>.
            </p>
          </div>

          {/* Characters List */}
          <div className="space-y-3">
            <h4 className={`text-xs uppercase tracking-wider font-semibold font-cinzel ${currentTheme.textMuted}`}>
              Figuras Mencionadas no Texto
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CHAPTER_METADATA.characters.map((char) => (
                <div
                  key={char.name}
                  className={`p-3 rounded-lg border transition-all ${currentTheme.bgCard} ${currentTheme.border} hover:border-amber-500/40`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <h5 className={`font-semibold text-sm ${currentTheme.textPrimary}`}>
                      {char.name}
                    </h5>
                  </div>
                  <span className="text-[11px] text-amber-500/90 font-medium block mb-1">
                    {char.role}
                  </span>
                  <p className={`text-xs ${currentTheme.textSecondary} leading-relaxed`}>
                    {char.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Lore Artifacts */}
          <div className="border-t border-white/5 pt-4 space-y-3">
            <h4 className={`text-xs uppercase tracking-wider font-semibold font-cinzel ${currentTheme.textMuted}`}>
              Artefatos e Elementos da Reunião
            </h4>
            <div className="space-y-2 text-xs leading-relaxed">
              <div className={`p-3 rounded-lg border ${currentTheme.bgCard} ${currentTheme.border}`}>
                <strong className={currentTheme.textPrimary}>Círculo de Invocação da Besta Guardiã:</strong>
                <p className={`${currentTheme.textSecondary} mt-0.5`}>
                  Pergaminho entregue por Orsted que reage à enorme mana de Rudeus para invocar Leo, o cão sagrado que protegerá a casa Greyrat contra as maquinações do Hitogami.
                </p>
              </div>
              <div className={`p-3 rounded-lg border ${currentTheme.bgCard} ${currentTheme.border}`}>
                <strong className={currentTheme.textPrimary}>O Anel de Nanahoshi:</strong>
                <p className={`${currentTheme.textSecondary} mt-0.5`}>
                  Artefato de par magnético entregue por Orsted a Rudeus como canal de emergência para convocação mútua no Reino Asura.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t flex justify-end ${currentTheme.border}`}>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors"
          >
            Entendido, Voltar à Leitura
          </button>
        </div>
      </div>
    </div>
  );
};
