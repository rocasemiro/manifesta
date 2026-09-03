import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  Star, 
  Quote, 
  Bot, 
  Calendar, 
  Filter
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Transaction, Category, SpiritualIntentionPillar } from '../types';
import { formatCurrency, formatDateLongBR } from '../utils/formatters';
import { SPIRITUAL_PILLARS } from '../data/spiritualMeta';

interface GratitudeReportProps {
  transactions: Transaction[];
  categories: Category[];
  onOpenSpiritualMentor: () => void;
}

export const GratitudeReport: React.FC<GratitudeReportProps> = ({
  transactions,
  categories,
  onOpenSpiritualMentor
}) => {
  const [selectedPillarFilter, setSelectedPillarFilter] = useState<string>('all');
  const [selectedScoreFilter, setSelectedScoreFilter] = useState<number>(0);

  // Filter manifested expenses with gratitude notes or ratings
  const gratitudeEntries = transactions.filter(t => 
    t.status === 'manifested' && 
    t.type === 'expense' && 
    (t.gratitudeNote || (t.wellbeingScore && t.wellbeingScore > 0))
  );

  // Filtered list
  const filteredEntries = gratitudeEntries.filter(t => {
    if (selectedPillarFilter !== 'all' && t.spiritualPillar !== selectedPillarFilter) {
      return false;
    }
    if (selectedScoreFilter > 0 && t.wellbeingScore !== selectedScoreFilter) {
      return false;
    }
    return true;
  });

  // Calculate pillar distribution for expenses
  const pillarTotals: Record<SpiritualIntentionPillar, number> = {
    nutricao_templo: 0,
    acolhimento_lar: 0,
    crescimento_espiritual: 0,
    generosidade_partilha: 0,
    trabalho_proposito: 0,
    alegria_celebracao: 0,
    liberdade_futuro: 0,
  };

  let totalExpenseAmount = 0;
  transactions.filter(t => t.status === 'manifested' && t.type === 'expense').forEach(t => {
    if (t.spiritualPillar && pillarTotals[t.spiritualPillar] !== undefined) {
      pillarTotals[t.spiritualPillar] += t.amount;
      totalExpenseAmount += t.amount;
    }
  });

  const pieChartData = Object.entries(SPIRITUAL_PILLARS).map(([key, pillar]) => {
    const amount = pillarTotals[key as SpiritualIntentionPillar] || 0;
    return {
      name: pillar.title,
      value: amount,
      color: pillar.color.includes('emerald') ? '#059669' :
             pillar.color.includes('amber') ? '#d97706' :
             pillar.color.includes('indigo') ? '#4f46e5' :
             pillar.color.includes('rose') ? '#e11d48' :
             pillar.color.includes('yellow') ? '#ca8a04' :
             pillar.color.includes('teal') ? '#0d9488' : '#2563eb'
    };
  }).filter(d => d.value > 0);

  // Average wellbeing
  const avgWellbeing = gratitudeEntries.length > 0
    ? (gratitudeEntries.reduce((sum, t) => sum + (t.wellbeingScore || 5), 0) / gratitudeEntries.length).toFixed(1)
    : '5.0';

  return (
    <div className="space-y-6">
      {/* Banner Intro */}
      <div className="bg-[#5a6b5d] rounded-2xl p-6 text-white shadow-md border border-[#5a6b5d]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-[#e9edc9] text-[#e9edc9]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#e9edc9]">
              Relatório de Impacto no Bem-Estar & Gratidão
            </span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-[#fdfcf7]">
            Sua Relação Sagrada com o Dinheiro
          </h2>
          <p className="text-xs sm:text-sm text-[#fdfcf7]/90 font-medium leading-relaxed">
            Neste relatório, as despesas não são vistas como perdas, mas como confirmações conscientes dos valores que enriquecem sua existência: saúde, conforto, sabedoria e fraternidade.
          </p>
        </div>

        <button
          onClick={onOpenSpiritualMentor}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#e9edc9] text-[#3d403d] font-bold text-xs hover:bg-white shadow-md transition-all shrink-0"
        >
          <Bot className="w-4 h-4 text-[#5a6b5d]" />
          <span>Gerar Reflexão de Gratidão com IA</span>
        </button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#d4a373]/30 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-[#b88655]">
            Total Destinado Consciente
          </div>
          <div className="text-2xl font-serif font-bold text-[#3d403d] mt-2">
            {formatCurrency(totalExpenseAmount)}
          </div>
          <p className="text-xs text-[#8c968d] mt-1 font-medium">
            Recursos transformados em bem-estar real
          </p>
        </div>

        <div className="bg-[#e9edc9]/50 p-5 rounded-2xl border border-[#7d8e7b]/30 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-[#3d403d]">
            Anotações de Gratidão Registradas
          </div>
          <div className="text-2xl font-serif font-bold text-[#3d403d] mt-2 flex items-center gap-2">
            <span>{gratitudeEntries.length}</span>
            <span className="text-xs font-sans font-semibold text-[#5a6b5d]">bênçãos escritas</span>
          </div>
          <p className="text-xs text-[#5a6b5d] mt-1 font-medium">
            Mural ativamente nutrido por você
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#5a6b5d]/15 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-[#5a6b5d]">
            Índice de Satisfação & Paz
          </div>
          <div className="text-2xl font-serif font-bold text-[#3d403d] mt-2 flex items-center gap-2">
            <span>{avgWellbeing}</span>
            <div className="flex text-[#d4a373]">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 fill-[#d4a373] text-[#d4a373]" />
              ))}
            </div>
          </div>
          <p className="text-xs text-[#8c968d] mt-1 font-medium">
            Sua paz de espírito nas escolhas financeiras
          </p>
        </div>
      </div>

      {/* Donut Chart & Pillar Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#5a6b5d]/15 shadow-xs space-y-4">
          <div>
            <h3 className="font-serif font-bold text-[#3d403d] text-base">
              Distribuição da Sua Vontade por Pilar de Vida
            </h3>
            <p className="text-xs text-[#8c968d]">
              Para onde fluiu a maior parte da sua energia de abundância?
            </p>
          </div>

          <div className="h-64 w-full">
            {pieChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[#8c968d]">
                Nenhuma despesa realizada registrada ainda.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [formatCurrency(Number(val) || 0), '']} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Pillars Detail List */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#5a6b5d]/15 shadow-xs space-y-3">
          <h3 className="font-serif font-bold text-[#3d403d] text-base border-b border-[#5a6b5d]/10 pb-2">
            Pilares de Prosperidade Ativa
          </h3>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {Object.entries(SPIRITUAL_PILLARS).map(([key, pillar]) => {
              const amount = pillarTotals[key as SpiritualIntentionPillar] || 0;
              const percentage = totalExpenseAmount > 0 ? ((amount / totalExpenseAmount) * 100).toFixed(1) : '0';

              return (
                <div key={key} className="p-3 rounded-xl bg-[#fdfcf7] border border-[#5a6b5d]/15 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#5a6b5d]">
                      {pillar.title}
                    </span>
                    <p className="text-[11px] text-[#8c968d] line-clamp-1">
                      {pillar.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold font-serif text-[#3d403d]">
                      {formatCurrency(amount)}
                    </div>
                    <span className="text-[10px] font-semibold text-[#8c968d]">
                      {percentage}% do destino
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Gratitude Wall Section */}
      <div className="bg-white p-6 rounded-2xl border border-[#5a6b5d]/15 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#5a6b5d]/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Quote className="w-5 h-5 text-[#d4a373]" />
              <h3 className="font-serif font-bold text-[#3d403d] text-lg">
                Mural de Gratidão & Motivações Sagradas
              </h3>
            </div>
            <p className="text-xs text-[#8c968d]">
              Registros do porquê cada pagamento valeu a pena e gerou valor real em sua vida
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-[#fdfcf7] px-2.5 py-1.5 rounded-xl border border-[#5a6b5d]/15 text-xs text-[#3d403d]">
              <Filter className="w-3.5 h-3.5 text-[#5a6b5d]" />
              <select
                value={selectedPillarFilter}
                onChange={(e) => setSelectedPillarFilter(e.target.value)}
                className="bg-transparent font-medium focus:outline-none"
              >
                <option value="all">Todos os Pilares</option>
                {Object.entries(SPIRITUAL_PILLARS).map(([k, p]) => (
                  <option key={k} value={k}>{p.title}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-[#fdfcf7] px-2.5 py-1.5 rounded-xl border border-[#5a6b5d]/15 text-xs text-[#3d403d]">
              <Star className="w-3.5 h-3.5 text-[#d4a373] fill-[#d4a373]" />
              <select
                value={selectedScoreFilter}
                onChange={(e) => setSelectedScoreFilter(Number(e.target.value))}
                className="bg-transparent font-medium focus:outline-none"
              >
                <option value={0}>Todas as Notas</option>
                <option value={5}>5 Estrelas (Plena Paz)</option>
                <option value={4}>4 Estrelas (Muito Bom)</option>
                <option value={3}>3 Estrelas (Neutro/Suficiente)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Gratitude Cards Grid */}
        {filteredEntries.length === 0 ? (
          <div className="p-8 text-center text-[#8c968d] text-xs bg-[#e9edc9]/30 rounded-xl border border-dashed border-[#7d8e7b]/30 space-y-2">
            <Sparkles className="w-8 h-8 text-[#5a6b5d] mx-auto" />
            <p className="font-semibold text-[#3d403d]">Nenhum registro de gratidão encontrado com os filtros selecionados.</p>
            <p>Ao realizar pagamentos, escreva uma mensagem de gratidão pelo serviço ou produto recebido!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEntries.map((entry) => {
              const pillarMeta = SPIRITUAL_PILLARS[entry.spiritualPillar] || SPIRITUAL_PILLARS.acolhimento_lar;

              return (
                <div
                  key={entry.id}
                  className="bg-[#e9edc9]/40 hover:bg-[#e9edc9]/70 p-4 rounded-xl border border-[#7d8e7b]/30 space-y-3 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#5a6b5d] text-white">
                        {pillarMeta.title}
                      </span>
                      <div className="flex text-[#d4a373]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= (entry.wellbeingScore || 5)
                                ? 'fill-[#d4a373] text-[#d4a373]'
                                : 'text-[#8c968d]/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <h4 className="font-serif font-bold text-[#3d403d] text-sm">
                      {entry.title}
                    </h4>

                    {entry.gratitudeNote && (
                      <p className="text-xs text-[#3d403d] italic font-medium bg-white/90 p-2.5 rounded-lg border border-[#7d8e7b]/20 leading-relaxed">
                        &quot;{entry.gratitudeNote}&quot;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#7d8e7b]/20 text-[#8c968d]">
                    <span className="font-semibold text-[#3d403d] font-serif">
                      {formatCurrency(entry.amount)}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3 text-[#8c968d]" />
                      {formatDateLongBR(entry.paymentDate || entry.dueDate)}
                    </span>
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
