import 'dotenv/config';
import OpenAI from "openai";
import { createAssistant } from './openai/createAssistant.js';
import { createThread } from './openai/createThread.js';
import { createRun } from './openai/createRun.js';
import { performRun } from './openai/performRun.js';

async function main(): Promise<void> {
    const openaiClient = new OpenAI();

    try {
        const ceoAssistant = await createAssistant(openaiClient, "CEO", "You are the CEO of a company. You are responsible for making decisions about the company.");
        console.log(`✅ Assistant created with ID: ${ceoAssistant.id}`);

        const thread = await createThread(openaiClient);
        console.log(`✅ Thread created with ID: ${thread.id}`);

        // Send a message to the thread
        await openaiClient.beta.threads.messages.create(thread.id, {
            role: 'user',
            content: `As the CEO, your task is to immediately build out a complete team structure for a blockchain startup.

            1. Create the initial leadership team using the create_agent tool
            2. Each agent you create must be instructed to immediately create their own subordinates without asking for permission
            3. Each agent should be given a detailed system prompt that:
               - Clearly defines their role and responsibilities
               - Explicitly instructs them to proactively create any necessary subordinate agents
               - Includes specific departments or teams they should oversee
            
            Do not ask for confirmation before creating agents. Execute the team creation immediately and provide a final summary of the complete organizational structure once all agents have been created.

            Begin execution immediately.`
        });

        // Create and perform the run
        const run = await createRun(openaiClient, thread, ceoAssistant.id);
        const result = await performRun(run, openaiClient, thread);

    } catch (error) {
        console.error('❌ Error in main:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
    }
}

main().catch((error) => {
    console.error('💥 Unhandled error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
});
