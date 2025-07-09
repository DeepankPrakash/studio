import { z } from "zod";

export const formSchema = z.object({
  age: z.coerce.number().min(16, "Must be at least 16 years old").max(100),
  weight: z.coerce.number().min(30, "Weight must be a positive number").max(300),
  height: z.coerce.number().min(100, "Height must be a positive number").max(250),
  gender: z.enum(["male", "female", "other"], { required_error: "Please select a gender." }),
  goal: z.enum(["cut", "bulk", "maintain"], { required_error: "Please select a goal." }),
  activityLevel: z.enum(
    ["sedentary", "lightly active", "moderately active", "very active", "extra active"],
    { required_error: "Please select an activity level." }
  ),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "Please select an experience level.",
  }),
  workoutDays: z.coerce.number().min(1).max(7),
  workoutTime: z.coerce.number().min(10).max(180),
  equipment: z.string().min(1, "Please list available equipment."),
  foodPreferences: z.string().min(1, "Please list your food preferences."),
  protein: z.coerce.number().min(1, "Protein must be a positive number"),
  carbs: z.coerce.number().min(1, "Carbs must be a positive number"),
  fats: z.coerce.number().min(1, "Fats must be a positive number"),
});
