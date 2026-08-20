import { StageTaskDefinition, ToolCategory, ToolCapability, ToolTask, UserIntent } from '../types';

/**
 * PATHWISE TASK & CAPABILITY TAXONOMY
 * 
 * Maps high-level user objectives into 3 sequential canonical stage tasks
 * using strictly controlled ToolTask and ToolCapability vocabularies.
 */
export const DOMAIN_STAGE_TEMPLATES: Record<string, StageTaskDefinition[]> = {
  // 1. CHATBOTS, AI AGENTS & RAG ASSISTANTS
  chatbot: [
    {
      stageNumber: 1,
      stageName: 'Knowledge Base & RAG Architecture',
      taskTitle: 'Knowledge Base Ingestion & Prompt Persona Spec',
      taskDescription: 'Define chatbot conversation personas, system prompt boundaries, and ingest FAQ/document data schemas.',
      toolTask: 'create_business_website',
      requiredCapabilities: ['text_generation', 'research'],
      preferredCategory: 'Chatbots & Agents',
      defaultPromptTitle: 'Custom Chatbot System Prompt & FAQ Ingestion Blueprint',
      defaultPromptTemplate: `You are a specialized customer support assistant for {company_topic}.

Behavioral Guidelines:
1. Always maintain a {tone_style} tone.
2. Rely strictly on provided knowledge documents to answer user queries.
3. If an answer cannot be verified from the source data, reply: "I don't have verified records on that, but our team can assist you at {contact_channel}."
4. Format all answers in concise bullet points under 3 sentences.`,
      defaultVariables: [
        { key: 'company_topic', label: 'Company / Project Topic', defaultValue: 'our service platform', placeholder: 'Describe company or service' },
        { key: 'tone_style', label: 'Tone of Voice', defaultValue: 'warm, professional, and concise', placeholder: 'Tone' },
        { key: 'contact_channel', label: 'Escalation Channel', defaultValue: 'support@example.com', placeholder: 'Contact email' }
      ],
      defaultExplanation: 'Strict negative constraints and clear escalation rules eliminate chatbot hallucinations.',
      defaultProTip: 'Upload PDFs with clean markdown headers for optimal vector search chunking.'
    },
    {
      stageNumber: 2,
      stageName: 'Bot Logic & Visual Flow Design',
      taskTitle: 'Design Conversational Logic & Web Widget',
      taskDescription: 'Build the interactive dialogue tree, fallback recovery loops, and customize the website embed widget.',
      toolTask: 'create_business_website',
      requiredCapabilities: ['automation', 'workflow_automation', 'text_generation'],
      preferredCategory: 'Chatbots & Agents',
      defaultPromptTitle: 'Voiceflow / Chatbase Conversation Node Architecture',
      defaultPromptTemplate: `Design a 4-step conversation flow for {company_topic}:
1. Greeting & Intent Recognition (FAQ, Pricing, Booking, Escalation)
2. Semantic Search & Vector Document Retrieval
3. Information Confirmation & Lead Capture
4. Resolution or Live Agent Escalation Handover.`,
      defaultVariables: [
        { key: 'company_topic', label: 'Bot Context', defaultValue: 'our customer platform', placeholder: 'Context' }
      ],
      defaultExplanation: 'Visual flow nodes handle complex branching while LLMs handle natural phrasing.',
      defaultProTip: 'Always add a fallback intent node for out-of-scope customer queries.'
    },
    {
      stageNumber: 3,
      stageName: 'Deployment & Multi-Channel Integration',
      taskTitle: 'Embed Website Widget & Connect Messaging APIs',
      taskDescription: 'Embed the live chat widget into your website or connect WhatsApp/Slack messaging integrations.',
      toolTask: 'create_landing_page',
      requiredCapabilities: ['website_generation', 'ui_generation'],
      preferredCategory: 'Website',
      defaultPromptTitle: 'Website Chatbot Embed & API Integration Guide',
      defaultPromptTemplate: `1. Copy the embed JavaScript snippet from your builder dashboard.
2. Paste into the <head> or <body> tags of your website for {company_topic}.
3. Configure webhook triggers for live notification on urgent tickets.`,
      defaultVariables: [
        { key: 'company_topic', label: 'Website Target', defaultValue: 'our web app', placeholder: 'Target' }
      ],
      defaultExplanation: '1-click widget integration enables instant 24/7 customer resolution without backend servers.',
      defaultProTip: 'Test the widget on mobile browser viewports before announcing launch.'
    }
  ],

  // 2. FULLSTACK WEB APPS & SAAS
  webapp: [
    {
      stageNumber: 1,
      stageName: 'PRD & System Architecture Spec',
      taskTitle: 'Architect Data Models, API Contracts & User Stories',
      taskDescription: 'Draft structured Product Requirements Documents (PRD), Supabase PostgreSQL table schemas, and API contracts.',
      toolTask: 'create_web_application',
      requiredCapabilities: ['code_generation', 'text_generation', 'document_generation'],
      preferredCategory: 'Content',
      defaultPromptTitle: 'Fullstack App PRD & Data Schema Blueprint',
      defaultPromptTemplate: `Act as a principal software architect. Design the technical blueprint for "{app_concept}".

Target Users: {target_users}
Tech Stack: {tech_stack}

Deliverables:
1. Core User Personas & User Flow Journeys
2. PostgreSQL Database Schema (tables, foreign keys, indexes, Row-Level Security)
3. API Endpoints & State Management Strategy
4. MVP Scope vs Phase 2 Expansion.`,
      defaultVariables: [
        { key: 'app_concept', label: 'App Concept', defaultValue: 'Fullstack Web App', placeholder: 'App concept' },
        { key: 'target_users', label: 'Target Users', defaultValue: 'Registered users and team administrators', placeholder: 'Target users' },
        { key: 'tech_stack', label: 'Tech Stack', defaultValue: 'Next.js 14, Tailwind CSS, Supabase PostgreSQL & Auth', placeholder: 'Tech stack' }
      ],
      defaultExplanation: 'Establishing data contracts and strict schemas before writing code prevents refactoring cycles.',
      defaultProTip: 'Ask Claude for strict TypeScript interfaces and Zod validation models.'
    },
    {
      stageNumber: 2,
      stageName: 'Generative UI & Frontend Components',
      taskTitle: 'Generate Glassmorphic React Components in v0',
      taskDescription: 'Generate responsive React JSX components, clean dashboards, and interactive forms with Tailwind CSS.',
      toolTask: 'create_landing_page',
      requiredCapabilities: ['ui_generation', 'frontend_generation', 'code_generation'],
      preferredCategory: 'Website',
      defaultPromptTitle: 'v0 Dashboard & UI Component Generator',
      defaultPromptTemplate: `Design a sleek dark-mode web application interface for "{app_concept}".

Screens Needed:
- Navigation Bar with user profile avatar
- Main Dashboard with {key_features}
- Interactive Submission & Detail Modal

Style: Dark slate (#090D16), glowing indigo accents (#6366F1), subtle glassmorphism borders, fully responsive Tailwind CSS.`,
      defaultVariables: [
        { key: 'app_concept', label: 'App Concept', defaultValue: 'Fullstack Web App', placeholder: 'App concept' },
        { key: 'key_features', label: 'Core Features', defaultValue: 'Activity tracker, data metric cards, member directory', placeholder: 'Features' }
      ],
      defaultExplanation: 'Specifying exact component libraries and hex palettes gives generative UI engines precise boundaries.',
      defaultProTip: 'Copy the generated React JSX directly into your components folder.'
    },
    {
      stageNumber: 3,
      stageName: 'Backend Implementation & Agentic Testing',
      taskTitle: 'Implement Backend Queries, Auth & Run Tests',
      taskDescription: 'Use Antigravity AI or Bolt.new to connect database queries, authentication, and execute automated terminal tests.',
      toolTask: 'write_code',
      requiredCapabilities: ['coding', 'code_generation', 'code_execution', 'backend_generation'],
      preferredCategory: 'Coding',
      defaultPromptTitle: 'Antigravity Agentic Full-Stack Builder Prompt',
      defaultPromptTemplate: `Act as a senior fullstack engineer. Implement the end-to-end functionality for "{app_concept}".

Tasks:
1. Connect Supabase Client for Authentication and Database queries
2. Implement CRUD operations for core modules: {key_features}
3. Add input validation with Zod and error boundary handling
4. Run npm build and terminal tests to verify 0 errors.`,
      defaultVariables: [
        { key: 'app_concept', label: 'App Concept', defaultValue: 'Fullstack Web App', placeholder: 'App concept' },
        { key: 'key_features', label: 'Key Features', defaultValue: 'User authentication, applicant submission, and database storage', placeholder: 'Features' }
      ],
      defaultExplanation: 'Agentic coding assistants inspect repository files, install dependencies, and verify terminal builds.',
      defaultProTip: 'Ask Antigravity AI to run terminal tests and fix lint errors autonomously in IDE.'
    }
  ],

  // 3. CONTENT WRITING & SOCIAL REPURPOSING
  content: [
    {
      stageNumber: 1,
      stageName: 'Creative Strategy & Hook Ideation',
      taskTitle: 'Generate Viral Hooks & Structured Master Outline',
      taskDescription: 'Craft 3 magnetic hook angles, map reader pain points, and build a comprehensive H2 outline.',
      toolTask: 'write_article',
      requiredCapabilities: ['text_generation', 'text_editing'],
      preferredCategory: 'Content',
      defaultPromptTitle: 'Master Blog Outline & Hook Engine',
      defaultPromptTemplate: `Act as a world-class content strategist. I am creating high-impact content about "{topic}".

Generate:
1. 3 Magnetic Hook Options (Curiosity-driven, Bold/Contrarian, and High-Utility)
2. Reader Value Proposition & Core Takeaways
3. Structured H2 Outline with bullet takeaways per section
4. Real-world examples and data points.`,
      defaultVariables: [
        { key: 'topic', label: 'Topic / Subject', defaultValue: 'Content Topic', placeholder: 'Topic' }
      ],
      defaultExplanation: 'Structuring outline and hook angles first prevents shallow AI copy.',
      defaultProTip: 'Select your favorite hook from the 3 options and use it in Step 2.'
    },
    {
      stageNumber: 2,
      stageName: 'Long-Form Article Drafting',
      taskTitle: 'Draft Full-Length Publication-Ready Article',
      taskDescription: 'Write nuanced, engaging long-form copy with concrete examples, strong transitions, and zero fluff.',
      toolTask: 'write_article',
      requiredCapabilities: ['text_generation', 'document_generation'],
      preferredCategory: 'Content',
      defaultPromptTitle: 'Long-Form High-Retention Blog Writer',
      defaultPromptTemplate: `Act as a top-tier writer. Write a publication-ready article on "{topic}".

Requirements:
- Length: ~1,200 words
- Format: Clean markdown with H2 subheadings, bullet lists, and bold takeaways
- Open immediately with a punchy hook (no cliché openers)
- Include actionable step-by-step guidance.`,
      defaultVariables: [
        { key: 'topic', label: 'Topic / Subject', defaultValue: 'Content Topic', placeholder: 'Topic' }
      ],
      defaultExplanation: 'Strict negative constraints eliminate generic AI phrases.',
      defaultProTip: 'Keep paragraphs to 1-3 sentences for maximum skimmability.'
    },
    {
      stageNumber: 3,
      stageName: 'Multi-Channel Social Repurposing',
      taskTitle: 'Repurpose into LinkedIn Post & Twitter Thread',
      taskDescription: 'Transform your article into a viral X/Twitter thread, a high-engagement LinkedIn post, and clickable titles.',
      toolTask: 'create_social_media_content',
      requiredCapabilities: ['text_generation', 'text_editing'],
      preferredCategory: 'Content',
      defaultPromptTitle: 'Multi-Channel Social Repurposing Engine',
      defaultPromptTemplate: `I have an article about "{topic}".

Repurpose into 3 high-leverage distribution assets:
1. LinkedIn Post (Hook opener, bullet breakdown, engagement question, 3 hashtags)
2. X (Twitter) 5-Tweet Thread (Hook tweet, value nuggets, CTA wrap-up)
3. 5 High-CTR Headline Variations.`,
      defaultVariables: [
        { key: 'topic', label: 'Topic', defaultValue: 'Content Topic', placeholder: 'Topic' }
      ],
      defaultExplanation: 'Repurposing across LinkedIn and X multiplies reach with zero extra drafting effort.',
      defaultProTip: 'Post on LinkedIn during peak weekday morning hours (8am - 10am).'
    }
  ],

  // 4. VIDEO & YOUTUBE PRODUCTION
  video: [
    {
      stageNumber: 1,
      stageName: 'Scriptwriting & Visual Storyboarding',
      taskTitle: 'Write High-Hook Script & Scene-by-Scene Prompts',
      taskDescription: 'Write a viral video script with side-by-side narration and AI video generator b-roll prompts.',
      toolTask: 'create_youtube_short',
      requiredCapabilities: ['text_generation', 'text_editing'],
      preferredCategory: 'Content',
      defaultPromptTitle: 'Viral Video Script & Storyboard Prompt',
      defaultPromptTemplate: `Act as a viral video producer. Write a full script for a video titled "{video_title}".

Structure:
1. Hook (First 5 seconds): Attention-grabbing opening statement
2. Core Narrative (3 key plot points / facts)
3. Call to Action (Engaging conclusion)

Include a 2-column table with:
- Spoken Audio Transcript
- Visual B-Roll Prompt (optimized for AI video generators like Kling AI or Runway)`,
      defaultVariables: [
        { key: 'video_title', label: 'Video Title/Topic', defaultValue: 'Video Concept', placeholder: 'Video title' }
      ],
      defaultExplanation: 'Structuring visual prompts alongside narration text makes rendering video clips effortless.',
      defaultProTip: 'Hook viewers in the first 3 seconds with a curious question or bold claim.'
    },
    {
      stageNumber: 2,
      stageName: 'AI Video Generation & B-Roll',
      taskTitle: 'Render Cinematic 1080p Clips in Kling AI / Runway',
      taskDescription: 'Render high-resolution video clips for each storyboard scene using Kling AI or Runway Gen-3.',
      toolTask: 'create_youtube_video',
      requiredCapabilities: ['video_generation', 'image_generation'],
      preferredCategory: 'Video',
      defaultPromptTitle: 'Kling AI / Runway Cinematic B-Roll Prompt',
      defaultPromptTemplate: `Cinematic slow-motion shot of {scene_description}, 4k resolution, dramatic volumetric lighting, photorealistic detail, 60fps --motion 5`,
      defaultVariables: [
        { key: 'scene_description', label: 'Scene Concept', defaultValue: 'a futuristic glowing city skyline at dusk', placeholder: 'Scene concept' }
      ],
      defaultExplanation: 'Adding volumetric lighting and motion parameters yields studio-grade video clips.',
      defaultProTip: 'Keep individual clip lengths to 5-10 seconds for energetic pacing.'
    },
    {
      stageNumber: 3,
      stageName: 'Voiceover & Soundtrack Mixing',
      taskTitle: 'Generate Lifelike Voiceover & Background Music',
      taskDescription: 'Create lifelike voiceover narration using ElevenLabs and blend custom royalty-free background score using Udio.',
      toolTask: 'generate_voiceover',
      requiredCapabilities: ['voice_generation', 'audio_generation', 'music_generation'],
      preferredCategory: 'Audio',
      defaultPromptTitle: 'ElevenLabs Voiceover & Audio Score Prompt',
      defaultPromptTemplate: `Generate a captivating, warm storytelling voiceover for the script generated in Step 1.
For background audio: Create an ambient cinematic orchestral track with subtle synth pads using Udio.`,
      defaultVariables: [],
      defaultExplanation: 'Combining emotional voiceovers with custom AI background music elevates video production value.',
      defaultProTip: 'Keep background music volume 12dB lower than narration speech.'
    }
  ],

  // 5. ALGORITHMIC TRADING & AUTOMATION
  trading: [
    {
      stageNumber: 1,
      stageName: 'Strategy Architecture & Risk Rules',
      taskTitle: 'Define Indicator Rules & Position Sizing Model',
      taskDescription: 'Specify quantitative entry/exit signals, indicators, and risk management parameters.',
      toolTask: 'analyze_data',
      requiredCapabilities: ['data_analysis', 'research'],
      preferredCategory: 'Content',
      defaultPromptTitle: 'Quantitative Strategy Specification Prompt',
      defaultPromptTemplate: `Act as a senior quantitative trader. Design a quantitative strategy for {asset_class}:
- Indicators: {indicators}
- Timeframe: {timeframe}
- Entry/Exit Logic with exact mathematical thresholds
- Risk: {risk_rule} Max Drawdown constraint.`,
      defaultVariables: [
        { key: 'asset_class', label: 'Asset / Pair', defaultValue: 'EURUSD / Crypto', placeholder: 'Asset' },
        { key: 'indicators', label: 'Indicators', defaultValue: '50 EMA + 200 EMA + RSI (14)', placeholder: 'Indicators' },
        { key: 'timeframe', label: 'Timeframe', defaultValue: '15-Minute / 1-Hour', placeholder: 'Timeframe' },
        { key: 'risk_rule', label: 'Risk Rule', defaultValue: '1.5% risk per trade with 1:2 R:R', placeholder: 'Risk' }
      ],
      defaultExplanation: 'Specifying strict mathematical formulas eliminates discretionary ambiguity in trading bots.',
      defaultProTip: 'Always incorporate spread and slippage buffer calculations into your risk models.'
    },
    {
      stageNumber: 2,
      stageName: 'Code Generation & Expert Advisor Scripting',
      taskTitle: 'Generate Robust MQL5 / Python Trading Script',
      taskDescription: 'Use DeepSeek R1 or ChatGPT to write production-ready Expert Advisor code with error handling.',
      toolTask: 'write_code',
      requiredCapabilities: ['coding', 'code_generation', 'data_analysis'],
      preferredCategory: 'Coding',
      defaultPromptTitle: 'DeepSeek R1 / ChatGPT MQL5 Code Generator',
      defaultPromptTemplate: `Write a complete, bug-free MQL5 Expert Advisor for {asset_class}:
1. Strategy Logic: {indicators} on {timeframe}
2. Position Sizing: {risk_rule}
3. Include Stop Loss, Take Profit, and Slippage protection
4. Proper OnTick(), OnInit(), and OnDeinit() handlers.`,
      defaultVariables: [
        { key: 'asset_class', label: 'Asset', defaultValue: 'EURUSD', placeholder: 'Asset' },
        { key: 'indicators', label: 'Indicators', defaultValue: 'EMA Crossover + RSI filter', placeholder: 'Indicators' },
        { key: 'timeframe', label: 'Timeframe', defaultValue: 'H1', placeholder: 'Timeframe' },
        { key: 'risk_rule', label: 'Risk', defaultValue: '1.5% balance risk', placeholder: 'Risk' }
      ],
      defaultExplanation: 'DeepSeek R1 provides exceptional algorithmic reasoning for financial trading logic.',
      defaultProTip: 'Verify that MagicNumber and Slippage parameters are user-configurable inputs in code.'
    },
    {
      stageNumber: 3,
      stageName: 'Backtesting & Execution Automation',
      taskTitle: 'Run Multi-Year Tick Backtests & VPS Setup',
      taskDescription: 'Backtest across historical market conditions and deploy on a low-latency 24/7 VPS.',
      toolTask: 'debug_code',
      requiredCapabilities: ['code_execution', 'data_analysis', 'automation'],
      preferredCategory: 'Coding',
      defaultPromptTitle: 'Backtest Verification & VPS Deployment Checklist',
      defaultPromptTemplate: `1. Run MT5 Strategy Tester using 'Every tick based on real ticks' mode over 3+ years.
2. Verify Profit Factor > 1.5 and Maximum Drawdown < 15%.
3. Deploy compiled .ex5 file to Windows/Linux Forex VPS for 24/7 execution.`,
      defaultVariables: [],
      defaultExplanation: 'Testing across bull, bear, and consolidation regimes prevents curve-fitting.',
      defaultProTip: 'Always run forward testing on a demo account for 14 days before committing real capital.'
    }
  ],
  // 6. AUDIO & MUSIC PRODUCTION (e.g. Afrobeats, Songs, Vocals)
  audio: [
    {
      stageNumber: 1,
      stageName: 'Lyric Composition & Song Structure',
      taskTitle: 'Draft Rhythmic Lyrics, Verse-Chorus Map & Style Tags',
      taskDescription: 'Generate structured verses, hook choruses, and genre/mood tags (e.g. [Afrobeats, female vocals, soulful, log drums]).',
      toolTask: 'write_article',
      requiredCapabilities: ['text_generation', 'text_editing'],
      preferredCategory: 'Content',
      defaultPromptTitle: 'Afrobeats / Song Lyric & Structure Generator',
      defaultPromptTemplate: `Act as a professional songwriter and producer. Write full lyrics and arrangement tags for a song about "{song_topic}".

Genre & Mood: {genre_style}
Structure Needed:
- [Intro] Mood setup & instrumentation cue
- [Verse 1] Story progression & rhythm
- [Chorus] Catchy, infectious vocal hook
- [Verse 2] Deeper dynamic layer
- [Bridge] Key change / emotional peak
- [Outro] Smooth rhythmic fadeout`,
      defaultVariables: [
        { key: 'song_topic', label: 'Song Topic/Theme', defaultValue: 'Late night celebration and energy', placeholder: 'Song topic' },
        { key: 'genre_style', label: 'Genre & Style', defaultValue: 'Afrobeats, female vocals, warm log drums, upbeat tempo', placeholder: 'Genre' }
      ],
      defaultExplanation: 'Bracketed arrangement tags give AI music models direct guidance for beat drops and vocal shifts.',
      defaultProTip: 'Keep chorus lines short and repetitive for high listener retention.'
    },
    {
      stageNumber: 2,
      stageName: 'AI Music & Vocal Generation',
      taskTitle: 'Generate Studio Vocal Tracks in Udio / Suno',
      taskDescription: 'Use Udio AI or Suno to generate full stereo tracks with crisp female vocals, syncopated rhythms, and basslines.',
      toolTask: 'create_song',
      requiredCapabilities: ['music_generation', 'voice_generation', 'audio_generation'],
      preferredCategory: 'Audio',
      defaultPromptTitle: 'Udio / Suno Studio Audio Prompt',
      defaultPromptTemplate: `High-energy Afrobeats track with clear soulful female vocals, syncopated shakers, deep log drums, brass accents, radio-ready production quality.`,
      defaultVariables: [],
      defaultExplanation: 'Specifying distinct instrumentation cues yields authentic acoustic grooves.',
      defaultProTip: 'In Udio, extend 32-second sections sequentially for granular arrangement control.'
    },
    {
      stageNumber: 3,
      stageName: 'Audio Mastering & Voice Polish',
      taskTitle: 'Master Audio Stems & Polish Vocal Clarity',
      taskDescription: 'Use ElevenLabs or Descript for voice isolation, stem leveling, and master output loudness.',
      toolTask: 'generate_voiceover',
      requiredCapabilities: ['audio_generation', 'voice_generation'],
      preferredCategory: 'Audio',
      defaultPromptTitle: 'Audio Mastering & Stem Polish Guide',
      defaultPromptTemplate: `1. Export WAV audio stems from your music generator.
2. Apply studio sound enhancement and voice isolation.
3. Level master output to -14 LUFS for streaming distribution.`,
      defaultVariables: [],
      defaultExplanation: 'Stem leveling ensures vocals sit cleanly above heavy basslines.',
      defaultProTip: 'Export 24-bit uncompressed WAV files for maximum streaming clarity.'
    }
  ],

  // 7. NO-CODE WEBSITES (e.g. Fellowship / Business Sites without Coding)
  website: [
    {
      stageNumber: 1,
      stageName: 'Content Strategy & Information Architecture',
      taskTitle: 'Draft Fellowship Curriculum & Page Copy',
      taskDescription: 'Write high-conversion page copy, mission statement, curriculum outline, and FAQ section without code jargon.',
      toolTask: 'write_article',
      requiredCapabilities: ['text_generation', 'text_editing', 'document_generation'],
      preferredCategory: 'Content',
      defaultPromptTitle: 'Fellowship / Business Landing Copy Blueprint',
      defaultPromptTemplate: `Act as a top landing page copywriter. Write the complete website copy for "{site_topic}".

Target Audience: {target_audience}
Sections to Write:
1. Hero Header & Value Proposition
2. Fellowship Program Pillars & Curriculum
3. Mentors & Fellowship Benefits
4. Applicant Eligibility & Deadlines
5. Clear CTA: "Apply Now" / "Learn More"`,
      defaultVariables: [
        { key: 'site_topic', label: 'Website Purpose', defaultValue: 'Tech Fellowship for Emerging Creators', placeholder: 'Website purpose' },
        { key: 'target_audience', label: 'Target Audience', defaultValue: 'Aspiring developers and fellows', placeholder: 'Target audience' }
      ],
      defaultExplanation: 'Drafting structured copy upfront makes drag-and-drop website assembly 5x faster.',
      defaultProTip: 'Focus on clear transformation outcomes for participants in the hero section.'
    },
    {
      stageNumber: 2,
      stageName: 'No-Code Visual Design & Layout',
      taskTitle: 'Build Responsive Landing Layout in Framer',
      taskDescription: 'Use Framer AI to generate an interactive, responsive website with modern typography and animations.',
      toolTask: 'create_business_website',
      requiredCapabilities: ['website_generation', 'ui_generation', 'frontend_generation'],
      preferredCategory: 'Website',
      defaultPromptTitle: 'Framer AI Prompt-to-Site Generator',
      defaultPromptTemplate: `Create a clean, modern website for "{site_topic}". 
Style: Clean typography, deep slate navy background, energetic accents, responsive grid for program pillars, and interactive hover cards.`,
      defaultVariables: [
        { key: 'site_topic', label: 'Website Purpose', defaultValue: 'Tech Fellowship for Emerging Creators', placeholder: 'Website purpose' }
      ],
      defaultExplanation: 'Framer generates fully responsive visual websites with zero code required.',
      defaultProTip: 'Use Framer CMS collections if you have recurring mentor or fellow alumni profiles.'
    },
    {
      stageNumber: 3,
      stageName: 'Application Form & Custom Domain Publish',
      taskTitle: 'Connect Application Form & Publish Live Domain',
      taskDescription: 'Connect applicant intake forms, attach your custom domain, and publish live with free SSL.',
      toolTask: 'create_landing_page',
      requiredCapabilities: ['website_generation', 'automation'],
      preferredCategory: 'Website',
      defaultPromptTitle: 'Domain Publishing & Intake Form Guide',
      defaultPromptTemplate: `1. Add an interactive application submission form in Framer.
2. Link form responses to Google Sheets or email notifications.
3. Configure custom domain DNS records and publish 1-click live.`,
      defaultVariables: [],
      defaultExplanation: 'Embedded forms capture applicants directly without paying for external form plugins.',
      defaultProTip: 'Test form submissions with file uploads on mobile before sharing the link.'
    }
  ]
};

