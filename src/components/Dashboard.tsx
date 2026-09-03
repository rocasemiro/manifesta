import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Heart, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Transaction, Category, SpiritualIntentionPillar, ActiveTab } from '../types';
import { formatCurrency, formatDateBR, getDaysRemaining } from '../utils/formatters';
import { SPIRITUAL_PILLARS } from '../data/spiritualMeta';

interface DashboardProps {
  transactions: Transaction[];
  categories: Category[];
  setActiveTab: (tab: ActiveTab) => void;
  onPayBillWithGratitude: (tx: Transaction) => void;
  onOpenNewTransaction: () => void;
  onOpenSpiritualMentor: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  transactions,
  categories,
  setActiveTab,
  onPayBillWithGratitude,
  onOpenNewTransaction,
  onOpenSpiritualMentor
}) => {
  // Calculate Totals for Manifested (Paid/Received) Transactions
  const manifestedTx = transactions.filter(t => t.status === 'manifested');
  
  const totalIncome = manifestedTx
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = manifestedTx
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  // Calculate Wellbeing Rating Average
  const ratedTx = manifestedTx.filter(t => t.wellbeingScore && t.wellbeingScore > 0);
  const avgWellbeing = ratedTx.length > 0
    ? (ratedTx.reduce((sum, t) => sum + (t.wellbeingScore || 0), 0) / ratedTx.length).toFixed(1)
    : '5.0';

  // Pending Bills sorted by Due Date
  const pendingBills = transactions
    .filter(t => t.status === 'pending')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Prepare monthly chart data
  const monthlyDataMap: Record<string, { month: string; income: number; expense: number }> = {};

  transactions.forEach(tx => {
    const dateStr = tx.paymentDate || tx.dueDate;
    if (!dateStr) return;
    const [year, month] = dateStr.split('-');
    if (!year || !month) return;
    
    const key = `${month}/${year.slice(2)}`;
    if (!monthlyDataMap[key]) {
      monthlyDataMap[key] = { month: key, income: 0, expense: 0 };
    }

    if (tx.status === 'manifested') {
      if (tx.type === 'income') {
        monthlyDataMap[key].income += tx.amount;
      } else {
        monthlyDataMap[key].expense += tx.amount;
      }
    }
  });

  const chartData = Object.values(monthlyDataMap);

  // Pillar distribution for expenses
  const pillarTotals: Record<SpiritualIntentionPillar, number> = {
    nutricao_templo: 0,
    acolhimento_lar: 0,
    crescimento_espiritual: 0,
    generosidade_partilha: 0,
    trabalho_proposito: 0,
    alegria_celebracao: 0,
    liberdade_futuro: 0,
  };

  manifestedTx.filter(t => t.type === 'expense').forEach(tx => {
    if (tx.spiritualPillar && pillarTotals[tx.spiritualPillar] !== undefined) {
      pillarTotals[tx.spiritualPillar] += tx.amount;
    }
  });

  return (
    <div className="space-y-6">
      {/* Daily Affirmation Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#5a6b5d] p-6 text-white shadow-md border border-[#5a6b5d]/30">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-[#e9edc9]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#e9edc9]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#e9edc9]">
                Afirmação Diária de Abundância
              </span>
            </div>
            <p className="text-lg sm:text-xl font-serif italic text-[#fdfcf7] font-medium leading-relaxed">
              &quot;O dinheiro é energia sagrada de troca. Cada valor que recebo abençoa meu empenho, e cada valor que entrego manifesta bem-estar e harmonia em minha vida.&quot;
            </p>
          </div>
          <button
            onClick={onOpenSpiritualMentor}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-xs font-semibold tracking-wide text-white transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4 text-[#e9edc9]" />
            <span>Consultar Mentor de Prosperidade</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Abundância Recebida */}
        <div className="bg-white p-5 rounded-2xl border border-[#5a6b5d]/15 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5a6b5d] uppercase tracking-wider">
              Abundância Recebida
            </span>
            <div className="p-2 rounded-xl bg-[#5a6b5d]/10 text-[#5a6b5d]">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#3d403d] font-serif">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs text-[#7d8e7b] mt-1 flex items-center gap-1 font-medium">
              <span>Fruto do seu propósito e trabalho</span>
            </p>
          </div>
        </div>

        {/* Card 2: Destino Consciente */}
        <div className="bg-white p-5 rounded-2xl border border-[#d4a373]/30 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#b88655] uppercase tracking-wider">
              Destino Consciente
            </span>
            <div className="p-2 rounded-xl bg-[#d4a373]/15 text-[#b88655]">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#3d403d] font-serif">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-[#b88655] mt-1 font-medium">
              Recursos aplicados para manifestar desejos
            </p>
          </div>
        </div>

        {/* Card 3: Saldo de Prosperidade */}
        <div className="bg-white p-5 rounded-2xl border border-[#7d8e7b]/20 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5a6b5d] uppercase tracking-wider">
              Saldo de Prosperidade
            </span>
            <div className="p-2 rounded-xl bg-[#7d8e7b]/15 text-[#5a6b5d]">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-2xl font-bold font-serif ${netBalance >= 0 ? 'text-[#3d403d]' : 'text-rose-600'}`}>
              {formatCurrency(netBalance)}
            </div>
            <p className="text-xs text-[#5a6b5d] mt-1 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#7d8e7b]" />
              <span>{netBalance >= 0 ? 'Sua reserva de paz está positiva' : 'Atenção aos próximos fluxos'}</span>
            </p>
          </div>
        </div>

        {/* Card 4: Impacto no Bem-Estar */}
        <div className="bg-[#e9edc9]/50 p-5 rounded-2xl border border-[#7d8e7b]/30 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#3d403d] uppercase tracking-wider">
              Índice de Bem-Estar
            </span>
            <div className="p-2 rounded-xl bg-[#ffffff] text-[#5a6b5d] shadow-2xs">
              <Heart className="w-5 h-5 fill-[#d4a373] text-[#d4a373]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#3d403d] font-serif flex items-center gap-1.5">
              <span>{avgWellbeing}</span>
              <span className="text-sm font-sans font-normal text-[#8c968d]">/ 5.0</span>
            </div>
            <p className="text-xs text-[#5a6b5d] mt-1 font-medium">
              {ratedTx.length} escolhas registradas com gratidão
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Bills Alert + Cash Flow Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pending Bills Alert Section (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#5a6b5d]/15 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#5a6b5d]/10 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#5a6b5d]" />
                <h3 className="font-serif font-bold text-[#3d403d] text-sm">
                  Próximos Compromissos Conscientes
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('bills')}
                className="text-xs text-[#5a6b5d] hover:text-[#3d403d] font-bold flex items-center gap-1"
              >
                <span>Ver Planejamento</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {pendingBills.length === 0 ? (
                <div className="p-6 text-center text-[#8c968d] text-xs rounded-xl bg-[#e9edc9]/30 border border-dashed border-[#7d8e7b]/40">
                  <CheckCircle2 className="w-8 h-8 text-[#5a6b5d] mx-auto mb-2" />
                  <p className="font-semibold text-[#3d403d]">Todas as contas estão em dia!</p>
                  <p className="mt-1">Nenhum vencimento pendente no momento.</p>
                </div>
              ) : (
                pendingBills.slice(0, 4).map((bill) => {
                  const daysInfo = getDaysRemaining(bill.dueDate);
                  const isExpense = bill.type === 'expense';
                  return (
                    <div
                      key={bill.id}
                      className="p-3.5 rounded-xl bg-[#fdfcf7] hover:bg-[#e9edc9]/20 border border-[#5a6b5d]/10 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded-md ${
                            isExpense ? 'bg-[#d4a373]/20 text-[#b88655]' : 'bg-[#5a6b5d]/15 text-[#5a6b5d]'
                          }`}>
                            {isExpense ? 'A Pagar' : 'A Receber'}
                          </span>
                          <span className={`text-[11px] font-semibold ${
                            daysInfo.isOverdue ? 'text-rose-600' : 'text-[#8c968d]'
                          }`}>
                            {daysInfo.text} ({formatDateBR(bill.dueDate)})
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#3d403d] truncate">
                          {bill.title}
                        </p>
                        <p className="text-xs font-bold text-[#3d403d] font-serif">
                          {formatCurrency(bill.amount)}
                        </p>
                      </div>

                      <button
                        onClick={() => onPayBillWithGratitude(bill)}
                        className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-[#5a6b5d] hover:bg-[#48564a] text-white shadow-xs shrink-0 flex items-center gap-1 transition-transform active:scale-95"
                        title="Marcar como realizado e expressar gratidão"
                      >
                        <Heart className="w-3.5 h-3.5 fill-[#e9edc9] text-[#e9edc9]" />
                        <span>Manifestar</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <button
            onClick={onOpenNewTransaction}
            className="w-full py-2.5 rounded-xl border border-[#d4a373]/40 bg-[#d4a373]/10 hover:bg-[#d4a373]/20 text-[#3d403d] text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <span>+ Agendar Nova Conta ou Recebimento</span>
          </button>
        </div>

        {/* Cash Flow Preview Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-[#5a6b5d]/15 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#5a6b5d]/10 pb-3">
            <div>
              <h3 className="font-serif font-bold text-[#3d403d] text-sm">
                Movimentação da Abundância (Fluxo)
              </h3>
              <p className="text-xs text-[#8c968d]">
                Comparativo simples de Entradas vs Destinos
              </p>
            </div>
            <button
              onClick={() => setActiveTab('cashflow')}
              className="text-xs text-[#5a6b5d] hover:text-[#3d403d] font-bold flex items-center gap-1"
            >
              <span>Ver Gráficos Detalhados</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[#8c968d] text-xs">
                Registre transações para visualizar o gráfico de fluxo.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5a6b5d" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#5a6b5d" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4a373" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#d4a373" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9edc9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8c968d' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#8c968d' }} tickFormatter={(val) => `R$${val}`} />
                  <Tooltip
                    formatter={(value: any) => [formatCurrency(Number(value) || 0), '']}
                    labelFormatter={(label) => `Mês: ${label}`}
                    contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e9edc9', backgroundColor: '#ffffff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    name="Abundância Recebida"
                    stroke="#5a6b5d"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    name="Destino Consciente"
                    stroke="#d4a373"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorExpense)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Spiritual Pillars Summary Row */}
      <div className="bg-white p-5 rounded-2xl border border-[#5a6b5d]/15 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#5a6b5d]/10 pb-3">
          <div>
            <h3 className="font-serif font-bold text-[#3d403d] text-sm">
              Destino do Seu Dinheiro por Pilar de Vida
            </h3>
            <p className="text-xs text-[#8c968d]">
              Acompanhe para onde sua energia financeira está sendo direcionada
            </p>
          </div>
          <button
            onClick={() => setActiveTab('gratitude')}
            className="text-xs text-[#5a6b5d] font-bold hover:underline"
          >
            Ver Relatório Completo de Gratidão
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(SPIRITUAL_PILLARS).map(([key, pillar]) => {
            const amount = pillarTotals[key as SpiritualIntentionPillar] || 0;
            const percentage = totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(0) : '0';

            return (
              <div
                key={key}
                className="p-3.5 rounded-xl bg-[#fdfcf7] border border-[#5a6b5d]/15 flex flex-col justify-between space-y-2 hover:border-[#5a6b5d]/30 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#5a6b5d]">
                      {pillar.title}
                    </span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#e9edc9] text-[#3d403d]">
                      {percentage}%
                    </span>
                  </div>
                  <p className="text-xs text-[#8c968d] line-clamp-1 mt-0.5">
                    {pillar.description}
                  </p>
                </div>
                <div className="text-sm font-bold text-[#3d403d] font-serif">
                  {formatCurrency(amount)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
