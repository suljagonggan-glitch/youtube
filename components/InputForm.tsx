import React from 'react';
import { AlignLeft, Lightbulb } from 'lucide-react';

interface InputFormProps {
  originalTranscript: string;
  setOriginalTranscript: (val: string) => void;
  newTopic: string;
  setNewTopic: (val: string) => void;
  disabled: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  originalTranscript,
  setOriginalTranscript,
  newTopic,
  setNewTopic,
  disabled
}) => {
  return (
    <div className="space-y-6">
      {/* 입력창 A: 참고용 기존 대본 */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-gray-300">
          <AlignLeft className="w-4 h-4 text-primary" />
          입력창 A: 떡상한 영상 대본 (분석용)
        </label>
        <textarea
          value={originalTranscript}
          onChange={(e) => setOriginalTranscript(e.target.value)}
          placeholder="여기에 유튜브 자막/스크립트를 전체 붙여넣기 하세요..."
          className="w-full h-64 bg-black/40 border border-gray-700 rounded-xl p-4 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all placeholder-gray-600 resize-none leading-relaxed"
          disabled={disabled}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>대본이 길수록 분석이 정확해집니다.</span>
          <span>{originalTranscript.length} 글자</span>
        </div>
      </div>

      {/* 입력창 B: 새로운 주제 */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-bold text-gray-300">
          <Lightbulb className="w-4 h-4 text-primary" />
          입력창 B: 새로 만들고 싶은 영상의 주제
        </label>
        <input
          type="text"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          placeholder="예: 주식 투자 초보자를 위한 첫 투자 가이드"
          className="w-full bg-black/40 border border-gray-700 rounded-xl p-4 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all placeholder-gray-600"
          disabled={disabled}
        />
        <p className="text-xs text-gray-500">
          위의 대본 구조를 활용하여 이 주제로 새로운 대본을 생성합니다.
        </p>
      </div>
    </div>
  );
};