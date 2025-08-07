
"use server";

import { z } from "zod";
import { generateDietPlan } from "@/ai/flows/generate-diet-plan";
import { generateWorkoutPlan } from "@/ai/flows/generate-workout-plan";
import { generateSupplementPlan } from "@/ai/flows/generate-supplement-plan";
import { formSchema } from "@/lib/schemas";
import { talkToAi } from "@/ai/flows/talk-to-ai";
import {
  updateUserPlans,
  getFirstUser,
  User,
} from "@/services/user";

// In a real app, you'd have a way to identify the logged-in user.
// For this version, we'll just use the first user in our JSON "database".
async function getCurrentUser(): Promise<User | null> {
    return getFirstUser();
}

export async function generatePlansAction(data: z.infer<typeof formSchema>) {
  try {
    const user = await getCurrentUser();
    if (!user) {
        // This can happen if the users.json file is empty.
        // We'll proceed without saving for now.
        console.warn("No user found in the database. Plans will not be saved.")
    }

    const validatedData = formSchema.parse(data);
    const { age, weight, height, gender, activityLevel, goal } = validatedData;

    let bmr: number;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const activityFactors = {
      sedentary: 1.2,
      "lightly active": 1.375,
      "moderately active": 1.55,
      "very active": 1.725,
      "extra active": 1.9,
    };
    const tdee = bmr * activityFactors[activityLevel];

    let targetCalories = tdee;
    if (goal === "cut") {
      targetCalories -= 500;
    } else if (goal === "bulk") {
      targetCalories += 300;
    }

    const protein = Math.round(weight * 2);
    const fats = Math.round((targetCalories * 0.25) / 9);
    const carbs = Math.round(
      (targetCalories - protein * 4 - fats * 9) / 4
    );

    const macroTargets = `Protein: ${protein}g, Carbs: ${carbs}g, Fats: ${fats}g. (Total calories: ~${Math.round(targetCalories)})`;

    const [dietPlan, workoutPlan, supplementPlan] = await Promise.all([
      generateDietPlan({ ...validatedData, macroTargets }),
      generateWorkoutPlan(validatedData),
      generateSupplementPlan(validatedData),
    ]);

    const plans = {
        dietPlan: dietPlan.dietPlan,
        workoutPlan: workoutPlan.workoutPlan,
        supplementPlan: supplementPlan.supplementPlan,
    };

    if (user) {
        await updateUserPlans(user.email, plans);
    }

    return { ...plans };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Validation failed: " + error.message };
    }
    console.error("Error generating plans:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { error: `An unexpected error occurred while generating plans: ${errorMessage}` };
  }
}

export async function getPlansAction() {
    const user = await getCurrentUser();
    if (!user) return null;
    return user.plans || null;
}

export async function talkToAiAction(history: { role: 'user' | 'model'; text: string }[], newMessage: string) {
    try {
        const result = await talkToAi({history, newMessage});
        return result.response;
    } catch (error) {
        console.error("Error in talkToAiAction: ", error);
        return { error: "An unexpected error occurred while talking to the AI." };
    }
}
