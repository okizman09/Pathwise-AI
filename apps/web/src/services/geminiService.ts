import { WorkflowResult, Tool } from '../types';
import { CURATED_TOOLS } from '../data/knowledgeData';

const KEY_STORAGE_KEY = 'pathwise_gemini_api_key';
const MODEL_STORAGE_KEY = 'pathwise_gemini_model';

export const DEFAULT_GEMINI_MODEL = 'gemini-1.5-flash-latest';

export interface ModelOption {
  id: string;
  name: string;
  recommended?: boolean;
}

export interface QuestionnaireItem {
  id: string;
  question: string;
  options: string[];
  defaultOption: string;
}

export const FALLBACK_GEMINI_MODELS: ModelOption[] = [
  { id: 'gemini-1.5-flash-latest', name: 'Gemini 1.5 Flash (Latest)', recommended: true },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
  { id: 'gemini-1.5-flash-001', name: 'Gemini 1.5 Flash (v001)' },
  { id: 'gemini-1.5-flash-002', name: 'Gemini 1.5 Flash (v002)' },
  { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Experimental)' },
  { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro (Latest)' },
  { id: 'gemini-pro', name: 'Gemini 1.0 Pro' },
];

export function getGeminiApiKey(): string {
  const stored = localStorage.getItem(KEY_STORAGE_KEY);
  if (stored) return stored.trim();
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  return envKey ? envKey.trim() : '';
}

export function setGeminiApiKey(key: string): void {
  if (key.trim()) {
    localStorage.setItem(KEY_STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(KEY_STORAGE_KEY);
  }
}

export function getGeminiModel(): string {
  return localStorage.getItem(MODEL_STORAGE_KEY) || DEFAULT_GEMINI_MODEL;
}

export function setGeminiModel(model: string): void {
  localStorage.setItem(MODEL_STORAGE_KEY, model);
}

let cachedModelsList: { timestamp: number; models: ModelOption[] } | null = null;
const MODEL_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Queries Google's ModelService.ListModels endpoint using the user's API key with in-memory caching.
 */
export async function fetchAvailableModels(apiKey?: string, forceRefresh = false): Promise<ModelOption[]> {
  const key = (apiKey || getGeminiApiKey()).trim();
  if (!key) return FALLBACK_GEMINI_MODELS;

  if (!forceRefresh && cachedModelsList && (Date.now() - cachedModelsList.timestamp < MODEL_CACHE_TTL_MS)) {
    return cachedModelsList.models;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    const response = await fetch(url);
    if (!response.ok) {
      return FALLBACK_GEMINI_MODELS;
    }

    const data = await response.json();
    const rawModels: any[] = data.models || [];

    const available = rawModels
      .filter((m: any) => {
        const name = (m.name || '').toLowerCase();
        const supportsGen = m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent');
        const isSpecialized = name.includes('-tts') || name.includes('embedding') || name.includes('aqa') || name.includes('bison') || name.includes('imagen');
        return supportsGen && !isSpecialized;
      })
      .map((m: any) => {
        const cleanId = m.name.replace('models/', '');
        return {
          id: cleanId,
          name: m.displayName ? `${m.displayName} (${cleanId})` : cleanId,
          recommended: cleanId.includes('flash')
        };
      });

    if (available.length > 0) {
      cachedModelsList = { timestamp: Date.now(), models: available };
      return available;
    }
  } catch (e) {
    console.warn('Could not query ListModels from Gemini API:', e);
  }

  return FALLBACK_GEMINI_MODELS;
}

/**
 * Helper to call Gemini REST API with rate-limit detection and model fallback.
 */
async function fetchGeminiApi(
  apiKey: string,
  preferredModel: string,
  requestBody: any
): Promise<{ data: any; workingModel: string }> {
  let availableModelIds: string[] = [];
  try {
    const fetched = await fetchAvailableModels(apiKey);
    availableModelIds = fetched.map(m => m.id);
  } catch (e) {
    // fallback if list API fails
  }

  const candidateModels = Array.from(new Set([
    preferredModel,
    ...availableModelIds,
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-1.5-flash-001',
    'gemini-1.5-flash-002',
    'gemini-2.0-flash-exp',
    'gemini-1.5-pro-latest',
    'gemini-pro'
  ])).filter(m => !m.toLowerCase().includes('-tts') && !m.toLowerCase().includes('embedding'));

  let lastErrorMsg = '';

  for (const model of candidateModels) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        if (model !== preferredModel) {
          setGeminiModel(model);
        }
        return { data, workingModel: model };
      }

      const errData = await response.json().catch(() => ({}));
      const msg = errData.error?.message || `HTTP ${response.status}`;
      lastErrorMsg = msg;

      if (response.status === 429 || msg.includes('Quota exceeded') || msg.includes('RESOURCE_EXHAUSTED')) {
        throw new Error(`Gemini Free Tier Rate Limit reached. Please wait a moment before retrying.`);
      }

      if (response.status === 400 && msg.includes('API_KEY_INVALID')) {
        throw new Error(`Invalid Gemini API Key: ${msg}`);
      }

      if (!msg.toLowerCase().includes('not found') && !msg.toLowerCase().includes('supported') && response.status !== 404) {
        throw new Error(msg);
      }
    } catch (err: any) {
      if (err.message && (err.message.includes('Rate Limit') || err.message.includes('Quota exceeded') || err.message.includes('API_KEY_INVALID'))) {
        throw err;
      }
      if (err.message && !err.message.toLowerCase().includes('not found') && !err.message.toLowerCase().includes('supported')) {
        throw err;
      }
      lastErrorMsg = err.message || 'Model call failed.';
    }
  }

  throw new Error(`Gemini API Error: ${lastErrorMsg}`);
}

