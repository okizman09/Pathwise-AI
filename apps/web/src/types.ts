export type PricingModel = 'free' | 'freemium' | 'paid' | 'usage_based' | 'unknown';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export type ToolCategory =
  | 'Website'
  | 'Video'
  | 'Audio'
  | 'Content'
  | 'Design'
  | 'Coding'
  | 'Chatbots & Agents'
  | 'Trading & Automation'
  | 'Research & Data'
  | 'General';

export type ToolCapability =
  | 'text_generation'
  | 'text_editing'
  | 'research'
  | 'web_search'
  | 'coding'
  | 'code_generation'
  | 'code_execution'
  | 'frontend_generation'
  | 'backend_generation'
  | 'database_generation'
  | 'authentication'
  | 'website_generation'
  | 'ui_generation'
  | 'image_generation'
  | 'image_editing'
  | 'video_generation'
  | 'video_editing'
  | 'audio_generation'
  | 'music_generation'
  | 'voice_generation'
  | 'voice_cloning'
  | 'presentation_generation'
  | 'document_generation'
  | 'automation'
  | 'workflow_automation'
  | 'data_analysis'
  | 'ocr'
  | 'transcription';

export type ToolTask =
  | 'brand_strategy'
  | 'website_copywriting'
  | 'product_copywriting'
  | 'business_website'
  | 'portfolio_website'
  | 'landing_page'
  | 'ecommerce_website'
  | 'website_ui_design'
  | 'no_code_website_build'
  | 'frontend_generation'
  | 'backend_implementation'
  | 'authentication'
  | 'database_setup'
  | 'payment_integration'
  | 'domain_setup'
  | 'contact_form_setup'
  | 'deployment'
  | 'create_landing_page'
  | 'create_business_website'
  | 'create_portfolio'
  | 'create_web_application'
  | 'create_saas_application'
  | 'create_ecommerce_website'
  | 'create_mobile_app'
  | 'write_article'
  | 'create_social_media_content'
  | 'create_youtube_video'
  | 'create_youtube_short'
  | 'create_tiktok_video'
  | 'create_podcast'
  | 'generate_voiceover'
  | 'create_song'
  | 'create_beat'
  | 'create_logo'
  | 'create_flyer'
  | 'create_presentation'
  | 'analyze_data'
  | 'write_code'
  | 'debug_code';

export type RequirementConfidence =
  | 'explicit'
  | 'strong_inference'
  | 'weak_inference'
  | 'unknown';

export interface RequirementEvidence {
  requirement: string;
  confidence: RequirementConfidence;
  evidence: string[];
  source: 'user' | 'inference' | 'user_clarification';
}

export interface ToolCapabilityProfile {
  task: ToolTask;
  proficiency: number; // 0-100
  evidence: string[];
  limitations: string[];
  requiredSkill: 'beginner' | 'intermediate' | 'advanced' | 'any';
  codingLevel: 'none' | 'optional' | 'required';
  supportsFreeTier: boolean;
}

export interface ItemizedScoreBreakdown {
  taskSuitability: number;     // 0-35
  requirementCoverage: number; // 0-20
  constraintFit: number;       // 0-15
  skillFit: number;            // 0-10
  budgetFit: number;           // 0-15
  platformFit: number;         // 0-10
  continuity: number;          // 0-10 (capped)
  quality: number;             // 0-5
  easeOfUse: number;           // 0-5
}

export interface ToolTaskSuitability {
  task: ToolTask;
  toolId: string;
  suitabilityScore: number; // 0–100, normalized
  fitLevel: 'excellent' | 'good' | 'acceptable' | 'poor' | 'incompatible';
  reasons: string[];
  strengths: string[];
  limitations: string[];
  requiredSkillLevel: string;
  codingRequired: boolean;
  noCodeSupport: boolean;
  platformSupport: boolean;
  budgetCompatibility: boolean;
  continuityScore: number; // 0–10 (capped in V4)
  evidence: string[];
  itemizedScore?: ItemizedScoreBreakdown;
}

export interface AlternativeToolOption {
  tool: Tool;
  score: number;
  reason: string;
  tradeoff: string;
}

export interface ToolTaskFit {
  task: ToolTask;
  fitScore: number;
  compatible: boolean;
  reasons: string[];
  limitations: string[];
  hardConstraintsPassed: boolean;
  score?: number; // backwards compatibility
  evidence?: string[]; // backwards compatibility
}

export interface ToolRecommendationReason {
  summary: string;
  reasons: string[];
  matchedRequirements: string[];
  unmetRequirements: string[];
  limitations: string[];
  tradeoffs: string[];
  whyNotAlternatives?: Array<{
    toolId: string;
    reason: string;
  }>;
}

