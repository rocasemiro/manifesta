import React, { useState } from 'react';
import { PlusCircle, Edit3, Sparkles } from 'lucide-react';
import { Transaction, Category, SupplierCreditor, TransactionType, SpiritualIntentionPillar, TransactionStatus } from '../types';
import { SPIRITUAL_PILLARS } from '../data/spiritualMeta';

interface TransactionModalProps {
  initialTransaction?: Transaction | null;
  defaultType?: TransactionType;
  categories: Category[];
  suppliers: SupplierCreditor[];
  onClose: () => void;
  onSave: (txData: Partial<Transaction>) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  initialTransaction,
  defaultType = 'expense',
  categories,
  suppliers,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState(initialTransaction?.title || '');
  const [type, setType] = useState<TransactionType>(initialTransaction?.type || defaultType);
  const [amount, setAmount] = useState<number | string>(initialTransaction?.amount || '');
  const [categoryId, setCategoryId] = useState(
    initialTransaction?.categoryId || (categories.find(c => c.type === (initialTransaction?.type || defaultType))?.id || '')
  );
  const [spiritualPillar, setSpiritualPillar] = useState<SpiritualIntentionPillar>(
    initialTransaction?.spiritualPillar || 'acolhimento_lar'
  );
  const [supplierCreditorId, setSupplierCreditorId] = useState(initialTransaction?.supplierCreditorId || '');
  const [dueDate, setDueDate] = useState(
    initialTransaction?.dueDate || new Date().toISOString().slice(0, 10)
  );
  const [status, setStatus] = useState<TransactionStatus>(initialTransaction?.status || 'pending');
  const [gratitudeNote, setGratitudeNote] = useState(initialTransaction?.gratitudeNote || '');
  const [wellbeingScore, setWellbeingScore] = useState(initialTransaction?.wellbeingScore || 5);
  const [recurrence, setRecurrence] = useState<'once' | 'monthly' | 'yearly'>(
    initialTransaction?.recurrence || 'once'
  );

