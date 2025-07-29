
"use client";

type Meal = {
    meal: string;
    details: string;
};

const parseDietPlan = (plan: string): Meal[] => {
    if (!plan) return [];
    const mealRegex = /(Breakfast:|Lunch:|Dinner:|Snacks:|Snack\s*\d*:|Pre-workout:|Post-workout:)/ig;
    const parts = plan.split(mealRegex).filter(s => s.trim() !== '');

    if (parts.length <= 1) {
        return [{ meal: "Full Day Diet", details: plan }];
    }

    const meals: Meal[] = [];
    for (let i = 0; i < parts.length; i += 2) {
        const mealTitle = parts[i]?.replace(':', '').trim();
        const mealDetails = parts[i + 1]?.trim();
        if (mealTitle && mealDetails) {
            meals.push({ meal: mealTitle, details: mealDetails });
        }
    }
    return meals;
};

type DietPlanTabProps = {
    dietPlan: string;
};

export default function DietPlanTab({ dietPlan }: DietPlanTabProps) {
    const parsedDiet = parseDietPlan(dietPlan);

    return (
        <div className="border rounded-lg p-4">
            <div className="mb-4">
                <h3 className="text-xl font-semibold">Daily Meal Plan</h3>
                <p className="text-muted-foreground">Your Indian-style diet plan for the day.</p>
            </div>
            <div className="space-y-4">
                {parsedDiet.map((meal, index) => (
                    <div key={index} className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-bold text-lg mb-1">{meal.meal}</h4>
                        <p className="whitespace-pre-wrap font-mono text-sm">{meal.details}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
