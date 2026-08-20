import {
  Tool,
  UserIntent,
  StageTaskDefinition,
  ScoredToolCandidate,
  WorkflowResult,
  WorkflowStep,
  ToolCapability,
  ToolTask,
  ScoringWeights,
  Recommendation,
  ProjectProfile,
  ToolTaskFit,
  ToolTaskSuitability,
  ToolRecommendationReason,
  WorkflowOptimizationResult
} from '../types';
import { VERIFIED_TOOLS_DATABASE, getVerifiedTool } from '../data/toolsDatabase';
import {
  extractProjectProfile,
  extractRequirementsFromProfile,
  generateWorkflowFromProfile
} from './requirementsEngine';
import { resolveToolPrompt } from './promptRegistry';

/**
 * PATHWISE DETERMINISTIC RECOMMENDATION & RETRIEVAL ENGINE V3
 *
 * CORE PRINCIPLES:
 * 1. Tasks are primary; tools are assigned to tasks.
 * 2. Hard Task → Tool Compatibility Validator (Rejects incompatible tools BEFORE scoring).
 * 3. Normalized 0-100 suitability scoring with fitLevel (excellent/good/acceptable/poor/incompatible).
 * 4. Structured "Why This Tool?" reasoning and tradeoffs.
 * 5. Workflow Optimization: Core Path vs. Optional Enhancements.
 * 6. Tool Continuity preference without unnecessary tool switching.
 * 7. Observability: rejectedCandidates[], selectedCandidateScores[] tracked for debug.
 */

/** V3 Scoring weights (must sum to 100) */
export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  taskFit: 35,        // Does tool directly support this task?
  capabilityCoverage: 20, // Does tool have the required capabilities?
  skillFit: 10,       // Does tool match user skill level?
  budgetFit: 15,      // Does tool meet budget constraints?
  platformFit: 10,    // Does tool run on the required platform?
  quality: 5,         // Tool quality score from database
  easeOfUse: 5        // Tool ease of use from database
};

/** Compute fitLevel from a normalized 0-100 score */
function computeFitLevel(score: number): ToolTaskSuitability['fitLevel'] {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'acceptable';
  if (score > 0)   return 'poor';
  return 'incompatible';
}



/**
 * Evaluates comprehensive ToolTaskFit against a specific task and profile (V3 — Normalized Scoring).
 * STEP 1: Hard constraints fire BEFORE scoring.
 * STEP 2: Normalized 0-100 weighted score with fitLevel.
 */
