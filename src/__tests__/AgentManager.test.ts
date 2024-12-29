import { AgentManager } from '../core/AgentManager.js';
import { Agent, AgentMessage, MessageType } from '../types/agent.js';

describe('AgentManager', () => {
  let agentManager: AgentManager;

  beforeEach(() => {
    agentManager = new AgentManager();
  });

  test('should register an agent successfully', () => {
    const agent: Agent = {
      id: '1',
      name: 'Test Agent',
      role: 'Tester',
      goals: ['Test things'],
      memory: {
        shortTerm: {},
        longTerm: {},
        lastUpdated: new Date()
      },
      capabilities: []
    };

    agentManager.registerAgent(agent);
    // Add assertions
  });

  // Add more tests
});