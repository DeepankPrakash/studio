
"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

type Workout = {
    day: string;
    details: string;
};

const parseWorkoutPlan = (plan: string): Workout[] => {
    if (!plan) return [];
    const dayRegex = /(Day\s*\d+\s*:.*)/i;
    const parts = plan.split(dayRegex).filter(s => s.trim() !== '');

    if (parts.length <= 1) {
        return [{day: "Full Workout", details: plan}];
    }

    const workouts: Workout[] = [];
    for (let i = 0; i < parts.length; i += 2) {
        const dayTitle = parts[i]?.trim();
        const dayDetails = parts[i + 1]?.trim();
        if (dayTitle && dayDetails) {
            workouts.push({ day: dayTitle, details: dayDetails });
        }
    }
    return workouts;
};

type WorkoutPlanTabProps = {
  workoutPlan: string;
};

export default function WorkoutPlanTab({ workoutPlan }: WorkoutPlanTabProps) {
  const parsedWorkout = parseWorkoutPlan(workoutPlan);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Workout Schedule</CardTitle>
        <CardDescription>Click on a day to see the details and start your workout.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {parsedWorkout.map((workout, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-lg font-semibold">{workout.day}</AccordionTrigger>
              <AccordionContent>
                <div className="prose max-w-none whitespace-pre-wrap font-mono text-sm bg-muted/50 p-4 rounded-md mb-4">
                  {workout.details}
                </div>
                <Link href={`/app/workout/${index + 1}`} passHref>
                  <Button>
                    <PlayCircle className="mr-2 h-4 w-4" /> Start Workout
                  </Button>
                </Link>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
