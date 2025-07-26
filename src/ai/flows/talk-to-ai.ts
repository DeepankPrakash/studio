'use server';

/**
 * @fileOverview A conversational AI agent for FitGenie.
 *
 * - talkToAi - A function that handles the conversation with the user.
 * - TalkToAiInput - The input type for the talkToAi function.
 * - TalkToAiOutput - The return type for the talkToAi function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TalkToAiInputSchema = z.object({
  history: z.array(z.object({
      role: z.enum(['user', 'model']),
      text: z.string(),
  })).describe('The conversation history.'),
  newMessage: z.string().describe('The new message from the user.'),
});
export type TalkToAiInput = z.infer<typeof TalkToAiInputSchema>;

const TalkToAiOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user.'),
});
export type TalkToAiOutput = z.infer<typeof TalkToAiOutputSchema>;

export async function talkToAi(
  input: TalkToAiInput
): Promise<TalkToAiOutput> {
  return talkToAiFlow(input);
}

const prompt = ai.definePrompt({
  name: 'talkToAiPrompt',
  input: {schema: TalkToAiInputSchema},
  output: {schema: TalkToAiOutputSchema},
  prompt: `You are FitGenie, a friendly and knowledgeable AI fitness assistant. Your role is to answer user questions about fitness, nutrition, and their personalized plans. Be supportive and encouraging.

Keep your answers concise and easy to understand.

Here is the conversation history:
{{#each history}}
{{role}}: {{text}}
{{/each}}

Here is the user's new message:
{{newMessage}}

Your response:`,
});

const talkToAiFlow = ai.defineFlow(
  {
    name: 'talkToAiFlow',
    inputSchema: TalkToAiInputSchema,
    outputSchema: TalkToAiOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
