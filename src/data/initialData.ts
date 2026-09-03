import { Category, SupplierCreditor, Transaction } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  // Receitas (Abundância Recebida)
  {
    id: 'cat_salario',
    name: 'Fruto do Trabalho / Salário',
    type: 'income',
    iconName: 'Briefcase',
    color: '#059669', // Emerald
    spiritualPillar: 'trabalho_proposito',
    description: 'Abundância gerada através da dedicação do seu tempo e talentos.'
  },
  {
    id: 'cat_servicos',
    name: 'Projetos & Consultorias',
    type: 'income',
    iconName: 'Sparkles',
    color: '#0d9488', // Teal
    spiritualPillar: 'trabalho_proposito',
    description: 'Trabalho autônomo com propósito e doação de valor.'
  },
  {
    id: 'cat_presentes',
    name: 'Presentes e Bençãos Inesperadas',
    type: 'income',
    iconName: 'Gift',
    color: '#7c3aed', // Purple
    spiritualPillar: 'trabalho_proposito',
    description: 'Fluxo espontâneo de abundância e gentileza de parceiros ou universo.'
  },
  {
    id: 'cat_rendimentos',
    name: 'Rendimentos da Reserva',
    type: 'income',
    iconName: 'TrendingUp',
    color: '#2563eb', // Blue
    spiritualPillar: 'liberdade_futuro',
    description: 'Frutos de sementes financeiras plantadas no passado.'
  },

  // Despesas (Destino Consciente)
  {
    id: 'cat_moradia',
    name: 'Lar & Templo Sagrado',
    type: 'expense',
    iconName: 'Home',
    color: '#d97706', // Amber
    spiritualPillar: 'acolhimento_lar',
    description: 'Aluguel, condomínio e sustentação do espaço de abrigo.'
  },
  {
    id: 'cat_energia',
    name: 'Energia & Água (Recursos da Vida)',
    type: 'expense',
    iconName: 'Zap',
    color: '#eab308', // Yellow
    spiritualPillar: 'acolhimento_lar',
    description: 'Agradecimento pelos serviços essenciais que trazem luz e fluidez.'
  },
  {
    id: 'cat_alimentacao',
    name: 'Alimentação Conectada & Mercado',
    type: 'expense',
    iconName: 'ShoppingBag',
    color: '#10b981', // Emerald
    spiritualPillar: 'nutricao_templo',
    description: 'Alimento que sustenta o corpo para cumprir sua missão no mundo.'
  },
  {
    id: 'cat_estudos',
    name: 'Estudos, Cursos & Livros',
    type: 'expense',
    iconName: 'BookOpen',
    color: '#4f46e5', // Indigo
    spiritualPillar: 'crescimento_espiritual',
    description: 'Investimento na expansão da mente e evolução da consciência.'
  },
  {
    id: 'cat_saude',
    name: 'Cuidado Vital & Saúde',
    type: 'expense',
    iconName: 'Heart',
    color: '#f43f5e', // Rose
    spiritualPillar: 'nutricao_templo',
    description: 'Terapias, medicamentos, exames e preservação do bem-estar.'
  },
  {
    id: 'cat_doacao',
    name: 'Ação Social & Partilha',
    type: 'expense',
    iconName: 'HeartHandshake',
    color: '#e11d48', // Red
    spiritualPillar: 'generosidade_partilha',
    description: 'Circular a energia da abundância para quem mais necessita.'
  },
  {
    id: 'cat_lazer',
    name: 'Lazer Restaurador & Conexão',
    type: 'expense',
    iconName: 'Smile',
    color: '#06b6d4', // Cyan
    spiritualPillar: 'alegria_celebracao',
    description: 'Momentos de alívio, passeios e nutrição da alegria familiar.'
  },
  {
    id: 'cat_investimento',
    name: 'Semente de Liberdade & Futuro',
    type: 'expense',
    iconName: 'ShieldCheck',
    color: '#3b82f6', // Blue
    spiritualPillar: 'liberdade_futuro',
    description: 'Construção da reserva para paz de espírito e sonhos futuros.'
  }
];

