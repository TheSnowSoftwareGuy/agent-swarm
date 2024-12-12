import OpenAI from "openai";
import { ToolConfig } from "./allTools.js";
import { createRun } from "../openai/createRun.js";
import { performRun } from "../openai/performRun.js";
import { agents } from "../index.js";

const openaiClient = new OpenAI();

interface SendMessageArgs {
    recipientAgent: string;
    message: string;
}

export const sendMessageTool: ToolConfig<SendMessageArgs> = {
    definition: {
        type: "function",
        function: {
            name: "send_message_to_agent",
            description: "Sends a message to an existing AI agent and gets their response",
            parameters: {
                type: "object",
                properties: {
                    recipientAgent: {
                        type: "string",
                        description: "The name of the agent to send the message to (must be an existing agent)"
                    },
                    message: {
                        type: "string",
                        description: "The message to send to the agent"
                    }
                },
                required: ["recipientAgent", "message"]
            }
        }
    },
    handler: async (args: SendMessageArgs) => {
        try {
            const targetAgent = agents[args.recipientAgent];

            if (!targetAgent) {
                throw new Error(`Agent "${args.recipientAgent}" not found`);
            }

            // Create and perform the run with the message
            const run = await createRun(openaiClient, targetAgent.thread, targetAgent.assistant.id);
            const result = await performRun(run, openaiClient, targetAgent.thread);

            // Return the agent's response
            if ('text' in result) {
                return `${args.recipientAgent} responds: ${result.text.value}`;
            }
            return `${args.recipientAgent} responded (non-text response)`;

        } catch (error) {
            return `Error sending message: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
}; 