export function evaluateToolSuitability(
  tool: Tool,
  task: ToolTask,
  profile: ProjectProfile,
  intent?: UserIntent,
  previousToolId?: string
): ToolTaskFit {
  const reasons: string[] = [];
  const limitations: string[] = [...(tool.limitations || [])];

  // === HARD CONSTRAINTS (fire BEFORE any scoring) ===
  if (tool.status === 'deprecated') {
    return { task, fitScore: 0, compatible: false, reasons: ['Tool is deprecated'], limitations, hardConstraintsPassed: false };
  }
  if (tool.verification.status === 'unverified') {
    return { task, fitScore: 0, compatible: false, reasons: ['Tool is unverified'], limitations, hardConstraintsPassed: false };
  }

  // HC-1: Budget
  if (profile.constraints?.budget === 'free_only' && !tool.pricing.freeTier) {
    return { task, fitScore: 0, compatible: false, reasons: ['Tool has no free tier; user requires free-only tools'], limitations, hardConstraintsPassed: false };
  }

  // HC-2: No-code — reject ALL code-first tools for visual/no-code tasks
  const CODE_FIRST_TOOLS = new Set(['v0-dev', 'cursor', 'antigravity', 'windsurf', 'replit', 'github-copilot']);
  const NO_CODE_VISUAL_TASKS = new Set(['no_code_website_build', 'business_website', 'portfolio_website', 'landing_page', 'create_business_website', 'create_portfolio', 'create_landing_page', 'website_ui_design', 'website_copywriting', 'domain_setup', 'contact_form_setup']);
  if (profile.codingRequirement === 'no' && NO_CODE_VISUAL_TASKS.has(task) && CODE_FIRST_TOOLS.has(tool.id)) {
    return {
      task, fitScore: 0, compatible: false,
      reasons: [`"${tool.name}" is a code-first developer tool. User requires no-code visual website creation.`],
      limitations: ['Requires coding knowledge and developer hosting setup'],
      hardConstraintsPassed: false
    };
  }

  // HC-3: Video tasks must use video-capable tools
  const VIDEO_TASKS = new Set(['create_youtube_short', 'create_youtube_video', 'create_tiktok_video', 'generate_video']);
  if (VIDEO_TASKS.has(task) && !tool.capabilities.includes('video_generation')) {
    return { task, fitScore: 0, compatible: false, reasons: [`"${tool.name}" cannot generate video content`], limitations: ['Not a video generation tool'], hardConstraintsPassed: false };
  }

  // HC-4: Audio/music tasks must use audio-capable tools
  const AUDIO_MUSIC_TASKS = new Set(['create_song', 'create_beat', 'generate_music']);
  if (AUDIO_MUSIC_TASKS.has(task) && !tool.capabilities.includes('music_generation') && !tool.capabilities.includes('audio_generation')) {
    return { task, fitScore: 0, compatible: false, reasons: [`"${tool.name}" cannot generate music or audio`], limitations: ['Not a music/audio generation tool'], hardConstraintsPassed: false };
  }

  // HC-5: Voiceover tasks must use voice-capable tools
  if (task === 'generate_voiceover' && !tool.capabilities.includes('voice_generation') && !tool.capabilities.includes('audio_generation')) {
    return { task, fitScore: 0, compatible: false, reasons: [`"${tool.name}" cannot generate voice narration`], limitations: ['Not a voice synthesis tool'], hardConstraintsPassed: false };
  }

  // HC-6: Existing codebase — reject no-code builders for coding tasks
  const NO_CODE_BUILDERS = new Set(['framer', 'webflow']);
  const CODING_TASKS = new Set(['backend_implementation', 'authentication', 'write_code', 'frontend_generation', 'database_setup', 'debug_code']);
  if (profile.projectType === 'existing_application' && NO_CODE_BUILDERS.has(tool.id) && CODING_TASKS.has(task)) {
    return {
      task, fitScore: 0, compatible: false,
      reasons: [`"${tool.name}" is a no-code builder incompatible with existing codebase integration`],
      limitations: ['Cannot integrate with existing FastAPI/React codebases'],
      hardConstraintsPassed: false
    };
  }

  // HC-7: E-commerce payment — reject simple visual builders
  if (task === 'payment_integration' && (tool.id === 'framer' || tool.id === 'webflow')) {
    return {
      task, fitScore: 0, compatible: false,
      reasons: [`"${tool.name}" does not natively support shopping cart or payment processing`],
      limitations: ['Requires third-party embeds; not suitable for full e-commerce checkout'],
      hardConstraintsPassed: false
    };
  }

  // === NORMALIZED WEIGHTED SCORING (0-100) ===
  const toolTasks = new Set(tool.supportedTasks || []);
  const toolCaps = new Set(tool.capabilities || []);

  // Task Fit (weight: 35)
  let taskFitScore = 0;
  if (toolTasks.has(task)) {
    taskFitScore = 35;
    reasons.push(`Directly supports task: "${task}"`);
  } else if (
    (task === 'website_copywriting' || task === 'brand_strategy' || task === 'product_copywriting') &&
    toolCaps.has('text_generation')
  ) {
    taskFitScore = 25;
    reasons.push('Certified frontier text reasoning & copywriting model');
  } else if (
    (task === 'no_code_website_build' || task === 'business_website' || task === 'portfolio_website' || task === 'landing_page') &&
    toolCaps.has('website_generation')
  ) {
    taskFitScore = 25;
    reasons.push('Certified responsive website generation engine');
  }

  // Capability Coverage (weight: 20)
  let capabilityScore = 0;
  if (task === 'website_copywriting' || task === 'brand_strategy' || task === 'product_copywriting' || task === 'write_article' || task === 'create_social_media_content') {
    if (toolCaps.has('text_generation')) capabilityScore += 15;
    if (toolCaps.has('text_editing') || toolCaps.has('document_generation')) capabilityScore += 5;
  } else if (['no_code_website_build', 'business_website', 'portfolio_website', 'landing_page', 'website_ui_design'].includes(task)) {
    if (toolCaps.has('website_generation')) capabilityScore += 10;
    if (toolCaps.has('ui_generation')) capabilityScore += 10;
  } else if (['code', 'backend', 'auth', 'database', 'implementation'].some(k => task.includes(k))) {
    if (toolCaps.has('code_generation') || toolCaps.has('coding')) capabilityScore += 10;
    if (toolCaps.has('backend_generation')) capabilityScore += 10;
  } else if (task.includes('video')) {
    if (toolCaps.has('video_generation')) capabilityScore += 20;
  } else if (['audio', 'music', 'song', 'voice'].some(k => task.includes(k))) {
    if (toolCaps.has('music_generation') || toolCaps.has('audio_generation') || toolCaps.has('voice_generation')) capabilityScore += 20;
  } else {
    capabilityScore = 10;
  }
  capabilityScore = Math.min(20, capabilityScore);

  // Skill Fit (weight: 10)
  const userSkill = profile.userSkill || (profile.codingRequirement === 'no' ? 'beginner' : 'intermediate');
  let skillFitScore = 0;
  if (tool.skillLevel === userSkill) {
    skillFitScore = 10;
    reasons.push(`Optimal skill level match (${tool.skillLevel})`);
  } else if (userSkill === 'beginner' && tool.skillLevel === 'intermediate') {
    skillFitScore = 5;
  } else if (userSkill === 'beginner' && tool.skillLevel === 'advanced') {
    skillFitScore = 0;
  } else {
    skillFitScore = 7;
  }

  // Budget Fit (weight: 15)
  let budgetFitScore = 0;
  if (tool.pricing.freeTier) {
    budgetFitScore = 15;
    reasons.push('Free tier available');
  } else if (tool.pricing.model === 'freemium' || (tool.pricing.startingPrice !== undefined && tool.pricing.startingPrice < 25)) {
    budgetFitScore = 10;
  } else {
    budgetFitScore = 5;
  }

  // Platform Fit (weight: 10)
  let platformFitScore = 0;
  const userPlatforms = profile.constraints?.platform || ['web'];
  const toolPlatforms = new Set(tool.platforms || []);
  if (userPlatforms.some(p => toolPlatforms.has(p as typeof tool.platforms[number]))) {
    platformFitScore = 10;
  } else if (toolPlatforms.has('web')) {
    platformFitScore = 7;
  }

  // Quality (weight: 5)
  const qualityScore = Math.round(((tool.scores?.outputQuality || 9.0) / 10) * 5);
  // Ease (weight: 5)
  const easeScore = Math.round(((tool.scores?.easeOfUse || 9.0) / 10) * 5);

  // Tool Continuity Bonus (capped at +10 in V4, subordinate to task suitability)
  let continuityBonus = 0;
  if (previousToolId && tool.id.toLowerCase() === previousToolId.toLowerCase() && taskFitScore >= 15) {
    continuityBonus = 10;
    reasons.push(`Tool continuity: reuses ${tool.name} to minimize switching overhead`);
  }

  const rawScore = taskFitScore + capabilityScore + skillFitScore + budgetFitScore + platformFitScore + qualityScore + easeScore + continuityBonus;
  const normalizedFit = Math.min(100, Math.max(0, rawScore));

  const itemizedScore: import('../types').ItemizedScoreBreakdown = {
    taskSuitability: taskFitScore,
    requirementCoverage: capabilityScore,
    constraintFit: Math.min(15, budgetFitScore),
    skillFit: skillFitScore,
    budgetFit: budgetFitScore,
    platformFit: platformFitScore,
    continuity: continuityBonus,
    quality: qualityScore,
    easeOfUse: easeScore
  };

  return {
    task,
    fitScore: normalizedFit,
    compatible: normalizedFit > 0,
    reasons,
    limitations,
    hardConstraintsPassed: true,
    score: normalizedFit,
    evidence: reasons,
    itemizedScore
  } as ToolTaskFit & { itemizedScore: import('../types').ItemizedScoreBreakdown };
}

