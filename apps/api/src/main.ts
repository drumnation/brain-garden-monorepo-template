import { loadEnvironment } from '@kit/env-loader/node';
import { createServer } from '@infra/http/server.js;

import { logger } from '@shared/logging/logger.js';

async function bootstrap() {
  // Load environment variables
  const env = loadEnvironment({
    appName: 'api',
    required: ['PORT'],
  });

  if (!env.success) {
    console.error('Failed to load environment:', env.missingRequired);
    process.exit(1);
  }

  // Create and start server
  const server = createServer();
  const PORT = process.env.PORT || 3000;

  server.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
  });
}

bootstrap().catch((error) => {
  logger.error('Fatal error during bootstrap:', error);
  process.exit(1);
});
