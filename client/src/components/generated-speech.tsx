import { useState, useEffect } from "react";
import { Copy, RotateCcw, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { GenerateSpeechResponse } from "@/lib/openai";

function SpeechAnalysisContent({ speech }: { speech: string }) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const analyzeSpeech = useMutation({
    mutationFn: async (speechText: string) => {
      const response = await apiRequest("/api/speech/analyze", "POST", { speech: speechText });
      return response.analysis;
    },
    onSuccess: (data) => {
      setAnalysis(data);
      setIsLoading(false);
    },
    onError: (error: any) => {
      setError(error.message || 'Failed to analyze speech');
      setIsLoading(false);
    }
  });

  useEffect(() => {
    analyzeSpeech.mutate(speech);
  }, [speech]);

  if (isLoading) {
    return (
      <div className="prose prose-sm max-w-none text-gray-700 font-medium leading-relaxed">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="prose prose-sm max-w-none text-red-600 font-medium leading-relaxed">
        <p>Error analyzing speech: {error}</p>
        <p className="text-sm text-gray-600">Please try generating a new speech or refresh the page.</p>
      </div>
    );
  }

  // Convert markdown-style formatting to HTML for display
  const formatAnalysis = (analysisText: string) => {
    return analysisText
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div 
      className="prose prose-sm max-w-none text-gray-700 font-medium leading-relaxed"
      dangerouslySetInnerHTML={{ __html: `<p>${formatAnalysis(analysis || '')}</p>` }}
    />
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
      const response = await apiRequest("/api/speech/generate", "POST", data);
      return response;
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
