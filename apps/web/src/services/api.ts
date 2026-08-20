import { WorkflowResult } from '../types';
import { generateWorkflowFromGoal } from '../data/knowledgeData';
import { getGeminiApiKey, generateWorkflowWithGemini, generateQuestionnaireWithGemini, QuestionnaireItem, getFallbackQuestionnaire } from './geminiService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export async function fetchQuestionnaireFromAPI(goal: string): Promise<QuestionnaireItem[]> {
  // If user configured Gemini API key, use direct live AI generation
  if (getGeminiApiKey()) {
    try {
      const liveQuestions = await generateQuestionnaireWithGemini(goal);
      if (liveQuestions && liveQuestions.length > 0) {
        return liveQuestions;
      }
    } catch (err) {
      console.warn('Error fetching live questionnaire from Gemini API:', err);
    }
  }

  return getFallbackQuestionnaire(goal);
}

export async function fetchWorkflowFromAPI(
  goal: string,
  assumptions?: Record<string, string>
): Promise<WorkflowResult> {
  // 1. Direct client-side Gemini API call (fastest, direct AI generation with user API key)
  if (getGeminiApiKey()) {
    try {
      return await generateWorkflowWithGemini(goal, assumptions);
    } catch (geminiErr) {
      console.warn('Direct Gemini API request failed. Trying backend service:', geminiErr);
    }
  }

  // 2. Attempt FastAPI backend if client API call had an issue or no client key
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout for AI generation

    const response = await fetch(`${API_BASE_URL}/workflows/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        goal,
        assumptions,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return data as WorkflowResult;
    }
  } catch (error) {
    // FastAPI backend is offline or unreachable - continuing to fallback
  }

  // 3. Smart domain engine fallback
  return generateWorkflowFromGoal(goal, assumptions);
}
