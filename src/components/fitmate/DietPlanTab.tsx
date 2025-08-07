
"use client";

type DietPlanTabProps = {
    dietPlan: string;
};

export default function DietPlanTab({ dietPlan }: DietPlanTabProps) {
    return (
        <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Your Diet Plan</h3>
            <div className="prose max-w-none whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md">
                {dietPlan || "No diet plan generated. Please try again."}
            </div>
        </div>
    );
}
