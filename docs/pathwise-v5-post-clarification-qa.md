# Pathwise AI V5 — Post-Clarification Validation & Adversarial QA Report

## Executive Summary

- **Total Test Assertions:** 102 / 102 Passed (100%)
- **Test Command:** `npm test` (`npx tsx -e "import { runRecommendationTests } from './src/services/__tests__/recommendationEngine.test'; runRecommendationTests();"`)
- **Build Status:** Clean (`tsc && vite build` passed in 5.44s with 0 errors and 0 warnings)
- **Execution Date:** 2026-08-20

---

## 1. Complete Interaction Loop & User Clarification Evidence

### Test Scenario:
1. **Turn 1:** User inputs generic `"build a website"`.
   - **Result:** `status: 'ambiguous'`, `clarificationRequired: true`, `confidence: 42` ($\le 59$).
2. **Turn 2:** User selects `"Business/company"`.
   - **Result:** `projectType = 'business_website'`, `source = 'user_clarification'`, `confidence = 'explicit'`.
   - **Verification:** System does NOT automatically infer payments, auth, database, cart, admin dashboard, WhatsApp, or pricing.

```typescript
RequirementEvidence {
  requirement: 'business_website',
  confidence: 'explicit',
  source: 'user_clarification',
  evidence: ['User clarified business website during intent clarification']
}
```

---

## 2. All Website Branches Post-Clarification

| Clarification Answer | Inferred Project Type | Inferred Architecture & Exclusions |
|---|---|---|
| **Business / Company** | `business_website` | Showcase copy + No-code build. Auth & payments excluded unless independently requested. |
| **Personal Portfolio** | `portfolio` | Case studies + Portfolio build. Database & auth excluded. |
| **Online Store** | `ecommerce_website` | Product catalog + store UI. Payments & auth strictly evidence-driven. |
| **Blog / Content Site** | `blog` | Content management + reading layout. E-commerce/payments excluded. |
| **Web Application / SaaS**| `web_application` | Architecture + fullstack interactive components. |
| **Landing Page** | `landing_page` | High-converting single/two-step minimal build. |

---

## 3. Multi-Turn Information Accumulation & Negations

### Multi-Turn Dialogue Progression:
- **Turn 1:** `"I need a website"` $\rightarrow$ Ambiguous.
- **Turn 2:** `"It's for my handmade wig business."` $\rightarrow$ `business_website`.
- **Turn 3:** `"I want customers to message me on WhatsApp."` $\rightarrow$ `whatsapp_integration` becomes explicit evidence.
- **Turn 4:** `"I don't need online payments."` $\rightarrow$ `payments` is added to `excludedRequirements`.

### Negation-Awareness Proofs:
- `"I need a business website but I don't want payments."` $\rightarrow$ `payments` is explicitly excluded; `hasPayments` remains `false`.
- `"I need a store but users don't need accounts."` $\rightarrow$ `authentication` is explicitly excluded; `hasAuth` remains `false` (not tripped by the word "accounts").

### Contradiction Resolution:
- `"I want a simple no-code website. I need user accounts and a dashboard."` $\rightarrow$ Later scope addition overrides static-site assumptions, setting `hasAuth = true`, `hasAdminDashboard = true`, and re-evaluating `codingRequirement`.

---

## 4. Minimal Workflows & Domain Setup Logic

1. **Single-Task Build:** `"Create a one-page landing page in Framer."`
   - Generated Steps: **1 step** (`no_code_website_build` $\rightarrow$ Framer AI).
   - Domain setup is **NOT** forced.
2. **Two-Task Build & Publish:** `"Create the page and publish it."`
   - Generated Steps: **2 steps** (`no_code_website_build` $\rightarrow$ `domain_setup`).

---

## 5. Confidence Calibration & Adversarial Gemini Interception

### Calibrated Ranges:
- `"make something professional"`: Confidence **35** ($< 40$).
- `"build a website"`: Confidence **42** ($< 60$).
- `"build a website for my wig business"`: Confidence **85** ($\ge 75$).
- `"I want an ecommerce store for my clothing brand with payments"`: Confidence **95** ($\ge 90$).

### Adversarial Gemini Interception:
When an adversarial LLM payload introduces a hallucinated tool (`magic-builder-xyz`), the pipeline validator intercepts, flags the untrusted tool, and repairs the step to the verified canonical tool (`Claude 3.5 Sonnet`).

---

## 6. Golden Invariants 13 through 22 Verification

- **INVARIANT 13:** Clarification answers are explicit user evidence (`source: 'user_clarification'`).
- **INVARIANT 14:** Clarification answers do not silently introduce unrelated requirements (e.g. business website does not add payments).
- **INVARIANT 15:** Unknown remains unknown after clarification unless the answer resolves it.
- **INVARIANT 16:** Explicit negative statements override inferred positive requirements.
- **INVARIANT 17:** Domain setup is never automatically appended to every website.
- **INVARIANT 18:** A one-task workflow is valid.
- **INVARIANT 19:** Clarification reduces uncertainty and increases confidence.
- **INVARIANT 20:** If uncertainty remains materially high after clarification, at most one additional question is asked.
- **INVARIANT 21:** Strong inference is distinguishable from explicit evidence.
- **INVARIANT 22:** Every mandatory task has at least one evidence-backed requirement.
