
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
  prompt: `You are a personal trainer that creates workout plans.

Create a workout plan based on the following information:

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


Make sure that the plan is tailored to the user's goal, experience level, available equipment, and any mentioned injuries.
Structure the response by breaking it down into days. Each day should start with "Day X: [Focus of the day]".
For example: "Day 1: Chest and Triceps".
Under each day, list the exercises with sets and reps. For example: "1. Bench Press: 3 sets of 8-12 reps".
If the user has injuries, suggest alternative exercises or modifications. If they were on a previous plan, consider it for progression.

Limit your response to a single workout plan.

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
