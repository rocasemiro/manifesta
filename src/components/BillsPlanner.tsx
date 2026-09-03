import React, { useState } from 'react';
import { 
  CalendarClock, 
  Search, 
  Heart, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Users
} from 'lucide-react';
import { Transaction, Category, SupplierCreditor, TransactionType } from '../types';
import { formatCurrency, formatDateBR, getDaysRemaining } from '../utils/formatters';
import { SPIRITUAL_PILLARS } from '../data/spiritualMeta';

interface BillsPlannerProps {
  transactions: Transaction[];
  categories: Category[];
  suppliers: SupplierCreditor[];
  onPayBillWithGratitude: (tx: Transaction) => void;
  onOpenNewTransaction: (defaultType?: TransactionType) => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const BillsPlanner: React.FC<BillsPlannerProps> = ({
  transactions,
  categories,
  suppliers,
  onPayBillWithGratitude,
  onOpenNewTransaction,
  onEditTransaction,
  onDeleteTransaction
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'payable' | 'receivable' | 'overdue' | 'manifested'>('payable');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate stats
  const pendingPayables = transactions.filter(t => t.status === 'pending' && t.type === 'expense');
  const pendingReceivables = transactions.filter(t => t.status === 'pending' && t.type === 'income');

  const totalPayableAmount = pendingPayables.reduce((sum, t) => sum + t.amount, 0);
  const totalReceivableAmount = pendingReceivables.reduce((sum, t) => sum + t.amount, 0);
  const projectedBalance = totalReceivableAmount - totalPayableAmount;

  // Filter list
  const filteredList = transactions.filter((t) => {
    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchesTitle = t.title.toLowerCase().includes(term);
      const supplier = suppliers.find(s => s.id === t.supplierCreditorId);
      const matchesSupplier = supplier?.name.toLowerCase().includes(term);
      if (!matchesTitle && !matchesSupplier) return false;
    }

    if (filterTab === 'payable') {
      return t.status === 'pending' && t.type === 'expense';
    }
    if (filterTab === 'receivable') {
      return t.status === 'pending' && t.type === 'income';
    }
    if (filterTab === 'overdue') {
      if (t.status !== 'pending') return false;
      const daysInfo = getDaysRemaining(t.dueDate);
      return daysInfo.isOverdue;
    }
    if (filterTab === 'manifested') {
      return t.status === 'manifested';
    }
    return true;
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-[#5a6b5d] text-white p-6 rounded-2xl shadow-md border border-[#5a6b5d]/30 space-y-2">
        <div className="flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-[#e9edc9]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#e9edc9]">
            Planejamento Consciente & Paz no Calendário
          </span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#fdfcf7]">
          Contas a Pagar & Abundância a Receber
        </h2>
        <p className="text-xs sm:text-sm text-[#fdfcf7]/90 leading-relaxed font-medium max-w-3xl">
          Acompanhe todos os seus compromissos e recebimentos futuros com antecedência e serenidade. Ao quitar cada conta, celebre a manifestação do serviço entregue em sua vida.
        </p>
      </div>

      {/* Stats Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total A Pagar */}
        <div className="bg-white p-5 rounded-2xl border border-[#d4a373]/30 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#b88655] uppercase tracking-wider">
            <span>Total a Pagar (Futuro)</span>
            <ArrowDownRight className="w-4 h-4 text-[#b88655]" />
          </div>
          <div className="text-2xl font-bold font-serif text-[#3d403d] mt-2">
            {formatCurrency(totalPayableAmount)}
          </div>
          <p className="text-xs text-[#8c968d] mt-1 font-medium">
            {pendingPayables.length} compromissos agendados
          </p>
        </div>

        {/* Total A Receber */}
        <div className="bg-[#e9edc9]/50 p-5 rounded-2xl border border-[#7d8e7b]/30 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#3d403d] uppercase tracking-wider">
            <span>Total a Receber (Acolhimento)</span>
            <ArrowUpRight className="w-4 h-4 text-[#5a6b5d]" />
          </div>
          <div className="text-2xl font-bold font-serif text-[#3d403d] mt-2">
            {formatCurrency(totalReceivableAmount)}
          </div>
          <p className="text-xs text-[#5a6b5d] mt-1 font-medium">
            {pendingReceivables.length} fontes de abundância aguardadas
          </p>
        </div>

        {/* Saldo Previsto */}
        <div className="bg-white p-5 rounded-2xl border border-[#5a6b5d]/15 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-[#5a6b5d] uppercase tracking-wider">
            <span>Resultado Previsto do Período</span>
            <CalendarClock className="w-4 h-4 text-[#5a6b5d]" />
          </div>
          <div className={`text-2xl font-bold font-serif mt-2 ${projectedBalance >= 0 ? 'text-[#3d403d]' : 'text-rose-600'}`}>
            {formatCurrency(projectedBalance)}
          </div>
          <p className="text-xs text-[#8c968d] mt-1 font-medium">
            Projeção de paz ao honrar todos os fluxos
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#5a6b5d]/15 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#fdfcf7] p-1 rounded-xl border border-[#5a6b5d]/10 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilterTab('payable')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filterTab === 'payable'
                ? 'bg-[#5a6b5d] text-white shadow-xs'
                : 'text-[#3d403d] hover:text-[#5a6b5d]'
            }`}
          >
            A Pagar ({pendingPayables.length})
          </button>

          <button
            onClick={() => setFilterTab('receivable')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filterTab === 'receivable'
                ? 'bg-[#7d8e7b] text-white shadow-xs'
                : 'text-[#3d403d] hover:text-[#5a6b5d]'
            }`}
          >
            A Receber ({pendingReceivables.length})
          </button>

          <button
            onClick={() => setFilterTab('overdue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filterTab === 'overdue'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-[#3d403d] hover:text-rose-700'
            }`}
          >
            Alertas / Vencidos
          </button>

          <button
            onClick={() => setFilterTab('manifested')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filterTab === 'manifested'
                ? 'bg-[#3d403d] text-white shadow-xs'
                : 'text-[#3d403d] hover:text-[#5a6b5d]'
            }`}
          >
            Manifestadas / Concluídas
          </button>

          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filterTab === 'all'
                ? 'bg-[#5a6b5d]/80 text-white shadow-xs'
                : 'text-[#3d403d] hover:text-[#5a6b5d]'
            }`}
          >
            Todas
          </button>
        </div>

        {/* Search Input & Action */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-[#8c968d] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome ou fornecedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#fdfcf7] border border-[#5a6b5d]/20 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#5a6b5d] font-medium text-[#3d403d]"
            />
          </div>

          <button
            onClick={() => onOpenNewTransaction('expense')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5a6b5d] hover:bg-[#3d403d] text-white text-xs font-semibold shrink-0 shadow-xs transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Registro</span>
          </button>
        </div>
      </div>

      {/* Table / Cards List */}
      <div className="bg-white rounded-2xl border border-[#5a6b5d]/15 shadow-xs overflow-hidden">
        {filteredList.length === 0 ? (
          <div className="p-12 text-center text-[#8c968d] text-xs space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#5a6b5d] mx-auto" />
            <p className="font-semibold text-[#3d403d] text-sm">Nenhum registro encontrado nesta visualização.</p>
            <p className="text-[#8c968d] max-w-sm mx-auto">
              Sua agenda financeira está serena. Clique em &quot;Novo Registro&quot; para incluir um novo compromisso a pagar ou receber!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#5a6b5d]/10">
            {filteredList.map((tx) => {
              const isExpense = tx.type === 'expense';
              const daysInfo = getDaysRemaining(tx.dueDate);
              const category = categories.find(c => c.id === tx.categoryId);
              const supplier = suppliers.find(s => s.id === tx.supplierCreditorId);
              const pillarMeta = SPIRITUAL_PILLARS[tx.spiritualPillar] || SPIRITUAL_PILLARS.acolhimento_lar;

              return (
                <div
                  key={tx.id}
                  className="p-4 hover:bg-[#e9edc9]/20 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left Column: Title, Category, Supplier & Pillar */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        isExpense ? 'bg-[#d4a373]/20 text-[#b88655] border border-[#d4a373]/30' : 'bg-[#e9edc9] text-[#3d403d] border border-[#7d8e7b]/30'
                      }`}>
                        {isExpense ? 'A Pagar' : 'A Receber'}
                      </span>

                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#5a6b5d] text-white">
                        {pillarMeta.title}
                      </span>

