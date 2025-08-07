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
  injuries: z.string().min(1, "Please mention any injuries, or type 'none'."),
  previousPlan: z.string().min(1, "Please describe your previous plan, or type 'none'."),
});


export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});
