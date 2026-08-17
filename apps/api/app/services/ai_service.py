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

    async def generate_workflow(self, goal: str, explicit_assumptions: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """
        Generates a step-by-step workflow with curated tools, prompt templates, and triage assumptions.
        Uses Google Gemini API if API key is present; otherwise falls back to smart rule-based engine.
        """
        if self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)

                prompt = self._build_system_prompt(goal, explicit_assumptions)
                model = genai.GenerativeModel(
                    self.model_name,
                    generation_config={"response_mime_type": "application/json"}
                )

                response = model.generate_content(prompt)
                if response.text:
                    parsed_json = json.loads(response.text)
                    return parsed_json
            except Exception as e:
                logger.error(f"Gemini API generation error: {e}. Falling back to rule-based engine.")

        # Rule-based fallback workflow generation
        return self._generate_fallback_workflow(goal, explicit_assumptions)

    def _build_system_prompt(self, goal: str, explicit_assumptions: Optional[Dict[str, str]] = None) -> str:
        tools_str = json.dumps(self.tools_db, indent=2)
        assumptions_str = json.dumps(explicit_assumptions) if explicit_assumptions else "None"

        return f"""
You are the AI Engine for Pathwise AI — a platform helping beginners overcome AI tool confusion.

User Goal: "{goal}"
User Specified Preferences / Assumptions: {assumptions_str}

Available Tools Catalog:
{tools_str}

Tasks:
1. Infer 2 smart "Assume & Refine" clarification assumptions (e.g. Budget, Platform, Skill Level) so the user doesn't feel interrogated.
2. Break the goal down into 3-4 clear, sequential creation steps.
3. For each step:
   - Select the best primary tool from the catalog (or recommend a well-known tool).
   - Write a high-quality, copy-paste ready, editable prompt template containing variables inside curly braces like {{topic}}, {{tone}}, {{target_audience}}.
   - Provide an explanation of WHY the prompt was structured this way and 2 pro tips.

Return ONLY valid JSON matching this structure:
{{
  "id": "wf-12345",
  "goal": "{goal}",
  "category": "Website / Video / Music / Content / Design",
  "summary": "One sentence workflow executive summary",
  "difficulty": "Beginner / Intermediate / Advanced",
  "totalTime": "30-45 minutes",
  "triageAssumptions": [
    {{
      "id": "budget",
      "category": "Budget",
      "label": "Budget Level",
      "currentValue": "Free Tools Only",
      "options": ["Free Tools Only", "Pro Paid Tools"]
    }}
  ],
  "steps": [
    {{
      "stepNumber": 1,
      "title": "Step title",
      "description": "Step description",
      "category": "Category name",
      "primaryTool": {{
        "id": "chatgpt",
        "name": "ChatGPT (GPT-4o)",
        "category": "Content",
        "description": "Description",
        "pricing_model": "Freemium",
        "pricing_details": "Free tier available",
        "skill_level": "Beginner",
        "website_url": "https://chatgpt.com",
        "why_recommended": "Why chosen for step",
        "rating": 4.9,
        "logo_text": "GPT",
        "key_features": ["Feature 1"]
      }},
      "prompt": {{
        "id": "p-1",
        "title": "Prompt Title",
        "targetTool": "ChatGPT",
        "stepNumber": 1,
        "rawTemplate": "Write a script about {{topic}} for {{target_audience}} in a {{tone}} tone.",
        "variables": [
          {{
            "key": "topic",
            "label": "Topic",
            "defaultValue": "Default topic string",
            "placeholder": "Enter topic"
          }}
        ],
        "explanation": "Why this prompt works",
        "bestPractices": ["Tip 1", "Tip 2"]
      }},
      "estimatedTime": "10 mins",
      "proTip": "Pro tip string"
    }}
  ]
}}
"""

    def _generate_fallback_workflow(self, goal: str, explicit_assumptions: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        goal_lower = goal.lower()
        
        # Simple intelligent classification
        if "web" in goal_lower or "site" in goal_lower or "landing" in goal_lower:
            cat = "Website"
            t1 = self.tools_db[0] # ChatGPT / Claude
            t2 = self.tools_db[3] if len(self.tools_db) > 3 else self.tools_db[0] # Framer
        elif "video" in goal_lower or "short" in goal_lower or "youtube" in goal_lower:
            cat = "Video"
            t1 = self.tools_db[0] # ChatGPT
            t2 = self.tools_db[2] if len(self.tools_db) > 2 else self.tools_db[0] # ElevenLabs
        else:
            cat = "General Content"
            t1 = self.tools_db[0]
            t2 = self.tools_db[1] if len(self.tools_db) > 1 else self.tools_db[0]

        return {
            "id": f"wf-api-{uuid.uuid4().hex[:6]}",
            "goal": goal,
            "category": cat,
            "summary": f"A streamlined multi-step AI creation path designed to complete '{goal}' without tool overwhelm.",
            "difficulty": "Beginner",
            "totalTime": "25–35 minutes",
            "triageAssumptions": [
                {
                    "id": "format",
                    "category": "Format",
                    "label": "Creation Target",
                    "currentValue": explicit_assumptions.get("format", "Standard MVP Scope") if explicit_assumptions else "Standard MVP Scope",
                    "options": ["Standard MVP Scope", "Advanced Enterprise", "Quick Prototype"]
                },
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
                    "title": "Define Creative Strategy & Outline",
                    "description": "Generate structured section outlines, messaging hierarchy, and content specs.",
                    "category": "Strategy & Ideation",
                    "primaryTool": t1,
                    "prompt": {
                        "id": "p-api-1",
                        "title": "Master Strategy & Outline Prompt",
                        "targetTool": t1["name"],
                        "stepNumber": 1,
                        "rawTemplate": f"Act as an expert creative strategist. I want to build {{project_goal}}.\n\nProvide:\n1. Core target audience pain points\n2. Key deliverables list\n3. 3-step action roadmap\n\nTone: {{tone}}",
                        "variables": [
                            {"key": "project_goal", "label": "Project Goal", "defaultValue": goal, "placeholder": "Project goal"},
                            {"key": "tone", "label": "Tone", "defaultValue": "Clear, concise, high impact", "placeholder": "Tone"}
                        ],
                        "explanation": "Giving the LLM an explicit persona ('expert creative strategist') ensures high precision output.",
                        "bestPractices": ["Refine tone parameters based on your target audience demographic."]
                    },
                    "estimatedTime": "10 mins",
                    "proTip": "Ask the model to format its output with markdown headers for easy copying."
                },
                {
                    "stepNumber": 2,
                    "title": "Generate Visual & Asset Collateral",
                    "description": "Produce modern, high-contrast visual artwork or UI elements.",
                    "category": "Asset Generation",
                    "primaryTool": t2,
                    "prompt": {
                        "id": "p-api-2",
                        "title": "High Fidelity Asset Prompt",
                        "targetTool": t2["name"],
                        "stepNumber": 2,
                        "rawTemplate": "Design a modern {concept_description}, glassmorphic aesthetic, dark slate background, vibrant neon gradient accents, 8k resolution studio lighting --ar 16:9",
                        "variables": [
                            {"key": "concept_description", "label": "Visual Concept", "defaultValue": goal, "placeholder": "Describe visual concept"}
                        ],
                        "explanation": "Specifying lighting and aspect ratio parameters prevents generic square images.",
                        "bestPractices": ["Maintain consistent color hex codes across all visual prompts."]
                    },
                    "estimatedTime": "15 mins",
                    "proTip": "Keep image aspect ratios aligned with your primary publishing platform."
                }
            ]
        }

ai_service = AIService()