  // When category changes, auto-select its spiritual pillar
  const handleCategoryChange = (newCatId: string) => {
    setCategoryId(newCatId);
    const cat = categories.find(c => c.id === newCatId);
    if (cat?.spiritualPillar) {
      setSpiritualPillar(cat.spiritualPillar);
    }
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const matchingCat = categories.find(c => c.type === newType);
    if (matchingCat) {
      setCategoryId(matchingCat.id);
      if (matchingCat.spiritualPillar) {
        setSpiritualPillar(matchingCat.spiritualPillar);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    onSave({
      id: initialTransaction?.id,
      title: title.trim(),
      type,
      amount: typeof amount === 'string' ? parseFloat(amount) : amount,
      categoryId,
      spiritualPillar,
      supplierCreditorId: supplierCreditorId || undefined,
      dueDate,
      status,
      paymentDate: status === 'manifested' ? (initialTransaction?.paymentDate || dueDate) : undefined,
      gratitudeNote: gratitudeNote.trim() || undefined,
      wellbeingScore: status === 'manifested' ? wellbeingScore : undefined,
      recurrence,
    });

    onClose();
  };

  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <div className="fixed inset-0 z-50 bg-[#3d403d]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#5a6b5d]/20 shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#5a6b5d]/10 pb-3">
          <div className="flex items-center gap-2">
            {initialTransaction ? (
              <Edit3 className="w-5 h-5 text-[#5a6b5d]" />
            ) : (
              <PlusCircle className="w-5 h-5 text-[#5a6b5d]" />
            )}
            <h3 className="font-serif font-bold text-[#3d403d] text-lg">
              {initialTransaction ? 'Editar Registro Consciente' : 'Nova Intenção / Registro Financeiro'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8c968d] hover:text-[#3d403d] text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type selector */}
          <div className="grid grid-cols-2 gap-2 bg-[#fdfcf7] p-1 rounded-xl border border-[#5a6b5d]/10">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                type === 'expense'
                  ? 'bg-[#5a6b5d] text-white shadow-xs'
                  : 'text-[#3d403d] hover:text-[#5a6b5d]'
              }`}
            >
              Destino Consciente (Despesa)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                type === 'income'
                  ? 'bg-[#7d8e7b] text-white shadow-xs'
                  : 'text-[#3d403d] hover:text-[#5a6b5d]'
              }`}
            >
              Abundância Recebida (Receita)
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3d403d] mb-1">
              Descrição / Nome da Intenção
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Aluguel do Templo Sagrado, Supermercado Consciente..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#fdfcf7] border border-[#5a6b5d]/20 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#5a6b5d] font-medium text-[#3d403d]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#3d403d] mb-1">
                Valor (R$)
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#fdfcf7] border border-[#5a6b5d]/20 rounded-xl px-3.5 py-2 text-xs font-bold text-[#3d403d] focus:outline-none focus:border-[#5a6b5d]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3d403d] mb-1">
                Data de Vencimento
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#fdfcf7] border border-[#5a6b5d]/20 rounded-xl px-3 py-2 text-xs font-medium text-[#3d403d] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#3d403d] mb-1">
                Categoria
              </label>
              <select
                value={categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-[#fdfcf7] border border-[#5a6b5d]/20 rounded-xl px-3 py-2 text-xs font-medium text-[#3d403d] focus:outline-none"
              >
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3d403d] mb-1">
                Pilar Espiritual
              </label>
              <select
                value={spiritualPillar}
                onChange={(e) => setSpiritualPillar(e.target.value as SpiritualIntentionPillar)}
                className="w-full bg-[#fdfcf7] border border-[#5a6b5d]/20 rounded-xl px-3 py-2 text-xs font-medium text-[#3d403d] focus:outline-none"
              >
                {Object.entries(SPIRITUAL_PILLARS).map(([k, p]) => (
                  <option key={k} value={k}>{p.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#3d403d] mb-1">
                Fornecedor / Credor (Opcional)
              </label>
              <select
                value={supplierCreditorId}
                onChange={(e) => setSupplierCreditorId(e.target.value)}
                className="w-full bg-[#fdfcf7] border border-[#5a6b5d]/20 rounded-xl px-3 py-2 text-xs font-medium text-[#3d403d] focus:outline-none"
              >
                <option value="">Nenhum selecionado</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.relationshipType})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3d403d] mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TransactionStatus)}
                className="w-full bg-[#fdfcf7] border border-[#5a6b5d]/20 rounded-xl px-3 py-2 text-xs font-medium text-[#3d403d] focus:outline-none"
              >
                <option value="pending">A Agendar / Pendente</option>
                <option value="manifested">Manifestado / Realizado (Pago)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3d403d] mb-1">
              Frequência da Intenção
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'once', label: 'Pontual' },
                { id: 'monthly', label: 'Mensal' },
                { id: 'yearly', label: 'Anual' }
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRecurrence(r.id as any)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    recurrence === r.id
                      ? 'bg-[#e9edc9] border-[#7d8e7b]/40 text-[#3d403d]'
                      : 'bg-[#fdfcf7] border-[#5a6b5d]/15 text-[#3d403d] hover:bg-[#e9edc9]/30'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5a6b5d] mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#5a6b5d]" />
              Nota de Gratidão / Motivo Consciente (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Sou grato por ter tido energia para trabalhar / por ter luz e abrigo..."
              value={gratitudeNote}
              onChange={(e) => setGratitudeNote(e.target.value)}
              className="w-full bg-[#e9edc9]/30 border border-[#7d8e7b]/30 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-[#5a6b5d] text-[#3d403d]"
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
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#5a6b5d] hover:bg-[#3d403d] text-white shadow-xs transition-transform active:scale-95"
            >
              Salvar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
