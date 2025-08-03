
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

Age: {{{age}}}
Weight: {{{weight}}} kg
Goal: {{{goal}}}
Food Preferences: {{{foodPreferences}}}
Macro Targets: {{{macroTargets}}}

Generate a detailed 7-day Indian-style diet plan.
For each day, structure the response with clear headings for the day (e.g., "Day 1", "Day 2", etc.).
Under each day, provide meals for Breakfast, Lunch, and Dinner.
For each meal, list the food items, provide the approximate macronutrient breakdown (Protein, Carbs, Fats in grams), and then provide simple cooking instructions.

Use the following exact format for each meal entry, including the labels "Macros:" and "Cooking Instructions:":
[Meal Type]: [Dish Name]
Macros: Protein: [X]g, Carbs: [Y]g, Fats: [Z]g
Cooking Instructions: [Instructions]

Example for one day:
Day 1
Breakfast: 2 Besan Chillas with mint chutney.
Macros: Protein: 20g, Carbs: 30g, Fats: 10g
Cooking Instructions: Mix 1 cup of besan (gram flour) with water, salt, turmeric, and finely chopped onions to make a batter. Pour onto a hot non-stick pan and cook on both sides until golden brown. Serve with mint chutney.
Lunch: 1 bowl of dal, 1 bowl of mixed vegetable curry, 2 rotis.
Macros: Protein: 25g, Carbs: 60g, Fats: 15g
Cooking Instructions: For dal, pressure cook 1/2 cup of toor dal with turmeric and salt. For the curry, sauté mixed vegetables (carrots, beans, peas) with onion, tomato, and spices. Serve with fresh rotis.
Dinner: 150g of Paneer Tikka.
Macros: Protein: 30g, Carbs: 10g, Fats: 20g
Cooking Instructions: Marinate paneer cubes in yogurt and tandoori masala. Grill or pan-fry until lightly charred.
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
