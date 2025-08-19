
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
    
    // Split by day patterns
    const dayPattern = /Day\s*(\d+)\s*:\s*([^\n]+)/gi;
    const dayMatches = [...plan.matchAll(dayPattern)];
    
    if (dayMatches.length === 0) {
        // Fallback: treat entire content as one workout
        const lines = plan.split('\n').filter(line => line.trim() !== '');
        const exercises = lines
            .filter(line => /^\d+\./.test(line.trim())) // Lines starting with numbers
            .map(line => {
                const cleanLine = line.replace(/^\d+\.\s*/, '').trim();
                const parts = cleanLine.split(':');
                return {
                    name: parts[0]?.trim() || cleanLine,
                    sets: parts[1]?.trim() || 'As prescribed'
                };
            });
        
        return [{
            day: "Workout",
            focus: "Complete Plan",
            exercises: exercises.length > 0 ? exercises : [{ name: plan.trim(), sets: '' }],
            dayNumber: 1
        }];
    }

    const workouts: WorkoutDay[] = [];
    
    dayMatches.forEach((match, index) => {
        const dayNumber = parseInt(match[1], 10);
        const focus = match[2].trim();
        
        // Find the start and end of this day's content
        const startIndex = match.index! + match[0].length;
        const nextDayIndex = index < dayMatches.length - 1 
            ? dayMatches[index + 1].index!
            : plan.length;
        
        const dayContent = plan.substring(startIndex, nextDayIndex).trim();
        
        // Extract exercises (lines that start with numbers)
        const exerciseLines = dayContent
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && /^\d+\./.test(line));
        
        const exercises = exerciseLines.map(line => {
            const cleanLine = line.replace(/^\d+\.\s*/, '').trim();
            const parts = cleanLine.split(':');
            return {
                name: parts[0]?.trim() || 'Unknown Exercise',
                sets: parts[1]?.trim() || 'As prescribed'
            };
        });

        if (exercises.length > 0) {
            workouts.push({
                day: `Day ${dayNumber}`,
                focus,
                exercises,
                dayNumber,
            });
        }
    });

    return workouts;
};

type WorkoutPlanTabProps = {
  workoutPlan: string;
};

export default function WorkoutPlanTab({ workoutPlan }: WorkoutPlanTabProps) {
  const parsedWorkout = parseWorkoutPlan(workoutPlan);
  
  // Debug: Log the original plan and parsed result
  console.log('Original workout plan:', workoutPlan);
  console.log('Parsed workout:', parsedWorkout);

  if (!workoutPlan || workoutPlan.trim() === '') {
    return (
      <div className="text-center py-8">
        <p className="text-white/70">No workout plan available. Please generate a new plan.</p>
      </div>
    );
  }

  if (parsedWorkout.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white">Your Workout Plan</h3>
          <p className="text-white/70">Raw workout plan content:</p>
        </div>
        <Card className="glass-card-dark border-white/20">
          <CardContent className="pt-6">
            <pre className="whitespace-pre-wrap text-sm text-white/90">{workoutPlan}</pre>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white">Your Weekly Workout Schedule</h3>
            <p className="text-white/70">Here is your plan, broken down by day.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parsedWorkout.map((workout, index) => (
            <Card key={index} className="flex flex-col glass-card-dark border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                    <span>{workout.day}: {workout.focus}</span>
                    <Dumbbell className="h-6 w-6 text-blue-400" />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                <ul className="space-y-2">
                    {workout.exercises.map((exercise, exIndex) => (
                        <li key={exIndex} className="text-sm text-white/90">
                            <span className="font-semibold text-white">{exercise.name}:</span>
                            <span className="text-white/70 ml-1">{exercise.sets}</span>
                        </li>
                    ))}
                </ul>
                <Link href={`/app/workout/${workout.dayNumber}`} passHref>
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
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
