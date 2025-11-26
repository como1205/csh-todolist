import { Pool } from 'pg';
import { env } from './env';

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.useDatabaseSsl ? { rejectUnauthorized: false } : undefined,
});

pool.on('error', (error) => {
  // Surface unexpected client errors early during development.
  console.error('Unexpected database error', error);
});
