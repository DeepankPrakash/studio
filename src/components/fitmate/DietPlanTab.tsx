
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

    const dayBlocks = plan.split(/(?=^Day\s*\d+)/im).filter(Boolean);

    return dayBlocks.map(block => {
        const lines = block.trim().split('\n');
        const day = lines[0]?.trim() || 'Unknown Day';

        const meals: Meal[] = [];
        let currentMeal: Partial<Meal> & { type: string } | null = null;
        
        const mealMarkers = ['Breakfast:', 'Lunch:', 'Dinner:'];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            const marker = mealMarkers.find(m => line.startsWith(m));

            if (marker) {
                if (currentMeal) {
                    meals.push({
                        name: `${currentMeal.type} ${currentMeal.name || ''}`,
                        macros: currentMeal.macros || 'Not specified',
                        instructions: currentMeal.instructions || 'Not specified'
                    });
                }
                currentMeal = { type: marker.replace(':', ''), name: line.substring(marker.length).trim(), instructions: '' };
            } else if (currentMeal) {
                if (line.startsWith('Macros:')) {
                    currentMeal.macros = line.substring('Macros:'.length).trim();
                } else if (line.startsWith('Cooking Instructions:')) {
                    currentMeal.instructions = line.substring('Cooking Instructions:'.length).trim();
                } else if (currentMeal.instructions) {
                    currentMeal.instructions += `\n${line}`;
                }
            }
        }
        
        if (currentMeal) {
            meals.push({
                name: `${currentMeal.type} ${currentMeal.name || ''}`,
                macros: currentMeal.macros || 'Not specified',
                instructions: currentMeal.instructions || 'Not specified'
            });
        }
        
        return { day, meals };
    }).filter(d => d.meals.length > 0);
};

type DietPlanTabProps = {
    dietPlan: string;
};

export default function DietPlanTab({ dietPlan }: DietPlanTabProps) {
    const parsedDiet = parseDietPlan(dietPlan);

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