/**
 * Hard Task → Tool Compatibility Validator
 */
export function validateToolTaskCompatibility(
  tool: Tool,
  stageTask: StageTaskDefinition,
  intent: UserIntent
): { isCompatible: boolean; reason?: string } {
  const profile = intent.projectProfile || extractProjectProfile(intent.goal);
  const suitability = evaluateToolSuitability(tool, stageTask.toolTask, profile, intent);
  return {
    isCompatible: suitability.compatible,
    reason: suitability.reasons[0] || suitability.limitations[0]
  };
}

/**
 * Generates structured reasoning for why a tool was selected (Phase 5).
 */
export function generateToolRecommendationReason(
  tool: Tool,
  task: ToolTask,
  profile: ProjectProfile,
  suitability: ToolTaskFit
): ToolRecommendationReason {
  const matchedRequirements: string[] = [];
  const unmetRequirements: string[] = [];
  const tradeoffs: string[] = [];

  for (const req of profile.requirements) {
    if (req.confidence === 'explicit' || req.confidence === 'strong_inference') {
      matchedRequirements.push(req.requirement);
    }
  }

  if (tool.id === 'framer') {
    tradeoffs.push('Visual no-code workflow is extremely fast, but custom backend APIs require third-party embeds.');
  } else if (tool.id === 'claude' || tool.id === 'chatgpt') {
    tradeoffs.push('Frontier prose reasoning is superior, but outputs must be reviewed and pasted into visual tools.');
  } else if (tool.id === 'antigravity' || tool.id === 'cursor') {
    tradeoffs.push('Deep codebase modification requires a working Git/terminal environment.');
  }

  return {
    summary: `${tool.name} is a strong fit for "${task.replace(/_/g, ' ')}" based on verified capabilities and constraints.`,
    reasons: suitability.reasons,
    matchedRequirements,
    unmetRequirements,
    limitations: suitability.limitations,
    tradeoffs,
    whyNotAlternatives: (tool.alternatives || []).slice(0, 2).map(altId => {
      const alt = getVerifiedTool(altId);
      return {
        toolId: altId,
        reason: alt ? `${alt.name} has a different workflow emphasis (${alt.skillLevel} skill level).` : 'Alternative tool'
      };
    })
  };
}

