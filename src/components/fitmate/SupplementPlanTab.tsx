
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

type Supplement = {
    name: string;
    description: string;
};

const parseSupplements = (plan: string): Supplement[] => {
  if (!plan) return [];
  const lines = plan.split('\n').filter(line => line.trim() !== '');
  const supplements: Supplement[] = [];
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

  // Fallback for different formats
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

type SupplementPlanTabProps = {
  supplementPlan: string;
};

export default function SupplementPlanTab({ supplementPlan }: SupplementPlanTabProps) {
  const parsedSupplements = parseSupplements(supplementPlan);

  return (
    <div className="supplement-section p-6">
      <Card className="glass-card-dark border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Supplement Recommendations</CardTitle>
          <CardDescription className="text-white/70">Based on your profile, here are a few suggestions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {parsedSupplements.length > 0 ? (
            parsedSupplements.map((supplement, index) => (
              <div key={index} className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <h4 className="text-lg font-bold flex items-center gap-2 mb-1 text-white">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    {supplement.name}
                  </h4>
                  <p className="text-sm text-white/80">{supplement.description}</p>
              </div>
            ))
          ) : (
             <div className="prose max-w-none whitespace-pre-wrap font-mono text-sm bg-black/20 p-4 rounded-md text-white/90">
              {supplementPlan}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
