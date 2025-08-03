
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

    const days = plan.split(/Day\s*\d+/i).filter(s => s.trim());
    const dayTitles = plan.match(/Day\s*\d+/gi) || [];

    return days.map((dayContent, index) => {
        const dayTitle = dayTitles[index] || `Day ${index + 1}`;
        const mealRegex = /(Breakfast:|Lunch:|Dinner:)/gi;
        const mealsContent = dayContent.split(mealRegex).filter(s => s.trim());

        const meals: Meal[] = [];
        for (let i = 0; i < mealsContent.length; i += 2) {
            const mealType = mealsContent[i].replace(':', '').trim();
            const mealDetails = mealsContent[i+1]?.trim();

            if (mealType && mealDetails) {
                const nameMatch = mealDetails.split('\n')[0]?.trim();
                const macrosMatch = mealDetails.match(/Macros:(.*)/i);
                const instructionsMatch = mealDetails.match(/Cooking Instructions:(.*)/is);

                meals.push({
                    name: `${mealType}: ${nameMatch || ''}`,
                    macros: macrosMatch ? macrosMatch[1].trim() : 'Not specified',
                    instructions: instructionsMatch ? instructionsMatch[1].trim() : 'Not specified',
                });
            }
        }
        
        return { day: dayTitle.trim(), meals };
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
