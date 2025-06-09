import { useState } from "react";
import { Copy, RotateCcw, Edit, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { GenerateSpeechResponse } from "@/lib/openai";

interface GeneratedSpeechProps {
  speech: GenerateSpeechResponse;
  onRegenerate: () => void;
}

export default function GeneratedSpeech({ speech, onRegenerate }: GeneratedSpeechProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(speech.speech);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Introduction copied to clipboard!",
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

  const handleEdit = () => {
    onRegenerate();
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Your Generated Speech</h2>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-success-100 text-success-800 text-sm rounded-full font-medium">
              <CheckCircle className="inline mr-1" size={14} />
              Ready to Present
            </span>
          </div>
        </div>

        {/* Speech Content */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {speech.speech}
            </p>
          </div>
        </div>

        {/* Speech Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-primary-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary-600">{speech.wordCount}</div>
            <div className="text-sm text-primary-700">Words</div>
          </div>
          <div className="bg-secondary-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-secondary-600">~{speech.readTime}</div>
            <div className="text-sm text-secondary-700">Min Read</div>
          </div>
          <div className="bg-success-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-success-600">A+</div>
            <div className="text-sm text-success-700">Readability</div>
          </div>
          <div className="bg-warning-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-warning-600">✓</div>
            <div className="text-sm text-warning-700">Framework</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={copyToClipboard}
            className="flex-1 bg-success-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-success-600 focus:ring-2 focus:ring-success-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
          >
            <Copy size={16} />
            <span>{copied ? "Copied!" : "Copy to Clipboard"}</span>
          </Button>
          <Button 
            variant="outline"
            onClick={onRegenerate}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw size={16} />
            <span>Regenerate</span>
          </Button>
          <Button 
            variant="outline"
            onClick={handleEdit}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
          >
            <Edit size={16} />
            <span>Edit Input</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
