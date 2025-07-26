'use server';

/**
 * @fileOverview A supplement recommendation AI agent.
 *
 * - generateSupplementPlan - A function that handles supplement recommendation generation.
 * - GenerateSupplementPlanInput - The input type for the generateSupplementPlan function.
 * - GenerateSupplementPlanOutput - The return type for the generateSupplementPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSupplementPlanInputSchema = z.object({
  goal: z
    .enum(['cut', 'bulk', 'maintain'])
    .describe('The fitness goal of the user.'),
  foodPreferences: z
    .string()
    .describe('The food preferences of the user, to identify potential nutritional gaps.'),
  injuries: z.string().describe('Any injuries the user has. If none, this will be "None".'),
  gender: z.enum(['male', 'female', 'other']).describe('The gender of the user.'),
  age: z.number().describe('The age of the user.'),
});
export type GenerateSupplementPlanInput = z.infer<typeof GenerateSupplementPlanInputSchema>;

const GenerateSupplementPlanOutputSchema = z.object({
  supplementPlan: z.string().describe('The generated supplement recommendations.'),
});
export type GenerateSupplementPlanOutput = z.infer<typeof GenerateSupplementPlanOutputSchema>;

export async function generateSupplementPlan(
  input: GenerateSupplementPlanInput
): Promise<GenerateSupplementPlanOutput> {
  return generateSupplementPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSupplementPlanPrompt',
  input: {schema: GenerateSupplementPlanInputSchema},
  output: {schema: GenerateSupplementPlanOutputSchema},
  prompt: `You are an expert nutritionist and fitness coach.

Based on the user's goal, diet, and personal details, recommend 3-5 suitable supplements. For each supplement, provide a brief explanation of its benefits related to their goal.

User Details:
- Goal: {{{goal}}}
- Dietary Notes: {{{foodPreferences}}}
- Injuries: {{{injuries}}}
- Gender: {{{gender}}}
- Age: {{{age}}}

Prioritize safety and evidence-based recommendations. If the user's diet seems to cover most needs (e.g., they eat a lot of fish), you might suggest fewer supplements like Omega-3. If they have injuries, you could suggest joint support supplements.

Generate a list of supplement recommendations.
`,
});

const generateSupplementPlanFlow = ai.defineFlow(
  {
    name: 'generateSupplementPlanFlow',
    inputSchema: GenerateSupplementPlanInputSchema,
    outputSchema: GenerateSupplementPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
