import Fastify from 'fastify';
import { SwarmController } from '../core/SwarmController.js';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

export async function createServer(): Promise<void> {
  const fastify = Fastify({
    logger: true
  });

  const swarmController = new SwarmController();

  // Health check endpoint
  fastify.get('/health', async () => {
    return { status: 'ok' };
  });

  // API routes
  fastify.post('/tasks', async (request, reply) => {
    // Implement task creation endpoint
  });

  fastify.get('/tasks/:id', async (request, reply) => {
    // Implement task retrieval endpoint
  });

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  try {
    await fastify.listen({ port, host: '0.0.0.0' });
    logger.info(`Server listening on port ${port}`);
  } catch (err) {
    logger.error('Error starting server:', err);
    process.exit(1);
  }
}