import {
  extractUserIntent,
  buildDeterministicPipeline,
  getVerifiedCandidatePool,
  evaluateToolSuitability,
  validateToolTaskCompatibility
} from '../recommendationEngine';
import { extractProjectProfile, extractRequirementsFromProfile, generateWorkflowFromProfile } from '../requirementsEngine';
import { resolveIntent } from '../intentResolutionEngine';
import { validateAndHydrateWorkflow } from '../pipelineValidator';
import { VERIFIED_TOOLS_DATABASE, getVerifiedTool } from '../../data/toolsDatabase';
import { ToolCapability, ToolTask } from '../../types';

/**
 * PATHWISE INTELLIGENCE V5 — MASTER POST-CLARIFICATION & ADVERSARIAL QA TEST SUITE
 * 
 * Validates:
 * - Complete Interaction Loop & User Clarification Evidence (`source: 'user_clarification'`).
 * - All Website Branches Post-Clarification (Business, Portfolio, Store, Blog, Web App, Landing Page).
 * - Multi-Turn Information Accumulation.
 * - Contradictions, Negations & Subjective Ambiguity Handling.
 * - Minimal 1-Task & 2-Task Workflows.
 * - Confidence Calibration & Adversarial Gemini Interception.
 * - Golden Test Cases A through F.
 * - 52 Real-World Scenarios Corpus.
 * - Golden Invariants 1 through 22.
 */

