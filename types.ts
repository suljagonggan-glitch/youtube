export interface AnalysisResult {
  analysis_summary: string;
  structure_points: string[];
}

export interface ScriptResult {
  final_script: string;
  analysis_summary: string;
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
  GENERATING = 'generating',
  RESULT = 'result'
}