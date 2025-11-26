import http from 'http';
import app from './app';
import { env } from './config/env';
import { pool } from './config/database';

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
