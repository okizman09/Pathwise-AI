import React, { useState, useMemo } from 'react';
import { HelpCircle, Check, ArrowRight, Sparkles, Wand2, RefreshCw, ChevronRight, PenTool, Lightbulb, Target } from 'lucide-react';

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
  // Extract initial topic from goal if provided or leave blank for user input
  const initialTopic = useMemo(() => {
    const cleanGoal = goal.trim();
    const commonPrefixes = [
      /^create a blog post (for|about|on)?/i,
      /^write a blog post (for|about|on)?/i,
      /^create a video (about|on)?/i,
      /^build a web app (for|with)?/i,
      /^write an article (about|on)?/i
    ];
    let candidate = cleanGoal;
    for (const p of commonPrefixes) {
      if (p.test(cleanGoal)) {
        candidate = cleanGoal.replace(p, '').trim();
        break;
      }
    }
    return candidate.length > 3 && candidate !== cleanGoal ? candidate : '';
  }, [goal]);

  const [customTopic, setCustomTopic] = useState(initialTopic);

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

  const TOPIC_SUGGESTIONS = useMemo(() => {
    const g = goal.toLowerCase();
    if (/\b(chatbot|bot|agent|assistant|chat|support)\b/i.test(g)) {
      return [
        'Customer Support & FAQ Website Assistant',
        'RAG Document Q&A Bot with PDF Knowledge',
        'Lead Generation & Booking Sales Bot',
        'Slack / Discord Community Mod Bot'
      ];
    }
    if (/\b(app|web|portal|dashboard|saas|platform|fellowship)\b/i.test(g)) {
      return [
        'Applicant Portal & Mentor Review Dashboard',
        'SaaS Analytics Platform with Supabase & Auth',
        'Fullstack AI Productivity Workspace',
        'No-Code Community Hub & Member Directory'
      ];
    }
    if (/\b(blog|post|article|write|writing|copy|newsletter|social media|linkedin|twitter|thread|content|seo)\b/i.test(g)) {
      return [
        '5 AI Productivity Tools for Remote Freelancers',
        'How to Scale a B2B Newsletter to 10k Subscribers',
        'Why Most AI Startups Fail (and What Wins)',
        'Complete Beginner Guide to Prompt Engineering in 2026',
        '10 Actionable Lessons from Bootstrapping a SaaS'
      ];
    }
    if (/\b(video|youtube|short|shorts|reel|tiktok|movie)\b/i.test(g)) {
      return [
        'Faceless Ancient History Short with Kling AI Clips',
        'Viral Tech Explainer Reel with Fast Transitions',
        'Cinematic AI Documentary with ElevenLabs Voiceover',
        'Lofi Music Background Video with Ambient Visuals'
      ];
    }
    if (/\b(trading|ea|forex|mql|crypto|metatrader)\b/i.test(g)) {
      return [
        'Moving Average Crossover + RSI EA for MT5',
        'Breakout & Volatility Scalping Bot',
        'Python Crypto Grid Trading Script',
        'Trailing Stop Risk Management Expert Advisor'
      ];
    }
    return [
      'AI Automation for Small Business',
      'Modern Tech Stack Comparison',
      'Productivity & Time Management Hacks',
      'Step-by-Step Practical Blueprint'
    ];
  }, [goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitAnswers({
      ...selectedAnswers,
      custom_topic: customTopic.trim() || goal,
      goal_context: customTopic.trim() ? `${goal} (Topic: ${customTopic.trim()})` : goal
    });
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
                Step 1 of 2: Refine Your Topic & Specs
              </span>
              <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                Context & Clarification
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight break-words">
              Clarify Concept: <span className="gradient-text font-serif">"{goal}"</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Give us the exact topic and preferences so Pathwise AI can generate precision prompts and the ideal tool pipeline.
            </p>
          </div>
        </div>

        {/* Questions Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Specific Topic / Context Input Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-brand-950/40 to-slate-950/80 border border-brand-500/30 space-y-3 shadow-inner">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white">
                <div className="w-6 h-6 rounded-lg bg-brand-600/30 border border-brand-500/40 text-brand-300 flex items-center justify-center text-xs shrink-0">
                  <PenTool className="w-3.5 h-3.5 text-brand-300" />
                </div>
                <span>What specific topic, angle, or core message do you want to cover?</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-md border border-brand-500/20">
                Key Context
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder={
                  /\b(chatbot|bot|agent)\b/i.test(goal)
                    ? 'e.g. Customer support chatbot for e-commerce store with Shopify integration...'
                    : /\b(blog|post|article|write)\b/i.test(goal)
                    ? 'e.g. 5 AI productivity tools for remote freelancers that save 10 hours a week...'
                    : /\b(app|web|portal)\b/i.test(goal)
                    ? 'e.g. Fellowship applicant tracking portal with mentor evaluation dashboard...'
                    : 'e.g. Describe the exact topic, target user, or unique angle...'
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-slate-600 focus:border-brand-400 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none transition-colors shadow-inner"
              />
            </div>

            {/* Quick Topic Suggestions Chips */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Or pick a trending topic angle:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TOPIC_SUGGESTIONS.map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCustomTopic(sug)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all text-left ${
                      customTopic === sug
                        ? 'bg-brand-600 text-white border-brand-400 font-semibold'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Multiple-Choice Preference Questions */}
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
                  <span>Generating Tailored Pipeline...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-cyan-300" />
                  <span>Generate Tailored Workflow</span>
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

