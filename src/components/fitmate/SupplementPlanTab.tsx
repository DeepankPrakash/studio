
"use client";

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
    <div className="border rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Supplement Recommendations</h3>
        <p className="text-muted-foreground">Based on your profile, here are a few suggestions.</p>
      </div>
      <div className="space-y-4">
        {parsedSupplements.length > 0 ? (
          parsedSupplements.map((supplement, index) => (
            <div key={index} className="bg-muted/50 p-4 rounded-lg">
                <h4 className="text-lg font-bold flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  {supplement.name}
                </h4>
                <p className="text-sm text-muted-foreground">{supplement.description}</p>
            </div>
          ))
        ) : (
           <div className="prose max-w-none whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md">
            {supplementPlan}
          </div>
        )}
      </div>
    </div>
  );
}
