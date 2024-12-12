import { createAgentTool } from './createAgentTool.js';
import { getTeamTool } from './getTeamTool.js';
import { sendMessageTool } from "./sendMessageTool.js";

export interface ToolConfig<T = any> {
    definition: {
        type: 'function';
        function: {
            name: string;
            description: string;
            parameters: {
                type: 'object';
                properties: Record<string, unknown>;
                required: string[];
            };
        };
    };
    handler: (args: T) => Promise<any>;
}

export const tools: Record<string, ToolConfig> = {
    create_agent: createAgentTool,
    send_message_to_agent: sendMessageTool,
    get_team_structure: getTeamTool
};