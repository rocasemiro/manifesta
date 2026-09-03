import { SpiritualIntentionMeta, SpiritualIntentionPillar } from '../types';

export const SPIRITUAL_PILLARS: Record<SpiritualIntentionPillar, SpiritualIntentionMeta> = {
  nutricao_templo: {
    id: 'nutricao_templo',
    title: 'Nutrição & Saúde do Templo',
    description: 'Alimentação consciente, cuidados médicos, atividades físicas e energia vital.',
    color: 'text-emerald-700',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    iconName: 'Apple'
  },
  acolhimento_lar: {
    id: 'acolhimento_lar',
    title: 'Acolhimento & Conforto do Lar',
    description: 'Energia elétrica, água, moradia, manutenção do espaço sagrado onde você vive.',
    color: 'text-amber-700',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconName: 'Home'
  },
  crescimento_espiritual: {
    id: 'crescimento_espiritual',
    title: 'Expansão & Sabedoria da Alma',
    description: 'Livros, cursos, mentorias, terapias, retiros e aprendizado contínuo.',
    color: 'text-indigo-700',
    bgLight: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    iconName: 'BookOpen'
  },
  generosidade_partilha: {
    id: 'generosidade_partilha',
    title: 'Generosidade & Partilha',
    description: 'Apoio a causas, doações voluntárias, ajuda a familiares e dízimo do coração.',
    color: 'text-rose-700',
    bgLight: 'bg-rose-50',
    borderColor: 'border-rose-200',
    iconName: 'HeartHandshake'
  },
  trabalho_proposito: {
    id: 'trabalho_proposito',
    title: 'Fruto do Trabalho & Propósito',
    description: 'Rendas de serviços, salários, vendas e abundância gerada pelo seu talento.',
    color: 'text-yellow-800',
    bgLight: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconName: 'Sparkles'
  },
  alegria_celebracao: {
    id: 'alegria_celebracao',
    title: 'Alegria & Celebração da Vida',
    description: 'Momentos com quem se ama, viagens, lazer restaurador e cultivo de memórias.',
    color: 'text-teal-700',
    bgLight: 'bg-teal-50',
    borderColor: 'border-teal-200',
    iconName: 'Smile'
  },
  liberdade_futuro: {
    id: 'liberdade_futuro',
    title: 'Reserva de Liberdade & Futuro',
    description: 'Investimentos, fundo de serenidade, reservas para manifestações de longo prazo.',
    color: 'text-blue-700',
    bgLight: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconName: 'ShieldCheck'
  }
};
