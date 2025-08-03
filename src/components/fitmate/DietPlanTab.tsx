
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Flame, ChefHat } from "lucide-react";

type Meal = {
    name: string;
    macros: string;
    instructions: string;
};

type DailyDiet = {
    day: string;
    meals: Meal[];
};

const parseDietPlan = (plan: string): DailyDiet[] => {
    if (!plan) return [];

    const dailyPlans: DailyDiet[] = [];
    const dayBlocks = plan.split(/(?=^Day\s*\d+\s*:)/im).filter(s => s.trim());

    dayBlocks.forEach(block => {
        const lines = block.trim().split('\n');
        const dayMatch = lines[0].match(/Day\s*\d+\s*:/i);
        if (!dayMatch) return;

        const day = dayMatch[0].replace(':', '').trim();
        const meals: Meal[] = [];
        let currentMeal: Partial<Meal> | null = null;
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            const isMealLine = line.includes('Breakfast:') || line.includes('Lunch:') || line.includes('Dinner:');

            if (isMealLine) {
                if (currentMeal?.name && currentMeal?.macros && currentMeal?.instructions) {
                    meals.push(currentMeal as Meal);
                }
                currentMeal = { name: line };
            } else if (currentMeal) {
                if (line.startsWith('Macros:')) {
                    currentMeal.macros = line.substring('Macros:'.length).trim();
                } else if (line.startsWith('Cooking Instructions:')) {
                    currentMeal.instructions = line.substring('Cooking Instructions:'.length).trim();
                } else if (currentMeal.instructions) {
                    currentMeal.instructions += `\n${line}`;
                } else if(currentMeal.name && !currentMeal.macros) {
                    // Handle cases where instructions are not explicitly labeled
                    currentMeal.macros = "Not specified";
                    currentMeal.instructions = line;
                }
            }
        }
        
        if (currentMeal?.name && currentMeal?.macros && currentMeal?.instructions) {
            meals.push(currentMeal as Meal);
        }

        if (meals.length > 0) {
            dailyPlans.push({ day, meals });
        }
    });

    return dailyPlans;
};


type DietPlanTabProps = {
    dietPlan: string;
};

export default function DietPlanTab({ dietPlan }: DietPlanTabProps) {
    const parsedDiet = parseDietPlan(dietPlan);

    if (parsedDiet.length === 0) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Weekly Meal Plan</CardTitle>
                    <CardDescription>Your 7-day Indian-style diet plan with macros and cooking instructions.</CardDescription>
                </CardHeader>
                <CardContent className="prose max-w-none whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md">
                    {dietPlan || "No diet plan generated. Please try again."}
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Weekly Meal Plan</CardTitle>
                <CardDescription>Your 7-day Indian-style diet plan with macros and cooking instructions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {parsedDiet.map((diet, index) => (
                    <div key={index} className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">{diet.day}</h3>
                        <ul className="space-y-4 pl-4">
                            {diet.meals.map((meal, mealIndex) => (
                                <li key={mealIndex} className="bg-muted/50 p-4 rounded-lg list-none ml-[-1rem]">
                                    <h4 className="text-md font-semibold">{meal.name}</h4>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1 my-2">
                                        <Flame className="w-4 h-4 text-orange-500" />
                                        <strong>Macros:</strong> {meal.macros}
                                    </p>
                                    <div className="text-sm">
                                        <h5 className="font-semibold flex items-center gap-1 mb-1">
                                            <ChefHat className="w-4 h-4 text-primary" />
                                            Cooking Instructions:
                                        </h5>
                                        <p className="prose prose-sm max-w-none whitespace-pre-wrap text-muted-foreground pl-2">
                                            {meal.instructions}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
