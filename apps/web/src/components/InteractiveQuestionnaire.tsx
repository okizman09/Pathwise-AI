import React, { useState } from 'react';
import { HelpCircle, Check, ArrowRight, Sparkles, Wand2, RefreshCw, ChevronRight } from 'lucide-react';

export interface QuestionnaireItem {
  id: string;
  question: string;
  options: string[];
  defaultOption: string;
}

interface InteractiveQuestionnaireProps {
  goal: string;
  questions: QuestionnaireItem[];
  onSubmitAnswers: (answers: Record<string, string>) => void;
  isLoadingWorkflow: boolean;
  onCancel: () => void;
}

export const InteractiveQuestionnaire: React.FC<InteractiveQuestionnaireProps> = ({
  goal,
  questions,
  onSubmitAnswers,
  isLoadingWorkflow,
  onCancel
}) => {
  // Store user selection for each question ID
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    questions.forEach(q => {
      initial[q.id] = q.defaultOption || q.options[0] || '';
    });
    return initial;
  });

  const handleSelectOption = (questionId: string, optionValue: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitAnswers(selectedAnswers);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6 px-3 sm:px-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="glass-panel-glow bg-slate-900/95 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-brand-500/40 shadow-2xl relative overflow-hidden">
        
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-brand-600/20 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-6 gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1.5 shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                Step 1 of 2: Refine Your Specs
              </span>
              <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                AI Interactive Questionnaire
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight break-words">
              Customize Your Goal: <span className="gradient-text font-serif">"{goal}"</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Select your preferences below so Gemini AI can generate exact tools & tailored prompt templates.
            </p>
          </div>
        </div>

        {/* Questions Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              
              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-white">
                <div className="w-6 h-6 rounded-lg bg-brand-600/20 border border-brand-500/30 text-brand-300 flex items-center justify-center text-xs shrink-0 font-mono">
                  {idx + 1}
                </div>
                <span className="break-words">{q.question}</span>
              </div>

              {/* Option Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt) => {
                  const isSelected = selectedAnswers[q.id] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelectOption(q.id, opt)}
                      className={`flex items-center justify-between p-3 rounded-xl text-xs font-semibold border transition-all text-left group ${
                        isSelected
                          ? 'bg-gradient-to-r from-brand-600 to-purple-600 text-white border-brand-400 shadow-md shadow-brand-500/25 scale-101'
                          : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="break-words pr-2">{opt}</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-white/20 text-white' : 'border border-slate-700 text-transparent group-hover:border-slate-500'
                      }`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>
          ))}

          {/* Submit & Cancel Buttons */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors order-2 sm:order-1 py-2"
            >
              Cancel & Start Over
            </button>

            <button
              type="submit"
              disabled={isLoadingWorkflow}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-purple-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-brand-500/25 transition-all hover:scale-102 order-1 sm:order-2"
            >
              {isLoadingWorkflow ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                  <span>Generating Tailored Workflow...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-cyan-300" />
                  <span>Generate Personalized Workflow</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
