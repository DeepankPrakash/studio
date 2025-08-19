
'use server';

/**
 * @fileOverview A workout plan generator AI agent.
 *
 * - generateWorkoutPlan - A function that handles the workout plan generation process.
 * - GenerateWorkoutPlanInput - The input type for the generateWorkoutPlan function.
 * - GenerateWorkoutPlanOutput - The return type for the generateWorkoutPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWorkoutPlanInputSchema = z.object({
  goal: z
    .enum(['cut', 'bulk', 'maintain'])
    .describe('The user fitness goal: cut, bulk, or maintain.'),
  activityLevel: z
    .enum(['sedentary', 'lightly active', 'moderately active', 'very active', 'extra active'])
    .describe('The user activity level.'),
  age: z.number().describe('The age of the user.'),
  weight: z.number().describe('The weight of the user in kilograms.'),
  height: z.number().describe('The height of the user in centimeters.'),
  gender: z.enum(['male', 'female', 'other']).describe('The gender of the user.'),
  equipment: z.string().describe('The equipment available to the user.'),
  experienceLevel: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .describe('The experience level of the user.'),
  workoutDays: z.number().describe('The number of days per week the user can workout.'),
  workoutTime: z.number().describe('The amount of time the user can workout in minutes.'),
  injuries: z.string().describe('Any injuries the user has. If none, this will be "None".'),
  previousPlan: z.string().describe('Any previous plan the user was following. If none, this will be "None".'),
});
export type GenerateWorkoutPlanInput = z.infer<typeof GenerateWorkoutPlanInputSchema>;

const GenerateWorkoutPlanOutputSchema = z.object({
  workoutPlan: z.string().describe('The generated workout plan.'),
});
export type GenerateWorkoutPlanOutput = z.infer<typeof GenerateWorkoutPlanOutputSchema>;

export async function generateWorkoutPlan(input: GenerateWorkoutPlanInput): Promise<GenerateWorkoutPlanOutput> {
  return generateWorkoutPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWorkoutPlanPrompt',
  input: {schema: GenerateWorkoutPlanInputSchema},
  output: {schema: GenerateWorkoutPlanOutputSchema},
  prompt: `You are a professional personal trainer and fitness expert that creates detailed workout plans.

Create a comprehensive workout plan based on the following information:

Fitness Goal: {{{goal}}}
Activity Level: {{{activityLevel}}}
Age: {{{age}}}
Weight: {{{weight}}} kg
Height: {{{height}}} cm
Gender: {{{gender}}}
Available Equipment: {{{equipment}}}
Experience Level: {{{experienceLevel}}}
Workout Days Per Week: {{{workoutDays}}}
Workout Time: {{{workoutTime}}} minutes
Injuries: {{{injuries}}}
Previous Plan: {{{previousPlan}}}

IMPORTANT INSTRUCTIONS:
1. You MUST provide a complete workout plan with specific exercises, sets, and reps for each day
2. Do NOT just provide workout types like "Push Pull Legs" - provide the actual exercises
3. Structure the response by breaking it down into days. Each day should start with "Day X: [Focus of the day]"
4. Under each day, list specific exercises with sets and reps format: "1. Exercise Name: 3 sets of 8-12 reps"
5. Include 4-6 exercises per day minimum
6. Consider the user's experience level, available equipment, and time constraints
7. If the user has injuries, suggest alternative exercises or modifications
8. Make sure the plan is progressive and suitable for their goal (cut/bulk/maintain)

EXAMPLE FORMAT:
Day 1: Chest and Triceps
1. Bench Press: 3 sets of 8-12 reps
2. Incline Dumbbell Press: 3 sets of 10-12 reps
3. Dips: 3 sets of 8-15 reps
4. Tricep Extensions: 3 sets of 12-15 reps
5. Push-ups: 2 sets to failure

Day 2: Back and Biceps
1. Pull-ups/Lat Pulldowns: 3 sets of 8-12 reps
2. Barbell Rows: 3 sets of 8-12 reps
3. Dumbbell Curls: 3 sets of 12-15 reps
4. Hammer Curls: 3 sets of 12-15 reps
5. Face Pulls: 2 sets of 15-20 reps

Continue this format for all workout days.

Workout Plan:`,
});

const generateWorkoutPlanFlow = ai.defineFlow(
  {
    name: 'generateWorkoutPlanFlow',
    inputSchema: GenerateWorkoutPlanInputSchema,
    outputSchema: GenerateWorkoutPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
