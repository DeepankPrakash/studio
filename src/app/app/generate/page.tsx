
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { formSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generatePlansAction } from "@/app/actions";

type Plans = {
  workoutPlan: string;
  dietPlan: string;
  supplementPlan: string;
};

export default function GeneratePage() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plans | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 25,
      weight: 70,
      height: 175,
      gender: "male",
      goal: "cut",
      activityLevel: "moderately active",
      experienceLevel: "intermediate",
      workoutDays: 4,
      workoutTime: 60,
      equipment: "Basic gym equipment (dumbbells, barbells, bench)",
      foodPreferences: "I like chicken, rice, lentils, and spinach. I dislike beetroot.",
      injuries: "None",
      previousPlan: "None",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    setPlans(null);
    try {
      const result = await generatePlansAction(data);
      if (result.error || !result.dietPlan || !result.workoutPlan || !result.supplementPlan) {
        throw new Error(result.error || "Failed to generate plans.");
      }
      setPlans({
        workoutPlan: result.workoutPlan.workoutPlan,
        dietPlan: result.dietPlan.dietPlan,
        supplementPlan: result.supplementPlan.supplementPlan,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleStartOver = () => {
    setPlans(null);
    form.reset();
  };

  return (
    <div className="max-w-4xl mx-auto">
       <Card className="mb-8 bg-transparent border-0 shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Plan Generator</CardTitle>
          <CardDescription className="text-lg">
            Fill out the form below to get your personalized fitness and diet plans.
          </CardDescription>
        </CardHeader>
      </Card>

      {!plans ? (
        <Card className="border-2 border-green-200 shadow-lg">
            <CardContent className="pt-6">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="age" render={({ field }) => (
                            <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="weight" render={({ field }) => (
                            <FormItem><FormLabel>Weight (kg)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="height" render={({ field }) => (
                            <FormItem><FormLabel>Height (cm)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="gender" render={({ field }) => (
                            <FormItem><FormLabel>Gender</FormLabel><FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2">
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="male" /></FormControl><FormLabel>Male</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="female" /></FormControl><FormLabel>Female</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="other" /></FormControl><FormLabel>Other</FormLabel></FormItem>
                                </RadioGroup>
                            </FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>

                    <FormField control={form.control} name="goal" render={({ field }) => (
                        <FormItem><FormLabel>Primary Goal</FormLabel><FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2">
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="cut" /></FormControl><FormLabel>Cut (Lose Fat)</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="bulk" /></FormControl><FormLabel>Bulk (Gain Muscle)</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="maintain" /></FormControl><FormLabel>Maintain</FormLabel></FormItem>
                            </RadioGroup>
                        </FormControl><FormMessage /></FormItem>
                    )}/>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="activityLevel" render={({ field }) => (
                        <FormItem><FormLabel>Activity Level</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select your activity level" /></SelectTrigger></FormControl>
                            <SelectContent>
                            <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                            <SelectItem value="lightly active">Lightly active (light exercise/sports 1-3 days/week)</SelectItem>
                            <SelectItem value="moderately active">Moderately active (moderate exercise/sports 3-5 days/week)</SelectItem>
                            <SelectItem value="very active">Very active (hard exercise/sports 6-7 days a week)</SelectItem>
                            <SelectItem value="extra active">Extra active (very hard exercise/sports & physical job)</SelectItem>
                            </SelectContent>
                        </Select><FormMessage /></FormItem>
                        )}/>

                        <FormField control={form.control} name="experienceLevel" render={({ field }) => (
                            <FormItem><FormLabel>Experience Level</FormLabel><FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2">
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="beginner" /></FormControl><FormLabel>Beginner</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="intermediate" /></FormControl><FormLabel>Intermediate</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="advanced" /></FormControl><FormLabel>Advanced</FormLabel></FormItem>
                                </RadioGroup>
                            </FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="workoutDays" render={({ field }) => (
                            <FormItem><FormLabel>Workout Days per Week</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="workoutTime" render={({ field }) => (
                            <FormItem><FormLabel>Time per Workout (minutes)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>

                    <FormField control={form.control} name="equipment" render={({ field }) => (
                        <FormItem><FormLabel>Available Equipment</FormLabel><FormControl><Textarea {...field} /></FormControl><FormDescription>e.g., Dumbbells, treadmill, resistance bands, or full gym access.</FormDescription><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="foodPreferences" render={({ field }) => (
                        <FormItem><FormLabel>Food Preferences & Dislikes (Indian Style)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormDescription>List your favorite and least favorite foods. Be specific!</FormDescription><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="injuries" render={({ field }) => (
                        <FormItem><FormLabel>Injuries</FormLabel><FormControl><Textarea {...field} /></FormControl><FormDescription>List any current or past injuries that might affect your training. If none, type 'None'.</FormDescription><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="previousPlan" render={({ field }) => (
                        <FormItem><FormLabel>Previous Plan</FormLabel><FormControl><Textarea {...field} /></FormControl><FormDescription>Describe any workout or diet plan you were following before. If none, type 'None'.</FormDescription><FormMessage /></FormItem>
                    )}/>

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate Plan
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
            <div id="printable-plan" className="printable-area pt-4 space-y-4">
              <Card>
                  <CardHeader>
                  <CardTitle>Workout Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="prose max-w-none whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-md">
                  {plans.workoutPlan}
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader>
                  <CardTitle>Indian-Style Diet Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="prose max-w-none whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-md">
                  {plans.dietPlan}
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader>
                  <CardTitle>Supplement Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="prose max-w-none whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-md">
                  {plans.supplementPlan}
                  </CardContent>
              </Card>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center no-print pt-4">
                <Button onClick={handlePrint}><Download className="mr-2 h-4 w-4" /> Download Plan</Button>
                <Button variant="outline" onClick={handleStartOver}><RefreshCw className="mr-2 h-4 w-4" /> Start Over</Button>
            </div>
        </div>
      )}
    </div>
  );
}

