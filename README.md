# Pathwise AI

> **"Tell us what you want to create. We’ll give you the best tools, exact prompts, and a clear path — without the overwhelm."**

Pathwise AI is a web application that helps beginners and intermediate creators overcome AI tool confusion. Describe any creation goal—websites, videos, music, content, designs—and Pathwise AI delivers:
- Ranked tool recommendations with transparent rationales.
- Complete step-by-step creation workflows.
- High-quality, ready-to-use, **editable prompt templates**.
- Smart, non-overwhelming "Assume & Refine" clarification.

---

## 🚀 Repository Structure

```text
Pathwise AI/
├── apps/
│   ├── web/                    # Next.js / React + Vite Frontend UI
│   └── api/                    # FastAPI Python Backend Service
├── packages/                   # Shared types and utilities
├── docs/
│   └── PRD.md                  # Product Requirements Document
├── data/
│   └── knowledge/              # Curated AI Tool & Prompt Knowledge Base
├── scripts/                    # Maintenance & seeding scripts
└── README.md
```

---

## 🛠️ Quick Start

### 1. Frontend (React + Vite)
```bash
cd apps/web
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Backend (FastAPI)
```bash
cd apps/api
source .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Docs available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 📄 Documentation

- [Product Requirements Document (PRD)](docs/PRD.md)

---

## 🧠 Tool Intelligence Architecture

Pathwise AI is built on the core principle:
> **"LLMs generate language and reasoning. Pathwise generates truth."**

Every tool is modeled as a canonical, verified entity with controlled capability and task taxonomies:

```typescript
interface Tool {
  id: string;
  name: string;
  vendor: string;
  slug: string;
  description: string;
  officialUrl: string;
  status: "active" | "deprecated" | "unknown";
  verification: {
    status: "verified" | "partially_verified" | "unverified";
    lastVerifiedAt: string;
    sources: string[];
  };
  pricing: {
    model: "free" | "freemium" | "paid" | "usage_based" | "unknown";
    freeTier: boolean;
    startingPrice?: number;
    currency?: string;
    billingPeriod?: "monthly" | "yearly" | "usage" | "unknown";
    details?: string;
  };
  platforms: Array<"web" | "windows" | "macos" | "linux" | "ios" | "android" | "api">;
  skillLevel: "beginner" | "intermediate" | "advanced";
  capabilities: ToolCapability[];
  supportedTasks: ToolTask[];
  inputTypes: Array<"text" | "image" | "audio" | "video" | "file" | "code" | "url">;
  outputTypes: Array<"text" | "image" | "audio" | "video" | "code" | "website" | "presentation" | "data">;
  strengths: string[];
  limitations: string[];
  bestFor: string[];
  notRecommendedFor: string[];
  integrations: string[];
  alternatives: string[];
  complements: string[];
  scores: {
    taskFit?: number;
    easeOfUse?: number;
    outputQuality?: number;
    customization?: number;
    valueForMoney?: number;
  };
  tags: string[];
}
```

## 🎯 Task Intelligence Architecture

Pathwise reasons about user objectives by transforming plain English goals into a structured `UserIntent`:

```typescript
interface UserIntent {
  goal: string;
  primaryTask: ToolTask;
  domain?: string;
  targetAudience?: string[];
  experienceLevel: "beginner" | "intermediate" | "advanced" | "unknown";
  budget: {
    type: "free_only" | "low" | "moderate" | "flexible" | "unknown";
    amount?: number;
    currency?: string;
  };
  platform?: Array<"web" | "windows" | "macos" | "linux" | "ios" | "android">;
  requirements: Requirement[];
  constraints: Constraint[];
  preferences: Preference[];
  ambiguities: Ambiguity[];
}
```

### Ambiguity Resolution Rules
- Identifies ambiguities instead of silently assuming high-impact decisions.
- **Maximum clarification questions: 2.**
- Only high-impact structural ambiguities trigger clarification.
- Never assumes a specific technology stack without user input.

---

### Running Verification Tests
```bash
npm test
```


