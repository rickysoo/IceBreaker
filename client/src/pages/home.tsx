import { useState } from "react";
import FrameworkGuide from "@/components/framework-guide";
import SpeechForm from "@/components/speech-form";
import GeneratedSpeech from "@/components/generated-speech";
import { Handshake, HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { GenerateSpeechResponse } from "@/lib/openai";

export default function Home() {
  const [generatedSpeech, setGeneratedSpeech] = useState<GenerateSpeechResponse | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("introduction");

  const handleSpeechGenerated = (speech: GenerateSpeechResponse, data: any) => {
    setGeneratedSpeech(speech);
    setFormData(data);
    setIsLoading(false);
    setActiveTab("speech");
  };

  const handleStartGeneration = () => {
    setIsLoading(true);
    setGeneratedSpeech(null);
  };

  const handleRegenerate = (newSpeech?: GenerateSpeechResponse) => {
    if (newSpeech) {
      setGeneratedSpeech(newSpeech);
    } else {
      setGeneratedSpeech(null);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <Handshake className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">IceBreaker</h1>
                <p className="text-sm text-gray-500">AI-Powered Introduction Speech Generator</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="introduction" className="text-sm font-medium">Introduction</TabsTrigger>
            <TabsTrigger value="speech" className="text-sm font-medium">Speech</TabsTrigger>
          </TabsList>

          <TabsContent value="introduction" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Framework Guide */}
              <div className="lg:col-span-12">
                <FrameworkGuide />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="speech" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-12">
                <SpeechForm 
                  onSpeechGenerated={handleSpeechGenerated}
                  onStartGeneration={handleStartGeneration}
                  isLoading={isLoading}
                />
                
                {generatedSpeech && (
                  <GeneratedSpeech 
                    speech={generatedSpeech}
                    onRegenerate={handleRegenerate}
                    formData={formData}
                  />
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>


    </div>
  );
}
