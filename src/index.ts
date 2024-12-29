import { createServer } from './server/index.js';
import { logger } from './utils/logger.js';

async function main(): Promise<void> {
  try {
    await createServer();
    logger.info('Application started successfully');
  } catch (error) {
    logger.error('Error starting application:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});