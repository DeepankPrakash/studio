
"use client";

import Link from "next/link";
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
    <div className="border rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Weekly Workout Schedule</h3>
        <p className="text-muted-foreground">Click on a day to see the details and start your workout.</p>
      </div>
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
    </div>
  );
}
