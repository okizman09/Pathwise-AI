export type PricingModel = 'Free' | 'Freemium' | 'Paid';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Tool {
  id: string;
  name: string;
  category: 'Website' | 'Video' | 'Audio' | 'Content' | 'Design' | 'Coding' | 'General';
  description: string;
  pricingModel: PricingModel;
  pricingDetails: string;
  skillLevel: SkillLevel;
  websiteUrl: string;
  affiliateUrl?: string;
  whyRecommended: string;
  rating: number; // e.g. 4.8
  logoText: string;
  badge?: string;
  keyFeatures: string[];
}

export interface PromptVariable {
  key: string;
  label: string;
  defaultValue: string;
  placeholder: string;
  options?: string[];
}

export interface PromptTemplate {
  id: string;
  title: string;
  targetTool: string; // Tool name (e.g. ChatGPT, Midjourney, Claude)
  stepNumber: number;
  rawTemplate: string; // Text containing {variable_key}
  variables: PromptVariable[];
  explanation: string; // Why this prompt is structured this way
  bestPractices: string[];
}

export interface WorkflowStep {
  stepNumber: number;
  title: string;
  description: string;
  category: string;
  primaryTool: Tool;
  alternativeTools: Tool[];
  prompt: PromptTemplate;
  estimatedTime: string;
  proTip: string;
}

export interface ClarificationAssumption {
  id: string;
  category: string;
  label: string;
  currentValue: string;
  options: string[];
}

export interface WorkflowResult {
  id: string;
  goal: string;
  category: string;
  summary: string;
  difficulty: SkillLevel;
  totalTime: string;
  triageAssumptions: ClarificationAssumption[];
  steps: WorkflowStep[];
}

export interface SavedWorkflow {
  id: string;
  goal: string;
  category: string;
  createdAt: string;
  stepCount: number;
  toolsUsed: string[];
  workflow: WorkflowResult;
}
