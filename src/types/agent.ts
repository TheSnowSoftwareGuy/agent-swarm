export interface Agent {
  id: string;
  name: string;
  role: string;
  goals: string[];
  memory: AgentMemory;
  capabilities: AgentCapability[];
}

export interface AgentMemory {
  shortTerm: Record<string, unknown>;
  longTerm: Record<string, unknown>;
  lastUpdated: Date;
}

export interface AgentCapability {
  name: string;
  description: string;
  execute: (args: unknown) => Promise<unknown>;
}

export interface AgentMessage {
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  type: MessageType;
}

export enum MessageType {
  TASK = 'TASK',
  RESPONSE = 'RESPONSE',
  ERROR = 'ERROR',
  STATUS = 'STATUS'
}