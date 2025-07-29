
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Sparkles, Apple, Dumbbell } from 'lucide-react';

type PlanDisplayProps = {
  workoutPlan: string;
  dietPlan: string;
  supplementPlan: string;
  onStartOver: () => void;
};

// A simple parser for the supplement plan string.
// This will work if the AI returns a consistently formatted numbered list.
const parseSupplements = (plan: string): { name: string; description: string }[] => {
  if (!plan) return [];
  
  // Split by lines and filter out empty ones
  const lines = plan.split('\n').filter(line => line.trim() !== '');
  
  const supplements: { name: string; description: string }[] = [];
  
  lines.forEach(line => {
    // Regex to find a line starting with a number, a dot, and optional space.
    const match = line.match(/^\d+\.\s*(.*?):(.*)/);
    if (match) {
      const name = match[1]?.trim();
      const description = match[2]?.trim();
      if (name && description) {
        supplements.push({ name, description });
      }
    }
  });

  // Fallback for a less structured format
  if (supplements.length === 0) {
     const items = plan.split('\n\n').filter(p => p.trim());
     return items.map(item => {
       const [namePart, ...descriptionParts] = item.split(':');
       const name = namePart.replace(/^\d+\.\s*/, '').trim();
       const description = descriptionParts.join(':').trim();
       return { name, description: description || 'No description available.' };
     }).filter(s => s.name);
  }

  return supplements;
};


export default function PlanDisplay({
  workoutPlan,
  dietPlan,
  supplementPlan,
  onStartOver,
}: PlanDisplayProps) {

  const handlePrint = () => {
    window.print();
  };
  
  const parsedSupplements = parseSupplements(supplementPlan);

  return (
    <div className="space-y-6">
       <div className="hidden">
         <div id="printable-plan" className="printable-area pt-4 space-y-4">
            <Card>
                <CardHeader>
                <CardTitle>Workout Plan</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-md">
                {workoutPlan}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle>Indian-Style Diet Plan</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-md">
                {dietPlan}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle>Supplement Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-md">
                {supplementPlan}
                </CardContent>
            </Card>
         </div>
       </div>

       <Card className="border-2 border-green-200 shadow-lg no-print">
        <CardHeader className="text-center">
          <CardTitle>Your Personalized Plan</CardTitle>
          <CardDescription>
            Here are your AI-generated workout, diet, and supplement plans.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="workout" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="workout"><Dumbbell className="mr-2" />Workout</TabsTrigger>
              <TabsTrigger value="diet"><Apple className="mr-2" />Diet</TabsTrigger>
              <TabsTrigger value="supplements"><Sparkles className="mr-2" />Supplements</TabsTrigger>
            </TabsList>
            <div className="pt-4">
              <TabsContent value="workout">
                <Card>
                  <CardHeader>
                    <CardTitle>Workout Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="prose max-w-none whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md">
                    {workoutPlan}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="diet">
                <Card>
                  <CardHeader>
                    <CardTitle>Indian-Style Diet Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="prose max-w-none whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md">
                    {dietPlan}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="supplements">
                 <Card>
                   <CardHeader>
                      <CardTitle>Supplement Recommendations</CardTitle>
                      <CardDescription>Based on your profile, here are a few suggestions.</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      {parsedSupplements.length > 0 ? (
                        parsedSupplements.map((supplement, index) => (
                          <Card key={index} className="bg-muted/50">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-accent" />
                                {supplement.name}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">{supplement.description}</p>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">The supplement plan couldn't be displayed in a structured format. Here is the raw text:</p>
                      )}
                      {parsedSupplements.length === 0 && (
                        <div className="prose max-w-none whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md">
                          {supplementPlan}
                        </div>
                      )}
                   </CardContent>
                 </Card>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center no-print pt-4">
        <Button onClick={handlePrint}><Download className="mr-2 h-4 w-4" /> Download Plan</Button>
        <Button variant="outline" onClick={onStartOver}><RefreshCw className="mr-2 h-4 w-4" /> Start Over</Button>
      </div>
    </div>
  );
}
