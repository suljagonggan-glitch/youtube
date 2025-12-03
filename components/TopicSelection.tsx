import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface TopicSelectionProps {
  topics: string[];
  analysisSummary: string;
  onSelectTopic: (topic: string) => void;
  isGenerating: boolean;
}

export const TopicSelection: React.FC<TopicSelectionProps> = ({
  topics,
  analysisSummary,
  onSelectTopic,
  isGenerating
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Analysis Summary */}
      <div className="mb-8 p-6 bg-secondary/30 border border-gray-800 rounded-2xl">
        <h3 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          📊 분석 결과
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed">{analysisSummary}</p>
      </div>

      {/* Topic Selection */}
      <div className="bg-secondary/50 p-8 rounded-3xl border border-gray-800 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">2</span>
          <h2 className="text-xl font-bold text-white">주제 선택하기</h2>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          AI가 분석한 구조를 활용하여 떡상 가능성이 높은 주제를 추천합니다. 원하는 주제를 선택하세요.
        </p>

        <div className="space-y-3">
          {topics.map((topic, index) => (
            <button
              key={index}
              onClick={() => onSelectTopic(topic)}
              disabled={isGenerating}
              className={`w-full p-5 rounded-xl border-2 text-left transition-all group ${
                isGenerating
                  ? 'border-gray-800 bg-gray-900/30 cursor-not-allowed opacity-50'
                  : 'border-gray-700 bg-black/40 hover:border-primary hover:bg-primary/5'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-white font-medium group-hover:text-primary transition-colors">
                    {topic}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {isGenerating && (
          <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-xl flex items-center gap-3 justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-sm text-primary font-medium">선택한 주제로 대본 생성 중...</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 rounded-2xl border border-gray-800 bg-gray-900/30 text-center">
        <p className="text-gray-400 text-sm">
          💡 선택한 주제를 바탕으로 원본 대본의 구조와 스타일을 적용한 새로운 대본을 생성합니다.
        </p>
      </div>
    </div>
  );
};
