import { ScriptResult, AIConfig, TopicSuggestion, ChannelType, VideoLength } from '../types';

// Step 1: Analyze and suggest topics
export const analyzeSuggestTopics = async (
  originalTranscript: string,
  channelType: ChannelType,
  config: AIConfig
): Promise<TopicSuggestion> => {
  const channelContext = {
    '썰채널': '스토리텔링 중심의 흥미진진한 이야기로, 시청자의 호기심과 몰입을 극대화',
    '야담': '실화 기반의 충격적이거나 감동적인 이야기로, 진정성과 공감을 이끌어냄',
    '건강': '건강 정보와 의학 지식을 명확하고 신뢰할 수 있게 전달하며, 시청자의 건강 개선에 도움',
    '부동산': '부동산 투자와 시장 분석을 전문적이고 실용적으로 제공하며, 재테크 인사이트 제공'
  };

  const prompt = `
# Role
당신은 유튜브 알고리즘과 헐리우드 시나리오 작법을 마스터한 **'콘텐츠 아키텍트(Content Architect)'**입니다.

# Channel Type
**${channelType}** - ${channelContext[channelType]}

# Input Data
사용자 원문:
"""
${originalTranscript}
"""

# Task
## STEP 1. 원문 정밀 분석
1. **핵심 감정(Core Emotion):** 원문에서 느껴지는 주된 감정은 무엇인가? (예: 분노, 억울함, 감동, 공포, 황당함)
2. **소재의 잠재력:** 이 소재가 유튜브 시청자에게 먹힐 포인트는 무엇인가?
3. **헐리우드 기법:** 이 감정에 가장 적합한 스토리텔링 기법은?
   - 분노/복수 → 픽티안 커브 (존 윅 스타일)
   - 감동/성장 → 영웅의 여정 (스타워즈 스타일)
   - 공포/미스터리 → 인 미디어스 레스 (넷플릭스 스릴러)
   - 황당/유머 → 행오버 스타일 (미스터리 코미디)

## STEP 2. 주제 리브랜딩
원문의 구조와 감정을 활용하여 **${channelType}** 채널에 최적화된 **3~5개의 클릭을 부르는 새로운 주제**를 제안하십시오.
각 주제는 헐리우드 기법을 적용할 수 있어야 하며, ${channelType} 특성에 맞고 조회수 폭발 가능성이 높아야 합니다.

# Output Format (JSON)
{
  "analysis_summary": "핵심 감정, 소재 잠재력, 적용 가능한 헐리우드 기법을 2-3문장으로 요약",
  "suggested_topics": ["리브랜딩된 주제1", "리브랜딩된 주제2", "리브랜딩된 주제3", "리브랜딩된 주제4", "리브랜딩된 주제5"]
}
`;

  switch (config.provider) {
    case 'gemini':
      return await callGeminiForTopics(prompt, config.apiKey);
    case 'openai':
      return await callOpenAIForTopics(prompt, config.apiKey);
    case 'claude':
      return await callClaudeForTopics(prompt, config.apiKey);
    default:
      throw new Error('Unsupported AI provider');
  }
};

