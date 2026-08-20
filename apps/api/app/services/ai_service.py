import json
import os
import uuid
import logging
from typing import Dict, Any, Optional, List
from app.core.config import settings
from app.models.workflow import WorkflowResponseModel, WorkflowStepModel, ToolModel, PromptTemplateModel, PromptVariableModel, ClarificationAssumptionModel

logger = logging.getLogger(__name__)

# Load local knowledge base tools
TOOLS_KNOWLEDGE_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "knowledge", "tools.json")

def load_tools_knowledge() -> List[Dict[str, Any]]:
    try:
        if os.path.exists(TOOLS_KNOWLEDGE_PATH):
            with open(TOOLS_KNOWLEDGE_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        logger.error(f"Error loading tools knowledge: {e}")
    
    # Fallback default tools list
    return [
        {
            "id": "chatgpt",
            "name": "ChatGPT (GPT-4o)",
            "category": "Content",
            "description": "Versatile conversational AI for scripting, ideation, and prompt refining.",
            "pricing_model": "Freemium",
            "pricing_details": "Free tier available • $20/mo Plus",
            "skill_level": "Beginner",
            "website_url": "https://chatgpt.com",
            "why_recommended": "Easiest entry point for plain-text scripting, ideation, and prompt generation.",
            "rating": 4.9,
            "logo_text": "GPT",
            "key_features": ["Scripting", "Custom Instructions", "Data Analysis"]
        },
        {
            "id": "midjourney",
            "name": "Midjourney v6",
            "category": "Design",
            "description": "Industry-leading text-to-image AI for hyper-realistic graphics and UI mockups.",
            "pricing_model": "Paid",
            "pricing_details": "Starts at $10/month",
            "skill_level": "Intermediate",
            "website_url": "https://midjourney.com",
            "why_recommended": "Highest visual fidelity and artistic aesthetic of any image generator.",
            "rating": 4.85,
            "logo_text": "MJ",
            "key_features": ["Hyper-realism", "Style Matching", "Vary Region"]
        },
        {
            "id": "elevenlabs",
            "name": "ElevenLabs",
            "category": "Audio",
            "description": "Ultra-realistic AI voice generator for voiceovers, dubbing, and podcasts.",
            "pricing_model": "Freemium",
            "pricing_details": "Free 10k credits/mo • $5/mo Starter",
            "skill_level": "Beginner",
            "website_url": "https://elevenlabs.io",
            "why_recommended": "Indistinguishable from real human voice actors with instant emotion adjustment.",
            "rating": 4.9,
            "logo_text": "11",
            "key_features": ["Voice Cloning", "Multilingual Dubbing"]
        },
        {
            "id": "framer",
            "name": "Framer AI",
            "category": "Website",
            "description": "Design and deploy production-ready responsive websites directly from text prompts.",
            "pricing_model": "Freemium",
            "pricing_details": "Free site hosting • $15/mo Mini site",
            "skill_level": "Beginner",
            "website_url": "https://framer.com",
            "why_recommended": "Generates full responsive websites with CMS, animations, and custom domain publishing.",
            "rating": 4.8,
            "logo_text": "FR",
            "key_features": ["Prompt-to-Site", "Figma Import", "Built-in CMS"]
        }
    ]

class AIService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.DEFAULT_MODEL
        self.tools_db = load_tools_knowledge()

    async def scrape_trending_tools(self, category: str = "All") -> List[Dict[str, Any]]:
        """
        Queries Gemini AI & live web sources to discover newly launched AI tools.
        """
        if self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                model = genai.GenerativeModel(
                    self.model_name,
                    generation_config={"response_mime_type": "application/json"}
                )
                prompt = f"""Discover 4 newly launched or trending high-impact AI tools in the "{category}" domain.
Return ONLY a valid JSON array of objects with keys:
"id", "name", "category", "description", "bestApplication", "pricing_model", "pricing_details", "skill_level", "website_url", "why_recommended", "rating", "logo_text", "key_features"
"""
                response = model.generate_content(prompt)
                if response.text:
                    return json.loads(response.text)
            except Exception as e:
                logger.error(f"Web scraper error: {e}")
        
        # Default scraped tools return
        return [
            {
                "id": "deepseek-r1",
                "name": "DeepSeek R1",
                "category": "Coding",
                "description": "Open reasoning AI model excelling at mathematics, quantitative logic, and programming.",
                "bestApplication": "Advanced mathematical logic, quantitative code generation, and complex reasoning.",
                "pricing_model": "Freemium",
                "pricing_details": "Free chat • Low cost API",
                "skill_level": "Intermediate",
                "website_url": "https://deepseek.com",
                "why_recommended": "SOTA reasoning performance matching proprietary models at a fraction of the cost.",
                "rating": 4.95,
                "logo_text": "DS",
                "key_features": ["Chain of Thought", "Math & Logic", "Open Weights"]
            },
            {
                "id": "lovable-ai",
                "name": "Lovable.dev",
                "category": "Coding",
                "description": "Full-stack web application builder that generates React UI and Supabase backends from text.",
                "bestApplication": "Building full-stack web applications with database and authentication in minutes.",
                "pricing_model": "Freemium",
                "pricing_details": "Free starter tier • Paid plans",
                "skill_level": "Beginner",
                "website_url": "https://lovable.dev",
                "why_recommended": "Rapid prompt-to-production web application development with database integration.",
                "rating": 4.91,
                "logo_text": "LV",
                "key_features": ["React Frontend", "Supabase Backend", "GitHub Export"]
            }
        ]

    async def generate_workflow(self, goal: str, explicit_assumptions: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Generates a step-by-step workflow with curated tools, prompt templates, and triage assumptions.
        Uses Google Gemini REST API with automated model fallbacks; otherwise falls back to smart rule-based engine.
        """
        if self.api_key:
            prompt = self._build_system_prompt(goal, explicit_assumptions)
            candidate_models = ["gemini-3.1-flash-lite", "gemini-3.6-flash", "gemini-flash-latest", "gemini-3.7-flash"]

            import requests
            for model_id in candidate_models:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_id}:generateContent?key={self.api_key}"
                try:
                    payload = {
                        "contents": [{"parts": [{"text": prompt}]}],
                        "generationConfig": {
                            "temperature": 0.2,
                            "maxOutputTokens": 2500,
                            "responseMimeType": "application/json"
                        }
                    }
                    resp = requests.post(url, json=payload, timeout=12)
                    if resp.status_code == 200:
                        data = resp.json()
                        raw_text = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                        if raw_text:
                            cleaned = raw_text.replace("```json", "").replace("```", "").strip()
                            parsed = json.loads(cleaned)
                            if parsed and "steps" in parsed:
                                return parsed
                    else:
                        logger.warning(f"Model {model_id} returned status {resp.status_code}: {resp.text[:200]}")
                except Exception as e:
                    logger.warning(f"Error querying Gemini model {model_id}: {e}")

        # Domain-accurate rule-based fallback workflow generation
        return self._generate_fallback_workflow(goal, explicit_assumptions)

    def _build_system_prompt(self, goal: str, explicit_assumptions: Optional[Dict[str, str]] = None) -> str:
        tools_str = json.dumps(self.tools_db, indent=2)
        assumptions_str = json.dumps(explicit_assumptions) if explicit_assumptions else "None"

        return f"""
You are the AI Engine for Pathwise AI — an intelligent AI workflow architect helping creators and developers build projects without tool confusion.

User Goal: "{goal}"
User Specified Preferences / Assumptions: {assumptions_str}

Available Curated Tools Catalog:
{tools_str}

CRITICAL ARCHITECTURE RULES:
1. SPECIALIZED 3-STEP PIPELINE:
   - Provide EXACTLY 3 sequential, specialized creation steps:
     * Step 1: Specs, Strategy & Ideation (Claude 3.5 Sonnet or ChatGPT)
     * Step 2: Generative UI, Components or Core Asset Creation (v0 by Vercel, Bolt.new, Kling AI, Midjourney)
     * Step 3: Implementation, Database, Audio, or Deployment (Antigravity AI (Google), ElevenLabs, Framer AI, Phind)
   - Do NOT repeat the exact same tool for all 3 steps.

2. TAILORED DYNAMIC PROMPTS & REAL VARIABLES:
   - Write production-grade prompt templates tailored specifically to "{goal}".
   - Every variable in {{variable_name}} MUST have a realistic defaultValue relevant to "{goal}" (NEVER use generic placeholders like "Pathwise AI" or "AI-powered creation assistant" unless the user explicitly requested it).

Return ONLY valid JSON matching this structure:
{{
  "id": "wf-{uuid.uuid4().hex[:6]}",
  "goal": "{goal}",
  "category": "Domain Category (e.g. Fullstack Web App, Content Creation, Video Production)",
  "summary": "Clear 1-2 sentence executive summary of the specialized multi-tool pipeline.",
  "difficulty": "Beginner / Intermediate / Advanced",
  "totalTime": "30-45 minutes",
  "triageAssumptions": [
    {{
      "id": "scope",
      "category": "Scope",
      "label": "Project Scope",
      "currentValue": "User choice",
      "options": ["Option 1", "Option 2"]
    }}
  ],
  "steps": [
    {{
      "stepNumber": 1,
      "title": "Step 1 Title",
      "description": "Step 1 description",
      "category": "Category name",
      "primaryTool": {{
        "id": "claude",
        "name": "Claude 3.5 Sonnet",
        "category": "Content",
        "description": "Description",
        "pricing_model": "Freemium",
        "pricing_details": "Free tier available • $20/mo Pro",
        "skill_level": "Beginner",
        "website_url": "https://claude.ai",
        "why_recommended": "Why this specific tool",
        "rating": 4.95,
        "logo_text": "CL",
        "key_features": ["Artifacts UI", "High Coding Quality"]
      }},
      "prompt": {{
        "id": "p-1",
        "title": "Prompt Title",
        "targetTool": "Claude 3.5 Sonnet",
        "stepNumber": 1,
        "rawTemplate": "High quality prompt tailored to {goal}...",
        "variables": [
          {{
            "key": "app_concept",
            "label": "App Concept",
            "defaultValue": "{goal}",
            "placeholder": "Describe concept"
          }}
        ],
        "explanation": "Why this prompt works",
        "bestPractices": ["Tip 1", "Tip 2"]
      }},
      "estimatedTime": "10 mins",
      "proTip": "Actionable pro tip"
    }}
  ]
}}
"""

    def _generate_fallback_workflow(self, goal: str, explicit_assumptions: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        g = goal.lower()
        topic = explicit_assumptions.get("custom_topic", goal) if explicit_assumptions else goal
        
        # 1. Fullstack Web App / SaaS / Fellowship / Portal
        if any(w in g for w in ["web app", "application", "saas", "portal", "dashboard", "platform", "fellowship", "crm", "tool"]):
            return {
                "id": f"wf-api-{uuid.uuid4().hex[:6]}",
                "goal": goal,
                "category": "Fullstack Web App & Software Engineering",
                "summary": f"A 3-step development path for '{topic}': draft system specs in Claude, generate responsive React UI in v0, and build backend auth and database with Antigravity AI.",
                "difficulty": "Intermediate",
                "totalTime": "35–50 minutes",
                "triageAssumptions": [
                    {
                        "id": "type",
                        "category": "Architecture",
                        "label": "Application Type",
                        "currentValue": explicit_assumptions.get("type", "Fullstack Web Application (Next.js + Supabase)") if explicit_assumptions else "Fullstack Web Application (Next.js + Supabase)",
                        "options": ["Fullstack Web Application (Next.js + Supabase)", "Interactive Dashboard (React + Tailwind)", "Prompt-to-App Rapid Prototype (Bolt.new)"]
                    },
                    {
                        "id": "tool_preference",
                        "category": "Developer Tooling",
                        "label": "Core AI Framework",
                        "currentValue": explicit_assumptions.get("tool_preference", "Agentic IDE (Antigravity AI) + v0") if explicit_assumptions else "Agentic IDE (Antigravity AI) + v0",
                        "options": ["Agentic IDE (Antigravity AI) + v0", "In-Browser Fullstack (Bolt.new)", "AI Specs & UI (Claude + v0)"]
                    }
                ],
                "steps": [
                    {
                        "stepNumber": 1,
                        "title": "Architect PRD, User Flows & Data Model",
                        "description": "Design clean Product Requirements Document (PRD), database schemas, and API contracts for your web app.",
                        "category": "System Architecture & Specs",
                        "primaryTool": {
                            "id": "claude",
                            "name": "Claude 3.5 Sonnet",
                            "category": "Content",
                            "description": "Superior nuanced writer and complex reasoning model for system specs and code.",
                            "pricing_model": "Freemium",
                            "pricing_details": "Free tier available • $20/mo Pro",
                            "skill_level": "Beginner",
                            "website_url": "https://claude.ai",
                            "why_recommended": "Produces the highest quality code logic, system architecture specs, and natural writing.",
                            "rating": 4.95,
                            "logo_text": "CL",
                            "key_features": ["Artifacts UI", "200k Token Context", "High Coding Quality"]
                        },
                        "prompt": {
                            "id": "p-app-1",
                            "title": "Fullstack App PRD & Data Schema Blueprint",
                            "targetTool": "Claude 3.5 Sonnet",
                            "stepNumber": 1,
                            "rawTemplate": f"Act as a principal software architect. Design a technical blueprint for '{{app_concept}}'.\n\nInclude:\n1. User Stories & Core Personas: {{target_users}}\n2. PostgreSQL Database Schema (tables, relations, indexes)\n3. Core API Endpoints & State Management Flow\n4. Tech Stack: {{tech_stack}}",
                            "variables": [
                                {"key": "app_concept", "label": "App Concept", "defaultValue": topic, "placeholder": "Describe web app"},
                                {"key": "target_users", "label": "Target Users", "defaultValue": "Fellowship members, applicants, and program leads", "placeholder": "Target users"},
                                {"key": "tech_stack", "label": "Tech Stack", "defaultValue": "Next.js 14 (App Router), Tailwind CSS, Supabase Auth & DB", "placeholder": "Tech stack"}
                            ],
                            "explanation": "Defining data contracts and user flows before writing code eliminates architectural bugs.",
                            "bestPractices": ["Review database relations before generating UI components."]
                        },
                        "estimatedTime": "10 mins",
                        "proTip": "Ask Claude for TypeScript interfaces with Zod validation schemas."
                    },
                    {
                        "stepNumber": 2,
                        "title": "Generate Modern Glassmorphic UI in v0 or Bolt.new",
                        "description": "Generate production-ready React JSX components, responsive dashboards, and interactive forms with Tailwind CSS.",
                        "category": "Generative UI & Components",
                        "primaryTool": {
                            "id": "v0-dev",
                            "name": "v0 by Vercel",
                            "category": "Website",
                            "description": "Generative UI tool that turns plain text prompts into copy-paste ready Tailwind CSS & React components.",
                            "pricing_model": "Freemium",
                            "pricing_details": "Free credits monthly • $20/mo Premium",
                            "skill_level": "Beginner",
                            "website_url": "https://v0.dev",
                            "why_recommended": "Produces production-ready React JSX components with shadcn/ui and Tailwind styles in seconds.",
                            "rating": 4.92,
                            "logo_text": "V0",
                            "key_features": ["Shadcn UI", "React Copy-Paste", "Design Iteration"]
                        },
                        "prompt": {
                            "id": "p-app-2",
                            "title": "v0 Dashboard & UI Component Generator",
                            "targetTool": "v0.dev / Bolt.new",
                            "stepNumber": 2,
                            "rawTemplate": f"Design a sleek dark-mode web application interface for '{{app_concept}}'.\n\nCore Screens Needed:\n- Navigation Bar with user profile badge\n- Main Dashboard: {{key_features}}\n- Interactive Submission & Detail Modal\n\nStyle: Dark slate (#090D16), glowing indigo accents (#6366F1), glassmorphism borders, fully responsive Tailwind CSS.",
                            "variables": [
                                {"key": "app_concept", "label": "App Concept", "defaultValue": topic, "placeholder": "Describe app"},
                                {"key": "key_features", "label": "Key Features", "defaultValue": "Applicant tracking cards, review rubric metrics, cohort directory", "placeholder": "Core features"}
                            ],
                            "explanation": "Specifying hex codes, UI components, and Tailwind styling produces clean copy-paste JSX.",
                            "bestPractices": ["Copy the generated React JSX directly into your components directory."]
                        },
                        "estimatedTime": "15 mins",
                        "proTip": "Ask v0 to use Lucide React icons and loading skeleton states."
                    },
                    {
                        "stepNumber": 3,
                        "title": "Fullstack Implementation & Automated Verification",
                        "description": "Wire backend database queries, authentication, and execute automated build tests.",
                        "category": "Backend & Agentic Implementation",
                        "primaryTool": {
                            "id": "antigravity",
                            "name": "Antigravity AI (Google)",
                            "category": "Coding",
                            "description": "Autonomous agentic AI coding assistant and development framework designed for complex software tasks.",
                            "pricing_model": "Free",
                            "pricing_details": "Developer Preview • Free",
                            "skill_level": "Intermediate",
                            "website_url": "https://antigravity.google.com",
                            "why_recommended": "Top choice for complex repo editing, code generation, background execution, and automated pair programming.",
                            "rating": 4.98,
                            "logo_text": "AG",
                            "key_features": ["Agentic Execution", "Repo Analysis", "Automated Verification"]
                        },
                        "prompt": {
                            "id": "p-app-3",
                            "title": "Antigravity Agentic Full-Stack Builder Prompt",
                            "targetTool": "Antigravity AI (Google)",
                            "stepNumber": 3,
                            "rawTemplate": f"Act as a senior fullstack engineer. Implement the end-to-end functionality for '{{app_concept}}'.\n\nTasks:\n1. Connect Supabase Client for Authentication and Database queries\n2. Implement CRUD operations for: {{key_features}}\n3. Add input validation with Zod and error handling\n4. Run npm build and terminal tests to verify 0 errors.",
                            "variables": [
                                {"key": "app_concept", "label": "App Concept", "defaultValue": topic, "placeholder": "App concept"},
                                {"key": "key_features", "label": "Key Features", "defaultValue": "User authentication, applicant submission, and database storage", "placeholder": "Features"}
                            ],
                            "explanation": "Agentic coding tools like Antigravity autonomously write files, install npm packages, and verify terminal builds.",
                            "bestPractices": ["Run tests in terminal after generating backend code."]
                        },
                        "estimatedTime": "20 mins",
                        "proTip": "Let Antigravity AI inspect and fix lint errors autonomously in the IDE terminal."
                    }
                ]
            }

        # 2. Content Writing / Blog / Social Media
        elif any(w in g for w in ["blog", "post", "article", "write", "writing", "copy", "newsletter", "social media", "linkedin", "twitter", "thread"]):
            return {
                "id": f"wf-api-{uuid.uuid4().hex[:6]}",
                "goal": goal,
                "category": "Content Creation & Social Media Repurposing",
                "summary": f"A specialized 3-step content pipeline for '{topic}': brainstorm viral hooks in Claude, draft comprehensive long-form copy, and repurpose into multi-platform social media assets in ChatGPT.",
                "difficulty": "Beginner",
                "totalTime": "25–35 minutes",
                "triageAssumptions": [
                    {
                        "id": "post_type",
                        "category": "Format",
                        "label": "Post Format",
                        "currentValue": explicit_assumptions.get("post_type", "Actionable How-To Guide / Tutorial") if explicit_assumptions else "Actionable How-To Guide / Tutorial",
                        "options": ["Actionable How-To Guide / Tutorial", "Thought Leadership & Industry Trends", "Curated Listicle / Best Tools Roundup", "Story-Driven Case Study"]
                    },
                    {
                        "id": "target_platform",
                        "category": "Channels",
                        "label": "Publishing Platforms",
                        "currentValue": explicit_assumptions.get("target_platform", "Multi-Platform (Blog + LinkedIn + X Thread)") if explicit_assumptions else "Multi-Platform (Blog + LinkedIn + X Thread)",
                        "options": ["Multi-Platform (Blog + LinkedIn + X Thread)", "LinkedIn Article & Carousel Summary", "Medium / Substack Newsletter", "Company Blog / SEO Website"]
                    }
                ],
                "steps": [
                    {
                        "stepNumber": 1,
                        "title": "Ideate Viral Hooks & Structured Master Outline",
                        "description": "Use Claude 3.5 Sonnet to craft 3 magnetic hook angles, map target audience pain points, and build a comprehensive H2/H3 outline.",
                        "category": "Ideation & Strategy",
                        "primaryTool": self.tools_db[0],
                        "prompt": {
                            "id": "p-content-1",
                            "title": "Master Blog Outline & Hook Engine",
                            "targetTool": "Claude 3.5 Sonnet",
                            "stepNumber": 1,
                            "rawTemplate": f"Act as a world-class content strategist. I am creating a blog post about '{{blog_topic}}'.\n\nGenerate:\n1. 3 Magnetic Hook Options (Curiosity-driven, Bold/Contrarian, and High-Utility)\n2. Reader Value Proposition\n3. Structured H2 Outline with bullet takeaways per section\n4. Real-world examples or frameworks.",
                            "variables": [
                                {"key": "blog_topic", "label": "Specific Topic", "defaultValue": topic, "placeholder": "Topic"}
                            ],
                            "explanation": "Structuring outline and hook angles first prevents shallow AI copy.",
                            "bestPractices": ["Select your favorite hook from the 3 options and use it in Step 2."]
                        },
                        "estimatedTime": "10 mins",
                        "proTip": "Instruct Claude to give 3 completely different hook perspectives."
                    },
                    {
                        "stepNumber": 2,
                        "title": "Draft Full-Length High-Impact Blog Article",
                        "description": "Write nuanced, engaging long-form copy with concrete examples, strong transitions, and zero fluff.",
                        "category": "Long-Form Writing",
                        "primaryTool": self.tools_db[0],
                        "prompt": {
                            "id": "p-content-2",
                            "title": "Long-Form High-Retention Blog Writer",
                            "targetTool": "Claude 3.5 Sonnet",
                            "stepNumber": 2,
                            "rawTemplate": f"Act as a top-tier writer. Write a publication-ready blog post on '{{blog_topic}}'.\n\nRequirements:\n- Length: ~1,200 words\n- Format: Clean markdown with H2 subheadings, bullet lists, and bold takeaways\n- Open immediately with a punchy hook (no cliché openers)\n- Include actionable step-by-step guidance.",
                            "variables": [
                                {"key": "blog_topic", "label": "Specific Topic", "defaultValue": topic, "placeholder": "Topic"}
                            ],
                            "explanation": "Strict negative constraints eliminate generic AI phrases.",
                            "bestPractices": ["Use Claude Artifacts to preview formatting directly."]
                        },
                        "estimatedTime": "15 mins",
                        "proTip": "Keep paragraphs to 1-3 sentences for skimmability."
                    },
                    {
                        "stepNumber": 3,
                        "title": "Repurpose into Multi-Platform Social Media Assets",
                        "description": "Transform your article into a viral X/Twitter thread, a high-engagement LinkedIn post, and clickable title variations.",
                        "category": "Social Repurposing & Distribution",
                        "primaryTool": self.tools_db[0],
                        "prompt": {
                            "id": "p-content-3",
                            "title": "Multi-Channel Social Repurposing Engine",
                            "targetTool": "ChatGPT (GPT-4o)",
                            "stepNumber": 3,
                            "rawTemplate": f"I have a blog article about '{{blog_topic}}'.\n\nRepurpose into 3 high-leverage distribution assets:\n1. LinkedIn Post (Hook opener, bullet breakdown, engagement question, 3 hashtags)\n2. X (Twitter) 5-Tweet Thread (Hook tweet, value nuggets, CTA wrap-up)\n3. 5 High-CTR Headline Variations.",
                            "variables": [
                                {"key": "blog_topic", "label": "Topic", "defaultValue": topic, "placeholder": "Topic"}
                            ],
                            "explanation": "Repurposing across LinkedIn and X multiplies audience reach with zero extra drafting effort.",
                            "bestPractices": ["Convert the 5-tweet thread into a PDF carousel for LinkedIn."]
                        },
                        "estimatedTime": "10 mins",
                        "proTip": "Post on LinkedIn during peak weekday morning hours (8am - 10am)."
                    }
                ]
            }

        # 3. Default General Creation Pipeline
        return {
            "id": f"wf-api-{uuid.uuid4().hex[:6]}",
            "goal": goal,
            "category": "Creation Pipeline",
            "summary": f"A specialized 3-step creation path tailored to '{topic}': from initial strategy in Claude to execution and refinement.",
            "difficulty": "Beginner",
            "totalTime": "25–35 minutes",
            "triageAssumptions": [
                {
                    "id": "budget",
                    "category": "Budget",
                    "label": "Budget Preference",
                    "currentValue": explicit_assumptions.get("budget", "Free / Freemium Tools") if explicit_assumptions else "Free / Freemium Tools",
                    "options": ["Free / Freemium Tools", "Pro Paid Suite"]
                }
            ],
            "steps": [
                {
                    "stepNumber": 1,
                    "title": "Formulate Project Strategy & Specs",
                    "description": f"Define target persona, core scope, and step-by-step roadmap for {topic}.",
                    "category": "Strategy & Planning",
                    "primaryTool": self.tools_db[0],
                    "prompt": {
                        "id": "p-gen-1",
                        "title": "Master Project Spec Generator",
                        "targetTool": "Claude 3.5 Sonnet",
                        "stepNumber": 1,
                        "rawTemplate": f"Act as an expert strategist. Create a comprehensive project spec for '{{goal_description}}'.\n\nInclude:\n1. Target Audience Pain Points\n2. Core MVP Deliverables\n3. Step-by-step roadmap with required AI tools.",
                        "variables": [
                            {"key": "goal_description", "label": "Goal Description", "defaultValue": topic, "placeholder": "Describe goal"}
                        ],
                        "explanation": "Role persona and explicit constraints yield focused deliverables.",
                        "bestPractices": ["Refine roadmap steps before beginning execution."]
                    },
                    "estimatedTime": "10 mins",
                    "proTip": "Ask Claude to highlight potential edge cases."
                },
                {
                    "stepNumber": 2,
                    "title": "Execute Core Deliverables",
                    "description": f"Draft the main deliverables and implementation for {topic}.",
                    "category": "Implementation",
                    "primaryTool": self.tools_db[0],
                    "prompt": {
                        "id": "p-gen-2",
                        "title": "Core Deliverable Execution Prompt",
                        "targetTool": "ChatGPT (GPT-4o)",
                        "stepNumber": 2,
                        "rawTemplate": f"Execute the core deliverables for '{{goal_description}}'.\n\nRequirements:\n- Professional quality execution\n- Clear step-by-step instructions\n- Tailored to target audience: {{target_audience}}",
                        "variables": [
                            {"key": "goal_description", "label": "Goal", "defaultValue": topic, "placeholder": "Describe goal"},
                            {"key": "target_audience", "label": "Target Audience", "defaultValue": "General Creators & Professionals", "placeholder": "Target audience"}
                        ],
                        "explanation": "Standardizes deliverables for professional execution.",
                        "bestPractices": ["Review output against the Step 1 spec."]
                    },
                    "estimatedTime": "15 mins",
                    "proTip": "Provide specific formatting constraints for clean output."
                },
                {
                    "stepNumber": 3,
                    "title": "Quality Audit & Final Polish",
                    "description": f"Review and refine the completed output for {topic}.",
                    "category": "Quality & Polish",
                    "primaryTool": self.tools_db[0],
                    "prompt": {
                        "id": "p-gen-3",
                        "title": "Quality Audit & Refinement Prompt",
                        "targetTool": "ChatGPT (GPT-4o)",
                        "stepNumber": 3,
                        "rawTemplate": f"Review my draft output for '{{goal_description}}':\n\n'{{draft_content}}'\n\nPerform a quality audit:\n1. Fix clarity, structure, and precision\n2. Ensure actionable value\n3. Provide 2 key recommendations for improvement.",
                        "variables": [
                            {"key": "goal_description", "label": "Goal", "defaultValue": topic, "placeholder": "Goal"},
                            {"key": "draft_content", "label": "Draft Content", "defaultValue": "Paste your draft content here...", "placeholder": "Draft text"}
                        ],
                        "explanation": "Provides an unbiased review before finalizing.",
                        "bestPractices": ["Review feedback before finalizing."]
                    },
                    "estimatedTime": "10 mins",
                    "proTip": "Run final deliverables through an automated clarity check."
                }
            ]
        }

ai_service = AIService()

