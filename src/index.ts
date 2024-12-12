import 'dotenv/config';
import OpenAI from "openai";
import { createAssistant } from './openai/createAssistant.js';
import { createThread } from './openai/createThread.js';
import { createRun } from './openai/createRun.js';
import { performRun } from './openai/performRun.js';
import readline from 'readline';
import { Assistant } from 'openai/resources/beta/assistants.mjs';
import { Thread } from 'openai/resources/beta/index.mjs';
import { Agent } from './types/Agent.js';

// Simple in-memory store for agents and their threads
export const agents: Record<string, Agent> = {};

async function chat(client: OpenAI, message: string, assistant: Assistant, thread: Thread) {
    await client.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: message
    });

    const run = await createRun(client, thread, assistant.id);
    const result = await performRun(run, client, thread);

    if ('text' in result) {
        console.log('\nCEO:', result.text.value, '\n');
    }
}

async function main() {
    const openaiClient = new OpenAI();
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    try {
        // Create CEO assistant if it doesn't exist
        if (!agents['CEO']) {
            const assistant = await createAssistant(openaiClient, "CEO",
                "You are the CEO of a company. You are responsible for making decisions about the company. " +
                "You have the ability to create other AI agents to help you using the create_agent tool."
            );
            const thread = await createThread(openaiClient);

            agents['CEO'] = {
                assistant: assistant,
                thread: thread,
                metadata: {
                    managerAssistantId: null, // CEO has no manager
                    subordinateAssistantIds: [],
                }
            };
        }

        console.log('🤖 Chat with your CEO (type "exit" to quit)');

        const askQuestion = () => {
            rl.question('\nYou: ', async (input) => {
                if (input.toLowerCase() === 'exit') {
                    rl.close();
                    return;
                }

                await chat(
                    openaiClient,
                    input,
                    agents['CEO'].assistant,
                    agents['CEO'].thread
                );

                askQuestion();
            });
        };

        askQuestion();

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
