
"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Dumbbell } from "lucide-react";

type Exercise = {
    name: string;
    sets: string;
};

type WorkoutDay = {
    day: string;
    focus: string;
    exercises: Exercise[];
    dayNumber: number;
};

const parseWorkoutPlan = (plan: string): WorkoutDay[] => {
    if (!plan) return [];
    
    const dayRegex = /Day\s*(\d+)\s*:\s*(.*)/i;
    const parts = plan.split(dayRegex).filter(s => s.trim() !== '');

    if (parts.length < 3) {
        // Fallback for non-standard format
        const lines = plan.split('\n').filter(line => line.trim() !== '');
        const dayMatch = lines[0]?.match(dayRegex);
        if (dayMatch) {
            return [{
                day: `Day ${dayMatch[1]}`,
                focus: dayMatch[2] || "Workout",
                exercises: lines.slice(1).map(line => {
                    const exerciseParts = line.replace(/^\d+\.\s*/, '').split(':');
                    return {
                        name: exerciseParts[0]?.trim() || 'Unknown Exercise',
                        sets: exerciseParts[1]?.trim() || 'N/A'
                    };
                }),
                dayNumber: parseInt(dayMatch[1] || '1', 10)
            }];
        }
        return [{ day: "Full Workout", focus: "", exercises: [{ name: plan, sets: '' }], dayNumber: 1 }];
    }

    const workouts: WorkoutDay[] = [];
    for (let i = 0; i < parts.length; i += 3) {
        const dayNumberStr = parts[i]?.trim();
        const focus = parts[i + 1]?.trim();
        const details = parts[i + 2]?.trim();
        
        if (dayNumberStr && focus && details) {
            const dayNumber = parseInt(dayNumberStr, 10);
            const exerciseLines = details.split('\n').filter(line => line.trim() !== '');
            const exercises = exerciseLines.map(line => {
                const exerciseParts = line.replace(/^\d+\.\s*/, '').split(':');
                return {
                    name: exerciseParts[0]?.trim() || 'Unknown Exercise',
                    sets: exerciseParts[1]?.trim() || 'N/A'
                };
            });

            workouts.push({
                day: `Day ${dayNumber}`,
                focus,
                exercises,
                dayNumber,
            });
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
    <div className="space-y-6">
       <div className="text-center mb-6">
            <h3 className="text-2xl font-bold">Your Weekly Workout Schedule</h3>
            <p className="text-muted-foreground">Here is your plan, broken down by day.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parsedWorkout.map((workout, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>{workout.day}: {workout.focus}</span>
                    <Dumbbell className="h-6 w-6 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                <ul className="space-y-2">
                    {workout.exercises.map((exercise, exIndex) => (
                        <li key={exIndex} className="text-sm">
                            <span className="font-semibold">{exercise.name}:</span>
                            <span className="text-muted-foreground ml-1">{exercise.sets}</span>
                        </li>
                    ))}
                </ul>
                <Link href={`/app/workout/${workout.dayNumber}`} passHref>
                  <Button className="w-full mt-4">
                    <PlayCircle className="mr-2 h-4 w-4" /> Start Workout
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
    </div>
  );
}