export interface ToolPromptTemplate {
  id: string;
  task: ToolTask;
  toolId: string;
  title: string;
  description?: string;
  template: string;
  variables: PromptVariable[];
  instructions?: string[];
  version?: string;
  explanation?: string;
  proTips?: string[];
}

export interface ToolVerificationMetadata {
  lastVerifiedAt: string;
  verificationSource: string;
  pricingVerified: boolean;
  capabilitiesVerified: boolean;
  supportedTasksVerified: boolean;
}

export interface ToolVerification {
  status: 'verified' | 'partially_verified' | 'unverified';
  lastVerifiedAt: string;
  sources: string[];
}

export interface ToolPricing {
  model: PricingModel;
  freeTier: boolean;
  startingPrice?: number;
  currency?: string;
  billingPeriod?: 'monthly' | 'yearly' | 'usage' | 'unknown';
  details?: string;
}

export interface ToolScores {
  taskFit?: number;
  easeOfUse?: number;
  outputQuality?: number;
  customization?: number;
  valueForMoney?: number;
}

export interface ToolRelationships {
  alternatives: string[];
  complements: string[];
  upstream?: string[];
  downstream?: string[];
}

export interface Tool {
  id: string;
  name: string;
  vendor: string;
  slug: string;
  description: string;
  officialUrl: string;
  logoUrl?: string;
  status: 'active' | 'deprecated' | 'unknown';

  verification: ToolVerification;
  pricing: ToolPricing;

  platforms: Array<
    | 'web'
    | 'windows'
    | 'macos'
    | 'linux'
    | 'ios'
    | 'android'
    | 'api'
  >;

  skillLevel: SkillLevel;

  capabilities: ToolCapability[];
  supportedTasks: ToolTask[];

  inputTypes: Array<
    | 'text'
    | 'image'
    | 'audio'
    | 'video'
    | 'file'
    | 'code'
    | 'url'
  >;

  outputTypes: Array<
    | 'text'
    | 'image'
    | 'audio'
    | 'video'
    | 'code'
    | 'website'
    | 'presentation'
    | 'data'
  >;

  strengths: string[];
  limitations: string[];
  bestFor: string[];
  notRecommendedFor: string[];
  integrations: string[];
  alternatives: string[]; // Tool IDs
  complements: string[]; // Tool IDs
  upstream?: string[];
  downstream?: string[];
  relationships?: ToolRelationships;

  scores: ToolScores;
  tags: string[];

  // Convenience & UI helper properties
  category?: ToolCategory;
  bestApplication?: string;
  pricingModel?: string;
  pricingDetails?: string;
  websiteUrl?: string;
  affiliateUrl?: string;
  whyRecommended?: string;
  rating?: number;
  logoText?: string;
  badge?: string;
  keyFeatures?: string[];
  verified?: boolean;
  starterPrompt?: string;
  isDiscovered?: boolean;
}

export interface PromptVariable {
  key: string;
  label: string;
  defaultValue: string;
  placeholder: string;
  options?: string[];
  /** Whether this variable is required to be filled before running the prompt */
  required?: boolean;
  /** Where this variable's value is sourced from */
  source?: 'project_profile' | 'requirement' | 'constraint' | 'user_input' | 'system';
}

export interface PromptTemplate {
  id: string;
  title: string;
  targetTool: string;
  stepNumber: number;
  rawTemplate: string;
  variables: PromptVariable[];
  explanation: string;
  bestPractices: string[];
}

export interface GeneratedPrompt {
  id: string;
  stepNumber: number;
  toolId: string;
  title: string;
  prompt: string;
  variables: PromptVariable[];
  explanation: string;
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
  matchScore?: number;
  reasoningEvidence?: string;
  task?: ToolTask;
  isCore?: boolean;
  /** Whether this step is an optional enhancement (not required for core outcome) */
  isOptional?: boolean;
  suitability?: ToolTaskFit;
  /** V3/V4: Full suitability object with fitLevel and itemized scores */
  taskSuitability?: ToolTaskSuitability;
  recommendationReason?: ToolRecommendationReason;
  /** V4: Rich structured alternative tool options with explicit tradeoffs */
  detailedAlternatives?: AlternativeToolOption[];
}

export interface ClarificationAssumption {
  id: string;
  category: string;
  label: string;
  currentValue: string;
  options: string[];
}

/**
 * Per-step recommendation record for the UI layer (Phase 13).
 */
