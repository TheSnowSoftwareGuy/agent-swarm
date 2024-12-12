import OpenAI from "openai";
import { Assistant } from "openai/resources/beta/assistants";
import { tools } from '../tools/allTools.js';

export async function createAssistant(client: OpenAI, assistantName: string, assistantPrompt: string): Promise<Assistant> {
    return await client.beta.assistants.create({
        model: "gpt-4o-mini",
        name: assistantName,
        instructions: `${assistantPrompt}\n\nYou also have tools available to you that you can use to interact with the blockchain:\n${Object.values(tools).map(tool => tool.definition.function.name).join(', ')}`,
        tools: Object.values(tools).map(tool => tool.definition)
    });
}
