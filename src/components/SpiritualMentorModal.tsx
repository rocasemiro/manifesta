import React, { useState } from 'react';
import { Bot, Sparkles, Send, Loader2, Quote, Lightbulb } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/formatters';

interface SpiritualMentorModalProps {
  transactions: Transaction[];
  onClose: () => void;
}

export const SpiritualMentorModal: React.FC<SpiritualMentorModalProps> = ({
  transactions,
  onClose
}) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [affirmation, setAffirmation] = useState<string | null>(null);

  const manifested = transactions.filter(t => t.status === 'manifested');
  const totalIncome = manifested.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = manifested.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const handleConsult = async (customQuestion?: string) => {
    setLoading(true);
    setInsight(null);
    setAffirmation(null);

    const targetQuestion = customQuestion || question || 'Como posso elevar minha paz de espírito e cultivar mais gratidão com meu fluxo de dinheiro atual?';

    try {
      const response = await fetch('/api/spiritual-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: {
            totalIncome,
            totalExpenses,
            balance,
            wellnessAverage: 4.8
          },
          question: targetQuestion
        })
      });

      const data = await response.json();
      setInsight(data.insight || 'Sua consciência ao gastar é o maior segredo da abundância.');
      setAffirmation(data.affirmation || 'Abençoo meu dinheiro e recebo o fluxo com serenidade.');
    } catch (e) {
      console.error('Error fetching mentor insight:', e);
      setInsight(`✨ **Conselho de Abundância:**
Cada conta paga com gratidão libera o fluxo para novas bênçãos chegarem. Lembre-se de que o dinheiro não é escasso; ele é uma ferramenta contínua de servidão ao seu bem-estar.`);
      setAffirmation('Sou merecedor da fluidez e da prosperidade em todas as áreas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3d403d]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#5a6b5d]/20 shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#5a6b5d]/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#e9edc9] text-[#5a6b5d]">
              <Bot className="w-5 h-5 text-[#5a6b5d]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#3d403d] text-lg">
                Mentor de Prosperidade Espiritual (IA)
              </h3>
              <p className="text-xs text-[#8c968d]">
                Reflexões sobre intenção, alinhamento e gratidão financeira
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8c968d] hover:text-[#3d403d] text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Quick context info */}
        <div className="p-3 bg-[#e9edc9]/50 rounded-xl border border-[#7d8e7b]/30 flex items-center justify-between text-xs text-[#3d403d] font-medium">
          <span>Abundância Recebida: <strong>{formatCurrency(totalIncome)}</strong></span>
          <span>Destino Consciente: <strong>{formatCurrency(totalExpenses)}</strong></span>
        </div>

        {/* Preset Prompt Buttons */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-[#8c968d] uppercase tracking-wider">
            Perguntas Sugeridas:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              'Como posso sentir mais paz ao pagar contas?',
              'Como transformar despesas em sementes de prosperidade?',
              'Qual afirmação usar para atrair mais abundância?'
            ].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setQuestion(preset);
                  handleConsult(preset);
                }}
                className="text-left text-xs bg-[#fdfcf7] hover:bg-[#e9edc9] hover:text-[#3d403d] border border-[#5a6b5d]/15 rounded-lg px-2.5 py-1.5 text-[#3d403d] transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Question Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Digite suas dúvidas sobre escolhas financeiras..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleConsult()}
            className="flex-1 bg-[#fdfcf7] border border-[#5a6b5d]/20 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#5a6b5d] font-medium text-[#3d403d]"
          />
          <button
            onClick={() => handleConsult()}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-[#5a6b5d] hover:bg-[#3d403d] text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Consultar</span>
          </button>
        </div>

        {/* Response Container */}
        {insight && (
          <div className="space-y-3 pt-2 border-t border-[#5a6b5d]/10">
            <div className="p-4 bg-[#e9edc9]/40 rounded-xl border border-[#7d8e7b]/30 space-y-2 text-xs text-[#3d403d] leading-relaxed">
              <div className="flex items-center gap-1.5 font-serif font-bold text-[#5a6b5d] text-sm">
                <Sparkles className="w-4 h-4 text-[#5a6b5d]" />
                <span>Reflexão do Mentor</span>
              </div>
              <div className="whitespace-pre-line font-medium text-[#3d403d]">
                {insight}
              </div>
            </div>

            {affirmation && (
              <div className="p-3 bg-[#e9edc9]/60 rounded-xl border border-[#7d8e7b]/40 text-[#3d403d] space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#5a6b5d]">
                  <Quote className="w-3.5 h-3.5 text-[#5a6b5d]" />
                  <span>Sua Afirmação Diária:</span>
                </div>
                <p className="font-serif italic font-bold text-xs text-[#3d403d]">
                  &quot;{affirmation}&quot;
                </p>
              </div>
            )}
          </div>
        )}

        {!insight && !loading && (
          <div className="p-4 text-center text-xs text-[#8c968d] bg-[#fdfcf7] rounded-xl border border-dashed border-[#5a6b5d]/20 space-y-1">
            <Lightbulb className="w-5 h-5 text-[#5a6b5d] mx-auto" />
            <p>Clique em uma das perguntas acima ou digite sua reflexão para receber orientação do Mentor de Prosperidade.</p>
          </div>
        )}
      </div>
    </div>
  );
};
