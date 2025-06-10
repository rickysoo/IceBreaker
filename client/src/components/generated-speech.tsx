import { useState } from "react";
import { Copy, RotateCcw, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { GenerateSpeechResponse } from "@/lib/openai";

function SpeechAnalysisContent({ speech }: { speech: string }) {
  // Clean up the speech text
  const cleanSpeech = speech.replace(/\s+/g, ' ').trim();
  
  // Extract speaker name with comprehensive patterns
  let speakerName = null;
  
  // Look for "my name's [Name]" or "my name is [Name]"
  const nameIsMatch = cleanSpeech.match(/my name(?:'s|'s| is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  if (nameIsMatch) {
    speakerName = nameIsMatch[1];
  }
  
  // Look for "I'm [Name]" patterns
  if (!speakerName) {
    const directNameMatch = cleanSpeech.match(/(?:Hello|Hi)[^.!?]*I'm\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    if (directNameMatch) {
      speakerName = directNameMatch[1];
    }
  }
  
  // Look for "My name is [Name]" patterns
  if (!speakerName) {
    const formalNameMatch = cleanSpeech.match(/My name is\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    if (formalNameMatch) {
      speakerName = formalNameMatch[1];
    }
  }
  
  // Look for simple "I'm [Name]" at start
  if (!speakerName) {
    const simpleNameMatch = cleanSpeech.match(/^[^.!?]*I'm\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    if (simpleNameMatch) {
      speakerName = simpleNameMatch[1];
    }
  }
  
  // Extract role/identity - look for profession or role
  let role = null;
  
  // Look for "I'm [Name], a [role]" patterns
  const nameRoleMatch = cleanSpeech.match(/I'm\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?,\s+(?:a|an)\s+([^.!?,]+?)(?:\s+(?:with|who|that)|[.!?,])/i);
  if (nameRoleMatch) {
    role = nameRoleMatch[1].trim();
  }
  
  // Look for standard "I'm a [role]" patterns
  if (!role) {
    const standardRoleMatch = cleanSpeech.match(/(?:I'm|I am)\s+(?:a|an)\s+([^.!?,]+?)(?:\s+(?:who|that|and|with)|[.!?,])/i);
    if (standardRoleMatch) {
      role = standardRoleMatch[1].trim();
    }
  }
  
  // Look for "I work as" patterns
  if (!role) {
    const workAsMatch = cleanSpeech.match(/(?:I work as|I serve as)\s+(?:a|an)?\s*([^.!?,]+?)(?:\s+(?:who|that|and)|[.!?,])/i);
    if (workAsMatch) {
      role = workAsMatch[1].trim();
    }
  }
  
  // Extract work description - what they do (more comprehensive)
  let workDescription = null;
  
  // Look for explicit help statements
  const helpMatch = cleanSpeech.match(/(?:I help|I assist|I support)\s+([^.!?]+?)(?:\s+(?:by|through|to|with)|[.!?])/i);
  if (helpMatch) {
    workDescription = helpMatch[1].trim();
  }
  
  // Look for focus/specialization
  if (!workDescription) {
    const focusMatch = cleanSpeech.match(/(?:My focus|I focus on|I specialize in)\s+([^.!?]+?)(?:[.!?])/i);
    if (focusMatch) {
      workDescription = focusMatch[1].trim();
    }
  }
  
  // Look for teaching/guiding
  if (!workDescription) {
    const teachMatch = cleanSpeech.match(/(?:I teach|I guide|I mentor|I coach)\s+([^.!?]+?)(?:\s+(?:by|through|to|with)|[.!?])/i);
    if (teachMatch) {
      workDescription = teachMatch[1].trim();
    }
  }
  
  // Extract motivation - comprehensive WHY detection
  let motivation = null;
  
  // Look for "why do I do this" explicit statements
  const whyDoMatch = cleanSpeech.match(/why do I do this\?[^.!?]*([^.!?]+)/i);
  if (whyDoMatch) {
    motivation = whyDoMatch[1].trim();
  }
  
  // Look for belief statements
  if (!motivation) {
    const beliefMatch = cleanSpeech.match(/(?:I believe|I truly believe)\s+([^.!?]+)/i);
    if (beliefMatch) {
      motivation = beliefMatch[1].trim();
    }
  }
  
  // Look for personal story motivations
  if (!motivation) {
    const storyMotivationMatch = cleanSpeech.match(/(?:That experience|This experience)\s+([^.!?]+)/i);
    if (storyMotivationMatch) {
      motivation = storyMotivationMatch[1].trim();
    }
  }
  
  // Look for "I want to" statements
  if (!motivation) {
    const wantMatch = cleanSpeech.match(/I want to\s+([^.!?]+)/i);
    if (wantMatch) {
      motivation = wantMatch[1].trim();
    }
  }
  
  // Look for care/dedication statements
  if (!motivation) {
    const careMatch = cleanSpeech.match(/(?:I care about|I'm dedicated to|when I say)\s+([^.!?]+)/i);
    if (careMatch) {
      motivation = careMatch[1].trim();
    }
  }
  
  // Look for family/personal experience motivations
  if (!motivation) {
    const personalMatch = cleanSpeech.match(/(?:my sister|my parents|my family)\s+([^.!?]+)/i);
    if (personalMatch) {
      motivation = personalMatch[1].trim();
    }
  }
  
  // Analyze structure
  const sentences = cleanSpeech.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const wordCount = cleanSpeech.split(/\s+/).length;
  const hasTransitions = /(?:now|so|here's the thing|and|but|however|therefore|what's more|additionally)/i.test(cleanSpeech);
  
  return (
    <div className="prose prose-sm max-w-none text-gray-700 font-medium leading-relaxed">
      <p className="mb-4">
        This speech demonstrates how the Who-What-Why framework creates connection and credibility through structured personal storytelling.
      </p>
      
      <div className="mb-4">
        <strong>WHO Framework Component:</strong> {speakerName ? `${speakerName} establishes personal identity immediately, creating trust and memorability.` : 'The speaker introduces themselves without stating their name explicitly.'} 
        {role ? ` The professional identity as "${role}" provides clear context and credibility, completing the "who am I" foundation.` : ' The speech includes professional context that helps establish credibility.'}
        {speakerName && role ? ' This strong WHO foundation effectively sets up the framework.' : ' The WHO component establishes professional identity and background.'}
      </div>
      
      <div className="mb-4">
        <strong>WHAT Framework Component:</strong> {workDescription ? `The speech clearly communicates the value provided: "${workDescription}." This addresses the "what do I do" question with specific, audience-focused language.` : cleanSpeech.includes('help') || cleanSpeech.includes('create') || cleanSpeech.includes('build') || cleanSpeech.includes('work') ? 'The speech describes professional activities and the value provided to clients or customers.' : 'The WHAT section establishes the type of work and services provided.'} 
        {workDescription ? ' The focus on helping others rather than just listing credentials follows framework best practices for audience engagement.' : ' The speech explains professional activities in terms of impact and outcomes.'}
      </div>
      
      <div className="mb-4">
        <strong>WHY Framework Component:</strong> {motivation ? `The personal motivation comes through clearly: "${motivation}." This emotional foundation reveals the deeper purpose driving the work.` : cleanSpeech.includes('believe') || cleanSpeech.includes('passion') || cleanSpeech.includes('care') || cleanSpeech.includes('love') ? 'The speech expresses personal motivation and values that drive the professional work.' : 'The WHY component addresses the emotional reasons behind the professional choice.'} 
        {motivation ? ' This authentic sharing of values creates meaningful connection with the audience.' : ' The speech includes personal elements that explain the motivation behind the work.'}
      </div>
      
      <div className="mb-0">
        <strong>Areas for Enhancement:</strong>
        <div className="mt-2 space-y-1">
          {!speakerName && <div>• Include your name in the introduction to create personal connection and memorability</div>}
          {!role && <div>• Add a clear professional identity or role to establish credibility and context</div>}
          {!workDescription && !cleanSpeech.includes('help') && !cleanSpeech.includes('create') && <div>• Describe specific value you provide to clients or customers</div>}
          {!motivation && !cleanSpeech.includes('believe') && !cleanSpeech.includes('care') && <div>• Share personal motivation or "why" to create emotional connection</div>}
          {sentences.length > 15 && <div>• Consider shorter sentences for easier spoken delivery</div>}
          {wordCount > 320 && <div>• Trim content to under 300 words while preserving all framework elements</div>}
          {wordCount < 200 && <div>• Expand with more specific examples to reach ideal 250-300 word range</div>}
          {!cleanSpeech.includes('example') && !cleanSpeech.includes('story') && !/\d+%/.test(cleanSpeech) && <div>• Add a concrete success story with measurable outcomes to enhance credibility</div>}
          {!cleanSpeech.includes('connect') && !cleanSpeech.includes('hear') && !cleanSpeech.includes('together') && <div>• End with a conversation starter to encourage networking</div>}
          {!hasTransitions && <div>• Add smooth transitions between sections like "What I do is..." and "Here's why this matters..."</div>}
        </div>
        {(!speakerName && !role && !workDescription && !motivation) || 
         (sentences.length <= 15 && wordCount >= 200 && wordCount <= 320 && 
          (cleanSpeech.includes('example') || cleanSpeech.includes('story') || /\d+%/.test(cleanSpeech)) &&
          (cleanSpeech.includes('connect') || cleanSpeech.includes('hear') || cleanSpeech.includes('together'))) ? 
         <div className="mt-2 text-green-700 font-medium">This speech effectively implements the Who-What-Why framework with strong examples and engagement elements.</div> : 
         ''}
      </div>
    </div>
  );
}

interface GeneratedSpeechProps {
  speech: GenerateSpeechResponse;
  onRegenerate: (newSpeech?: GenerateSpeechResponse) => void;
  formData?: any;
}

export default function GeneratedSpeech({ speech, onRegenerate, formData }: GeneratedSpeechProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const regenerateMutation = useMutation({
    mutationFn: async (data: any): Promise<GenerateSpeechResponse> => {
      const response = await apiRequest("POST", "/api/speech/generate", data);
      return response.json();
    },
    onSuccess: (data) => {
      // Update the parent with the new speech data
      if (onRegenerate) {
        onRegenerate(data);
      }
      toast({
        title: "Regenerated!",
        description: "Your speech has been regenerated with fresh content.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Regeneration Failed",
        description: error.message || "Failed to regenerate speech. Please try again.",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(speech.speech);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Speech copied to clipboard!",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleRegenerate = () => {
    if (formData) {
      regenerateMutation.mutate(formData);
    } else {
      onRegenerate();
    }
  };

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 drop-shadow-sm">Your Generated Speech</h2>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-success-100 text-success-800 text-sm rounded-full font-medium">
              <CheckCircle className="inline mr-1" size={14} />
              Ready to Present
            </span>
          </div>
        </div>

        {/* Speech Content */}
        <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200 shadow-sm">
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-900 leading-relaxed whitespace-pre-wrap font-medium text-base">
              {speech.speech}
            </p>
          </div>
        </div>

        {/* Speech Analysis */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 drop-shadow-sm">Speech Analysis</h3>
          
          <SpeechAnalysisContent speech={speech.speech} />
        </div>

        {/* AI Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
            <div className="text-sm">
              <p className="text-amber-900 font-semibold mb-1">AI-Generated Content Disclaimer</p>
              <p className="text-amber-800 font-medium">
                This speech was generated by artificial intelligence and may contain errors or inaccuracies. 
                Please review and verify all content before using it in any professional or public setting.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={copyToClipboard}
            className="flex-1 bg-success-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-success-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border border-gray-200 flex items-center justify-center space-x-2"
          >
            <Copy size={16} />
            <span>{copied ? "Copied!" : "Copy to Clipboard"}</span>
          </Button>
          <Button 
            variant="outline"
            onClick={handleRegenerate}
            disabled={regenerateMutation.isPending}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <RotateCcw size={16} className={regenerateMutation.isPending ? "animate-spin" : ""} />
            <span>{regenerateMutation.isPending ? "Regenerating..." : "Regenerate"}</span>
          </Button>

        </div>
      </CardContent>
    </Card>
  );
}
