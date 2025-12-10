import React from 'react';
import { ChannelType, VideoLength } from '../types';
import { Film, Clock } from 'lucide-react';

interface VideoConfigSelectorProps {
  channelType: ChannelType;
  videoLength: VideoLength;
  onChannelTypeChange: (type: ChannelType) => void;
  onVideoLengthChange: (length: VideoLength) => void;
  disabled?: boolean;
}

export const VideoConfigSelector: React.FC<VideoConfigSelectorProps> = ({
  channelType,
  videoLength,
  onChannelTypeChange,
  onVideoLengthChange,
  disabled = false
}) => {
  const channelTypes: ChannelType[] = ['썰채널', '야담', '건강', '부동산'];
  const videoLengths: VideoLength[] = ['쇼츠', '10분 이내', '30분'];

  const channelTypeInfo = {
    '썰채널': '스토리텔링 중심의 흥미로운 이야기',
    '야담': '실화 기반의 충격적이거나 감동적인 이야기',
    '건강': '건강 정보와 의학 지식 전달',
    '부동산': '부동산 투자와 시장 분석'
  };

  const videoLengthInfo = {
    '쇼츠': '60초 이내 (핵심만 빠르게)',
    '10분 이내': '5-10분 (적당한 분량)',
    '30분': '20-30분 (심층 분석)'
  };

  return (
    <div className="space-y-6">
      {/* Channel Type Selection */}
      <div>
        <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-3">
          <Film className="w-4 h-4 text-primary" />
          영상 구성 선택
        </label>
        <div className="grid grid-cols-2 gap-3">
          {channelTypes.map((type) => (
            <button
              key={type}
              onClick={() => onChannelTypeChange(type)}
              disabled={disabled}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : channelType === type
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-700 bg-black/20 hover:border-gray-600'
              }`}
            >
              <div className="font-bold text-white mb-1">{type}</div>
              <div className="text-xs text-gray-400">{channelTypeInfo[type]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Video Length Selection */}
      <div>
        <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-3">
          <Clock className="w-4 h-4 text-primary" />
          영상 길이 선택
        </label>
        <div className="grid grid-cols-3 gap-3">
          {videoLengths.map((length) => (
            <button
              key={length}
              onClick={() => onVideoLengthChange(length)}
              disabled={disabled}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : videoLength === length
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-700 bg-black/20 hover:border-gray-600'
              }`}
            >
              <div className="font-bold text-white mb-1">{length}</div>
              <div className="text-xs text-gray-400">{videoLengthInfo[length]}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
