import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Usar DATABASE_URL ou variáveis individuais do PostgreSQL
const connectionString = process.env.DATABASE_URL || 
  (process.env.POSTGRES_HOST ? 
    `postgres://${process.env.POSTGRES_USER || 'postgres'}:${process.env.POSTGRES_PASSWORD || 'postgres'}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT || 5432}/${process.env.POSTGRES_DB || 'manifesta_db'}` 
    : null);

export const pool = connectionString ? new Pool({ connectionString }) : null;

export async function checkDbConnection(): Promise<boolean> {
  if (!pool) return false;
  try {
    const client = await pool.connect();
    client.release();
    return true;
  } catch (err) {
    console.warn('⚠️ PostgreSQL não conectado ou inacessível. O aplicativo rodará em modo local/memória:', err);
    return false;
  }
}
