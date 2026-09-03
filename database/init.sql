-- Manifesta: Schema do Banco de Dados PostgreSQL
-- Sistema de Finanças Conscientes & Abundância Espiritual

-- 1. Criar extensão para UUIDs se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Categorias
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    icon_name VARCHAR(100) NOT NULL DEFAULT 'Tag',
    color VARCHAR(30) NOT NULL DEFAULT '#5a6b5d',
    spiritual_pillar VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Fornecedores, Credores e Beneficiários
CREATE TABLE IF NOT EXISTS suppliers_creditors (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    relationship_type VARCHAR(50) NOT NULL CHECK (relationship_type IN ('fornecedor', 'credor', 'beneficiario', 'parceiro')),
    category VARCHAR(100),
    contact_info TEXT,
    notes TEXT,
    gratitude_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Transações (Entradas e Saídas)
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    amount NUMERIC(12, 2) NOT NULL,
    category_id VARCHAR(100) REFERENCES categories(id) ON DELETE SET NULL,
    supplier_creditor_id VARCHAR(100) REFERENCES suppliers_creditors(id) ON DELETE SET NULL,
    due_date DATE NOT NULL,
    payment_date DATE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('manifested', 'pending')),
    spiritual_pillar VARCHAR(100) NOT NULL,
    gratitude_note TEXT,
    wellbeing_score INTEGER CHECK (wellbeing_score BETWEEN 1 AND 5),
    recurrence VARCHAR(20) CHECK (recurrence IN ('once', 'monthly', 'yearly')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para otimização de consultas financeiras
CREATE INDEX IF NOT EXISTS idx_transactions_due_date ON transactions(due_date);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_pillar ON transactions(spiritual_pillar);

-- Inserir Categorias Padrão
INSERT INTO categories (id, name, type, icon_name, color, spiritual_pillar, description) VALUES
('nutricao_sagrada', 'Alimentação & Nutrição do Templo', 'expense', 'Utensils', '#5a6b5d', 'nutricao_templo', 'Recursos direcionados para saudar e nutrir o corpo com comida saudável'),
('moradia_conforto', 'Lar & Acolhimento do Espaço', 'expense', 'Home', '#7d8e7b', 'acolhimento_lar', 'Manutenção da paz, aluguel, energia e beleza do lar'),
('sabedoria_cursos', 'Cursos, Livros & Expansão', 'expense', 'BookOpen', '#b88655', 'crescimento_espiritual', 'Investimento no aprendizado, autoconhecimento e evolução da alma'),
('doacoes_partilha', 'Dízimo, Apoio & Generosidade', 'expense', 'Heart', '#e9edc9', 'generosidade_partilha', 'Doações conscientes para causas e pessoas queridas'),
('fruto_trabalho', 'Projetos, Vendas & Serviços', 'income', 'Briefcase', '#5a6b5d', 'trabalho_proposito', 'Abundância gerada pelo uso dos seus talentos e dedicação'),
('investimentos_futuro', 'Reservas de Prosperidade', 'expense', 'ShieldCheck', '#3d403d', 'liberdade_futuro', 'Sementes guardadas para o futuro e tranquilidade financeira')
ON CONFLICT (id) DO NOTHING;
