import OpenAI from 'openai';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

export class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: config.OPENAI_API_KEY
    });
  }

  async generateResponse(prompt: string, systemPrompt = ''): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        model: 'gpt-4-turbo-preview'
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      logger.error('Error generating OpenAI response:', error);
      throw error;
    }
  }
}