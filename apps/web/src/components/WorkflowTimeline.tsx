import React from 'react';
import { Clock, Shield, Bookmark, Sparkles, Layers } from 'lucide-react';
import { WorkflowResult } from '../types';
import { ToolCard } from './ToolCard';
import { PromptEditorCard } from './PromptEditorCard';

interface WorkflowTimelineProps {
  workflow: WorkflowResult;
  onSaveWorkflow: (workflow: WorkflowResult) => void;
  isSaved: boolean;
}

export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({
  workflow,
  onSaveWorkflow,
  isSaved
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pb-20 space-y-8 animate-in fade-in duration-300">
      
      {/* Workflow Header Summary Box */}
      <div className="glass-panel-glow bg-slate-900/90 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-700/80 shadow-2xl relative overflow-hidden">
        {/* Glow effect background */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20 flex items-center gap-1.5 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                Recommended Workflow
              </span>
              <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                {workflow.category}
              </span>
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
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Est. Time</span>
              <span className="text-xs font-bold text-white truncate block">{workflow.totalTime}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/40 sm:bg-transparent">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase font-mono">Steps</span>
              <span className="text-xs font-bold text-white truncate block">{workflow.steps.length} Sequential Steps</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/40 sm:bg-transparent">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Skill Level</span>
              <span className="text-xs font-bold text-white truncate block">{workflow.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sequential Steps List */}
      <div className="space-y-10 sm:space-y-12 relative before:absolute before:left-3.5 sm:before:left-6 before:top-8 before:bottom-8 before:w-0.5 before:bg-gradient-to-b before:from-brand-500 before:via-purple-500 before:to-slate-800">
        {workflow.steps.map((step, idx) => (
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
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Recommended Tool for Step {step.stepNumber}:
                </span>
                <ToolCard tool={step.primaryTool} isPrimary={true} />
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

              {/* Alternative Tools */}
              {step.alternativeTools && step.alternativeTools.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 block mb-2">
                    Alternative Tool Option:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {step.alternativeTools.map((altTool) => (
                      <ToolCard key={altTool.id} tool={altTool} isPrimary={false} />
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
