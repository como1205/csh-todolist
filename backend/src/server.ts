import http from 'http';
import app from './app';
import { connectDB } from '../database/config';
import { env } from './config/env';
import { pool } from '../database/config';
import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

// 데이터베이스 연결
connectDB();

const server = http.createServer(app);

server.listen(env.port, () => {
  console.log(`API server running on http://localhost:${env.port} (${env.nodeEnv})`);
});

const shutdown = async () => {
  console.log('Received shutdown signal, closing server...');

  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
