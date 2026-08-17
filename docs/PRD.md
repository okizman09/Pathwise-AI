# Pathwise AI – Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** July 29, 2026  
**Owner:** Product / Founder  
**Status:** Draft for MVP  

---

## 1. Product Overview

**Pathwise AI** is a web application that helps beginners (and intermediate users) overcome AI tool confusion. Users describe what they want to create (website, video, music, content, designs, etc.), and the system delivers:

- Ranked tool recommendations with clear reasons
- Complete step-by-step workflows
- High-quality, ready-to-use, **editable prompt templates**
- Smart, non-overwhelming clarification when the request is vague

**One-line value proposition:**  
“Tell us what you want to create. We’ll give you the best tools, exact prompts, and a clear path — without the overwhelm.”

---

## 2. Problem Statement

Many people want to create websites, videos, music, designs, and content using AI, but face three major blockers:

1. **Tool overload** – Too many AI tools; unclear which one to use
2. **Prompt uncertainty** – Don’t know how to write effective prompts
3. **Task-to-tool matching** – Don’t know which tool is best for a specific sub-task

Existing solutions (static directories, YouTube tutorials, generic ChatGPT) still leave users confused or produce mediocre results. Pathwise AI solves this with **curated, personalized, always-updated guidance** delivered in a clean, actionable interface.

---

## 3. Goals & Success Metrics

### Business Goals
- Build a real product with strong product-market fit
- Achieve sustainable revenue through freemium subscriptions + affiliate commissions
- Create a defensible knowledge layer (curated tools + prompt intelligence)

### Product Goals (MVP)
- Reduce time-to-first-usable-prompt for beginners to under 2 minutes
- Deliver high-quality, editable prompts that users actually copy and use
- Handle vague inputs gracefully without feeling interrogative

### Success Metrics (MVP – first 90 days)
| Metric | Target |
|--------|--------|
| Weekly Active Users | 500+ |
| Prompt copy rate | > 40% of generated prompts |
| Clarification completion rate | > 70% |
| Free → Paid conversion | ≥ 3–5% |
| NPS / qualitative feedback | Positive on “reduced overwhelm” |

---

## 4. Target Users

**Primary Persona – “Confused Creator”**
- Age 18–40
- Beginner or intermediate AI user
- Wants to create websites, videos, music, content, or designs
- Feels overwhelmed by tool choices and poor results from generic prompts
- Budget-conscious but willing to pay $9–29/month for clarity and time savings
- Global, with strong opportunity in emerging markets (Nigeria, India, etc.)

**Secondary Persona – “Optimizing Creator”**
- Already uses some AI tools
- Wants better workflows and higher-quality prompts
- Values curated recommendations and time savings

---

## 5. Core User Stories

1. As a beginner, I can describe what I want to create in plain language and receive a clear recommended workflow + tools.
2. As a user with a vague request, I receive helpful clarification (max 1–2 questions) that does not feel overwhelming.
3. As a user, I receive high-quality, copy-paste-ready prompts that I can easily edit.
4. As a user, I understand *why* a particular tool or prompt structure was recommended.
5. As a user, I can save workflows and edited prompts for later use.
6. As a free user, I can generate a limited number of workflows and still experience real value.

---

## 6. Functional Requirements

### 6.1 Core Features (MVP)

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| F1 | Natural language input | Must | User describes creation goal in free text |
| F2 | Smart Triage & Clarification | Must | Detects vagueness, asks max 1–2 targeted questions (or offers chips), uses “assume + refine” pattern |
| F3 | Tool Recommendation Engine | Must | Returns ranked tools with reasons, free/paid options, and alternatives |
| F4 | Workflow Generator | Must | Breaks the goal into clear sequential steps |
| F5 | Prompt Generation Engine | Must | Generates high-quality, tool-specific, editable prompts for each step |
| F6 | Editable Prompt Templates | Must | Users can edit prompts in-place, see variables, copy, regenerate |
| F7 | Response Explanation | Must | Shows why tools/prompts were chosen (educational value) |
| F8 | Basic User Accounts | Must | Sign up / login, save workflows & prompts |
| F9 | Free usage limits | Must | Rate limiting / daily generation limits for free tier |

### 6.2 Non-Functional Requirements

- Response time for recommendations: < 8–12 seconds (p95)
- Mobile-responsive web experience
- Clean, calm, non-overwhelming UI
- Secure authentication
- Structured logging and basic analytics
- Ability to update the tool knowledge base without code changes

---

## 7. Clarification & Prompt Architecture (Key Differentiators)

### Clarification Strategy
- **Triage Layer** first (lightweight model)
- Confidence score decides whether to clarify
- Maximum 1–2 questions at a time
- Prefer option chips / buttons over open text when possible
- “I assumed X. Want to adjust?” pattern is preferred over interrogation
- Progressive disclosure — give value first

### Prompt Generation Strategy
- Multi-stage pipeline (not a single giant prompt)
- RAG over curated tool + prompt knowledge base
- Structured outputs (Pydantic models)
- Tool-specific prompting knowledge injected
- Final prompts delivered as clean, editable blocks with explanations

---

## 8. Technical Architecture (High Level)

**Recommended Stack**
- **Frontend**: Next.js (React) + Tailwind CSS / Modern CSS
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL + pgvector
- **Auth**: Clerk or Supabase Auth
- **AI Layer**: Claude / Grok / GPT models via structured outputs + RAG
- **Payments**: Stripe
- **Hosting**: Vercel (frontend) + Railway / Render / Fly.io (backend)

---

## 9. Monetization (MVP+)

- **Free tier**: Limited daily generations + basic features
- **Pro tier**: $9–19/month – unlimited generations, saved workflows, advanced refinement
- **Affiliate revenue**: Primary growth lever (recommend tools with affiliate links)
- Future: Team plans, white-label, premium workflow packs

---

## 10. Out of Scope for MVP

- Full interactive step-by-step guided mode inside the app
- Community sharing of workflows
- Mobile native apps
- Advanced personalization based on long-term history
- Multi-language support beyond English
- B2B / enterprise features

---

## 11. Project Structure (Recommended Repository Layout)

```text
pathwise-ai/
├── apps/
│   ├── web/                    # Next.js / React frontend
│   └── api/                    # FastAPI backend
├── packages/                   # Shared types / utilities
├── docs/
│   ├── PRD.md                  # This document
│   ├── architecture.md
│   ├── prompt-engineering.md
│   └── knowledge-base.md
├── data/
│   └── knowledge/              # Tool descriptions, prompt examples, etc.
├── scripts/
├── .env.example
├── docker-compose.yml
├── README.md
└── Makefile
```

---

## 12. MVP Development Phases

| Phase | Duration | Focus |
|-------|----------|-------|
| Phase 0 | 1 week | Repo setup, auth, basic UI shell, knowledge base schema |
| Phase 1 | 2–3 weeks | Triage + Clarification + Tool Recommendation |
| Phase 2 | 2–3 weeks | Workflow generation + Prompt generation + Editable templates |
| Phase 3 | 1–2 weeks | User accounts, saving, rate limiting, basic analytics |
| Phase 4 | 1–2 weeks | Polish, testing, Stripe integration, soft launch |

---

## 13. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| AI tool landscape changes rapidly | Design knowledge base to be easily updatable; weekly review process |
| Users find clarification annoying | Strict limit of 1–2 questions + “assume + refine” pattern |
| LLM costs | Use lighter models for triage; cache common patterns; rate limit free users |
| Prompt quality inconsistency | Heavy use of structured outputs + curated examples + evaluation set |
| Low retention | Focus on editable templates + save functionality + clear educational value |
