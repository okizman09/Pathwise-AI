import {
  ProjectProfile,
  ProjectType,
  ProjectComplexity,
  CodingRequirement,
  Requirement,
  TechnicalEvidence,
  StageTaskDefinition,
  ToolTask,
  RequirementEvidence,
  RequirementConfidence,
  ClassificationConfidence,
  IntentResolution
} from '../types';
import { resolveIntent } from './intentResolutionEngine';

/**
 * PATHWISE REQUIREMENTS INTELLIGENCE LAYER V5
 * 
 * CORE PRINCIPLES:
 * 1. Intent Resolution First: Distinguishes resolved, partially resolved, ambiguous, and insufficient information.
 * 2. Strict Evidence Attribution:
 *    - Explicit: User directly asked for it.
 *    - Strong Inference: Heavily justified by context (e.g. hair brand -> product showcase).
 *    - Weak Inference: Plausible but does NOT drive mandatory architecture.
 *    - User Clarification: Clarification responses become first-class explicit evidence (source: 'user_clarification').
 *    - Unknown: Strictly NOT added as mandatory tasks or converted into assumptions.
 * 3. Negation & Contradiction Handling:
 *    - Explicit negations ("no payments", "don't need accounts") override inferences and become explicit exclusions.
 *    - Later scope additions ("need user accounts and a dashboard") override earlier static-site assumptions.
 * 4. Minimal Workflow Principle:
 *    - Supports 1-task, 2-task, 3-task, or 4-task pipelines without forcing unnecessary domain or copywriting tasks.
 */

/**
 * 1. Extracts technical evidence, requirement confidence, exclusions, and project profile.
 */
