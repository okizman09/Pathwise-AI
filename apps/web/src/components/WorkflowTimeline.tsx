import React, { useState } from 'react';
import {
  Clock,
  Shield,
  Bookmark,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Cpu,
  Ban,
  Target,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { WorkflowResult, WorkflowStep } from '../types';
import { ToolCard } from './ToolCard';
import { PromptEditorCard } from './PromptEditorCard';

interface WorkflowTimelineProps {
  workflow: WorkflowResult;
  onSaveWorkflow: (workflow: WorkflowResult) => void;
  isSaved: boolean;
  onRefineQuery?: (refinedConstraint: string) => void;
}

export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({
  workflow,
  onSaveWorkflow,
  isSaved,
  onRefineQuery
}) => {
  const [showUnderstanding, setShowUnderstanding] = useState(true);
  const [expandedReasons, setExpandedReasons] = useState<Record<number, boolean>>({});

  const toggleReason = (stepNumber: number) => {
    setExpandedReasons(prev => ({ ...prev, [stepNumber]: !prev[stepNumber] }));
  };

  const profile = workflow.projectProfile;
  const intentResolution = workflow.intentResolution || profile?.intentResolution;
  const understanding = workflow.understanding;
  const confidence = intentResolution?.confidence || (profile?.classificationConfidence?.confidence ? Math.round(profile.classificationConfidence.confidence * 100) : null);
  const optionalSteps = workflow.optionalEnhancements || [];
  const isClarificationMandatory = workflow.clarificationRequired || intentResolution?.clarificationRequired;
  const questions = intentResolution?.clarificationQuestions || workflow.clarificationQuestions || [];

  // V5: CLARIFICATION UI (When intent is ambiguous or information is insufficient)
  if (isClarificationMandatory) {
    return (
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 pb-20 space-y-6 animate-in fade-in duration-300">
        <div className="glass-panel-glow bg-slate-900/95 rounded-3xl p-6 sm:p-10 border border-amber-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shrink-0">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              Clarification Required
            </span>
            {confidence && (
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {confidence}% Intent Confidence (Ambiguous)
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            Let's narrow this down before picking tools
          </h2>
          
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            You asked for <strong className="text-white">"{workflow.goal}"</strong>. Rather than guessing your business model or recommending the wrong tools, select your exact project goal below to get a tailored toolchain:
          </p>

          {/* Ambiguity Reason Banner */}
          {intentResolution?.ambiguityReasons && intentResolution.ambiguityReasons.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200/90 mb-8 flex items-start gap-3">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{intentResolution.ambiguityReasons[0]}</span>
            </div>
          )}

          {/* Clarification Questions & Option Chips */}
          <div className="space-y-6 border-t border-slate-800 pt-6">
            {questions.map((q, qi) => (
              <div key={q.id || qi} className="space-y-3">
                <label className="text-sm font-bold text-white block">
                  {qi + 1}. {q.question}
                </label>
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => onRefineQuery && onRefineQuery(`${workflow.goal} (${opt.label})`)}
                        className="p-3.5 rounded-xl bg-slate-950/80 hover:bg-brand-500/10 border border-slate-800 hover:border-brand-500/40 text-left transition-all group flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-white group-hover:text-brand-300 block mb-1">
                            {opt.label}
                          </span>
                          {opt.description && (
                            <span className="text-[11px] text-slate-400 group-hover:text-slate-300 leading-snug block">
                              {opt.description}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 text-[10px] font-semibold text-brand-400 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                          <span>Select this path</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // STANDARD RESOLVED WORKFLOW RENDERING
  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pb-20 space-y-8 animate-in fade-in duration-300">
      
      {/* Workflow Header Summary Box */}
      <div className="glass-panel-glow bg-slate-900/90 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shrink-0">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Verified V5 Toolchain
              </span>
              <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                {workflow.category}
              </span>
              {confidence && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {confidence}% Intent Confidence
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight break-words">
              {workflow.goal}
            </h2>
          </div>

          {/* Save Button */}
          <button
            onClick={() => onSaveWorkflow(workflow)}
            disabled={isSaved}
            className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0 w-full sm:w-auto ${
              isSaved
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 cursor-default'
                : 'bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white shadow-lg shadow-brand-500/20 hover:scale-102'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-300 text-emerald-300' : ''}`} />
            <span>{isSaved ? 'Workflow Saved' : 'Save Workflow'}</span>
          </button>
        </div>

        {/* Executive Summary */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-medium break-words">
          {workflow.summary}
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/40 sm:bg-transparent">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Est. Time Range</span>
              <span className="text-xs font-bold text-white truncate block">{workflow.totalTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase font-mono">Steps</span>
            <span className="text-xs font-bold text-white truncate block">{workflow.steps.length} Focused Steps</span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Skill Level</span>
            <span className="text-xs font-bold text-white truncate block">{workflow.difficulty}</span>
          </div>
        </div>
      </div>

      {/* V5: Project Understanding & Scope Intelligence Panel */}
      <div className="glass-panel bg-slate-900/70 rounded-2xl p-4 sm:p-6 border border-slate-800 space-y-4">
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setShowUnderstanding(!showUnderstanding)}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Project Understanding & Scope Intelligence
              </h3>
              <span className="text-[11px] text-slate-400">
                Grounded project type, requirements, and intentional exclusions
              </span>
            </div>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors">
            {showUnderstanding ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showUnderstanding && (
          <div className="space-y-4 pt-2 border-t border-slate-800/80 animate-in fade-in duration-200">
            {/* Understanding Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-mono block uppercase">Project Type</span>
                <span className="text-xs font-bold text-cyan-300 capitalize">
                  {(understanding?.projectType || profile?.projectType || 'Standard').replace(/_/g, ' ')}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-mono block uppercase">Complexity</span>
                <span className="text-xs font-bold text-amber-300 capitalize">
                  {understanding?.complexity || profile?.complexity || 'Simple'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-mono block uppercase">Coding Required</span>
                <span className="text-xs font-bold text-purple-300 capitalize">
                  {profile?.codingRequirement === 'yes' ? 'Yes (Code-First)' : profile?.codingRequirement === 'no' ? 'No (Visual No-Code)' : 'Optional'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-mono block uppercase">Target Audience</span>
                <span className="text-xs font-bold text-emerald-300 truncate block">
                  {profile?.targetAudience || 'General Audience'}
                </span>
              </div>
            </div>

            {/* Outcome */}
            {profile?.primaryOutcome && (
              <div className="p-3 rounded-xl bg-brand-500/5 border border-brand-500/20 text-xs text-brand-200 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Determined Primary Outcome:</strong>
                  <span>{profile.primaryOutcome}</span>
                </div>
              </div>
            )}

            {/* Excluded Requirements Protection (Anti-Overengineering) */}
            {profile?.excludedRequirements && profile.excludedRequirements.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
                <Ban className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <strong className="text-rose-300 block font-semibold">
                    Scope Protection (Intentional Exclusions):
                  </strong>
                  <span className="text-slate-400">
                    To keep your pipeline minimal and fast, we explicitly excluded:{' '}
                    <span className="text-slate-200 font-medium">
                      {profile.excludedRequirements.map(r => r.replace(/_/g, ' ')).join(', ')}
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sequential Steps List */}
      <div className="space-y-10 sm:space-y-12 relative before:absolute before:left-3.5 sm:before:left-6 before:top-8 before:bottom-8 before:w-0.5 before:bg-gradient-to-b before:from-brand-500 before:via-purple-500 before:to-slate-800">
        {workflow.steps.map((step, idx) => {
          const isReasonOpen = expandedReasons[step.stepNumber];
          const suitability = step.taskSuitability || step.suitability;
          const fitLevel = step.taskSuitability?.fitLevel || 'excellent';
          const detailedAlts = step.detailedAlternatives || [];

          return (
            <div key={idx} className="relative pl-9 sm:pl-14">
              
              {/* Step Timeline Node */}
              <div className="absolute left-0 top-0 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-brand-600 via-purple-600 to-cyan-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center shadow-lg shadow-brand-500/30 border-2 border-slate-950 z-10 shrink-0">
                {step.stepNumber}
              </div>

              {/* Step Details Header */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-300">
                    Step {step.stepNumber} • {step.category}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400">
                    ({step.estimatedTime})
                  </span>
                  {step.reasoningEvidence && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {step.reasoningEvidence}
                    </span>
                  )}
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-white break-words">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 break-words">
                  {step.description}
                </p>
              </div>

              {/* Recommended Tool & Prompt Grid */}
              <div className="space-y-4">
                {/* Tool Recommendation Card */}
                <div>
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Recommended Tool for Step {step.stepNumber}:
                    </span>
                    <button
                      onClick={() => toggleReason(step.stepNumber)}
                      className="text-[11px] font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      <span>{isReasonOpen ? 'Hide Selection Reasoning' : 'Why This Tool?'}</span>
                      {isReasonOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <ToolCard tool={step.primaryTool} isPrimary={true} />

                  {/* V5: "Why This Tool?" Expandable Reasoning Panel */}
                  {isReasonOpen && suitability && (
                    <div className="mt-2 p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5 text-xs animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Task Suitability Fit Score:{' '}
                          {'suitabilityScore' in suitability ? suitability.suitabilityScore : suitability.fitScore}/100
                        </span>
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          fitLevel === 'excellent' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                          fitLevel === 'good' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {fitLevel} fit
                        </span>
                      </div>

                      {suitability.reasons && suitability.reasons.length > 0 && (
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block uppercase mb-1">
                            Ground-Truth Selection Factors:
                          </span>
                          <ul className="space-y-1">
                            {suitability.reasons.map((r, i) => (
                              <li key={i} className="text-slate-300 flex items-start gap-1.5">
                                <span className="text-emerald-400 font-bold">•</span>
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Editable Prompt Block Card */}
                <div>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Ready-to-Use Prompt Template:
                  </span>
                  <PromptEditorCard
                    prompt={step.prompt}
                    stepNumber={step.stepNumber}
                  />
                </div>

                {/* Pro Tip Box */}
                {step.proTip && (
                  <div className="p-3 sm:p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-start gap-2.5 text-xs text-brand-200">
                    <Sparkles className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <strong className="text-white block font-semibold">Pro Tip for Step {step.stepNumber}:</strong>
                      <span className="break-words">{step.proTip}</span>
                    </div>
                  </div>
                )}

                {/* V5: Alternative Tools with Explicit Tradeoffs */}
                {detailedAlts.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 block mb-2">
                      Alternative Tool Options & Tradeoffs:
                    </span>
                    <div className="space-y-2">
                      {detailedAlts.map((altItem, ai) => (
                        <div key={ai} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                          <ToolCard tool={altItem.tool} isPrimary={false} />
                          <div className="pt-1.5 border-t border-slate-900 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-slate-500 font-semibold uppercase block text-[9px]">Why Choose This:</span>
                              <span className="text-slate-300">{altItem.reason}</span>
                            </div>
                            <div>
                              <span className="text-amber-400/80 font-semibold uppercase block text-[9px]">Tradeoff:</span>
                              <span className="text-slate-400">{altItem.tradeoff}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Optional Enhancements Section (if present) */}
      {optionalSteps.length > 0 && (
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white">Optional Enhancements (Non-Core)</h3>
          </div>
          <p className="text-xs text-slate-400">
            These steps can enhance your outcome but are not strictly required for the core deliverable.
          </p>
          <div className="space-y-3">
            {optionalSteps.map((optStep, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-white block">{optStep.title}</span>
                  <span className="text-[11px] text-slate-400">{optStep.description}</span>
                </div>
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 shrink-0">
                  {optStep.primaryTool.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
