import { User, Briefcase, Flame, Lightbulb } from "lucide-react";

export default function FrameworkGuide() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-8">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">The Who–What–Why Framework</h2>
        
        <div className="space-y-6">
          {/* WHO Section */}
          <div className="border-l-4 border-primary-500 pl-4">
            <div className="flex items-center space-x-2 mb-2">
              <User className="text-primary-500" size={16} />
              <h3 className="font-semibold text-gray-900">WHO you are</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Give people a quick, relatable sense of who you are.</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Start with a clear identity</li>
              <li>• Add meaningful context</li>
              <li>• Connect with your audience</li>
            </ul>
          </div>

          {/* WHAT Section */}
          <div className="border-l-4 border-secondary-500 pl-4">
            <div className="flex items-center space-x-2 mb-2">
              <Briefcase className="text-secondary-500" size={16} />
              <h3 className="font-semibold text-gray-900">WHAT you do</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Explain your current focus in a way that highlights value.</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Describe who you help and how</li>
              <li>• Use simple, specific language</li>
              <li>• Show results, not just roles</li>
            </ul>
          </div>

          {/* WHY Section */}
          <div className="border-l-4 border-warning-500 pl-4">
            <div className="flex items-center space-x-2 mb-2">
              <Flame className="text-warning-500" size={16} />
              <h3 className="font-semibold text-gray-900">WHY you do it</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Reveal your deeper motivation to build trust and meaning.</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Share a belief or turning point</li>
              <li>• Make it relatable and emotional</li>
              <li>• Tie your 'why' to your 'what'</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-primary-50 rounded-lg">
          <p className="text-sm text-primary-700">
            <Lightbulb className="inline mr-2" size={14} />
            Your AI-generated speech will follow this proven framework to create an engaging 300-word introduction.
          </p>
        </div>
      </div>
    </div>
  );
}