export function extractProjectProfile(goal: string, assumptionsInput?: Record<string, string>): ProjectProfile {
  const g = goal.toLowerCase();
  const rawClean = goal.trim();

  // 1. Resolve Intent and Check Information Sufficiency
  const intentResolution = resolveIntent(goal, assumptionsInput);

  // 2. Negation-Aware Technical Evidence Extraction
  const hasAuthRaw = /\b(auth|authentication|login|sign in|signup|register|accounts|account|member login|jwt|oauth|password|log in)\b/i.test(g);
  const isAuthNegated = /(?:no|don'?t\s+(?:need|want)|without|zero)\s+(?:users?\s+)?(?:need\s+)?(?:accounts?|login|auth|authentication|passwords?)/i.test(g);
  const hasAuth = hasAuthRaw && !isAuthNegated;

  const hasDatabaseRaw = /\b(database|postgres|postgresql|sql|nosql|supabase|tables|data persistence|store records|sqlite|prisma)\b/i.test(g);
  const isDatabaseNegated = /(?:no|don'?t\s+(?:need|want)|without|zero)\s+(?:database|backend|sql|persistence)/i.test(g);
  const hasDatabase = hasDatabaseRaw && !isDatabaseNegated;

  const hasPaymentsRaw = /\b(pay|payment|payments|checkout|stripe|paystack|flutterwave|add to cart|cart|buy online|pricing checkout|billing|card payment)\b/i.test(g);
  const isPaymentsNegated = /(?:no|don'?t\s+(?:need|want)|without|zero)\s+(?:online\s+)?(?:payments?|checkout|stripe|cart|billing)/i.test(g);
  const hasPayments = hasPaymentsRaw && !isPaymentsNegated;

  const technicalEvidence: TechnicalEvidence = {
    hasAuth,
    hasDatabase,
    hasApi: /\b(api|endpoints|rest api|graphql|webhooks|fastapi|backend service|express|django|flask)\b/i.test(g),
    hasPayments,
    hasAdminDashboard: /\b(dashboard|admin dashboard|admin review|admin portal|admins review|moderation dashboard|review applications|admin|internal dashboard|employee dashboard)\b/i.test(g),
    hasUserAccounts: (/\b(create accounts|user accounts|member dashboard|fellows get a dashboard|accepted fellows|profile dashboard|accounts|student login|students can log in)\b/i.test(g)) && !isAuthNegated,
    hasExistingCodebase: /\b(already have|existing repo|github|fastapi|codebase|python backend|react frontend|django backend|existing application|have a react app|deploy it)\b/i.test(g)
  };

  // Determine Project Type from Intent Resolution
  const isAmbiguous = intentResolution.clarificationRequired;
  let projectType: ProjectType = intentResolution.primaryCandidate?.projectType || 'business_website';
  let domain = 'General';

  // Domain Mapping
  switch (projectType) {
    case 'existing_application': domain = 'Software Engineering'; break;
    case 'video_production': domain = 'Video Production'; break;
    case 'audio_production': domain = 'Audio & Music Creation'; break;
    case 'chatbot_agent': domain = 'AI Chatbots & Conversational Agents'; break;
    case 'algorithmic_trading': domain = 'Algorithmic Trading & Automation'; break;
    case 'content_creation': domain = 'Content & Digital Media Creation'; break;
    case 'ecommerce_website': domain = 'E-Commerce & Online Store'; break;
    case 'portfolio': domain = 'Portfolio & Professional Showcase'; break;
    case 'landing_page': domain = 'Marketing & Landing Pages'; break;
    case 'web_application': domain = 'Fullstack Web Application'; break;
    case 'blog': domain = 'Blog & Editorial Writing'; break;
    case 'business_website':
    default:
      domain = 'Brand & Business Showcase';
      break;
  }

  // 3. Complexity Classification
  let complexity: ProjectComplexity = 'simple';
  if (isAmbiguous) {
    complexity = 'simple';
  } else if (projectType === 'existing_application') {
    complexity = 'moderate';
  } else if (projectType === 'web_application' || technicalEvidence.hasAdminDashboard || (technicalEvidence.hasAuth && technicalEvidence.hasDatabase)) {
    complexity = 'complex';
  } else if (projectType === 'ecommerce_website' || technicalEvidence.hasPayments || technicalEvidence.hasAuth) {
    complexity = 'moderate';
  } else if (projectType === 'algorithmic_trading' || projectType === 'chatbot_agent') {
    complexity = 'moderate';
  } else {
    complexity = 'simple';
  }

  // 4. Coding Requirement Determination (with contradiction override support)
  const isExplicitNoCode = /\b(no[ -]?code|without (code|coding)|don'?t (know how to )?code|cannot code|can'?t code|zero coding|non[ -]?developer|non[ -]?technical|don't know anything about coding)\b/i.test(g);
  let codingRequirement: CodingRequirement = 'no';

  // If user later says "need user accounts and a dashboard", reconsider codingRequirement
  if (technicalEvidence.hasAdminDashboard && technicalEvidence.hasUserAccounts) {
    codingRequirement = 'optional'; // Can use Lovable/Bubble or code-first tools
  } else if (isExplicitNoCode) {
    codingRequirement = 'no';
  } else if (technicalEvidence.hasExistingCodebase || /\b(write code|custom code|python|react|fastapi|typescript|sql|backend api|i am a developer|maximum control|django)\b/i.test(g)) {
    codingRequirement = 'yes';
  } else if (projectType === 'portfolio' || projectType === 'web_application') {
    codingRequirement = 'optional';
  } else if (projectType === 'business_website' || projectType === 'marketing_website' || projectType === 'landing_page') {
    codingRequirement = 'no';
  } else {
    codingRequirement = 'no';
  }

  if (assumptionsInput?.experience_level?.toLowerCase().includes('developer') || assumptionsInput?.coding_preference === 'code') {
    codingRequirement = 'yes';
  } else if (assumptionsInput?.coding_preference === 'no_code') {
    codingRequirement = 'no';
  }

  // 5. Requirements & Evidence Extraction
  const requirementsList: RequirementEvidence[] = [];
  const excludedRequirements: string[] = [];
  const unknownRequirements: string[] = [];
  const explicitFeatures: string[] = [];
  const inferredFeatures: string[] = [];
  const profileAssumptions: string[] = [];

  // Check if intent was clarified by user
  const isFromClarification = !!(
    assumptionsInput?.website_purpose ||
    assumptionsInput?.clarification ||
    assumptionsInput?.clarified_intent ||
    /\((?:business|company|portfolio|online store|store|blog|web application|landing page)\)/i.test(g)
  );

  if (isFromClarification && intentResolution.primaryCandidate) {
    requirementsList.push({
      requirement: projectType,
      confidence: 'explicit',
      evidence: [`User clarified ${projectType.replace('_', ' ')} during intent clarification`],
      source: 'user_clarification'
    });
  }

  // Explicit Negations -> Excluded Requirements
  if (isPaymentsNegated) {
    excludedRequirements.push('payments', 'shopping_cart');
  }
  if (isAuthNegated) {
    excludedRequirements.push('authentication', 'user_accounts');
  }
  if (isDatabaseNegated) {
    excludedRequirements.push('database', 'backend_api');
  }

  // Grounded Target Audience & Outcome
  let targetAudience: string | null = null;
  let primaryOutcome: string | null = null;

  if (isAmbiguous) {
    targetAudience = null;
    primaryOutcome = null;
  } else {
    if (projectType === 'business_website' || projectType === 'marketing_website') {
      primaryOutcome = 'Launch a responsive website for your brand and services with visual tools.';

      if (/\b(recruiters|hiring managers)\b/i.test(g)) {
        targetAudience = 'Recruiters and hiring managers';
      } else if (/\b(wig|hair|salon)\b/i.test(g)) {
        targetAudience = 'Potential customers looking for hair and beauty products';
      } else if (/\b(restaurant|food|menu)\b/i.test(g)) {
        targetAudience = 'Diners and local restaurant customers';
      } else if (/\b(church|community)\b/i.test(g)) {
        targetAudience = 'Congregation members and local community visitors';
      }

      // Feature Inferences based strictly on context
      if (/\b(wig|wigs|collection|products|product|showcase|menu|catalog|handmade|hair)\b/i.test(g)) {
        requirementsList.push({
          requirement: 'product_showcase',
          confidence: 'strong_inference',
          evidence: ['User specified business collection/products to showcase'],
          source: 'inference'
        });
        inferredFeatures.push('Product / collection showcase');
      }

      // WhatsApp ONLY if requested
      if (/\b(whatsapp|whatsapp me|order through whatsapp|see my prices and whatsapp me)\b/i.test(g)) {
        requirementsList.push({
          requirement: 'whatsapp_integration',
          confidence: 'explicit',
          evidence: ['User explicitly requested WhatsApp contact/ordering integration'],
          source: 'user'
        });
        explicitFeatures.push('Direct WhatsApp click-to-chat inquiry');
      }

      requirementsList.push(
        {
          requirement: 'brand_presentation',
          confidence: 'strong_inference',
          evidence: ['Standard requirement for business identity'],
          source: 'inference'
        },
        {
          requirement: 'contact_inquiry',
          confidence: 'strong_inference',
          evidence: ['Standard requirement for client communication'],
          source: 'inference'
        }
      );

      // Unknown / Excluded requirements (Protected from scope creep)
      if (!technicalEvidence.hasAuth && !excludedRequirements.includes('authentication')) {
        excludedRequirements.push('authentication', 'user_accounts');
        unknownRequirements.push('authentication', 'user_accounts');
      }
      if (!technicalEvidence.hasDatabase && !excludedRequirements.includes('database')) {
        excludedRequirements.push('database', 'backend_api');
        unknownRequirements.push('database', 'backend_api');
      }
      if (!technicalEvidence.hasPayments && !excludedRequirements.includes('payments')) {
        excludedRequirements.push('payments', 'shopping_cart');
        unknownRequirements.push('payments', 'shopping_cart');
      }
      if (!technicalEvidence.hasAdminDashboard && !excludedRequirements.includes('admin_dashboard')) {
        excludedRequirements.push('admin_dashboard');
        unknownRequirements.push('admin_dashboard');
      }

      profileAssumptions.push('You want a responsive showcase website for your brand with visual no-code tools.');
    } else if (projectType === 'portfolio') {
      primaryOutcome = 'Publish a portfolio website highlighting your projects, photography, or skills.';
      targetAudience = /\b(developer|software|programming|recruiters)\b/i.test(g) ? 'Recruiters, engineering managers & clients' : 'Clients and collaborators';
      requirementsList.push(
        { requirement: 'project_showcase', confidence: 'explicit', evidence: ['User requested portfolio showcase'], source: 'user' },
        { requirement: 'bio_skills', confidence: 'strong_inference', evidence: ['Standard for professional portfolios'], source: 'inference' },
        { requirement: 'responsive_design', confidence: 'strong_inference', evidence: ['Mobile-first layout'], source: 'inference' }
      );
      if (!technicalEvidence.hasDatabase) excludedRequirements.push('database', 'backend_api');
      if (!technicalEvidence.hasAuth) excludedRequirements.push('authentication');
      if (!technicalEvidence.hasPayments) excludedRequirements.push('payments');
    } else if (projectType === 'ecommerce_website') {
      primaryOutcome = 'Build an online store with product catalog, cart checkout, and payment processing.';
      targetAudience = 'Online shoppers and store customers';
      requirementsList.push(
        { requirement: 'product_catalog', confidence: 'strong_inference', evidence: ['Core requirement for online store'], source: 'inference' }
      );
      if (technicalEvidence.hasPayments) {
        requirementsList.push({ requirement: 'payments', confidence: 'explicit', evidence: ['User specified card payments / online checkout'], source: 'user' });
      }
      if (technicalEvidence.hasAuth) {
        requirementsList.push({ requirement: 'authentication', confidence: 'explicit', evidence: ['User specified customer accounts / login'], source: 'user' });
      }
      if (!technicalEvidence.hasAuth && !excludedRequirements.includes('authentication')) {
        excludedRequirements.push('authentication', 'user_accounts');
      }
      if (!technicalEvidence.hasDatabase && !excludedRequirements.includes('database')) {
        excludedRequirements.push('database', 'backend_api');
      }
    } else if (projectType === 'existing_application') {
      primaryOutcome = 'Implement feature updates or authentication in your existing codebase.';
      requirementsList.push(
        { requirement: 'codebase_integration', confidence: 'explicit', evidence: ['User has existing codebase/repository'], source: 'user' }
      );
      if (technicalEvidence.hasAuth) {
        requirementsList.push({ requirement: 'authentication', confidence: 'explicit', evidence: ['User specified authentication needed'], source: 'user' });
      }
    } else if (projectType === 'video_production') {
      primaryOutcome = 'Generate an engaging, high-retention video with scriptwriting, visuals, and voiceover.';
      targetAudience = 'Viewers and social media audience';
      requirementsList.push(
        { requirement: 'scriptwriting', confidence: 'strong_inference', evidence: ['Storyboard and narrative structure'], source: 'inference' },
        { requirement: 'visual_generation', confidence: 'strong_inference', evidence: ['Cinematic visual rendering'], source: 'inference' },
        { requirement: 'voiceover', confidence: 'strong_inference', evidence: ['AI audio narration'], source: 'inference' }
      );
      excludedRequirements.push('database', 'authentication', 'payments', 'backend_api');
    } else if (projectType === 'audio_production') {
      primaryOutcome = 'Compose, render, and master studio-quality music, vocals, or podcast audio.';
      targetAudience = 'Music listeners and streaming audience';
      requirementsList.push(
        { requirement: 'music_generation', confidence: 'explicit', evidence: ['User requested music/audio creation'], source: 'user' },
        { requirement: 'audio_mastering', confidence: 'strong_inference', evidence: ['Audio balancing and polish'], source: 'inference' }
      );
      excludedRequirements.push('website_builder', 'database', 'authentication', 'payments');
    } else if (projectType === 'chatbot_agent') {
      primaryOutcome = 'Build and deploy an intelligent AI chatbot or conversational assistant.';
      targetAudience = 'Customers seeking automated support or inquiries';
      requirementsList.push(
        { requirement: 'knowledge_ingestion', confidence: 'strong_inference', evidence: ['FAQ and context data grounding'], source: 'inference' },
        { requirement: 'conversation_flow', confidence: 'strong_inference', evidence: ['Visual dialogue routing and logic'], source: 'inference' },
        { requirement: 'channel_integration', confidence: 'strong_inference', evidence: ['Web widget or WhatsApp integration'], source: 'inference' }
      );
      excludedRequirements.push('database_management', 'custom_compiler');
    } else if (projectType === 'algorithmic_trading') {
      primaryOutcome = 'Develop, backtest, and automate trading algorithms or indicators.';
      targetAudience = 'Traders and automated strategy execution';
      requirementsList.push(
        { requirement: 'strategy_logic', confidence: 'explicit', evidence: ['Trading entry/exit rules'], source: 'user' },
        { requirement: 'backtesting', confidence: 'strong_inference', evidence: ['Historical validation'], source: 'inference' },
        { requirement: 'broker_integration', confidence: 'strong_inference', evidence: ['Automated execution'], source: 'inference' }
      );
      excludedRequirements.push('website_builder', 'video_generation');
    } else if (projectType === 'blog') {
      primaryOutcome = 'Create and publish an editorial blog or content publication.';
      targetAudience = 'Readers and article subscribers';
      requirementsList.push(
        { requirement: 'content_management', confidence: 'strong_inference', evidence: ['Editorial article publishing schema'], source: 'inference' },
        { requirement: 'responsive_layout', confidence: 'strong_inference', evidence: ['Typography-optimized reading experience'], source: 'inference' }
      );
      excludedRequirements.push('ecommerce_cart', 'payments', 'database');
    } else if (projectType === 'landing_page') {
      primaryOutcome = 'Launch a high-converting landing page or waitlist.';
      targetAudience = 'Prospective users and early adopters';
      requirementsList.push(
        { requirement: 'hero_conversion', confidence: 'strong_inference', evidence: ['Lead capture / CTA presentation'], source: 'inference' },
        { requirement: 'responsive_layout', confidence: 'strong_inference', evidence: ['Mobile-first landing layout'], source: 'inference' }
      );
      if (!technicalEvidence.hasPayments) excludedRequirements.push('payments', 'shopping_cart');
      if (!technicalEvidence.hasAuth) excludedRequirements.push('authentication');
    }
  }

  const classificationConfidence: ClassificationConfidence = {
    projectType,
    confidence: Math.round((intentResolution.confidence / 100) * 100) / 100,
    evidence: intentResolution.primaryCandidate?.evidence || ['Inferred pending clarification'],
    competingTypes: intentResolution.candidates.slice(1, 3).map(c => ({
      type: c.projectType,
      score: Math.round((c.score / 100) * 100) / 100,
      reason: c.evidence[0]
    }))
  };

  return {
    projectType,
    complexity,
    codingRequirement,
    primaryOutcome,
    primaryGoal: rawClean,
    domain,
    targetAudience,
    explicitFeatures,
    inferredFeatures,
    requirements: requirementsList,
    technicalEvidence,
    excludedRequirements,
    unknownRequirements,
    assumptions: profileAssumptions,
    userSkill: codingRequirement === 'yes' ? 'advanced' : (codingRequirement === 'optional' ? 'intermediate' : 'beginner'),
    constraints: {
      budget: /\b(free|no money|\$0|zero cost|free tier|free only)\b/i.test(g) ? 'free_only' : 'unknown',
      time: 'normal',
      platform: ['web'],
      skillLevel: codingRequirement === 'yes' ? 'advanced' : (codingRequirement === 'optional' ? 'intermediate' : 'beginner'),
      coding: codingRequirement === 'yes' ? 'full_code' : (codingRequirement === 'no' ? 'no_code' : 'unknown')
    },
    classificationConfidence,
    intentResolution,
    assumptionsList: intentResolution.assumptions
  };
}

/**
 * 2. Extracts grounded requirements adhering strictly to the Inference Rule.
 */
export function extractRequirementsFromProfile(profile: ProjectProfile, goal: string): Requirement[] {
  const requirements: Requirement[] = [];

  for (const req of profile.requirements) {
    let reqType: Requirement['type'] = 'functional';
    if (req.requirement.includes('presentation') || req.requirement.includes('showcase') || req.requirement.includes('catalog') || req.requirement.includes('script') || req.requirement.includes('lyric')) {
      reqType = 'content';
    } else if (req.requirement.includes('design') || req.requirement.includes('layout')) {
      reqType = 'design';
    } else if (req.requirement.includes('auth') || req.requirement.includes('database') || req.requirement.includes('codebase') || req.requirement.includes('api')) {
      reqType = 'technical';
    }

    requirements.push({
      id: req.requirement,
      name: req.requirement.replace(/_/g, ' '),
      type: reqType,
      required: req.confidence === 'explicit' || req.confidence === 'strong_inference',
      confidence: req.confidence === 'explicit' ? 1.0 : (req.confidence === 'strong_inference' ? 0.90 : 0.60),
      source: req.source === 'user_clarification' ? 'user_clarification' : (req.source === 'user' ? 'explicit' : 'inferred')
    });
  }

  return requirements;
}

/**
 * 3. Dynamic Tool-Agnostic Workflow Task Generator (V5 Minimum Viable Toolchain Principle).
 */
export function generateWorkflowFromProfile(
  profile: ProjectProfile,
  requirements: Requirement[]
): StageTaskDefinition[] {
  const g = profile.primaryGoal.toLowerCase();

  // Check for Single-Task Direct Requests (e.g. "Create a one-page landing page in Framer")
  const isOneTaskBuildOnly = /\b(create a (?:one-page |simple )?landing page in framer|design in framer|build in framer)\b/i.test(g) && !/\b(publish|copywriting|write|domain)\b/i.test(g);
  if (isOneTaskBuildOnly) {
    return [
      {
        stageNumber: 1,
        stageName: 'Visual Landing Page Build',
        taskTitle: 'Build Responsive Landing Page in Framer',
        taskDescription: 'Generate a high-converting one-page responsive landing page layout directly in Framer.',
        toolTask: 'no_code_website_build',
        requiredCapabilities: ['website_generation', 'ui_generation'],
        preferredCategory: 'Website',
        defaultPromptTitle: 'Framer Landing Page Blueprint',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'Direct prompt-to-page generation in Framer provides instant visual design.',
        defaultProTip: 'Adjust canvas breakpoints for mobile screen responsiveness.'
      }
    ];
  }

  // Check for 2-Task Build & Publish (e.g. "Create the page and publish it")
  const isTwoTaskBuildAndPublish = /\b(create.*and publish|build.*and publish|page and publish it)\b/i.test(g);
  if (isTwoTaskBuildAndPublish) {
    return [
      {
        stageNumber: 1,
        stageName: 'Visual Website Build',
        taskTitle: 'Build Responsive Website Layout',
        taskDescription: 'Create a modern, responsive website layout in a visual canvas builder.',
        toolTask: 'no_code_website_build',
        requiredCapabilities: ['website_generation', 'ui_generation'],
        preferredCategory: 'Website',
        defaultPromptTitle: 'No-Code Website Builder Prompt',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'Visual no-code builders allow instant publishing without programming overhead.',
        defaultProTip: 'Use consistent spacing across all container sections.'
      },
      {
        stageNumber: 2,
        stageName: 'Publishing & Domain Setup',
        taskTitle: 'Publish Website & Connect Custom Domain',
        taskDescription: 'Deploy the website live with free SSL hosting and custom domain DNS configuration.',
        toolTask: 'domain_setup',
        requiredCapabilities: ['website_generation', 'automation'],
        preferredCategory: 'Website',
        defaultPromptTitle: 'Domain Publishing Guide',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'One-click publishing generates global CDN hosting with automatic SSL.',
        defaultProTip: 'Test live URL across mobile and desktop browsers.'
      }
    ];
  }

  // A. SIMPLE BRAND SHOWCASE / MARKETING WEBSITE / WHATSAPP STORE (e.g. Hair Brand, Nigerian small business)
  if (profile.projectType === 'business_website' || profile.projectType === 'marketing_website') {
    return [
      {
        stageNumber: 1,
        stageName: 'Brand Strategy & Copywriting',
        taskTitle: 'Craft Compelling Brand Narrative & Showcase Copy',
        taskDescription: 'Write high-conversion brand copy, pricing highlights, product descriptions, and contact CTAs.',
        toolTask: 'website_copywriting',
        requiredCapabilities: ['text_generation', 'text_editing'],
        preferredCategory: 'Content',
        defaultPromptTitle: 'Brand Copywriting Blueprint',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'Structuring brand narrative and product descriptions upfront makes visual layout assembly seamless.',
        defaultProTip: 'Highlight transformation benefits and collection quality.'
      },
      {
        stageNumber: 2,
        stageName: 'Visual No-Code Website Build',
        taskTitle: 'Build Responsive Brand Showcase Website',
        taskDescription: 'Use a visual no-code website builder to create a responsive, modern brand showcase with product galleries.',
        toolTask: 'no_code_website_build',
        requiredCapabilities: ['website_generation', 'ui_generation'],
        preferredCategory: 'Website',
        defaultPromptTitle: 'No-Code Website Builder Prompt',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'Visual no-code builders allow instant publishing without programming overhead.',
        defaultProTip: 'Use high-resolution product photography with consistent lighting.'
      },
      {
        stageNumber: 3,
        stageName: 'Publishing & Contact Setup',
        taskTitle: 'Connect Custom Domain & Contact Inquiries',
        taskDescription: 'Attach your brand domain name, enable contact channels, and publish live with free SSL.',
        toolTask: 'domain_setup',
        requiredCapabilities: ['website_generation', 'automation'],
        preferredCategory: 'Website',
        defaultPromptTitle: 'Domain Setup & Publishing Guide',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'Connecting your domain directly in your builder ensures instant SSL and global CDN delivery.',
        defaultProTip: 'Test contact links on a mobile device before sharing with customers.'
      }
    ];
  }

  // B. PORTFOLIO WEBSITE (e.g. Photography, Software Projects)
  if (profile.projectType === 'portfolio') {
    return [
      {
        stageNumber: 1,
        stageName: 'Portfolio Content & Case Studies',
        taskTitle: 'Write Project Case Studies & Professional Bio',
        taskDescription: 'Write concise project overviews, technical or creative highlights, problem/solution summaries, and bio.',
        toolTask: 'website_copywriting',
        requiredCapabilities: ['text_generation', 'text_editing'],
        preferredCategory: 'Content',
        defaultPromptTitle: 'Portfolio Copy Blueprint',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'Structuring case studies first ensures visitors immediately grasp your competence.',
        defaultProTip: 'Include measurable metrics or visual highlights for each project.'
      },
      {
        stageNumber: 2,
        stageName: 'Visual Portfolio Build',
        taskTitle: 'Build Responsive Portfolio Layout',
        taskDescription: 'Create a sleek portfolio layout with interactive gallery cards, skill badges, and contact triggers.',
        toolTask: 'no_code_website_build',
        requiredCapabilities: ['website_generation', 'ui_generation'],
        preferredCategory: 'Website',
        defaultPromptTitle: 'Portfolio Layout Builder Prompt',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'Modern portfolio builders give instant visual polish.',
        defaultProTip: 'Add live preview links for your flagship projects.'
      },
      {
        stageNumber: 3,
        stageName: 'Deployment & Custom Domain',
        taskTitle: 'Deploy & Publish to Custom Domain',
        taskDescription: 'Deploy your portfolio with free SSL hosting and connect your personal domain name.',
        toolTask: 'domain_setup',
        requiredCapabilities: ['website_generation'],
        preferredCategory: 'Website',
        defaultPromptTitle: 'Domain Publishing Guide',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'Custom domain portfolios convey high professional credibility.',
        defaultProTip: 'Set up an OpenGraph preview image for social sharing.'
      }
    ];
  }

  // C. E-COMMERCE WEBSITE WITH ACCOUNTS & PAYMENTS
  if (profile.projectType === 'ecommerce_website') {
    return [
      {
        stageNumber: 1,
        stageName: 'Store Catalog & Architecture',
        taskTitle: 'Define Product Schema & Store Copy',
        taskDescription: 'Structure product SKUs, pricing tiers, descriptions, customer policies, and checkout flow.',
        toolTask: 'product_copywriting',
        requiredCapabilities: ['text_generation', 'document_generation'],
        preferredCategory: 'Content',
        defaultPromptTitle: 'E-Commerce Store Catalog Blueprint',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'Structuring product metadata upfront makes checkout integration frictionless.',
        defaultProTip: 'Ensure return and shipping policies are clear to minimize chargebacks.'
      },
      {
        stageNumber: 2,
        stageName: 'Storefront UI & Cart Experience',
        taskTitle: 'Build Storefront Layout & Shopping Cart',
        taskDescription: 'Design an interactive store catalog with filterable product grids, shopping cart drawer, and user profiles.',
        toolTask: 'ecommerce_website',
        requiredCapabilities: ['website_generation', 'ui_generation', 'frontend_generation'],
        preferredCategory: 'Website',
        defaultPromptTitle: 'Storefront UI Generator',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'Clean slide-out cart drawers boost purchase conversion rates.',
        defaultProTip: 'Enable guest checkout alongside account creation.'
      },
      {
        stageNumber: 3,
        stageName: 'Payments & Account Authentication',
        taskTitle: 'Connect Payment Gateway & Customer Accounts',
        taskDescription: 'Integrate Stripe/Paystack payments, shopping cart checkout, and customer authentication.',
        toolTask: 'payment_integration',
        requiredCapabilities: ['authentication', 'workflow_automation', 'automation'],
        preferredCategory: 'Chatbots & Agents',
        defaultPromptTitle: 'Payment Gateway Setup Guide',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'PCI-compliant payment handling protects customer transactions.',
        defaultProTip: 'Always run a live test transaction before launching.'
      }
    ];
  }

  // D. CHATBOTS & CONVERSATIONAL AGENTS
  if (profile.projectType === 'chatbot_agent') {
    return [
      {
        stageNumber: 1,
        stageName: 'Knowledge Ingestion & Persona Blueprint',
        taskTitle: 'Draft Persona, FAQ Knowledge Base & System Guardrails',
        taskDescription: 'Define chatbot identity, ingestion schemas for FAQs/documents, and negative guardrails to prevent hallucinations.',
        toolTask: 'write_article',
        requiredCapabilities: ['text_generation', 'research'],
        preferredCategory: 'Content',
        defaultPromptTitle: 'Chatbot Persona & FAQ Blueprint',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'Grounded knowledge schemas eliminate AI hallucination risks.',
        defaultProTip: 'Format FAQ answers with concise bullet points under 3 sentences.'
      },
      {
        stageNumber: 2,
        stageName: 'Visual Flow & Interactive Dialogue Nodes',
        taskTitle: 'Build Conversation Flow & Fallback Logic in Voiceflow/Chatbase',
        taskDescription: 'Construct branching decision trees, semantic retrieval nodes, and escalation triggers for live human handover.',
        toolTask: 'create_business_website',
        requiredCapabilities: ['automation', 'workflow_automation'],
        preferredCategory: 'Chatbots & Agents',
        defaultPromptTitle: 'Conversation Node Flow Builder',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'Visual flow nodes handle complex branching while LLMs handle natural conversational phrasing.',
        defaultProTip: 'Always include a fallback node for out-of-scope customer queries.'
      },
      {
        stageNumber: 3,
        stageName: 'Channel Integration & Live Embed',
        taskTitle: 'Embed Web Chat Widget & Connect Messaging APIs',
        taskDescription: 'Embed the interactive web widget into your website or link WhatsApp business webhooks.',
        toolTask: 'domain_setup',
        requiredCapabilities: ['website_generation', 'automation'],
        preferredCategory: 'Website',
        defaultPromptTitle: 'Chatbot Widget Embed Guide',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'One-click widget embeds enable 24/7 automated customer resolution.',
        defaultProTip: 'Test live response speeds on mobile devices.'
      }
    ];
  }

  // E. ALGORITHMIC TRADING & STRATEGY AUTOMATION
  if (profile.projectType === 'algorithmic_trading') {
    return [
      {
        stageNumber: 1,
        stageName: 'Strategy Rules & Risk Management Spec',
        taskTitle: 'Formulate Entry/Exit Indicators & Risk Parameters',
        taskDescription: 'Define mathematical entry signals, stop-loss ratios, position sizing, and PineScript/MQL logic rules.',
        toolTask: 'write_article',
        requiredCapabilities: ['text_generation', 'research'],
        preferredCategory: 'Content',
        defaultPromptTitle: 'Trading Strategy Specification Blueprint',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'Strict mathematical risk rules are essential before writing automation scripts.',
        defaultProTip: 'Set maximum risk per trade to no more than 1-2% of total account capital.'
      },
      {
        stageNumber: 2,
        stageName: 'Script Generation & Backtesting',
        taskTitle: 'Generate Pine Script / MQL5 Script & Backtest on Historical Data',
        taskDescription: 'Generate automated indicator/EA scripts and backtest across multi-year historical price data.',
        toolTask: 'write_code',
        requiredCapabilities: ['code_generation', 'code_execution'],
        preferredCategory: 'Coding',
        defaultPromptTitle: 'TradingView PineScript / MetaTrader MQL5 Generator',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'Historical backtesting validates profitability against market volatility.',
        defaultProTip: 'Check profit factor and maximum drawdown across ranging and trending markets.'
      },
      {
        stageNumber: 3,
        stageName: 'Broker Webhook & Execution Setup',
        taskTitle: 'Connect Automated Webhook Alerts to Broker Execution',
        taskDescription: 'Set up real-time webhook alerts to trigger live paper execution on MetaTrader or broker API.',
        toolTask: 'backend_implementation',
        requiredCapabilities: ['automation', 'coding'],
        preferredCategory: 'Coding',
        defaultPromptTitle: 'Broker Execution Webhook Guide',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'Paper trading verification ensures zero execution slippage before deploying live funds.',
        defaultProTip: 'Run on a demo account for at least 30 days before trading live capital.'
      }
    ];
  }

  // F. EXISTING APPLICATION (e.g. FastAPI + React auth, Django backend)
  if (profile.projectType === 'existing_application') {
    return [
      {
        stageNumber: 1,
        stageName: 'Security Architecture & Token Spec',
        taskTitle: 'Architect JWT / OAuth2 Security Contracts',
        taskDescription: 'Define authentication flow, password hashing (bcrypt), JWT access/refresh token contracts, and protected route rules.',
        toolTask: 'write_code',
        requiredCapabilities: ['code_generation', 'text_generation', 'research'],
        preferredCategory: 'Content',
        defaultPromptTitle: 'FastAPI Authentication Spec',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'Clear token schemas and role definitions prevent security vulnerabilities.',
        defaultProTip: 'Keep JWT access tokens short-lived (15-30 min).'
      },
      {
        stageNumber: 2,
        stageName: 'Frontend Auth Forms & Route Guards',
        taskTitle: 'Implement React Login & Token State',
        taskDescription: 'Generate accessible React login, signup forms, AuthContext, and protected route wrapper components.',
        toolTask: 'frontend_generation',
        requiredCapabilities: ['ui_generation', 'frontend_generation', 'code_generation'],
        preferredCategory: 'Website',
        defaultPromptTitle: 'React Auth Components',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'Centralized AuthContext prevents token synchronization bugs across components.',
        defaultProTip: 'Add fetch/axios interceptors to attach Authorization Bearer headers.'
      },
      {
        stageNumber: 3,
        stageName: 'Backend Auth Endpoints & Terminal Verification',
        taskTitle: 'Implement FastAPI Auth Endpoints & Verify in Terminal',
        taskDescription: 'Implement login/register/refresh endpoints in FastAPI and run terminal test suites to verify token validation.',
        toolTask: 'backend_implementation',
        requiredCapabilities: ['coding', 'code_generation', 'code_execution', 'backend_generation'],
        preferredCategory: 'Coding',
        defaultPromptTitle: 'FastAPI Backend Implementation & Test Guide',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'Agentic IDEs modify backend files, install dependencies, and run terminal pytest suites autonomously.',
        defaultProTip: 'Verify token expiration edge cases in unit tests.'
      }
    ];
  }

  // G. VIDEO PRODUCTION (e.g. YouTube Short about Ancient Rome, Faceless TikTok, Documentary)
  if (profile.projectType === 'video_production') {
    return [
      {
        stageNumber: 1,
        stageName: 'Scriptwriting & Visual Storyboard',
        taskTitle: 'Write High-Retention Video Script & Storyboard Prompts',
        taskDescription: 'Draft a captivating narrative script with timestamps, visual camera angle descriptions, and pacing notes.',
        toolTask: 'write_article',
        requiredCapabilities: ['text_generation', 'text_editing'],
        preferredCategory: 'Content',
        defaultPromptTitle: 'Video Script & Scene Storyboard Blueprint',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'Detailed visual prompts and pacing instructions ensure AI video generation fidelity.',
        defaultProTip: 'Keep sentences punchy and hook the viewer in the first 3 seconds.'
      },
      {
        stageNumber: 2,
        stageName: 'AI Video Scene Generation',
        taskTitle: 'Generate Photorealistic Visual B-Roll Scenes',
        taskDescription: 'Render 1080p cinematic video scenes based on the generated visual storyboard prompts.',
        toolTask: 'create_youtube_short',
        requiredCapabilities: ['video_generation'],
        preferredCategory: 'Video',
        defaultPromptTitle: 'Cinematic AI Video Generation Prompt',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'State-of-the-art video models render high-definition dynamic camera motions.',
        defaultProTip: 'Include camera movement instructions (e.g., slow cinematic push-in, 4k photorealistic).'
      },
      {
        stageNumber: 3,
        stageName: 'Voiceover & Audio Synthesis',
        taskTitle: 'Synthesize Lifelike AI Voiceover Narration',
        taskDescription: 'Generate emotive, human-like voice narration with background atmospheric sound effects.',
        toolTask: 'generate_voiceover',
        requiredCapabilities: ['voice_generation', 'audio_generation'],
        preferredCategory: 'Audio',
        defaultPromptTitle: 'AI Voiceover Synthesis Guide',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'Lifelike emotional cadence elevates short-form video engagement.',
        defaultProTip: 'Adjust voice stability and emotion settings to match the scene tone.'
      }
    ];
  }

  // H. AUDIO & MUSIC PRODUCTION (e.g. Afrobeats song with female vocals, Podcast Cleanup)
  if (profile.projectType === 'audio_production') {
    return [
      {
        stageNumber: 1,
        stageName: 'Lyric Composition & Arrangement',
        taskTitle: 'Write Rhythmic Song Lyrics & Structural Tags',
        taskDescription: 'Draft structured lyrics with [Verse], [Chorus], [Bridge], and genre arrangement tags.',
        toolTask: 'write_article',
        requiredCapabilities: ['text_generation', 'text_editing'],
        preferredCategory: 'Content',
        defaultPromptTitle: 'Song Lyric Composition & Arrangement Blueprint',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'Explicit structural markers guide AI music models on phrasing and transition dynamics.',
        defaultProTip: 'Include tempo BPM and instrument tags in brackets.'
      },
      {
        stageNumber: 2,
        stageName: 'AI Music & Vocal Generation',
        taskTitle: 'Generate Studio-Quality Music Track with Authentic Vocals',
        taskDescription: 'Render complete stereo audio track with authentic instrumentation, vocal delivery, and mix.',
        toolTask: 'create_song',
        requiredCapabilities: ['music_generation', 'audio_generation', 'voice_generation'],
        preferredCategory: 'Audio',
        defaultPromptTitle: 'Stereo AI Music Generation Prompt',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'Advanced diffusion audio models generate rich multi-instrument stereo tracks.',
        defaultProTip: 'Prompt with specific genre sub-styles and instrumental textures.'
      },
      {
        stageNumber: 3,
        stageName: 'Audio Mastering & Vocal Polish',
        taskTitle: 'Polish Audio Stems & Master Final Mix',
        taskDescription: 'Isolate vocal stems, balance frequency levels, and master the audio for distribution.',
        toolTask: 'generate_voiceover',
        requiredCapabilities: ['audio_generation', 'voice_generation'],
        preferredCategory: 'Audio',
        defaultPromptTitle: 'Audio Stem Mastering Guide',
        defaultPromptTemplate: '',
        defaultVariables: [],
        defaultExplanation: 'Stem separation and mastering ensure clean playback across speakers and headphones.',
        defaultProTip: 'Check volume normalization (-14 LUFS) for streaming platforms.'
      }
    ];
  }

  // I. COMPLEX FULLSTACK WEB APPLICATION / SAAS / DASHBOARD / SCHOOL PORTAL
  return [
    {
      stageNumber: 1,
      stageName: 'System Architecture & Role Data Models',
      taskTitle: 'Architect Role-Based Data Schema & User Flows',
      taskDescription: 'Draft specifications for submission, review workflows, database schemas, and admin roles.',
      toolTask: 'create_web_application',
      requiredCapabilities: ['code_generation', 'text_generation', 'document_generation'],
      preferredCategory: 'Content',
      defaultPromptTitle: 'System Blueprint',
      defaultPromptTemplate: '',
      defaultVariables: [],
      defaultExplanation: 'Mapping role permissions before writing code ensures solid access controls.',
      defaultProTip: 'Define explicit status enum states.'
    },
    {
      stageNumber: 2,
      stageName: 'Multi-Role Interface & Dashboards',
      taskTitle: 'Generate Portal & Admin Review Dashboard',
      taskDescription: 'Generate responsive UI components for application submission and the administrative review dashboard.',
      toolTask: 'frontend_generation',
      requiredCapabilities: ['ui_generation', 'frontend_generation', 'code_generation'],
      preferredCategory: 'Website',
      defaultPromptTitle: 'Multi-Role Dashboard UI Generator',
      defaultPromptTemplate: '',
      defaultVariables: [],
      defaultExplanation: 'Specifying multi-role interfaces upfront ensures consistent navigation for both admins and users.',
      defaultProTip: 'Include status badges on candidate cards.'
    },
    {
      stageNumber: 3,
      stageName: 'Backend Logic, Auth & Verification',
      taskTitle: 'Implement Backend Logic, Database Queries & Run Tests',
      taskDescription: 'Implement database storage, authentication, and verify terminal builds.',
      toolTask: 'backend_implementation',
      requiredCapabilities: ['coding', 'code_generation', 'code_execution', 'backend_generation'],
      preferredCategory: 'Coding',
      defaultPromptTitle: 'Fullstack Implementation & Testing Guide',
      defaultPromptTemplate: '',
      defaultVariables: [],
      defaultExplanation: 'Agentic tools connect database queries and verify build stability in the terminal.',
      defaultProTip: 'Test applicant submission edge cases with empty and oversized attachments.'
    }
  ];
}
