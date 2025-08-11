
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Meal = {
    name: string;
    macros: string;
    instructions: string;
};

type DayPlan = {
    day: string;
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
};

const parseDietPlan = (plan: string): DayPlan[] => {
    if (!plan) return [];
    try {
        const parsed = JSON.parse(plan);
        if (Array.isArray(parsed)) {
            return parsed;
        }
        return [];
    } catch (error) {
        console.error("Failed to parse diet plan JSON:", error);
        return [];
    }
};

type DietPlanTabProps = {
    dietPlan: string;
};

const MealCard = ({ title, meal }: { title: string, meal: Meal }) => (
    <div>
        <h4 className="font-semibold text-md">{title}</h4>
        <p className="font-bold text-sm text-primary">{meal.name}</p>
        <p className="text-xs text-muted-foreground">{meal.macros}</p>
        <p className="text-sm mt-1">{meal.instructions}</p>
    </div>
);


export default function DietPlanTab({ dietPlan }: DietPlanTabProps) {
    const parsedPlan = parseDietPlan(dietPlan);

    if (parsedPlan.length === 0) {
        return (
            <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Your Diet Plan</h3>
                <div className="prose max-w-none whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md">
                    {dietPlan || "No diet plan generated. Please try again."}
                </div>
            </div>
        );
    }
    
    return (
        <div>
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">Your 7-Day Diet Plan</h3>
                <p className="text-muted-foreground">A weekly plan tailored to your goals.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                {parsedPlan.map((day, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{day.day}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <MealCard title="Breakfast" meal={day.breakfast} />
                            <Separator />
                            <MealCard title="Lunch" meal={day.lunch} />
                            <Separator />
                            <MealCard title="Dinner" meal={day.dinner} />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