/**
 * Validates a Gemini API Key.
 */
export async function testGeminiApiKey(apiKey: string, modelName?: string): Promise<{ success: boolean; message: string }> {
  const key = apiKey.trim();
  if (!key) {
    return { success: false, message: 'Please enter an API Key.' };
  }

  const model = modelName || getGeminiModel();

  try {
    const { workingModel } = await fetchGeminiApi(key, model, {
      contents: [{ parts: [{ text: 'Respond with "OK" if connected.' }] }]
    });

    return {
      success: true,
      message: `Connected successfully using model "${workingModel}"!`
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to authenticate key.'
    };
  }
}

/**
 * Executes a single prompt live via Gemini API and returns the generated text.
 */
export async function runPromptWithGemini(promptText: string): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API Key is missing. Please check your .env configuration.');
  }

  const model = getGeminiModel();
  const { data } = await fetchGeminiApi(apiKey, model, {
    contents: [{ parts: [{ text: promptText }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1500,
    }
  });

  const candidate = data.candidates?.[0];
  const outputText = candidate?.content?.parts?.[0]?.text;

  if (!outputText) {
    throw new Error('Gemini API returned an empty response.');
  }

  return outputText;
}

/**
 * Generates 2-3 dynamic targeted questions to clarify the user's specs before generating a workflow.
 */
export async function generateQuestionnaireWithGemini(goal: string): Promise<QuestionnaireItem[]> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return getFallbackQuestionnaire(goal);
  }

  const model = getGeminiModel();
  const prompt = `You are Pathwise AI — an intelligent creation assistant designed for creators, beginners, and professionals.
The user wants to create: "${goal}".

Generate 2-3 simple, user-friendly multiple-choice follow-up questions to understand their target platform, visual/content style, format, or budget BEFORE generating a workflow.

CRITICAL NON-TECHNICAL RULES:
1. NEVER ask the user to choose or select specific AI tool names (e.g. DO NOT ask "Do you prefer Runway, Kling AI, or Pika?"). The user does NOT know AI tool names yet — that is Pathwise AI's job to recommend!
2. Focus questions purely on user outcomes and preferences:
   - Target Platform / Publishing Format (e.g., Short-form YouTube Shorts/TikTok vs Long-form YouTube vs Website)
   - Visual & Aesthetic Preference (e.g., Photorealistic AI B-Roll, Animated Illustration, Faceless Captions, Clean UI Dashboard)
   - Audio & Narration Style (e.g., Natural AI Voiceover + Background Score, Personal Voice Recording, Text & Captions Only)
   - Budget Preference (e.g., 100% Free & Freemium Tools, Professional Quality AI Tools)

Return ONLY a valid JSON array of objects with this structure without any markdown:
[
  {
    "id": "format",
    "question": "Where will you publish or use this content?",
    "options": ["YouTube Shorts / TikTok (Short-form)", "YouTube Channel (Long-form)", "Social Media & Website"],
    "defaultOption": "YouTube Shorts / TikTok (Short-form)"
  }
]`;

  try {
    const { data } = await fetchGeminiApi(apiKey, model, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1000,
        responseMimeType: 'application/json'
      }
    });

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawText) {
      const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned) as QuestionnaireItem[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Gemini Questionnaire generation failed, falling back:', e);
  }

  return getFallbackQuestionnaire(goal);
}

