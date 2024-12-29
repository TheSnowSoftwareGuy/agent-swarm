import { AgentManager } from './AgentManager.js';
import { TaskManager } from './TaskManager.js';
import { Agent, AgentMessage, MessageType } from '../types/agent.js';
import { Task, TaskStatus } from '../types/task.js';
import { logger } from '../utils/logger.js';

export class SwarmController {
  private agentManager: AgentManager;
  private taskManager: TaskManager;

  constructor() {
    this.agentManager = new AgentManager();
    this.taskManager = new TaskManager();
  }

  async initializeSwarm(agents: Agent[]): Promise<void> {
    for (const agent of agents) {
      this.agentManager.registerAgent(agent);
    }
    logger.info(`Swarm initialized with ${agents.length} agents`);
  }

  async assignTask(task: Task): Promise<void> {
    // Implement task assignment logic
    const message: AgentMessage = {
      from: 'SwarmController',
      to: task.assignedTo || '',
      content: JSON.stringify(task),
      timestamp: new Date(),
      type: MessageType.TASK
    };

    await this.agentManager.processMessage(message);
  }

  async monitorProgress(): Promise<void> {
    // Implement progress monitoring logic
    const inProgressTasks = this.taskManager.getTasksByStatus(TaskStatus.IN_PROGRESS);
    logger.info(`Currently ${inProgressTasks.length} tasks in progress`);
  }
}