# Pathwise AI — V5 Architecture Specification

## 1. System Pipeline Overview

```
User Natural Language Goal
            ↓
Information Sufficiency & Intent Resolution (intentResolutionEngine.ts)
            ↓
Is Clarification Mandatory?
       ┌────┴────┐
      YES        NO
       │         │
  Clarification  ProjectProfile Extraction (requirementsEngine.ts)
  UI Modal       │
       │         Task Decomposition (Minimum Viable Toolchain)
  User Answers   │
       │         Hard Constraint Filtering (HC-1 through HC-7)
       └────────→│
                 Tool Suitability Scoring (recommendationEngine.ts)
                 │
                 Workflow Optimization (Core vs Optional Steps)
                 │
                 9-Part Structured Prompt Resolution (promptRegistry.ts)
                 │
                 Pipeline Validation & Hydration (pipelineValidator.ts)
                 │
                 Final Verified Toolchain UI (WorkflowTimeline.tsx)
```

---

## 2. Key Modules & Roles

1. **`src/services/intentResolutionEngine.ts`**:
   - Resolves intent status (`resolved`, `partially_resolved`, `ambiguous`, `insufficient_information`).
   - Computes candidate separation and normalized confidence (0–100).
   - Generates $\le 2$ high-information-gain clarification questions for ambiguous goals.

2. **`src/services/requirementsEngine.ts`**:
   - Enforces strict evidence hierarchy.
   - Preserves nullable `targetAudience` and `primaryOutcome`.
   - Protects simple websites from technical scope bloat via `excludedRequirements`.

3. **`src/services/recommendationEngine.ts`**:
   - Evaluates tools task-first.
   - Prevents visual website builders from claiming copywriting tasks.
   - Capped continuity bonus ($\le 10$) strictly subordinate to task fit.

4. **`src/services/promptRegistry.ts`**:
   - Structured 9-part prompt schema populated with resolved project attributes.

5. **`src/components/WorkflowTimeline.tsx`**:
   - Renders interactive Clarification Cards when `clarificationRequired === true`.
   - Renders "Why This Tool?" suitability fit panels and structured alternative tradeoffs.
