import React, { useState } from 'react';
import { ArrowRight, Sparkles, Wand2, RefreshCw, X, Video, Globe, Music, Code, Mic } from 'lucide-react';

interface HeroSearchProps {
  onSearch: (goal: string) => void;
  isLoading: boolean;
}

const EXAMPLE_GOALS = [
  { icon: Video, label: 'Faceless YouTube Short about Ancient Rome' },
  { icon: Code, label: 'Build web app with Antigravity AI & v0' },
  { icon: Globe, label: 'Build modern portfolio site in Framer (No Code)' },
  { icon: Music, label: 'Generate Lofi song with Udio & Suno AI' },
  { icon: Mic, label: 'AI Voiceover podcast intro with background audio' }
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  onSearch,
  isLoading
}) => {
  const [inputGoal, setInputGoal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputGoal.trim() && !isLoading) {
      onSearch(inputGoal.trim());
    }
  };

  const handleSelectExample = (example: string) => {
    setInputGoal(example);
    onSearch(example);
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-center pt-6 sm:pt-12 pb-6 px-3 sm:px-4 relative overflow-hidden">
      
      {/* Background ambient glow behind hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[180px] sm:h-[250px] bg-gradient-to-r from-brand-600/20 via-purple-600/15 to-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-[11px] sm:text-xs font-semibold mb-4 sm:mb-6 shadow-sm max-w-full">
        <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse shrink-0" />
        <span className="truncate">Curated AI Tool Pipelines + Ready-to-Use Editable Prompts</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-3 sm:mb-4 font-sans break-words px-1">
        Tell us what you want to create.<br className="hidden sm:inline" />
        We’ll give you the <span className="gradient-text">exact tools & prompts</span>.
      </h1>

      <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto mb-6 sm:mb-8 font-normal leading-relaxed px-2">
        Overcome AI tool confusion. Describe any goal in plain English — receive a ranked tool pipeline, step-by-step workflow, and ready-to-copy prompts.
      </p>

      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto mb-6 px-1">
        <div className="glass-panel-glow rounded-2xl p-2 sm:p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shadow-2xl">
          <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 flex-grow min-w-0">
            <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-400 shrink-0" />
            <input
              type="text"
              value={inputGoal}
              onChange={(e) => setInputGoal(e.target.value)}
              placeholder="e.g. Create a faceless YouTube video, or build an app with Antigravity..."
              className="w-full min-w-0 bg-transparent text-white placeholder-slate-500 text-xs sm:text-base focus:outline-none font-medium truncate"
              disabled={isLoading}
            />
            {inputGoal && !isLoading && (
              <button
                type="button"
                onClick={() => setInputGoal('')}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!inputGoal.trim() || isLoading}
            className={`px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shrink-0 ${
              inputGoal.trim() && !isLoading
                ? 'bg-gradient-to-r from-brand-600 via-purple-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white shadow-lg shadow-brand-500/25 scale-100 active:scale-98 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-brand-200" />
                <span>Building Pipeline...</span>
              </>
            ) : (
              <>
                <span>Get Guidance</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Example Chips with Category Icons */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-3xl mx-auto px-1">
        <span className="text-xs text-slate-400 font-semibold w-full sm:w-auto mb-1 sm:mb-0">Try these goals:</span>
        {EXAMPLE_GOALS.map((ex, idx) => {
          const IconComp = ex.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSelectExample(ex.label)}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-brand-500/40 text-slate-300 hover:text-white text-xs font-medium transition-all text-left max-w-full truncate group"
            >
              <IconComp className="w-3.5 h-3.5 text-brand-400 group-hover:scale-110 transition-transform shrink-0" />
              <span className="truncate">{ex.label}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
};
