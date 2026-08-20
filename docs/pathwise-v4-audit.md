# Pathwise AI — V4 Comprehensive Intelligence & Robustness Audit

## 1. Current Architecture

Pathwise AI separates natural language reasoning from canonical tool knowledge and recommendation logic.

```
User Query / Goal
        │
        ▼
[requirementsEngine.ts]
  - extractProjectProfile()
  - extractTechnicalEvidence()
  - extractRequirementsFromProfile()
  - Negative exclusions & assumptions
        │
        ▼
[recommendationEngine.ts]
  - extractUserIntent()
  - generateWorkflowFromProfile()
  - Hard Task-Tool Compatibility Validator
  - Normalized 0-100 Suitability Scoring (DEFAULT_SCORING_WEIGHTS)
  - Tool Continuity Evaluation (+20 bonus)
  - optimizeWorkflow() -> Core Path vs. Optional Enhancements
        │
        ▼
[promptRegistry.ts]
  - resolveToolPrompt()
  - Structured PromptVariables with required/source metadata
        │
        ▼
[pipelineValidator.ts]
  - Canonical Fact Hydration
  - Hallucination Interception & Repair
        │
        ▼
[geminiService.ts] (Optional)
  - Explanatory synthesis strictly bounded by deterministic facts
        │
        ▼
[WorkflowTimeline.tsx] (UI)
  - Project Understanding & Scope Intelligence Panel
  - Why This Tool? Decision Cards
  - Interactive Prompts & Alternatives
```

---

## 2. Current Recommendation Flow

1. **User Goal Ingestion:** The user submits a prompt (e.g. `"I sell wigs on Instagram and I need a website where people can see my prices and WhatsApp me."`).
2. **Intent & Profile Extraction:** `extractProjectProfile()` runs regex-based classifiers over the query string to determine `projectType`, `complexity`, `codingRequirement`, explicit/inferred requirements, and negative exclusions.
3. **Task Decomposition:** `generateWorkflowFromProfile()` selects 2 to 4 canonical `StageTaskDefinition` items for the identified project type.
4. **Tool Candidate Filtering & Ranking:** `rankToolsForStage()` filters the verified tools database:
   - Evaluates hard constraints (HC-1 through HC-7).
   - Computes weighted score across Task Fit (35%), Capability (20%), Budget (15%), Platform (10%), Skill (10%), Quality (5%), Ease of Use (5%), plus tool continuity.
   - Computes `fitLevel` (`excellent`, `good`, `acceptable`, `poor`, `incompatible`).
5. **Prompt Generation:** `resolveToolPrompt()` builds a tool-specific prompt template populated with profile-derived variables.
6. **Pipeline Assembly & Validation:** `validateAndHydrateWorkflow()` verifies all tool IDs, URLs, and pricing facts against `VERIFIED_TOOLS_DATABASE`.
7. **UI Presentation:** The UI renders the workflow timeline, understanding card, and step-by-step guidance.

---

## 3. Current Tool Coverage

