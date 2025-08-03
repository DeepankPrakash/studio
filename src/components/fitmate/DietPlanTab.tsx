
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type DailyDiet = {
    day: string;
    details: string;
};

const parseDailyDiet = (plan: string): DailyDiet[] => {
    if (!plan) return [];
    // Regex to split by "Day X"
    const dayRegex = /(Day\s*\d+\s*)/i;
    const parts = plan.split(dayRegex).filter(s => s.trim() !== '');

    if (parts.length <= 1) {
        return [{ day: "Full Diet Plan", details: plan }];
    }
    
    const diets: DailyDiet[] = [];
    for (let i = 0; i < parts.length; i += 2) {
        const dayTitle = parts[i]?.trim();
        const dayDetails = parts[i + 1]?.trim();
        if (dayTitle && dayDetails) {
            diets.push({ day: dayTitle, details: dayDetails });
        }
    }
    return diets;
};

type DietPlanTabProps = {
    dietPlan: string;
};

export default function DietPlanTab({ dietPlan }: DietPlanTabProps) {
    const parsedDiet = parseDailyDiet(dietPlan);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Weekly Meal Plan</CardTitle>
                <CardDescription>Your 7-day Indian-style diet plan with cooking instructions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <Accordion type="single" collapsible className="w-full">
                    {parsedDiet.map((diet, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger>{diet.day}</AccordionTrigger>
                        <AccordionContent>
                            <div className="prose max-w-none whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md">
                                {diet.details}
                            </div>
                        </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
}
