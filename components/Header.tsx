import React from 'react';
import { Youtube, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 flex flex-col md:flex-row items-center justify-between border-b border-gray-800">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-primary blur-md opacity-50 rounded-full"></div>
          <div className="relative bg-black p-2 rounded-xl border border-gray-800">
            <Zap className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            유튜브 <span className="text-primary">떡상 제조기</span>
          </h1>
          <p className="text-xs text-gray-500 font-medium tracking-wide">VIRAL SCRIPT CLONING ENGINE</p>
        </div>
      </div>
      
      <div className="mt-4 md:mt-0 flex items-center gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800">
          <Youtube className="w-4 h-4 text-red-500" />
          <span>YouTube Algorithm Optimized</span>
        </div>
      </div>
    </header>
  );
};