import React from 'react';
import { ExternalLink, Star, CheckCircle2, Zap } from 'lucide-react';
import { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  isPrimary?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, isPrimary = true }) => {
  const getPricingBadge = (model: string) => {
    switch (model) {
      case 'Free':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Freemium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Paid':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getSkillBadge = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
      case 'Intermediate':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
      case 'Advanced':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div
      className={`rounded-2xl p-3.5 sm:p-5 transition-all max-w-full overflow-hidden ${
        isPrimary
          ? 'glass-panel-glow bg-slate-900/90 border-slate-700/80 shadow-xl hover:border-brand-500/40'
          : 'bg-slate-950/70 border border-slate-800/80 hover:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between gap-2.5 mb-3 flex-wrap sm:flex-nowrap">
        {/* Tool Logo Initial + Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-brand-700 via-purple-700 to-slate-900 border border-slate-700 flex items-center justify-center font-extrabold text-white text-sm sm:text-base shadow-lg shrink-0">
            {tool.logoText}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-bold text-white text-sm sm:text-base font-sans break-words">{tool.name}</h4>
              {tool.badge && (
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 shrink-0">
                  {tool.badge}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 mt-0.5">
              <span className="flex items-center gap-1 text-amber-400 font-semibold shrink-0">
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                {tool.rating}
              </span>
              <span>•</span>
              <span className="font-medium truncate">{tool.category}</span>
            </div>
          </div>
        </div>

        {/* External Tool Action Button */}
        <a
          href={tool.affiliateUrl || tool.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-brand-600 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 hover:border-brand-500 transition-all shrink-0 group shadow-sm self-start"
        >
          <span>Open Tool</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
        </a>
      </div>

      {/* Badges Row */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 max-w-full">
        <span className={`text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded-full border ${getPricingBadge(tool.pricingModel)}`}>
          {tool.pricingModel} ({tool.pricingDetails})
        </span>
        <span className={`text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded-full border ${getSkillBadge(tool.skillLevel)}`}>
          {tool.skillLevel} Friendly
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-300 mb-3 leading-relaxed break-words">
        {tool.description}
      </p>

      {/* Best Application Box */}
      {tool.bestApplication && (
        <div className="p-2.5 sm:p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 mb-3">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-1">
            <Zap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Best Application:</span>
          </div>
          <p className="text-xs text-purple-100 font-medium break-words">
            {tool.bestApplication}
          </p>
        </div>
      )}

      {/* Why Recommended Explanation */}
      <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/90 border border-slate-800 mb-3">
        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-1">
          <CheckCircle2 className="w-3 h-3.5 text-cyan-400 shrink-0" />
          <span>Why this tool:</span>
        </div>
        <p className="text-xs text-slate-300 italic break-words">
          "{tool.whyRecommended}"
        </p>
      </div>

      {/* Key Features */}
      {tool.keyFeatures && tool.keyFeatures.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tool.keyFeatures.map((feature, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-800 font-medium break-words">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              {feature}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
