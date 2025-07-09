"use client";

import { useState } from "react";
import type { z } from "zod";
import { Dumbbell } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { formSchema } from "@/lib/schemas";
import FitGenieForm from "@/components/fitgenie/FitGenieForm";
import PlanDisplay from "@/components/fitgenie/PlanDisplay";
import { generatePlansAction } from "./actions";

type Plans = {
  workoutPlan: string;
  dietPlan: string;
};

export default function Home() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plans | null>(null);
  const [formValues, setFormValues] = useState<z.infer<typeof formSchema> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    setFormValues(data);
    try {
      const result = await generatePlansAction(data);
      if (result.error) {
        throw new Error(result.error);
      }
      setPlans({
        workoutPlan: result.workoutPlan?.workoutPlan ?? "Could not generate a workout plan.",
        dietPlan: result.dietPlan?.dietPlan ?? "Could not generate a diet plan.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setPlans(null);
    setFormValues(null);
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-8 md:mb-12">
        <div className="flex items-center justify-center gap-4 mb-2">
           <Dumbbell className="w-10 h-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-gray-800">
            FitGenie
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Your personal AI fitness assistant.
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        {plans && formValues ? (
          <PlanDisplay
            workoutPlan={plans.workoutPlan}
            dietPlan={plans.dietPlan}
            proteinGoal={formValues.protein}
            onStartOver={handleStartOver}
          />
        ) : (
          <FitGenieForm onSubmit={handleFormSubmit} loading={loading} />
        )}
      </div>
    </main>
  );
}
