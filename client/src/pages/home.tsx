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
    <div className="bg-gradient-to-br from-pink-100 via-cyan-100 to-yellow-100 min-h-screen">
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
                <p className="text-sm text-gray-500">Impactful Self-Introduction Speech</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-0 border-b border-gray-300 bg-gray-100">
            <TabsList className="h-auto p-0 bg-transparent w-auto justify-start">
              <TabsTrigger 
                value="introduction" 
                className="text-sm font-semibold py-3 px-6 bg-gray-200 border border-gray-300 border-b-0 rounded-t-lg mr-1 relative data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-gray-300 data-[state=active]:border-b-white data-[state=active]:z-10 data-[state=active]:mb-[-1px] data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-gray-800"
              >
                Framework Guide
              </TabsTrigger>
              <TabsTrigger 
                value="speech" 
                className="text-sm font-semibold py-3 px-6 bg-gray-200 border border-gray-300 border-b-0 rounded-t-lg relative data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-gray-300 data-[state=active]:border-b-white data-[state=active]:z-10 data-[state=active]:mb-[-1px] data-[state=inactive]:bg-gray-200 data-[state=inactive]:text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-gray-800"
              >
                Create Speech
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="introduction" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Framework Guide */}
              <div className="lg:col-span-12">
                <FrameworkGuide onSwitchToSpeech={() => setActiveTab("speech")} />
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
