import {
  ProjectType,
  IntentResolution,
  IntentCandidate,
  ClarificationQuestion,
  Assumption,
  TechnicalEvidence
} from '../types';

/**
 * PATHWISE INFORMATION SUFFICIENCY & INTENT RESOLUTION ENGINE V5
 * 
 * CORE PRINCIPLES:
 * 1. Measurable Uncertainty: High confidence requires specific domain evidence and candidate separation.
 * 2. Ambiguity-Awareness: Generic inputs (e.g., "build a website", "something professional") are classified as ambiguous.
 * 3. Negation-Aware Evidence Extraction: Detects explicit exclusions ("no payments", "don't need accounts").
 * 4. High-Information-Gain Clarification: Never guess or prematurely invent business details, WhatsApp, or pricing.
 * 5. Free-Text Clarification Reasoning: Parses free-form user clarifications into grounded project types.
 */

export const INTENT_CONFIDENCE_THRESHOLD = 75;
export const CANDIDATE_SEPARATION_THRESHOLD = 15;
export const MAX_CLARIFICATION_QUESTIONS = 2;

export function resolveIntent(
  goal: string,
  userSpecs?: Record<string, string>
): IntentResolution {
  const g = goal.toLowerCase().trim();

  // 1. Negation-Aware Technical Evidence Extraction
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

  // 2. Candidate Score Accumulator
  const candidatesMap: Record<ProjectType, { score: number; evidence: string[] }> = {
    business_website: { score: 0, evidence: [] },
    ecommerce_website: { score: 0, evidence: [] },
    marketing_website: { score: 0, evidence: [] },
    landing_page: { score: 0, evidence: [] },
    portfolio: { score: 0, evidence: [] },
    web_application: { score: 0, evidence: [] },
    saas: { score: 0, evidence: [] },
    dashboard: { score: 0, evidence: [] },
    marketplace: { score: 0, evidence: [] },
    mobile_app: { score: 0, evidence: [] },
    chatbot_agent: { score: 0, evidence: [] },
    algorithmic_trading: { score: 0, evidence: [] },
    video_production: { score: 0, evidence: [] },
    audio_production: { score: 0, evidence: [] },
    content_creation: { score: 0, evidence: [] },
    existing_application: { score: 0, evidence: [] },
    blog: { score: 0, evidence: [] },
    general: { score: 0, evidence: [] }
  };

  // Check userSpecs and clarified answers
  const clarifiedValue = (userSpecs?.website_purpose || userSpecs?.clarification || userSpecs?.clarified_intent || '').toLowerCase();
  
  if (clarifiedValue) {
    if (clarifiedValue.includes('business') || clarifiedValue === 'business_website') {
      candidatesMap.business_website.score += 100;
      candidatesMap.business_website.evidence.push('User selected Business / Company during intent clarification');
    } else if (clarifiedValue.includes('portfolio') || clarifiedValue === 'portfolio') {
      candidatesMap.portfolio.score += 100;
      candidatesMap.portfolio.evidence.push('User selected Personal Portfolio during intent clarification');
    } else if (clarifiedValue.includes('store') || clarifiedValue.includes('ecommerce') || clarifiedValue === 'ecommerce_website') {
      candidatesMap.ecommerce_website.score += 100;
      candidatesMap.ecommerce_website.evidence.push('User selected Online Store during intent clarification');
    } else if (clarifiedValue.includes('blog') || clarifiedValue === 'blog') {
      candidatesMap.blog.score += 100;
      candidatesMap.blog.evidence.push('User selected Blog / Content Site during intent clarification');
    } else if (clarifiedValue.includes('application') || clarifiedValue.includes('app') || clarifiedValue === 'web_application') {
      candidatesMap.web_application.score += 100;
      candidatesMap.web_application.evidence.push('User selected Web Application during intent clarification');
    } else if (clarifiedValue.includes('landing') || clarifiedValue === 'landing_page') {
      candidatesMap.landing_page.score += 100;
      candidatesMap.landing_page.evidence.push('User selected Landing Page / Campaign during intent clarification');
    }
  }

  // Handle Free-Text Clarification & Refinements embedded in goal (e.g. "build a website (Business / Company)")
  if (/\((?:business|company|business\/company)\)/i.test(g) || /\bclarification:\s*business\b/i.test(g)) {
    candidatesMap.business_website.score += 100;
    candidatesMap.business_website.evidence.push('User clarified business website intent');
  } else if (/\((?:portfolio|personal portfolio)\)/i.test(g)) {
    candidatesMap.portfolio.score += 100;
    candidatesMap.portfolio.evidence.push('User clarified portfolio intent');
  } else if (/\((?:online store|store|ecommerce)\)/i.test(g)) {
    candidatesMap.ecommerce_website.score += 100;
    candidatesMap.ecommerce_website.evidence.push('User clarified online store intent');
  } else if (/\((?:blog|content site)\)/i.test(g)) {
    candidatesMap.blog.score += 100;
    candidatesMap.blog.evidence.push('User clarified blog intent');
  } else if (/\((?:web app|web application|saas)\)/i.test(g)) {
    candidatesMap.web_application.score += 100;
    candidatesMap.web_application.evidence.push('User clarified web application intent');
  } else if (/\((?:landing page|campaign)\)/i.test(g)) {
    candidatesMap.landing_page.score += 100;
    candidatesMap.landing_page.evidence.push('User clarified landing page intent');
  }

  // Educational free-text exercises / math practice
  if (/\b(practice mathematics|practice math|solve exercises|interactive exercises|math tutor app)\b/i.test(g)) {
    candidatesMap.web_application.score += 90;
    candidatesMap.web_application.evidence.push('User requested interactive math exercises/practice application');
  }

  // --- Specific Domain Evidence Accumulation ---

  // Existing Codebase / Framework
  if (technicalEvidence.hasExistingCodebase) {
    candidatesMap.existing_application.score += 90;
    candidatesMap.existing_application.evidence.push('User referenced existing codebase/repo/framework (FastAPI, React, Django, etc.)');
  }

  // Video Production
  if (/\b(video|youtube|short|shorts|reel|tiktok|movie|film|documentary|animation|faceless|explainer video|turn my blog posts into videos)\b/i.test(g)) {
    candidatesMap.video_production.score += 95;
    candidatesMap.video_production.evidence.push('User requested video creation, YouTube short, documentary, or animation');
  }

  // Audio / Music / Voiceover
  if (/\b(song|music|audio|soundtrack|audio track|music track|beat|beats|lofi|afrobeats|vocal|vocals|lyrics|melody|compose|podcast|clean up my podcast|voiceover|voiceovers)\b/i.test(g)) {
    candidatesMap.audio_production.score += 90;
    candidatesMap.audio_production.evidence.push('User requested song, music, vocal, podcast, or audio production');
  }

  // Chatbots & Agents
  if (/\b(chatbot|faq bot|ai agent|conversational agent|virtual assistant|automate my business whatsapp|whatsapp replies|customer support chatbot)\b/i.test(g) || (/\b(bot|agent|assistant)\b/i.test(g) && /\b(chat|support|customer service|ai|whatsapp)\b/i.test(g))) {
    candidatesMap.chatbot_agent.score += 90;
    candidatesMap.chatbot_agent.evidence.push('User requested AI chatbot, customer support assistant, or conversational agent');
  }

  // Algorithmic Trading
  if (/\b(trading|ea|expert advisor|forex|mql|mql4|mql5|pinescript|metatrader|crypto bot|crypto trading bot|algorithmic trading)\b/i.test(g)) {
    candidatesMap.algorithmic_trading.score += 95;
    candidatesMap.algorithmic_trading.evidence.push('User requested trading bot, MetaTrader MQL, PineScript, or crypto automation');
  }

  // Content, CV, Graphics, Ads
  if (/\b(flyer|flyers|run ads|grow my linkedin|linkedin|cv|resume|newsletter|social media|daily posts|product photography using ai)\b/i.test(g)) {
    candidatesMap.content_creation.score += 85;
    candidatesMap.content_creation.evidence.push('User requested content writing, CV, ads, graphics, or social media creation');
  }

  // Blog / Content site
  if (!/\b(video|videos|into video)\b/i.test(g) && (/\b(blog|article site|news site|football analysis blog|tech blog|personal blog)\b/i.test(g) || (/\bblog\b/i.test(g) && !/\b(dashboard|database)\b/i.test(g)))) {
    candidatesMap.blog.score += 95;
    candidatesMap.blog.evidence.push('User specified a blog or editorial publication site');
  }

  // Data Analysis & Analytics Dashboard (Only when not explicitly a blog)
  if (!/\bblog\b/i.test(g) && /\b(analyze|analysis|sales data|dataset|csv|data analytics|visualize data|business metrics|track sales)\b/i.test(g)) {
    candidatesMap.web_application.score += 85;
    candidatesMap.content_creation.score += 65;
    candidatesMap.web_application.evidence.push('User requested data analytics, sales analysis, or reporting dashboard');
  }

  // Online Courses, LMS & Student Portals
  if (/\b(course|courses|lms|students|track progress|track their progress|membership portal|learning platform)\b/i.test(g)) {
    candidatesMap.web_application.score += 90;
    candidatesMap.web_application.evidence.push('User requested online course, student platform, or learning portal');
  }

  // E-Commerce with payments/cart/store
  if (/\b(store|online store|ecommerce|shop|card payment|add to cart and pay|pay online|cart checkout|stripe checkout|paystack store|buy products online|online wig store)\b/i.test(g) || (technicalEvidence.hasPayments && /\b(store|shop|cart|checkout)\b/i.test(g))) {
    candidatesMap.ecommerce_website.score += 105;
    candidatesMap.ecommerce_website.evidence.push('User explicitly requested store / e-commerce platform');
  }

  // Specific Small Business Showcase / Services (Wigs, Salon, Restaurant, Church, School, Clinic, Handmade)
  if (/\b(wig business|hair brand|wigs on instagram|salon|clinic|restaurant|church|school|handmade wigs|coffee shop|dentist|bakery|plumber|cleaning business)\b/i.test(g)) {
    candidatesMap.business_website.score += 85;
    candidatesMap.business_website.evidence.push('User identified a specific business entity / service domain (hair brand, church, restaurant, clinic, etc.)');
  }

  // Portfolios
  if (/\b(portfolio|photography portfolio|showcase my work|showcase my projects|portfolio for my photography|portfolio website for my programming work|developer portfolio)\b/i.test(g)) {
    candidatesMap.portfolio.score += 90;
    candidatesMap.portfolio.evidence.push('User requested personal, developer, or creative portfolio showcase');
  }

  // Landing Page
  if (/\b(landing page|waitlist|lead capture|fintech startup landing page|landing page for my new product|one-page landing page)\b/i.test(g)) {
    candidatesMap.landing_page.score += 90;
    candidatesMap.landing_page.evidence.push('User requested conversion landing page or product marketing waitlist');
  }

  // Complex Web App / Dashboard / SaaS / Auth Portals
  if (technicalEvidence.hasAdminDashboard || (technicalEvidence.hasAuth && technicalEvidence.hasUserAccounts) || /\b(saas|platform|portal|dashboard|crm|tracker|web\s*app|application|analytics dashboard|internal employee dashboard|marketplace|uber for|students can log in|review fellowship applications|manage tasks)\b/i.test(g)) {
    candidatesMap.web_application.score += 90;
    if (technicalEvidence.hasAuth || technicalEvidence.hasUserAccounts) {
      candidatesMap.web_application.score += 15;
    }
    candidatesMap.web_application.evidence.push('User requested multi-user web application, dashboard, login portal, or task management logic');
  }

  // Check for Pure Generic / Underspecified Queries (e.g. "build a website", "make a website", "something professional")
  const isSubjectiveAmbiguous = /^(make|build|create|want|need)?\s*(something|a site|a website)?\s*(professional|modern|clean|nice|good|great)?$/i.test(g);
  const isGenericWebsite = /^(build|create|make|design|need|want|develop)?\s*(a|an)?\s*(simple|modern|basic|clean|professional)?\s*(website|site|webpage)\s*(without (code|coding)|no[ -]?code)?$/i.test(g);
  const isInsufficientQuery = /^(build|create|make|need|want)\s*(something|anything|a project|an app)\s*(for my business|online)?$/i.test(g) || (g.length < 12 && !clarifiedValue);

  // Convert candidates map to sorted list
  const candidates: IntentCandidate[] = Object.entries(candidatesMap)
    .map(([type, data]) => ({
      projectType: type as ProjectType,
      score: data.score,
      confidence: Math.min(100, data.score),
      evidence: data.evidence
    }))
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score);

  const missingInformation: string[] = [];
  const ambiguityReasons: string[] = [];
  const clarificationQuestions: ClarificationQuestion[] = [];
  const assumptions: Assumption[] = [];

  let status: IntentResolution['status'] = 'resolved';
  let confidence = 85;
  let clarificationRequired = false;

  // Ambiguous & Subjective queries trigger clarification
  if ((isGenericWebsite && !clarifiedValue) || (isSubjectiveAmbiguous && !clarifiedValue) || isInsufficientQuery || candidates.length === 0) {
    status = isInsufficientQuery && candidates.length === 0 ? 'insufficient_information' : 'ambiguous';
    confidence = isSubjectiveAmbiguous ? 35 : 42; // Strictly <= 59 for generic inputs
    clarificationRequired = true;

    missingInformation.push('website_purpose', 'primary_visitor_action', 'target_audience');
    ambiguityReasons.push(
      'Goal specifies website creation or subjective style ("professional") but does not provide sufficient evidence to determine whether it is a business showcase, personal portfolio, e-commerce store, blog, or web application.'
    );

    clarificationQuestions.push({
      id: 'website_purpose',
      question: 'What are you building the website for?',
      type: 'single_select',
      required: true,
      informationGain: 0.95,
      resolves: ['project_type', 'coding_requirement', 'required_features'],
      options: [
        { id: 'business_website', label: 'Business / Company Website', description: 'Showcase brand, services, or products with contact options' },
        { id: 'portfolio', label: 'Personal Portfolio', description: 'Highlight software projects, design, photography, or skills' },
        { id: 'ecommerce_website', label: 'Online Store', description: 'Sell products with cart checkout and card payment processing' },
        { id: 'blog', label: 'Blog / Content Site', description: 'Publish articles, essays, tutorials, or newsletters' },
        { id: 'web_application', label: 'Web Application / SaaS', description: 'Interactive tool, dashboard, user logins, or custom logic' },
        { id: 'landing_page', label: 'Landing Page / Campaign', description: 'High-conversion lead capture, product launch, or waitlist' }
      ]
    });

    clarificationQuestions.push({
      id: 'visitor_action',
      question: 'What should visitors mainly do on your site?',
      type: 'single_select',
      required: false,
      informationGain: 0.75,
      resolves: ['primary_outcome', 'target_audience'],
      options: [
        { id: 'learn_contact', label: 'Learn about my business & contact me' },
        { id: 'browse_buy', label: 'Browse products & buy online' },
        { id: 'view_portfolio', label: 'Explore my past projects & resume' },
        { id: 'read_content', label: 'Read articles & subscribe' },
        { id: 'login_use_app', label: 'Log in & use interactive features' }
      ]
    });

    return {
      status,
      primaryCandidate: null, // Strictly null when clarification is mandatory
      candidates,
      confidence,
      missingInformation,
      ambiguityReasons,
      clarificationRequired,
      clarificationQuestions,
      assumptions
    };
  }

  // --- Specific Intent Evaluation ---
  const primary = candidates[0];
  const secondary = candidates[1];
  const candidateSeparation = secondary ? primary.score - secondary.score : 100;

  if (primary.score >= INTENT_CONFIDENCE_THRESHOLD && candidateSeparation >= CANDIDATE_SEPARATION_THRESHOLD) {
    status = 'resolved';
    confidence = Math.min(98, primary.score);
    clarificationRequired = false;
  } else if (primary.score >= 60) {
    status = 'partially_resolved';
    confidence = 68;
    clarificationRequired = false;
    assumptions.push({
      key: 'inferred_project_type',
      value: primary.projectType,
      evidence: primary.evidence,
      confidence: 0.70,
      reversible: true
    });
  } else {
    status = 'ambiguous';
    confidence = 48;
    clarificationRequired = true;
    missingInformation.push('project_scope');
    ambiguityReasons.push('Evidence is evenly divided between competing project types.');
    clarificationQuestions.push({
      id: 'project_type_clarification',
      question: `Did you mean to create a ${primary.projectType.replace('_', ' ')} or ${secondary?.projectType.replace('_', ' ') || 'something else'}?`,
      type: 'single_select',
      required: true,
      informationGain: 0.85,
      resolves: ['project_type'],
      options: [
        { id: primary.projectType, label: primary.projectType.replace('_', ' ') },
        { id: secondary?.projectType || 'other', label: secondary ? secondary.projectType.replace('_', ' ') : 'Other' }
      ]
    });
  }

  return {
    status,
    primaryCandidate: primary,
    candidates,
    confidence,
    missingInformation,
    ambiguityReasons,
    clarificationRequired,
    clarificationQuestions,
    assumptions
  };
}
