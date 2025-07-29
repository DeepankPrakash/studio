
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type Meal = {
    meal: string;
    details: string;
};

const parseDietPlan = (plan: string): Meal[] => {
    if (!plan) return [];
    const mealRegex = /(Breakfast:|Lunch:|Dinner:|Snacks:|Snack\s*\d*:|Pre-workout:|Post-workout:)/ig;
    const parts = plan.split(mealRegex).filter(s => s.trim() !== '');

    if (parts.length <= 1) {
        return [{ meal: "Full Day Diet", details: plan }];
    }

    const meals: Meal[] = [];
    for (let i = 0; i < parts.length; i += 2) {
        const mealTitle = parts[i]?.replace(':', '').trim();
        const mealDetails = parts[i + 1]?.trim();
        if (mealTitle && mealDetails) {
            meals.push({ meal: mealTitle, details: mealDetails });
        }
    }
    return meals;
};

type DietPlanTabProps = {
    dietPlan: string;
};

export default function DietPlanTab({ dietPlan }: DietPlanTabProps) {
    const parsedDiet = parseDietPlan(dietPlan);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Daily Meal Plan</CardTitle>
                <CardDescription>Your Indian-style diet plan for the day.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {parsedDiet.map((meal, index) => (
                    <Card key={index} className="bg-muted/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{meal.meal}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap font-mono text-sm">{meal.details}</p>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
}
