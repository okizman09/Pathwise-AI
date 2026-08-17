import { Tool, WorkflowResult, SavedWorkflow } from '../types';

export const CURATED_TOOLS: Tool[] = [
  {
    id: 'antigravity',
    name: 'Antigravity AI (Google)',
    category: 'Coding',
    description: 'Autonomous agentic AI coding assistant and development framework designed for complex, multi-step software tasks.',
    pricingModel: 'Free',
    pricingDetails: 'Developer Preview • Free',
    skillLevel: 'Intermediate',
    websiteUrl: 'https://antigravity.google.com',
    logoText: 'AG',
    rating: 4.98,
    badge: 'Agentic AI',
    whyRecommended: 'Top choice for complex repo editing, code generation, background execution, and automated pair programming.',
    keyFeatures: ['Agentic Execution', 'Repo Analysis', 'Automated Verification']
  },
  {
    id: 'dala-gebeya',
    name: 'Dala Gebeya',
    category: 'General',
    description: 'Emerging marketplace and digital ecosystem connecting AI service providers, creators, and localized solutions.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free directory & service browsing',
    skillLevel: 'Beginner',
    websiteUrl: 'https://dalagebeya.com',
    logoText: 'DG',
    rating: 4.88,
    badge: 'Emerging Market AI',
    whyRecommended: 'Unlocks localized AI talent, emerging service workflows, and digital commerce tools.',
    keyFeatures: ['AI Talent Hub', 'Localized Tools', 'Digital Marketplace']
  },
  {
    id: 'v0-dev',
    name: 'v0 by Vercel',
    category: 'Website',
    description: 'Generative UI tool that turns plain text prompts into copy-paste ready Tailwind CSS & React components.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free credits monthly • $20/mo Premium',
    skillLevel: 'Beginner',
    websiteUrl: 'https://v0.dev',
    logoText: 'V0',
    rating: 4.92,
    badge: 'Generative UI',
    whyRecommended: 'Produces production-ready React JSX components with shadcn/ui and Tailwind styles in seconds.',
    keyFeatures: ['Shadcn UI', 'React Copy-Paste', 'Design Iteration']
  },
  {
    id: 'bolt-new',
    name: 'Bolt.new',
    category: 'Coding',
    description: 'In-browser AI web development environment that creates, installs dependencies, and deploys fullstack apps from prompts.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free tier available • $20/mo Pro',
    skillLevel: 'Beginner',
    websiteUrl: 'https://bolt.new',
    logoText: 'BN',
    rating: 4.9,
    badge: 'Prompt-to-App',
    whyRecommended: 'Runs Node.js directly inside your browser WebContainer to build and preview live web apps.',
    keyFeatures: ['WebContainers', 'Live Terminal', 'Fullstack Prompting']
  },
  {
    id: 'kling-ai',
    name: 'Kling AI',
    category: 'Video',
    description: 'Next-generation video creation model capable of rendering 1080p 60fps cinematic clips with physical realism.',
    pricingModel: 'Freemium',
    pricingDetails: 'Daily free credits • Paid tiers',
    skillLevel: 'Intermediate',
    websiteUrl: 'https://klingai.com',
    logoText: 'KL',
    rating: 4.87,
    badge: 'Next-Gen Video',
    whyRecommended: 'Produces realistic human physics, camera panning, and high-fidelity video motion.',
    keyFeatures: ['Physical Realism', '60fps Video', 'Image-to-Video']
  },
  {
    id: 'udio',
    name: 'Udio AI',
    category: 'Audio',
    description: 'State-of-the-art AI music creation platform for producing pristine vocal tracks, complex instrumental layers, and full songs.',
    pricingModel: 'Freemium',
    pricingDetails: '100 free credits/mo • $10/mo Standard',
    skillLevel: 'Beginner',
    websiteUrl: 'https://udio.com',
    logoText: 'UD',
    rating: 4.9,
    badge: 'Pro Music AI',
    whyRecommended: 'Unmatched acoustic quality and vocal clarity across jazz, pop, hip-hop, and orchestral genres.',
    keyFeatures: ['Studio Audio Quality', 'Vocal Extensions', 'Custom Stem Mixing']
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT (GPT-4o)',
    category: 'Content',
    description: 'Versatile conversational AI ideal for scripting, code generation, technical specs, algorithmic logic, and prompt refinement.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free tier available • $20/mo Plus',
    skillLevel: 'Beginner',
    websiteUrl: 'https://chatgpt.com',
    logoText: 'GPT',
    rating: 4.9,
    whyRecommended: 'Easiest entry point for code scripting, quantitative logic, and structured prompt generation.',
    keyFeatures: ['Code Generation', 'Data Analysis', 'Web Browsing', 'Custom Instructions']
  },
  {
    id: 'claude',
    name: 'Claude 3.5 Sonnet',
    category: 'Content',
    description: 'Superior nuanced writer and complex reasoning model. Excellent for long-form copywriting, code, and detailed specs.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free tier available • $20/mo Pro',
    skillLevel: 'Beginner',
    websiteUrl: 'https://claude.ai',
    logoText: 'CL',
    rating: 4.95,
    badge: 'Top Pick for Writing & Code',
    whyRecommended: 'Produces the highest quality code logic, system architecture specs, and natural writing.',
    keyFeatures: ['Artifacts UI', '200k Token Context', 'High Coding Quality']
  },
  {
    id: 'midjourney',
    name: 'Midjourney v6',
    category: 'Design',
    description: 'Industry-leading text-to-image AI for hyper-realistic graphics, UI mockups, concept art, and visual brand assets.',
    pricingModel: 'Paid',
    pricingDetails: 'Starts at $10/month via Discord or Web',
    skillLevel: 'Intermediate',
    websiteUrl: 'https://midjourney.com',
    logoText: 'MJ',
    rating: 4.85,
    whyRecommended: 'Highest visual fidelity and artistic aesthetic of any image generator.',
    keyFeatures: ['Hyper-realism', 'Style Matching', 'Vary Region']
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    category: 'Audio',
    description: 'Ultra-realistic AI voice generator for voiceovers, dubbing, podcasts, and audiobooks with hyper-natural emotion.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free 10k credits/mo • $5/mo Starter',
    skillLevel: 'Beginner',
    websiteUrl: 'https://elevenlabs.io',
    logoText: '11',
    rating: 4.9,
    badge: 'Best Voice AI',
    whyRecommended: 'Indistinguishable from real human voice actors with instant emotion adjustment.',
    keyFeatures: ['Voice Cloning', 'Multilingual Dubbing', 'Sound Effects']
  },
  {
    id: 'framer',
    name: 'Framer AI',
    category: 'Website',
    description: 'Design and deploy production-ready responsive websites directly from text prompts and visual canvas.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free site hosting • $15/mo Mini site',
    skillLevel: 'Beginner',
    websiteUrl: 'https://framer.com',
    logoText: 'FR',
    rating: 4.8,
    badge: 'Best Web Builder',
    whyRecommended: 'Generates full responsive websites with CMS, animations, and custom domain publishing.',
    keyFeatures: ['Prompt-to-Site', 'Figma Import', 'SEO Optimized']
  },
  {
    id: 'suno',
    name: 'Suno AI v3',
    category: 'Audio',
    description: 'Generate full radio-quality songs with vocals, lyrics, and instrumentals in any music genre.',
    pricingModel: 'Freemium',
    pricingDetails: '50 free credits daily • $10/mo Pro',
    skillLevel: 'Beginner',
    websiteUrl: 'https://suno.com',
    logoText: 'SU',
    rating: 4.85,
    whyRecommended: 'Creates complete 2-3 minute radio-ready tracks from simple text descriptions.',
    keyFeatures: ['Vocal + Instrumental', 'Custom Lyrics', 'Genre Blending']
  },
  {
    id: 'cursor',
    name: 'Cursor IDE',
    category: 'Coding',
    description: 'AI-first code editor built on VS Code with deeply integrated repository context and agentic editing.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free Hobby tier • $20/mo Pro',
    skillLevel: 'Intermediate',
    websiteUrl: 'https://cursor.com',
    logoText: 'CR',
    rating: 4.95,
    badge: 'Best AI Editor',
    whyRecommended: 'The fastest way to build web apps and code with AI assistance.',
    keyFeatures: ['Repo-wide indexing', 'Cmd+K Edit', 'Auto Bug Fix']
  },
  {
    id: 'phind',
    name: 'Phind AI',
    category: 'Content',
    description: 'Developer-focused search engine and technical AI assistant trained specifically on code docs, APIs, and stack traces.',
    pricingModel: 'Freemium',
    pricingDetails: 'Free search • $20/mo Pro',
    skillLevel: 'Intermediate',
    websiteUrl: 'https://phind.com',
    logoText: 'PH',
    rating: 4.85,
    whyRecommended: 'Instant technical answers with direct code snippets and verified documentation links.',
    keyFeatures: ['Technical Search', 'API Documentation', 'Debugging']
  }
];

