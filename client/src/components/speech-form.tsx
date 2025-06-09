import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertSpeechRequestSchema } from "@shared/schema";
import type { InsertSpeechRequest } from "@shared/schema";
import type { GenerateSpeechResponse } from "@/lib/openai";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { User, Briefcase, Flame, Wand2, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SpeechFormProps {
  onSpeechGenerated: (speech: GenerateSpeechResponse, formData: InsertSpeechRequest) => void;
  onStartGeneration: () => void;
  isLoading: boolean;
}

export default function SpeechForm({ onSpeechGenerated, onStartGeneration, isLoading }: SpeechFormProps) {
  const { toast } = useToast();
  const [hasStarted, setHasStarted] = useState(false);

  const form = useForm<InsertSpeechRequest>({
    resolver: zodResolver(insertSpeechRequestSchema),
    defaultValues: {
      name: "",
      identity: "",
      background: "",
      whatYouDo: "",
      motivation: "",
    },
  });

  const generateSpeechMutation = useMutation({
    mutationFn: async (data: InsertSpeechRequest): Promise<GenerateSpeechResponse> => {
      const response = await apiRequest("POST", "/api/speech/generate", data);
      return response.json();
    },
    onSuccess: (data, variables) => {
      onSpeechGenerated(data, variables);
      toast({
        title: "Success!",
        description: "Your introduction speech has been generated.",
      });
    },
    onError: (error: any) => {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "We encountered an issue while generating your introduction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertSpeechRequest) => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    onStartGeneration();
    generateSpeechMutation.mutate(data);
  };

  const clearForm = () => {
    form.reset();
    setHasStarted(false);
  };

  const progress = hasStarted ? (isLoading ? 50 : 100) : 0;

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 drop-shadow-sm">Create Your Introduction</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-700 font-medium">
              <span>Step {isLoading ? "2" : "1"} of 2</span>
            </div>
          </div>
          <Progress value={progress} className="w-full" />
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-4 py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <div className="text-gray-700">
                <p className="font-semibold">Crafting your introduction...</p>
                <p className="text-sm text-gray-600 font-medium">This may take a few moments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {generateSpeechMutation.isError && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="text-error-500" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-error-900 mb-2">Generation Failed</h3>
                <p className="text-error-700 mb-4">
                  {generateSpeechMutation.error?.message || "We encountered an issue while generating your introduction. This could be due to a temporary service interruption or invalid input."}
                </p>
                <div className="flex space-x-4">
                  <Button 
                    onClick={() => form.handleSubmit(onSubmit)()}
                    className="bg-error-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-error-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border border-gray-200"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Input Form */}
      {!isLoading && (
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Name Input */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold text-gray-900 drop-shadow-sm">
                        Your Name <span className="text-error-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Alex Thompson"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-gray-700 font-medium">
                        This will be used to start your introduction
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Who Section */}
                <div className="border-l-4 border-primary-500 pl-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <User className="text-primary-500" size={18} />
                    <h3 className="text-lg font-bold text-gray-900 drop-shadow-sm">WHO you are</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="identity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold text-gray-900 drop-shadow-sm">
                            Your Role & Identity <span className="text-error-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Digital marketing consultant and workshop facilitator"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="background"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold text-gray-900 drop-shadow-sm">
                            Background & Context
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={3}
                              placeholder="e.g., Started in corporate finance, evolved into helping small businesses grow their online presence"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* What Section */}
                <div className="border-l-4 border-secondary-500 pl-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Briefcase className="text-secondary-500" size={18} />
                    <h3 className="text-lg font-bold text-gray-900 drop-shadow-sm">WHAT you do</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="whatYouDo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold text-gray-900 drop-shadow-sm">
                          What You Do & Who You Help <span className="text-error-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={4}
                            placeholder="e.g., I help restaurants create engaging social media content that drives customer engagement. I empower small business owners to build their online presence without needing a big budget."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-sm text-gray-700 font-medium">
                          Focus on outcomes and impact, not just roles
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Why Section */}
                <div className="border-l-4 border-warning-500 pl-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Flame className="text-warning-500" size={18} />
                    <h3 className="text-lg font-bold text-gray-900 drop-shadow-sm">WHY you do it</h3>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="motivation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold text-gray-900 drop-shadow-sm">
                          Your Motivation & Deeper Purpose <span className="text-error-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={4}
                            placeholder="e.g., I believe every small business deserves to compete with the big brands. That's why I focus on creating affordable marketing strategies that actually work."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-sm text-gray-700 font-medium">
                          Share a personal story or belief that fuels your work
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  <Button 
                    type="submit"
                    disabled={generateSpeechMutation.isPending}
                    className="flex-1 bg-primary-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border border-gray-200 flex items-center justify-center space-x-2"
                  >
                    <Wand2 size={16} />
                    <span>Generate My Speech</span>
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={clearForm}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <RotateCcw size={16} />
                    <span>Clear Form</span>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
