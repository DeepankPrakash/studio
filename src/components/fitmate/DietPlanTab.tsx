
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
    const dayRegex = /(Day\s*\d+\s*)/i;
    const dailyPlans = plan.split(dayRegex).filter(s => s.trim() !== '');

    const result: DailyDiet[] = [];
    for (let i = 0; i < dailyPlans.length; i += 2) {
        const dayTitle = dailyPlans[i]?.trim();
        const dayContent = dailyPlans[i + 1]?.trim();
        if (dayTitle && dayContent) {
            const mealRegex = /(Breakfast:|Lunch:|Dinner:)/gi;
            const mealParts = dayContent.split(mealRegex).filter(p => p.trim() !== '');
            const meals: Meal[] = [];
            for (let j = 0; j < mealParts.length; j += 2) {
                const mealType = mealParts[j].replace(':', '').trim();
                const mealDetails = mealParts[j + 1]?.trim();
                if(mealType && mealDetails) {
                    const lines = mealDetails.split('\n');
                    const dishName = lines[0]?.trim() || '';
                    const macrosLine = lines.find(line => line.toLowerCase().startsWith('macros:'));
                    const instructionsLine = lines.find(line => line.toLowerCase().startsWith('cooking instructions:'));
                    
                    meals.push({
                        name: `${mealType}: ${dishName}`,
                        macros: macrosLine ? macrosLine.replace(/macros:\s*/i, '') : 'Not specified',
                        instructions: instructionsLine ? instructionsLine.replace(/cooking instructions:\s*/i, '') : 'Not specified',
                    });
                }
            }
             result.push({ day: dayTitle, meals });
        }
    }
    return result;
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
                        <AccordionItem value={`item-${index}`} key={index}>
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
                                                <AccordionItem value={`instr-${mealIndex}`}>
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