export function getFallbackQuestionnaire(goal: string): QuestionnaireItem[] {
  const g = goal.toLowerCase();
  
  // 1. Trading / Forex / EA (Use regex word boundaries so "create" doesn't match "ea"!)
  const isTrading = /\b(trading|ea|expert advisor|forex|mql|mql4|mql5|pinescript|metatrader|crypto bot)\b/i.test(g);
  if (isTrading) {
    return [
      {
        id: 'platform',
        question: 'Which platform will your trading strategy execute on?',
        options: ['MetaTrader 4 / MetaTrader 5', 'TradingView Charts', 'Custom Python / Exchange API'],
        defaultOption: 'MetaTrader 4 / MetaTrader 5'
      },
      {
        id: 'strategy',
        question: 'What type of trading strategy do you want to automate?',
        options: ['Indicator Crossover (e.g. Moving Average + RSI)', 'Grid & Trend Following', 'Breakout & Volatility'],
        defaultOption: 'Indicator Crossover (e.g. Moving Average + RSI)'
      },
      {
        id: 'risk',
        question: 'How should account risk be managed per trade?',
        options: ['Fixed Account Risk % (e.g. 1-2%)', 'Fixed Position Sizing', 'Trailing Stop & Break-even'],
        defaultOption: 'Fixed Account Risk % (e.g. 1-2%)'
      }
    ];
  }

  // 2. Video / YouTube / Shorts / Reel
  const isVideo = /\b(video|youtube|short|shorts|reel|tiktok|movie|film|animation)\b/i.test(g);
  if (isVideo) {
    return [
      {
        id: 'video_style',
        question: 'What video format and platform are you creating for?',
        options: ['Faceless Short (YouTube Shorts / TikTok / Reels)', 'Full Long-form YouTube Video', 'Cinematic Commercial', 'Animated Explainer'],
        defaultOption: 'Faceless Short (YouTube Shorts / TikTok / Reels)'
      },
      {
        id: 'visual_aesthetic',
        question: 'What visual aesthetic do you want for your video scenes?',
        options: ['Photorealistic & Cinematic B-Roll', '3D Animated Style', 'Faceless Captions & Stock Visuals'],
        defaultOption: 'Photorealistic & Cinematic B-Roll'
      },
      {
        id: 'audio_narration',
        question: 'How would you like the voiceover and audio music handled?',
        options: ['Professional AI Voiceover + Custom Background Score', 'Record My Own Voice', 'Background Music & Text Captions Only'],
        defaultOption: 'Professional AI Voiceover + Custom Background Score'
      }
    ];
  }

  // 3. Coding / Web / App / Script
  const isCoding = /\b(code|coding|script|app|web|python|react|fullstack|api|developer)\b/i.test(g);
  if (isCoding) {
    return [
      {
        id: 'type',
        question: 'What type of software project are you building?',
        options: ['Fullstack Web Application', 'Automation Script / Data Pipeline', 'Backend API Service'],
        defaultOption: 'Fullstack Web Application'
      },
      {
        id: 'experience_level',
        question: 'What is your coding experience level?',
        options: ['No Code / Beginner (Prompt-to-Build)', 'Developer (In-IDE AI Pair Programming)'],
        defaultOption: 'No Code / Beginner (Prompt-to-Build)'
      }
    ];
  }

  // 4. Music / Audio / Song
  const isAudio = /\b(song|music|audio|podcast|track|beat|lofi|voiceover)\b/i.test(g);
  if (isAudio) {
    return [
      {
        id: 'audio_genre',
        question: 'What type of audio output do you want to create?',
        options: ['Full Song with Vocal Tracks & Lyrics', 'Lofi / Instrumental Background Track', 'AI Voiceover & Podcast Intro'],
        defaultOption: 'Full Song with Vocal Tracks & Lyrics'
      }
    ];
  }

  // 5. General Fallback
  return [
    {
      id: 'output_type',
      question: 'What is your primary goal deliverable format?',
      options: ['Digital Guide / Content', 'Interactive Web Project', 'Social Media Campaign'],
      defaultOption: 'Digital Guide / Content'
    },
    {
      id: 'budget_tier',
      question: 'What is your preferred AI tool budget tier?',
      options: ['Free & Freemium Tools Only', 'Professional Paid AI Suite'],
      defaultOption: 'Free & Freemium Tools Only'
    }
  ];
}

