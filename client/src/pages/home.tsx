import { useState } from "react";
import FrameworkGuide from "@/components/framework-guide";
import SpeechForm from "@/components/speech-form";
import GeneratedSpeech from "@/components/generated-speech";
import { MicOff, HelpCircle } from "lucide-react";
import type { GenerateSpeechResponse } from "@/lib/openai";

export default function Home() {
  const [generatedSpeech, setGeneratedSpeech] = useState<GenerateSpeechResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSpeechGenerated = (speech: GenerateSpeechResponse) => {
    setGeneratedSpeech(speech);
    setIsLoading(false);
  };

  const handleStartGeneration = () => {
    setIsLoading(true);
    setGeneratedSpeech(null);
  };

  const handleRegenerate = () => {
    setGeneratedSpeech(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <MicOff className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SpeechCraft</h1>
                <p className="text-sm text-gray-500">AI-Powered Self-Introduction Generator</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <HelpCircle size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Framework Guide Sidebar */}
          <div className="lg:col-span-4">
            <FrameworkGuide />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            <SpeechForm 
              onSpeechGenerated={handleSpeechGenerated}
              onStartGeneration={handleStartGeneration}
              isLoading={isLoading}
            />
            
            {generatedSpeech && (
              <GeneratedSpeech 
                speech={generatedSpeech}
                onRegenerate={handleRegenerate}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <MicOff className="text-white" size={14} />
              </div>
              <span className="text-gray-600">SpeechCraft</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
