import React, { useState, useEffect } from 'react';
import { generateScriptWithAI } from './services/aiService';
import { AppStep, HistoryItem, AIProvider, AIConfig } from './types';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ScriptDisplay } from './components/ScriptDisplay';
import { HistoryList } from './components/HistoryList';
import { AIConfigForm } from './components/AIConfigForm';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [originalTranscript, setOriginalTranscript] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [finalScript, setFinalScript] = useState<string>('');
  const [analysisSummary, setAnalysisSummary] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // AI Configuration
  const [aiConfig, setAiConfig] = useState<AIConfig>(() => {
    const saved = localStorage.getItem('aiConfig');
    return saved ? JSON.parse(saved) : { provider: 'gemini' as AIProvider, apiKey: '' };
  });

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('scriptHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('scriptHistory', JSON.stringify(newHistory));
  };

  // Save AI config
  const handleConfigSave = (provider: AIProvider, apiKey: string) => {
    const newConfig = { provider, apiKey };
    setAiConfig(newConfig);
    localStorage.setItem('aiConfig', JSON.stringify(newConfig));
  };

  // Generate Script (Combined: Analyze + Generate)
  const handleGenerate = async () => {
    if (!aiConfig.apiKey) {
      setError('먼저 AI API 키를 설정해주세요.');
      return;
    }

    if (!originalTranscript.trim()) {
      setError('참고할 기존 대본을 입력해주세요.');
      return;
    }

    if (!newTopic.trim()) {
      setError('새로운 주제를 입력해주세요.');
      return;
    }

    setStep(AppStep.GENERATING);
    setError(null);

    try {
      const result = await generateScriptWithAI(originalTranscript, newTopic, aiConfig);
      setFinalScript(result.final_script);
      setAnalysisSummary(result.analysis_summary);
      
      // Auto-save to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        date: new Date().toLocaleString('ko-KR'),
        topic: newTopic,
        script: result.final_script,
        analysis: result.analysis_summary
      };
      
      const updatedHistory = [newHistoryItem, ...history];
      saveHistory(updatedHistory);
      
      setStep(AppStep.RESULT);
    } catch (err) {
      console.error(err);
      setError('대본 생성에 실패했습니다. API 키와 네트워크 연결을 확인해주세요.');
      setStep(AppStep.INPUT);
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setFinalScript(item.script);
    setAnalysisSummary(item.analysis);
    setNewTopic(item.topic);
    setStep(AppStep.RESULT);
  };

  const handleDeleteHistory = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    saveHistory(updatedHistory);
  };

  const handleReset = () => {
    setStep(AppStep.INPUT);
    setOriginalTranscript('');
    setNewTopic('');
    setFinalScript('');
    setAnalysisSummary('');
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center pb-20 px-4 max-w-5xl mx-auto">
      <Header />

      <main className="w-full mt-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-xl text-red-200 text-sm flex items-center gap-3 animate-pulse">
            <AlertCircle className="w-5 h-5 text-red-500" />
            {error}
          </div>
        )}

        {/* INPUT STEP */}
        {step === AppStep.INPUT || step === AppStep.GENERATING ? (
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            {/* AI Config */}
            <AIConfigForm 
              onConfigSave={handleConfigSave}
              currentProvider={aiConfig.provider}
              hasApiKey={!!aiConfig.apiKey}
            />

            <div className="bg-secondary/50 p-8 rounded-3xl border border-gray-800 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">1</span>
                <h2 className="text-xl font-bold text-white">대본 생성하기</h2>
              </div>
              
              <InputForm
                originalTranscript={originalTranscript}
                setOriginalTranscript={setOriginalTranscript}
                newTopic={newTopic}
                setNewTopic={setNewTopic}
                disabled={step === AppStep.GENERATING}
              />
              
              <div className="mt-8">
                <button
                  onClick={handleGenerate}
                  disabled={step === AppStep.GENERATING}
                  className={`w-full py-5 px-6 rounded-xl font-bold text-lg text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-3
                    ${step === AppStep.GENERATING
                      ? 'bg-gray-800 cursor-not-allowed opacity-80' 
                      : 'bg-gradient-to-r from-primary to-rose-600 hover:scale-[1.02] hover:shadow-primary/30'
                    }`}
                >
                  {step === AppStep.GENERATING ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      대본 생성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      대본 생성하기
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/30 text-center">
               <p className="text-gray-400 text-sm">
                 기존 대본의 구조를 분석하여 새로운 주제로 바이럴 대본을 생성합니다. <br/>
                 생성된 대본은 자동으로 저장됩니다.
               </p>
            </div>

            {/* History List */}
            <HistoryList 
              history={history}
              onSelectHistory={handleSelectHistory}
              onDeleteHistory={handleDeleteHistory}
            />
          </div>
        ) : null}

        {/* RESULT STEP */}
        {step === AppStep.RESULT && (
          <div className="max-w-4xl mx-auto">
            {analysisSummary && (
              <div className="mb-6 p-6 bg-secondary/30 border border-gray-800 rounded-2xl">
                <h3 className="text-sm font-bold text-primary mb-2">📊 분석 요약</h3>
                <p className="text-sm text-gray-300">{analysisSummary}</p>
              </div>
            )}
            
            <ScriptDisplay 
              script={finalScript} 
              onReset={handleReset}
            />

            {/* History List in Result */}
            <div className="mt-12">
              <HistoryList 
                history={history}
                onSelectHistory={handleSelectHistory}
                onDeleteHistory={handleDeleteHistory}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;