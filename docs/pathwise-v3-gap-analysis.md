# Pathwise AI — V3 Gap Analysis

## 1. Current Architecture

```
User Goal
  → extractUserIntent()            [recommendationEngine.ts]
    → extractProjectProfile()      [requirementsEngine.ts]
    → extractRequirementsFromProfile()
    → generateWorkflowFromProfile() → StageTaskDefinition[]
  → rankToolsForStage()
    → evaluateToolSuitability()    [hard constraints + scoring]
  → resolveToolPrompt()            [promptRegistry.ts]
  → buildDeterministicPipeline()  → WorkflowResult
  → [optional] Gemini synthesis   [geminiService.ts]
  → validateAndHydrateWorkflow()  [pipelineValidator.ts]
  → WorkflowResult → UI (WorkflowTimeline.tsx)
```

## 2. Existing Invariants (Must Not Break)

- `prompt.targetTool === step.primaryTool.name`
- `prompt.title` must contain tool name
- All tool IDs must exist in `VERIFIED_TOOLS_DATABASE`
- Hard constraints fire before scoring (video, audio, no-code)
- Excluded requirements are never promoted
- Unknown requirements never become mandatory architecture
- 59/59 tests passing
- Clean TypeScript build

## 3. Existing Scoring Model

```
evaluateToolSuitability():
  base: 50
  +35 if tool.supportedTasks.includes(task)
  +15 if category match (fallback)
  +10 if skill level matches
  +10 if free tier available
  +20 tool continuity bonus (same tool as previous step)

rankToolsForStage():
  +15 complement synergy bonus
  -40 diversity penalty (re-use without continuity)
```

**Gap:** Scoring weights declared as `DEFAULT_SCORING_WEIGHTS` (taskFit:35, capabilityCoverage:20, skillFit:15...) but NOT actually applied in `evaluateToolSuitability()`. The scoring is ad-hoc, not normalized to 0-100 against those weights.

## 4. Existing Task Taxonomy (ToolTask)

85 tasks defined in types.ts. Key tasks for testing:
- `no_code_website_build`, `business_website`, `portfolio_website`, `landing_page`
- `ecommerce_website`, `frontend_generation`, `backend_implementation`
- `authentication`, `database_setup`, `payment_integration`
- `create_youtube_short`, `create_song`, `generate_voiceover`, `write_article`

**Gap:** `ToolTask` type exists but `ToolTaskSuitability` (fitLevel: excellent/good/acceptable/poor/incompatible) does NOT exist as a separate interface — it's embedded in `ToolTaskFit` without the `fitLevel` field.

## 5. Existing Tool Taxonomy (toolsDatabase.ts)

~35+ tools. Key tools for anti-regression:
- Framer AI, Webflow (no-code website builders)
- v0 by Vercel (frontend code generation — NOT no-code)
- Antigravity AI, Cursor IDE, Windsurf (developer tools)
- Claude, ChatGPT, Perplexity (LLMs/writing)
- Kling AI, Runway (video generation)
- Udio AI, Suno (music generation)
- ElevenLabs, Descript (voice/audio)

**Gap (Section 19):** v0 currently has `supportedTasks` including `create_business_website` and `create_portfolio` — these are tasks that overlap with Framer's no-code domain. For a `no_code_website_build` task with `codingRequirement: 'no'`, v0 is correctly rejected by the hard constraint check. But for `business_website` task alone, v0 is NOT hard-rejected. This can let v0 slip through.

## 6. Existing Prompt Resolution Flow

```
resolveToolPrompt(task, toolId, toolName, profile)
  → Specific template if (task, normToolId) matched
  → Default fallback with profile-derived variables
  → All return version: '2.0' now
```

**Gap:** Only covers 5 specific (task, toolId) combinations. Many task+tool combos fall through to the generic fallback which uses `profile.primaryGoal` as a raw dump. Section 11 (prompt variables) requires structured extraction, not raw goal.

## 7. Existing Gemini Responsibilities (post-V2)

Gemini runs AFTER deterministic pipeline. It receives:
- Full project profile, requirements, selected tools
- It may only explain/synthesize
- Falls back to deterministic result on failure

**Status:** Correctly implemented in V2.

## 8. Existing UI Data Flow

```
App.tsx
  → WorkflowTimeline.tsx — shows steps, tool cards, prompt editors
  → ClarificationBar.tsx — shows triageAssumptions for refinement
  → ToolCard.tsx — displays tool metadata
  → PromptEditorCard.tsx — editable prompt with variables
```

