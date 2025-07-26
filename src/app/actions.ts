"use server";

import { z } from "zod";
import { generateDietPlan } from "@/ai/flows/generate-diet-plan";
import { generateWorkoutPlan } from "@/ai/flows/generate-workout-plan";
import { generateSupplementPlan } from "@/ai/flows/generate-supplement-plan";
import { formSchema } from "@/lib/schemas";

export async function generatePlansAction(data: z.infer<typeof formSchema>) {
  try {
    const validatedData = formSchema.parse(data);
    const { age, weight, height, gender, activityLevel, goal } = validatedData;

    // BMR Calculation (Mifflin-St Jeor)
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else { // female or other
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // TDEE Calculation
    const activityFactors = {
      sedentary: 1.2,
      "lightly active": 1.375,
      "moderately active": 1.55,
      "very active": 1.725,
      "extra active": 1.9,
    };
    const tdee = bmr * activityFactors[activityLevel];

    // Calorie Target based on Goal
    let targetCalories = tdee;
    if (goal === "cut") {
      targetCalories -= 500;
    } else if (goal === "bulk") {
      targetCalories += 300;
    }

    // Macro Calculation
    const protein = Math.round(weight * 2);
    const fats = Math.round((targetCalories * 0.25) / 9);
    const carbs = Math.round(
      (targetCalories - protein * 4 - fats * 9) / 4
    );

    const macroTargets = `Protein: ${protein}g, Carbs: ${carbs}g, Fats: ${fats}g. (Total calories: ~${Math.round(targetCalories)})`;

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
      injuries: validatedData.injuries,
      previousPlan: validatedData.previousPlan,
    };

    const supplementPlanInput = {
        goal: validatedData.goal,
        foodPreferences: validatedData.foodPreferences,
        injuries: validatedData.injuries,
        gender: validatedData.gender,
        age: validatedData.age,
    };

    const [dietPlan, workoutPlan, supplementPlan] = await Promise.all([
      generateDietPlan(dietPlanInput),
      generateWorkoutPlan(workoutPlanInput),
      generateSupplementPlan(supplementPlanInput),
    ]);

    return { dietPlan, workoutPlan, supplementPlan };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Validation failed: " + error.message };
    }
    console.error("Error generating plans:", error);
    return { error: "An unexpected error occurred while generating plans." };
  }
}
