
"use client";

import { useState } from "react";
import type { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import type { formSchema } from "@/lib/schemas";
import FitmateForm from "@/components/fitmate/FitmateForm";
import PlanDisplay from "@/components/fitmate/PlanDisplay";
import { generatePlansAction } from "@/app/actions";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Plans = {
  workoutPlan: string;
  dietPlan: string;
  supplementPlan: string;
};

export default function GeneratePage() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plans | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    setPlans(null);
    try {
      const result = await generatePlansAction(data);
      if (result.error || !result.dietPlan || !result.workoutPlan || !result.supplementPlan) {
        throw new Error(result.error || "Failed to generate plans.");
      }
      setPlans({
        workoutPlan: result.workoutPlan.workoutPlan,
        dietPlan: result.dietPlan.dietPlan,
        supplementPlan: result.supplementPlan.supplementPlan,
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
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-8 bg-transparent border-0 shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Plan Generator</CardTitle>
          <CardDescription className="text-lg">
            Fill out the form below to get your personalized fitness and diet plans.
          </CardDescription>
        </CardHeader>
      </Card>
      {plans ? (
        <PlanDisplay
          workoutPlan={plans.workoutPlan}
          dietPlan={plans.dietPlan}
          supplementPlan={plans.supplementPlan}
          onStartOver={handleStartOver}
        />
      ) : (
        <FitmateForm onSubmit={handleFormSubmit} loading={loading} />
      )}
    </div>
  );
}