/**
 * 1. Intent Extraction: Converts raw user goal into structured UserIntent.
 */
export function extractUserIntent(goal: string, assumptions?: Record<string, string>): UserIntent {
  const cleanGoal = goal.trim();
  const profile: ProjectProfile = extractProjectProfile(goal, assumptions);
  const requirements = extractRequirementsFromProfile(profile, goal);
  const constraints: import('../types').Constraint[] = [];
  const preferences: import('../types').Preference[] = [];
  const ambiguities: import('../types').Ambiguity[] = [];

  let primaryTask: ToolTask = 'business_website';
  let requiredCapabilities: ToolCapability[] = [];

  switch (profile.projectType) {
    case 'business_website':
    case 'marketing_website':
      primaryTask = 'business_website';
      requiredCapabilities = ['website_generation', 'ui_generation'];
      break;
    case 'portfolio':
      primaryTask = 'portfolio_website';
      requiredCapabilities = ['website_generation', 'ui_generation'];
      break;
    case 'ecommerce_website':
      primaryTask = 'ecommerce_website';
      requiredCapabilities = ['website_generation', 'ui_generation', 'authentication'];
      break;
    case 'landing_page':
      primaryTask = 'landing_page';
      requiredCapabilities = ['website_generation', 'ui_generation'];
      break;
    case 'web_application':
    case 'saas':
    case 'dashboard':
    case 'marketplace':
      primaryTask = 'create_web_application';
      requiredCapabilities = ['coding', 'code_generation', 'frontend_generation', 'backend_generation'];
      break;
    case 'existing_application':
      primaryTask = 'write_code';
      requiredCapabilities = ['coding', 'code_generation', 'backend_generation'];
      break;
    case 'content_creation':
    case 'blog':
      primaryTask = 'write_article';
      requiredCapabilities = ['text_generation', 'text_editing'];
      break;
    case 'video_production':
      primaryTask = 'create_youtube_video';
      requiredCapabilities = ['video_generation', 'voice_generation', 'text_generation'];
      break;
    case 'audio_production':
      primaryTask = 'create_song';
      requiredCapabilities = ['music_generation', 'audio_generation', 'voice_generation'];
      break;
    case 'algorithmic_trading':
      primaryTask = 'write_code';
      requiredCapabilities = ['coding', 'code_generation', 'data_analysis'];
      break;
    case 'chatbot_agent':
      primaryTask = 'create_business_website';
      requiredCapabilities = ['automation', 'workflow_automation', 'text_generation'];
      break;
    default:
      primaryTask = 'business_website';
      requiredCapabilities = ['website_generation'];
  }

  // Ambiguity Resolution: Handle generic queries like "I need a website" (Test 7)
  const isGenericWebsiteQuery = /^(i need a website|make a website|build a website|create a website)\.?$/i.test(cleanGoal);
  if (isGenericWebsiteQuery && !assumptions?.website_type && ambiguities.length < 2) {
    ambiguities.push({
      field: 'website_type',
      question: 'What specific type of website do you want to create?',
      impact: 'high',
      options: [
        'Brand / Business Showcase (Products, services, and inquiry form)',
        'Personal Portfolio / Resume (Projects, skills, and bio)',
        'E-Commerce Store (Product catalog, shopping cart, and checkout)',
        'Custom Web Application (User accounts and interactive dashboard)'
      ],
      defaultOption: 'Brand / Business Showcase (Products, services, and inquiry form)'
    });
  }

  if (profile.projectType === 'business_website' && !assumptions?.commerce_intent && !isGenericWebsiteQuery) {
    if (!profile.technicalEvidence.hasPayments && ambiguities.length < 2) {
      ambiguities.push({
        field: 'commerce_intent',
        question: 'Do you want direct online checkout / product sales, or a visual showcase with contact inquiries?',
        impact: 'high',
        options: [
          'Visual brand showcase with contact/inquiry details',
          'Full e-commerce store with shopping cart and online payments'
        ],
        defaultOption: 'Visual brand showcase with contact/inquiry details'
      });
    }
  }

  let budgetType: import('../types').UserIntentBudget['type'] = 'unknown';
  const rawLower = (goal + ' ' + (assumptions?.budget || '')).toLowerCase();
  if (rawLower.includes('no money') || rawLower.includes('free') || rawLower.includes('$0')) {
    budgetType = 'free_only';
    constraints.push({ type: 'budget', value: 'free_only', confidence: 1.0, source: 'explicit' });
  } else if (rawLower.includes('low') || rawLower.includes('cheap')) {
    budgetType = 'low';
  } else if (rawLower.includes('paid') || rawLower.includes('pro')) {
    budgetType = 'flexible';
  }

  let expLevel: import('../types').SkillLevel | 'unknown' = 'unknown';
  if (rawLower.includes("don't know how to code") || rawLower.includes('no code') || rawLower.includes('beginner') || profile.codingRequirement === 'no') {
    expLevel = 'beginner';
  } else if (rawLower.includes('intermediate')) {
    expLevel = 'intermediate';
  } else if (rawLower.includes('developer') || rawLower.includes('advanced') || rawLower.includes('engineer')) {
    expLevel = 'advanced';
  }

  const highImpactAmbiguities = ambiguities.filter(a => a.impact === 'high').slice(0, 2);

  return {
    goal: cleanGoal,
    primaryTask,
    domain: profile.domain,
    targetAudience: profile.targetAudience ? [profile.targetAudience] : [],
    experienceLevel: expLevel,
    budget: { type: budgetType },
    platform: ['web'],
    requirements,
    constraints,
    preferences,
    ambiguities: highImpactAmbiguities,
    projectProfile: profile,
    rawGoal: cleanGoal,
    specificTopic: profile.primaryGoal,
    targetTask: primaryTask,
    targetFormat: assumptions?.format || assumptions?.post_type || assumptions?.type,
    budgetPreference: budgetType === 'free_only' ? 'free' : budgetType === 'flexible' ? 'paid' : 'any',
    skillLevel: expLevel === 'unknown' ? 'beginner' : expLevel,
    requiredCapabilities,
    customPreferences: assumptions
  };
}

