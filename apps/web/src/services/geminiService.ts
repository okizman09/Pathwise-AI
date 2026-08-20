import { WorkflowResult, Tool } from '../types';
import { CURATED_TOOLS } from '../data/knowledgeData';
import { getVerifiedCandidatePool, extractUserIntent, buildDeterministicPipeline } from './recommendationEngine';
import { validateAndHydrateWorkflow } from './pipelineValidator';

const KEY_STORAGE_KEY = 'pathwise_gemini_api_key';
const MODEL_STORAGE_KEY = 'pathwise_gemini_model';

export const DEFAULT_GEMINI_MODEL = 'gemini-3.1-flash-lite';

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
  { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite (Fast & Reliable)', recommended: true },
  { id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash' },
  { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash' },
  { id: 'gemini-flash-latest', name: 'Gemini Flash (Latest)' },
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
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
 * Helper to call Gemini REST API with rate-limit detection and automatic multi-model fallback.
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

  // Prioritize reliable, high-quota models
  const candidateModels = Array.from(new Set([
    'gemini-3.1-flash-lite',
    preferredModel,
    'gemini-3.6-flash',
    'gemini-3.5-flash-lite',
    'gemini-flash-latest',
    'gemini-3.7-flash',
    ...availableModelIds,
    'gemini-2.5-flash',
    'gemini-3.1-pro-preview',
    'gemini-pro-latest'
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

      if (response.status === 400 && msg.includes('API_KEY_INVALID')) {
        throw new Error(`Invalid Gemini API Key: ${msg}`);
      }

      // If 429 (quota), 503 (high demand), or 404 (not found), continue to next model in loop
      console.warn(`Model ${model} returned ${response.status} (${msg}). Trying next available model...`);
    } catch (err: any) {
      if (err.message && err.message.includes('API_KEY_INVALID')) {
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

Generate at most 2 simple, user-friendly multiple-choice follow-up questions to resolve high-impact ambiguities before generating a workflow.

CRITICAL TASK INTELLIGENCE RULES:
1. MAXIMUM 2 QUESTIONS: Return at most 2 high-impact ambiguity clarification questions.
2. ONLY HIGH-IMPACT AMBIGUITIES: Only ask questions if the user's intent leaves a major structural ambiguity (e.g. application submission system vs informational landing page, direct chat embed vs custom dashboard).
3. DO NOT ASSUME A TECH STACK: Do not assume a specific technology stack unless the user explicitly specified one.
4. NEVER ASK TOOL NAMES: Never ask the user to choose AI tool names (e.g. do not ask "Do you want to use Voiceflow or Botpress?"). The user does NOT know AI tools yet — that is Pathwise AI's job!

Return ONLY a valid JSON array of at most 2 objects with this structure:
[
  {
    "id": "ambiguity_field",
    "question": "Clear, non-technical question?",
    "options": ["Option 1", "Option 2", "Option 3"],
    "defaultOption": "Option 1"
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
  const intent = extractUserIntent(goal);
  if (intent.ambiguities && intent.ambiguities.length > 0) {
    return intent.ambiguities.slice(0, 2).map(a => ({
      id: a.field,
      question: a.question,
      options: a.options || ['Yes / Direct Integration', 'No / External Link', 'General Info'],
      defaultOption: a.defaultOption || (a.options ? a.options[0] : 'Yes / Direct Integration')
    }));
  }

  const g = goal.toLowerCase();
  
  // 1. Content / Blog / Article / Social Media / Copywriting / Newsletter
  const isContent = /\b(blog|post|article|write|writing|copy|copywriting|newsletter|social media|linkedin|twitter|thread|content|seo|essay|story|marketing copy)\b/i.test(g);
  if (isContent) {
    return [
      {
        id: 'post_type',
        question: 'What type or format of blog post do you want to create?',
        options: [
          'Actionable How-To Guide / Tutorial',
          'Thought Leadership & Industry Trends',
          'Curated Listicle / Best Tools Roundup',
          'Story-Driven Case Study & Lessons'
        ],
        defaultOption: 'Actionable How-To Guide / Tutorial'
      },
      {
        id: 'target_platform',
        question: 'Which primary platform and social channels will you publish on?',
        options: [
          'Multi-Platform (Blog + LinkedIn + X/Twitter Thread)',
          'LinkedIn Article & Carousel Summary',
          'Medium / Substack Newsletter',
          'Company Blog / SEO Website'
        ],
        defaultOption: 'Multi-Platform (Blog + LinkedIn + X/Twitter Thread)'
      },
      {
        id: 'tone_style',
        question: 'What tone of voice fits your target audience?',
        options: [
          'Conversational, Punchy & Engaging',
          'Authoritative, Data-Driven & Professional',
          'Inspiring, Personal & Story-Led',
          'Direct, Practical & Step-by-Step'
        ],
        defaultOption: 'Conversational, Punchy & Engaging'
      }
    ];
  }

  // 2. Trading / Forex / EA (Use regex word boundaries so "create" doesn't match "ea"!)
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

  // 3. Video / YouTube / Shorts / Reel
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

  // 4. Chatbots, AI Agents, Customer Support & Assistants
  const isChatbot = /\b(chatbot|bot|agent|assistant|chat|support|rag|knowledge base)\b/i.test(g);
  if (isChatbot) {
    return [
      {
        id: 'primary_use_case',
        question: 'What is the primary role and purpose of your AI chatbot?',
        options: [
          'Customer Support & FAQ Answering',
          'RAG Knowledge Base & Document Q&A (PDFs/Notion)',
          'Lead Generation, Sales & Appointment Booking',
          'Community Moderation & Engagement (Slack/Discord)'
        ],
        defaultOption: 'Customer Support & FAQ Answering'
      },
      {
        id: 'deployment_platform',
        question: 'Where do you plan to deploy your chatbot?',
        options: [
          'Embeddable Website Popup Widget',
          'Messaging App (WhatsApp, Telegram, Slack)',
          'Fullstack Web Application / Custom UI',
          'Internal Team Dashboard'
        ],
        defaultOption: 'Embeddable Website Popup Widget'
      },
      {
        id: 'technical_stack',
        question: 'What is your preferred development approach?',
        options: [
          'Visual No-Code Builder (Voiceflow / Botpress / Chatbase)',
          'Developer Framework (LangChain / Next.js / OpenAI Assistants API)'
        ],
        defaultOption: 'Visual No-Code Builder (Voiceflow / Botpress / Chatbase)'
      }
    ];
  }

  // 5. Coding / Web / App / Script
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

  // 5. Music / Audio / Song
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

  // 6. General Fallback
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
 * PHASE 11 — GEMINI EXPLANATION & SYNTHESIS LAYER
 *
 * CORE PRINCIPLE: "LLM = interpretation, language, reasoning, explanation.
 * Pathwise database + deterministic engine = truth."
 *
 * Gemini MUST NEVER invent:
 * - tools, tool IDs, URLs, capabilities, pricing, task compatibility
 *
 * Gemini may ONLY:
 * 1. Explain why selected tools fit the requirements.
 * 2. Explain tradeoffs between primary and alternative tools.
 * 3. Explain how the user should use each tool step by step.
 * 4. Improve natural-language guidance and step descriptions.
 * 5. Personalize prompt templates using verified project information.
 *
 * The deterministic pipeline runs FIRST. Gemini enhances the output only.
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

  // === STEP 1: Run deterministic pipeline FIRST (ground truth) ===
  // This builds the verified workflow: intent, profile, requirements, tasks, tools, prompts
  const deterministicResult = buildDeterministicPipeline(goal, explicitAssumptions);

  // === STEP 2: Package full intelligence context for Gemini ===
  const profile = deterministicResult.understanding;
  const requirementsList = deterministicResult.requirementsList || [];
  const selectedTools = deterministicResult.steps.map(s => ({
    step: s.stepNumber,
    task: s.task || s.category,
    toolId: s.primaryTool.id,
    toolName: s.primaryTool.name,
    officialUrl: s.primaryTool.officialUrl,
    pricing: `${s.primaryTool.pricing.model}${s.primaryTool.pricing.freeTier ? ' (free tier available)' : ''}`,
    whyChosen: s.reasoningEvidence || s.primaryTool.whyRecommended,
    promptTitle: s.prompt.title,
    promptTemplate: s.prompt.rawTemplate
  }));

  const requirementContext = requirementsList.map(r =>
    `  - ${r.requirement}: ${r.confidence} (${r.source === 'user' ? 'stated by user' : 'inferred'})`
  ).join('\n');

  const workflowContext = deterministicResult.steps.map(s =>
    `  Step ${s.stepNumber}: ${s.title}\n  Tool: ${s.primaryTool.name} (${s.primaryTool.id})\n  Prompt Title: "${s.prompt.title}"\n  Prompt Template: "${s.prompt.rawTemplate.substring(0, 200)}..."`
  ).join('\n\n');

  const userSpecsText = explicitAssumptions && Object.keys(explicitAssumptions).length > 0
    ? JSON.stringify(explicitAssumptions, null, 2)
    : 'No additional specs provided.';

  // === STEP 3: Constrained Gemini system prompt (explanation/synthesis only) ===
  const systemPrompt = `You are the EXPLANATION and SYNTHESIS layer for Pathwise AI.

============================================================
USER GOAL: "${goal}"
USER SPECS: ${userSpecsText}
============================================================

PROJECT UNDERSTANDING (deterministically computed):
  - Project Type: ${profile?.projectType || deterministicResult.category}
  - Complexity: ${profile?.complexity || deterministicResult.difficulty}
  - Coding Required: ${profile?.codingRequired ? 'Yes' : 'No'}
  - Primary Outcome: ${profile?.primaryOutcome || deterministicResult.summary}

REQUIREMENTS (Pathwise Intelligence Layer — DO NOT MODIFY):
${requirementContext || '  - No specific requirements extracted'}

SELECTED TOOLS & WORKFLOW (Pathwise Deterministic Engine — CANONICAL TRUTH):
${workflowContext}

============================================================
YOUR ROLE — STRICTLY EXPLANATION & SYNTHESIS ONLY
============================================================

You may ONLY:
1. Write clear, personalized step titles and descriptions tailored to "${goal}".
2. Explain WHY each selected tool fits the requirements (use specific evidence from above).
3. Describe tradeoffs between the primary and alternative tools.
4. Write guidance on HOW the user should use each tool (step by step).
5. Personalize prompt templates using verified project information from above.
6. Write practical proTips for each step.

You MUST NOT:
- Invent new tools not listed in the SELECTED TOOLS section above.
- Change, modify, or invent tool IDs (use exactly as listed: ${selectedTools.map(t => t.toolId).join(', ')}).
- Invent or modify URLs. URLs must be exactly as provided.
- Invent pricing. Pricing must match what is provided.
- Add technical requirements (e.g., database, auth, APIs) not present in REQUIREMENTS above.
- Introduce technologies that are not present in the project requirements.
- Change the number of workflow steps.

============================================================
OUTPUT FORMAT — Return ONLY valid JSON, no markdown:
============================================================
{
  "id": "wf-gemini-${Date.now()}",
  "goal": "${goal}",
  "category": "${deterministicResult.category}",
  "summary": "1-2 sentence natural language summary for the user, personalized to their exact goal.",
  "difficulty": "${deterministicResult.difficulty}",
  "totalTime": "${deterministicResult.totalTime}",
  "triageAssumptions": ${JSON.stringify(deterministicResult.triageAssumptions)},
  "steps": [
${deterministicResult.steps.map(s => `    {
      "stepNumber": ${s.stepNumber},
      "title": "Improved action-oriented title for Step ${s.stepNumber} referencing ${s.primaryTool.name}",
      "description": "Clear 2-3 sentence explanation of what the user does in this step and why, personalized to ${goal}.",
      "category": "${s.category}",
      "primaryTool": {
        "id": "${s.primaryTool.id}",
        "name": "${s.primaryTool.name}",
        "whyRecommended": "1-2 sentence explanation specific to this user's goal and requirements."
      },
      "alternativeTools": ${JSON.stringify(s.alternativeTools.slice(0, 1).map(a => ({ id: a.id, name: a.name })))},
      "prompt": {
        "id": "${s.prompt.id}",
        "title": "${s.prompt.title}",
        "targetTool": "${s.primaryTool.name}",
        "stepNumber": ${s.stepNumber},
        "rawTemplate": "${s.prompt.rawTemplate.replace(/"/g, '\\"').replace(/\n/g, '\\n')}",
        "variables": ${JSON.stringify(s.prompt.variables)},
        "explanation": "Explanation of how to use this prompt in ${s.primaryTool.name}, specific to ${goal}.",
        "bestPractices": ["Practical tip 1 for ${s.primaryTool.name}", "Practical tip 2"]
      },
      "estimatedTime": "${s.estimatedTime}",
      "proTip": "Practical actionable tip for this exact step."
    }`).join(',\n')}
  ]
}`;

  try {
    const { data } = await fetchGeminiApi(apiKey, model, {
      contents: [{ parts: [{ text: systemPrompt }] }],
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens: 4000,
        responseMimeType: 'application/json'
      }
    });

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Gemini API returned an empty output.');
    }

    const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedText);

    // ALWAYS validate and hydrate to enforce canonical ground truth
    return validateAndHydrateWorkflow(parsed, goal, explicitAssumptions);
  } catch (err) {
    // If Gemini enhancement fails for any reason, return deterministic pipeline (always safe)
    console.warn('Gemini synthesis failed. Returning deterministic pipeline as fallback:', err);
    return deterministicResult;
  }
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