**Gap (Section 20):** No `ProjectUnderstanding` panel shown to user. No `requirements` list shown. No `excluded requirements` panel. No `alternatives` panel at workflow level. No `optional enhancements` section. No `validationWarnings` display. No `"Why this tool?"` structured reasoning shown.

## 9. Current Weaknesses (V3 Targets)

### W1: CAPABILITY vs SUITABILITY confusion
`fitLevel` (excellent/good/acceptable/poor/incompatible) does not exist.
`evaluateToolSuitability` uses ad-hoc point adjustments rather than a normalized
suitability score against 5 explicit dimensions.

### W2: Scoring not normalized per weights
`DEFAULT_SCORING_WEIGHTS` is declared but not used in actual scoring logic.
Score is a raw sum of bonuses, not a weighted 0-100.

### W3: No `ToolTaskSuitability` interface
The spec requires: `fitLevel`, `suitabilityScore`, `noCodeSupport`,
`codingRequired`, `platformSupport`, `budgetCompatibility`, `continuityScore`.
These don't exist as a separate dedicated type.

### W4: ProjectConstraints incomplete
`ProjectConstraints` exists in types but only has `budget`, `time`, `platform`.
Missing: `skillLevel`, `coding`, `deadline`, `preferredTools`, `excludedTools`, `existingStack`.

### W5: `PromptVariable.required` and `PromptVariable.source` missing
The spec requires `required: boolean` and `source: 'project_profile' | 'requirement' | ...`
on PromptVariable, but current type only has `key, label, defaultValue, placeholder, options`.

### W6: `WorkflowStep.isOptional` field
`WorkflowStep.isOptional` is defined in the spec but not yet populated — only `isCore` exists.

### W7: `WorkflowResult.projectProfile` missing
Spec requires `WorkflowResult.projectProfile: ProjectProfile` at top level.
Currently `understanding` is a simplified subset.

### W8: Anti-regression test coverage
Only 11 tests (59 assertions). V3 spec requires 28 test scenarios.

### W9: No Observability / Debug object
`debugInfo` / observability struct not implemented.

### W10: requirementsEngine missing `chatbot_agent`, `dashboard`, `blog` workflows
Several project types fall through to the default web_application handler.

### W11: `ToolRecommendationReason.whyNotAlternatives` uses real alternatives
Currently uses `tool.alternatives[]` list but doesn't explain WHY not those tools
in context of the current task and user constraints.

### W12: UI missing "Project Understanding" + "Why this tool?" panels

## 10. Proposed V3 Changes

### Phase 1: Types (types.ts)
- Add `ToolTaskSuitability` with `fitLevel` enum
- Extend `ProjectConstraints` with all 7 fields
- Add `required` and `source` fields to `PromptVariable`
- Add `isOptional` to `WorkflowStep`
- Add `projectProfile` to `WorkflowResult`
- Add `debugInfo` optional field to `WorkflowResult`

### Phase 2: Scoring Normalization (recommendationEngine.ts)
- Apply `DEFAULT_SCORING_WEIGHTS` in `evaluateToolSuitability`
- Add `fitLevel` computation based on normalized score
- Strengthen no-code hard constraint: reject v0/cursor/antigravity for `business_website` when `codingRequirement === 'no'`
- Add hard constraint check for `ecommerce_website` task (reject simple portfolio builders)
- Add hard constraint for `existing_application` (reject no-code builders)

### Phase 3: RequirementsEngine (requirementsEngine.ts)
- Add `chatbot_agent`, `dashboard`, `blog` workflow generators
- Improve `landing_page` and `marketing_website` classification
- Better natural language signals for project type
- Add `ProjectConstraints.coding`, `skillLevel`, `existingStack`

### Phase 4: ToolTaskSuitability (recommendationEngine.ts)
- Return `fitLevel` from `evaluateToolSuitability`
- Build full `ToolTaskSuitability` objects per step

### Phase 5: Prompt Variables (promptRegistry.ts)
- Add `required` and `source` to all PromptVariable returns
- Ensure variables are structured from ProjectProfile, not raw goal

### Phase 6: Test Suite Expansion (recommendationEngine.test.ts)
- Expand from 11 scenarios to 28 scenarios
- Add all invariant tests from section 21

### Phase 7: Validator Expansion (pipelineValidator.ts)
- Add checks M, N, O, P, Q, R, S (from section 15)

### Phase 8: UI (WorkflowTimeline.tsx)
- Add Project Understanding panel
- Add Requirements section (core + excluded)
- Add "Why this tool?" expandable section per step
- Add Optional Enhancements section after core path

### Phase 9: Documentation
- docs/pathwise-v3-architecture.md
- docs/pathwise-v3-test-report.md
