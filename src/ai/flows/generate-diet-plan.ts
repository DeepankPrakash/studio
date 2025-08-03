
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
  dietPlan: z.string().describe('The generated Indian-style diet plan for 7 days with macros and cooking instructions.'),
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
  prompt: `You are an expert nutritionist specializing in creating 7-day Indian-style diet plans.

You will use the user's information to generate a personalized 7-day diet plan, taking into account their fitness goal, food preferences, and macro targets.

User Information:
Age: {{{age}}}
Weight: {{{weight}}} kg
Goal: {{{goal}}}
Food Preferences: {{{foodPreferences}}}
Macro Targets: {{{macroTargets}}}

Generate a detailed 7-day Indian-style diet plan.
For each day, structure the response with clear headings for the day (e.g., "Day 1", "Day 2", etc.).
Under each day, provide meals for Breakfast, Lunch, and Dinner.
For each meal, you MUST follow this exact format:
1. The meal name on its own line.
2. A line starting with "Macros:" followed by the protein, carbs, and fats in grams.
3. A line starting with "Cooking Instructions:" followed by the cooking steps.

Here is an example for one meal:
Breakfast: 2 Besan Chillas with mint chutney.
Macros: Protein: 20g, Carbs: 30g, Fats: 10g
Cooking Instructions: Mix 1 cup of besan (gram flour) with water, salt, turmeric, and finely chopped onions to make a batter. Pour onto a hot non-stick pan and cook on both sides until golden brown. Serve with mint chutney.

Produce a response for all 7 days following this structure for every meal (Breakfast, Lunch, Dinner).
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
