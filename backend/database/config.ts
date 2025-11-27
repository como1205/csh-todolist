import { Pool } from 'pg';
import { env } from '../src/config/env';

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.useDatabaseSsl ? { rejectUnauthorized: false } : undefined,
});

export const connectDB = async () => {
  try {
    await pool.connect();
    console.log('PostgreSQL database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

pool.on('error', (error) => {
  // Surface unexpected client errors early during development.
  console.error('Unexpected database error', error);
});

export default pool;