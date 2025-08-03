
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Sparkles, Apple, Dumbbell } from 'lucide-react';
import WorkoutPlanTab from "./WorkoutPlanTab";
import DietPlanTab from "./DietPlanTab";
import SupplementPlanTab from "./SupplementPlanTab";

type PlanDisplayProps = {
  workoutPlan: string;
  dietPlan: string;
  supplementPlan: string;
  onStartOver: () => void;
};

const handlePrint = () => {
  window.print();
};

export default function PlanDisplay({
  workoutPlan,
  dietPlan,
  supplementPlan,
  onStartOver,
}: PlanDisplayProps) {

  return (
    <div className="space-y-6">
       <div className="hidden print:block">
         <div id="printable-plan" className="printable-area pt-4 space-y-4">
            <h1 className="text-2xl font-bold text-center">Your FITMATE Plan</h1>
            <div className="prose max-w-none">
              <h2 className="text-xl font-semibold">Workout Plan</h2>
              <p className="whitespace-pre-wrap font-mono text-sm">{workoutPlan}</p>
            </div>
             <div className="prose max-w-none">
              <h2 className="text-xl font-semibold">Indian-Style Diet Plan</h2>
              <p className="whitespace-pre-wrap font-mono text-sm">{dietPlan}</p>
            </div>
             <div className="prose max-w-none">
              <h2 className="text-xl font-semibold">Supplement Recommendations</h2>
              <p className="whitespace-pre-wrap font-mono text-sm">{supplementPlan}</p>
            </div>
         </div>
       </div>

       <Card className="shadow-lg no-print">
        <CardHeader className="text-center bg-muted/30 rounded-t-lg">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Dumbbell className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="mt-4">Your Personalized Plan</CardTitle>
          <CardDescription>
            Here are your AI-generated workout, diet, and supplement plans.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="workout" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-none bg-muted/30">
              <TabsTrigger value="workout" className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-primary"><Dumbbell className="mr-2" />Workout</TabsTrigger>
              <TabsTrigger value="diet" className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-primary"><Apple className="mr-2" />Diet</TabsTrigger>
              <TabsTrigger value="supplements" className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-primary"><Sparkles className="mr-2" />Supplements</TabsTrigger>
            </TabsList>
            <div className="p-6">
              <TabsContent value="workout">
                <WorkoutPlanTab workoutPlan={workoutPlan} />
              </TabsContent>
              <TabsContent value="diet">
                <DietPlanTab dietPlan={dietPlan} />
              </TabsContent>
              <TabsContent value="supplements">
                 <SupplementPlanTab supplementPlan={supplementPlan} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center no-print pt-4">
        <Button onClick={handlePrint} size="lg"><Download className="mr-2 h-4 w-4" /> Download Plan</Button>
        <Button variant="outline" onClick={onStartOver} size="lg"><RefreshCw className="mr-2 h-4 w-4" /> Start Over</Button>
      </div>
    </div>
  );
}
