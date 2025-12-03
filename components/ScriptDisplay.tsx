import React, { useState } from 'react';
import { FileText, Copy, Check, RefreshCw } from 'lucide-react';

interface ScriptDisplayProps {
  script: string;
  onReset: () => void;
}

export const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ script, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col bg-secondary/50 rounded-2xl border border-gray-800 shadow-lg overflow-hidden animate-fade-in-up">
      <div className="p-4 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-white">생성된 대본</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-medium text-gray-300 transition-all border border-gray-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            다시 하기
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-red-600 text-xs font-medium text-white transition-all shadow-lg shadow-primary/20"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                복사됨
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                대본 복사
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="relative">
        <textarea
          readOnly
          value={script}
          className="w-full min-h-[600px] bg-[#121212] p-6 text-gray-200 leading-8 focus:outline-none resize-none font-sans text-[15px] whitespace-pre-wrap"
        />
      </div>
    </div>
  );
};