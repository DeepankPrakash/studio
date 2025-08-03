
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Flame } from "lucide-react";

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
    const dayBlocks = plan.split(/(?=^Day\s*\d+)/im).filter(s => s.trim());

    dayBlocks.forEach(block => {
        const lines = block.trim().split('\n');
        const dayMatch = lines[0].match(/Day\s*\d+/i);
        if (!dayMatch) return;

        const day = dayMatch[0];
        const meals: Meal[] = [];
        let currentMeal: Partial<Meal> | null = null;
        
        const mealTypes = ['Breakfast:', 'Lunch:', 'Dinner:'];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            
            const mealType = mealTypes.find(type => line.startsWith(type));
            
            if (mealType) {
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
                    // Append to existing instructions if they span multiple lines
                    currentMeal.instructions += `\n${line}`;
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
            <CardContent className="space-y-4">
                 <Accordion type="single" collapsible className="w-full">
                    {parsedDiet.map((diet, index) => (
                        <AccordionItem value={`day-${index}`} key={index}>
                            <AccordionTrigger>{diet.day}</AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-4">
                                    {diet.meals.map((meal, mealIndex) => (
                                        <div key={mealIndex} className="p-4 bg-muted/50 rounded-lg">
                                            <h4 className="text-md font-semibold">{meal.name}</h4>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1 my-1">
                                                <Flame className="w-4 h-4 text-orange-500" />
                                                {meal.macros}
                                            </p>
                                            <Accordion type="single" collapsible className="w-full">
                                                <AccordionItem value={`instr-${index}-${mealIndex}`}>
                                                    <AccordionTrigger className="text-sm py-2">Cooking Instructions</AccordionTrigger>
                                                    <AccordionContent>
                                                        <p className="prose prose-sm max-w-none whitespace-pre-wrap text-sm">
                                                            {meal.instructions}
                                                        </p>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            </Accordion>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}
