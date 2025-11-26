import { config } from 'dotenv';
import path from 'path';

config({
  path: path.resolve(process.cwd(), '.env'),
});

const requiredKeys = ['DATABASE_URL'] as const;

requiredKeys.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

const parsedPort = Number(process.env.PORT);

export const env = {
  databaseUrl: process.env.DATABASE_URL as string,
  port: Number.isNaN(parsedPort) ? 4000 : parsedPort,
  useDatabaseSsl: (process.env.DATABASE_SSL ?? 'false').toLowerCase() === 'true',
  nodeEnv: process.env.NODE_ENV ?? 'development',
};
