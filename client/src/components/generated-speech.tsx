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
  
  // Extract speaker name - more precise patterns
  const namePatterns = [
    /(?:Hello|Hi)[^.!?]*(?:I'm|I am|my name is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /(?:I'm|I am|My name is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i
  ];
  let speakerName = null;
  for (const pattern of namePatterns) {
    const match = cleanSpeech.match(pattern);
    if (match) {
      speakerName = match[1];
      break;
    }
  }
  
  // Extract role/identity - look for profession or role
  const rolePatterns = [
    /(?:I'm|I am)\s+(?:a|an)\s+([^.!?,]+?)(?:\s+(?:who|that|and)|[.!?,])/i,
    /(?:I work as|I serve as|I am)\s+(?:a|an)?\s*([^.!?,]+?)(?:\s+(?:who|that|and)|[.!?,])/i
  ];
  let role = null;
  for (const pattern of rolePatterns) {
    const match = cleanSpeech.match(pattern);
    if (match) {
      role = match[1].trim();
      break;
    }
  }
  
  // Extract work description - what they do
  const workPatterns = [
    /(?:I help|I assist|I work with|I support|I teach|I guide)\s+([^.!?]+?)(?:\s+(?:by|through|to)|[.!?])/i,
    /(?:I specialize in|I focus on|My work involves)\s+([^.!?]+?)(?:[.!?])/i
  ];
  let workDescription = null;
  for (const pattern of workPatterns) {
    const match = cleanSpeech.match(pattern);
    if (match) {
      workDescription = match[1].trim();
      break;
    }
  }
  
  // Extract motivation - why they do it
  const motivationPatterns = [
    /(?:because|why)\s+([^.!?]+)/i,
    /(?:I believe|I'm passionate about|what drives me|I care about)\s+([^.!?]+)/i,
    /(?:My passion|What motivates me)\s+(?:is|comes from)\s+([^.!?]+)/i
  ];
  let motivation = null;
  for (const pattern of motivationPatterns) {
    const match = cleanSpeech.match(pattern);
    if (match) {
      motivation = match[1].trim();
      break;
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
        <strong>WHO Framework Component:</strong> {speakerName ? `${speakerName} establishes personal identity immediately, creating trust and memorability.` : 'The speech opens without personal identification, missing an opportunity to build immediate connection.'} 
        {role ? ` The professional identity as ${role} provides context and credibility, completing the "who am I" foundation.` : ' Adding a clear professional role would strengthen audience understanding of expertise and background.'}
        {speakerName && role ? ' This strong WHO foundation sets up the framework effectively.' : ''}
      </div>
      
      <div className="mb-4">
        <strong>WHAT Framework Component:</strong> {workDescription ? `The speech clearly explains the value provided: "${workDescription}." This addresses the critical "what do I do" question with specific, audience-focused language.` : 'The WHAT section needs development - listeners need to understand specific services, skills, or value provided.'} 
        {workDescription ? ' By focusing on helping others rather than job titles, the speech follows framework best practices for audience engagement.' : ' Consider adding concrete examples like "I help restaurant owners reduce food waste by 30%" or "I teach public speaking skills to overcome presentation anxiety."'}
      </div>
      
      <div className="mb-4">
        <strong>WHY Framework Component:</strong> {motivation ? `The emotional driver comes through clearly: "${motivation}." This personal motivation completes the framework by revealing what truly matters beyond professional obligations.` : 'The WHY element - the emotional core that makes speeches memorable - is absent from this version.'} 
        {motivation ? ' This authenticity creates the connection that transforms professional introductions into meaningful conversations.' : ' Adding genuine motivation like "I started this work after my own experience with workplace stress" or "Teaching became my passion when I saw how education changed my community" would complete the framework.'}
      </div>
      
      <div className="mb-0">
        <strong>Framework Enhancement Suggestions:</strong> 
        {sentences.length > 15 ? 'Consider shorter sentences for easier spoken delivery. ' : ''}
        {!hasTransitions ? 'Add smooth transitions between framework sections: "What I do is..." followed by "The reason this matters to me is..." ' : ''}
        {wordCount > 320 ? 'Trim to under 300 words while preserving all three framework elements. ' : ''}
        {!speech.toLowerCase().includes('you') ? 'Include direct audience connection with "you" language to strengthen engagement. ' : ''}
        For maximum impact: Add a brief success story like "Recently, I helped a client achieve their first profitable quarter" and close with conversation starter like "What brings you to this event tonight?"
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
