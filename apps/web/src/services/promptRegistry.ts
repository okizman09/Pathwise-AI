import { ToolTask, ToolPromptTemplate, ProjectProfile, PromptVariable } from '../types';

/**
 * PATHWISE TOOL-SPECIFIC PROMPT REGISTRY V4
 * 
 * CORE INVARIANTS:
 * 1. prompt.toolId === selectedTool.id
 * 2. prompt.task === step.task
 * 3. prompt.targetTool === selectedTool.name
 * 4. High-Value Prompt Architecture:
 *    ROLE | CONTEXT | OBJECTIVE | INPUTS | REQUIREMENTS | CONSTRAINTS | DELIVERABLES | OUTPUT FORMAT
 * 5. Variables derived from structured ProjectProfile (never raw text dumping).
 */

export function resolveToolPrompt(
  task: ToolTask,
  toolId: string,
  toolName: string,
  profile: ProjectProfile
): ToolPromptTemplate {
  const normToolId = toolId.toLowerCase();
  const negativeConstraintsText = profile.excludedRequirements && profile.excludedRequirements.length > 0
    ? `Explicitly EXCLUDE: ${profile.excludedRequirements.join(', ')} (do NOT over-engineer).`
    : 'Keep scope strictly aligned with stated requirements and avoid unnecessary features.';

  const structuredFeatures = (() => {
    const explicit = profile.explicitFeatures || [];
    const inferred = profile.inferredFeatures || [];
    const reqFeatures = (profile.requirements || [])
      .filter(r => r.confidence === 'explicit' || r.confidence === 'strong_inference')
      .map(r => r.requirement.replace(/_/g, ' '));
    const all = [...new Set([...explicit, ...inferred, ...reqFeatures])];
    return all.length > 0 ? all.join(', ') : 'Core project features and layout elements';
  })();

  // Determine contact channel from requirements
  const contactChannel = profile.requirements.some(r => r.requirement === 'whatsapp_integration')
    ? 'Direct WhatsApp click-to-chat inquiry buttons'
    : 'Direct contact inquiry / email submission form';

  const hasShowcase = profile.requirements.some(r => r.requirement.includes('showcase') || r.requirement.includes('catalog') || r.requirement.includes('product'));
  const audienceText = profile.targetAudience || 'Relevant visitors and prospective clients';

  // 1. BRAND STRATEGY & WEBSITE COPYWRITING (Claude / ChatGPT / Frontier LLMs)
  if (task === 'website_copywriting' || task === 'brand_strategy' || task === 'product_copywriting') {
    if (normToolId === 'claude' || normToolId === 'chatgpt' || normToolId === 'perplexity') {
      return {
        id: `prompt-${normToolId}-${task}`,
        task,
        toolId: normToolId,
        version: '2.0',
        title: `${toolName} Brand Narrative & Showcase Copy Blueprint`,
        template: `ROLE:
You are an expert brand strategist and high-conversion web copywriter.

CONTEXT:
Project Goal: "{site_topic}"
Target Audience: {target_audience}

OBJECTIVE:
Write compelling, high-converting copy for a modern responsive showcase website.

REQUIREMENTS & HIGHLIGHTS:
- Core Offerings: {key_features}
- Primary Inquiry Channel: ${contactChannel}

CONSTRAINTS (NEGATIVE):
{negative_constraints}

DELIVERABLES:
1. Hero Section: Catchy headline, clear value proposition, and primary Call-To-Action.
2. Brand Story / Mission: Why this brand/project is distinct and trusted.
${hasShowcase ? '3. Featured Collection / Showcase Grid: 3-4 item descriptions and highlights.' : '3. Core Services / Value Pillars: Key features with clear benefit descriptions.'}
4. Contact & Inquiries: Clear next steps and contact details.

OUTPUT FORMAT:
Organized markdown headers matching each website section for instant copy-pasting.`,
        variables: [
          { key: 'site_topic', label: 'Brand / Concept', defaultValue: profile.primaryGoal, placeholder: 'Brand name', required: true, source: 'project_profile' },
          { key: 'target_audience', label: 'Target Audience', defaultValue: audienceText, placeholder: 'Audience', required: true, source: 'project_profile' },
          { key: 'key_features', label: 'Features to Highlight', defaultValue: structuredFeatures, placeholder: 'Features', required: true, source: 'requirement' },
          { key: 'negative_constraints', label: 'Excluded Elements', defaultValue: negativeConstraintsText, placeholder: 'Exclusions', required: false, source: 'constraint' }
        ],
        explanation: `${toolName}'s nuanced language understanding generates natural brand storytelling without marketing fluff.`,
        proTips: [
          'Specify your brand tone (e.g., warm luxury, minimalist, playful) in the prompt.',
          'Review the product collection highlights and adjust details before publishing.'
        ]
      };
    }
  }

  // 2. NO-CODE WEBSITE BUILD (Framer / Webflow)
  if (task === 'no_code_website_build' || task === 'business_website' || task === 'portfolio_website' || task === 'landing_page' || task === 'website_ui_design') {
    if (normToolId === 'framer') {
      return {
        id: `prompt-framer-${task}`,
        task,
        toolId: 'framer',
        version: '2.0',
        title: `${toolName} No-Code Brand Website Generator`,
        template: `ROLE:
You are a senior Framer no-code web designer.

OBJECTIVE:
Generate a sleek, modern responsive showcase website for "{site_topic}".

AUDIENCE:
{target_audience}

DESIGN SYSTEM & AESTHETIC:
- Visual Style: Clean modern aesthetic, harmonious color palette, elegant typography, smooth micro-interactions.
- Responsive Viewports: Mobile-first layout with tablet and desktop breakpoints.

REQUIRED SECTIONS:
- Hero banner with headline, badge, and inquiry CTA button
${hasShowcase ? '- Featured product/showcase gallery with high-resolution image cards' : '- Feature grid highlighting key services or offerings'}
- About / Story section
- Contact and ${contactChannel.toLowerCase()} footer

CONSTRAINTS (NEGATIVE):
Pure visual showcase with no coding required. ${negativeConstraintsText}

QUALITY CRITERIA:
- Fast initial page load
- Accessible contrast ratios
- Clear tap targets on mobile devices`,
        variables: [
          { key: 'site_topic', label: 'Brand Concept', defaultValue: profile.primaryGoal, placeholder: 'Brand Concept', required: true, source: 'project_profile' },
          { key: 'target_audience', label: 'Target Audience', defaultValue: audienceText, placeholder: 'Audience', required: true, source: 'project_profile' }
        ],
        explanation: `Framer converts natural language layout descriptions directly into editable visual canvas pages with built-in responsive breakpoints.`,
        proTips: [
          'Paste your generated brand copy directly into Framer text layers.',
          'Replace placeholder photography with real high-resolution collection images in Framer asset manager.'
        ]
      };
    }

    if (normToolId === 'webflow') {
      return {
        id: `prompt-webflow-${task}`,
        task,
        toolId: 'webflow',
        version: '2.0',
        title: `${toolName} Visual CMS Showcase Blueprint`,
        template: `ROLE:
You are an expert Webflow developer.

OBJECTIVE:
Create a responsive website structure and CMS collection for "{site_topic}".

REQUIREMENTS:
1. CMS Collection schema for showcase items (Name, Image, Price/Tag, Description).
2. Responsive grid layout with container max-width 1280px.
3. Native Webflow form for contact inquiries.

CONSTRAINTS:
${negativeConstraintsText}`,
        variables: [
          { key: 'site_topic', label: 'Website Topic', defaultValue: profile.primaryGoal, placeholder: 'Topic', required: true, source: 'project_profile' }
        ],
        explanation: `Webflow provides native visual CSS box-model control with CMS collections.`,
        proTips: [
          'Use Webflow Classes for reusable styling across product cards.',
          'Connect the native Webflow form to your notification email.'
        ]
      };
    }
  }

  // 3. FRONTEND CODE GENERATION (v0 / Bolt / Lovable)
  if (task === 'frontend_generation' || task === 'website_ui_design') {
    if (normToolId === 'v0-dev') {
      return {
        id: `prompt-${normToolId}-${task}`,
        task,
        toolId: 'v0-dev',
        version: '2.0',
        title: `${toolName} React & Tailwind UI Component Generator`,
        template: `ROLE:
You are a senior frontend engineer specializing in React, Tailwind CSS, and Shadcn UI.

OBJECTIVE:
Create an accessible, production-ready React UI component for "{app_concept}".

AUDIENCE:
{target_users}

TECH STACK:
React 18 (TypeScript), Tailwind CSS, Lucide React icons, Radix/Shadcn primitives.

REQUIRED FEATURES:
{key_features}

CONSTRAINTS (NEGATIVE):
Focus strictly on frontend presentation and state. ${negativeConstraintsText}

DELIVERABLES:
Self-contained TypeScript JSX file with clean Tailwind utility classes and dark-mode support.`,
        variables: [
          { key: 'app_concept', label: 'Component Concept', defaultValue: profile.primaryGoal, placeholder: 'Concept', required: true, source: 'project_profile' },
          { key: 'target_users', label: 'Target Users', defaultValue: profile.targetAudience || 'Target audience', placeholder: 'Users', required: true, source: 'project_profile' },
          { key: 'key_features', label: 'Key Features', defaultValue: structuredFeatures, placeholder: 'Features', required: true, source: 'requirement' }
        ],
        explanation: `v0 generates production-ready React JSX with accessible Shadcn components and Tailwind styles.`,
        proTips: [
          'Click individual UI elements in v0 preview to refine button sizes and color accents.',
          'Copy the CLI command to import components directly into your project.'
        ]
      };
    }

    if (normToolId === 'bolt-new' || normToolId === 'lovable-dev') {
      return {
        id: `prompt-${normToolId}-${task}`,
        task,
        toolId: normToolId,
        version: '2.0',
        title: `${toolName} Fullstack Web Application Builder`,
        template: `ROLE:
You are a full-stack application architect.

OBJECTIVE:
Build a complete full-stack web application for "{app_concept}".

FEATURES:
{key_features}

REQUIREMENTS:
- Responsive navigation and layout
- Supabase/SQLite data persistence models
- Interactive forms with field validation

CONSTRAINTS:
${negativeConstraintsText}`,
        variables: [
          { key: 'app_concept', label: 'Application Concept', defaultValue: profile.primaryGoal, placeholder: 'Concept', required: true, source: 'project_profile' },
          { key: 'key_features', label: 'Features', defaultValue: structuredFeatures, placeholder: 'Features', required: true, source: 'requirement' }
        ],
        explanation: `${toolName} generates and executes full-stack web applications with instant live preview.`,
        proTips: [
          'Check the live preview terminal for any runtime warnings.',
          'Export to GitHub when ready for production hosting.'
        ]
      };
    }
  }

  // 4. BACKEND IMPLEMENTATION, AUTHENTICATION & AGENTIC TESTING (Antigravity AI / Cursor)
  if (task === 'backend_implementation' || task === 'authentication' || task === 'database_setup' || task === 'write_code') {
    if (normToolId === 'antigravity') {
      return {
        id: `prompt-antigravity-${task}`,
        task,
        toolId: 'antigravity',
        version: '2.0',
        title: `${toolName} Autonomous Coding & Verification Task`,
        template: `ROLE:
You are an autonomous pair programmer and staff software engineer.

OBJECTIVE:
Implement {task_title} for "{app_concept}".

TECH STACK:
{tech_stack}

TASKS & DELIVERABLES:
1. Inspect the codebase repository structure and identify relevant module files.
2. Implement secure logic, route handlers, schema validation, and error boundaries.
3. Execute background terminal build and automated unit tests to verify 0 regressions.

CONSTRAINTS:
Maintain backwards compatibility and preserve all existing documentation docstrings.`,
        variables: [
          { key: 'task_title', label: 'Engineering Task', defaultValue: 'Authentication & Backend Logic', placeholder: 'Task', required: true, source: 'requirement' },
          { key: 'app_concept', label: 'Codebase Scope', defaultValue: profile.primaryGoal, placeholder: 'Scope', required: true, source: 'project_profile' },
          { key: 'tech_stack', label: 'Tech Stack', defaultValue: profile.technicalEvidence.hasExistingCodebase ? 'FastAPI (Python) + React (TypeScript)' : 'TypeScript / Node.js', placeholder: 'Stack', required: true, source: 'project_profile' }
        ],
        explanation: `Antigravity AI navigates multi-file codebases, modifies backend services, and runs terminal verification commands autonomously.`,
        proTips: [
          'Ask Antigravity to run unit tests after code modifications to guarantee stability.',
          'Specify exact file paths if working on an existing repository.'
        ]
      };
    }

    if (normToolId === 'cursor') {
      return {
        id: `prompt-cursor-${task}`,
        task,
        toolId: 'cursor',
        version: '2.0',
        title: `${toolName} Composer Fullstack Refactor Prompt`,
        template: `ROLE:
In Cursor Composer (Cmd+I):

OBJECTIVE:
Implement {task_title} for "{app_concept}".

TECH STACK:
{tech_stack}

INSTRUCTIONS:
1. Reference @codebase for existing data models and API conventions.
2. Implement clean TypeScript interfaces, validation schemas, and error handlers.
3. Review multi-file diffs before accepting edits.`,
        variables: [
          { key: 'task_title', label: 'Task Title', defaultValue: 'Backend Logic Implementation', placeholder: 'Task', required: true, source: 'requirement' },
          { key: 'app_concept', label: 'Project Goal', defaultValue: profile.primaryGoal, placeholder: 'Goal', required: true, source: 'project_profile' },
          { key: 'tech_stack', label: 'Tech Stack', defaultValue: profile.technicalEvidence.hasExistingCodebase ? 'FastAPI + React' : 'Fullstack TypeScript', placeholder: 'Stack', required: true, source: 'project_profile' }
        ],
        explanation: `Cursor Composer edits multiple files across your workspace simultaneously with context from @codebase.`,
        proTips: [
          'Use @codebase in Cursor to reference existing project patterns.',
          'Review the diff before accepting composer modifications.'
        ]
      };
    }
  }

  // 5. DOMAIN SETUP & PUBLISHING (Framer / Webflow / General)
  if (task === 'domain_setup' || task === 'contact_form_setup' || task === 'deployment') {
    return {
      id: `prompt-${normToolId}-${task}`,
      task,
      toolId: normToolId,
      version: '2.0',
      title: `${toolName} Domain Setup & Live Publishing Guide`,
      template: `ROLE:
Deployment and Domain Configuration Guide for ${toolName}.

OBJECTIVE:
Connect custom domain name and publish live website for "{site_topic}".

STEPS:
1. In ${toolName} Project Settings, navigate to Domains.
2. Add your custom domain name (e.g., yourbrand.com).
3. Configure your DNS provider with the A and CNAME records provided by ${toolName}.
4. Enable automatic SSL certificate and test live WhatsApp/form buttons on mobile.`,
      variables: [
        { key: 'site_topic', label: 'Domain Purpose', defaultValue: profile.primaryGoal, placeholder: 'Domain Purpose', required: true, source: 'project_profile' }
      ],
      explanation: `${toolName} includes built-in global CDN hosting and automated SSL certificate provisioning.`,
      proTips: [
        'DNS records can take 10-30 minutes to propagate worldwide.',
        'Send a test submission through your live contact form or WhatsApp button to confirm delivery.'
      ]
    };
  }

  // 6. DEFAULT FALLBACK PROMPT (V4 — Structured High-Impact Architecture)
  const structuredTopic = profile.primaryGoal.length > 80
    ? profile.projectType.replace(/_/g, ' ')
    : profile.primaryGoal;

  const structuredAudience = profile.targetAudience || 'Target users and customers';

  return {
    id: `prompt-${normToolId}-default`,
    task,
    toolId: normToolId,
    version: '2.0',
    title: `${toolName} Task Execution Guide`,
    template: `ROLE:
You are an expert specialist using ${toolName}.

OBJECTIVE:
Execute the "${task.replace(/_/g, ' ')}" stage for "{project_topic}".

TARGET AUDIENCE:
{target_audience}

CORE REQUIREMENTS:
{key_requirements}

CONSTRAINTS (NEGATIVE):
{scope_constraints}

INSTRUCTIONS:
1. Focus strictly on the deliverables for this stage using ${toolName}'s native features.
2. Maintain high quality standards and mobile responsiveness.
3. Keep outputs aligned with project type: ${profile.projectType.replace(/_/g, ' ')}.`,
    variables: [
      { key: 'project_topic', label: 'Project Topic', defaultValue: structuredTopic, placeholder: 'Describe your project', required: true, source: 'project_profile' as const },
      { key: 'target_audience', label: 'Target Audience', defaultValue: structuredAudience, placeholder: 'Who is this for?', required: true, source: 'project_profile' as const },
      { key: 'key_requirements', label: 'Key Requirements', defaultValue: structuredFeatures, placeholder: 'Core features and requirements', required: true, source: 'requirement' as const },
      { key: 'scope_constraints', label: 'Scope Constraints', defaultValue: negativeConstraintsText, placeholder: 'What should be excluded', required: false, source: 'constraint' as const }
    ],
    explanation: `Use ${toolName} for verified execution of the "${task.replace(/_/g, ' ')}" stage. Variables are pre-populated from your project profile.`,
    proTips: [
      `Refer to the official ${toolName} documentation for tool-specific syntax.`,
      'Review all variable values before submitting — defaults are inferred from your goal.'
    ]
  };
}