export interface PathwiseStepRecommendation {
  stepNumber: number;
  toolId: string;
  toolName: string;
  officialUrl: string;
  score: number;
  confidence: number;
  whySelected: ToolRecommendationReason;
  alternatives: Array<{
    toolId: string;
    toolName: string;
    tradeoff: string;
  }>;
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
  isDeterministicVerified?: boolean;
  corePath?: WorkflowStep[];
  optionalEnhancements?: WorkflowStep[];
  understanding?: {
    goal: string;
    projectType: string;
    complexity: string;
    codingRequired: boolean;
    primaryOutcome?: string;
  };
  requirementsList?: RequirementEvidence[];
  /** Structured per-step recommendation objects for UI panels (Phase 13) */
  recommendations?: PathwiseStepRecommendation[];
  /** Top-level alternative paths for the entire workflow (Phase 13) */
  alternatives?: Array<{
    toolId: string;
    forToolId: string;
    stepNumber: number;
    tradeoff: string;
  }>;
  /** Validation warnings emitted by the pipeline validator (Phase 12) */
  validationWarnings?: string[];
  /** V4/V5: Full project profile for UI and validation */
  projectProfile?: ProjectProfile;
  /** V5: Intent Resolution state and clarification flags */
  intentResolution?: IntentResolution;
  clarificationRequired?: boolean;
  clarificationQuestions?: ClarificationQuestion[];
  /** V3/V4: Observability debug info */
  debugInfo?: {
    projectClassificationEvidence?: string[];
    requirementEvidence?: Array<{ requirement: string; confidence: string; evidence: string[] }>;
    rejectedCandidates?: Array<{ toolId: string; reason: string; step: number }>;
    selectedCandidateScores?: Array<{ toolId: string; score: number; step: number }>;
    hardConstraintFailures?: Array<{ toolId: string; constraint: string; step: number }>;
    continuityBonuses?: Array<{ toolId: string; bonus: number; step: number }>;
    promptResolution?: Array<{ step: number; task: string; toolId: string; promptId: string }>;
    validationRepairs?: string[];
  };
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

export interface Requirement {
  id: string;
  name: string;
  type: 'functional' | 'technical' | 'content' | 'design' | 'platform';
  required: boolean;
  confidence: number;
  source: 'explicit' | 'inferred' | 'user_clarification';
}

export interface Constraint {
  type: 'budget' | 'skill' | 'platform' | 'time' | 'technical' | 'no_code' | 'open_source';
  value: string;
  confidence: number;
  source: 'explicit' | 'inferred';
}

export interface Preference {
  id: string;
  name: string;
  value: string;
  source: 'explicit' | 'inferred';
}

export interface Ambiguity {
  field: string;
  question: string;
  impact: 'low' | 'medium' | 'high';
  options?: string[];
  defaultOption?: string;
}

export interface UserIntentBudget {
  type: 'free_only' | 'low' | 'moderate' | 'flexible' | 'unknown';
  amount?: number;
  currency?: string;
}

export type IntentResolutionStatus =
  | 'resolved'
  | 'partially_resolved'
  | 'ambiguous'
  | 'insufficient_information';

export type EvidenceStrength =
  | 'explicit'
  | 'strong_inference'
  | 'weak_inference'
  | 'unknown';

export interface IntentCandidate {
  projectType: ProjectType;
  score: number;
  confidence: number;
  evidence: string[];
}

export interface ClarificationOption {
  id: string;
  label: string;
  description?: string;
}

export interface ClarificationQuestion {
  id: string;
  question: string;
  type: 'single_select' | 'multi_select' | 'free_text';
  options?: ClarificationOption[];
  required: boolean;
  informationGain: number;
  resolves: string[];
}

export interface Assumption {
  key: string;
  value: string;
  evidence: string[];
  confidence: number;
  reversible: boolean;
}

export interface IntentResolution {
  status: IntentResolutionStatus;
  primaryCandidate: IntentCandidate | null;
  candidates: IntentCandidate[];
  confidence: number; // 0-100 normalized
  missingInformation: string[];
  ambiguityReasons: string[];
  clarificationRequired: boolean;
  clarificationQuestions: ClarificationQuestion[];
  assumptions: Assumption[];
}

export interface ClassificationConfidence {
  projectType: ProjectType;
  confidence: number; // 0.0 to 1.0
  evidence: string[];
  competingTypes: Array<{
    type: ProjectType;
    score: number;
    reason?: string;
  }>;
}

export type ProjectType =
  | 'marketing_website'
  | 'landing_page'
  | 'portfolio'
  | 'business_website'
  | 'ecommerce_website'
  | 'blog'
  | 'web_application'
  | 'saas'
  | 'dashboard'
  | 'marketplace'
  | 'mobile_app'
  | 'content_creation'
  | 'video_production'
  | 'audio_production'
  | 'algorithmic_trading'
  | 'chatbot_agent'
  | 'existing_application'
  | 'general';

export type ProjectComplexity = 'simple' | 'moderate' | 'complex';

export type CodingRequirement = 'no' | 'optional' | 'yes' | 'unknown';

export interface TechnicalEvidence {
  hasAuth: boolean;
  hasDatabase: boolean;
  hasApi: boolean;
  hasPayments: boolean;
  hasAdminDashboard: boolean;
  hasUserAccounts: boolean;
  hasExistingCodebase: boolean;
}

export interface ProjectConstraints {
  budget?: 'free_only' | 'low_cost' | 'paid_ok' | 'unknown';
  time?: 'urgent' | 'normal' | 'flexible';
  platform?: string[];
  /** User's skill level (beginner/intermediate/advanced/unknown) */
  skillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'unknown';
  /** User's coding preference */
  coding?: 'no_code' | 'some_code' | 'full_code' | 'unknown';
  /** Deadline if specified */
  deadline?: string;
  /** Tools explicitly preferred by user */
  preferredTools?: string[];
  /** Tools explicitly excluded by user */
  excludedTools?: string[];
  /** Existing tech stack elements the user already has */
  existingStack?: string[];
}

export interface ProjectProfile {
  projectType: ProjectType;
  complexity: ProjectComplexity;
  codingRequirement: CodingRequirement;
  primaryOutcome: string | null;
  primaryGoal: string;
  domain: string;
  targetAudience: string | null;
  explicitFeatures: string[];
  inferredFeatures: string[];
  requirements: RequirementEvidence[];
  technicalEvidence: TechnicalEvidence;
  excludedRequirements: string[];
  unknownRequirements: string[];
  assumptions: string[];
  userSkill?: 'beginner' | 'intermediate' | 'advanced';
  constraints?: ProjectConstraints;
  /** V4: Classification confidence */
  classificationConfidence?: ClassificationConfidence;
  /** V5: Full Intent Resolution and Uncertainty Contract */
  intentResolution?: IntentResolution;
  assumptionsList?: Assumption[];
}

export interface WorkflowOptimizationResult {
  steps: WorkflowStep[];
  complexity: 'minimal' | 'standard' | 'advanced';
  estimatedSteps: number;
  removedSteps: Array<{
    task: ToolTask;
    reason: string;
  }>;
  optionalSteps: WorkflowStep[];
}

export interface UserIntent {
  goal: string;
  primaryTask: ToolTask;
  domain?: string;
  targetAudience?: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'unknown';
  budget: UserIntentBudget;
  platform?: Array<'web' | 'windows' | 'macos' | 'linux' | 'ios' | 'android'>;
  requirements: Requirement[];
  constraints: Constraint[];
  preferences: Preference[];
  ambiguities: Ambiguity[];
  projectProfile?: ProjectProfile;