export const INITIAL_SUPPLIERS_CREDITORS: SupplierCreditor[] = [
  {
    id: 'supp_1',
    name: 'Supermercado Vida Verde',
    relationshipType: 'fornecedor',
    category: 'Alimentação',
    contactInfo: 'contato@vidaverde.com.br',
    notes: 'Fornece alimentos frescos e orgânicos para o lar.',
    gratitudeReason: 'Sou grato pelos agricultores e trabalhadores que cultivam e trazem comida saudável até nossa mesa.',
    createdAt: '2026-01-10'
  },
  {
    id: 'supp_2',
    name: 'Energia Clara S.A. (Luz)',
    relationshipType: 'fornecedor',
    category: 'Serviço Essencial',
    contactInfo: '0800-000-1234',
    notes: 'Concessionária de energia elétrica.',
    gratitudeReason: 'Sou grato por ter luz em casa, poder estudar à noite e manter os alimentos conservados na geladeira.',
    createdAt: '2026-01-15'
  },
  {
    id: 'supp_3',
    name: 'Escola Plena Expansão',
    relationshipType: 'fornecedor',
    category: 'Educação',
    contactInfo: 'contato@escolaplena.com.br',
    notes: 'Cursos de aperfeiçoamento e autoconhecimento.',
    gratitudeReason: 'Gratidão por mentores dedicados a nos ensinar habilidades que transformam nossa vida.',
    createdAt: '2026-02-01'
  },
  {
    id: 'supp_4',
    name: 'Banco da Felicidade (Financiamento do Lar)',
    relationshipType: 'credor',
    category: 'Financiamento Imobiliário',
    contactInfo: 'atendimento@bancofelicidade.com',
    notes: 'Parceiro financeiro no financiamento do apartamento.',
    gratitudeReason: 'Agradeço por ter tido o crédito necessário para conquistar meu lar abençoado.',
    createdAt: '2026-01-01'
  },
  {
    id: 'supp_5',
    name: 'ONG Mãos da Esperança',
    relationshipType: 'beneficiario',
    category: 'Causa Social',
    contactInfo: 'doacoes@maosdaesperanca.org',
    notes: 'Atende crianças e idosos em situação de vulnerabilidade.',
    gratitudeReason: 'Agradeço a oportunidade de ser um instrumento de suporte e amor na vida de outras pessoas.',
    createdAt: '2026-02-10'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1',
    title: 'Recebimento do Trabalho Dedicado',
    type: 'income',
    amount: 5200.00,
    categoryId: 'cat_salario',
    supplierCreditorId: 'supp_3',
    dueDate: '2026-08-05',
    paymentDate: '2026-08-05',
    status: 'manifested',
    spiritualPillar: 'trabalho_proposito',
    gratitudeNote: 'Sou profundamente grato pela oportunidade de honrar minha família com o fruto do meu esforço.',
    wellbeingScore: 5
  },
  {
    id: 'tx_2',
    title: 'Prestação do Lar Sagrado',
    type: 'expense',
    amount: 1450.00,
    categoryId: 'cat_moradia',
    supplierCreditorId: 'supp_4',
    dueDate: '2026-08-10',
    paymentDate: '2026-08-09',
    status: 'manifested',
    spiritualPillar: 'acolhimento_lar',
    gratitudeNote: 'Gasto abençoado! Sou grato por ter um teto seguro e acolhedor onde durmo em paz.',
    wellbeingScore: 5
  },
  {
    id: 'tx_3',
    title: 'Feira & Mercado Consciente',
    type: 'expense',
    amount: 680.00,
    categoryId: 'cat_alimentacao',
    supplierCreditorId: 'supp_1',
    dueDate: '2026-08-12',
    paymentDate: '2026-08-12',
    status: 'manifested',
    spiritualPillar: 'nutricao_templo',
    gratitudeNote: 'Gratidão pela abundância de vegetais e refeições que fortalecem meu corpo para viver.',
    wellbeingScore: 5
  },
  {
    id: 'tx_4',
    title: 'Energia Elétrica & Iluminação',
    type: 'expense',
    amount: 210.00,
    categoryId: 'cat_energia',
    supplierCreditorId: 'supp_2',
    dueDate: '2026-08-18',
    paymentDate: '2026-08-18',
    status: 'manifested',
    spiritualPillar: 'acolhimento_lar',
    gratitudeNote: 'Agradeço por ter eletricidade no meu dia a dia, geladeira funcionando e internet para trabalhar.',
    wellbeingScore: 4
  },
  {
    id: 'tx_5',
    title: 'Curso de Sabedoria & Liderança',
    type: 'expense',
    amount: 320.00,
    categoryId: 'cat_estudos',
    supplierCreditorId: 'supp_3',
    dueDate: '2026-08-20',
    paymentDate: '2026-08-20',
    status: 'manifested',
    spiritualPillar: 'crescimento_espiritual',
    gratitudeNote: 'Invisto em minha mente com alegria sabendo que esse conhecimento dará muitos frutos.',
    wellbeingScore: 5
  },
  {
    id: 'tx_6',
    title: 'Partilha Voluntária com ONG',
    type: 'expense',
    amount: 150.00,
    categoryId: 'cat_doacao',
    supplierCreditorId: 'supp_5',
    dueDate: '2026-08-25',
    paymentDate: '2026-08-25',
    status: 'manifested',
    spiritualPillar: 'generosidade_partilha',
    gratitudeNote: 'O dinheiro que dou com amor retorna multiplicado em forma de paz e utilidade social.',
    wellbeingScore: 5
  },
  {
    id: 'tx_7',
    title: 'Semente de Liberdade (Investimento)',
    type: 'expense',
    amount: 500.00,
    categoryId: 'cat_investimento',
    dueDate: '2026-08-28',
    paymentDate: '2026-08-28',
    status: 'manifested',
    spiritualPillar: 'liberdade_futuro',
    gratitudeNote: 'Agradeço pelo privilégio de guardar recursos que trarão tranquilidade no futuro.',
    wellbeingScore: 5
  },

  // Contas a Pagar / Receber Futuras (Pending)
  {
    id: 'tx_8',
    title: 'Próximo Recebimento do Trabalho',
    type: 'income',
    amount: 5200.00,
    categoryId: 'cat_salario',
    dueDate: '2026-09-05',
    status: 'pending',
    spiritualPillar: 'trabalho_proposito',
    notes: 'Expectativa amorosa do fruto do meu trabalho.'
  },
  {
    id: 'tx_9',
    title: 'Projeto Freelance de Design',
    type: 'income',
    amount: 1200.00,
    categoryId: 'cat_servicos',
    dueDate: '2026-09-15',
    status: 'pending',
    spiritualPillar: 'trabalho_proposito',
    notes: 'Serviço prestado a cliente com gratidão.'
  },
  {
    id: 'tx_10',
    title: 'Aluguel do Lar Sagrado',
    type: 'expense',
    amount: 1450.00,
    categoryId: 'cat_moradia',
    supplierCreditorId: 'supp_4',
    dueDate: '2026-09-10',
    status: 'pending',
    spiritualPillar: 'acolhimento_lar',
    gratitudeNote: 'Manter meu abrigo seguro é meu compromisso consciente de paz.',
    wellbeingScore: 5
  },
  {
    id: 'tx_11',
    title: 'Conta de Energia Elétrica',
    type: 'expense',
    amount: 225.00,
    categoryId: 'cat_energia',
    supplierCreditorId: 'supp_2',
    dueDate: '2026-09-18',
    status: 'pending',
    spiritualPillar: 'acolhimento_lar',
    gratitudeNote: 'Luz que ilumina meu lar e traz aconchego às noites.',
    wellbeingScore: 4
  },
  {
    id: 'tx_12',
    title: 'Mensalidade Escola de Sabedoria',
    type: 'expense',
    amount: 320.00,
    categoryId: 'cat_estudos',
    supplierCreditorId: 'supp_3',
    dueDate: '2026-09-20',
    status: 'pending',
    spiritualPillar: 'crescimento_espiritual',
    gratitudeNote: 'Alimento para a alma e expansão da consciência.',
    wellbeingScore: 5
  }
];
