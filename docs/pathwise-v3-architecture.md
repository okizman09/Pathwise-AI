# Pathwise AI — V3 Intelligence & Recommendation Architecture

## 1. Core Architectural Principle

> **"LLMs generate language and reasoning. Pathwise generates truth."**

Pathwise AI separates natural language comprehension and reasoning from canonical tool knowledge and recommendation logic. Ground truth (tool status, verified URLs, pricing models, supported capabilities, hard constraints, suitability scoring) is managed deterministically by Pathwise.

---

## 2. End-to-End Execution Flow

```
User Query / Goal
        │
        ▼
[Requirements Intelligence Layer]
  - extractProjectProfile()
  - extractTechnicalEvidence() (Auth, DB, APIs, Payments, Existing Repo)
  - extractRequirementsFromProfile()
  - Intentional Exclusions (Negative requirements preventing over-engineering)
        │
        ▼
[Tool-Agnostic Workflow Decomposition]
  - generateWorkflowFromProfile()
  - Generates minimal 2–4 sequential StageTaskDefinitions
        │
        ▼
[Deterministic Retrieval & Ranking Engine]
  - Hard Constraints Validator (Rejects incompatible tools before scoring)
  - Normalized 0–100 Weighted Suitability Scoring (DEFAULT_SCORING_WEIGHTS)
  - fitLevel Evaluation ('excellent' | 'good' | 'acceptable' | 'poor' | 'incompatible')
  - Tool Continuity Optimization (Reduces unnecessary switching)
        │
        ▼
[Tool-Specific Prompt Resolution]
  - resolveToolPrompt()
  - Structured PromptVariable derivation (No raw user prompt dumping)
  - Versioned template resolution (version: '2.0')
        │
        ▼
[Workflow Optimization]
  - optimizeWorkflow() -> Core Path vs. Optional Enhancements
        │
        ▼
[Pipeline Validator & Ground Truth Hydrator]
  - validateAndHydrateWorkflow()
  - Canonical fact hydration & hallucination interception
        │
        ▼
[Rich Interactive UI]
  - Project Understanding & Scope Intelligence Panel
  - "Why This Tool?" Deterministic Decision Cards
  - Interactive Prompts & Alternatives
```

---

## 3. Normalized Scoring Model (100-Point Scale)

```typescript
export const DEFAULT_SCORING_WEIGHTS: ScoringWeights = {
  taskFit: 35,            // Direct certified support for stage task
  capabilityCoverage: 20, // Underlying capability overlap
  skillFit: 10,           // Matches beginner/intermediate/advanced
  budgetFit: 15,          // Free tier or budget constraint match
  platformFit: 10,        // Web/Desktop/OS compatibility
  quality: 5,             // Canonical output quality rating
  easeOfUse: 5            // Canonical ease of use rating
};
```

### Hard Constraints (Executed BEFORE Scoring)
1. **HC-1 (Budget):** User requires `free_only` -> Reject tools without verified free tier.
2. **HC-2 (No-Code):** User specifies no-code -> Reject developer/code-first tools (`v0-dev`, `cursor`, `antigravity`, `windsurf`, `replit`, `github-copilot`).
3. **HC-3 (Video):** Video production tasks MUST have `video_generation` capability.
4. **HC-4 (Audio):** Music/audio tasks MUST have `music_generation` or `audio_generation` capability.
5. **HC-5 (Voiceover):** Narration tasks MUST have `voice_generation` capability.
6. **HC-6 (Existing Codebase):** Coding tasks on existing repos reject visual no-code website builders (`framer`, `webflow`).
7. **HC-7 (E-Commerce Payments):** Payment processing and cart checkout reject portfolio-only visual builders.

---

## 4. Key V3 Data Models

### ToolTaskSuitability
```typescript
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
  continuityScore: number;
  evidence: string[];
}
```

### ProjectConstraints & Scope Protection
```typescript
export interface ProjectConstraints {
  budget?: 'free_only' | 'low_cost' | 'paid_ok' | 'unknown';
  time?: 'urgent' | 'normal' | 'flexible';
  platform?: string[];
  skillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'unknown';
  coding?: 'no_code' | 'some_code' | 'full_code' | 'unknown';
  deadline?: string;
  preferredTools?: string[];
  excludedTools?: string[];
  existingStack?: string[];
}
```

---

## 5. System Observability & Debug Data Contract
Every `WorkflowResult` carries internal observability tracking via `debugInfo`:
- `projectClassificationEvidence`: Classification rationale.
- `requirementEvidence`: Confidence and origin of requirements.
- `selectedCandidateScores`: Deterministic scores for selected tools.
- `rejectedCandidates`: Log of low-scoring or incompatible tools per step.
- `hardConstraintFailures`: Traced hard constraint rejections.
- `continuityBonuses`: Steps where tool continuity was preserved.
- `promptResolution`: Resolution mapping between step tasks and template IDs.