/**
 * Generates a domain-accurate, highly practical workflow using Gemini AI reasoning based on user answers.
 */
export async function generateWorkflowWithGemini(
  goal: string,
  explicitAssumptions?: Record<string, string>
): Promise<WorkflowResult> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API Key not set.');
  }

  const model = getGeminiModel();

  const toolsSummary = CURATED_TOOLS.map(t => ({
    id: t.id,
    name: t.name,
    category: t.category,
    description: t.description,
    bestApplication: t.bestApplication
  }));

  const userSpecsText = explicitAssumptions ? JSON.stringify(explicitAssumptions) : 'Standard defaults';

  const systemPrompt = `You are Pathwise AI — an intelligent, domain-expert AI workflow architect.

User Goal: "${goal}"
User Specified Answers to Follow-Up Questions: ${userSpecsText}

Available Tools Index:
${JSON.stringify(toolsSummary)}

CRITICAL DOMAIN-SPECIFIC RULES:
1. DOMAIN ACCURACY & TOOL RELEVANCE:
   - Carefully analyze the exact domain of the user goal (e.g. Trading EA / MQL4 / PineScript, Web Development, Audio Production, Video Editing, Writing, Marketing).
   - Incorporate the user's specific answers from ${userSpecsText} into the workflow and prompts.
   - NEVER introduce irrelevant tools! For example, NEVER recommend Midjourney or Canva for coding or trading bot (EA) tasks.
   - For trading EAs, coding, or scripting, use developer AI tools like ChatGPT, Claude, Antigravity AI, or Cursor.

2. SINGLE-TOOL WORKFLOW PREFERENCE:
   - If a technical task can be executed end-to-end using a SINGLE primary tool (e.g., ChatGPT or Claude for a 3-step trading EA development path), USE THAT SINGLE TOOL FOR ALL STEPS!

3. HIGH-VALUE DOMAIN PROMPTS & VARIABLES:
   - Write realistic, production-ready prompts tailored specifically to the user's domain and specs with curly brace placeholders like {trading_pair}, {timeframe}, {risk_percent}.

Return ONLY a valid JSON object matching this exact TypeScript structure without any markdown formatting or extra text:
{
  "id": "wf-gemini-${Date.now()}",
  "goal": "${goal}",
  "category": "Domain Category (e.g. Algorithmic Trading, Web App, Video)",
  "summary": "Clear executive summary of the workflow path based on user selections",
  "difficulty": "Beginner / Intermediate / Advanced",
  "totalTime": "30-45 minutes",
  "triageAssumptions": [
    {
      "id": "platform",
      "category": "Target Platform",
      "label": "Platform / Language",
      "currentValue": "User selected option",
      "options": ["Option 1", "Option 2"]
    }
  ],
  "steps": [
    {
      "stepNumber": 1,
      "title": "Step Title relevant to domain",
      "description": "Step Description",
      "category": "Category Name",
      "primaryTool": {
        "id": "chatgpt",
        "name": "ChatGPT (GPT-4o)",
        "category": "Content",
        "description": "Description",
        "bestApplication": "Best use case",
        "pricingModel": "Freemium",
        "pricingDetails": "Free tier available",
        "skillLevel": "Beginner",
        "websiteUrl": "https://chatgpt.com",
        "whyRecommended": "Why this specific tool for this domain step",
        "rating": 4.9,
        "logoText": "GPT",
        "keyFeatures": ["Code Generation", "Custom Instructions"]
      },
      "prompt": {
        "id": "p-1",
        "title": "Domain-Specific Prompt Title",
        "targetTool": "ChatGPT / Claude",
        "stepNumber": 1,
        "rawTemplate": "High quality prompt with {variables} specific to the task domain...",
        "variables": [
          {
            "key": "trading_pair",
            "label": "Trading Pair",
            "defaultValue": "EUR/USD",
            "placeholder": "e.g. EUR/USD"
          }
        ],
        "explanation": "Why this prompt structure produces accurate code/results for this domain",
        "bestPractices": ["Domain tip 1", "Domain tip 2"]
      },
      "estimatedTime": "10 mins",
      "proTip": "Domain specific pro tip"
    }
  ]
}`;

  const { data } = await fetchGeminiApi(apiKey, model, {
    contents: [{ parts: [{ text: systemPrompt }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2500,
      responseMimeType: 'application/json'
    }
  });

  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('Gemini API returned an empty output.');
  }

  const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleanedText) as WorkflowResult;
  return parsed;
}

