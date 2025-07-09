"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from 'lucide-react';
import ProteinTracker from "./ProteinTracker";

type PlanDisplayProps = {
  workoutPlan: string;
  dietPlan: string;
  proteinGoal: number;
  onStartOver: () => void;
};

export default function PlanDisplay({
  workoutPlan,
  dietPlan,
  proteinGoal,
  onStartOver,
}: PlanDisplayProps) {

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Your Personalized Plan</CardTitle>
          <CardDescription>
            Here are your custom-generated workout and diet plans. You can track your daily protein and download your plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="workout" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="workout">Workout Plan</TabsTrigger>
              <TabsTrigger value="diet">Diet Plan</TabsTrigger>
            </TabsList>
            <div id="printable-plan" className="printable-area">
              <TabsContent value="workout">
                <Card>
                  <CardHeader>
                    <CardTitle>Workout Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="prose max-w-none whitespace-pre-wrap font-mono text-sm">
                    {workoutPlan}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="diet">
                <Card>
                  <CardHeader>
                    <CardTitle>Indian-Style Diet Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="prose max-w-none whitespace-pre-wrap font-mono text-sm">
                    {dietPlan}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <ProteinTracker proteinGoal={proteinGoal} />

      <div className="flex flex-col sm:flex-row gap-4 justify-center no-print">
        <Button onClick={handlePrint}><Download className="mr-2 h-4 w-4" /> Download as PDF</Button>
        <Button variant="outline" onClick={onStartOver}><RefreshCw className="mr-2 h-4 w-4" /> Start Over</Button>
      </div>
    </div>
  );
}
