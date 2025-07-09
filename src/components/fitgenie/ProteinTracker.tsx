"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

type ProteinTrackerProps = {
  proteinGoal: number;
};

export default function ProteinTracker({ proteinGoal }: ProteinTrackerProps) {
  const [currentProtein, setCurrentProtein] = useState(0);
  const [amountToAdd, setAmountToAdd] = useState("");

  const handleAddProtein = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(amountToAdd, 10);
    if (!isNaN(amount) && amount > 0) {
      setCurrentProtein((prev) => prev + amount);
      setAmountToAdd("");
    }
  };

  const progressPercentage = Math.min((currentProtein / proteinGoal) * 100, 100);

  return (
    <Card className="no-print">
      <CardHeader>
        <CardTitle>Daily Protein Tracker</CardTitle>
        <CardDescription>
          Your daily protein target is {proteinGoal}g. Use this tracker to stay on top of your goal.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1 text-sm font-medium">
            <span>Progress</span>
            <span>{currentProtein}g / {proteinGoal}g</span>
          </div>
          <Progress value={progressPercentage} aria-label={`${currentProtein} of ${proteinGoal} grams of protein consumed`} />
        </div>
        <form onSubmit={handleAddProtein} className="flex gap-2">
          <Input
            type="number"
            placeholder="Enter protein (g)"
            value={amountToAdd}
            onChange={(e) => setAmountToAdd(e.target.value)}
            className="max-w-xs"
            aria-label="Protein amount to add"
          />
          <Button type="submit"><Plus className="mr-2 h-4 w-4" /> Add</Button>
        </form>
      </CardContent>
    </Card>
  );
}
