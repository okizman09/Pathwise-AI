import { Tool, WorkflowResult, SavedWorkflow } from '../types';
import { VERIFIED_TOOLS_DATABASE } from './toolsDatabase';
import { buildDeterministicPipeline } from '../services/recommendationEngine';

export const CURATED_TOOLS: Tool[] = VERIFIED_TOOLS_DATABASE;

export const INITIAL_SAVED_WORKFLOWS: SavedWorkflow[] = [
  {
    id: 'saved-1',
    goal: 'Build a Trading EA (Expert Advisor) for MetaTrader',
    category: 'Algorithmic Trading & Coding',
    createdAt: '1 hour ago',
    stepCount: 3,
    toolsUsed: ['DeepSeek R1', 'ChatGPT (GPT-4o)', 'MetaTrader 5'],
    workflow: buildDeterministicPipeline('Build a Trading EA (Expert Advisor) for MetaTrader', {
      platform: 'MetaTrader 5 (MQL5)',
      strategy: 'Indicator Crossover (EMA + RSI)'
    })
  },
  {
    id: 'saved-2',
    goal: 'Build an AI Customer Support Chatbot for E-Commerce',
    category: 'Chatbots & Agents',
    createdAt: '2 hours ago',
    stepCount: 3,
    toolsUsed: ['Voiceflow', 'Chatbase', 'Framer AI'],
    workflow: buildDeterministicPipeline('Build an AI Customer Support Chatbot for E-Commerce', {
      primary_use_case: 'Customer Support & FAQ Answering',
      deployment_platform: 'Embeddable Website Popup Widget'
    })
  }
];

export function generateWorkflowFromGoal(userGoal: string, explicitAssumptions?: Record<string, string>): WorkflowResult {
  return buildDeterministicPipeline(userGoal, explicitAssumptions);
}
