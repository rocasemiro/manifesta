import React, { useState } from 'react';
import { Users, Plus, Edit3, Trash2, Heart, Search, Phone, FileText } from 'lucide-react';
import { SupplierCreditor, RelationshipType, Transaction } from '../types';
import { formatCurrency } from '../utils/formatters';

interface SupplierCreditorManagerProps {
  suppliers: SupplierCreditor[];
  transactions: Transaction[];
  onAddSupplier: (newSupp: Omit<SupplierCreditor, 'id' | 'createdAt'>) => void;
  onUpdateSupplier: (updated: SupplierCreditor) => void;
  onDeleteSupplier: (id: string) => void;
}

export const SupplierCreditorManager: React.FC<SupplierCreditorManagerProps> = ({
  suppliers,
  transactions,
  onAddSupplier,
  onUpdateSupplier,
  onDeleteSupplier
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | RelationshipType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierCreditor | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [relationshipType, setRelationshipType] = useState<RelationshipType>('fornecedor');
  const [contactInfo, setContactInfo] = useState('');
  const [notes, setNotes] = useState('');
  const [gratitudeReason, setGratitudeReason] = useState('');

  const filteredSuppliers = suppliers.filter((s) => {
    if (activeFilter !== 'all' && s.relationshipType !== activeFilter) {
      return false;
    }
    if (searchTerm.trim()) {
      return s.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const openAddModal = () => {
    setEditingSupplier(null);
    setName('');
    setRelationshipType('fornecedor');
    setContactInfo('');
    setNotes('');
    setGratitudeReason('');
    setIsModalOpen(true);
  };

  const openEditModal = (supp: SupplierCreditor) => {
    setEditingSupplier(supp);
    setName(supp.name);
    setRelationshipType(supp.relationshipType);
    setContactInfo(supp.contactInfo || '');
    setNotes(supp.notes || '');
    setGratitudeReason(supp.gratitudeReason || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingSupplier) {
      onUpdateSupplier({
        ...editingSupplier,
        name: name.trim(),
        relationshipType,
        contactInfo: contactInfo.trim(),
        notes: notes.trim(),
        gratitudeReason: gratitudeReason.trim(),
      });
    } else {
      onAddSupplier({
        name: name.trim(),
        relationshipType,
        contactInfo: contactInfo.trim(),
        notes: notes.trim(),
        gratitudeReason: gratitudeReason.trim(),
      });
    }

    setIsModalOpen(false);
  };

  const getRelationshipBadge = (type: RelationshipType) => {
    switch (type) {
      case 'fornecedor':
        return <span className="bg-[#5a6b5d] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">Fornecedor de Serviço</span>;
      case 'credor':
        return <span className="bg-[#b88655] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">Credor / Financiador</span>;
      case 'beneficiario':
        return <span className="bg-[#7d8e7b] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">Beneficiário / Causa</span>;
      case 'parceiro':
        return <span className="bg-[#e9edc9] text-[#3d403d] border border-[#7d8e7b]/30 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">Parceiro de Trabalho</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-[#5a6b5d] text-white p-6 rounded-2xl shadow-md border border-[#5a6b5d]/30 space-y-2">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#e9edc9]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#e9edc9]">
            Rede Sagrada de Trocas e Parcerias
          </span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#fdfcf7]">
          Cadastro de Fornecedores & Credores
        </h2>
        <p className="text-xs sm:text-sm text-[#fdfcf7]/90 leading-relaxed font-medium max-w-3xl">
          Nenhum ser humano vive isolado. Seus fornecedores, credores e parceiros são pessoas e instituições que tornam sua vida mais fácil, iluminada e segura. Mantenha aqui sua rede de trocas abençoadas.
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#5a6b5d]/15 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-[#fdfcf7] p-1 rounded-xl border border-[#5a6b5d]/10 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'all'
                ? 'bg-[#5a6b5d] text-white shadow-xs'
                : 'text-[#3d403d] hover:text-[#5a6b5d]'
            }`}
          >
            Todos ({suppliers.length})
          </button>

          <button
            onClick={() => setActiveFilter('fornecedor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'fornecedor'
                ? 'bg-[#5a6b5d] text-white shadow-xs'
                : 'text-[#3d403d] hover:text-[#5a6b5d]'
            }`}
          >
            Fornecedores
          </button>

          <button
            onClick={() => setActiveFilter('credor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'credor'
                ? 'bg-[#b88655] text-white shadow-xs'
                : 'text-[#3d403d] hover:text-[#5a6b5d]'
            }`}
          >
            Credores
          </button>

          <button
            onClick={() => setActiveFilter('beneficiario')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'beneficiario'
                ? 'bg-[#7d8e7b] text-white shadow-xs'
                : 'text-[#3d403d] hover:text-[#5a6b5d]'
            }`}
          >
            Beneficiários
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8c968d] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar parceiro..."
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
            <span>Cadastrar Parceiro</span>
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSuppliers.map((supp) => {
          const suppTransactions = transactions.filter(t => t.supplierCreditorId === supp.id);
          const totalExchanged = suppTransactions
            .filter(t => t.status === 'manifested')
            .reduce((sum, t) => sum + t.amount, 0);

          return (
            <div
              key={supp.id}
              className="bg-white p-5 rounded-2xl border border-[#5a6b5d]/15 hover:border-[#5a6b5d]/40 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  {getRelationshipBadge(supp.relationshipType)}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(supp)}
                      className="p-1 text-[#8c968d] hover:text-[#3d403d] hover:bg-[#fdfcf7] rounded-md transition-colors"
                      title="Editar Parceiro"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteSupplier(supp.id)}
                      className="p-1 text-[#8c968d] hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Excluir Parceiro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-serif font-bold text-[#3d403d] text-lg">
                  {supp.name}
                </h3>

                {supp.contactInfo && (
                  <p className="text-xs text-[#8c968d] flex items-center gap-1.5 font-medium">
                    <Phone className="w-3.5 h-3.5 text-[#5a6b5d]" />
                    <span>{supp.contactInfo}</span>
                  </p>
                )}

                {supp.gratitudeReason && (
                  <div className="p-3 bg-[#e9edc9]/50 rounded-xl border border-[#7d8e7b]/30 text-xs text-[#3d403d] space-y-1">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-[#5a6b5d]">
                      <Heart className="w-3.5 h-3.5 fill-[#d4a373] text-[#d4a373]" />
                      <span>Motivo de Gratidão:</span>
                    </div>
                    <p className="italic font-medium leading-relaxed">
                      &quot;{supp.gratitudeReason}&quot;
                    </p>
                  </div>
                )}

                {supp.notes && (
                  <p className="text-xs text-[#8c968d] flex items-start gap-1">
                    <FileText className="w-3.5 h-3.5 text-[#5a6b5d] mt-0.5 shrink-0" />
                    <span>{supp.notes}</span>
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-[#5a6b5d]/10 flex items-center justify-between text-xs font-semibold text-[#8c968d]">
                <span>{suppTransactions.length} registros conectados</span>
                <span className="font-serif font-bold text-[#3d403d]">
                  Total Circulado: {formatCurrency(totalExchanged)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Creating/Editing Supplier/Creditor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#3d403d]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#5a6b5d]/20 shadow-xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#5a6b5d]/10 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#5a6b5d]" />
                <h3 className="font-serif font-bold text-[#3d403d] text-lg">
                  {editingSupplier ? 'Editar Parceiro' : 'Novo Fornecedor / Credor'}
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
                  Nome da Pessoa ou Instituição
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mercado da Vida, Concessionária de Luz, Banco..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#fdfcf7] border border-[#5a6b5d]/20 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#5a6b5d] font-medium text-[#3d403d]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3d403d] mb-1">
                  Relação de Parceria
                </label>
                <select
                  value={relationshipType}
                  onChange={(e) => setRelationshipType(e.target.value as RelationshipType)}
                  className="w-full bg-[#fdfcf7] border border-[#5a6b5d]/20 rounded-xl px-3 py-2 text-xs font-medium text-[#3d403d] focus:outline-none"
                >
                  <option value="fornecedor">Fornecedor (Produtos ou Serviços)</option>
                  <option value="credor">Credor (Financiador ou Instituição)</option>
                  <option value="beneficiario">Beneficiário (Causa Social / Ajuda)</option>
                  <option value="parceiro">Parceiro de Trabalho / Cliente</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3d403d] mb-1">
                  Contato / Telefone / E-mail (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: 0800-000-0000, contato@empresa.com.br"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="w-full bg-[#fdfcf7] border border-[#5a6b5d]/20 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#5a6b5d] font-medium text-[#3d403d]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5a6b5d] mb-1 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-[#d4a373] text-[#d4a373]" />
                  Motivo de Gratidão por esta Parceria
                </label>
                <textarea
                  rows={2}
                  placeholder="Por que você é grato pelos serviços ou facilidades oferecidos por esta entidade?"
                  value={gratitudeReason}
                  onChange={(e) => setGratitudeReason(e.target.value)}
                  className="w-full bg-[#e9edc9]/40 border border-[#7d8e7b]/30 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#5a6b5d] font-medium text-[#3d403d]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3d403d] mb-1">
                  Observações (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalhes adicionais..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                  Salvar Parceiro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
