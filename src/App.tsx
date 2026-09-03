import { useState, useEffect } from 'react';
import { HeaderNavbar } from './components/HeaderNavbar';
import { Dashboard } from './components/Dashboard';
import { GratitudeReport } from './components/GratitudeReport';
import { CashFlow } from './components/CashFlow';
import { BillsPlanner } from './components/BillsPlanner';
import { CategoryManager } from './components/CategoryManager';
import { SupplierCreditorManager } from './components/SupplierCreditorManager';

// Modals
import { TransactionModal } from './components/TransactionModal';
import { PayWithGratitudeModal } from './components/PayWithGratitudeModal';
import { SpiritualMentorModal } from './components/SpiritualMentorModal';
import { BeginnerGuideModal } from './components/BeginnerGuideModal';

// Types & Utils
import { ActiveTab, Category, SupplierCreditor, Transaction, TransactionType } from './types';
import { 
  loadCategories, 
  saveCategories, 
  loadSuppliers, 
  saveSuppliers, 
  loadTransactions, 
  saveTransactions,
  resetAllDataToDefault,
  exportDataAsJSON
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Application State
  const [categories, setCategories] = useState<Category[]>(loadCategories);
  const [suppliers, setSuppliers] = useState<SupplierCreditor[]>(loadSuppliers);
  const [transactions, setTransactions] = useState<Transaction[]>(loadTransactions);

  // Modals State
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [defaultTxType, setDefaultTxType] = useState<TransactionType>('expense');

  const [payingBill, setPayingBill] = useState<Transaction | null>(null);
  const [isSpiritualMentorOpen, setIsSpiritualMentorOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Sync state changes with localStorage
  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    saveSuppliers(suppliers);
  }, [suppliers]);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  // Transaction Actions
  const handleOpenNewTx = (type: TransactionType = 'expense') => {
    setEditingTransaction(null);
    setDefaultTxType(type);
    setIsTxModalOpen(true);
  };

  const handleOpenEditTx = (tx: Transaction) => {
    setEditingTransaction(tx);
    setDefaultTxType(tx.type);
    setIsTxModalOpen(true);
  };

  const handleSaveTransaction = (txData: Partial<Transaction>) => {
    if (txData.id) {
      // Update existing
      setTransactions(prev => prev.map(t => t.id === txData.id ? { ...t, ...txData } as Transaction : t));
    } else {
      // Create new
      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        title: txData.title || 'Nova Intenção',
        type: txData.type || 'expense',
        amount: txData.amount || 0,
        categoryId: txData.categoryId || categories[0]?.id || 'cat_moradia',
        spiritualPillar: txData.spiritualPillar || 'acolhimento_lar',
        supplierCreditorId: txData.supplierCreditorId,
        dueDate: txData.dueDate || new Date().toISOString().slice(0, 10),
        paymentDate: txData.paymentDate,
        status: txData.status || 'pending',
        gratitudeNote: txData.gratitudeNote,
        wellbeingScore: txData.wellbeingScore || 5,
        recurrence: txData.recurrence || 'once',
      };
      setTransactions(prev => [newTx, ...prev]);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Deseja realmente remover este registro de intenção?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handlePayBillWithGratitude = (bill: Transaction) => {
    setPayingBill(bill);
  };

  const handleConfirmBillPayment = (updatedTx: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTx.id ? updatedTx : t));
    setPayingBill(null);
  };

  // Category Actions
  const handleAddCategory = (newCat: Omit<Category, 'id'>) => {
    const created: Category = {
      ...newCat,
      id: `cat_${Date.now()}`
    };
    setCategories(prev => [...prev, created]);
  };

  const handleUpdateCategory = (updated: Category) => {
    setCategories(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Deseja excluir esta categoria? As transações associadas permanecerão salvas.')) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  // Supplier Actions
  const handleAddSupplier = (newSupp: Omit<SupplierCreditor, 'id' | 'createdAt'>) => {
    const created: SupplierCreditor = {
      ...newSupp,
      id: `supp_${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setSuppliers(prev => [...prev, created]);
  };

  const handleUpdateSupplier = (updated: SupplierCreditor) => {
    setSuppliers(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const handleDeleteSupplier = (id: string) => {
    if (window.confirm('Deseja remover este fornecedor/credor?')) {
      setSuppliers(prev => prev.filter(s => s.id !== id));
    }
  };

  // Reset & Export
  const handleResetData = () => {
    if (window.confirm('Tem certeza de que deseja restaurar os dados iniciais de exemplo?')) {
      resetAllDataToDefault();
      setCategories(loadCategories());
      setSuppliers(loadSuppliers());
      setTransactions(loadTransactions());
    }
  };

  const pendingBillsCount = transactions.filter(t => t.status === 'pending').length;

  return (
    <div className="min-h-screen bg-stone-50/60 font-sans text-stone-800 flex flex-col justify-between">
      <div>
        {/* Navigation Header */}
        <HeaderNavbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenNewTransaction={() => handleOpenNewTx('expense')}
          onOpenSpiritualMentor={() => setIsSpiritualMentorOpen(true)}
          onOpenGuide={() => setIsGuideOpen(true)}
          onExportData={exportDataAsJSON}
          onResetData={handleResetData}
          pendingBillsCount={pendingBillsCount}
        />

        {/* Main Tab Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'dashboard' && (
            <Dashboard
              transactions={transactions}
              categories={categories}
              setActiveTab={setActiveTab}
              onPayBillWithGratitude={handlePayBillWithGratitude}
              onOpenNewTransaction={() => handleOpenNewTx('expense')}
              onOpenSpiritualMentor={() => setIsSpiritualMentorOpen(true)}
            />
          )}

          {activeTab === 'gratitude' && (
            <GratitudeReport
              transactions={transactions}
              categories={categories}
              onOpenSpiritualMentor={() => setIsSpiritualMentorOpen(true)}
            />
          )}

          {activeTab === 'cashflow' && (
            <CashFlow transactions={transactions} />
          )}

          {activeTab === 'bills' && (
            <BillsPlanner
              transactions={transactions}
              categories={categories}
              suppliers={suppliers}
              onPayBillWithGratitude={handlePayBillWithGratitude}
              onOpenNewTransaction={(type) => handleOpenNewTx(type)}
              onEditTransaction={handleOpenEditTx}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}

          {activeTab === 'categories' && (
            <CategoryManager
              categories={categories}
              transactions={transactions}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          )}

          {activeTab === 'contacts' && (
            <SupplierCreditorManager
              suppliers={suppliers}
              transactions={transactions}
              onAddSupplier={handleAddSupplier}
              onUpdateSupplier={handleUpdateSupplier}
              onDeleteSupplier={handleDeleteSupplier}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200/80 py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-serif font-bold text-stone-700">
            Manifesta — Gestão Financeira com Foco em Prosperidade Espiritual
          </p>
          <p className="text-[11px] text-stone-400">
            O dinheiro como expressão consciente de vontade, gratidão e bem-estar.
          </p>
        </div>
      </footer>

      {/* Modals */}
      {isTxModalOpen && (
        <TransactionModal
          initialTransaction={editingTransaction}
          defaultType={defaultTxType}
          categories={categories}
          suppliers={suppliers}
          onClose={() => setIsTxModalOpen(false)}
          onSave={handleSaveTransaction}
        />
      )}

      {payingBill && (
        <PayWithGratitudeModal
          transaction={payingBill}
          onClose={() => setPayingBill(null)}
          onConfirmPayment={handleConfirmBillPayment}
        />
      )}

      {isSpiritualMentorOpen && (
        <SpiritualMentorModal
          transactions={transactions}
          onClose={() => setIsSpiritualMentorOpen(false)}
        />
      )}

      {isGuideOpen && (
        <BeginnerGuideModal onClose={() => setIsGuideOpen(false)} />
      )}
    </div>
  );
}
