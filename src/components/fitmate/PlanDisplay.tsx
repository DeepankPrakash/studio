
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from 'lucide-react';
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

       <Card className="no-print glass-card-dark border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="gradient-text">Your Personalized Plan</CardTitle>
          <CardDescription className="text-white/80">
            Here are your AI-generated workout, diet, and supplement plans.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="workout" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10">
              <TabsTrigger value="workout" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Workout</TabsTrigger>
              <TabsTrigger value="diet" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Diet</TabsTrigger>
              <TabsTrigger value="supplements" className="text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Supplements</TabsTrigger>
            </TabsList>
            <TabsContent value="workout">
              <WorkoutPlanTab workoutPlan={workoutPlan} />
            </TabsContent>
            <TabsContent value="diet">
              <DietPlanTab dietPlan={dietPlan} />
            </TabsContent>
            <TabsContent value="supplements">
               <SupplementPlanTab supplementPlan={supplementPlan} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center no-print">
        <Button onClick={handlePrint}><Download className="mr-2 h-4 w-4" /> Download Plan</Button>
        <Button variant="outline" onClick={onStartOver}><RefreshCw className="mr-2 h-4 w-4" /> Start Over</Button>
      </div>
    </div>
  );
}
