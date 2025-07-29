
"use client";

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
            <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-bold mb-2">Workout Plan</h3>
                <pre className="prose max-w-none whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-md">
                  {workoutPlan}
                </pre>
            </div>
             <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-bold mb-2">Indian-Style Diet Plan</h3>
                 <pre className="prose max-w-none whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-md">
                  {dietPlan}
                </pre>
            </div>
             <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-bold mb-2">Supplement Recommendations</h3>
                 <pre className="prose max-w-none whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-md">
                  {supplementPlan}
                </pre>
            </div>
         </div>
       </div>

       <div className="border-2 border-primary/20 shadow-lg rounded-lg no-print">
        <div className="text-center p-6">
          <h2 className="text-2xl font-semibold leading-none tracking-tight">Your Personalized Plan</h2>
          <p className="text-sm text-muted-foreground mt-1.5">
            Here are your AI-generated workout, diet, and supplement plans.
          </p>
        </div>
        <div className="p-6 pt-0">
          <Tabs defaultValue="workout" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="workout"><Dumbbell className="mr-2 h-4 w-4" />Workout</TabsTrigger>
              <TabsTrigger value="diet"><Apple className="mr-2 h-4 w-4" />Diet</TabsTrigger>
              <TabsTrigger value="supplements"><Sparkles className="mr-2 h-4 w-4" />Supplements</TabsTrigger>
            </TabsList>
            <div className="pt-4">
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
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center no-print pt-4">
        <Button onClick={handlePrint}><Download className="mr-2 h-4 w-4" /> Download Plan</Button>
        <Button variant="outline" onClick={onStartOver}><RefreshCw className="mr-2 h-4 w-4" /> Start Over</Button>
      </div>
    </div>
  );
}
