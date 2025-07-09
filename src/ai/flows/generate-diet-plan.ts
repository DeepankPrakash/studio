'use server';

/**
 * @fileOverview A diet plan generation AI agent.
 *
 * - generateDietPlan - A function that handles the diet plan generation process.
 * - GenerateDietPlanInput - The input type for the generateDietPlan function.
 * - GenerateDietPlanOutput - The return type for the generateDietPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDietPlanInputSchema = z.object({
  age: z.number().describe('The age of the user.'),
  weight: z.number().describe('The weight of the user in kilograms.'),
  goal: z
    .enum(['cut', 'bulk', 'maintain'])
    .describe('The fitness goal of the user.'),
  foodPreferences: z
    .string()
    .describe('The food preferences of the user.  Specifically list Indian dishes and ingredients the user likes and dislikes.'),
  macroTargets: z
    .string()
    .describe('The macro targets for the user (protein, carbs, fats in grams).'),
});
export type GenerateDietPlanInput = z.infer<typeof GenerateDietPlanInputSchema>;

const GenerateDietPlanOutputSchema = z.object({
  dietPlan: z.string().describe('The generated Indian-style diet plan.'),
});
export type GenerateDietPlanOutput = z.infer<typeof GenerateDietPlanOutputSchema>;

export async function generateDietPlan(
  input: GenerateDietPlanInput
): Promise<GenerateDietPlanOutput> {
  return generateDietPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDietPlanPrompt',
  input: {schema: GenerateDietPlanInputSchema},
  output: {schema: GenerateDietPlanOutputSchema},
  prompt: `You are an expert nutritionist specializing in creating Indian-style diet plans.

You will use the user's information to generate a personalized diet plan, taking into account their fitness goal, food preferences, and macro targets.

Age: {{{age}}}
Weight: {{{weight}}} kg
Goal: {{{goal}}}
Food Preferences: {{{foodPreferences}}}
Macro Targets: {{{macroTargets}}}

Generate an Indian-style diet plan that meets the user's needs.  Be specific with portion sizes.
`,
});

const generateDietPlanFlow = ai.defineFlow(
  {
    name: 'generateDietPlanFlow',
    inputSchema: GenerateDietPlanInputSchema,
    outputSchema: GenerateDietPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
