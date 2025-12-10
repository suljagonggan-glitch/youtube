import React, { useState, useEffect } from 'react';
import { analyzeSuggestTopics, generateScriptWithAI } from './services/aiService';
import { AppStep, HistoryItem, AIProvider, AIConfig, ChannelType, VideoLength } from './types';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ScriptDisplay } from './components/ScriptDisplay';
import { HistoryList } from './components/HistoryList';
import { AIConfigForm } from './components/AIConfigForm';
import { TopicSelection } from './components/TopicSelection';
import { VideoConfigSelector } from './components/VideoConfigSelector';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [originalTranscript, setOriginalTranscript] = useState('');
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [finalScript, setFinalScript] = useState<string>('');
  const [analysisSummary, setAnalysisSummary] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Video Configuration
  const [channelType, setChannelType] = useState<ChannelType>('썰채널');
  const [videoLength, setVideoLength] = useState<VideoLength>('10분 이내');
  
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

  // Step 1: Analyze and suggest topics
  const handleAnalyze = async () => {
    if (!aiConfig.apiKey) {
      setError('먼저 AI API 키를 설정해주세요.');
      return;
    }

    if (!originalTranscript.trim()) {
      setError('참고할 기존 대본을 입력해주세요.');
      return;
    }

    setStep(AppStep.ANALYZING);
    setError(null);

    try {
      const result = await analyzeSuggestTopics(originalTranscript, channelType, aiConfig);
      setSuggestedTopics(result.suggested_topics);
      setAnalysisSummary(result.analysis_summary);
      setStep(AppStep.TOPIC_SELECTION);
    } catch (err) {
      console.error(err);
      setError('대본 분석에 실패했습니다. API 키와 네트워크 연결을 확인해주세요.');
      setStep(AppStep.INPUT);
    }
  };

  // Step 2: Generate script with selected topic
  const handleTopicSelect = async (topic: string) => {
    setSelectedTopic(topic);
    setStep(AppStep.GENERATING);
    setError(null);

    try {
      const result = await generateScriptWithAI(originalTranscript, topic, channelType, videoLength, aiConfig);
      setFinalScript(result.final_script);
      
      // Auto-save to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        date: new Date().toLocaleString('ko-KR'),
        topic: `[${channelType}/${videoLength}] ${topic}`,
        script: result.final_script,
        analysis: analysisSummary
      };
      
      const updatedHistory = [newHistoryItem, ...history];
      saveHistory(updatedHistory);
      
      setStep(AppStep.RESULT);
    } catch (err) {
      console.error(err);
      setError('대본 생성에 실패했습니다. API 키와 네트워크 연결을 확인해주세요.');
      setStep(AppStep.TOPIC_SELECTION);
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setFinalScript(item.script);
    setAnalysisSummary(item.analysis);
    setSelectedTopic(item.topic);
    setStep(AppStep.RESULT);
  };

  const handleDeleteHistory = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    saveHistory(updatedHistory);
  };

  const handleReset = () => {
    setStep(AppStep.INPUT);
    setOriginalTranscript('');
    setSuggestedTopics([]);
    setSelectedTopic('');
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
        {step === AppStep.INPUT || step === AppStep.ANALYZING ? (
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
                <h2 className="text-xl font-bold text-white">영상 구성 및 대본 입력</h2>
              </div>
              
              <div className="space-y-6">
                {/* Video Configuration */}
                <VideoConfigSelector
                  channelType={channelType}
                  videoLength={videoLength}
                  onChannelTypeChange={setChannelType}
                  onVideoLengthChange={setVideoLength}
                  disabled={step === AppStep.ANALYZING}
                />

                {/* Original Transcript Input */}
                <div className="space-y-2 pt-4 border-t border-gray-800">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-300">
                    떡상한 영상 대본 (분석용)
                  </label>
                  <textarea
                    value={originalTranscript}
                    onChange={(e) => setOriginalTranscript(e.target.value)}
                    placeholder="여기에 유튜브 자막/스크립트를 전체 붙여넣기 하세요..."
                    className="w-full h-64 bg-black/40 border border-gray-700 rounded-xl p-4 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all placeholder-gray-600 resize-none leading-relaxed"
                    disabled={step === AppStep.ANALYZING}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>대본이 길수록 분석이 정확해집니다.</span>
                    <span>{originalTranscript.length} 글자</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  onClick={handleAnalyze}
                  disabled={step === AppStep.ANALYZING}
                  className={`w-full py-5 px-6 rounded-xl font-bold text-lg text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-3
                    ${step === AppStep.ANALYZING
                      ? 'bg-gray-800 cursor-not-allowed opacity-80' 
                      : 'bg-gradient-to-r from-primary to-rose-600 hover:scale-[1.02] hover:shadow-primary/30'
                    }`}
                >
                  {step === AppStep.ANALYZING ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      대본 분석 및 주제 추천 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      주제 추천받기
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/30 text-center">
               <p className="text-gray-400 text-sm">
                 <strong className="text-primary">{channelType}</strong> 채널의 <strong className="text-primary">{videoLength}</strong> 영상에 최적화된 대본을 생성합니다. <br/>
                 기존 대본의 구조를 분석하여 헐리우드 기법을 적용한 3~5개의 주제를 추천합니다.
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

        {/* TOPIC SELECTION STEP */}
        {(step === AppStep.TOPIC_SELECTION || step === AppStep.GENERATING) && suggestedTopics.length > 0 && (
          <TopicSelection
            topics={suggestedTopics}
            analysisSummary={analysisSummary}
            onSelectTopic={handleTopicSelect}
            isGenerating={step === AppStep.GENERATING}
          />
        )}

        {/* RESULT STEP */}
        {step === AppStep.RESULT && (
          <div className="max-w-4xl mx-auto">
            {/* Video Config Display */}
            <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center gap-4">
              <span className="text-sm font-bold text-white">
                📺 {channelType}
              </span>
              <span className="text-gray-500">|</span>
              <span className="text-sm font-bold text-white">
                ⏱️ {videoLength}
              </span>
            </div>

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