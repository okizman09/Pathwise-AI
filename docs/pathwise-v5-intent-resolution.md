# Pathwise AI V5 — Intent Resolution & Epistemic Uncertainty Specification

## 1. Executive Summary

Pathwise AI V5 replaces premature inference and guessing with an **epistemically honest Intent Resolution Architecture**.

When a user provides an underspecified prompt (e.g. `"build a website"`), the system **does not invent** a business model, target audience, pricing tiers, WhatsApp contact channels, or testimonials. Instead, it measures information sufficiency, assigns low confidence ($\le 59$), sets `clarificationRequired = true`, and prompts the user with high-information-gain questions before constructing a pipeline.

---

## 2. Core Intent Resolution Schema

```typescript
export type IntentResolutionStatus =
  | 'resolved'
  | 'partially_resolved'
  | 'ambiguous'
  | 'insufficient_information';

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
```

---

## 3. Measurable Uncertainty & Thresholds

Confidence is computed deterministically from evidence strength and candidate separation:

```typescript
export const INTENT_CONFIDENCE_THRESHOLD = 75;
export const CANDIDATE_SEPARATION_THRESHOLD = 15;
export const MAX_CLARIFICATION_QUESTIONS = 2;
```

- **Generic Intent Rule:** Generic inputs (e.g., `"build a website"`, `"make a website"`, `"website"`, `"build a simple website without coding"`) strictly produce:
  - `status: 'ambiguous'`
  - `confidence: 42` (strictly $\le 59$)
  - `primaryCandidate: null`
  - `clarificationRequired: true`
  - `targetAudience: null`
  - `primaryOutcome: null`
  - Zero invented features (no WhatsApp, pricing, or testimonials).

- **Specific Intent Rule:** Context-rich inputs (e.g., `"I sell handmade wigs and need a beautiful online presence for my collection."`) produce:
  - `status: 'resolved'`
  - `confidence: 85`–`96`
  - `primaryCandidate: business_website`
  - `clarificationRequired: false`

---

## 4. Task-First Toolchain Assembly (Claude ➡️ Framer ➡️ Framer)

In V5, task suitability strictly dominates tool continuity. For a handmade wig business:
- **Step 1 (`website_copywriting`):** Selected Tool is **Claude 3.5 Sonnet** (Frontier language model for storytelling & product descriptions).
- **Step 2 (`no_code_website_build`):** Selected Tool is **Framer AI** (Visual canvas builder).
- **Step 3 (`domain_setup`):** Selected Tool is **Framer AI** (One-click custom domain & SSL publishing).