// Step 2: Generate script with selected topic
export const generateScriptWithAI = async (
  originalTranscript: string,
  newTopic: string,
  channelType: ChannelType,
  videoLength: VideoLength,
  config: AIConfig
): Promise<ScriptResult> => {
  const channelContext = {
    '썰채널': '스토리텔링 중심의 흥미진진한 이야기',
    '야담': '실화 기반의 충격적이거나 감동적인 이야기',
    '건강': '건강 정보와 의학 지식 전달',
    '부동산': '부동산 투자와 시장 분석'
  };

  const lengthGuide = {
    '쇼츠': '60초 이내로 핵심만 빠르게 전달. 첫 3초가 생명. 자막 친화적. 빠른 전개.',
    '10분 이내': '5-10분 분량. 적당한 기승전결. 중간 광고 고려. 리텐션 유지 장치 필수.',
    '30분': '20-30분 심층 콘텐츠. 챕터 구성. 디테일한 설명. 여러 서브 스토리 가능.'
  };

  const prompt = `
# Role
당신은 유튜브 알고리즘과 헐리우드 시나리오 작법을 마스터한 **'콘텐츠 아키텍트(Content Architect)'**입니다.

# Video Configuration
- **채널 타입:** ${channelType} (${channelContext[channelType]})
- **영상 길이:** ${videoLength} (${lengthGuide[videoLength]})

# Input Data
사용자 원문:
"""
${originalTranscript}
"""

선택된 새로운 주제:
"""
${newTopic}
"""

# Process (반드시 순서대로 실행)

## STEP 1. 원문 정밀 분석 (Diagnosis)
1. **핵심 감정(Core Emotion):** 원문에서 느껴지는 주된 감정 파악
2. **소재의 잠재력:** 유튜브 시청자에게 먹힐 포인트 발견

## STEP 2. 헐리우드 기법 매칭 (Matching)
감정에 따라 가장 적합한 스토리텔링 기법 선정:
- **분노/복수** → 픽티안 커브 (존 윅): 위기 고조 → 사이다 터뜨림
- **감동/성장** → 영웅의 여정 (스타워즈): 결핍 → 도전 → 성공
- **공포/미스터리** → 인 미디어스 레스 (넷플릭스): 충격 장면 먼저 제시
- **황당/유머** → 행오버 스타일: 꼬리에 꼬리를 무는 대혼란

## STEP 3. 대본 집필 (Execution)
선정된 기법의 구조에 맞춰 새로운 주제로 대본 작성.

# Output Requirements
- **${videoLength}** 분량에 최적화된 대본 작성
- **${channelType}** 채널 특성에 맞는 톤앤매너 적용
- 선택된 헐리우드 기법의 구조를 명확히 적용할 것
- 각 파트([훅], [전개], [절정], [결말] 등)를 구분하여 표시
- 썸네일/제목 추천 3개 포함 (${channelType} 특성 반영)
- BGM, 효과음, 편집 가이드를 괄호 안에 명시
- 지루한 부분은 과감히 삭제, 감정선은 극대화
- 첫 3초 훅은 충격적이거나 궁금증을 유발해야 함
- 구어체, 자연스러운 말투 사용
- ${videoLength === '쇼츠' ? '60초 이내로 간결하게' : videoLength === '10분 이내' ? '5-10분 적당한 분량' : '20-30분 심층 분석'}

# YouTube 커뮤니티 가이드 준수 (필수)
대본 작성 시 다음 사항을 철저히 준수하시오:

**금지 콘텐츠:**
- 폭력적/혐오적 표현 (특정 집단 비하, 차별적 언어)
- 위험한 행위 조장 (자해, 범죄, 위험한 챌린지)
- 선정적 콘텐츠 (성적 암시, 노골적 표현)
- 아동 착취 또는 아동 안전 위협
- 잘못된 의료/건강 정보 유포
- 사기/스캠 조장
- 저작권 침해 우려 콘텐츠

**권장 사항:**
- 건전하고 긍정적인 메시지 전달
- 사실 기반 정보 제공
- 교육적/오락적 가치 제공
- 모든 연령대가 시청 가능한 콘텐츠
- 출처가 불확실한 정보는 명확히 표시

**위반 시 대본 수정:**
- 문제가 될 수 있는 표현은 순화하여 재작성
- 논란의 여지가 있는 내용은 중립적으로 표현
- 자극적인 썸네일/제목도 가이드라인 준수

# 등장인물 이름 처리 규칙 (필수)
**원본 대본의 인물 이름 변경:**
- 원본 대본에 등장하는 일반인의 실명은 **반드시 가명으로 변경**할 것
- 예: 김철수 → 김 모씨, A씨, 혹은 새로운 가명 (김민준, 이서연 등)
- 역할이나 관계로 표현 가능 (예: 피해자, 직장 동료, 친구 등)

**예외 - 실명 사용 가능:**
- 역사적 인물 (세종대왕, 이순신, 링컨, 아인슈타인 등)
- 공인/유명인사 (대통령, 정치인, 연예인, 유명 CEO 등)
- 이미 공개된 사건의 공식 당사자

**가명 생성 가이드:**
- 자연스럽고 시대/배경에 맞는 이름 선택
- 원본과 다른 이름으로 변경하되 인물 특성 유지
- 필요시 각주로 "가명입니다" 표시

# Output Format (JSON)
{
  "analysis_summary": "적용된 헐리우드 기법과 이유를 2-3문장으로 설명",
  "final_script": "완성된 대본 전체 (썸네일 추천 포함, 파트별 구분 명확히)"
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

// Topic suggestion functions
async function callGeminiForTopics(prompt: string, apiKey: string): Promise<TopicSuggestion> {
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
  return JSON.parse(text) as TopicSuggestion;
}

async function callOpenAIForTopics(prompt: string, apiKey: string): Promise<TopicSuggestion> {
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
  return JSON.parse(data.choices[0].message.content) as TopicSuggestion;
}

async function callClaudeForTopics(prompt: string, apiKey: string): Promise<TopicSuggestion> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
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
  
  const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/);
  const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
  
  return JSON.parse(jsonText) as TopicSuggestion;
}