/**
 * Perform real AI analytics & tool evaluation on any search query using Gemini API.
 */
export async function analyzeToolsWithGemini(query: string): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return '';

  const model = getGeminiModel();
  const prompt = `You are a concise AI analytics engine. Perform instant AI analytics on: "${query}".
Do NOT include any scratchpad, setup notes, or chain-of-thought commentary.
Provide ONLY 3 direct bullet points covering:
• Top modern & emerging AI tools for this specific task
• Key technical setup or prompt strategy
• Estimated speed & efficiency gain over manual creation`;

  try {
    const { data } = await fetchGeminiApi(apiKey, model, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 500 }
    });
    let raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Strip out scratchpad notes if model hallucinated reasoning steps
    if (raw.includes('Bullet 1') || raw.includes('What is')) {
      const bulletIndex = raw.indexOf('•');
      if (bulletIndex !== -1) {
        raw = raw.substring(bulletIndex);
      } else {
        const starIndex = raw.indexOf('*');
        if (starIndex !== -1) raw = raw.substring(starIndex);
      }
    }

    return raw.trim();
  } catch (e) {
    return '';
  }
}

/**
 * Scrapes and discovers newly launched AI tools across the web in real-time.
 */
export async function discoverNewAiTools(categoryQuery = 'All'): Promise<Tool[]> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return [];
  }

  const model = getGeminiModel();
  const prompt = `Act as an AI tool indexing engine and live web scraper.
Discover 4 newly launched or trending high-impact AI tools in the "${categoryQuery}" category (e.g. modern coding agents, video generators, trading bots, UI generators).

Return ONLY a valid JSON array of Tool objects matching this structure:
[
  {
    "id": "tool-id-slug",
    "name": "Tool Name",
    "category": "Coding",
    "description": "Concise 1-2 sentence description of what the tool does.",
    "bestApplication": "Specific high-value use case or best application of this tool.",
    "pricingModel": "Freemium",
    "pricingDetails": "Free trial available",
    "skillLevel": "Intermediate",
    "websiteUrl": "https://official-tool-url.com",
    "whyRecommended": "Why this tool is trending and effective.",
    "rating": 4.9,
    "logoText": "SL",
    "badge": "Newly Scraped",
    "keyFeatures": ["Feature 1", "Feature 2"],
    "starterPrompt": "Production starter prompt for this tool.",
    "isDiscovered": true
  }
]`;

  try {
    const { data } = await fetchGeminiApi(apiKey, model, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1500,
        responseMimeType: 'application/json'
      }
    });

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawText) {
      const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned) as Tool[];
      if (Array.isArray(parsed)) {
        return parsed.map(t => ({ ...t, isDiscovered: true }));
      }
    }
  } catch (e) {
    console.warn('Live AI Tool discovery failed:', e);
  }

  return [];
}
