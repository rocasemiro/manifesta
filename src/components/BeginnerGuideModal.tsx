import React from 'react';
import { BookOpen, Sparkles, Heart, TrendingUp, CalendarClock, Users, CheckCircle2 } from 'lucide-react';

interface BeginnerGuideModalProps {
  onClose: () => void;
}

export const BeginnerGuideModal: React.FC<BeginnerGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#3d403d]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#5a6b5d]/20 shadow-2xl w-full max-w-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#5a6b5d]/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#e9edc9] text-[#5a6b5d]">
              <BookOpen className="w-5 h-5 text-[#5a6b5d]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#3d403d] text-lg">
                Guia da Prosperidade Financeira Consciente
              </h3>
              <p className="text-xs text-[#8c968d]">
                Aprenda a gerenciar suas finanças de forma simples e inspiradora, sem complicação
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

        <div className="space-y-4 text-xs text-[#3d403d] leading-relaxed font-medium">
          {/* Section 1 */}
          <div className="p-4 rounded-xl bg-[#e9edc9]/50 border border-[#7d8e7b]/30 space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-[#5a6b5d] font-serif">
              <Sparkles className="w-4 h-4 text-[#5a6b5d]" />
              <span>1. Suas Despesas como Destino Consciente</span>
            </div>
            <p className="text-[#3d403d]">
              Esqueça a ideia de que pagar contas é perder dinheiro. No <strong>Manifesta</strong>, cada despesa é o direcionamento consciente da sua vontade para manifestar o que você deseja: segurança no lar, boa comida, saúde e crescimento.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-4 rounded-xl bg-[#e9edc9]/30 border border-[#7d8e7b]/20 space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-[#5a6b5d] font-serif">
              <Heart className="w-4 h-4 text-[#d4a373]" />
              <span>2. Relatórios de Gratidão & Impacto no Bem-Estar</span>
            </div>
            <p className="text-[#3d403d]">
              Ao quitar qualquer valor, você é convidado a escrever uma mensagem de gratidão. O aplicativo gera relatórios visuais mostrando como seu dinheiro se transformou em bem-estar e paz em 7 Pilares Espirituais.
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-4 rounded-xl bg-[#e9edc9]/50 border border-[#7d8e7b]/30 space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-[#5a6b5d] font-serif">
              <TrendingUp className="w-4 h-4 text-[#5a6b5d]" />
              <span>3. Fluxo de Caixa (A Respiração Financeira)</span>
            </div>
            <p className="text-[#3d403d]">
              O gráfico de Fluxo de Caixa mostra o ritmo entre a <strong>Abundância Recebida</strong> (entradas) e o <strong>Destino Consciente</strong> (saídas). Ele permite prever se você terá folga financeira com gráficos coloridos e simples.
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-4 rounded-xl bg-[#e9edc9]/30 border border-[#7d8e7b]/20 space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-[#5a6b5d] font-serif">
              <CalendarClock className="w-4 h-4 text-[#5a6b5d]" />
              <span>4. Contas a Pagar e Receber</span>
            </div>
            <p className="text-[#3d403d]">
              Organize seus compromissos futuros por data de vencimento. Quando chegar o dia do pagamento, clique em <strong>&quot;Manifestar com Gratidão&quot;</strong> para comemorar a quitação com celebração visual!
            </p>
          </div>

          {/* Section 5 */}
          <div className="p-4 rounded-xl bg-[#fdfcf7] border border-[#5a6b5d]/15 space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-[#3d403d] font-serif">
              <Users className="w-4 h-4 text-[#5a6b5d]" />
              <span>5. Fornecedores, Credores e Beneficiários</span>
            </div>
            <p className="text-[#3d403d]">
              Cadastre quem presta serviços para você ou quem disponibilizou crédito para o seu lar. Reconheça essa parceria escrevendo motivos de gratidão para cada instituição ou trabalhador.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-[#5a6b5d]/10">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#5a6b5d] hover:bg-[#3d403d] text-white text-xs font-bold shadow-xs transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Compreendi, Voltar ao Aplicativo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