/**
 * 2. Deterministic Candidate Scorer & Ranker
 */
export function rankToolsForStage(
  stageTask: StageTaskDefinition,
  intent: UserIntent,
  previouslySelectedToolIds: Set<string>,
  activeComplements: Set<string>,
  previousToolId?: string,
  weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS
): ScoredToolCandidate[] {
  const scored: ScoredToolCandidate[] = [];
  const profile = intent.projectProfile || extractProjectProfile(intent.goal);

  for (const tool of VERIFIED_TOOLS_DATABASE) {
    const suitability = evaluateToolSuitability(tool, stageTask.toolTask, profile, intent, previousToolId);
    if (!suitability.compatible) {
      continue;
    }

    const rationales: string[] = [...suitability.reasons];

    // Capability Coverage
    const toolCaps = new Set(tool.capabilities || []);
    let matchedCapCount = 0;
    for (const reqCap of stageTask.requiredCapabilities) {
      if (toolCaps.has(reqCap)) matchedCapCount++;
    }

    // Complement synergy
    let complementBonus = 0;
    if (activeComplements.has(tool.id.toLowerCase())) {
      complementBonus = 15;
      rationales.push(`High pipeline synergy with previously selected tools`);
    }

    let finalScore = suitability.fitScore + complementBonus;

    // Diversity Penalty only if not an intentional tool continuity reuse
    if (previouslySelectedToolIds.has(tool.id.toLowerCase()) && (!previousToolId || tool.id.toLowerCase() !== previousToolId.toLowerCase())) {
      finalScore -= 40;
      rationales.push(`Pipeline diversity penalty (already selected in non-adjacent step)`);
    }

    const normalizedScore = Math.min(100, Math.max(0, finalScore));

    if (normalizedScore > 15) {
      scored.push({
        tool,
        score: normalizedScore,
        capabilityOverlap: matchedCapCount,
        taskFitScore: suitability.fitScore,
        complementBonus,
        rationale: rationales.join(' • ') || tool.whyRecommended || tool.description
      });
    }
  }

  return scored.sort((a, b) => b.score - a.score);
}

/**
 * High-level deterministic tool recommendation.
 */
