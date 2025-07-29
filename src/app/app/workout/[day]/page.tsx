
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function WorkoutPage() {
    const router = useRouter();
    const params = useParams();
    const day = params.day;

    return (
        <div className="max-w-4xl mx-auto">
            <Button variant="outline" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2"/>
                Back to Plan
            </Button>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold">Workout: Day {day}</CardTitle>
                    <CardDescription>Time to get to work! Follow the plan below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="w-full h-64 relative rounded-lg overflow-hidden">
                        <Image src="https://placehold.co/800x400.png" alt="Workout motivation" layout="fill" objectFit="cover" data-ai-hint="gym workout" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg text-muted-foreground">
                            The interactive timer and exercise tracker are coming soon!
                        </p>
                        <p className="text-lg mt-4">For now, please refer to your plan and complete the exercises for Day {day}.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
