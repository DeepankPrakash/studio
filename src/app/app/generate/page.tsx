
"use client";

import { useState, useEffect } from "react";
import type { z } from "zod";
import { formSchema } from "@/lib/schemas";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generatePlansAction, getPlansAction } from "@/app/actions";
import FitmateForm from "@/components/fitmate/FitmateForm";
import PlanDisplay from "@/components/fitmate/PlanDisplay";
import { Skeleton } from "@/components/ui/skeleton";

type Plans = {
  workoutPlan: string;
  dietPlan: string;
  supplementPlan: string;
};

export default function GeneratePage() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plans | null>(null);
  const [loading, setLoading] = useState(true); // Start loading to check for existing plans

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      const existingPlans = await getPlansAction();
      if (existingPlans) {
        setPlans(existingPlans);
      }
      setLoading(false);
    };
    fetchPlans();
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    setPlans(null);
    try {
      const result = await generatePlansAction(data);
      if ('error' in result) {
        throw new Error(result.error);
      }
      setPlans({
        workoutPlan: result.workoutPlan,
        dietPlan: result.dietPlan,
        supplementPlan: result.supplementPlan,
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
       <Card className="mb-8 glass-card-dark border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold gradient-text">Plan Generator</CardTitle>
          <CardDescription className="text-lg text-white/80">
            Fill out the form below to get your personalized fitness and diet plans.
          </CardDescription>
        </CardHeader>
      </Card>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full bg-white/20" />
          <Skeleton className="h-64 w-full bg-white/20" />
          <Skeleton className="h-10 w-32 bg-white/20" />
        </div>
      ) : !plans ? (
        <FitmateForm onSubmit={onSubmit} loading={loading} />
      ) : (
        <PlanDisplay
            workoutPlan={plans.workoutPlan}
            dietPlan={plans.dietPlan}
            supplementPlan={plans.supplementPlan}
            onStartOver={handleStartOver}
        />
      )}
    </div>
  );
}
