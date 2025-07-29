"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

type SupplementPlanTabProps = {
  supplementPlan: string;
};

const parseSupplements = (plan: string): { name: string; description: string }[] => {
  if (!plan) return [];
  const lines = plan.split('\n').filter(line => line.trim() !== '');
  const supplements: { name: string; description: string }[] = [];
  lines.forEach(line => {
    const match = line.match(/^\d+\.\s*(.*?):(.*)/);
    if (match) {
      const name = match[1]?.trim();
      const description = match[2]?.trim();
      if (name && description) {
        supplements.push({ name, description });
      }
    }
  });

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


export default function SupplementPlanTab({ supplementPlan }: SupplementPlanTabProps) {
  const parsedSupplements = parseSupplements(supplementPlan);

  return (
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
                </Title>
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
  );
}
