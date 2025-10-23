import { loadEnvironment, requireEnv, getIntEnv } from '@kit/env-loader/node';
import { createLogger } from '@kit/logger';
import { createServer } from './infra/http/server.js';

const logger = createLogger({ name: 'scheduling-api' });

// Load and validate environment
const envResult = loadEnvironment({
  appName: 'scheduling-api',
  required: ['PORT', 'NODE_ENV']
});

if (!envResult.success) {
  logger.error({ missing: envResult.missingRequired }, 'Missing required environment variables');
  process.exit(1);
}

const PORT = getIntEnv('PORT', 8080);
const NODE_ENV = requireEnv('NODE_ENV');

logger.info({ port: PORT, env: NODE_ENV }, 'Starting scheduling API');

// Create and start server
const app = createServer({ logger });

const server = app.listen(PORT, () => {
  logger.info({ port: PORT }, 'Server listening');
});

// Graceful shutdown
const shutdown = (signal: string) => {
  logger.info({ signal }, 'Shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
