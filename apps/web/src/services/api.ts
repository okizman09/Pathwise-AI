import { WorkflowResult } from '../types';
import { generateWorkflowFromGoal } from '../data/knowledgeData';
import { getGeminiApiKey, generateWorkflowWithGemini, generateQuestionnaireWithGemini, QuestionnaireItem, getFallbackQuestionnaire } from './geminiService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export async function fetchQuestionnaireFromAPI(goal: string): Promise<QuestionnaireItem[]> {
  try {
    return await generateQuestionnaireWithGemini(goal);
  } catch (err) {
    console.warn('Error fetching questionnaire from Gemini API:', err);
    return getFallbackQuestionnaire(goal);
  }
}

export async function fetchWorkflowFromAPI(
  goal: string,
  assumptions?: Record<string, string>
): Promise<WorkflowResult> {
  // 1. Attempt FastAPI backend first if available
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

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
    // FastAPI backend is offline or unreachable - continuing to client fallback
  }

  // 2. Direct client-side Gemini API call if API Key is configured
  if (getGeminiApiKey()) {
    try {
      return await generateWorkflowWithGemini(goal, assumptions);
    } catch (geminiErr) {
      console.warn('Direct Gemini API request failed. Falling back to local smart engine:', geminiErr);
    }
  }

  // 3. Graceful fallback to client-side smart workflow generator
  return generateWorkflowFromGoal(goal, assumptions);
}
