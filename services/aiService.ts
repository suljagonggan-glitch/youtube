import { ScriptResult, AIConfig } from '../types';

export const generateScriptWithAI = async (
  originalTranscript: string,
  newTopic: string,
  config: AIConfig
): Promise<ScriptResult> => {
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

[Output Format - JSON]
{
  "analysis_summary": "원본 영상의 성공 요인 분석 (2-3문장)",
  "final_script": "새로운 주제로 작성된 완전한 대본"
}
`;

  switch (config.provider) {
    case 'gemini':
      return await callGemini(prompt, config.apiKey);
    case 'openai':
      return await callOpenAI(prompt, config.apiKey);
    case 'claude':
      return await callClaude(prompt, config.apiKey);
    default:
      throw new Error('Unsupported AI provider');
  }
};

// Gemini API
async function callGemini(prompt: string, apiKey: string): Promise<ScriptResult> {
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.8,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  return JSON.parse(text) as ScriptResult;
}

// OpenAI API
async function callOpenAI(prompt: string, apiKey: string): Promise<ScriptResult> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.8
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content) as ScriptResult;
}

// Claude API
async function callClaude(prompt: string, apiKey: string): Promise<ScriptResult> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      temperature: 0.8,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.content[0].text;
  
  // Claude may return text with or without markdown code blocks
  const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
  const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
  
  return JSON.parse(jsonText) as ScriptResult;
}