/**
 * Resolves the appropriate 3-stage task definitions for a given user intent.
 */
export function resolveStageTasks(intent: UserIntent): StageTaskDefinition[] {
  const g = ((intent.rawGoal || intent.goal) + ' ' + (intent.specificTopic || '')).toLowerCase();

  if (/\b(song|music|audio|track|beat|lofi|afrobeats|vocal)\b/i.test(g)) {
    return DOMAIN_STAGE_TEMPLATES.audio;
  }
  if (/\b(chatbot|bot|agent|assistant|chat|support|rag|faq bot)\b/i.test(g)) {
    return DOMAIN_STAGE_TEMPLATES.chatbot;
  }
  if (/\b(video|youtube|short|shorts|reel|tiktok|movie|film|animation)\b/i.test(g)) {
    return DOMAIN_STAGE_TEMPLATES.video;
  }
  if (/\b(trading|ea|expert advisor|forex|mql|mql4|mql5|pinescript|metatrader|crypto bot)\b/i.test(g)) {
    return DOMAIN_STAGE_TEMPLATES.trading;
  }
  if (/\b(fellowship|non-profit|portfolio|landing|business site|no code|no-code|free website)\b/i.test(g) && /\b(site|website|web|page)\b/i.test(g)) {
    return DOMAIN_STAGE_TEMPLATES.website;
  }
  if (/\b(web\s*app|application|saas|portal|dashboard|platform|crm|tracker|fastapi|backend|fullstack|python project|github)\b/i.test(g)) {
    return DOMAIN_STAGE_TEMPLATES.webapp;
  }
  if (/\b(blog|post|article|write|writing|copy|newsletter|social media|linkedin|twitter|thread|content|seo)\b/i.test(g)) {
    return DOMAIN_STAGE_TEMPLATES.content;
  }

  return DOMAIN_STAGE_TEMPLATES.webapp;
}
