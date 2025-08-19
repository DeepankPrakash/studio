"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { formSchema } from "@/lib/schemas";
import { useUserHistory } from "@/hooks/useUserHistory";
import { useToast } from "@/hooks/use-toast";
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
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type FitmateFormProps = {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  loading: boolean;
};

const steps = [
  {
    title: "Personal Details",
    fields: ["age", "weight", "height", "gender"],
  },
  {
    title: "Fitness Goals",
    fields: ["goal", "activityLevel", "experienceLevel"],
  },
  {
    title: "Workout Preferences",
    fields: ["workoutDays", "workoutTime", "equipment"],
  },
  {
    title: "Health & Diet",
    fields: ["foodPreferences", "injuries", "previousPlan"],
  },
];

export default function FitmateForm({ onSubmit, loading }: FitmateFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { addHistoryEntry, getLastFormData, saveLastFormData } = useUserHistory();
  const { toast } = useToast();

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

  // Load previous form data on mount
  useEffect(() => {
    const lastFormData = getLastFormData();
    if (Object.keys(lastFormData).length > 0) {
      console.log('Auto-filling form with previous data:', lastFormData);
      
      // Complete mapping for ALL form fields
      const formMappings = {
        // Personal Details (Step 1)
        age: lastFormData.age,
        weight: lastFormData.weight,
        height: lastFormData.height,
        gender: lastFormData.gender,
        
        // Goals & Activity (Step 2)
        goal: lastFormData.goals || lastFormData.goal, // Handle both stored formats
        activityLevel: lastFormData.activityLevel?.replace('_', ' '), // Convert back to spaced format
        experienceLevel: lastFormData.experienceLevel,
        
        // Workout Preferences (Step 3)
        workoutDays: lastFormData.workoutDays,
        workoutTime: lastFormData.workoutTime,
        equipment: lastFormData.equipment,
        
        // Health & Diet (Step 4)
        foodPreferences: lastFormData.foodPreferences,
        injuries: lastFormData.injuries,
        previousPlan: lastFormData.previousPlan,
      };

      // Apply form data with validation
      Object.entries(formMappings).forEach(([formField, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          try {
            form.setValue(formField as keyof z.infer<typeof formSchema>, value as any, {
              shouldValidate: false, // Don't validate during auto-fill
              shouldDirty: false,    // Don't mark as dirty during auto-fill
            });
          } catch (error) {
            console.warn(`Failed to set ${formField} to ${value}:`, error);
          }
        }
      });

      // Show a toast notification about auto-fill
      if (lastFormData.age || lastFormData.email) {
        toast({
          title: "Welcome back!",
          description: "Your previous form data has been restored.",
          duration: 3000,
        });
      }
    }
  }, [getLastFormData, form, toast]);

  // Save form data whenever any field changes (after a short delay)
  const formValues = form.watch();
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentValues = form.getValues();
      const hasAnyData = Object.values(currentValues).some(value => 
        value !== undefined && value !== null && value !== '' && value !== 0
      );
      
      if (hasAnyData) {
        const progressData = {
          age: currentValues.age,
          weight: currentValues.weight,
          height: currentValues.height,
          gender: currentValues.gender,
          goals: currentValues.goal as 'cut' | 'bulk' | 'maintain',
          activityLevel: currentValues.activityLevel?.replace(' ', '_') as any,
          experienceLevel: currentValues.experienceLevel as any,
          workoutDays: currentValues.workoutDays,
          workoutTime: currentValues.workoutTime,
          equipment: currentValues.equipment,
          foodPreferences: currentValues.foodPreferences,
          injuries: currentValues.injuries,
          previousPlan: currentValues.previousPlan,
        };
        
        // Filter out empty values
        const filteredData = Object.fromEntries(
          Object.entries(progressData).filter(([_, value]) => 
            value !== undefined && value !== null && value !== '' && value !== 0
          )
        );
        
        if (Object.keys(filteredData).length > 0) {
          saveLastFormData(filteredData);
        }
      }
    }, 1000); // Save after 1 second of inactivity
    
    return () => clearTimeout(timer);
  }, [formValues, form, saveLastFormData]);

  const nextStep = async () => {
    const fields = steps[currentStep].fields as (keyof z.infer<typeof formSchema>)[];
    const output = await form.trigger(fields, { shouldFocus: true });
    if (!output) return;
    
    // Save ALL current progress for auto-fill (not just current step)
    const currentValues = form.getValues();
    const allProgressData = {
      // Personal Details
      age: currentValues.age,
      weight: currentValues.weight,
      height: currentValues.height,
      gender: currentValues.gender,
      
      // Goals & Activity
      goals: currentValues.goal as 'cut' | 'bulk' | 'maintain',
      activityLevel: currentValues.activityLevel?.replace(' ', '_') as any,
      experienceLevel: currentValues.experienceLevel as any,
      
      // Workout Preferences
      workoutDays: currentValues.workoutDays,
      workoutTime: currentValues.workoutTime,
      equipment: currentValues.equipment,
      
      // Health & Diet
      foodPreferences: currentValues.foodPreferences,
      injuries: currentValues.injuries,
      previousPlan: currentValues.previousPlan,
      
      // Generated preferences
      workoutPreference: currentValues.workoutTime > 45 ? 'strength' : 'mixed' as any,
      dietPreference: 'standard' as any,
    };
    
    // Only save non-empty values to avoid overwriting with blanks
    const filteredData = Object.fromEntries(
      Object.entries(allProgressData).filter(([_, value]) => 
        value !== undefined && value !== null && value !== '' && value !== 0
      )
    );
    
    saveLastFormData(filteredData);
    
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
    // Create comprehensive data object for storage
    const comprehensiveData = {
      age: data.age,
      weight: data.weight,
      height: data.height,
      gender: data.gender,
      goals: data.goal as 'cut' | 'bulk' | 'maintain',
      activityLevel: data.activityLevel.replace(' ', '_') as any,
      experienceLevel: data.experienceLevel as any,
      workoutPreference: data.workoutTime > 45 ? 'strength' : 'mixed' as any,
      dietPreference: 'standard' as any, // Default for now
      // Store original form data as well
      workoutDays: data.workoutDays,
      workoutTime: data.workoutTime,
      equipment: data.equipment,
      foodPreferences: data.foodPreferences,
      injuries: data.injuries,
      previousPlan: data.previousPlan,
    };

    // Track form submission in history
    addHistoryEntry('form_filled', comprehensiveData);
    
    // Save complete form data for future auto-fill
    saveLastFormData(comprehensiveData);
    
    onSubmit(data);
  };

  return (
    <Card className="glass-card-dark border-white/20">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(processForm)} className="space-y-8">
            <div className={currentStep === 0 ? "block" : "hidden"}>
              <h3 className="text-xl font-semibold mb-4 text-white">Personal Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="age" render={({ field }) => (
                  <FormItem><FormLabel className="text-white">Age</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="weight" render={({ field }) => (
                  <FormItem><FormLabel className="text-white">Weight (kg)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="height" render={({ field }) => (
                  <FormItem><FormLabel className="text-white">Height (cm)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="gender" render={({ field }) => (
                  <FormItem className="md:col-span-2"><FormLabel className="text-white">Gender</FormLabel><FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2">
                      <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="male" className="border-white/40 text-white" /></FormControl><FormLabel className="font-normal text-white">Male</FormLabel></FormItem>
                      <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="female" className="border-white/40 text-white" /></FormControl><FormLabel className="font-normal text-white">Female</FormLabel></FormItem>
                      <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="other" className="border-white/40 text-white" /></FormControl><FormLabel className="font-normal text-white">Other</FormLabel></FormItem>
                    </RadioGroup>
                  </FormControl><FormMessage /></FormItem>
                )}/>
              </div>
            </div>

            <div className={currentStep === 1 ? "block" : "hidden"}>
              <h3 className="text-xl font-semibold mb-4 text-white">Fitness Goals</h3>
              <div className="space-y-4">
                <FormField control={form.control} name="goal" render={({ field }) => (
                  <FormItem><FormLabel className="text-white">Primary Goal</FormLabel><FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1 pt-2">
                      <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="cut" className="border-white/40 text-white" /></FormControl><FormLabel className="font-normal text-white">Cut (Lose Fat)</FormLabel></FormItem>
                      <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="bulk" className="border-white/40 text-white" /></FormControl><FormLabel className="font-normal text-white">Bulk (Gain Muscle)</FormLabel></FormItem>
                      <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="maintain" className="border-white/40 text-white" /></FormControl><FormLabel className="font-normal text-white">Maintain</FormLabel></FormItem>
                    </RadioGroup>
                  </FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="activityLevel" render={({ field }) => (
                  <FormItem><FormLabel className="text-white">Activity Level</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="bg-white/10 border-white/20 text-white"><SelectValue placeholder="Select your activity level" className="text-white/70" /></SelectTrigger></FormControl>
                    <SelectContent className="bg-gray-800 border-white/20">
                      <SelectItem value="sedentary" className="text-white hover:bg-white/10">Sedentary (little or no exercise)</SelectItem>
                      <SelectItem value="lightly active" className="text-white hover:bg-white/10">Lightly active (light exercise/sports 1-3 days/week)</SelectItem>
                      <SelectItem value="moderately active" className="text-white hover:bg-white/10">Moderately active (moderate exercise/sports 3-5 days/week)</SelectItem>
                      <SelectItem value="very active" className="text-white hover:bg-white/10">Very active (hard exercise/sports 6-7 days a week)</SelectItem>
                      <SelectItem value="extra active" className="text-white hover:bg-white/10">Extra active (very hard exercise/sports & physical job)</SelectItem>
                    </SelectContent>
                  </Select><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="experienceLevel" render={({ field }) => (
                   <FormItem><FormLabel className="text-white">Experience Level</FormLabel><FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1 pt-2">
                      <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="beginner" className="border-white/40 text-white" /></FormControl><FormLabel className="font-normal text-white">Beginner</FormLabel></FormItem>
                      <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="intermediate" className="border-white/40 text-white" /></FormControl><FormLabel className="font-normal text-white">Intermediate</FormLabel></FormItem>
                      <FormItem className="flex items-center space-x-3"><FormControl><RadioGroupItem value="advanced" className="border-white/40 text-white" /></FormControl><FormLabel className="font-normal text-white">Advanced</FormLabel></FormItem>
                    </RadioGroup>
                  </FormControl><FormMessage /></FormItem>
                )}/>
              </div>
            </div>

            <div className={currentStep === 2 ? "block" : "hidden"}>
              <h3 className="text-xl font-semibold mb-4 text-white">Workout Preferences</h3>
              <div className="space-y-4">
                <FormField control={form.control} name="workoutDays" render={({ field }) => (
                  <FormItem><FormLabel className="text-white">Workout Days per Week</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="workoutTime" render={({ field }) => (
                  <FormItem><FormLabel className="text-white">Time per Workout (minutes)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="equipment" render={({ field }) => (
                  <FormItem><FormLabel className="text-white">Available Equipment</FormLabel><FormControl><Textarea {...field} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" /></FormControl><FormDescription className="text-white/70">e.g., Dumbbells, treadmill, resistance bands, or full gym access.</FormDescription><FormMessage /></FormItem>
                )}/>
              </div>
            </div>

            <div className={currentStep === 3 ? "block" : "hidden"}>
              <h3 className="text-xl font-semibold mb-4 text-white">Health & Diet</h3>
              <div className="space-y-4">
                 <FormField control={form.control} name="foodPreferences" render={({ field }) => (
                  <FormItem><FormLabel className="text-white">Food Preferences & Dislikes (Indian Style)</FormLabel><FormControl><Textarea {...field} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" /></FormControl><FormDescription className="text-white/70">List your favorite and least favorite foods. Be specific!</FormDescription><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="injuries" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Injuries</FormLabel>
                    <FormControl><Textarea {...field} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" /></FormControl>
                    <FormDescription className="text-white/70">List any current or past injuries that might affect your training. If none, type 'None'.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField control={form.control} name="previousPlan" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Previous Plan</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </FormControl>
                    <FormDescription className="text-white/70">Describe any workout or diet plan you were following before. If none, type 'None'.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}/>
              </div>
            </div>


            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                onClick={prevStep} 
                variant="outline" 
                disabled={currentStep === 0 || loading}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              {currentStep < steps.length - 1 && (
                <Button 
                  type="button" 
                  onClick={nextStep} 
                  disabled={loading}
                  className="bg-blue-500/80 text-white hover:bg-blue-600/80"
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-green-500/80 text-white hover:bg-green-600/80"
                >
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
