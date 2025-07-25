import { User, Briefcase, Flame, Lightbulb, Play, BookOpen } from "lucide-react";

interface FrameworkGuideProps {
  onSwitchToSpeech?: () => void;
}

export default function FrameworkGuide({ onSwitchToSpeech }: FrameworkGuideProps) {
  return (
    <div className="space-y-8">
      {/* Main Framework Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3 drop-shadow-sm">Introduce Yourself with Who–What–Why</h1>
            <p className="text-lg text-gray-800 font-medium">Craft a compelling self-introduction speech that connects with your audience</p>
          </div>
          
          <div className="space-y-8">
            {/* WHO Section */}
            <div className="border-l-4 border-primary-500 pl-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="text-primary-600" size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 drop-shadow-sm">WHO you are</h2>
              </div>
              <p className="text-gray-800 mb-4 text-lg font-medium">Give people a quick, relatable sense of who you are.</p>
              <div className="bg-primary-50 rounded-lg p-4">
                <ul className="text-sm text-gray-800 space-y-2 font-medium">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 font-bold">1.</span>
                    <span><strong>Start with a clear identity</strong> – Your name plus a sharp, relevant role or label (e.g. "I'm Sarah, a digital marketing strategist and workshop facilitator")</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 font-bold">2.</span>
                    <span><strong>Add meaningful context</strong> – Share your background, evolution, or community ("I started in corporate finance, now I help small businesses grow their online presence")</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary-600 font-bold">3.</span>
                    <span><strong>Connect with your audience</strong> – Adapt your intro to resonate with the setting (e.g. "I'm a fellow entrepreneur" vs. "I help business owners")</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* WHAT Section */}
            <div className="border-l-4 border-secondary-500 pl-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-secondary-50 rounded-full flex items-center justify-center">
                  <Briefcase className="text-secondary-600" size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 drop-shadow-sm">WHAT you do</h2>
              </div>
              <p className="text-gray-800 mb-4 text-lg font-medium">Explain your current focus in a way that highlights value.</p>
              <div className="bg-secondary-50 rounded-lg p-4">
                <ul className="text-sm text-gray-800 space-y-2 font-medium">
                  <li className="flex items-start space-x-2">
                    <span className="text-secondary-600 font-bold">1.</span>
                    <span><strong>Describe who you help and how</strong> – Frame your work around solving a problem or enabling growth</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-secondary-600 font-bold">2.</span>
                    <span><strong>Use simple, specific language</strong> – Avoid jargon; include one clear example (e.g. "I help restaurants create engaging social media content")</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-secondary-600 font-bold">3.</span>
                    <span><strong>Show results, not just roles</strong> – Focus on outcomes or impact ("I help businesses increase their online engagement by 40%")</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* WHY Section */}
            <div className="border-l-4 border-warning-500 pl-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-warning-50 rounded-full flex items-center justify-center">
                  <Flame className="text-warning-600" size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 drop-shadow-sm">WHY you do it</h2>
              </div>
              <p className="text-gray-800 mb-4 text-lg font-medium">Reveal your deeper motivation to build trust and meaning.</p>
              <div className="bg-warning-50 rounded-lg p-4">
                <ul className="text-sm text-gray-800 space-y-2 font-medium">
                  <li className="flex items-start space-x-2">
                    <span className="text-warning-600 font-bold">1.</span>
                    <span><strong>Share a belief or turning point</strong> – Start with a personal story, insight, or mission that fuels your work</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-warning-600 font-bold">2.</span>
                    <span><strong>Make it relatable and emotional</strong> – Help people feel your passion or transformation (e.g. "I wanted to help people connect, not just create content")</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-warning-600 font-bold">3.</span>
                    <span><strong>Tie your 'why' to your 'what'</strong> – Let your motivation explain the work you do today ("That's why I focus on authentic storytelling for brands")</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Card */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl shadow-lg text-white">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Play className="text-white" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black mb-2 text-black">Ready to Create Your Speech?</h3>
              <p className="text-black text-base mb-4 font-bold">Now that you understand the framework, let's create your personalized 300-word introduction speech!</p>
              <button 
                onClick={onSwitchToSpeech}
                className="bg-white text-primary-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border border-gray-200"
              >
                Start Creating →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
