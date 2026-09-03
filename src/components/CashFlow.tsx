import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  LineChart as LineChartIcon, 
  AreaChart as AreaChartIcon, 
  CheckCircle, 
  HelpCircle,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/formatters';

interface CashFlowProps {
  transactions: Transaction[];
}

export const CashFlow: React.FC<CashFlowProps> = ({ transactions }) => {
  const [chartType, setChartType] = useState<'area' | 'bar' | 'line'>('area');
  const [timeFilter, setTimeFilter] = useState<'all' | '3months' | 'currentMonth'>('all');

  // Filter manifested transactions
  const manifestedTx = transactions.filter(t => t.status === 'manifested');

  // Aggregate monthly data
  const monthlyMap: Record<string, { key: string; monthLabel: string; income: number; expense: number; balance: number }> = {};

  manifestedTx.forEach(tx => {
    const dateStr = tx.paymentDate || tx.dueDate;
    if (!dateStr) return;
    const [year, month] = dateStr.split('-');
    if (!year || !month) return;

    const key = `${year}-${month}`;
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const monthIndex = parseInt(month, 10) - 1;
    const label = `${monthNames[monthIndex] || month}/${year}`;

    if (!monthlyMap[key]) {
      monthlyMap[key] = { key, monthLabel: label, income: 0, expense: 0, balance: 0 };
    }

    if (tx.type === 'income') {
      monthlyMap[key].income += tx.amount;
    } else {
      monthlyMap[key].expense += tx.amount;
    }
  });

  // Calculate balance per month
  Object.keys(monthlyMap).forEach(key => {
    monthlyMap[key].balance = monthlyMap[key].income - monthlyMap[key].expense;
  });

  let sortedData = Object.values(monthlyMap).sort((a, b) => a.key.localeCompare(b.key));

  if (timeFilter === '3months') {
    sortedData = sortedData.slice(-3);
  } else if (timeFilter === 'currentMonth') {
    sortedData = sortedData.slice(-1);
  }

  const grandIncome = sortedData.reduce((sum, d) => sum + d.income, 0);
  const grandExpense = sortedData.reduce((sum, d) => sum + d.expense, 0);
  const grandBalance = grandIncome - grandExpense;

  return (
    <div className="space-y-6">
      {/* Beginner Explanation Banner */}
      <div className="bg-[#5a6b5d] text-white p-6 rounded-2xl shadow-md border border-[#5a6b5d]/30 space-y-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#e9edc9]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#e9edc9]">
            Compreendendo o Fluxo de Caixa sem Complicações
          </span>
        </div>
        <h2 className="text-2xl font-serif font-bold text-[#fdfcf7]">
          A Respiração do Seu Dinheiro
        </h2>
        <p className="text-xs sm:text-sm text-[#fdfcf7]/90 leading-relaxed max-w-3xl font-medium">
          O Fluxo de Caixa nada mais é do que observar o ritmo de entradas e saídas. Como a inspiração (abundância recebida) e a expiração (destino consciente), o equilíbrio entre as duas garante o seu fôlego financeiro e tranquilidade para o futuro.
        </p>
      </div>

      {/* Chart Controls & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#5a6b5d]/15 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Chart View Toggle */}
        <div className="flex items-center gap-1.5 bg-[#fdfcf7] p-1 rounded-xl border border-[#5a6b5d]/10">
          <button
            onClick={() => setChartType('area')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartType === 'area'
                ? 'bg-[#5a6b5d] text-white shadow-xs'
                : 'text-[#3d403d] hover:text-[#5a6b5d]'
            }`}
          >
            <AreaChartIcon className="w-3.5 h-3.5" />
            <span>Fluxo Fluido (Área)</span>
          </button>

          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartType === 'bar'
                ? 'bg-[#5a6b5d] text-white shadow-xs'
                : 'text-[#3d403d] hover:text-[#5a6b5d]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Comparativo (Barras)</span>
          </button>

          <button
            onClick={() => setChartType('line')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartType === 'line'
                ? 'bg-[#5a6b5d] text-white shadow-xs'
                : 'text-[#3d403d] hover:text-[#5a6b5d]'
            }`}
          >
            <LineChartIcon className="w-3.5 h-3.5" />
            <span>Tendência de Saldo (Linha)</span>
          </button>
        </div>

        {/* Time Filter */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#8c968d]" />
          <span className="text-xs font-semibold text-[#3d403d]">Período:</span>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="bg-[#fdfcf7] border border-[#5a6b5d]/15 rounded-xl text-xs font-semibold px-3 py-1.5 text-[#3d403d] focus:outline-none"
          >
            <option value="all">Visão Geral Completa</option>
            <option value="3months">Últimos 3 Meses</option>
            <option value="currentMonth">Mês Mais Recente</option>
          </select>
        </div>
      </div>

      {/* Recharts Component Container */}
      <div className="bg-white p-6 rounded-2xl border border-[#5a6b5d]/15 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#5a6b5d]/10 pb-3">
          <div>
            <h3 className="font-serif font-bold text-[#3d403d] text-base">
              Gráfico Dinâmico de Entradas vs Destinos
            </h3>
            <p className="text-xs text-[#8c968d]">
              Valores calculados em Reais (R$) com base nas transações consolidadas
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#5a6b5d]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5a6b5d]" />
              Abundância Recebida
            </span>
            <span className="flex items-center gap-1.5 text-[#b88655]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d4a373]" />
              Destino Consciente
            </span>
          </div>
        </div>

        <div className="h-80 w-full">
          {sortedData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-[#8c968d]">
              Nenhuma movimentação registrada para o período selecionado.
            </div>
          ) : chartType === 'area' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sortedData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5a6b5d" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#5a6b5d" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="areaExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4a373" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#d4a373" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$${v}`} />
                <Tooltip formatter={(val: any) => [formatCurrency(Number(val) || 0), '']} />
                <Legend />
                <Area type="monotone" dataKey="income" name="Abundância Recebida" stroke="#5a6b5d" fill="url(#areaIncome)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="expense" name="Destino Consciente" stroke="#d4a373" fill="url(#areaExpense)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          ) : chartType === 'bar' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$${v}`} />
                <Tooltip formatter={(val: any) => [formatCurrency(Number(val) || 0), '']} />
                <Legend />
                <Bar dataKey="income" name="Abundância Recebida" fill="#5a6b5d" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" name="Destino Consciente" fill="#d4a373" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sortedData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `R$${v}`} />
                <Tooltip formatter={(val: any) => [formatCurrency(Number(val) || 0), '']} />
                <Legend />
                <Line type="monotone" dataKey="income" name="Abundância Recebida" stroke="#5a6b5d" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="expense" name="Destino Consciente" stroke="#d4a373" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="balance" name="Saldo de Prosperidade" stroke="#7d8e7b" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white p-6 rounded-2xl border border-[#5a6b5d]/15 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#5a6b5d]/10 pb-3">
          <h3 className="font-serif font-bold text-[#3d403d] text-base">
            Detalhamento de Fluxo Mensal
          </h3>
          <span className="text-xs text-[#8c968d] font-medium">
            Linguagem simplificada para iniciantes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#3d403d]">
            <thead>
              <tr className="bg-[#fdfcf7] border-b border-[#5a6b5d]/15 text-[#3d403d] font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Mês / Período</th>
                <th className="py-3 px-4 text-[#5a6b5d]">Abundância Recebida</th>
                <th className="py-3 px-4 text-[#b88655]">Destino Consciente</th>
                <th className="py-3 px-4 text-[#7d8e7b]">Resultado de Paz (Saldo)</th>
                <th className="py-3 px-4 text-[#3d403d]">Indicador de Retenção</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5a6b5d]/10 font-medium">
              {sortedData.map((row) => {
                const retentionRate = row.income > 0 ? (((row.income - row.expense) / row.income) * 100).toFixed(0) : '0';
                const isPositive = row.balance >= 0;

                return (
                  <tr key={row.key} className="hover:bg-[#e9edc9]/20 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#3d403d]">{row.monthLabel}</td>
                    <td className="py-3.5 px-4 text-[#5a6b5d] font-serif font-semibold">{formatCurrency(row.income)}</td>
                    <td className="py-3.5 px-4 text-[#b88655] font-serif font-semibold">{formatCurrency(row.expense)}</td>
                    <td className={`py-3.5 px-4 font-serif font-bold ${isPositive ? 'text-[#5a6b5d]' : 'text-rose-700'}`}>
                      {formatCurrency(row.balance)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        isPositive ? 'bg-[#e9edc9] text-[#3d403d]' : 'bg-rose-100 text-rose-800'
                      }`}>
                        <CheckCircle className="w-3 h-3" />
                        {retentionRate}% da abundância mantida
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-[#fdfcf7] font-bold text-[#3d403d] border-t-2 border-[#5a6b5d]/20">
                <td className="py-3.5 px-4">TOTAL DO PERÍODO</td>
                <td className="py-3.5 px-4 text-[#5a6b5d] font-serif">{formatCurrency(grandIncome)}</td>
                <td className="py-3.5 px-4 text-[#b88655] font-serif">{formatCurrency(grandExpense)}</td>
                <td className={`py-3.5 px-4 font-serif ${grandBalance >= 0 ? 'text-[#5a6b5d]' : 'text-rose-700'}`}>
                  {formatCurrency(grandBalance)}
                </td>
                <td className="py-3.5 px-4 text-[#8c968d] font-normal text-[11px]">
                  {grandIncome > 0 ? `${(((grandIncome - grandExpense) / grandIncome) * 100).toFixed(0)}% retido` : '-'}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