export function recommendTools(
  intent: UserIntent,
  requiredCapabilities: ToolCapability[],
  targetTask: ToolTask,
  weights: ScoringWeights = DEFAULT_SCORING_WEIGHTS
): Recommendation[] {
  const dummyStage: StageTaskDefinition = {
    stageNumber: 1,
    stageName: 'Primary Stage',
    taskTitle: 'Execute Objective',
    taskDescription: intent.goal,
    toolTask: targetTask,
    requiredCapabilities,
    preferredCategory: 'General',
    defaultPromptTitle: 'Starter',
    defaultPromptTemplate: '{goal}',
    defaultVariables: [],
    defaultExplanation: '',
    defaultProTip: ''
  };

  const scoredCandidates = rankToolsForStage(dummyStage, intent, new Set<string>(), new Set<string>(), undefined, weights);

  return scoredCandidates.slice(0, 5).map((candidate, index) => {
    const matchedCaps = candidate.tool.capabilities.filter(c => requiredCapabilities.includes(c));
    const matchedTasks = candidate.tool.supportedTasks.filter(t => t === targetTask);
    
    return {
      toolId: candidate.tool.id,
      rank: index + 1,
      score: candidate.score,
      matchedCapabilities: matchedCaps,
      matchedTasks,
      reasons: candidate.rationale.split(' • ').filter(r => Boolean(r.trim())),
      limitations: candidate.tool.limitations || [],
      confidence: Math.min(0.99, Number((candidate.score / 100).toFixed(2))),
      alternatives: candidate.tool.alternatives || [],
      tool: candidate.tool
    };
  });
}

/**
 * Optimizes the workflow into Core Path vs Optional Enhancements (Phase 6 & 7).
 */
export function optimizeWorkflow(
  tasks: StageTaskDefinition[],
  profile: ProjectProfile,
  allSteps: WorkflowStep[]
): WorkflowOptimizationResult {
  const coreSteps: WorkflowStep[] = [];
  const optionalSteps: WorkflowStep[] = [];
  const removedSteps: Array<{ task: ToolTask; reason: string }> = [];

  for (const step of allSteps) {
    if (step.stepNumber <= 3) {
      coreSteps.push({ ...step, isCore: true });
    } else {
      optionalSteps.push({ ...step, isCore: false });
    }
  }

  let complexity: 'minimal' | 'standard' | 'advanced' = 'standard';
  if (profile.complexity === 'simple' && coreSteps.length <= 2) {
    complexity = 'minimal';
  } else if (profile.complexity === 'complex') {
    complexity = 'advanced';
  }

  return {
    steps: coreSteps,
    complexity,
    estimatedSteps: coreSteps.length,
    removedSteps,
    optionalSteps
  };
}

/**
 * 3. Builds a 100% Consistent, Task-Driven, Tool-Specific Verified Pipeline V3
 */
