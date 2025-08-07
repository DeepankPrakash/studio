"use server";

import { z } from "zod";
import { generateDietPlan } from "@/ai/flows/generate-diet-plan";
import { generateWorkoutPlan } from "@/ai/flows/generate-workout-plan";
import { generateSupplementPlan } from "@/ai/flows/generate-supplement-plan";
import { formSchema, loginSchema, registerSchema } from "@/lib/schemas";
import { talkToAi } from "@/ai/flows/talk-to-ai";
import {
  createUser,
  findUserByEmail,
  verifyPassword,
  updateUserPlans,
  User,
} from "@/services/user";
import { cookies } from 'next/headers';

async function getAuthenticatedUser(): Promise<User | null> {
    const cookieStore = cookies();
    const userEmail = cookieStore.get('user_email')?.value;
    if (!userEmail) return null;
    return findUserByEmail(userEmail);
}

export async function generatePlansAction(data: z.infer<typeof formSchema>) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
        return { error: "You must be logged in to generate plans." };
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

    await updateUserPlans(user.email, plans);

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
    const user = await getAuthenticatedUser();
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

export async function loginAction(data: z.infer<typeof loginSchema>) {
    try {
        const validatedData = loginSchema.parse(data);
        const user = await findUserByEmail(validatedData.email);

        if (!user) {
            return { error: "Invalid email or password." };
        }

        const isPasswordValid = await verifyPassword(validatedData.password, user.password);

        if (!isPasswordValid) {
            return { error: "Invalid email or password." };
        }

        const cookieStore = cookies();
        cookieStore.set('user_email', user.email, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // One week
            path: '/',
        });

        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: "Validation failed: " + error.message };
        }
        console.error("Login error:", error);
        return { error: "An unexpected error occurred during login." };
    }
}

export async function registerAction(data: z.infer<typeof registerSchema>) {
    try {
        const validatedData = registerSchema.parse(data);
        const existingUser = await findUserByEmail(validatedData.email);
        if (existingUser) {
            return { error: "A user with this email already exists." };
        }
        await createUser(validatedData);
        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { error: "Validation failed: " + error.message };
        }
        console.error("Registration error:", error);
        return { error: "An unexpected error occurred during registration." };
    }
}

export async function logoutAction() {
    const cookieStore = cookies();
    cookieStore.delete('user_email');
    return { success: true };
}
