export type TransactionType = 'income' | 'expense';

export type TransactionStatus = 'manifested' | 'pending';

export type SpiritualIntentionPillar = 
  | 'nutricao_templo'        // Nutrição & Saúde do Corpo
  | 'acolhimento_lar'        // Lar, Conforto e Moradia
  | 'crescimento_espiritual'  // Educação, Sabedoria & Alma
  | 'generosidade_partilha'  // Apoio, Doações & Gratidão
  | 'trabalho_proposito'     // Fruto do Trabalho & Projetos
  | 'alegria_celebracao'     // Lazer, Conexão e Família
  | 'liberdade_futuro';      // Reservas da Prosperidade & Investimentos

export interface SpiritualIntentionMeta {
  id: SpiritualIntentionPillar;
  title: string;
  description: string;
  color: string;
  bgLight: string;
  borderColor: string;
  iconName: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  iconName: string;
  color: string;
  spiritualPillar: SpiritualIntentionPillar;
  description?: string;
}

export type RelationshipType = 'fornecedor' | 'credor' | 'beneficiario' | 'parceiro';

export interface SupplierCreditor {
  id: string;
  name: string;
  relationshipType: RelationshipType;
  category?: string;
  contactInfo?: string;
  notes?: string;
  gratitudeReason?: string; // Motivo de gratidão por ter essa parceria
  createdAt: string;
}

export interface Transaction {
  id: string;
  title: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  supplierCreditorId?: string;
  dueDate: string; // YYYY-MM-DD
  paymentDate?: string; // YYYY-MM-DD when status === 'manifested'
  status: TransactionStatus;
  spiritualPillar: SpiritualIntentionPillar;
  gratitudeNote?: string; // Pelo que sou grato por essa escolha?
  wellbeingScore?: number; // 1 a 5
  recurrence?: 'once' | 'monthly' | 'yearly';
  notes?: string;
}

export type ActiveTab = 
  | 'dashboard' 
  | 'gratitude' 
  | 'cashflow' 
  | 'bills' 
  | 'categories' 
  | 'contacts';

export interface SpiritualInsightResponse {
  insight: string;
  affirmation: string;
}