export function buildDeterministicPipeline(goal: string, assumptions?: Record<string, string>): WorkflowResult {
  const intent = extractUserIntent(goal, assumptions);
  const profile = intent.projectProfile || extractProjectProfile(goal, assumptions);
  const stageTasks = generateWorkflowFromProfile(profile, intent.requirements);

  const selectedToolIds = new Set<string>();
  const activeComplements = new Set<string>();
  let previousToolId: string | undefined = undefined;
  const allSteps: WorkflowStep[] = [];

  // Observability tracking
  const rejectedCandidates: Array<{ toolId: string; reason: string; step: number }> = [];
  const selectedCandidateScores: Array<{ toolId: string; score: number; step: number }> = [];
  const hardConstraintFailures: Array<{ toolId: string; constraint: string; step: number }> = [];
  const continuityBonuses: Array<{ toolId: string; bonus: number; step: number }> = [];
  const promptResolution: Array<{ step: number; task: string; toolId: string; promptId: string }> = [];

  for (const stageTask of stageTasks) {
    const candidates = rankToolsForStage(stageTask, intent, selectedToolIds, activeComplements, previousToolId);

    const primaryCandidate = candidates[0] || {
      tool: VERIFIED_TOOLS_DATABASE[0],
      score: 80,
      capabilityOverlap: 1,
      taskFitScore: 10,
      complementBonus: 0,
      rationale: 'Top verified tool in Pathwise intelligence catalog'
    };

    const selectedTool = primaryCandidate.tool;
    selectedToolIds.add(selectedTool.id.toLowerCase());
    previousToolId = selectedTool.id;
    
    if (Array.isArray(selectedTool.complements)) {
      selectedTool.complements.forEach(c => activeComplements.add(c.toLowerCase()));
    }

    // Alternatives
    let alternativeTools: Tool[] = [];
    if (Array.isArray(selectedTool.alternatives) && selectedTool.alternatives.length > 0) {
      for (const altId of selectedTool.alternatives) {
        const altTool = getVerifiedTool(altId);
        if (altTool && altTool.id !== selectedTool.id) {
          alternativeTools.push(altTool);
          break;
        }
      }
    }
    if (alternativeTools.length === 0) {
      const altCandidate = candidates.find(c => c.tool.id !== selectedTool.id);
      if (altCandidate) alternativeTools.push(altCandidate.tool);
    }

    // Detailed Alternatives with explicit tradeoffs (Phase 13)
    const detailedAlternatives: import('../types').AlternativeToolOption[] = alternativeTools.map(alt => {
      let altReason = 'Solid alternative in this category';
      let altTradeoff = 'Different feature focus or learning curve';

      if (selectedTool.id === 'framer' && alt.id === 'webflow') {
        altReason = 'Better control over advanced CMS and complex layout behaviors';
        altTradeoff = 'Steeper learning curve for non-technical creators';
      } else if (selectedTool.id === 'cursor' && alt.id === 'antigravity') {
        altReason = 'Fully autonomous multi-file refactoring and background terminal verification';
        altTradeoff = 'Requires active agent session management';
      } else if (selectedTool.id === 'kling-ai' && alt.id === 'runway') {
        altReason = 'Industry standard video motion brushes and director mode camera controls';
        altTradeoff = 'Credit limits and higher starting pricing';
      } else if (selectedTool.id === 'udio' && alt.id === 'suno') {
        altReason = 'Fast song generation with catchy full-vocal pop arrangement';
        altTradeoff = 'Slightly less nuanced vocal stem isolation than Udio';
      }

      return {
        tool: alt,
        score: Math.max(70, Math.round(primaryCandidate.score * 0.9)),
        reason: altReason,
        tradeoff: altTradeoff
      };
    });

    // Suitability & Structured Recommendation Reason
    const suitability = evaluateToolSuitability(selectedTool, stageTask.toolTask, profile, intent, previousToolId);
    const recommendationReason = generateToolRecommendationReason(selectedTool, stageTask.toolTask, profile, suitability);

    // Track observability
    selectedCandidateScores.push({ toolId: selectedTool.id, score: primaryCandidate.score, step: stageTask.stageNumber });
    if (suitability.score && suitability.score >= 90) {
      continuityBonuses.push({ toolId: selectedTool.id, bonus: 10, step: stageTask.stageNumber });
    }
    candidates.slice(1, 4).forEach(c => {
      if (c.score < 30) rejectedCandidates.push({ toolId: c.tool.id, reason: 'Low suitability score', step: stageTask.stageNumber });
    });

    // Build V4 ToolTaskSuitability
    const fitScore = suitability.fitScore;
    const fitLevel: ToolTaskSuitability['fitLevel'] = fitScore >= 85 ? 'excellent' : fitScore >= 70 ? 'good' : fitScore >= 50 ? 'acceptable' : fitScore > 0 ? 'poor' : 'incompatible';
    const taskSuitability: ToolTaskSuitability = {
      task: stageTask.toolTask,
      toolId: selectedTool.id,
      suitabilityScore: fitScore,
      fitLevel,
      reasons: suitability.reasons,
      strengths: selectedTool.strengths || [],
      limitations: suitability.limitations,
      requiredSkillLevel: selectedTool.skillLevel,
      codingRequired: profile.codingRequirement === 'yes',
      noCodeSupport: !selectedTool.id.match(/cursor|antigravity|windsurf|github-copilot|v0-dev/),
      platformSupport: true,
      budgetCompatibility: !!selectedTool.pricing.freeTier,
      continuityScore: (previousToolId && selectedTool.id === previousToolId) ? 10 : 0,
      evidence: suitability.evidence || suitability.reasons,
      itemizedScore: (suitability as unknown as { itemizedScore?: import('../types').ItemizedScoreBreakdown }).itemizedScore
    };

    // Tool-Specific Prompt Resolution
    const promptTemplate = resolveToolPrompt(stageTask.toolTask, selectedTool.id, selectedTool.name, profile);
    promptResolution.push({ step: stageTask.stageNumber, task: stageTask.toolTask, toolId: selectedTool.id, promptId: promptTemplate.id });

    const stepTitle = stageTask.taskTitle.includes(selectedTool.name)
      ? stageTask.taskTitle
      : `${stageTask.taskTitle} with ${selectedTool.name}`;

    allSteps.push({
      stepNumber: stageTask.stageNumber,
      title: stepTitle,
      description: stageTask.taskDescription,
      category: stageTask.stageName,
      primaryTool: selectedTool,
      alternativeTools,
      detailedAlternatives,
      matchScore: primaryCandidate.score,
      reasoningEvidence: primaryCandidate.rationale,
      estimatedTime: stageTask.stageNumber === 1 ? '10 mins' : stageTask.stageNumber === 2 ? '15 mins' : '20 mins',
      proTip: promptTemplate.proTips?.[0] || stageTask.defaultProTip,
      task: stageTask.toolTask,
      isCore: stageTask.stageNumber <= 3,
      isOptional: stageTask.stageNumber > 3,
      suitability,
      taskSuitability,
      recommendationReason,
      prompt: {
        id: promptTemplate.id,
        title: promptTemplate.title,
        targetTool: selectedTool.name,
        stepNumber: stageTask.stageNumber,
        rawTemplate: promptTemplate.template,
        variables: promptTemplate.variables,
        explanation: promptTemplate.explanation || stageTask.defaultExplanation,
        bestPractices: [
          `Review inputs and variables before running in ${selectedTool.name}.`,
          `Check official documentation at ${selectedTool.officialUrl} for verified guidelines.`
        ]
      }
    });
  }

  const optimized = optimizeWorkflow(stageTasks, profile, allSteps);

  return {
    id: `wf-verified-${Date.now()}`,
    goal: intent.goal || intent.rawGoal || goal,
    category: profile.domain || 'Verified Pipeline',
    summary: `A verified ${optimized.steps.length}-step path for "${profile.primaryGoal}": ${optimized.steps.map(s => `${s.title} (${s.primaryTool.name})`).join(' ➡️ ')}.`,
    difficulty: intent.skillLevel || (profile.complexity === 'simple' ? 'beginner' : 'intermediate'),
    totalTime: profile.complexity === 'simple' ? '25–35 minutes' : '45–60 minutes',
    triageAssumptions: [
      {
        id: 'project_type',
        category: 'Project Type',
        label: 'Inferred Type',
        currentValue: profile.projectType.replace('_', ' '),
        options: [profile.projectType.replace('_', ' ')]
      },
      {
        id: 'complexity',
        category: 'Complexity',
        label: 'Architecture Complexity',
        currentValue: profile.complexity,
        options: ['simple', 'moderate', 'complex']
      }
    ],
    steps: optimized.steps,
    corePath: optimized.steps,
    optionalEnhancements: optimized.optionalSteps,
    understanding: {
      goal: profile.primaryGoal,
      projectType: profile.projectType,
      complexity: profile.complexity,
      codingRequired: profile.codingRequirement === 'yes',
      primaryOutcome: profile.primaryOutcome || 'Project requirements to be finalized'
    },
    requirementsList: profile.requirements,
    isDeterministicVerified: true,
    // V4/V5: Full project profile for UI consumption
    projectProfile: profile,
    // V5: Intent resolution and clarification flags
    intentResolution: profile.intentResolution,
    clarificationRequired: profile.intentResolution?.clarificationRequired,
    clarificationQuestions: profile.intentResolution?.clarificationQuestions,
    // V3: Observability debug info (not shown to users)
    debugInfo: {
      projectClassificationEvidence: [
        `projectType: ${profile.projectType}`,
        `complexity: ${profile.complexity}`,
        `codingRequirement: ${profile.codingRequirement}`
      ],
      requirementEvidence: profile.requirements.map(r => ({
        requirement: r.requirement,
        confidence: r.confidence,
        evidence: r.evidence
      })),
      rejectedCandidates,
      selectedCandidateScores,
      hardConstraintFailures,
      continuityBonuses,
      promptResolution
    }
  };
}

