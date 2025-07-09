"use server";

import { z } from "zod";
import { generateDietPlan } from "@/ai/flows/generate-diet-plan";
import { generateWorkoutPlan } from "@/ai/flows/generate-workout-plan";
import { formSchema } from "@/lib/schemas";

export async function generatePlansAction(data: z.infer<typeof formSchema>) {
  try {
    const validatedData = formSchema.parse(data);

    const macroTargets = `Protein: ${validatedData.protein}g, Carbs: ${validatedData.carbs}g, Fats: ${validatedData.fats}g`;

    const dietPlanInput = {
      age: validatedData.age,
      weight: validatedData.weight,
      goal: validatedData.goal,
      foodPreferences: validatedData.foodPreferences,
      macroTargets: macroTargets,
    };

    const workoutPlanInput = {
      goal: validatedData.goal,
      activityLevel: validatedData.activityLevel,
      age: validatedData.age,
      weight: validatedData.weight,
      height: validatedData.height,
      gender: validatedData.gender,
      equipment: validatedData.equipment,
      experienceLevel: validatedData.experienceLevel,
      workoutDays: validatedData.workoutDays,
      workoutTime: validatedData.workoutTime,
    };

    const [dietPlan, workoutPlan] = await Promise.all([
      generateDietPlan(dietPlanInput),
      generateWorkoutPlan(workoutPlanInput),
    ]);

    return { dietPlan, workoutPlan };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Validation failed: " + error.message };
    }
    console.error("Error generating plans:", error);
    return { error: "An unexpected error occurred while generating plans." };
  }
}