  // Engine routing helpers
  rawGoal?: string;
  specificTopic?: string;
  targetTask?: ToolTask;
  targetFormat?: string;
  budgetPreference?: PricingModel | 'any';
  skillLevel?: SkillLevel;
  requiredCapabilities?: ToolCapability[];
  deploymentPlatform?: string;
  customPreferences?: Record<string, string>;
}

export interface StageTaskDefinition {
  stageNumber: number;
  stageName: string;
  taskTitle: string;
  taskDescription: string;
  toolTask: ToolTask;
  requiredCapabilities: ToolCapability[];
  preferredCategory: ToolCategory;
  defaultPromptTitle: string;
  defaultPromptTemplate: string;
  defaultVariables: PromptVariable[];
  defaultExplanation: string;
  defaultProTip: string;
  isOptional?: boolean;
}

export interface ScoringWeights {
  taskFit: number;
  capabilityCoverage: number;
  skillFit: number;
  budgetFit: number;
  platformFit: number;
  quality: number;
  easeOfUse: number;
}

export interface Recommendation {
  toolId: string;
  rank: number;
  score: number;
  matchedCapabilities: ToolCapability[];
  matchedTasks: ToolTask[];
  reasons: string[];
  limitations: string[];
  confidence: number;
  alternatives: string[];
  tool: Tool;
}

export interface ScoredToolCandidate {
  tool: Tool;
  score: number;
  capabilityOverlap: number;
  taskFitScore: number;
  complementBonus: number;
  rationale: string;
}

export interface PathwayTool {
  toolId: string;
  purpose: string;
  whySelected: string;
  role: 'primary' | 'supporting' | 'alternative';
}

export interface Alternative {
  toolId: string;
  forToolId: string;
  tradeoff: string;
}

export interface PathwayResponse {
  title: string;
  summary: string;
  assumptions: ClarificationAssumption[];
  tools: PathwayTool[];
  steps: WorkflowStep[];
  prompts: GeneratedPrompt[];
  alternatives: Alternative[];
  warnings: string[];
}
