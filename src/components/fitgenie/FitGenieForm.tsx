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
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

type FitGenieFormProps = {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  loading: boolean;
};

const steps = [
  {
    title: "Personal Details",
    description: "Let's get to know you.",
    fields: ["age", "weight", "height", "gender"],
  },
  {
    title: "Health History",
    description: "Tell us about your health background.",
    fields: ["injuries", "previousPlan"],
  },
  {
    title: "Fitness Goals",
    description: "What are you aiming for?",
    fields: ["goal", "activityLevel", "experienceLevel"],
  },
  {
    title: "Workout Preferences",
    description: "How do you like to train?",
    fields: ["workoutDays", "workoutTime", "equipment"],
  },
  {
    title: "Diet Preferences",
    description: "Tell us about your eating habits.",
    fields: ["foodPreferences"],
  },
];

export default function FitGenieForm({ onSubmit, loading }: FitGenieFormProps) {
  const [currentStep, setCurrentStep] = useState(0);

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

  const nextStep = async () => {
    const fields = steps[currentStep].fields as (keyof z.infer<typeof formSchema>)[];
    const output = await form.trigger(fields, { shouldFocus: true });
    if (!output) return;
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };
  
  const processForm = (data: z.infer<typeof formSchema>) => {
    onSubmit(data);
  };

  return (
    <Card className="border-2 border-green-200 shadow-lg">
      <CardHeader>
        <CardTitle>{steps[currentStep].title}</CardTitle>
        <CardDescription>{steps[currentStep].description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(processForm)} className="space-y-6">
            <div className={currentStep === 0 ? "block" : "hidden"}>
              <div className="grid md:grid-cols-2 gap-4">
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
                  <FormItem className="md:col-span-2"><FormLabel>Gender</FormLabel><FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                      <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="male" /></FormControl><FormLabel>Male</FormLabel></FormItem>
                      <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="female" /></FormControl><FormLabel>Female</FormLabel></FormItem>
                      <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="other" /></FormControl><FormLabel>Other</FormLabel></FormItem>
                    </RadioGroup>
                  </FormControl><FormMessage /></FormItem>
                )}/>
              </div>
            </div>

            <div className={currentStep === 1 ? "block" : "hidden"}>
              <div className="space-y-4">
                <FormField control={form.control} name="injuries" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Injuries</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                    <FormDescription>List any current or past injuries that might affect your training. If none, type 'None'.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="previousPlan" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Previous Plan</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                    <FormDescription>Describe any workout or diet plan you were following before. If none, type 'None'.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}/>
              </div>
            </div>

            <div className={currentStep === 2 ? "block" : "hidden"}>
              <div className="space-y-4">
                <FormField control={form.control} name="goal" render={({ field }) => (
                  <FormItem><FormLabel>Primary Goal</FormLabel><FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                      <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="cut" /></FormControl><FormLabel>Cut (Lose Fat)</FormLabel></FormItem>
                      <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="bulk" /></FormControl><FormLabel>Bulk (Gain Muscle)</FormLabel></FormItem>
                      <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="maintain" /></FormControl><FormLabel>Maintain</FormLabel></FormItem>
                    </RadioGroup>
                  </FormControl><FormMessage /></FormItem>
                )}/>
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
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                      <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="beginner" /></FormControl><FormLabel>Beginner</FormLabel></FormItem>
                      <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="intermediate" /></FormControl><FormLabel>Intermediate</FormLabel></FormItem>
                      <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="advanced" /></FormControl><FormLabel>Advanced</FormLabel></FormItem>
                    </RadioGroup>
                  </FormControl><FormMessage /></FormItem>
                )}/>
              </div>
            </div>

            <div className={currentStep === 3 ? "block" : "hidden"}>
              <div className="space-y-4">
                <FormField control={form.control} name="workoutDays" render={({ field }) => (
                  <FormItem><FormLabel>Workout Days per Week</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="workoutTime" render={({ field }) => (
                  <FormItem><FormLabel>Time per Workout (minutes)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="equipment" render={({ field }) => (
                  <FormItem><FormLabel>Available Equipment</FormLabel><FormControl><Textarea {...field} /></FormControl><FormDescription>e.g., Dumbbells, treadmill, resistance bands, or full gym access.</FormDescription><FormMessage /></FormItem>
                )}/>
              </div>
            </div>
            
            <div className={currentStep === 4 ? "block" : "hidden"}>
              <div className="space-y-4">
                 <FormField control={form.control} name="foodPreferences" render={({ field }) => (
                  <FormItem><FormLabel>Food Preferences & Dislikes (Indian Style)</FormLabel><FormControl><Textarea {...field} /></FormControl><FormDescription>List your favorite and least favorite foods. Be specific!</FormDescription><FormMessage /></FormItem>
                )}/>
              </div>
            </div>


            <div className="flex justify-between pt-4">
              <Button type="button" onClick={prevStep} disabled={currentStep === 0 || loading}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              {currentStep < steps.length - 1 && (
                <Button type="button" onClick={nextStep} disabled={loading}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Plan
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
