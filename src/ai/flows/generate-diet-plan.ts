
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

const MealSchema = z.object({
  name: z.string().describe('The name of the meal.'),
  macros: z.string().describe('The protein, carbs, and fats in grams.'),
  instructions: z.string().describe('The cooking instructions for the meal.'),
});

const DayPlanSchema = z.object({
  day: z.string().describe('The day of the week (e.g., "Day 1").'),
  breakfast: MealSchema,
  lunch: MealSchema,
  dinner: MealSchema,
});

const GenerateDietPlanOutputSchema = z.object({
  dietPlan: z.array(DayPlanSchema).describe('The generated 7-day Indian-style diet plan.'),
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
  prompt: `You are an expert nutritionist specializing in creating 7-day Indian-style diet plans in a structured JSON format.

You will use the user's information to generate a personalized 7-day diet plan, taking into account their fitness goal, food preferences, and macro targets.

User Information:
Age: {{{age}}}
Weight: {{{weight}}} kg
Goal: {{{goal}}}
Food Preferences: {{{foodPreferences}}}
Macro Targets: {{{macroTargets}}}

Generate a detailed 7-day Indian-style diet plan as a JSON object. The root object should have a single key "dietPlan" which is an array of 7 day-plan objects.
Each day-plan object must have the following keys: "day", "breakfast", "lunch", "dinner".
The value for "day" should be a string (e.g., "Day 1").
The values for "breakfast", "lunch", and "dinner" must be meal objects.
Each meal object must have the following keys: "name", "macros", and "instructions".
- "macros" should be a string like "Protein: 20g, Carbs: 30g, Fats: 10g".
- "instructions" should be a string containing the cooking steps.

Ensure your entire output is a single, valid JSON object that adheres to this schema.
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
