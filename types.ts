export type AIProvider = 'gemini' | 'openai' | 'claude';

export type ChannelType = '썰채널' | '야담' | '건강' | '부동산';
export type VideoLength = '쇼츠' | '10분 이내' | '30분';

export interface AnalysisResult {
  analysis_summary: string;
  structure_points: string[];
}

export interface ScriptResult {
  final_script: string;
  analysis_summary: string;
}

export interface TopicSuggestion {
  suggested_topics: string[];
  analysis_summary: string;
}

export interface VideoConfig {
  channelType: ChannelType;
  videoLength: VideoLength;
}

export interface HistoryItem {
  id: string;
  date: string;
  topic: string;
  script: string;
  analysis: string;
}

export enum AppStep {
  INPUT = 'input',
  ANALYZING = 'analyzing',
  TOPIC_SELECTION = 'topic_selection',
  GENERATING = 'generating',
  RESULT = 'result'
}

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
}