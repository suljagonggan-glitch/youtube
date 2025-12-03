import React from 'react';
import { HistoryItem } from '../types';
import { Clock, FileText, Trash2 } from 'lucide-react';

interface HistoryListProps {
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onDeleteHistory: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onSelectHistory,
  onDeleteHistory
}) => {
  if (history.length === 0) {
    return (
      <div className="mt-12 p-8 bg-secondary/30 border border-gray-800 rounded-2xl text-center">
        <p className="text-gray-500 text-sm">아직 생성된 대본이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold text-white">지난 대본 생성 이력</h3>
      </div>

      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-secondary/30 border border-gray-800 rounded-xl p-5 hover:border-primary/50 transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => onSelectHistory(item)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <h4 className="font-bold text-white group-hover:text-primary transition-colors">
                    {item.topic}
                  </h4>
                </div>
                <p className="text-xs text-gray-500 mb-2">{item.date}</p>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {item.script.substring(0, 150)}...
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteHistory(item.id);
                }}
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-900/20 rounded-lg transition-all"
                title="삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
