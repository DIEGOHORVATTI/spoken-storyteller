import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Check, FileText, Clipboard, Trash2, BookMarked, Sparkles } from 'lucide-react';
import { RAW_CHAPTER_TEXT } from '../data/defaultChapter';
import { ReaderSettings } from '../types';
import { THEME_STYLES } from '../utils/themeStyles';

interface TextEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  currentRawText: string;
  onApplyNewText: (newText: string, customTitle?: string) => void;
}

export const TextEditorModal: React.FC<TextEditorModalProps> = ({
  isOpen,
  onClose,
  settings,
  currentRawText,
  onApplyNewText,
}) => {
  const [draftText, setDraftText] = useState(currentRawText);
  const [customTitle, setCustomTitle] = useState('');

  // Keep draft in sync when opening modal
  useEffect(() => {
    if (isOpen) {
      setDraftText(currentRawText);
    }
  }, [isOpen, currentRawText]);

  if (!isOpen) return null;

  const currentTheme = THEME_STYLES[settings.theme];

  const wordCount = draftText
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  const paragraphCount = draftText
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0).length;

  const handleApply = () => {
    if (draftText.trim().length === 0) return;
    onApplyNewText(draftText, customTitle.trim() || undefined);
    onClose();
  };

  const handleRestoreDefault = () => {
    setDraftText(RAW_CHAPTER_TEXT);
    setCustomTitle('Mushoku Tensei · Aliança com o Deus Dragão');
  };

  const handleClear = () => {
    setDraftText('');
    setCustomTitle('');
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setDraftText(text);
      }
    } catch {
      // Clipboard access might require focus or permission
    }
  };

  const handleLoadSample = (type: 'fantasy' | 'adventure') => {
    if (type === 'fantasy') {
      setCustomTitle('O Chamado das Runas Antigas');
      setDraftText(`A tempestade rugia além dos muros da cidadela de pedra. O velho alquimista abriu o pergaminho sobre a mesa de carvalho, as mãos trêmulas de antecipação.

— Você tem certeza de que este encantamento é seguro? — sussurrou a jovem aprendiz, segurando a lâmpada a óleo contra a ventania.

— Segurança é um luxo para os fracos de coração — respondeu o mestre com a voz firme e ressonante. — Se as lendas do Primeiro Império estiverem corretas, a porta do santuário responderá apenas ao portador da centelha sagrada.

— Mas mestre, e se as bestas da floresta despertarem com a emanação de mana?

— Então desembainharemos nossas lâminas. Não recue agora, criança. Pronuncie as palavras junto comigo.`);
    } else {
      setCustomTitle('A Taverna do Javali Dourado');
      setDraftText(`O aroma de carne assada com cerveja de malte preenchia a taverna movimentada na encruzilhada do reino.

— Mais uma caneca do melhor vinho élfico, taberneiro! — pediu o cavaleiro de capa verde, jogando duas moedas de prata no balcão de madeira polida.

— Apenas se tiver notícias da estrada do norte — respondeu o robusto taverneiro, enxugando uma taça com um pano de linho. — Dizem que dragões foram avistados no vale das névoas.

— Não eram dragões, meu caro amigo — sorriu o forasteiro misterioso no canto sombrio. — Era apenas a comitiva da Ordem Imperial em marcha triunfal.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div
        className={`relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${currentTheme.bgCard} ${currentTheme.border}`}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${currentTheme.border}`}>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-cinzel font-bold text-lg ${currentTheme.textPrimary}`}>
                Inserir ou Colar Texto Inteiro
              </h3>
              <p className={`text-xs ${currentTheme.textMuted}`}>
                Cole qualquer light novel, capítulo de livro ou conto para ler e ouvir imediatamente.
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

        {/* Action quick toolbar */}
        <div className={`px-6 py-2.5 border-b flex flex-wrap items-center justify-between gap-2 text-xs bg-black/10 ${currentTheme.border}`}>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePasteFromClipboard}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${currentTheme.bgCard} ${currentTheme.border} ${currentTheme.textSecondary} hover:${currentTheme.textPrimary}`}
              title="Colar direto da área de transferência"
            >
              <Clipboard className="w-3.5 h-3.5 text-amber-400" />
              <span>Colar do Clipboard</span>
            </button>

            <button
              onClick={handleClear}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${currentTheme.bgCard} ${currentTheme.border} text-rose-400 hover:text-rose-300`}
              title="Limpar caixa de texto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>

            <button
              onClick={handleRestoreDefault}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${currentTheme.bgCard} ${currentTheme.border} ${currentTheme.textSecondary} hover:${currentTheme.textPrimary}`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Capítulo Original (Mushoku Tensei)</span>
            </button>
          </div>

          {/* Quick preset examples */}
          <div className="flex items-center gap-1.5 text-neutral-400">
            <span>Exemplos rápidos:</span>
            <button
              onClick={() => handleLoadSample('fantasy')}
              className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-medium text-[11px]"
            >
              Fantasia Épica
            </button>
            <button
              onClick={() => handleLoadSample('adventure')}
              className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-medium text-[11px]"
            >
              Taverna Medieval
            </button>
          </div>
        </div>

        {/* Text Area and optional title */}
        <div className="p-6 flex-1 flex flex-col min-h-[300px] space-y-3 overflow-hidden">
          <div>
            <label className={`text-[11px] font-semibold uppercase tracking-wider block mb-1 ${currentTheme.textMuted}`}>
              Título do Capítulo / Obra (Opcional):
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Ex: Mushoku Tensei · Encontro na Cabana / Crônicas do Reino"
              className={`w-full px-3 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 ${currentTheme.bgActive} ${currentTheme.border} ${currentTheme.textPrimary}`}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>
              {paragraphCount} parágrafos identificados · ~{wordCount} palavras
            </span>
            <span className="text-[11px] text-amber-400/90 font-medium">
              💡 Parágrafos com travessão (— ou -) alternam automaticamente vozes no modo Personagens!
            </span>
          </div>

          <textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            placeholder="Cole seu texto completo aqui... Pode ser qualquer tamanho de capítulo ou história em português!"
            className={`w-full flex-1 p-4 rounded-xl border resize-none font-serif text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-500 ${currentTheme.bgActive} ${currentTheme.border} ${currentTheme.textPrimary}`}
          />
        </div>

        {/* Footer */}
        <div className={`px-6 py-3.5 border-t flex items-center justify-between ${currentTheme.border}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-xs font-medium ${currentTheme.textSecondary} hover:${currentTheme.textPrimary} transition-colors`}
          >
            Cancelar
          </button>

          <button
            onClick={handleApply}
            disabled={draftText.trim().length === 0}
            className="flex items-center gap-1.5 px-6 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:pointer-events-none text-neutral-950 shadow-md transition-colors"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Carregar e Começar a Ler</span>
          </button>
        </div>
      </div>
    </div>
  );
};