export const INITIAL_SAVED_WORKFLOWS: SavedWorkflow[] = [
  {
    id: 'saved-1',
    goal: 'Build a Trading EA (Expert Advisor) for MetaTrader',
    category: 'Algorithmic Trading & Coding',
    createdAt: '1 hour ago',
    stepCount: 3,
    toolsUsed: ['ChatGPT (GPT-4o)'],
    workflow: {
      id: 'wf-ea-example',
      goal: 'Build a Trading EA (Expert Advisor) for MetaTrader',
      category: 'Algorithmic Trading & Coding',
      summary: 'A 3-step specialized development path using ChatGPT (GPT-4o) to design trading rules, generate production-ready MQL4/MQL5 code, and execute backtests in MetaTrader.',
      difficulty: 'Intermediate',
      totalTime: '30–40 minutes',
      triageAssumptions: [
        {
          id: 'platform',
          category: 'Platform',
          label: 'Platform & Language',
          currentValue: 'MetaTrader 4 (MQL4)',
          options: ['MetaTrader 4 (MQL4)', 'MetaTrader 5 (MQL5)', 'TradingView (PineScript)']
        },
        {
          id: 'strategy',
          category: 'Strategy',
          label: 'Strategy Type',
          currentValue: 'Moving Average Crossover + RSI Filter',
          options: ['Moving Average Crossover + RSI Filter', 'Grid / Martingale', 'Breakout / Volatility']
        }
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Define Trading Strategy & Entry/Exit Logic',
          description: 'Use ChatGPT to formulate mathematically precise indicator conditions, risk parameters, and order management rules.',
          category: 'Strategy Specification',
          primaryTool: CURATED_TOOLS[6], // ChatGPT
          alternativeTools: [CURATED_TOOLS[7]], // Claude
          estimatedTime: '10 mins',
          proTip: 'Specify exact StopLoss, TakeProfit, and trailing stop rules in pips.',
          prompt: {
            id: 'p-ea-1',
            title: 'Algorithmic Trading Strategy Blueprint',
            targetTool: 'ChatGPT (GPT-4o)',
            stepNumber: 1,
            rawTemplate: `Act as a senior quantitative trader. Create a detailed algorithmic specification for a trading bot for {trading_pair} on the {timeframe} timeframe.

Strategy Logic:
- Indicator 1: {fast_ma_period} EMA crossing {slow_ma_period} EMA.
- Indicator Filter: RSI ({rsi_period}) {rsi_condition}.
- Risk Management: {risk_percent_per_trade}% account balance per trade.
- Stop Loss: {stop_loss_pips} pips. Take Profit: {take_profit_pips} pips.
- Trailing Stop: {trailing_stop_pips} pips.

Format the specification into clear entry conditions, exit conditions, and risk rules ready for coding.`,
            variables: [
              { key: 'trading_pair', label: 'Trading Pair', defaultValue: 'EUR/USD', placeholder: 'e.g. EUR/USD' },
              { key: 'timeframe', label: 'Timeframe', defaultValue: '1-Hour (H1)', placeholder: 'e.g. H1' },
              { key: 'fast_ma_period', label: 'Fast EMA', defaultValue: '9', placeholder: 'Period' },
              { key: 'slow_ma_period', label: 'Slow EMA', defaultValue: '21', placeholder: 'Period' },
              { key: 'rsi_period', label: 'RSI Period', defaultValue: '14', placeholder: 'RSI Period' },
              { key: 'rsi_condition', label: 'RSI Filter', defaultValue: 'above 50 for Buys, below 50 for Sells', placeholder: 'Condition' },
              { key: 'risk_percent_per_trade', label: 'Risk %', defaultValue: '1.5', placeholder: 'Risk %' },
              { key: 'stop_loss_pips', label: 'Stop Loss (pips)', defaultValue: '30', placeholder: 'SL pips' },
              { key: 'take_profit_pips', label: 'Take Profit (pips)', defaultValue: '60', placeholder: 'TP pips' },
              { key: 'trailing_stop_pips', label: 'Trailing Stop (pips)', defaultValue: '15', placeholder: 'Trailing pips' }
            ],
            explanation: 'Structuring risk and entry rules beforehand ensures the AI generates clean, bug-free MQL code without logic holes.',
            bestPractices: [
              'Include spread protection to prevent trading during high news volatility.',
              'Define maximum open trades allowed at once.'
            ]
          }
        },
        {
          stepNumber: 2,
          title: 'Generate Production-Ready MQL4/MQL5 EA Code',
          description: 'Convert your strategy spec into executable MQL code with built-in money management and error handling.',
          category: 'MQL Code Generation',
          primaryTool: CURATED_TOOLS[6], // ChatGPT (Single Tool!)
          alternativeTools: [CURATED_TOOLS[0]], // Antigravity AI
          estimatedTime: '15 mins',
          proTip: 'Paste the spec generated in Step 1 and request full compiled MQL code with OnInit, OnTick, and OrderSend functions.',
          prompt: {
            id: 'p-ea-2',
            title: 'MQL4 Expert Advisor Code Generator',
            targetTool: 'ChatGPT (GPT-4o)',
            stepNumber: 2,
            rawTemplate: `Act as a senior MQL4/MQL5 software engineer. Write a complete, compilable Expert Advisor (.mq4) for MetaTrader 4 based on the following rules:

Parameters:
- MagicNumber: {magic_number}
- Lots: {lot_size} (Auto lot sizing based on {risk_percent}% risk)
- StopLoss: {stop_loss_pips} pips
- TakeProfit: {take_profit_pips} pips

Rules:
- Entry: Buy when 9 EMA crosses above 21 EMA and RSI > 50. Sell when 9 EMA crosses below 21 EMA and RSI < 50.
- Execute trades only on bar close to prevent repainting.
- Include proper OrderSend error logging and slippage handling (3 pips).

Provide full code in a single MQL4 code block with comments.`,
            variables: [
              { key: 'magic_number', label: 'Magic Number', defaultValue: '88123', placeholder: 'Magic number' },
              { key: 'lot_size', label: 'Lot Size', defaultValue: '0.10', placeholder: 'Lot size' },
              { key: 'risk_percent', label: 'Risk %', defaultValue: '2.0', placeholder: 'Risk %' },
              { key: 'stop_loss_pips', label: 'Stop Loss', defaultValue: '30', placeholder: 'SL pips' },
              { key: 'take_profit_pips', label: 'Take Profit', defaultValue: '60', placeholder: 'TP pips' }
            ],
            explanation: 'Requesting trade execution on bar close prevents "repainting" false signal entries.',
            bestPractices: [
              'Compile code in MetaEditor and verify 0 errors and 0 warnings.',
              'Ensure MagicNumber is unique for each EA instance.'
            ]
          }
        },
        {
          stepNumber: 3,
          title: 'Backtest Strategy & Optimize Parameters',
          description: 'Use ChatGPT to analyze backtest results from MetaTrader Strategy Tester and fine-tune drawdown limits.',
          category: 'Backtesting & Optimization',
          primaryTool: CURATED_TOOLS[6], // ChatGPT (Single Tool!)
          alternativeTools: [CURATED_TOOLS[13]], // Phind
          estimatedTime: '15 mins',
          proTip: 'Run backtests on 99% tick data quality in MT4/MT5 Strategy Tester over at least 2 years of historical data.',
          prompt: {
            id: 'p-ea-3',
            title: 'Strategy Tester Analysis & Optimization Prompt',
            targetTool: 'ChatGPT (GPT-4o)',
            stepNumber: 3,
            rawTemplate: `I ran a backtest on MetaTrader for my Expert Advisor on {trading_pair} ({timeframe}).
Results:
- Total Trades: {total_trades}
- Profit Factor: {profit_factor}
- Max Drawdown: {max_drawdown_percent}%
- Win Rate: {win_rate}%

Act as a quantitative risk analyst. Evaluate these metrics:
1. Is this strategy statistically robust or overfitted?
2. What 2 parameters should I optimize in Strategy Tester to lower max drawdown below 10%?
3. Provide a step-by-step checklist to deploy this EA safely on a Demo account before going live.`,
            variables: [
              { key: 'trading_pair', label: 'Trading Pair', defaultValue: 'EUR/USD', placeholder: 'Pair' },
              { key: 'timeframe', label: 'Timeframe', defaultValue: 'H1', placeholder: 'Timeframe' },
              { key: 'total_trades', label: 'Total Trades', defaultValue: '240', placeholder: 'Trades count' },
              { key: 'profit_factor', label: 'Profit Factor', defaultValue: '1.65', placeholder: 'Profit factor' },
              { key: 'max_drawdown_percent', label: 'Max Drawdown %', defaultValue: '14.2', placeholder: 'Drawdown %' },
              { key: 'win_rate', label: 'Win Rate %', defaultValue: '58%', placeholder: 'Win rate' }
            ],
            explanation: 'Analyzing backtest metrics with AI identifies overfitting before risking real capital.',
            bestPractices: [
              'Never trade live until the EA runs profitably on a Demo account for at least 4 consecutive weeks.',
              'Use a low-latency VPS to minimize trade execution latency.'
            ]
          }
        }
      ]
    }
  }
];