Currently, `VERIFIED_TOOLS_DATABASE` in [`src/data/toolsDatabase.ts`](file:///home/gamp/Desktop/Pathwise-AI/apps/web/src/data/toolsDatabase.ts) includes ~35 canonical tools spanning:
- **Coding & IDEs:** Antigravity AI, Cursor IDE, Windsurf, GitHub Copilot, Replit AI, v0 by Vercel, Lovable.dev, Bolt.new.
- **Website & Landing Page Builders:** Framer AI, Webflow.
- **LLMs & Strategy:** Claude 3.5 Sonnet, ChatGPT (GPT-4o), Perplexity AI, Phind.
- **Video Production:** Kling AI, Runway Gen-3, Luma Dream Machine, Pika Labs, HeyGen, InVideo AI.
- **Audio & Music:** Suno AI, Udio AI, ElevenLabs, Descript.
- **Design & Visuals:** Midjourney, FLUX.1, Recraft, Canva Magic Studio.
- **Chatbots & Automation:** Voiceflow, Chatbase, Make.com, n8n.
- **Presentations & Docs:** Gamma App, Notion AI.
- **Trading & Analysis:** TradingView Pine Script, Julius AI.

**Coverage Gaps Identified:**
- E-commerce platforms specifically tailored for simple non-technical sellers and African/global creators (e.g., Paystack Store, Shopify, Gumroad for digital goods).
- WhatsApp-first business tools and direct WhatsApp lead capture builders.
- Specific form/booking tools (e.g., Cal.com / Fillout / Typeform).

---

## 4. Current Task Coverage

`ToolTask` currently defines 39 tasks in `types.ts`.
**Coverage Gaps Identified:**
- Missing explicit tasks for:
  - `whatsapp_ordering` / `whatsapp_lead_capture`
  - `course_creation` / `lms_setup`
  - `digital_product_delivery` (selling ebooks/templates)
  - `appointment_booking`
  - `social_media_automation`
  - `data_cleaning_analysis`

---

## 5. Current Classification Limitations

1. **Flat Regex Matching:** `requirementsEngine.ts` uses sequential `if ... else if` regex blocks. If a user query contains multiple keywords (e.g. "I sell ebooks online and need a WhatsApp checkout"), whichever regex matches first captures the project type without scoring competing types.
2. **Missing Classification Confidence Score:** There is no numeric `confidence` or `competingTypes` output struct returned from `extractProjectProfile()`.
3. **Over-Generalization:** Complex queries with mixed intents can latch onto a general category instead of specific niche intents (e.g., selling digital products vs full physical e-commerce).

---

## 6. Current Scoring Limitations

1. **Continuity Weighting:** Tool continuity was previously given +20 points, which could sometimes outweigh task suitability if a tool had a marginal fit. In V4, continuity must be capped at $\le 10$ points and strictly subordinate to suitability.
2. **Component Logging:** Scoring components are computed internally but not exposed as an explicit itemized breakdown (`taskSuitability`, `requirementCoverage`, `constraintFit`, `skillFit`, `budgetFit`, `platformFit`, `continuity`, `quality`, `easeOfUse`).
3. **WhatsApp / Regional Nuances:** Scoring doesn't account for WhatsApp-first workflows (very common for Nigerian and emerging-market businesses).

---

## 7. Current Prompt Coverage

1. While fallback prompts generate structured variables, some specific domain/tool pairs still fall back to generic execution templates.
2. Prompts need richer structural sections:
   - `ROLE`, `CONTEXT`, `OBJECTIVE`, `INPUTS`, `REQUIREMENTS`, `CONSTRAINTS (NEGATIVE)`, `DELIVERABLES`, `QUALITY CRITERIA`, `OUTPUT FORMAT`.

---

## 8. Current UI Limitations

1. **Assumption Editing:** The user cannot currently click to change detected assumptions (e.g. "Actually, I can code" or "Make it cheaper / free only") directly from the triage bar with instant pipeline recomputation.
2. **"Refine My Path" Quick Actions:** Missing pre-built 1-click refinement chips ("Make it cheaper", "Use only free tools", "I want to code it myself", "Use tools I already know").
3. **Complexity Precision:** Time estimates should consistently use realistic ranges (e.g., "20–35 mins") rather than exact minutes.

---

## 9. Potential Recommendation Failure Modes

1. **Contradictory Queries:** (e.g. "I want a custom fullstack Django app with zero code and $0 budget"). The engine must explicitly detect and surface the contradiction rather than outputting an impossible toolchain.
2. **Unrecognized / Gibberish Inputs:** Extremely short or out-of-scope queries (e.g. "asdfghjk") should return a graceful low-confidence state asking for clarification.
3. **Over-Tooling (Toolchain Bloat):** Chaining 4+ tools for a simple 1-step task.
4. **Unsupported Requests:** User asking for something completely outside AI tool capabilities (e.g., physical plumbing repair).

---

## 10. Recommended V4 Architecture & Upgrades

1. **Structured Classification with Confidence & Competing Types (`Phase 3`):**
   - Return `{ projectType, confidence, evidence[], competingTypes[] }`.
   - If confidence < 0.60, trigger targeted clarification questions.
2. **50-Scenario Real-World Test Corpus (`Phase 2 & 20`):**
   - Cover Nigerian small businesses, WhatsApp sellers, creators, freelancers, startup founders, students, non-technical and technical users.
3. **Minimum Viable Toolchain Principle (`Phase 7`):**
   - Minimize unnecessary tool switching (prefer 1–2 high-suitability tools over bloated chains).
4. **Refined Continuity Bonus (`Phase 8`):**
   - Cap continuity bonus at $\le 10$ points; never override suitability.
5. **Tool Database Audit & ToolVerificationMetadata (`Phase 9 & 10`):**
   - Add verification timestamps and source metadata.
6. **Ultra-High-Quality Prompt Templates (`Phase 11 & 12`):**
   - Implement `ROLE`, `CONTEXT`, `OBJECTIVE`, `REQUIREMENTS`, `CONSTRAINTS`, `DELIVERABLES`, `OUTPUT FORMAT`.
7. **Alternative Tools with Explicit Tradeoffs (`Phase 13`):**
   - `{ tool, score, reason, tradeoff }`.
8. **Interactive Assumption Editing & "Refine My Path" (`Phase 14 & 15`):**
   - Enable users to click and edit detected assumptions or pick quick refinement chips, triggering instant deterministic pipeline recomputation.
9. **Failure Mode Handling (`Phase 19`):**
   - Handle unsupported, contradictory, and out-of-domain queries cleanly.