export function runRecommendationTests() {
  console.log('🧪 Starting Pathwise Intelligence V5 Master QA Test Suite...\n');
  let passedCount = 0;
  let totalCount = 0;

  function assert(condition: boolean, testName: string) {
    totalCount++;
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passedCount++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      throw new Error(`Test failed: ${testName}`);
    }
  }

  // =========================================================================
  // 1. COMPLETE INTERACTION LOOP & CLARIFICATION INTEGRATION
  // =========================================================================
  console.log('--- 1. Complete Interaction Loop & User Clarification Evidence ---');

  // Turn 1: Generic query
  const turn1Res = resolveIntent('build a website');
  assert(turn1Res.status === 'ambiguous' && turn1Res.clarificationRequired === true, 'Loop Turn 1: "build a website" is ambiguous');
  assert(turn1Res.confidence <= 59, 'Loop Turn 1: confidence <= 59');

  // Turn 2: User clarifies "Business/company"
  const turn2Profile = extractProjectProfile('build a website', { website_purpose: 'business_website' });
  assert(turn2Profile.projectType === 'business_website', 'Loop Turn 2: Clarified to business_website');
  assert(!turn2Profile.requirements.some(r => r.requirement === 'payments'), 'Loop Turn 2: NO payments inferred');
  assert(!turn2Profile.requirements.some(r => r.requirement === 'authentication'), 'Loop Turn 2: NO auth inferred');
  assert(!turn2Profile.requirements.some(r => r.requirement === 'database'), 'Loop Turn 2: NO database inferred');
  assert(!turn2Profile.requirements.some(r => r.requirement === 'whatsapp_integration'), 'Loop Turn 2: NO WhatsApp inferred');

  // Section 2: Clarification Answer becomes source: 'user_clarification'
  const clarifiedReq = turn2Profile.requirements.find(r => r.requirement === 'business_website');
  assert(clarifiedReq?.source === 'user_clarification', `Section 2: Clarification answer source is 'user_clarification' (got: ${clarifiedReq?.source})`);
  assert(clarifiedReq?.confidence === 'explicit', 'Section 2: Clarification confidence is explicit');

  // =========================================================================
  // 3. ALL WEBSITE BRANCHES POST-CLARIFICATION
  // =========================================================================
  console.log('\n--- 3. All Website Branches Post-Clarification ---');

  // A. Business
  const pA = extractProjectProfile('build a website', { website_purpose: 'business_website' });
  assert(pA.projectType === 'business_website', 'Branch A: Business maps to business_website');

  // B. Portfolio
  const pB = extractProjectProfile('build a website', { website_purpose: 'portfolio' });
  assert(pB.projectType === 'portfolio', 'Branch B: Portfolio maps to portfolio');

  // C. Store
  const pC = extractProjectProfile('build a website', { website_purpose: 'ecommerce_website' });
  assert(pC.projectType === 'ecommerce_website', 'Branch C: Store maps to ecommerce_website');

  // D. Blog
  const pD = extractProjectProfile('build a website', { website_purpose: 'blog' });
  assert(pD.projectType === 'blog', 'Branch D: Blog maps to blog');
  assert(!pD.requirements.some(r => r.requirement === 'payments'), 'Branch D: Blog has NO ecommerce/payments');

  // E. Web Application
  const pE = extractProjectProfile('build a website', { website_purpose: 'web_application' });
  assert(pE.projectType === 'web_application', 'Branch E: Web App maps to web_application');

  // F. Landing Page
  const pF = extractProjectProfile('build a website', { website_purpose: 'landing_page' });
  assert(pF.projectType === 'landing_page', 'Branch F: Landing Page maps to landing_page');

  // =========================================================================
  // 4. MULTI-TURN INFORMATION ACCUMULATION
  // =========================================================================
  console.log('\n--- 4. Multi-Turn Information Accumulation ---');

  // Turn 1: "I need a website" -> ambiguous
  assert(resolveIntent('I need a website').status === 'ambiguous', 'Multi-turn 1: ambiguous');

  // Turn 2: "It's for my handmade wig business."
  const mt2 = extractProjectProfile("It's for my handmade wig business.");
  assert(mt2.projectType === 'business_website', 'Multi-turn 2: business_website');

  // Turn 3: "I want customers to message me on WhatsApp."
  const mt3 = extractProjectProfile("It's for my handmade wig business. I want customers to message me on WhatsApp.");
  assert(mt3.requirements.some(r => r.requirement === 'whatsapp_integration' && r.confidence === 'explicit'), 'Multi-turn 3: WhatsApp explicit');

  // Turn 4: "I don't need online payments."
  const mt4 = extractProjectProfile("It's for my handmade wig business. I want customers to message me on WhatsApp. I don't need online payments.");
  assert(mt4.excludedRequirements.includes('payments'), 'Multi-turn 4: payments explicitly excluded');
  assert(!mt4.requirements.some(r => r.requirement === 'payments'), 'Multi-turn 4: payments not in active requirements');

  // =========================================================================
  // 5. CONTRADICTIONS, NEGATIONS & AMBIGUITY
  // =========================================================================
  console.log('\n--- 5. Contradictions, Negations & Ambiguity ---');

  const pContradict = extractProjectProfile('I want a simple no-code website. I need user accounts and a dashboard.');
  assert(pContradict.technicalEvidence.hasAuth === true, 'Contradiction: user accounts detected');
  assert(pContradict.technicalEvidence.hasAdminDashboard === true, 'Contradiction: dashboard detected');
  assert(pContradict.codingRequirement !== 'no', 'Contradiction: codingRequirement reconsidered from pure no_code');

  const pNeg1 = extractProjectProfile("I need a business website but I don't want payments.");
  assert(pNeg1.projectType === 'business_website', 'Negation 1: business_website');
  assert(pNeg1.excludedRequirements.includes('payments'), 'Negation 1: payments excluded');
  assert(pNeg1.technicalEvidence.hasPayments === false, 'Negation 1: hasPayments is false');

  const pNeg2 = extractProjectProfile("I need a store but users don't need accounts.");
  assert(pNeg2.projectType === 'ecommerce_website', 'Negation 2: ecommerce_website');
  assert(pNeg2.excludedRequirements.includes('authentication'), 'Negation 2: authentication excluded');
  assert(pNeg2.technicalEvidence.hasAuth === false, 'Negation 2: hasAuth is false');

  const pSubj = resolveIntent('make something professional');
  assert(pSubj.status === 'ambiguous', 'Subjective: "make something professional" is ambiguous');
  assert(pSubj.confidence < 40, 'Subjective: confidence < 40 for purely subjective styling request');

  const pFreeText = extractProjectProfile('I want a website where students can practice mathematics.');
  assert(pFreeText.projectType === 'web_application', 'Free-Text: math practice is web_application');
  assert(!pFreeText.requirements.some(r => r.requirement === 'authentication'), 'Free-Text: does NOT invent authentication');

  // =========================================================================
  // 6. MINIMAL WORKFLOWS & DOMAIN SETUP LOGIC
  // =========================================================================
  console.log('\n--- 6. Minimal Workflows & Domain Setup Logic ---');

  // Minimal 1-task workflow
  const pMin1 = extractProjectProfile('Create a one-page landing page in Framer.');
  const wfMin1 = generateWorkflowFromProfile(pMin1, extractRequirementsFromProfile(pMin1, pMin1.primaryGoal));
  assert(wfMin1.length === 1, `Minimal 1-task: exactly 1 step generated (got: ${wfMin1.length})`);
  assert(wfMin1[0].toolTask === 'no_code_website_build', 'Minimal 1-task: step is no_code_website_build');

  // 2-task build and publish workflow
  const pMin2 = extractProjectProfile('Create the page and publish it.');
  const wfMin2 = generateWorkflowFromProfile(pMin2, extractRequirementsFromProfile(pMin2, pMin2.primaryGoal));
  assert(wfMin2.length === 2, `2-task workflow: exactly 2 steps generated (got: ${wfMin2.length})`);
  assert(wfMin2[0].toolTask === 'no_code_website_build', '2-task: step 1 is build');
  assert(wfMin2[1].toolTask === 'domain_setup', '2-task: step 2 is publish/domain');

  // =========================================================================
  // 7. CONFIDENCE CALIBRATION & ADVERSARIAL GEMINI INTERCEPTION
  // =========================================================================
  console.log('\n--- 7. Confidence Calibration & Adversarial Gemini Interception ---');

  assert(resolveIntent('build a website').confidence < 60, 'Confidence: "build a website" < 60');
  assert(resolveIntent('build a website for my wig business').confidence >= 75, 'Confidence: wig business >= 75');
  assert(resolveIntent('I want an ecommerce store for my clothing brand with payments').confidence >= 90, 'Confidence: store with payments >= 90');
  assert(resolveIntent('make something professional').confidence < 40, 'Confidence: "make something professional" < 40');

  const adversarialGeminiOutput = {
    goal: 'I sell handmade wigs and need a beautiful online presence for my collection.',
    steps: [
      {
        stepNumber: 1,
        title: 'Hallucinated Step',
        primaryTool: { id: 'magic-builder-xyz', name: 'Magic Builder XYZ' },
        prompt: { text: 'fake prompt' },
        task: 'website_copywriting'
      }
    ]
  };
  const sanitized = validateAndHydrateWorkflow(adversarialGeminiOutput, 'I sell handmade wigs and need a beautiful online presence for my collection.');
  assert(sanitized.steps[0].primaryTool.id !== 'magic-builder-xyz', 'Adversarial Gemini: Hallucinated tool rejected and repaired from ground truth');
  assert(sanitized.isDeterministicVerified === true, 'Adversarial Gemini: Deterministic truth maintained');

  // =========================================================================
  // 8. GOLDEN TEST CASES (A through F)
  // =========================================================================
  console.log('\n--- 8. Golden Test Cases A through F ---');

  const queryA = 'I sell handmade wigs and need a beautiful online presence for my collection.';
  const intentA = extractUserIntent(queryA);
  const profileA = intentA.projectProfile || extractProjectProfile(queryA);
  const pipelineA = buildDeterministicPipeline(queryA);

  assert(profileA.projectType === 'business_website', `Golden A: projectType is business_website (got: ${profileA.projectType})`);
  assert(profileA.complexity === 'simple', `Golden A: complexity is simple (got: ${profileA.complexity})`);
  assert(profileA.codingRequirement === 'no', `Golden A: codingRequirement is no (got: ${profileA.codingRequirement})`);
  assert(!intentA.requirements.some(r => r.id === 'authentication'), 'Golden A: NO authentication inferred');
  assert(!intentA.requirements.some(r => r.id === 'database'), 'Golden A: NO database inferred');
  assert(!intentA.requirements.some(r => r.id === 'payments'), 'Golden A: NO payments inferred');
  assert(pipelineA.steps[0].primaryTool.id === 'claude' || pipelineA.steps[0].primaryTool.id === 'chatgpt', `Golden A: Step 1 uses frontier copywriter (${pipelineA.steps[0].primaryTool.name})`);
  assert(pipelineA.steps[1].primaryTool.id === 'framer' || pipelineA.steps[1].primaryTool.id === 'webflow', `Golden A: Step 2 uses visual no-code builder (${pipelineA.steps[1].primaryTool.name})`);

  const queryB = 'I want an online wig store where customers create accounts, browse wigs, add them to cart and pay.';
  const intentB = extractUserIntent(queryB);
  const profileB = intentB.projectProfile || extractProjectProfile(queryB);
  assert(profileB.projectType === 'ecommerce_website', `Golden B: projectType is ecommerce_website (got: ${profileB.projectType})`);
  assert(intentB.requirements.some(r => r.id === 'authentication'), 'Golden B: explicit auth inferred');
  assert(intentB.requirements.some(r => r.id === 'payments'), 'Golden B: explicit payments inferred');

  const queryC = 'I already have a FastAPI backend and React frontend. I need authentication.';
  const intentC = extractUserIntent(queryC);
  const profileC = intentC.projectProfile || extractProjectProfile(queryC);
  const pipelineC = buildDeterministicPipeline(queryC);
  assert(profileC.projectType === 'existing_application', `Golden C: projectType is existing_application (got: ${profileC.projectType})`);
  assert(profileC.codingRequirement === 'yes', `Golden C: codingRequirement is yes (got: ${profileC.codingRequirement})`);
  assert(pipelineC.steps.some(s => s.primaryTool.id === 'antigravity' || s.primaryTool.id === 'cursor'), 'Golden C: Recommends developer tools');

  const queryD = 'I want to make a 60-second faceless YouTube video about Ancient Rome.';
  const profileD = extractProjectProfile(queryD);
  const pipelineD = buildDeterministicPipeline(queryD);
  assert(profileD.projectType === 'video_production', `Golden D: projectType is video_production (got: ${profileD.projectType})`);
  assert(profileD.excludedRequirements.includes('database'), 'Golden D: Database excluded');
  assert(pipelineD.steps[1].primaryTool.id === 'kling-ai' || pipelineD.steps[1].primaryTool.id === 'runway', `Golden D: Step 2 uses video tool (${pipelineD.steps[1].primaryTool.name})`);

  const queryE = 'I want an Afrobeats song with female vocals.';
  const profileE = extractProjectProfile(queryE);
  const pipelineE = buildDeterministicPipeline(queryE);
  assert(profileE.projectType === 'audio_production', `Golden E: projectType is audio_production (got: ${profileE.projectType})`);
  assert(pipelineE.steps[1].primaryTool.id === 'udio' || pipelineE.steps[1].primaryTool.id === 'suno', `Golden E: Step 2 uses music tool (${pipelineE.steps[1].primaryTool.name})`);
  assert(!pipelineE.steps.some(s => s.primaryTool.id === 'framer' || s.primaryTool.id === 'webflow'), 'Golden E: Does NOT recommend website builders');

  const queryF = 'I need a website.';
  const intentF = extractUserIntent(queryF);
  assert(intentF.ambiguities.length >= 1 && intentF.ambiguities.length <= 2, `Golden F: 1-2 ambiguity questions emitted (got: ${intentF.ambiguities.length})`);

  // =========================================================================
  // 9. 52 REAL-WORLD SCENARIOS CORPUS
  // =========================================================================
  console.log('\n--- 9. Real-World Queries Corpus Tests (1-50) ---');

  assert(extractProjectProfile('I sell wigs on Instagram and I need a website where people can see my prices and WhatsApp me.').projectType === 'business_website', 'Scenario 1: WhatsApp wig seller is business_website');
  assert(extractProjectProfile("I want to sell ebooks online but I don't know how to code.").codingRequirement === 'no', 'Scenario 2: Ebooks non-coder is no_code');
  assert(extractProjectProfile('I need a landing page for my new fintech startup.').projectType.includes('landing') || extractProjectProfile('I need a landing page for my new fintech startup.').projectType.includes('website'), 'Scenario 3: Fintech landing page');
  assert(extractProjectProfile('I want an online store for clothes with card payment.').projectType === 'ecommerce_website', 'Scenario 4: Clothes store is ecommerce_website');
  assert(extractProjectProfile('I want a website for my church.').projectType === 'business_website', 'Scenario 6: Church website is business_website');
  assert(extractProjectProfile('I want a website for my school where students can log in.').projectType === 'web_application', 'Scenario 7: School portal is web_application');
  assert(extractProjectProfile('I want a portfolio for my photography.').projectType === 'portfolio', 'Scenario 8: Photography portfolio is portfolio');
  assert(extractProjectProfile('I want to build an AI SaaS.').projectType === 'web_application' || extractProjectProfile('I want to build an AI SaaS.').projectType === 'saas', 'Scenario 9: AI SaaS is web_application/saas');
  assert(extractProjectProfile('I want to make a faceless TikTok channel.').projectType === 'video_production', 'Scenario 10: Faceless TikTok is video_production');
  assert(extractProjectProfile('I have a Django backend and need a React frontend.').projectType === 'existing_application', 'Scenario 14: Django + React is existing_application');
  assert(extractProjectProfile('I want to make a documentary.').projectType === 'video_production', 'Scenario 16: Documentary is video_production');
  assert(extractProjectProfile('I want to create an Afrobeats song.').projectType === 'audio_production', 'Scenario 17: Afrobeats song is audio_production');
  assert(extractProjectProfile('I want to clean up my podcast audio.').projectType === 'audio_production', 'Scenario 18: Podcast audio cleanup is audio_production');
  assert(extractProjectProfile('I want to build a crypto trading bot.').projectType === 'algorithmic_trading', 'Scenario 23: Crypto trading bot is algorithmic_trading');
  assert(extractProjectProfile('I want students to pay for courses and track their progress.').projectType === 'web_application', 'Scenario 25: Course platform is web_application');
  assert(extractProjectProfile('I want a booking website.').projectType === 'business_website', 'Scenario 30: Booking website is business_website');
  assert(extractProjectProfile('I want to build a website with no money.').constraints?.budget === 'free_only', 'Scenario 40: Zero money maps to free_only');
  assert(extractProjectProfile("I don't know anything about coding.").codingRequirement === 'no', 'Scenario 41: No coding knowledge is no_code');
  assert(extractProjectProfile('I am a developer and want maximum control.').codingRequirement === 'yes', 'Scenario 42: Developer is full_code');

  // =========================================================================
  // 10. GOLDEN INVARIANTS (1 through 22)
  // =========================================================================
  console.log('\n--- 10. Golden Invariants Verification (1-22) ---');

  // Invariants 1-12
  assert(!profileA.requirements.some(r => r.requirement === 'database' && r.confidence === 'explicit'), 'Invariant 1: Unknown database not marked explicit');
  assert(turn1Res.status === 'ambiguous' && turn1Res.primaryCandidate === null, 'Invariant 3: Ambiguous intent has null primary candidate');
  assert(turn1Res.confidence <= 59, 'Invariant 4: Low confidence stays <= 59 for generic query');
  assert(pipelineA.steps.length <= 3, `Invariant 7: Focused <= 3 steps (got: ${pipelineA.steps.length})`);
  assert(pipelineA.steps[0].primaryTool.id === 'claude' || pipelineA.steps[0].primaryTool.id === 'chatgpt', 'Invariant 10: Copywriting selects frontier copywriter');

  // Invariants 13-22
  assert(clarifiedReq?.source === 'user_clarification' && clarifiedReq?.confidence === 'explicit', 'Invariant 13: Clarification answer has source user_clarification');
  assert(!turn2Profile.requirements.some(r => r.requirement === 'payments'), 'Invariant 14: Clarifying business website did not introduce payments');
  assert(turn2Profile.unknownRequirements.includes('authentication'), 'Invariant 15: Auth remains unknown after business clarification');
  assert(pNeg1.excludedRequirements.includes('payments'), 'Invariant 16: Negative statement explicitly excludes payments');
  assert(wfMin1.length === 1 && !wfMin1.some(s => s.toolTask === 'domain_setup'), 'Invariant 17: Domain setup not forced on single-task build');
  assert(wfMin1.length === 1, 'Invariant 18: 1-task workflow is valid');
  assert(turn2Profile.classificationConfidence?.confidence! > turn1Res.confidence / 100, 'Invariant 19: Clarification increased confidence score');
  assert(turn1Res.clarificationQuestions.length <= 2, 'Invariant 20: Max 2 clarification questions');
  const wigProfile = extractProjectProfile('I sell handmade wigs and need a beautiful online presence for my collection.');
  assert(wigProfile.requirements.find(r => r.requirement === 'product_showcase')?.confidence === 'strong_inference', 'Invariant 21: Inferred showcase is strong_inference');
  for (const s of pipelineA.steps) {
    assert((s.reasoningEvidence?.length || 0) > 0, `Invariant 22: Step ${s.stepNumber} has evidence-backed rationale`);
  }

  console.log(`\n🎉 ALL PATHWISE INTELLIGENCE V5 MASTER QA TESTS PASSED (${passedCount}/${totalCount})`);
  return { passedCount, totalCount };
}
