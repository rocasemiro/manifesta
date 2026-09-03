import React, { useState } from 'react';
import { Tag, Plus, Edit3, Trash2, Sparkles, Check, Search } from 'lucide-react';
import { Category, SpiritualIntentionPillar, TransactionType, Transaction } from '../types';
import { SPIRITUAL_PILLARS } from '../data/spiritualMeta';
import { formatCurrency } from '../utils/formatters';

interface CategoryManagerProps {
  categories: Category[];
  transactions: Transaction[];
  onAddCategory: (newCat: Omit<Category, 'id'>) => void;
  onUpdateCategory: (updated: Category) => void;
  onDeleteCategory: (id: string) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  transactions,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory
}) => {
  const [activeTypeTab, setActiveTypeTab] = useState<TransactionType>('expense');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [color, setColor] = useState('#d97706');
  const [pillar, setPillar] = useState<SpiritualIntentionPillar>('acolhimento_lar');
  const [description, setDescription] = useState('');

  const PRESET_COLORS = [
    '#d97706', '#059669', '#2563eb', '#7c3aed', '#e11d48', '#0d9488', '#ca8a04', '#4f46e5'
  ];

  const filteredCategories = categories.filter(c => {
    if (c.type !== activeTypeTab) return false;
    if (searchTerm.trim()) {
      return c.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setType(activeTypeTab);
    setColor(activeTypeTab === 'expense' ? '#d97706' : '#059669');
    setPillar('acolhimento_lar');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setType(cat.type);
    setColor(cat.color || '#d97706');
    setPillar(cat.spiritualPillar);
    setDescription(cat.description || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      onUpdateCategory({
        ...editingCategory,
        name: name.trim(),
        type,
        color,
        spiritualPillar: pillar,
        description: description.trim()
      });
    } else {
      onAddCategory({
        name: name.trim(),
        type,
        iconName: 'Tag',
        color,
        spiritualPillar: pillar,
        description: description.trim()
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-[#5a6b5d] text-white p-6 rounded-2xl shadow-md border border-[#5a6b5d]/30 space-y-2">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#e9edc9]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#e9edc9]">
            Organização Consciente das Suas Intenções
          </span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#fdfcf7]">
          Categorias de Receitas & Despesas
        </h2>
        <p className="text-xs sm:text-sm text-[#fdfcf7]/90 leading-relaxed font-medium max-w-3xl">
          Ao personalizar suas categorias, você vincula cada entrada ou saída a um Pilar Espiritual. Isso traz clareza imediata sobre como seus recursos impulsionam seu crescimento e harmonia.
        </p>
      </div>

      {/* Tabs & Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#5a6b5d]/15 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTypeTab('expense')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTypeTab === 'expense'
                ? 'bg-[#5a6b5d] text-white shadow-xs'
                : 'bg-[#fdfcf7] text-[#3d403d] hover:bg-[#e9edc9]/50 border border-[#5a6b5d]/10'
            }`}
          >
            Destinos Conscientes (Despesas)
          </button>

          <button
            onClick={() => setActiveTypeTab('income')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTypeTab === 'income'
                ? 'bg-[#7d8e7b] text-white shadow-xs'
                : 'bg-[#fdfcf7] text-[#3d403d] hover:bg-[#e9edc9]/50 border border-[#5a6b5d]/10'
            }`}
          >
            Abundância Recebida (Receitas)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8c968d] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#fdfcf7] border border-[#5a6b5d]/20 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#5a6b5d] font-medium text-[#3d403d]"
            />
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#5a6b5d] hover:bg-[#3d403d] text-white text-xs font-semibold shrink-0 shadow-xs transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Categoria</span>
          </button>
        </div>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => {
          const pillarMeta = SPIRITUAL_PILLARS[cat.spiritualPillar] || SPIRITUAL_PILLARS.acolhimento_lar;
          const totalSpent = transactions
            .filter(t => t.categoryId === cat.id && t.status === 'manifested')
            .reduce((sum, t) => sum + t.amount, 0);

          return (
            <div
              key={cat.id}
              className="bg-white p-5 rounded-2xl border border-[#5a6b5d]/15 hover:border-[#5a6b5d]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color || '#5a6b5d' }}
                    />
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#5a6b5d] text-white">
                      {pillarMeta.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1 text-[#8c968d] hover:text-[#3d403d] hover:bg-[#fdfcf7] rounded-md transition-colors"
                      title="Editar Categoria"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteCategory(cat.id)}
                      className="p-1 text-[#8c968d] hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Excluir Categoria"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-serif font-bold text-[#3d403d] text-base">
                  {cat.name}
                </h3>

                {cat.description && (
                  <p className="text-xs text-[#8c968d] line-clamp-2">
                    {cat.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-[#5a6b5d]/10 flex items-center justify-between text-xs">
                <span className="text-[#8c968d] font-medium">Acumulado Realizado:</span>
                <span className="font-serif font-bold text-[#3d403d]">
                  {formatCurrency(totalSpent)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Creating/Editing Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#3d403d]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#5a6b5d]/20 shadow-xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#5a6b5d]/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#5a6b5d]" />
                <h3 className="font-serif font-bold text-[#3d403d] text-lg">
                  {editingCategory ? 'Editar Categoria' : 'Nova Categoria de Intenção'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#8c968d] hover:text-[#3d403d] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3d403d] mb-1">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Alimentação do Templo, Cursos da Alma..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#fdfcf7] border border-[#5a6b5d]/20 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#5a6b5d] font-medium text-[#3d403d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3d403d] mb-1">
                    Tipo
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as TransactionType)}
                    className="w-full bg-[#fdfcf7] border border-[#5a6b5d]/20 rounded-xl px-3 py-2 text-xs font-medium text-[#3d403d] focus:outline-none"
                  >
                    <option value="expense">Despesa (Destino)</option>
                    <option value="income">Receita (Abundância)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3d403d] mb-1">
                    Pilar Espiritual
                  </label>
                  <select
                    value={pillar}
                    onChange={(e) => setPillar(e.target.value as SpiritualIntentionPillar)}
                    className="w-full bg-[#fdfcf7] border border-[#5a6b5d]/20 rounded-xl px-3 py-2 text-xs font-medium text-[#3d403d] focus:outline-none"
                  >
                    {Object.entries(SPIRITUAL_PILLARS).map(([k, p]) => (
                      <option key={k} value={k}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3d403d] mb-1">
                  Cor da Categoria
                </label>
                <div className="flex items-center gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className="w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90"
                      style={{ backgroundColor: c }}
                    >
                      {color === c && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3d403d] mb-1">
                  Descrição Inspiradora (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Escreva brevemente o propósito deste grupo de valores..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#fdfcf7] border border-[#5a6b5d]/20 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#5a6b5d] font-medium text-[#3d403d]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#5a6b5d]/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#8c968d] hover:bg-[#fdfcf7] rounded-xl transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#5a6b5d] hover:bg-[#3d403d] text-white shadow-xs transition-transform active:scale-95"
                >
                  Salvar Categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
