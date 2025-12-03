import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, ScriptResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for Step 1: Analysis & Brainstorming
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    analysis_summary: {
      type: Type.STRING,
      description: "A short summary in Korean explaining why the original video was viral (hook, pacing, emotion).",
    },
    structure_points: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of structural beats (e.g., 'Shocking Hook', 'Conflict Introduction') in Korean.",
    },
    suggested_topics: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-4 creative, viral-worthy new topics that fit this exact structure perfectly. In Korean.",
    },
  },
  required: ["analysis_summary", "structure_points", "suggested_topics"],
};

// Schema for Combined Analysis & Script Generation
const combinedSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    analysis_summary: {
      type: Type.STRING,
      description: "A short summary in Korean explaining why the original video was viral (hook, pacing, emotion).",
    },
    final_script: {
      type: Type.STRING,
      description: "The full script for the new topic, following the analyzed structure. In Korean.",
    },
  },
  required: ["analysis_summary", "final_script"],
};

export const analyzeTranscript = async (transcript: string): Promise<AnalysisResult> => {
  const modelId = "gemini-2.5-flash";
  
  const prompt = `
    당신은 세계적인 유튜브 전략가이자 대본 작가입니다.
    
    [Task]
    1. 제공된 "원본 대본"을 심층 분석하십시오. 이 영상이 왜 성공했는지, 훅(Hook)은 어떠한지, 리텐션 유지 장치는 무엇인지 파악하십시오.
    2. 대본의 구조(Structure)를 단계별로 추출하십시오.
    3. 이 구조를 완벽하게 재활용하여 떡상할 수 있는 "새로운 주제" 4가지를 제안하십시오. 주제는 원본과 다른 분야여야 하지만, 동일한 감정선이나 논리 구조를 가질 수 있는 것이어야 합니다.
    
    [Input Data]
    원본 대본:
    ${transcript}
    
    [Requirements]
    - 반드시 한국어로 답변하십시오.
    - JSON 형식으로 출력하십시오.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini API Error (Analysis):", error);
    throw error;
  }
};

// Combined function: Analyze & Generate in one step
export const generateScriptWithAnalysis = async (
  originalTranscript: string, 
  newTopic: string
): Promise<ScriptResult> => {
  const modelId = "gemini-2.5-flash";

  const prompt = `
    당신은 세계적인 유튜브 전략가이자 100만 유튜버의 메인 작가입니다.
    
    [Task]
    1. 제공된 "원본 대본"을 심층 분석하십시오. 이 영상이 왜 성공했는지, 훅(Hook)은 어떠한지, 리텐션 유지 장치는 무엇인지 파악하십시오.
    2. 분석한 구조와 스타일을 활용하여 "새로운 주제"에 대한 완전한 대본을 작성하십시오.
    
    [Input Data]
    1. 원본 대본 (분석 및 스타일 참고용):
    ${originalTranscript}
    
    2. 새로운 주제:
    ${newTopic}
    
    [Requirements]
    - 원본 대본의 구조(도입-전개-절정-결말)를 정확히 분석하고 재현하십시오.
    - 훅(Hook)은 매우 강력해야 합니다 (첫 3초가 핵심).
    - 문체는 구어체로 자연스럽게 작성하십시오.
    - 괄호 ( ) 안에 시각 자료나 편집 지시사항을 포함하십시오.
    - 리텐션을 유지하는 장치(질문, 반전, 긴장감 등)를 포함하십시오.
    - 언어: 한국어
    - 분석 요약은 2-3문장으로 간결하게 작성하십시오.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: combinedSchema,
        temperature: 0.8, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as ScriptResult;
  } catch (error) {
    console.error("Gemini API Error (Generation):", error);
    throw error;
  }
};

// Keep the old functions for backward compatibility if needed
export const generateScript = async (
  originalTranscript: string, 
  structure: string[], 
  selectedTopic: string
): Promise<ScriptResult> => {
  // Redirect to new combined function
  return generateScriptWithAnalysis(originalTranscript, selectedTopic);
};