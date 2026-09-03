import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Star, Sparkles, CheckCircle2 } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency, formatDateBR } from '../utils/formatters';
import { SPIRITUAL_PILLARS } from '../data/spiritualMeta';

interface PayWithGratitudeModalProps {
  transaction: Transaction;
  onClose: () => void;
  onConfirmPayment: (updatedTx: Transaction) => void;
}

export const PayWithGratitudeModal: React.FC<PayWithGratitudeModalProps> = ({
  transaction,
  onClose,
  onConfirmPayment
}) => {
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [wellbeingScore, setWellbeingScore] = useState<number>(5);
  const [gratitudeNote, setGratitudeNote] = useState<string>(
    transaction.gratitudeNote || 'Sou grato pela oportunidade de pagar esta conta e honrar os serviços e facilidades recebidas em minha vida.'
  );

  const pillarMeta = SPIRITUAL_PILLARS[transaction.spiritualPillar] || SPIRITUAL_PILLARS.acolhimento_lar;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d97706', '#059669', '#f59e0b', '#10b981', '#ec4899']
      });
    } catch (e) {
      console.log('Confetti effect unavailable:', e);
    }

    onConfirmPayment({
      ...transaction,
      status: 'manifested',
      paymentDate,
      wellbeingScore,
      gratitudeNote: gratitudeNote.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#3d403d]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#5a6b5d]/20 shadow-2xl w-full max-w-lg p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#5a6b5d]/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#e9edc9] text-[#5a6b5d]">
              <Heart className="w-5 h-5 fill-[#5a6b5d] text-[#5a6b5d]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#3d403d] text-lg">
                Manifestar com Gratidão
              </h3>
              <p className="text-xs text-[#8c968d]">
                Concluir pagamento & transformar recursos em intenção
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

        {/* Transaction Summary Card */}
        <div className="p-4 rounded-xl bg-[#e9edc9]/50 border border-[#7d8e7b]/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#5a6b5d] text-white">
              {pillarMeta.title}
            </span>
            <span className="text-xs text-[#8c968d]">
              Vencimento: <strong>{formatDateBR(transaction.dueDate)}</strong>
            </span>
          </div>
          <h4 className="font-serif font-bold text-[#3d403d] text-base">
            {transaction.title}
          </h4>
          <div className="text-xl font-bold font-serif text-[#5a6b5d]">
            {formatCurrency(transaction.amount)}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3d403d] mb-1">
              Data da Manifestação (Pagamento/Recebimento)
            </label>
            <input
              type="date"
              required
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full bg-[#fdfcf7] border border-[#5a6b5d]/20 rounded-xl px-3.5 py-2 text-xs font-medium text-[#3d403d] focus:outline-none focus:border-[#5a6b5d]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3d403d] mb-1">
              Impacto no Seu Bem-Estar e Paz de Espírito (1 a 5)
            </label>
            <div className="flex items-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setWellbeingScore(star)}
                  className={`p-2 rounded-xl transition-all ${
                    star <= wellbeingScore
                      ? 'bg-[#e9edc9] text-[#5a6b5d] scale-105'
                      : 'bg-[#fdfcf7] text-[#8c968d]'
                  }`}
                >
                  <Star className={`w-6 h-6 ${star <= wellbeingScore ? 'fill-[#d4a373] text-[#d4a373]' : ''}`} />
                </button>
              ))}
              <span className="text-xs font-bold text-[#5a6b5d]">
                {wellbeingScore === 5 ? 'Plena Paz' : wellbeingScore === 4 ? 'Muito Bom' : wellbeingScore === 3 ? 'Neutro/Necessário' : 'Desconforto'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5a6b5d] mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#5a6b5d]" />
              Sua Nota de Gratidão (Pelo que é grato ao realizar este movimento?)
            </label>
            <textarea
              rows={3}
              required
              placeholder="Escreva brevemente o porquê de valer a pena pagar esta conta..."
              value={gratitudeNote}
              onChange={(e) => setGratitudeNote(e.target.value)}
              className="w-full bg-[#e9edc9]/30 border border-[#7d8e7b]/30 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-[#5a6b5d] text-[#3d403d] leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#5a6b5d]/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#8c968d] hover:bg-[#fdfcf7] rounded-xl transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-[#5a6b5d] hover:bg-[#3d403d] text-white shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-[#e9edc9]" />
              <span>Confirmar com Gratidão ✨</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
