import { Agent, AgentMessage } from '../types/agent.js';
import { OpenAIService } from '../services/OpenAIService.js';
import { logger } from '../utils/logger.js';

export class AgentManager {
  private agents: Map<string, Agent>;
  private messageQueue: AgentMessage[];
  private openAIService: OpenAIService;

  constructor() {
    this.agents = new Map();
    this.messageQueue = [];
    this.openAIService = new OpenAIService();
  }

  registerAgent(agent: Agent): void {
    this.agents.set(agent.id, agent);
    logger.info(`Agent registered: ${agent.name} (${agent.id})`);
  }

  removeAgent(agentId: string): void {
    this.agents.delete(agentId);
    logger.info(`Agent removed: ${agentId}`);
  }

  async processMessage(message: AgentMessage): Promise<void> {
    const targetAgent = this.agents.get(message.to);
    
    if (!targetAgent) {
      logger.error(`Target agent not found: ${message.to}`);
      return;
    }

    this.messageQueue.push(message);
    await this.processMessageQueue();
  }

  private async processMessageQueue(): Promise<void> {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (!message) continue;

      try {
        // Process message using OpenAI for decision making
        await this.handleMessage(message);
      } catch (error) {
        logger.error('Error processing message:', error);
      }
    }
  }

  private async handleMessage(message: AgentMessage): Promise<void> {
    // Implementation details for message handling
    logger.info(`Processing message: ${message.type} from ${message.from} to ${message.to}`);
  }
}