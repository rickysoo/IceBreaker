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
  
  // Extract motivation - why they do it (more comprehensive)
  let motivation = null;
  
  // Look for belief statements
  const beliefMatch = cleanSpeech.match(/(?:I believe|Well, I believe)\s+([^.!?]+)/i);
  if (beliefMatch) {
    motivation = beliefMatch[1].trim();
  }
  
  // Look for care/passion statements
  if (!motivation) {
    const careMatch = cleanSpeech.match(/(?:I care about|I'm passionate about|what drives me|What motivates me)\s+([^.!?]+)/i);
    if (careMatch) {
      motivation = careMatch[1].trim();
    }
  }
  
  // Look for why explanations
  if (!motivation) {
    const whyMatch = cleanSpeech.match(/(?:why I|This is why|That's why)\s+([^.!?]+)/i);
    if (whyMatch) {
      motivation = whyMatch[1].trim();
    }
  }
  
  // Look for story-based motivations
  if (!motivation) {
    const storyMatch = cleanSpeech.match(/(?:So, I decided|This made me|I realized)\s+([^.!?]+)/i);
    if (storyMatch) {
      motivation = storyMatch[1].trim();
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
        <strong>WHAT Framework Component:</strong> {workDescription ? `The speech effectively communicates the value provided: "${workDescription}." This clearly answers the "what do I do" question with specific, results-focused language that resonates with audiences.` : cleanSpeech.includes('help') || cleanSpeech.includes('teach') || cleanSpeech.includes('work') ? 'The speech mentions professional activities but could be more specific about the exact value provided to clients or students.' : 'The WHAT section needs development to help listeners understand the specific services, skills, or value provided.'} 
        {workDescription ? ' The emphasis on helping others rather than listing credentials follows framework best practices for creating meaningful connections.' : cleanSpeech.includes('help') ? ' Consider strengthening this section by being more specific about outcomes achieved, such as "I help professionals reduce presentation anxiety by 80%" or "I guide students to achieve confident public speaking within 30 days."' : ' Adding concrete examples of value delivery would strengthen this framework component significantly.'}
      </div>
      
      <div className="mb-4">
        <strong>WHY Framework Component:</strong> {motivation ? `The personal motivation shines through: "${motivation}." This emotional foundation reveals the deeper purpose driving the work, which is essential for authentic connection.` : cleanSpeech.includes('believe') || cleanSpeech.includes('passion') || cleanSpeech.includes('care') ? 'The speech hints at personal motivation but could express the "why" more explicitly to create stronger emotional resonance.' : 'The WHY component - the emotional core that makes speeches truly memorable - needs more development in this version.'} 
        {motivation ? ' This authentic sharing of values transforms a professional introduction into a meaningful conversation starter.' : cleanSpeech.includes('story') || cleanSpeech.includes('experience') ? ' Consider connecting personal experiences more directly to current motivation, such as "My own struggle with confidence taught me how transformative good coaching can be."' : ' Adding genuine personal motivation like "I discovered my passion for teaching when I saw how one conversation changed a student\'s entire trajectory" would complete the framework powerfully.'}
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
