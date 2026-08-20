import { Tool } from '../types';

/**
 * PATHWISE CANONICAL VERIFIED TOOLS DATABASE
 * 
 * CORE PRINCIPLE: "LLMs generate language and reasoning. Pathwise generates truth."
 * Rich, grounded metadata across all major creation categories with complete relationship graphs.
 */
export const VERIFIED_TOOLS_DATABASE: Tool[] = [
  // ==========================================
  // 1. CODING, AGENTS & DEV ENVIRONMENTS
  // ==========================================
  {
    id: 'antigravity',
    name: 'Antigravity AI (Google)',
    vendor: 'Google',
    slug: 'antigravity-ai',
    description: 'Autonomous agentic AI coding assistant and development framework designed for complex, multi-step software tasks.',
    officialUrl: 'https://antigravity.google.com',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://antigravity.google.com', 'https://developers.google.com']
    },
    pricing: {
      model: 'free',
      freeTier: true,
      startingPrice: 0,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Developer Preview • Free'
    },
    platforms: ['web', 'linux', 'macos', 'windows', 'api'],
    skillLevel: 'intermediate',
    capabilities: [
      'coding',
      'code_generation',
      'code_execution',
      'backend_generation',
      'frontend_generation',
      'automation',
      'workflow_automation'
    ],
    supportedTasks: [
      'backend_implementation',
      'authentication',
      'database_setup',
      'deployment',
      'create_web_application',
      'create_saas_application',
      'write_code',
      'debug_code'
    ],
    inputTypes: ['text', 'code', 'file'],
    outputTypes: ['code', 'text', 'data'],
    strengths: [
      'Autonomous multi-file refactoring and automated verification',
      'Terminal command execution and background build testing',
      'Deep architectural context analysis across entire repos'
    ],
    limitations: [
      'Requires active local or cloud workspace access',
      'Can take several minutes for deep multi-file refactoring runs'
    ],
    bestFor: [
      'Fullstack repository development',
      'Complex codebase migrations and debugging',
      'Automated terminal test running and verification'
    ],
    notRecommendedFor: [
      'Quick non-technical one-line copywriting',
      'Pure visual graphic design without code'
    ],
    integrations: ['Git', 'VS Code', 'Node.js', 'Python', 'Docker'],
    alternatives: ['cursor', 'windsurf', 'replit'],
    complements: ['claude', 'v0-dev', 'phind'],
    upstream: ['claude', 'chatgpt'],
    downstream: ['vercel', 'github'],
    relationships: {
      alternatives: ['cursor', 'windsurf', 'replit'],
      complements: ['claude', 'v0-dev', 'phind'],
      upstream: ['claude', 'chatgpt'],
      downstream: ['vercel', 'github']
    },
    scores: { taskFit: 9.8, easeOfUse: 8.5, outputQuality: 9.9, customization: 9.5, valueForMoney: 10.0 },
    tags: ['agentic-ai', 'autonomous-coding', 'pair-programming', 'google'],
    category: 'Coding',
    bestApplication: 'Autonomous multi-file refactoring, full-stack code generation, background execution, and automated debugging with terminal verification.',
    pricingModel: 'Free',
    pricingDetails: 'Developer Preview • Free',
    websiteUrl: 'https://antigravity.google.com',
    whyRecommended: 'Top choice for complex repo editing, code generation, background execution, and automated pair programming.',
    rating: 4.98,
    logoText: 'AG',
    badge: 'Agentic AI',
    keyFeatures: ['Agentic Execution', 'Repo Analysis', 'Automated Verification'],
    verified: true,
    starterPrompt: 'Analyze this repository, locate the bug in the authentication middleware, fix the broken token validation, and run unit tests to verify.'
  },

  {
    id: 'cursor',
    name: 'Cursor IDE',
    vendor: 'Anysphere',
    slug: 'cursor-ide',
    description: 'AI-first code editor built on VS Code with codebase indexing, multi-file edits, and instant terminal command generation.',
    officialUrl: 'https://cursor.com',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://cursor.com', 'https://docs.cursor.com']
    },
    pricing: {
      model: 'freemium',
      freeTier: true,
      startingPrice: 20,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Free hobby tier • $20/mo Pro'
    },
    platforms: ['macos', 'windows', 'linux'],
    skillLevel: 'intermediate',
    capabilities: [
      'coding',
      'code_generation',
      'code_execution',
      'frontend_generation',
      'backend_generation'
    ],
    supportedTasks: [
      'backend_implementation',
      'authentication',
      'database_setup',
      'deployment',
      'create_web_application',
      'create_saas_application',
      'create_mobile_app',
      'write_code',
      'debug_code'
    ],
    inputTypes: ['text', 'code', 'file'],
    outputTypes: ['code', 'text'],
    strengths: [
      'Full codebase semantic indexing for precise context answers',
      'Multi-file editing via Composer (Cmd+I / Cmd+K)',
      'Compatible with all VS Code extensions and settings'
    ],
    limitations: [
      'Requires local desktop installation',
      'Advanced context queries consume fast request limits'
    ],
    bestFor: [
      'Professional software engineering',
      'Large legacy codebase maintenance and refactoring'
    ],
    notRecommendedFor: [
      'Non-developers looking for 100% no-code visual builders'
    ],
    integrations: ['VS Code Extensions', 'Git', 'All Languages', 'Anthropic', 'OpenAI'],
    alternatives: ['antigravity', 'windsurf', 'github-copilot'],
    complements: ['v0-dev', 'claude', 'phind'],
    upstream: ['v0-dev', 'claude'],
    downstream: ['github', 'vercel'],
    relationships: {
      alternatives: ['antigravity', 'windsurf', 'github-copilot'],
      complements: ['v0-dev', 'claude', 'phind'],
      upstream: ['v0-dev', 'claude'],
      downstream: ['github', 'vercel']
    },
    scores: { taskFit: 9.7, easeOfUse: 9.0, outputQuality: 9.8, customization: 9.7, valueForMoney: 9.4 },
    tags: ['ai-ide', 'vs-code', 'composer', 'developer-tool'],
    category: 'Coding',
    bestApplication: 'Professional software engineering, full-stack application development, and large codebase refactoring.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free hobby tier • $20/mo Pro',
    websiteUrl: 'https://cursor.com',
    whyRecommended: 'Top AI editor for developers who want repo-wide context and rapid multi-file code generation.',
    rating: 4.94,
    logoText: 'CR',
    badge: 'AI IDE',
    keyFeatures: ['Codebase Indexing', 'Multi-file Edit', 'Terminal Agent'],
    verified: true,
    starterPrompt: 'Refactor our API route handlers to use Zod schema validation and add structured error responses.'
  },

  {
    id: 'windsurf',
    name: 'Windsurf (Codeium)',
    vendor: 'Codeium',
    slug: 'windsurf',
    description: 'Agentic developer IDE designed for collaborative human-AI software development with Cascade flow reasoning.',
    officialUrl: 'https://codeium.com/windsurf',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://codeium.com/windsurf']
    },
    pricing: {
      model: 'freemium',
      freeTier: true,
      startingPrice: 15,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Generous free tier • $15/mo Pro'
    },
    platforms: ['macos', 'windows', 'linux'],
    skillLevel: 'intermediate',
    capabilities: ['coding', 'code_generation', 'code_execution', 'frontend_generation', 'backend_generation'],
    supportedTasks: ['create_web_application', 'write_code', 'debug_code'],
    inputTypes: ['text', 'code', 'file'],
    outputTypes: ['code', 'text'],
    strengths: ['Cascade multi-step agent reasoning', 'Fast autocomplete and deep code awareness'],
    limitations: ['Desktop installation required'],
    bestFor: ['Collaborative pair programming and rapid fullstack coding'],
    notRecommendedFor: ['No-code landing page design'],
    integrations: ['VS Code', 'Git', 'All Languages'],
    alternatives: ['cursor', 'antigravity'],
    complements: ['claude', 'v0-dev'],
    relationships: { alternatives: ['cursor', 'antigravity'], complements: ['claude', 'v0-dev'] },
    scores: { taskFit: 9.5, easeOfUse: 9.2, outputQuality: 9.6, customization: 9.3, valueForMoney: 9.7 },
    tags: ['cascade', 'agentic-ide', 'codeium'],
    category: 'Coding',
    bestApplication: 'Agentic pair programming and real-time code execution.',
    pricingModel: 'Freemium',
    pricingDetails: 'Generous free tier • $15/mo Pro',
    websiteUrl: 'https://codeium.com/windsurf',
    whyRecommended: 'Cascade agent delivers deep contextual coding suggestions with seamless flow state.',
    rating: 4.91,
    logoText: 'WS',
    badge: 'Cascade Agent',
    keyFeatures: ['Cascade Flow', 'Codebase Indexing', 'Fast Infilling'],
    verified: true,
    starterPrompt: 'Inspect this FastAPI backend and implement OAuth2 JWT authentication with PostgreSQL storage.'
  },

  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    vendor: 'Microsoft / GitHub',
    slug: 'github-copilot',
    description: 'Industry-standard AI pair programmer integrated into popular IDEs with workspace search and CLI support.',
    officialUrl: 'https://github.com/features/copilot',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://github.com/features/copilot']
    },
    pricing: {
      model: 'paid',
      freeTier: false,
      startingPrice: 10,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Free for verified students/OSS • $10/mo Individual'
    },
    platforms: ['macos', 'windows', 'linux', 'api'],
    skillLevel: 'intermediate',
    capabilities: ['coding', 'code_generation'],
    supportedTasks: ['write_code', 'debug_code'],
    inputTypes: ['text', 'code'],
    outputTypes: ['code'],
    strengths: ['Seamless editor autocomplete', 'Native GitHub repository context'],
    limitations: ['No free tier for general users', 'Less autonomous multi-file terminal execution than Antigravity'],
    bestFor: ['In-line line-by-line coding velocity across large teams'],
    notRecommendedFor: ['Complete no-code web generation'],
    integrations: ['VS Code', 'JetBrains', 'Visual Studio', 'Neovim', 'GitHub'],
    alternatives: ['cursor', 'windsurf', 'antigravity'],
    complements: ['claude', 'v0-dev'],
    relationships: { alternatives: ['cursor', 'windsurf'], complements: ['claude'] },
    scores: { taskFit: 9.2, easeOfUse: 9.6, outputQuality: 9.3, customization: 8.8, valueForMoney: 8.9 },
    tags: ['copilot', 'autocomplete', 'github', 'microsoft'],
    category: 'Coding',
    bestApplication: 'In-editor autocomplete and code suggestions.',
    pricingModel: 'Paid',
    pricingDetails: 'Starts at $10/month',
    websiteUrl: 'https://github.com/features/copilot',
    whyRecommended: 'Trusted enterprise AI code completion with native GitHub integration.',
    rating: 4.87,
    logoText: 'GH',
    badge: 'Enterprise Copilot',
    keyFeatures: ['Inline Autocomplete', 'Copilot Chat', 'CLI Assistant'],
    verified: true,
    starterPrompt: 'Generate unit test cases covering all edge cases for this pricing calculation function.'
  },

  {
    id: 'replit',
    name: 'Replit AI',
    vendor: 'Replit',
    slug: 'replit-ai',
    description: 'Cloud collaborative IDE and AI Agent that builds, hosts, and deploys fullstack applications from plain text.',
    officialUrl: 'https://replit.com',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://replit.com']
    },
    pricing: {
      model: 'freemium',
      freeTier: true,
      startingPrice: 20,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Free basic tier • $20/mo Core with Agent'
    },
    platforms: ['web', 'ios', 'android'],
    skillLevel: 'beginner',
    capabilities: ['coding', 'code_generation', 'code_execution', 'website_generation', 'backend_generation'],
    supportedTasks: ['create_web_application', 'create_saas_application', 'write_code'],
    inputTypes: ['text', 'code'],
    outputTypes: ['website', 'code', 'data'],
    strengths: ['Instant 1-click cloud hosting and live URL sharing', 'Interactive fullstack AI Agent'],
    limitations: ['Free tier compute goes to sleep when idle'],
    bestFor: ['Beginners building and deploying fullstack apps without local installs'],
    notRecommendedFor: ['Large private on-premise enterprise codebases'],
    integrations: ['PostgreSQL', 'GitHub', 'Deployments'],
    alternatives: ['bolt-new', 'lovable-dev'],
    complements: ['claude', 'v0-dev'],
    relationships: { alternatives: ['bolt-new', 'lovable-dev'], complements: ['claude', 'v0-dev'] },
    scores: { taskFit: 9.3, easeOfUse: 9.7, outputQuality: 9.0, customization: 8.5, valueForMoney: 9.1 },
    tags: ['cloud-ide', 'prompt-to-app', 'hosting', 'replit-agent'],
    category: 'Coding',
    bestApplication: 'Cloud IDE and instant fullstack application hosting.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free tier available • $20/mo Core',
    websiteUrl: 'https://replit.com',
    whyRecommended: 'Easiest way to build and instantly host fullstack apps without touching local tools.',
    rating: 4.88,
    logoText: 'RP',
    badge: 'Cloud Host',
    keyFeatures: ['Replit Agent', 'Instant Deploy', 'PostgreSQL DB'],
    verified: true,
    starterPrompt: 'Build a fullstack Python Flask and React dashboard with user login and SQLite database.'
  },

  // ==========================================
  // 2. WEB & APP BUILDERS (PROMPT-TO-BUILD)
  // ==========================================
  {
    id: 'v0-dev',
    name: 'v0 by Vercel',
    vendor: 'Vercel',
    slug: 'v0-by-vercel',
    description: 'Generative UI tool that turns plain text prompts into copy-paste ready Tailwind CSS & React JSX components.',
    officialUrl: 'https://v0.dev',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://v0.dev', 'https://vercel.com/docs/v0']
    },
    pricing: {
      model: 'freemium',
      freeTier: true,
      startingPrice: 20,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Free credits monthly • $20/mo Premium'
    },
    platforms: ['web', 'api'],
    skillLevel: 'beginner',
    capabilities: [
      'ui_generation',
      'frontend_generation',
      'code_generation',
      'website_generation'
    ],
    supportedTasks: [
      'frontend_generation',
      'website_ui_design',
      'create_landing_page',
      'create_business_website',
      'create_portfolio',
      'create_web_application',
      'write_code'
    ],
    inputTypes: ['text', 'image', 'code'],
    outputTypes: ['code', 'website', 'image'],
    strengths: [
      'Instant production-quality React and Shadcn UI JSX output',
      'Clean Tailwind CSS styling with dark mode support',
      'Interactive visual iteration with click-to-edit elements'
    ],
    limitations: [
      'Focuses strictly on frontend UI; does not write backend database logic'
    ],
    bestFor: [
      'Rapid frontend UI drafting and component prototyping',
      'Designing modern SaaS dashboards and landing pages'
    ],
    notRecommendedFor: [
      'Fullstack backend API logic or database queries'
    ],
    integrations: ['Next.js', 'Tailwind CSS', 'Shadcn UI', 'GitHub', 'Vercel'],
    alternatives: ['lovable-dev', 'bolt-new', 'framer'],
    complements: ['cursor', 'antigravity', 'claude'],
    upstream: ['claude', 'chatgpt'],
    downstream: ['cursor', 'antigravity', 'vercel'],
    relationships: {
      alternatives: ['lovable-dev', 'bolt-new', 'framer'],
      complements: ['cursor', 'antigravity', 'claude'],
      upstream: ['claude', 'chatgpt'],
      downstream: ['cursor', 'antigravity', 'vercel']
    },
    scores: { taskFit: 9.6, easeOfUse: 9.4, outputQuality: 9.6, customization: 8.8, valueForMoney: 9.2 },
    tags: ['generative-ui', 'shadcn', 'tailwind', 'react', 'vercel'],
    category: 'Website',
    bestApplication: 'Rapid front-end UI drafting, Shadcn React component creation, and modern dark-mode dashboard layouts.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free credits monthly • $20/mo Premium',
    websiteUrl: 'https://v0.dev',
    whyRecommended: 'Produces production-ready React JSX components with shadcn/ui and Tailwind styles in seconds.',
    rating: 4.92,
    logoText: 'V0',
    badge: 'Generative UI',
    keyFeatures: ['Shadcn UI', 'React Copy-Paste', 'Design Iteration'],
    verified: true,
    starterPrompt: 'Create a dark-mode sleek analytics dashboard card using Tailwind CSS, lucide-react icons, and smooth hover glassmorphism.'
  },

  {
    id: 'lovable-dev',
    name: 'Lovable.dev',
    vendor: 'Lovable',
    slug: 'lovable-dev',
    description: 'Full-stack web application builder that generates React frontend code and Supabase backends directly from text prompts.',
    officialUrl: 'https://lovable.dev',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://lovable.dev', 'https://docs.lovable.dev']
    },
    pricing: {
      model: 'freemium',
      freeTier: true,
      startingPrice: 20,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Free starter tier • Paid plans from $20/mo'
    },
    platforms: ['web'],
    skillLevel: 'beginner',
    capabilities: [
      'website_generation',
      'frontend_generation',
      'backend_generation',
      'database_generation',
      'authentication'
    ],
    supportedTasks: [
      'frontend_generation',
      'backend_implementation',
      'database_setup',
      'authentication',
      'create_web_application',
      'create_saas_application',
      'create_landing_page',
      'write_code'
    ],
    inputTypes: ['text', 'image', 'file'],
    outputTypes: ['website', 'code'],
    strengths: [
      'Fastest prompt-to-production web application builder',
      'Built-in Supabase authentication and relational database provisioning',
      'Direct GitHub repository export and sync'
    ],
    limitations: [
      'Complex enterprise backend workflows require custom manual code modifications'
    ],
    bestFor: [
      'Founders building MVPs with database and auth in hours',
      'Internal team CRUD tools and directories'
    ],
    notRecommendedFor: [
      'Low-level hardware driver development'
    ],
    integrations: ['Supabase', 'GitHub', 'Tailwind CSS', 'Vite'],
    alternatives: ['bolt-new', 'v0-dev'],
    complements: ['claude', 'cursor', 'framer'],
    relationships: {
      alternatives: ['bolt-new', 'v0-dev'],
      complements: ['claude', 'cursor', 'framer']
    },
    scores: { taskFit: 9.5, easeOfUse: 9.6, outputQuality: 9.3, customization: 8.7, valueForMoney: 9.1 },
    tags: ['fullstack-builder', 'supabase', 'mvp', 'react'],
    category: 'Coding',
    bestApplication: 'Rapid full-stack web application development with database schemas and user authentication in minutes.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free starter tier • Paid plans from $20/mo',
    websiteUrl: 'https://lovable.dev',
    whyRecommended: 'Fastest prompt-to-production web application development with database and auth integration.',
    rating: 4.91,
    logoText: 'LV',
    badge: 'Fullstack Builder',
    keyFeatures: ['React Frontend', 'Supabase Backend', 'GitHub Export'],
    verified: true,
    starterPrompt: 'Build a community job board with applicant profiles, employer job postings, and Supabase auth.'
  },

  {
    id: 'bolt-new',
    name: 'Bolt.new',
    vendor: 'StackBlitz',
    slug: 'bolt-new',
    description: 'In-browser AI web development environment that creates, installs dependencies, and deploys fullstack apps from prompts.',
    officialUrl: 'https://bolt.new',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://bolt.new', 'https://stackblitz.com']
    },
    pricing: {
      model: 'freemium',
      freeTier: true,
      startingPrice: 20,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Free daily tokens • $20/mo Pro'
    },
    platforms: ['web'],
    skillLevel: 'beginner',
    capabilities: [
      'code_generation',
      'frontend_generation',
      'backend_generation',
      'code_execution',
      'website_generation',
      'database_generation'
    ],
    supportedTasks: [
      'create_web_application',
      'create_saas_application',
      'create_landing_page',
      'write_code',
      'debug_code'
    ],
    inputTypes: ['text', 'code', 'file'],
    outputTypes: ['website', 'code', 'data'],
    strengths: [
      'Runs full Node.js dev server directly inside browser WebContainers',
      'Installs npm packages and runs live previews automatically',
      'One-click deployment to Netlify or GitHub export'
    ],
    limitations: [
      'Browser memory limitations on massive monorepos'
    ],
    bestFor: [
      'Zero-setup prompt-to-app prototyping',
      'Fullstack React/Node/Supabase web applications'
    ],
    notRecommendedFor: [
      'Native mobile applications or C++/Rust embedded software'
    ],
    integrations: ['Next.js', 'Vite', 'Supabase', 'Netlify', 'GitHub'],
    alternatives: ['lovable-dev', 'v0-dev', 'antigravity'],
    complements: ['claude', 'cursor', 'framer'],
    relationships: {
      alternatives: ['lovable-dev', 'v0-dev', 'antigravity'],
      complements: ['claude', 'cursor', 'framer']
    },
    scores: { taskFit: 9.4, easeOfUse: 9.5, outputQuality: 9.1, customization: 8.5, valueForMoney: 9.0 },
    tags: ['webcontainers', 'fullstack', 'prompt-to-app', 'stackblitz'],
    category: 'Coding',
    bestApplication: 'Building and launching full-stack Node/React web apps directly in the browser without local setup.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free tier available • $20/mo Pro',
    websiteUrl: 'https://bolt.new',
    whyRecommended: 'Runs Node.js directly inside your browser WebContainer to build and preview live web apps.',
    rating: 4.9,
    logoText: 'BN',
    badge: 'Prompt-to-App',
    keyFeatures: ['WebContainers', 'Live Terminal', 'Fullstack Prompting'],
    verified: true,
    starterPrompt: 'Build a fullstack SaaS landing page with Next.js, Tailwind CSS, Supabase authentication, and Stripe payment checkout integration.'
  },

  {
    id: 'framer',
    name: 'Framer AI',
    vendor: 'Framer',
    slug: 'framer-ai',
    description: 'Design and deploy production-ready responsive websites directly from text prompts and visual canvas.',
    officialUrl: 'https://framer.com',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://framer.com', 'https://framer.com/docs']
    },
    pricing: {
      model: 'freemium',
      freeTier: true,
      startingPrice: 15,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Free site hosting • $15/mo Mini site'
    },
    platforms: ['web', 'macos', 'windows'],
    skillLevel: 'beginner',
    capabilities: [
      'website_generation',
      'ui_generation',
      'frontend_generation'
    ],
    supportedTasks: [
      'no_code_website_build',
      'business_website',
      'portfolio_website',
      'landing_page',
      'website_ui_design',
      'domain_setup',
      'contact_form_setup',
      'create_landing_page',
      'create_business_website',
      'create_portfolio'
    ],
    inputTypes: ['text', 'image', 'file'],
    outputTypes: ['website'],
    strengths: [
      'Highest quality visual landing page builder with interactive scroll animations',
      'Instant custom domain publishing and built-in CMS',
      'Figma-to-Framer copy-paste fidelity'
    ],
    limitations: [
      'Complex relational databases with user auth require external third-party embeds'
    ],
    bestFor: [
      'Marketing landing pages, startup websites, and portfolio showcases',
      'No-code creators with zero programming experience'
    ],
    notRecommendedFor: [
      'Complex fullstack multi-tenant web applications'
    ],
    integrations: ['Figma', 'Unsplash', 'Custom Domain DNS', 'Google Analytics'],
    alternatives: ['webflow', 'v0-dev'],
    complements: ['claude', 'midjourney', 'chatbase', 'voiceflow'],
    relationships: {
      alternatives: ['webflow', 'v0-dev'],
      complements: ['claude', 'midjourney', 'chatbase', 'voiceflow']
    },
    scores: { taskFit: 9.6, easeOfUse: 9.3, outputQuality: 9.7, customization: 9.5, valueForMoney: 9.2 },
    tags: ['website-builder', 'no-code', 'animations', 'cms', 'framer'],
    category: 'Website',
    bestApplication: 'Designing, animating, and hosting high-converting marketing landing pages with no code.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free site hosting • $15/mo Mini site',
    websiteUrl: 'https://framer.com',
    whyRecommended: 'Generates full responsive websites with CMS, animations, and custom domain publishing.',
    rating: 4.85,
    logoText: 'FR',
    badge: 'Best Web Builder',
    keyFeatures: ['Prompt-to-Site', 'Figma Import', 'SEO Optimized'],
    verified: true,
    starterPrompt: 'Build a sleek, dark-theme website for a modern AI software product featuring a hero section, feature grid, and pricing cards.'
  },

  {
    id: 'webflow',
    name: 'Webflow',
    vendor: 'Webflow',
    slug: 'webflow',
    description: 'Visual web design platform and CMS for building responsive custom websites without code.',
    officialUrl: 'https://webflow.com',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://webflow.com']
    },
    pricing: {
      model: 'freemium',
      freeTier: true,
      startingPrice: 14,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Free starter site • $14/mo Basic'
    },
    platforms: ['web'],
    skillLevel: 'intermediate',
    capabilities: ['website_generation', 'ui_generation'],
    supportedTasks: [
      'no_code_website_build',
      'business_website',
      'portfolio_website',
      'landing_page',
      'website_ui_design',
      'domain_setup',
      'contact_form_setup',
      'create_business_website',
      'create_landing_page',
      'create_portfolio'
    ],
    inputTypes: ['text', 'image'],
    outputTypes: ['website'],
    strengths: ['Full CSS box model visual control', 'Powerful native CMS and client billing'],
    limitations: ['Steeper learning curve than Framer'],
    bestFor: ['Agencies and designers building bespoke client websites'],
    notRecommendedFor: ['Quick 5-minute prompt-to-app builds'],
    integrations: ['Figma', 'Zapier', 'HubSpot'],
    alternatives: ['framer', 'v0-dev'],
    complements: ['claude', 'midjourney'],
    relationships: { alternatives: ['framer', 'v0-dev'], complements: ['claude'] },
    scores: { taskFit: 9.4, easeOfUse: 8.2, outputQuality: 9.7, customization: 9.8, valueForMoney: 8.9 },
    tags: ['no-code', 'cms', 'agency-web', 'responsive'],
    category: 'Website',
    bestApplication: 'Custom visual website design with advanced CMS.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free starter • $14/mo Basic',
    websiteUrl: 'https://webflow.com',
    whyRecommended: 'Complete visual control over CSS layout and animations with enterprise hosting.',
    rating: 4.86,
    logoText: 'WF',
    badge: 'Pro Web CMS',
    keyFeatures: ['Visual CSS', 'Native CMS', 'Enterprise Hosting'],
    verified: true,
    starterPrompt: 'Design a responsive marketing agency portfolio with CMS project showcases and contact form.'
  },

  // ==========================================
  // 3. WRITING, RESEARCH & KNOWLEDGE
  // ==========================================
  {
    id: 'claude',
    name: 'Claude 3.5 Sonnet',
    vendor: 'Anthropic',
    slug: 'claude-3-5-sonnet',
    description: 'Superior nuanced writer and complex reasoning model for long-form copywriting, technical architecture, and PRDs.',
    officialUrl: 'https://claude.ai',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://claude.ai', 'https://anthropic.com']
    },
    pricing: {
      model: 'freemium',
      freeTier: true,
      startingPrice: 20,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Free tier available • $20/mo Pro'
    },
    platforms: ['web', 'ios', 'android', 'api'],
    skillLevel: 'beginner',
    capabilities: [
      'text_generation',
      'text_editing',
      'coding',
      'code_generation',
      'document_generation',
      'research'
    ],
    supportedTasks: [
      'brand_strategy',
      'website_copywriting',
      'product_copywriting',
      'write_article',
      'create_social_media_content',
      'create_presentation',
      'create_web_application',
      'write_code',
      'debug_code'
    ],
    inputTypes: ['text', 'code', 'file', 'image'],
    outputTypes: ['text', 'code', 'presentation'],
    strengths: [
      'Exceptional human-like natural prose and nuanced copywriting',
      'Top-tier technical architecture specifications and PRD drafting',
      'Artifacts UI for side-by-side interactive previews'
    ],
    limitations: [
      'No built-in live internet web crawling in consumer chat'
    ],
    bestFor: [
      'Long-form articles, essays, and editorial copywriting',
      'Software technical specifications and PRDs',
      'Refactoring and explaining complex code'
    ],
    notRecommendedFor: [
      'Generating photorealistic image or video pixels directly'
    ],
    integrations: ['Claude Artifacts', 'Anthropic API', 'Cursor'],
    alternatives: ['chatgpt', 'deepseek-r1', 'perplexity'],
    complements: ['v0-dev', 'antigravity', 'cursor', 'kling-ai'],
    downstream: ['v0-dev', 'cursor', 'antigravity'],
    relationships: {
      alternatives: ['chatgpt', 'deepseek-r1'],
      complements: ['v0-dev', 'antigravity', 'cursor', 'kling-ai'],
      downstream: ['v0-dev', 'cursor', 'antigravity']
    },
    scores: { taskFit: 9.9, easeOfUse: 9.8, outputQuality: 9.9, customization: 9.4, valueForMoney: 9.6 },
    tags: ['frontier-llm', 'artifacts', 'nuanced-writing', 'anthropic'],
    category: 'Content',
    bestApplication: 'Nuanced long-form technical writing, system architectural design, code refactoring, and Artifact side-by-side rendering.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free tier available • $20/mo Pro',
    websiteUrl: 'https://claude.ai',
    whyRecommended: 'Produces the highest quality code logic, system architecture specs, and natural human writing.',
    rating: 4.96,
    logoText: 'CL',
    badge: 'Top Pick for Writing & Code',
    keyFeatures: ['Artifacts UI', '200k Token Context', 'High Coding Quality'],
    verified: true,
    starterPrompt: 'Write a comprehensive technical specification for an event-driven microservices architecture using Node.js, Redis, and WebSockets.'
  },

  {
    id: 'chatgpt',
    name: 'ChatGPT (GPT-4o)',
    vendor: 'OpenAI',
    slug: 'chatgpt-gpt-4o',
    description: 'Versatile conversational AI for scripting, social media repurposing, algorithmic logic, and prompt refining.',
    officialUrl: 'https://chatgpt.com',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://chatgpt.com', 'https://openai.com']
    },
    pricing: {
      model: 'freemium',
      freeTier: true,
      startingPrice: 20,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Free tier available • $20/mo Plus'
    },
    platforms: ['web', 'macos', 'windows', 'ios', 'android', 'api'],
    skillLevel: 'beginner',
    capabilities: [
      'text_generation',
      'text_editing',
      'web_search',
      'coding',
      'code_generation',
      'data_analysis',
      'image_generation'
    ],
    supportedTasks: [
      'brand_strategy',
      'website_copywriting',
      'product_copywriting',
      'write_article',
      'create_social_media_content',
      'analyze_data',
      'write_code'
    ],
    inputTypes: ['text', 'image', 'audio', 'file', 'code'],
    outputTypes: ['text', 'image', 'code', 'data'],
    strengths: [
      'Versatile all-around assistant with live web search and Python sandbox',
      'Fast social media repurposing and scriptwriting',
      'Voice mode and multi-modal file analysis'
    ],
    limitations: [
      'Usage caps on frontier models during peak times for free users'
    ],
    bestFor: [
      'Quick scriptwriting, brainstorming, and social repurposing',
      'Prompt refinement and data analysis'
    ],
    notRecommendedFor: [
      'Autonomous multi-file repository modifications in an IDE'
    ],
    integrations: ['GPT Store', 'OpenAI API', 'DALL-E', 'Python Sandbox'],
    alternatives: ['claude', 'deepseek-r1', 'perplexity'],
    complements: ['kling-ai', 'elevenlabs', 'v0-dev'],
    relationships: {
      alternatives: ['claude', 'deepseek-r1', 'perplexity'],
      complements: ['kling-ai', 'elevenlabs', 'v0-dev']
    },
    scores: { taskFit: 9.5, easeOfUse: 9.8, outputQuality: 9.4, customization: 9.0, valueForMoney: 9.5 },
    tags: ['gpt-4o', 'general-ai', 'scriptwriting', 'openai'],
    category: 'Content',
    bestApplication: 'Complex prompt engineering, general text drafting, code scripting, and interactive step-by-step problem solving.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free tier available • $20/mo Plus',
    websiteUrl: 'https://chatgpt.com',
    whyRecommended: 'Easiest entry point for plain-text scripting, ideation, and structured prompt generation.',
    rating: 4.9,
    logoText: 'GPT',
    badge: 'Versatile AI',
    keyFeatures: ['Scripting', 'Custom Instructions', 'Data Analysis', 'Code Generation'],
    verified: true,
    starterPrompt: 'Act as a senior software developer. Write a clear, production-ready Python script with error handling to clean and deduplicate CSV records.'
  },

  {
    id: 'perplexity',
    name: 'Perplexity AI',
    vendor: 'Perplexity',
    slug: 'perplexity-ai',
    description: 'Conversational search engine that provides up-to-date answers with cited web sources, academic papers, and live news.',
    officialUrl: 'https://perplexity.ai',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://perplexity.ai']
    },
    pricing: {
      model: 'freemium',
      freeTier: true,
      startingPrice: 20,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Free tier • $20/mo Pro'
    },
    platforms: ['web', 'ios', 'android'],
    skillLevel: 'beginner',
    capabilities: [
      'research',
      'web_search',
      'data_analysis',
      'text_generation'
    ],
    supportedTasks: [
      'write_article',
      'analyze_data'
    ],
    inputTypes: ['text', 'file', 'url'],
    outputTypes: ['text', 'data'],
    strengths: [
      'Real-time web citations for verified facts and sources',
      'Pro Search multi-step query decomposition'
    ],
    limitations: [
      'Not designed for autonomous code file generation'
    ],
    bestFor: [
      'Market research, competitor analysis, historical fact-checking, and topic synthesis'
    ],
    notRecommendedFor: [
      'Direct frontend web design generation'
    ],
    integrations: ['Wolfram Alpha', 'Academic Databases'],
    alternatives: ['phind', 'chatgpt'],
    complements: ['claude', 'kling-ai', 'elevenlabs'],
    downstream: ['claude', 'chatgpt'],
    relationships: {
      alternatives: ['phind', 'chatgpt'],
      complements: ['claude', 'kling-ai', 'elevenlabs'],
      downstream: ['claude', 'chatgpt']
    },
    scores: { taskFit: 9.3, easeOfUse: 9.6, outputQuality: 9.4, customization: 8.5, valueForMoney: 9.3 },
    tags: ['ai-search', 'citations', 'research', 'web-search'],
    category: 'Research & Data',
    bestApplication: 'Market research, competitor analysis, factual verification, and real-time news synthesis.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free tier • $20/mo Pro',
    websiteUrl: 'https://perplexity.ai',
    whyRecommended: 'Delivers real-time web citations for verified facts and source attribution.',
    rating: 4.92,
    logoText: 'PX',
    badge: 'AI Search',
    keyFeatures: ['Live Citations', 'Pro Search Reasoning', 'File Upload Analysis'],
    verified: true,
    starterPrompt: 'Analyze the top 5 competitors in the AI customer service market with pricing, market share, and core differentiators.'
  },

  {
    id: 'notebooklm',
    name: 'NotebookLM (Google)',
    vendor: 'Google',
    slug: 'notebooklm',
    description: 'Personalized AI research assistant grounded in your uploaded documents, PDFs, and Audio Overviews.',
    officialUrl: 'https://notebooklm.google.com',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://notebooklm.google.com']
    },
    pricing: {
      model: 'free',
      freeTier: true,
      startingPrice: 0,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: '100% Free with Google Account'
    },
    platforms: ['web'],
    skillLevel: 'beginner',
    capabilities: ['research', 'document_generation', 'text_generation', 'audio_generation'],
    supportedTasks: ['create_podcast', 'write_article', 'analyze_data'],
    inputTypes: ['text', 'file', 'url'],
    outputTypes: ['text', 'audio'],
    strengths: ['Zero hallucination document grounding', 'Incredible 2-host Audio Overview podcast generation'],
    limitations: ['Requires uploading source material first'],
    bestFor: ['Synthesizing dense research papers and generating podcast discussions'],
    notRecommendedFor: ['Fullstack app coding'],
    integrations: ['Google Drive', 'Google Docs', 'PDFs'],
    alternatives: ['perplexity', 'claude'],
    complements: ['claude', 'elevenlabs'],
    relationships: { alternatives: ['perplexity'], complements: ['claude'] },
    scores: { taskFit: 9.6, easeOfUse: 9.7, outputQuality: 9.7, customization: 8.8, valueForMoney: 10.0 },
    tags: ['audio-overview', 'research', 'google', 'grounded-ai'],
    category: 'Research & Data',
    bestApplication: 'Document-grounded research synthesis and audio overview podcast generation.',
    pricingModel: 'Free',
    pricingDetails: '100% Free',
    websiteUrl: 'https://notebooklm.google.com',
    whyRecommended: 'Strictly grounded in your documents with game-changing Audio Overview podcast creation.',
    rating: 4.93,
    logoText: 'NL',
    badge: 'Audio Overview',
    keyFeatures: ['Grounded Citations', 'Audio Deep Dive', 'Google Drive Sync'],
    verified: true,
    starterPrompt: 'Summarize the core themes and controversial points from the uploaded documents.'
  },

  {
    id: 'phind',
    name: 'Phind',
    vendor: 'Phind',
    slug: 'phind',
    description: 'Developer-focused AI search engine and coding copilot that provides instant technical answers with verified source citations.',
    officialUrl: 'https://phind.com',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://phind.com']
    },
    pricing: {
      model: 'freemium',
      freeTier: true,
      startingPrice: 20,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Free tier • $20/mo Pro'
    },
    platforms: ['web', 'api'],
    skillLevel: 'beginner',
    capabilities: [
      'research',
      'web_search',
      'coding',
      'code_generation',
      'data_analysis'
    ],
    supportedTasks: [
      'write_code',
      'debug_code',
      'analyze_data'
    ],
    inputTypes: ['text', 'code'],
    outputTypes: ['text', 'code'],
    strengths: [
      'Cites official developer documentation directly alongside code',
      'Fast, high-accuracy answers for obscure library errors'
    ],
    limitations: [
      'Focuses on query research rather than multi-file autonomous repo commits'
    ],
    bestFor: [
      'Debugging runtime errors and looking up modern API contracts',
      'Technical architecture research'
    ],
    notRecommendedFor: [
      'Rendering full visual video or audio media'
    ],
    integrations: ['VS Code', 'Chrome'],
    alternatives: ['perplexity'],
    complements: ['cursor', 'antigravity'],
    relationships: {
      alternatives: ['perplexity'],
      complements: ['cursor', 'antigravity']
    },
    scores: { taskFit: 9.2, easeOfUse: 9.4, outputQuality: 9.3, customization: 8.0, valueForMoney: 9.5 },
    tags: ['developer-search', 'copilot', 'documentation', 'debugging'],
    category: 'Research & Data',
    bestApplication: 'Debugging complex runtime errors, library API lookups, and technical documentation research.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free tier • $20/mo Pro',
    websiteUrl: 'https://phind.com',
    whyRecommended: 'Cites verified documentation links directly alongside runnable code solutions.',
    rating: 4.88,
    logoText: 'PH',
    badge: 'Dev Search',
    keyFeatures: ['Live Web Search', 'Developer Docs', 'Fast Inference'],
    verified: true,
    starterPrompt: 'Explain how to implement WebSockets in FastAPI with connection authentication and reconnection handling.'
  },

  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    vendor: 'DeepSeek',
    slug: 'deepseek-r1',
    description: 'Open-weights reasoning model specializing in complex logic, algorithmic problem-solving, math, and code generation.',
    officialUrl: 'https://deepseek.com',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://deepseek.com', 'https://github.com/deepseek-ai/DeepSeek-R1']
    },
    pricing: {
      model: 'free',
      freeTier: true,
      startingPrice: 0,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Free web chat • Open weights on Ollama / HuggingFace'
    },
    platforms: ['web', 'api', 'linux', 'macos', 'windows'],
    skillLevel: 'intermediate',
    capabilities: [
      'coding',
      'code_generation',
      'data_analysis',
      'research'
    ],
    supportedTasks: [
      'write_code',
      'debug_code',
      'analyze_data'
    ],
    inputTypes: ['text', 'code'],
    outputTypes: ['text', 'code'],
    strengths: [
      'State-of-the-art chain-of-thought mathematical reasoning',
      'Exceptional algorithmic logic for trading systems, MQL5, and Python analytics',
      'Zero cost and open-weights availability'
    ],
    limitations: [
      'Raw LLM interface without built-in visual UI canvas'
    ],
    bestFor: [
      'Algorithmic trading strategies and complex mathematical coding',
      'Deep logic verification and debugging'
    ],
    notRecommendedFor: [
      'Direct visual UI design or video generation'
    ],
    integrations: ['Ollama', 'LangChain', 'OpenAI SDK', 'HuggingFace'],
    alternatives: ['claude', 'chatgpt'],
    complements: ['cursor', 'antigravity'],
    relationships: {
      alternatives: ['claude', 'chatgpt'],
      complements: ['cursor', 'antigravity']
    },
    scores: { taskFit: 9.8, easeOfUse: 8.8, outputQuality: 9.9, customization: 9.6, valueForMoney: 10.0 },
    tags: ['reasoning', 'open-weights', 'math-logic', 'algorithms'],
    category: 'Coding',
    bestApplication: 'Algorithmic trading logic, mathematical proofs, complex code reasoning, and cost-effective local inference.',
    pricingModel: 'Free',
    pricingDetails: 'Free web chat • Open weights on Ollama / HuggingFace',
    websiteUrl: 'https://deepseek.com',
    whyRecommended: 'SOTA reasoning performance matching proprietary frontier models at zero cost.',
    rating: 4.95,
    logoText: 'DS',
    badge: 'Reasoning SOTA',
    keyFeatures: ['Chain of Thought', 'Math & Logic', 'Open Weights'],
    verified: true,
    starterPrompt: 'Write an MQL5 Expert Advisor implementing a 50 EMA and 200 EMA crossover strategy with ATR-based dynamic stop loss.'
  },

  // ==========================================
  // 4. VIDEO & VISUAL MEDIA CREATION
  // ==========================================
  {
    id: 'kling-ai',
    name: 'Kling AI',
    vendor: 'Kuaishou',
    slug: 'kling-ai',
    description: 'Next-generation video creation model capable of rendering 1080p 60fps cinematic clips with physical realism.',
    officialUrl: 'https://klingai.com',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://klingai.com']
    },
    pricing: {
      model: 'freemium',
      freeTier: true,
      startingPrice: 10,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Daily free credits • Paid tiers from $10/mo'
    },
    platforms: ['web'],
    skillLevel: 'intermediate',
    capabilities: [
      'video_generation',
      'image_generation'
    ],
    supportedTasks: [
      'create_youtube_video',
      'create_youtube_short',
      'create_tiktok_video'
    ],
    inputTypes: ['text', 'image'],
    outputTypes: ['video', 'image'],
    strengths: [
      'High-fidelity physical realism and natural human camera motion',
      'Smooth 60fps 1080p cinematic video renders',
      'Accurate Image-to-Video scene extension'
    ],
    limitations: [
      'High generation queue times during peak server loads'
    ],
    bestFor: [
      'Cinematic b-roll, storytelling clips, and commercial video visuals'
    ],
    notRecommendedFor: [
      'Text copywriting or code generation'
    ],
    integrations: ['Web Exporter'],
    alternatives: ['runway', 'pika'],
    complements: ['claude', 'chatgpt', 'elevenlabs', 'udio', 'capcut'],
    upstream: ['claude', 'chatgpt', 'midjourney'],
    downstream: ['capcut', 'descript'],
    relationships: {
      alternatives: ['runway', 'pika'],
      complements: ['claude', 'chatgpt', 'elevenlabs', 'udio', 'capcut'],
      upstream: ['claude', 'chatgpt', 'midjourney'],
      downstream: ['capcut', 'descript']
    },
    scores: { taskFit: 9.6, easeOfUse: 9.0, outputQuality: 9.7, customization: 8.9, valueForMoney: 9.2 },
    tags: ['video-ai', 'cinematic', '60fps', 'physics-realism'],
    category: 'Video',
    bestApplication: 'Cinematic image-to-video generation, realistic human motion clips, and high-fps commercial b-roll.',
    pricingModel: 'Freemium',
    pricingDetails: 'Daily free credits • Paid tiers from $10/mo',
    websiteUrl: 'https://klingai.com',
    whyRecommended: 'Produces realistic human physics, camera panning, and high-fidelity video motion.',
    rating: 4.88,
    logoText: 'KL',
    badge: 'Next-Gen Video',
    keyFeatures: ['Physical Realism', '60fps Video', 'Image-to-Video'],
    verified: true,
    starterPrompt: 'Cinematic slow-motion shot of a futuristic drone navigating glowing neon skyscrapers in nighttime Tokyo, 60fps camera pan.'
  },

  {
    id: 'runway',
    name: 'Runway Gen-3 Alpha',
    vendor: 'Runway',
    slug: 'runway-gen-3-alpha',
    description: 'Industry-standard generative video model with camera motion controls, text-to-video, and video-to-video style transfers.',
    officialUrl: 'https://runwayml.com',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://runwayml.com']
    },
    pricing: {
      model: 'freemium',
      freeTier: true,
      startingPrice: 12,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Free trial credits • $12/mo Standard'
    },
    platforms: ['web', 'ios'],
    skillLevel: 'intermediate',
    capabilities: [
      'video_generation',
      'video_editing',
      'image_generation'
    ],
    supportedTasks: [
      'create_youtube_video',
      'create_youtube_short',
      'create_tiktok_video'
    ],
    inputTypes: ['text', 'image', 'video'],
    outputTypes: ['video', 'image'],
    strengths: [
      'Precise camera controls (pan, zoom, tilt, roll) and Motion Brush',
      'Industry standard for commercial video creators and VFX studios'
    ],
    limitations: [
      'Credit consumption is high for 4K video exports'
    ],
    bestFor: [
      'Controlled commercial advertising video clips and creative VFX'
    ],
    notRecommendedFor: [
      'Text writing or fullstack website creation'
    ],
    integrations: ['Adobe Premiere Plugin', 'Web Exporter'],
    alternatives: ['kling-ai', 'pika'],
    complements: ['midjourney', 'elevenlabs', 'udio', 'capcut'],
    relationships: {
      alternatives: ['kling-ai', 'pika'],
      complements: ['midjourney', 'elevenlabs', 'udio', 'capcut']
    },
    scores: { taskFit: 9.4, easeOfUse: 8.8, outputQuality: 9.6, customization: 9.4, valueForMoney: 8.8 },
    tags: ['generative-video', 'motion-brush', 'gen-3', 'vfx'],
    category: 'Video',
    bestApplication: 'Commercial ad creative, cinematic filmmaking b-roll, and controlled camera pans.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free trial credits • $12/mo Standard',
    websiteUrl: 'https://runwayml.com',
    whyRecommended: 'Unmatched camera motion controls including pan, zoom, tilt, and motion brush.',
    rating: 4.87,
    logoText: 'RW',
    badge: 'Studio Video',
    keyFeatures: ['Gen-3 Alpha', 'Motion Brush', 'Camera Controls'],
    verified: true,
    starterPrompt: 'Aerial drone footage swooping low over misty Norwegian fjords at sunrise, golden light, realistic water reflections --motion 6'
  },

  {
    id: 'capcut',
    name: 'CapCut AI',
    vendor: 'ByteDance',
    slug: 'capcut-ai',
    description: 'All-in-one video editor with AI auto-captions, text-to-speech, background removal, and viral templates.',
    officialUrl: 'https://capcut.com',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://capcut.com']
    },
    pricing: {
      model: 'freemium',
      freeTier: true,
      startingPrice: 8,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Free tier with auto-captions • $8/mo Pro'
    },
    platforms: ['web', 'macos', 'windows', 'ios', 'android'],
    skillLevel: 'beginner',
    capabilities: ['video_editing', 'transcription', 'voice_generation'],
    supportedTasks: ['create_youtube_short', 'create_tiktok_video', 'create_youtube_video'],
    inputTypes: ['video', 'audio', 'image'],
    outputTypes: ['video'],
    strengths: ['Auto-caption animated subtitles', 'Instant viral format resizing for TikTok & Shorts'],
    limitations: ['Pro effects require subscription'],
    bestFor: ['Editing short-form video clips, auto-captions, and assembling final video exports'],
    notRecommendedFor: ['Pure photorealistic image generation'],
    integrations: ['TikTok', 'YouTube', 'Instagram'],
    alternatives: ['descript'],
    complements: ['kling-ai', 'elevenlabs', 'claude'],
    upstream: ['kling-ai', 'elevenlabs'],
    relationships: { alternatives: ['descript'], complements: ['kling-ai', 'elevenlabs'] },
    scores: { taskFit: 9.7, easeOfUse: 9.8, outputQuality: 9.4, customization: 9.0, valueForMoney: 9.6 },
    tags: ['auto-captions', 'video-editor', 'tiktok-shorts', 'bytedance'],
    category: 'Video',
    bestApplication: 'Auto-captions, clip assembly, and short-form video editing.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free tier • $8/mo Pro',
    websiteUrl: 'https://capcut.com',
    whyRecommended: 'Fastest tool for animated auto-captions and assembling AI video clips.',
    rating: 4.9,
    logoText: 'CC',
    badge: 'Video Editor',
    keyFeatures: ['Auto Captions', 'Text-to-Speech', 'Background Removal'],
    verified: true,
    starterPrompt: 'Import generated video clips and narration audio, auto-generate word-by-word animated captions.'
  },

  {
    id: 'descript',
    name: 'Descript',
    vendor: 'Descript',
    slug: 'descript',
    description: 'AI video and podcast editor where you edit video by editing the transcribed text like a word doc.',
    officialUrl: 'https://descript.com',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://descript.com']
    },
    pricing: {
      model: 'freemium',
      freeTier: true,
      startingPrice: 12,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Free 1 hr transcription/mo • $12/mo Creator'
    },
    platforms: ['macos', 'windows', 'web'],
    skillLevel: 'beginner',
    capabilities: ['video_editing', 'audio_generation', 'transcription', 'voice_cloning'],
    supportedTasks: ['create_podcast', 'create_youtube_video', 'generate_voiceover'],
    inputTypes: ['video', 'audio', 'file'],
    outputTypes: ['video', 'audio', 'text'],
    strengths: ['Edit video/audio by editing text transcript', 'Studio Sound 1-click background noise removal'],
    limitations: ['Free tier watermarks video exports'],
    bestFor: ['Podcast editing, webinar clipping, and voice track cleanup'],
    notRecommendedFor: ['Complex 3D motion VFX'],
    integrations: ['YouTube', 'Spotify', 'Apple Podcasts'],
    alternatives: ['capcut'],
    complements: ['elevenlabs', 'claude'],
    relationships: { alternatives: ['capcut'], complements: ['elevenlabs', 'claude'] },
    scores: { taskFit: 9.5, easeOfUse: 9.4, outputQuality: 9.6, customization: 9.1, valueForMoney: 9.2 },
    tags: ['text-based-video', 'studio-sound', 'podcast-editor'],
    category: 'Audio',
    bestApplication: 'Text-based audio/video editing and studio voice mastering.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free tier • $12/mo Creator',
    websiteUrl: 'https://descript.com',
    whyRecommended: 'Revolutionary text-based editing with Studio Sound microphone voice isolation.',
    rating: 4.89,
    logoText: 'DS',
    badge: 'Text-Video Editor',
    keyFeatures: ['Text Editing', 'Studio Sound', 'Filler Word Removal'],
    verified: true,
    starterPrompt: 'Apply Studio Sound to clean background audio and remove all "um" and "uh" filler words.'
  },

  // ==========================================
  // 5. DESIGN & IMAGE GENERATION
  // ==========================================
  {
    id: 'midjourney',
    name: 'Midjourney v6',
    vendor: 'Midjourney',
    slug: 'midjourney-v6',
    description: 'Industry-leading text-to-image AI for hyper-realistic graphics, UI mockups, concept art, and visual brand assets.',
    officialUrl: 'https://midjourney.com',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://midjourney.com', 'https://docs.midjourney.com']
    },
    pricing: {
      model: 'paid',
      freeTier: false,
      startingPrice: 10,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Starts at $10/month via Discord or Web'
    },
    platforms: ['web'],
    skillLevel: 'intermediate',
    capabilities: [
      'image_generation',
      'image_editing'
    ],
    supportedTasks: [
      'create_logo',
      'create_flyer',
      'create_social_media_content'
    ],
    inputTypes: ['text', 'image'],
    outputTypes: ['image'],
    strengths: [
      'Unsurpassed aesthetic quality, photorealism, and art direction',
      'Vary Region inpainting and style reference matching'
    ],
    limitations: [
      'No free tier available'
    ],
    bestFor: [
      'Photorealistic brand assets, logos, and high-converting marketing visuals'
    ],
    notRecommendedFor: [
      'Interactive React code or audio generation'
    ],
    integrations: ['Discord Bot', 'Web Gallery'],
    alternatives: ['canva', 'chatgpt'],
    complements: ['kling-ai', 'runway', 'framer', 'canva'],
    downstream: ['kling-ai', 'runway', 'canva'],
    relationships: {
      alternatives: ['canva', 'chatgpt'],
      complements: ['kling-ai', 'runway', 'framer', 'canva'],
      downstream: ['kling-ai', 'runway', 'canva']
    },
    scores: { taskFit: 9.7, easeOfUse: 8.5, outputQuality: 9.9, customization: 9.6, valueForMoney: 9.0 },
    tags: ['text-to-image', 'photorealism', 'midjourney', 'art-direction'],
    category: 'Design',
    bestApplication: 'Photorealistic image generation, brand marketing assets, photorealistic product concepts, and art direction.',
    pricingModel: 'Paid',
    pricingDetails: 'Starts at $10/month',
    websiteUrl: 'https://midjourney.com',
    whyRecommended: 'Highest visual fidelity and artistic aesthetic of any image generator.',
    rating: 4.89,
    logoText: 'MJ',
    badge: 'Top Image AI',
    keyFeatures: ['Hyper-realism', 'Style Matching', 'Vary Region'],
    verified: true,
    starterPrompt: 'Architectural photography of a minimalist glass house in an autumn pine forest, golden hour lighting, 8k resolution, cinematic framing --ar 16:9 --v 6.0'
  },

  {
    id: 'canva',
    name: 'Canva Magic Studio',
    vendor: 'Canva',
    slug: 'canva-magic-studio',
    description: 'Visual design platform with AI tools for instant presentations, YouTube thumbnails, social posts, and brand flyers.',
    officialUrl: 'https://canva.com',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://canva.com']
    },
    pricing: {
      model: 'freemium',
      freeTier: true,
      startingPrice: 13,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Generous free tier • $13/mo Pro'
    },
    platforms: ['web', 'macos', 'windows', 'ios', 'android'],
    skillLevel: 'beginner',
    capabilities: ['image_generation', 'image_editing', 'presentation_generation', 'document_generation'],
    supportedTasks: ['create_flyer', 'create_logo', 'create_presentation', 'create_social_media_content'],
    inputTypes: ['text', 'image'],
    outputTypes: ['image', 'presentation'],
    strengths: ['Huge library of ready templates and YouTube thumbnail formats', 'Magic Eraser and Magic Switch'],
    limitations: ['Complex custom vector node editing is limited compared to Illustrator'],
    bestFor: ['YouTube thumbnails, social graphics, slide decks, and marketing flyers'],
    notRecommendedFor: ['Direct frontend code generation'],
    integrations: ['Google Drive', 'Dropbox', 'Instagram'],
    alternatives: ['midjourney'],
    complements: ['claude', 'kling-ai'],
    relationships: { alternatives: ['midjourney'], complements: ['claude'] },
    scores: { taskFit: 9.7, easeOfUse: 9.9, outputQuality: 9.3, customization: 9.0, valueForMoney: 9.6 },
    tags: ['thumbnail-creator', 'templates', 'graphic-design', 'canva'],
    category: 'Design',
    bestApplication: 'Thumbnails, flyers, presentation decks, and visual marketing assets.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free tier available • $13/mo Pro',
    websiteUrl: 'https://canva.com',
    whyRecommended: 'Fastest tool for creating high-CTR YouTube thumbnails and marketing flyers with zero design experience.',
    rating: 4.92,
    logoText: 'CV',
    badge: 'Thumbnails & Design',
    keyFeatures: ['Magic Switch', 'Thumbnail Templates', 'Magic Eraser'],
    verified: true,
    starterPrompt: 'Create a high-contrast, clickable YouTube thumbnail layout with bold text and glowing background gradient.'
  },

  // ==========================================
  // 6. AUDIO & MUSIC PRODUCTION
  // ==========================================
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    vendor: 'ElevenLabs',
    slug: 'elevenlabs',
    description: 'Ultra-realistic AI voice generator for voiceovers, dubbing, podcasts, and audiobooks with hyper-natural emotion.',
    officialUrl: 'https://elevenlabs.io',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://elevenlabs.io', 'https://elevenlabs.io/docs']
    },
    pricing: {
      model: 'freemium',
      freeTier: true,
      startingPrice: 5,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Free 10k credits/mo • $5/mo Starter'
    },
    platforms: ['web', 'api', 'ios', 'android'],
    skillLevel: 'beginner',
    capabilities: [
      'voice_generation',
      'voice_cloning',
      'audio_generation'
    ],
    supportedTasks: [
      'generate_voiceover',
      'create_podcast',
      'create_youtube_video',
      'create_youtube_short',
      'create_tiktok_video'
    ],
    inputTypes: ['text', 'audio', 'file'],
    outputTypes: ['audio'],
    strengths: [
      'Indistinguishable from professional human voice actors',
      'Instant emotion, pacing, and accent adjustment',
      'Multilingual dubbing and custom voice cloning'
    ],
    limitations: [
      'Voice cloning requires paid subscription tier'
    ],
    bestFor: [
      'YouTube narration, podcast intros, audiobooks, and video voiceovers'
    ],
    notRecommendedFor: [
      'Full music song generation with instrumental drum beats'
    ],
    integrations: ['REST API', 'Python SDK', 'Zapier', 'Make'],
    alternatives: ['suno', 'descript'],
    complements: ['kling-ai', 'runway', 'claude', 'udio', 'capcut'],
    upstream: ['claude', 'chatgpt'],
    downstream: ['kling-ai', 'capcut', 'descript'],
    relationships: {
      alternatives: ['suno', 'descript'],
      complements: ['kling-ai', 'runway', 'claude', 'udio', 'capcut'],
      upstream: ['claude', 'chatgpt'],
      downstream: ['kling-ai', 'capcut', 'descript']
    },
    scores: { taskFit: 9.8, easeOfUse: 9.7, outputQuality: 9.9, customization: 9.4, valueForMoney: 9.5 },
    tags: ['voice-ai', 'tts', 'voiceover', 'voice-cloning'],
    category: 'Audio',
    bestApplication: 'Professional voiceover generation, instant multilingual dubbing, custom voice cloning, and audio storytelling.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free 10k credits/mo • $5/mo Starter',
    websiteUrl: 'https://elevenlabs.io',
    whyRecommended: 'Indistinguishable from real human voice actors with instant emotion adjustment.',
    rating: 4.94,
    logoText: '11',
    badge: 'Best Voice AI',
    keyFeatures: ['Voice Cloning', 'Multilingual Dubbing', 'Sound Effects'],
    verified: true,
    starterPrompt: 'Generate a warm, captivating narrator voiceover introducing a documentary with subtle pauses and emotion.'
  },

  {
    id: 'udio',
    name: 'Udio AI',
    vendor: 'Udio',
    slug: 'udio-ai',
    description: 'State-of-the-art AI music creation platform for producing pristine vocal tracks, complex instrumental layers, and full songs.',
    officialUrl: 'https://udio.com',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://udio.com']
    },
    pricing: {
      model: 'freemium',
      freeTier: true,
      startingPrice: 10,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: '100 free credits/mo • $10/mo Standard'
    },
    platforms: ['web'],
    skillLevel: 'beginner',
    capabilities: [
      'music_generation',
      'audio_generation',
      'voice_generation'
    ],
    supportedTasks: [
      'create_song',
      'create_beat',
      'create_podcast',
      'create_youtube_video'
    ],
    inputTypes: ['text', 'audio'],
    outputTypes: ['audio'],
    strengths: [
      'Studio-grade acoustic fidelity and pristine vocal clarity across jazz, Afrobeats, pop, and hip-hop',
      'Segment-by-segment song extension with custom lyrics and stem splitting'
    ],
    limitations: [
      'Requires sequential 32-second extensions to build full 3-minute tracks'
    ],
    bestFor: [
      'Full music production, genre-specific vocal songs (Afrobeats, R&B, Pop), and background scoring'
    ],
    notRecommendedFor: [
      'Pure spoken-word book narration'
    ],
    integrations: ['WAV Audio Export', 'Stem Splitter'],
    alternatives: ['suno'],
    complements: ['elevenlabs', 'kling-ai', 'runway'],
    relationships: {
      alternatives: ['suno'],
      complements: ['elevenlabs', 'kling-ai', 'runway']
    },
    scores: { taskFit: 9.6, easeOfUse: 9.1, outputQuality: 9.8, customization: 9.3, valueForMoney: 9.4 },
    tags: ['music-generation', 'studio-audio', 'stems', 'vocal-tracks', 'afrobeats'],
    category: 'Audio',
    bestApplication: 'High-fidelity audio production, studio-quality vocal tracks, soundtrack scoring, and custom song stem generation.',
    pricingModel: 'Freemium',
    pricingDetails: '100 free credits/mo • $10/mo Standard',
    websiteUrl: 'https://udio.com',
    whyRecommended: 'Unmatched acoustic quality and vocal clarity across jazz, pop, hip-hop, Afrobeats, and orchestral genres.',
    rating: 4.9,
    logoText: 'UD',
    badge: 'Pro Music AI',
    keyFeatures: ['Studio Audio Quality', 'Vocal Extensions', 'Custom Stem Mixing'],
    verified: true,
    starterPrompt: 'Create an uplifting Afrobeats track with warm log drums, rhythmic guitar plucks, and soulful female vocal melodies.'
  },

  {
    id: 'suno',
    name: 'Suno AI v3',
    vendor: 'Suno',
    slug: 'suno-ai-v3',
    description: 'Generate full radio-quality songs with vocals, lyrics, and instrumentals in any music genre.',
    officialUrl: 'https://suno.com',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://suno.com']
    },
    pricing: {
      model: 'freemium',
      freeTier: true,
      startingPrice: 10,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: '50 free credits daily • $10/mo Pro'
    },
    platforms: ['web', 'ios'],
    skillLevel: 'beginner',
    capabilities: [
      'music_generation',
      'audio_generation'
    ],
    supportedTasks: [
      'create_song',
      'create_beat',
      'create_podcast'
    ],
    inputTypes: ['text'],
    outputTypes: ['audio'],
    strengths: [
      'Generates complete 2-3 minute radio-ready tracks in a single prompt',
      'Effortless genre blending and custom lyric insertion'
    ],
    limitations: [
      'Audio stems only available on paid Pro plan'
    ],
    bestFor: [
      'Fast full-length song creation, background music, jingles, and songwriting'
    ],
    notRecommendedFor: [
      'Spoken podcast voiceovers without music'
    ],
    integrations: ['MP3/WAV Export'],
    alternatives: ['udio'],
    complements: ['elevenlabs', 'chatgpt'],
    relationships: {
      alternatives: ['udio'],
      complements: ['elevenlabs', 'chatgpt']
    },
    scores: { taskFit: 9.3, easeOfUse: 9.8, outputQuality: 9.1, customization: 8.7, valueForMoney: 9.3 },
    tags: ['instant-song', 'radio-ready', 'lyrics', 'music-ai'],
    category: 'Audio',
    bestApplication: 'Instant music generation from text prompts, custom jingles, background tracks, and songwriting.',
    pricingModel: 'Freemium',
    pricingDetails: '50 free credits daily • $10/mo Pro',
    websiteUrl: 'https://suno.com',
    whyRecommended: 'Creates complete 2-3 minute radio-ready tracks from simple text descriptions.',
    rating: 4.86,
    logoText: 'SU',
    badge: 'Instant Song AI',
    keyFeatures: ['Vocal + Instrumental', 'Custom Lyrics', 'Genre Blending'],
    verified: true,
    starterPrompt: 'An energetic Afrobeats anthem with syncopated percussion, female vocals, and an infectious chorus.'
  },

  // ==========================================
  // 7. CHATBOTS & AUTOMATION
  // ==========================================
  {
    id: 'voiceflow',
    name: 'Voiceflow',
    vendor: 'Voiceflow',
    slug: 'voiceflow',
    description: 'Collaborative visual AI agent builder for designing, prototyping, and deploying customer support and conversational bots.',
    officialUrl: 'https://voiceflow.com',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://voiceflow.com', 'https://docs.voiceflow.com']
    },
    pricing: {
      model: 'freemium',
      freeTier: true,
      startingPrice: 50,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Free tier for 100k tokens • $50/mo Pro'
    },
    platforms: ['web', 'api'],
    skillLevel: 'beginner',
    capabilities: [
      'automation',
      'workflow_automation',
      'text_generation',
      'research'
    ],
    supportedTasks: [
      'create_business_website',
      'create_web_application'
    ],
    inputTypes: ['text', 'file', 'url'],
    outputTypes: ['text', 'website', 'data'],
    strengths: [
      'Intuitive drag-and-drop conversational canvas with visual logic branching',
      'Built-in RAG knowledge base document indexing',
      '1-click embeddable website widget and multi-channel export'
    ],
    limitations: [
      'Advanced custom database logic requires external webhook integration'
    ],
    bestFor: [
      'Customer support chatbots and FAQ automation',
      'Lead capture assistants and conversational prototypes'
    ],
    notRecommendedFor: [
      'Fullstack React application coding from scratch'
    ],
    integrations: ['Shopify', 'Zendesk', 'OpenAI', 'Anthropic', 'Zapier', 'WhatsApp'],
    alternatives: ['chatbase', 'botpress'],
    complements: ['claude', 'framer'],
    relationships: {
      alternatives: ['chatbase', 'botpress'],
      complements: ['claude', 'framer']
    },
    scores: { taskFit: 9.6, easeOfUse: 9.5, outputQuality: 9.4, customization: 9.1, valueForMoney: 9.2 },
    tags: ['chatbot-builder', 'rag', 'visual-canvas', 'support-bot'],
    category: 'Chatbots & Agents',
    bestApplication: 'Building customer support chatbots, lead generation bots, and multi-channel conversational flows.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free tier for 100k tokens • $50/mo Pro',
    websiteUrl: 'https://voiceflow.com',
    whyRecommended: 'Visual canvas with built-in knowledge base ingestion, API action steps, and 1-click web widget embed.',
    rating: 4.93,
    logoText: 'VF',
    badge: 'Top Agent Builder',
    keyFeatures: ['Visual Flow Canvas', 'Knowledge Base Sync', 'Web Widget Embed'],
    verified: true,
    starterPrompt: 'Build a customer service bot that searches our FAQ knowledge base and escalates to human agents when sentiment is negative.'
  },

  {
    id: 'chatbase',
    name: 'Chatbase',
    vendor: 'Chatbase',
    slug: 'chatbase',
    description: 'Custom AI chatbot builder that connects to your website, PDFs, and Notion docs to answer customer queries 24/7.',
    officialUrl: 'https://chatbase.co',
    status: 'active',
    verification: {
      status: 'verified',
      lastVerifiedAt: '2026-08-20',
      sources: ['https://chatbase.co']
    },
    pricing: {
      model: 'freemium',
      freeTier: true,
      startingPrice: 19,
      currency: 'USD',
      billingPeriod: 'monthly',
      details: 'Free trial • $19/mo Starter tier'
    },
    platforms: ['web', 'api'],
    skillLevel: 'beginner',
    capabilities: [
      'research',
      'text_generation',
      'automation'
    ],
    supportedTasks: [
      'create_business_website',
      'create_landing_page'
    ],
    inputTypes: ['text', 'file', 'url'],
    outputTypes: ['text', 'website'],
    strengths: [
      'Fastest 5-minute setup from PDF upload or URL crawl to live website chat widget'
    ],
    limitations: [
      'Less visual branching logic than Voiceflow'
    ],
    bestFor: [
      'Instant document Q&A and embeddable website FAQ bots'
    ],
    notRecommendedFor: [
      'Complex multi-system backend orchestration'
    ],
    integrations: ['WordPress', 'Shopify', 'Notion', 'Zapier', 'Slack'],
    alternatives: ['voiceflow', 'botpress'],
    complements: ['framer', 'claude'],
    relationships: {
      alternatives: ['voiceflow', 'botpress'],
      complements: ['framer', 'claude']
    },
    scores: { taskFit: 9.1, easeOfUse: 9.8, outputQuality: 9.0, customization: 8.2, valueForMoney: 9.0 },
    tags: ['fast-rag', 'document-qa', 'website-bot', 'no-code'],
    category: 'Chatbots & Agents',
    bestApplication: 'Instant document Q&A, embeddable website FAQ bots, and lead capture assistants.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free trial • $19/mo Starter tier',
    websiteUrl: 'https://chatbase.co',
    whyRecommended: 'Fastest 5-minute setup from PDF upload or URL crawl to live website chat widget.',
    rating: 4.89,
    logoText: 'CB',
    badge: 'Fast RAG Bot',
    keyFeatures: ['Document Ingestion', 'Website Crawling', 'Embed Script'],
    verified: true,
    starterPrompt: 'Train a chatbot on our pricing and support documentation with strict instructions not to hallucinate unlisted discounts.'
  }
];

export const VERIFIED_TOOLS_BY_ID = new Map<string, Tool>(
  VERIFIED_TOOLS_DATABASE.map(t => [t.id.toLowerCase(), t])
);

export function getVerifiedTool(id: string): Tool | undefined {
  if (!id) return undefined;
  const cleanId = id.toLowerCase().trim();
  if (VERIFIED_TOOLS_BY_ID.has(cleanId)) {
    return VERIFIED_TOOLS_BY_ID.get(cleanId);
  }
  for (const [key, tool] of VERIFIED_TOOLS_BY_ID.entries()) {
    if (key.includes(cleanId) || cleanId.includes(key)) {
      return tool;
    }
  }
  return undefined;
}
