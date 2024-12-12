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
            content: `Hey, assemble a team of any size you see fit to run a blockchain startup. Then, give me a summary of the team structure and hierarchy.`
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