export function generateWorkflowFromGoal(userGoal: string, explicitAssumptions?: Record<string, string>): WorkflowResult {
  const goalLower = userGoal.toLowerCase();
  
  // 1. Trading EAs / Bots / Financial Algorithms (Forex, Crypto, Stock, MetaTrader, PineScript)
  if (
    goalLower.includes('trading') ||
    goalLower.includes('ea') ||
    goalLower.includes('expert advisor') ||
    goalLower.includes('forex') ||
    goalLower.includes('bot') ||
    goalLower.includes('mql4') ||
    goalLower.includes('mql5') ||
    goalLower.includes('pinescript') ||
    goalLower.includes('metatrader') ||
    goalLower.includes('crypto bot')
  ) {
    return {
      id: 'wf-ea-' + Date.now(),
      goal: userGoal,
      category: 'Algorithmic Trading & Coding',
      summary: 'A 3-step specialized development path using ChatGPT (GPT-4o) to design trading rules, generate production-ready MQL4/MQL5 code, and execute backtests in MetaTrader.',
      difficulty: 'Intermediate',
      totalTime: '30–40 minutes',
      triageAssumptions: [
        {
          id: 'platform',
          category: 'Platform',
          label: 'Platform & Language',
          currentValue: explicitAssumptions?.platform || 'MetaTrader 4 (MQL4)',
          options: ['MetaTrader 4 (MQL4)', 'MetaTrader 5 (MQL5)', 'TradingView (PineScript)']
        },
        {
          id: 'strategy',
          category: 'Strategy',
          label: 'Strategy Type',
          currentValue: explicitAssumptions?.strategy || 'Moving Average Crossover + RSI Filter',
          options: ['Moving Average Crossover + RSI Filter', 'Grid / Martingale', 'Breakout / Volatility']
        }
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Define Trading Strategy & Entry/Exit Logic',
          description: 'Use ChatGPT to formulate mathematically precise indicator conditions, risk parameters, and order management rules.',
          category: 'Strategy Specification',
          primaryTool: CURATED_TOOLS[6], // ChatGPT
          alternativeTools: [CURATED_TOOLS[7]], // Claude
          estimatedTime: '10 mins',
          proTip: 'Specify exact StopLoss, TakeProfit, and trailing stop rules in pips.',
          prompt: {
            id: 'p-ea-1',
            title: 'Algorithmic Trading Strategy Blueprint',
            targetTool: 'ChatGPT (GPT-4o)',
            stepNumber: 1,
            rawTemplate: `Act as a senior quantitative trader. Create a detailed algorithmic specification for a trading bot for {trading_pair} on the {timeframe} timeframe.

Strategy Logic:
- Indicator 1: {fast_ma_period} EMA crossing {slow_ma_period} EMA.
- Indicator Filter: RSI ({rsi_period}) {rsi_condition}.
- Risk Management: {risk_percent_per_trade}% account balance per trade.
- Stop Loss: {stop_loss_pips} pips. Take Profit: {take_profit_pips} pips.

Format into entry conditions, exit conditions, and risk rules ready for coding.`,
            variables: [
              { key: 'trading_pair', label: 'Trading Pair', defaultValue: 'EUR/USD', placeholder: 'e.g. EUR/USD' },
              { key: 'timeframe', label: 'Timeframe', defaultValue: 'H1', placeholder: 'e.g. H1' },
              { key: 'fast_ma_period', label: 'Fast EMA', defaultValue: '9', placeholder: 'Period' },
              { key: 'slow_ma_period', label: 'Slow EMA', defaultValue: '21', placeholder: 'Period' },
              { key: 'rsi_period', label: 'RSI Period', defaultValue: '14', placeholder: 'Period' },
              { key: 'rsi_condition', label: 'RSI Filter', defaultValue: 'above 50 for Buys, below 50 for Sells', placeholder: 'Condition' },
              { key: 'risk_percent_per_trade', label: 'Risk %', defaultValue: '1.5', placeholder: 'Risk %' },
              { key: 'stop_loss_pips', label: 'Stop Loss', defaultValue: '30', placeholder: 'SL pips' },
              { key: 'take_profit_pips', label: 'Take Profit', defaultValue: '60', placeholder: 'TP pips' }
            ],
            explanation: 'Structuring risk and entry rules beforehand ensures the AI generates clean MQL code without logic holes.',
            bestPractices: [
              'Include spread protection to prevent trading during high news volatility.',
              'Define maximum open trades allowed at once.'
            ]
          }
        },
        {
          stepNumber: 2,
          title: 'Generate Production-Ready MQL4/MQL5 EA Code',
          description: 'Convert your strategy spec into executable MQL code with built-in money management and error handling.',
          category: 'MQL Code Generation',
          primaryTool: CURATED_TOOLS[6], // ChatGPT (Single Tool!)
          alternativeTools: [CURATED_TOOLS[0]], // Antigravity AI
          estimatedTime: '15 mins',
          proTip: 'Paste the spec generated in Step 1 and request full compiled MQL code.',
          prompt: {
            id: 'p-ea-2',
            title: 'MQL4 Expert Advisor Code Generator',
            targetTool: 'ChatGPT (GPT-4o)',
            stepNumber: 2,
            rawTemplate: `Act as a senior MQL4/MQL5 software engineer. Write a complete, compilable Expert Advisor (.mq4) for MetaTrader 4 based on the following rules:

Parameters:
- MagicNumber: {magic_number}
- Lots: {lot_size} (Auto lot sizing based on {risk_percent}% risk)
- StopLoss: {stop_loss_pips} pips
- TakeProfit: {take_profit_pips} pips

Rules:
- Entry: Buy when 9 EMA crosses above 21 EMA and RSI > 50. Sell when 9 EMA crosses below 21 EMA and RSI < 50.
- Execute trades only on bar close to prevent repainting.
- Include proper OrderSend error logging and slippage handling (3 pips).

Provide full code in a single MQL4 code block with comments.`,
            variables: [
              { key: 'magic_number', label: 'Magic Number', defaultValue: '88123', placeholder: 'Magic number' },
              { key: 'lot_size', label: 'Lot Size', defaultValue: '0.10', placeholder: 'Lot size' },
              { key: 'risk_percent', label: 'Risk %', defaultValue: '2.0', placeholder: 'Risk %' },
              { key: 'stop_loss_pips', label: 'Stop Loss', defaultValue: '30', placeholder: 'SL pips' },
              { key: 'take_profit_pips', label: 'Take Profit', defaultValue: '60', placeholder: 'TP pips' }
            ],
            explanation: 'Requesting trade execution on bar close prevents "repainting" false signal entries.',
            bestPractices: [
              'Compile code in MetaEditor and verify 0 errors and 0 warnings.',
              'Ensure MagicNumber is unique for each EA instance.'
            ]
          }
        },
        {
          stepNumber: 3,
          title: 'Backtest Strategy & Optimize Parameters',
          description: 'Use ChatGPT to analyze backtest results from MetaTrader Strategy Tester and fine-tune drawdown limits.',
          category: 'Backtesting & Optimization',
          primaryTool: CURATED_TOOLS[6], // ChatGPT (Single Tool!)
          alternativeTools: [CURATED_TOOLS[13]], // Phind
          estimatedTime: '15 mins',
          proTip: 'Run backtests on 99% tick data quality in MT4/MT5 Strategy Tester over historical data.',
          prompt: {
            id: 'p-ea-3',
            title: 'Strategy Tester Analysis & Optimization Prompt',
            targetTool: 'ChatGPT (GPT-4o)',
            stepNumber: 3,
            rawTemplate: `I ran a backtest on MetaTrader for my Expert Advisor on {trading_pair} ({timeframe}).
Results:
- Total Trades: {total_trades}
- Profit Factor: {profit_factor}
- Max Drawdown: {max_drawdown_percent}%

Act as a quantitative risk analyst. Evaluate these metrics:
1. Is this strategy statistically robust or overfitted?
2. What 2 parameters should I optimize in Strategy Tester to lower max drawdown below 10%?
3. Provide a step-by-step checklist to deploy this EA safely on a Demo account before going live.`,
            variables: [
              { key: 'trading_pair', label: 'Trading Pair', defaultValue: 'EUR/USD', placeholder: 'Pair' },
              { key: 'timeframe', label: 'Timeframe', defaultValue: 'H1', placeholder: 'Timeframe' },
              { key: 'total_trades', label: 'Total Trades', defaultValue: '240', placeholder: 'Trades count' },
              { key: 'profit_factor', label: 'Profit Factor', defaultValue: '1.65', placeholder: 'Profit factor' },
              { key: 'max_drawdown_percent', label: 'Max Drawdown %', defaultValue: '14.2', placeholder: 'Drawdown %' }
            ],
            explanation: 'Analyzing backtest metrics with AI identifies overfitting before risking real capital.',
            bestPractices: [
              'Never trade live until the EA runs profitably on a Demo account for at least 4 consecutive weeks.'
            ]
          }
        }
      ]
    };
  }

  // 2. General Coding & Software Tasks (Scripts, Python, API, Backend)
  if (
    goalLower.includes('code') ||
    goalLower.includes('script') ||
    goalLower.includes('python') ||
    goalLower.includes('api') ||
    goalLower.includes('backend') ||
    goalLower.includes('program') ||
    goalLower.includes('software')
  ) {
    return {
      id: 'wf-code-' + Date.now(),
      goal: userGoal,
      category: 'Software Engineering & Scripting',
      summary: 'A 3-step streamlined developer path using Antigravity AI & ChatGPT to architect, code, and test your software solution.',
      difficulty: 'Intermediate',
      totalTime: '30–45 minutes',
      triageAssumptions: [
        {
          id: 'environment',
          category: 'Environment',
          label: 'Primary Language',
          currentValue: explicitAssumptions?.environment || 'Python / Node.js',
          options: ['Python / Node.js', 'React / TypeScript', 'C++ / Go']
        },
        {
          id: 'tool_choice',
          category: 'Tool Choice',
          label: 'Development AI',
          currentValue: explicitAssumptions?.tool_choice || 'Antigravity AI (Google) / Cursor',
          options: ['Antigravity AI (Google) / Cursor', 'ChatGPT (GPT-4o)', 'Claude 3.5 Sonnet']
        }
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Architect Data Model & System Architecture',
          description: 'Use Claude 3.5 Sonnet or ChatGPT to design clean system architecture, API endpoints, and data schemas.',
          category: 'Architecture & Design',
          primaryTool: CURATED_TOOLS[7], // Claude
          alternativeTools: [CURATED_TOOLS[6]], // ChatGPT
          estimatedTime: '10 mins',
          proTip: 'Ask for structured OpenAPI JSON or TypeScript interfaces.',
          prompt: {
            id: 'p-code-1',
            title: 'System Architecture & Interface Builder',
            targetTool: 'Claude 3.5 Sonnet',
            stepNumber: 1,
            rawTemplate: `Act as a principal software architect. Design the system architecture for {software_goal}.

Include:
1. Core Modules & Data Schemas (TypeScript / Pydantic models)
2. API Endpoints or Function Signatures
3. Edge cases and error handling strategy

Language / Stack: {tech_stack}`,
            variables: [
              { key: 'software_goal', label: 'Software Goal', defaultValue: userGoal, placeholder: 'Describe software goal' },
              { key: 'tech_stack', label: 'Tech Stack', defaultValue: 'Python 3.11 / FastAPI', placeholder: 'Tech stack' }
            ],
            explanation: 'Defining system contracts first yields maintainable code.',
            bestPractices: ['Enforce strong typing and input validation models.']
          }
        },
        {
          stepNumber: 2,
          title: 'Generate Production Code & Implementation',
          description: 'Use Antigravity AI or Cursor IDE to write robust code with automated verification.',
          category: 'Code Implementation',
          primaryTool: CURATED_TOOLS[0], // Antigravity AI (Single/Developer Tool!)
          alternativeTools: [CURATED_TOOLS[12]], // Cursor
          estimatedTime: '20 mins',
          proTip: 'Use repo-wide context in Antigravity or Cursor for seamless integration.',
          prompt: {
            id: 'p-code-2',
            title: 'Production Implementation Prompt',
            targetTool: 'Antigravity AI / Cursor IDE',
            stepNumber: 2,
            rawTemplate: `Act as a senior software engineer. Implement full production code for {feature_name}.

Requirements:
- Follow clean architecture patterns
- Include docstrings and unit tests
- Handle edge cases gracefully

Code context / requirements:
"{requirements_text}"`,
            variables: [
              { key: 'feature_name', label: 'Feature Name', defaultValue: userGoal, placeholder: 'Feature' },
              { key: 'requirements_text', label: 'Requirements', defaultValue: 'Implement core function with error logging', placeholder: 'Requirements' }
            ],
            explanation: 'Agentic execution automatically verifies code builds cleanly.',
            bestPractices: ['Run linter and tests after code generation.']
          }
        },
        {
          stepNumber: 3,
          title: 'Automated Testing & Bug Fix Audit',
          description: 'Run automated unit tests and audit performance or memory leaks.',
          category: 'Testing & Refactoring',
          primaryTool: CURATED_TOOLS[0], // Antigravity AI
          alternativeTools: [CURATED_TOOLS[13]], // Phind
          estimatedTime: '10 mins',
          proTip: 'Paste test tracebacks directly into Phind or Antigravity for instant root cause fix.',
          prompt: {
            id: 'p-code-3',
            title: 'Automated Test & Debug Prompt',
            targetTool: 'Antigravity AI / Phind',
            stepNumber: 3,
            rawTemplate: `Review and generate comprehensive unit tests for {module_name}.

Stack: {tech_stack}
Test framework: {test_framework}

Generate tests covering happy path, boundary conditions, and exception scenarios.`,
            variables: [
              { key: 'module_name', label: 'Module', defaultValue: 'Core Service', placeholder: 'Module' },
              { key: 'tech_stack', label: 'Tech Stack', defaultValue: 'Python', placeholder: 'Stack' },
              { key: 'test_framework', label: 'Test Framework', defaultValue: 'pytest', placeholder: 'Framework' }
            ],
            explanation: 'Automated unit tests prevent regressions during future edits.',
            bestPractices: ['Achieve at least 80% code coverage on core logic modules.']
          }
        }
      ]
    };
  }

  // 3. Website & App Creation
  if (goalLower.includes('web') || goalLower.includes('site') || goalLower.includes('portfolio') || goalLower.includes('landing') || goalLower.includes('store') || goalLower.includes('app')) {
    return {
      id: 'wf-website-' + Date.now(),
      goal: userGoal,
      category: 'Website & Coding',
      summary: 'A 3-step modern creation pipeline: from AI component generation in v0 / Bolt to design publishing in Framer.',
      difficulty: 'Beginner',
      totalTime: '30–45 minutes',
      triageAssumptions: [
        {
          id: 'type',
          category: 'Style',
          label: 'Site / App Type',
          currentValue: explicitAssumptions?.type || 'Modern Landing Page / Web App',
          options: ['Modern Landing Page / Web App', 'E-commerce Store', 'Portfolio / Blog']
        },
        {
          id: 'tool_preference',
          category: 'Experience',
          label: 'Preferred Tool',
          currentValue: explicitAssumptions?.tool_preference || 'No Code (Framer / v0)',
          options: ['No Code (Framer / v0)', 'Prompt-to-App (Bolt.new)', 'Agentic IDE (Antigravity / Cursor)']
        }
      ],
      steps: [
        {
          stepNumber: 1,
          title: 'Generate Conversion Copy & Page Structure',
          description: 'Use Claude 3.5 Sonnet to craft high-converting headlines, value propositions, and section specs.',
          category: 'Copywriting & Specs',
          primaryTool: CURATED_TOOLS[7], // Claude
          alternativeTools: [CURATED_TOOLS[6]], // ChatGPT
          estimatedTime: '10 mins',
          proTip: 'Provide your core target offer and ask Claude to generate structured section JSON.',
          prompt: {
            id: 'pw-web-1',
            title: 'Landing Page Copy Blueprint Prompt',
            targetTool: 'Claude 3.5 Sonnet',
            stepNumber: 1,
            rawTemplate: `Act as an expert conversion copywriter. I need complete copy for a landing page for {business_offer}.

Structure into:
1. Hero Section (Headline, Sub-headline, Primary CTA)
2. Value Proposition Cards (3 key benefit cards)
3. Social Proof & FAQ Section

Brand Tone: {tone}`,
            variables: [
              { key: 'business_offer', label: 'Business Offer', defaultValue: 'AI-powered creation assistant for digital creators', placeholder: 'Describe offer' },
              { key: 'tone', label: 'Tone', defaultValue: 'Clean, sleek, authoritative, modern', placeholder: 'Brand tone' }
            ],
            explanation: 'Generating copy first gives Framer or v0 visual builders structured content to layout.',
            bestPractices: ['Focus headlines on customer outcomes rather than product features.']
          }
        },
        {
          stepNumber: 2,
          title: 'Generate UI Components in v0 or Bolt.new',
          description: 'Use v0.dev or Bolt.new to generate modern glassmorphic Tailwind React components from prompts.',
          category: 'UI & App Generation',
          primaryTool: CURATED_TOOLS[2], // v0.dev
          alternativeTools: [CURATED_TOOLS[3]], // Bolt.new
          estimatedTime: '15 mins',
          proTip: 'Ask v0 to use dark theme, sleek glassmorphism panels, and smooth micro-animations.',
          prompt: {
            id: 'pw-web-2',
            title: 'v0 Generative UI Prompt',
            targetTool: 'v0.dev / Bolt.new',
            stepNumber: 2,
            rawTemplate: `Design a dark-mode responsive hero section and feature cards for {app_name}.
Style: Modern dark slate background (#090D16), glowing indigo accents (#6366F1), glassmorphic card borders, clean typography, fully responsive.`,
            variables: [
              { key: 'app_name', label: 'App Name', defaultValue: 'Pathwise AI', placeholder: 'App name' }
            ],
            explanation: 'Specifying hex colors and glassmorphism styling gives v0 exact visual direction.',
            bestPractices: ['Copy the generated JSX directly into your React project.']
          }
        },
        {
          stepNumber: 3,
          title: 'Deploy & Publish Website',
          description: 'Publish your responsive site directly via Framer AI or Vercel.',
          category: 'Publishing',
          primaryTool: CURATED_TOOLS[10], // Framer
          alternativeTools: [CURATED_TOOLS[0]], // Antigravity
          estimatedTime: '10 mins',
          proTip: 'Publish to a free subdomain first for live testing.',
          prompt: {
            id: 'pw-web-3',
            title: 'Framer / Vercel Deployment Instructions',
            targetTool: 'Framer / Vercel',
            stepNumber: 3,
            rawTemplate: `1. Import your generated components into Framer or Vercel.
2. Link your custom domain or publish to free .framer.website subdomain.
3. Test responsiveness across mobile and desktop.`,
            variables: [],
            explanation: 'Ensures your site is live and accessible globally.',
            bestPractices: ['Check mobile responsive breakpoints before final launch.']
          }
        }
      ]
    };
  }

  // Default fallback workflow for general tasks
  return {
    id: 'wf-general-' + Date.now(),
    goal: userGoal,
    category: 'AI Pipeline',
    summary: 'A 3-step master creation path: take any concept from initial strategy to execution and quality audit.',
    difficulty: 'Beginner',
    totalTime: '30–40 minutes',
    triageAssumptions: [
      {
        id: 'output',
        category: 'Target Audience',
        label: 'Output Type',
        currentValue: explicitAssumptions?.output || 'Digital Solution / Guide',
        options: ['Digital Solution / Guide', 'Interactive App', 'Content Campaign']
      },
      {
        id: 'budget',
        category: 'Budget',
        label: 'Tool Tier',
        currentValue: explicitAssumptions?.budget || 'Best Free & Freemium Tools',
        options: ['Best Free & Freemium Tools', 'Pro Paid Suite']
      }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Formulate Creative Spec & Strategy',
        description: 'Brainstorm core angles, target persona, and project roadmap.',
        category: 'Ideation',
        primaryTool: CURATED_TOOLS[7], // Claude
        alternativeTools: [CURATED_TOOLS[6]], // ChatGPT
        estimatedTime: '10 mins',
        proTip: 'Ask Claude to challenge your assumptions and point out missing edge cases.',
        prompt: {
          id: 'pw-gen-1',
          title: 'Master Project Spec Generator',
          targetTool: 'Claude 3.5 Sonnet',
          stepNumber: 1,
          rawTemplate: `I want to create {goal_description}.

Act as an expert product strategist & creative director. Provide a step-by-step master spec:
1. Target Persona & Key Pain Points
2. Core Deliverables (MVP scope)
3. Step-by-step execution roadmap with required tools`,
          variables: [
            { key: 'goal_description', label: 'Goal Description', defaultValue: userGoal, placeholder: 'Describe what you want to build' }
          ],
          explanation: 'Clear constraints and role persona ("expert product strategist") dramatically improve output.',
          bestPractices: ['Ask follow-up questions to refine any section before building.']
        }
      },
      {
        stepNumber: 2,
        title: 'Execute Core Development & Implementation',
        description: 'Use ChatGPT or Antigravity AI to draft the core content, code, or deliverables.',
        category: 'Implementation',
        primaryTool: CURATED_TOOLS[6], // ChatGPT (Single Tool option!)
        alternativeTools: [CURATED_TOOLS[0]], // Antigravity AI
        estimatedTime: '15 mins',
        proTip: 'Provide specific formatting rules for clean output.',
        prompt: {
          id: 'pw-gen-2',
          title: 'Core Deliverable Implementation Prompt',
          targetTool: 'ChatGPT (GPT-4o)',
          stepNumber: 2,
          rawTemplate: `Execute the core deliverable for {goal_description}.

Task Requirements:
- High quality, professional execution
- Include clear step-by-step instructions
- Address target audience pain points: {target_audience}`,
          variables: [
            { key: 'goal_description', label: 'Goal', defaultValue: userGoal, placeholder: 'Describe goal' },
            { key: 'target_audience', label: 'Target Audience', defaultValue: 'General Users & Practitioners', placeholder: 'Target audience' }
          ],
          explanation: 'Standardizes workflow output for professional delivery.',
          bestPractices: ['Review drafts before publishing.']
        }
      },
      {
        stepNumber: 3,
        title: 'Refine & Finalize Output',
        description: 'Assemble all pieces into your finished format and run automated quality checks.',
        category: 'Publishing & Polish',
        primaryTool: CURATED_TOOLS[6], // ChatGPT
        alternativeTools: [CURATED_TOOLS[7]], // Claude
        estimatedTime: '15 mins',
        proTip: 'Run final text or code through ChatGPT for polish and clarity audit.',
        prompt: {
          id: 'pw-gen-3',
          title: 'Final Quality & Polish Audit',
          targetTool: 'ChatGPT (GPT-4o)',
          stepNumber: 3,
          rawTemplate: `Review my draft output for {goal_description}:

"{final_content}"

Perform a quality audit:
1. Fix clarity, grammar, or logic flaws
2. Ensure strong actionable results
3. Provide 2 key recommendations for improvement.`,
          variables: [
            { key: 'goal_description', label: 'Goal', defaultValue: userGoal, placeholder: 'Goal' },
            { key: 'final_content', label: 'Draft Content', defaultValue: 'Paste your draft text here...', placeholder: 'Draft text' }
          ],
          explanation: 'Provides an unbiased 2nd pair of eyes on your work before publishing.',
          bestPractices: ['Review suggestions before applying them.']
        }
      }
    ]
  };
}
