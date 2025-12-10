import React, { useState } from 'react';
import { AIProvider } from '../types';
import { Key, ChevronDown } from 'lucide-react';

interface AIConfigFormProps {
  onConfigSave: (provider: AIProvider, apiKey: string) => void;
  currentProvider: AIProvider;
  hasApiKey: boolean;
}

export const AIConfigForm: React.FC<AIConfigFormProps> = ({
  onConfigSave,
  currentProvider,
  hasApiKey
}) => {
  const [provider, setProvider] = useState<AIProvider>(currentProvider);
  const [apiKey, setApiKey] = useState('');
  const [showConfig, setShowConfig] = useState(!hasApiKey);

  const handleSave = () => {
    if (apiKey.trim()) {
      onConfigSave(provider, apiKey.trim());
      setApiKey('');
      setShowConfig(false);
    }
  };

  const providerInfo = {
    gemini: {
      name: 'Google Gemini',
      link: 'https://aistudio.google.com/apikey',
      model: 'gemini-2.0-flash-exp'
    },
    openai: {
      name: 'OpenAI GPT',
      link: 'https://platform.openai.com/api-keys',
      model: 'gpt-4o'
    },
    claude: {
      name: 'Anthropic Claude',
      link: 'https://console.anthropic.com/settings/keys',
      model: 'claude-3-5-sonnet'
    }
  };

  return (
    <div className="bg-secondary/30 border border-gray-800 rounded-2xl p-6 mb-6">
      <button
        onClick={() => setShowConfig(!showConfig)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <Key className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-bold text-white">AI 설정</h3>
            <p className="text-xs text-gray-500">
              {hasApiKey 
                ? `현재: ${providerInfo[currentProvider].name} (${providerInfo[currentProvider].model})`
                : 'API 키를 설정해주세요'}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showConfig ? 'rotate-180' : ''}`} />
      </button>

      {showConfig && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              AI 서비스 선택
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(providerInfo) as AIProvider[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setProvider(p)}
                  className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    provider === p
                      ? 'border-primary bg-primary/10 text-white'
                      : 'border-gray-700 bg-black/20 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {providerInfo[p].name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              API 키 입력
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={`${providerInfo[provider].name} API 키를 입력하세요`}
              className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
            />
            <div className="mt-2 flex items-center justify-between">
              <a
                href={providerInfo[provider].link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline"
              >
                {providerInfo[provider].name} API 키 발급받기 →
              </a>
              <span className="text-xs text-gray-500">
                {providerInfo[provider].model}
              </span>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all ${
              apiKey.trim()
                ? 'bg-primary hover:bg-primary/90 text-white'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            저장하기
          </button>
        </div>
      )}
    </div>
  );
};