                      {tx.status === 'manifested' ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#fdfcf7] text-[#3d403d] border border-[#5a6b5d]/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#5a6b5d]" />
                          Manifestado
                        </span>
                      ) : daysInfo.isOverdue ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          {daysInfo.text}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-[#8c968d]">
                          {daysInfo.text}
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif font-bold text-[#3d403d] text-base">
                      {tx.title}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-[#8c968d] flex-wrap">
                      <span>Vencimento: <strong className="text-[#3d403d]">{formatDateBR(tx.dueDate)}</strong></span>
                      {category && <span>• Categoria: <span className="text-[#3d403d] font-medium">{category.name}</span></span>}
                      {supplier && (
                        <span className="flex items-center gap-1 text-[#3d403d] font-semibold bg-[#e9edc9]/50 px-2 py-0.5 rounded-md border border-[#7d8e7b]/30">
                          <Users className="w-3 h-3 text-[#5a6b5d]" />
                          {supplier.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Amount & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                    <div className="text-right">
                      <div className={`text-lg font-bold font-serif ${isExpense ? 'text-[#b88655]' : 'text-[#5a6b5d]'}`}>
                        {formatCurrency(tx.amount)}
                      </div>
                      <span className="text-[10px] text-[#8c968d]">
                        {tx.recurrence === 'monthly' ? 'Mensal' : tx.recurrence === 'yearly' ? 'Anual' : 'Pontual'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {tx.status === 'pending' && (
                        <button
                          onClick={() => onPayBillWithGratitude(tx)}
                          className="px-3 py-2 text-xs font-semibold rounded-xl bg-[#5a6b5d] hover:bg-[#3d403d] text-white shadow-xs flex items-center gap-1.5 transition-transform active:scale-95"
                          title="Manifestar valor e registrar gratidão"
                        >
                          <Heart className="w-3.5 h-3.5 fill-[#e9edc9] text-[#e9edc9]" />
                          <span>Manifestar com Gratidão</span>
                        </button>
                      )}

                      <button
                        onClick={() => onEditTransaction(tx)}
                        className="p-2 text-[#8c968d] hover:text-[#3d403d] hover:bg-[#fdfcf7] rounded-lg transition-colors"
                        title="Editar Registro"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="p-2 text-[#8c968d] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Excluir Registro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
