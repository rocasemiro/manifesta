import React from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  Heart, 
  TrendingUp, 
  CalendarClock, 
  Tag, 
  Users, 
  PlusCircle, 
  BookOpen, 
  Bot,
  RotateCcw,
  Download
} from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderNavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenNewTransaction: () => void;
  onOpenSpiritualMentor: () => void;
  onOpenGuide: () => void;
  onExportData: () => void;
  onResetData: () => void;
  pendingBillsCount: number;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewTransaction,
  onOpenSpiritualMentor,
  onOpenGuide,
  onExportData,
  onResetData,
  pendingBillsCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Visão Geral',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'gratitude' as ActiveTab,
      label: 'Gratidão & Impacto',
      icon: Heart,
      badge: 'Bênçãos',
    },
    {
      id: 'cashflow' as ActiveTab,
      label: 'Fluxo de Caixa',
      icon: TrendingUp,
      badge: null,
    },
    {
      id: 'bills' as ActiveTab,
      label: 'Contas & Planejamento',
      icon: CalendarClock,
      badge: pendingBillsCount > 0 ? `${pendingBillsCount}` : null,
    },
    {
      id: 'categories' as ActiveTab,
      label: 'Categorias de Intenção',
      icon: Tag,
      badge: null,
    },
    {
      id: 'contacts' as ActiveTab,
      label: 'Fornecedores & Credores',
      icon: Users,
      badge: null,
    },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-[#5a6b5d]/15 sticky top-0 z-40 shadow-xs">
      {/* Top Banner with App Brand */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand Name & Tagline */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#5a6b5d] flex items-center justify-center text-[#e9edc9] shadow-md shadow-[#5a6b5d]/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-[#3d403d] font-serif">
                Manifesta
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#e9edc9] text-[#3d403d] border border-[#7d8e7b]/30">
                Prosperidade Espiritual
              </span>
            </div>
            <p className="text-xs text-[#8c968d] font-medium">
              Gerenciando finanças como escolhas conscientes de vida
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={onOpenSpiritualMentor}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#5a6b5d]/10 text-[#5a6b5d] hover:bg-[#5a6b5d]/20 border border-[#5a6b5d]/20 transition-colors"
            title="Reflexão de Prosperidade com IA"
          >
            <Bot className="w-4 h-4 text-[#5a6b5d]" />
            <span>Mentor Espiritual (IA)</span>
          </button>

          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#e9edc9]/70 text-[#3d403d] hover:bg-[#e9edc9] border border-[#7d8e7b]/30 transition-colors"
            title="Guia sem termos contábeis para iniciantes"
          >
            <BookOpen className="w-4 h-4 text-[#5a6b5d]" />
            <span>Guia do Iniciante</span>
          </button>

          <div className="h-4 w-px bg-[#5a6b5d]/20 hidden sm:block" />

          <button
            onClick={onExportData}
            className="p-1.5 text-[#5a6b5d] hover:text-[#3d403d] hover:bg-[#5a6b5d]/10 rounded-lg transition-colors"
            title="Exportar Dados (Backup JSON)"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onResetData}
            className="p-1.5 text-[#8c968d] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Restaurar Dados Iniciais de Exemplo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenNewTransaction}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-[#d4a373] hover:bg-[#c29263] text-white shadow-md shadow-[#d4a373]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nova Intenção / Registro</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#5a6b5d]/10 overflow-x-auto no-scrollbar">
        <nav className="flex space-x-1 sm:space-x-2 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#5a6b5d] text-white font-semibold shadow-xs'
                    : 'text-[#3d403d] hover:text-[#5a6b5d] hover:bg-[#e9edc9]/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#e9edc9]' : 'text-[#8c968d]'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-[#d4a373] text-white'
                        : 'bg-[#e9edc9] text-[#3d403d]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
