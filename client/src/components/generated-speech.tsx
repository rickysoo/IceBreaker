import { useState } from "react";
import { Copy, RotateCcw, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { GenerateSpeechResponse } from "@/lib/openai";

function SpeechAnalysisContent({ speech }: { speech: string }) {
  // Extract speaker name
  const nameMatch = speech.match(/(?:I'm|I am|My name is|Hello.*I'm|Hi.*I'm)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  const speakerName = nameMatch ? nameMatch[1] : null;
  
  // Extract role/identity
  const roleMatch = speech.match(/(?:I'm|I am)\s+(?:a|an)?\s*([^.!?]+?)(?:\.|,|and|who)/i);
  const role = roleMatch ? roleMatch[1].trim() : null;
  
  // Check for specific work description
  const workMatch = speech.match(/(?:I help|I work with|I specialize in|I focus on|I assist)([^.!?]+)/i);
  const workDescription = workMatch ? workMatch[1].trim() : null;
  
  // Check for motivation/why statements
  const motivationMatch = speech.match(/(?:because|why|believe|passionate about|care about|love|what drives me)([^.!?]+)/i);
  const motivation = motivationMatch ? motivationMatch[1].trim() : null;
  
  // Analyze structure
  const sentences = speech.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const wordCount = speech.split(/\s+/).length;
  const hasTransitions = /(?:now|so|here's the thing|and|but|however|therefore)/i.test(speech);
  
  return (
    <div className="prose prose-sm max-w-none text-gray-700 font-medium leading-relaxed">
      <div className="mb-4">
        <strong>WHO Analysis:</strong> The speech establishes identity through {speakerName ? `the introduction "My name is ${speakerName}"` : 'a general greeting without specific name mention'}. 
        {role ? ` ${speakerName || 'The speaker'} identifies as ${role}, which immediately establishes professional context.` : ' The speech could be strengthened by including a clear professional identity statement.'}
        {speakerName && role ? ' This combination of personal name and role creates immediate credibility and connection.' : ''}
      </div>
      
      <div className="mb-4">
        <strong>WHAT Analysis:</strong> {workDescription ? `The speech describes specific work: "${workDescription.substring(0, 50)}..." This clearly communicates value and target audience.` : 'The speech lacks specific description of work performed and value provided to others.'} 
        {workDescription ? ' The focus on helping others rather than job titles makes the content more relatable and impactful.' : ' Consider adding phrases like "I help [specific audience] achieve [specific outcome]" to strengthen this section.'}
      </div>
      
      <div className="mb-4">
        <strong>WHY Analysis:</strong> {motivation ? `Personal motivation appears in the phrase "${motivation.substring(0, 50)}..." which reveals deeper purpose behind the work.` : 'The speech lacks explicit motivation or "why" statements that would create emotional connection.'} 
        {motivation ? ' This emotional element helps listeners understand what drives the speaker beyond professional obligations.' : ' Adding statements like "I believe..." or "What drives me is..." would strengthen audience connection.'}
      </div>
      
      <div className="mb-0">
        <strong>Improvement Opportunities:</strong> 
        {sentences.length > 15 ? ' Consider shortening some sentences for better spoken delivery. ' : ''}
        {!hasTransitions ? 'Add transitional phrases between sections like "Now, here\'s what I do..." or "And here\'s why this matters to me..." ' : ''}
        {wordCount > 320 ? 'The speech is slightly long - trim to under 300 words for optimal timing. ' : ''}
        {!speech.includes('you') ? 'Include direct audience address with "you" to create connection. ' : ''}
        Specific enhancement: {speakerName ? `${speakerName} could add` : 'Add'} a concrete example like "Last month, I helped a client achieve [specific result]" and end with "I'd love to hear about your [relevant challenge/goal]" to encourage conversation.
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