/**
 * Retrieves the Top Verified Tool Candidates for each stage to constrain LLM generation.
 */
export function getVerifiedCandidatePool(goal: string, assumptions?: Record<string, string>): Array<{
  stageNumber: number;
  stageName: string;
  taskTitle: string;
  requiredCapabilities: ToolCapability[];
  candidates: Tool[];
  primaryTool: Tool;
  alternativeTool?: Tool;
  defaultTemplate?: string;
  defaultVariables?: import('../types').PromptVariable[];
}> {
  const intent = extractUserIntent(goal, assumptions);
  const profile = intent.projectProfile || extractProjectProfile(goal, assumptions);
  const stageTasks = generateWorkflowFromProfile(profile, intent.requirements);

  const selectedToolIds = new Set<string>();
  const activeComplements = new Set<string>();
  let previousToolId: string | undefined = undefined;

  return stageTasks.map(stageTask => {
    const scored = rankToolsForStage(stageTask, intent, selectedToolIds, activeComplements, previousToolId);
    const topCandidates = scored.slice(0, 3).map(s => s.tool);
    const primaryTool = topCandidates[0] || VERIFIED_TOOLS_DATABASE[0];
    
    selectedToolIds.add(primaryTool.id.toLowerCase());
    previousToolId = primaryTool.id;
    
    if (Array.isArray(primaryTool.complements)) {
      primaryTool.complements.forEach(c => activeComplements.add(c.toLowerCase()));
    }

    const altTool = topCandidates[1] || (primaryTool.alternatives && primaryTool.alternatives[0] ? getVerifiedTool(primaryTool.alternatives[0]) : undefined);
    const promptTemplate = resolveToolPrompt(stageTask.toolTask, primaryTool.id, primaryTool.name, profile);

    return {
      stageNumber: stageTask.stageNumber,
      stageName: stageTask.stageName,
      taskTitle: stageTask.taskTitle,
      requiredCapabilities: stageTask.requiredCapabilities,
      candidates: topCandidates,
      primaryTool,
      alternativeTool: altTool,
      defaultTemplate: promptTemplate.template,
      defaultVariables: promptTemplate.variables
    };
  });
}
