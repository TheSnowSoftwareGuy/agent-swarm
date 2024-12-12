import OpenAI from "openai";
import { ToolConfig } from "./allTools.js";
import { createAssistant } from "../openai/createAssistant.js";
import { createThread } from "../openai/createThread.js";
import { createRun } from "../openai/createRun.js";
import { performRun } from "../openai/performRun.js";

// Singleton OpenAI client instance
const openaiClient = new OpenAI();

interface CreateAgentArgs {
    agentName: string;
    systemPrompt: string;
    initialMessage: string;
}

export const createAgentTool: ToolConfig<CreateAgentArgs> = {
    definition: {
        type: "function",
        function: {
            name: "create_agent",
            description: "Creates a new AI agent with specified parameters and delegates a task to it",
            parameters: {
                type: "object",
                properties: {
                    agentName: {
                        type: "string",
                        description: "The name/role of the agent to create (e.g., 'CTO', 'Marketing Manager')"
                    },
                    systemPrompt: {
                        type: "string",
                        description: "The system prompt that defines the agent's role and behavior"
                    },
                    initialMessage: {
                        type: "string",
                        description: "The first message/task to send to the newly created agent"
                    }
                },
                required: ["agentName", "systemPrompt", "initialMessage"]
            }
        }
    },
    handler: async (args: CreateAgentArgs) => {
        try {
            // Create a new assistant
            const assistant = await createAssistant(
                openaiClient,
                args.agentName,
                args.systemPrompt
            );

            // Create a new thread for this assistant
            const thread = await createThread(
                openaiClient,
                args.initialMessage
            );

            // Create and perform the initial run
            const run = await createRun(openaiClient, thread, assistant.id);
            const result = await performRun(run, openaiClient, thread);

            // Return the response from the new agent
            if ('text' in result) {
                return `${args.agentName} responds: ${result.text.value}`;
            }
            return `${args.agentName} created and responded (non-text response)`;

        } catch (error) {
            return `Error creating agent: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
};
