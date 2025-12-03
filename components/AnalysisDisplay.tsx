import React, { useState } from 'react';
import { Activity, GitBranch, Lightbulb, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AnalysisResult } from '../types';

interface AnalysisDisplayProps {
  analysisResult: AnalysisResult;
  onSelectTopic: (topic: string) => void;
  isLoadingScript: boolean;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ 
  analysisResult, 
  onSelectTopic,
  isLoadingScript
}) => {
  const [customTopic, setCustomTopic] = useState('');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const handleTopicClick = (topic: string, idx: number) => {
    if (isLoadingScript) return;
    setSelectedIdx(idx);
    onSelectTopic(topic);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTopic.trim() && !isLoadingScript) {
      setSelectedIdx(-1); // -1 for custom
      onSelectTopic(customTopic);
    }
  };

  return (
    <div className="space-y-6 w-full animate-fade-in-up">
      {/* Analysis Section */}
      <div className="bg-secondary/50 rounded-2xl border border-gray-800 shadow-lg overflow-hidden">
        <div className="p-4 bg-gray-900/50 border-b border-gray-800 flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" />
          <h3 className="font-bold text-gray-200">대본 구조 분석 결과</h3>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">떡상 요인 분석</h4>
            <p className="text-gray-300 text-sm leading-relaxed">{analysisResult.analysis_summary}</p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <GitBranch className="w-3 h-3" />
              성공 공식 (구조)
            </h4>
            <div className="space-y-2">
              {analysisResult.structure_points.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-2 rounded-lg bg-black/20">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 text-accent text-xs font-bold flex items-center justify-center mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-sm text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Topic Selection Section */}
      <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-primary/20 shadow-xl overflow-hidden p-6">
        <div className="flex items-center gap-2 mb-6">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          <h3 className="text-xl font-bold text-white">어떤 주제로 만드실 건가요?</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {analysisResult.suggested_topics.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => handleTopicClick(topic, idx)}
              disabled={isLoadingScript}
              className={`text-left p-4 rounded-xl border transition-all duration-200 relative group
                ${selectedIdx === idx 
                  ? 'bg-primary/20 border-primary ring-1 ring-primary' 
                  : 'bg-gray-800/40 border-gray-700 hover:bg-gray-800 hover:border-gray-500'
                }
                ${isLoadingScript && selectedIdx !== idx ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="flex justify-between items-start">
                <span className={`text-sm font-medium ${selectedIdx === idx ? 'text-white' : 'text-gray-300'}`}>
                  {topic}
                </span>
                {selectedIdx === idx && (
                  <span className="absolute top-4 right-4 animate-pulse">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2 group-hover:text-gray-400">
                이 구조에 딱 맞는 주제입니다.
              </p>
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <div className="relative border-t border-gray-800 pt-5">
           <form onSubmit={handleCustomSubmit} className="flex gap-2">
             <input 
               type="text" 
               value={customTopic}
               onChange={(e) => setCustomTopic(e.target.value)}
               placeholder="원하는 다른 주제가 있다면 입력하세요..."
               disabled={isLoadingScript}
               className="flex-grow bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
             />
             <button 
                type="submit"
                disabled={!customTopic.trim() || isLoadingScript}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 rounded-lg border border-gray-700 disabled:opacity-50 transition-colors"
             >
               <ArrowRight className="w-5 h-5" />
             </button>
           </form>
        </div>
        
        {isLoadingScript && (
           <div className="mt-4 text-center text-sm text-primary animate-pulse font-medium">
             선택하신 주제로 대본을 생성하고 있습니다...
           </div>
        )}
      </div>
    </div>
  );
};