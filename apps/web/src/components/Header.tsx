import React from 'react';
import { Compass, Bookmark, Wrench } from 'lucide-react';

interface HeaderProps {
  onOpenSaved: () => void;
  onOpenDirectory: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSaved,
  onOpenDirectory,
  savedCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Brand Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-purple-600 to-cyan-400 p-[1px] shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-brand-400 group-hover:rotate-45 transition-transform duration-300" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-sans truncate">
                Pathwise <span className="gradient-text">AI</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block truncate">AI Tool Pipeline & Prompt Guidance</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Tool Directory Button */}
          <button
            onClick={onOpenDirectory}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium transition-all"
            title="AI Tools Directory"
          >
            <Wrench className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>AI Tools Directory</span>
          </button>

          {/* Saved Workflows Button */}
          <button
            onClick={onOpenSaved}
            className="relative flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium transition-all"
            title="Saved Workflows"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden xs:inline">Saved</span>
            {savedCount > 0 && (
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-brand-600 text-white text-[10px] sm:text-[11px] font-bold flex items-center justify-center shrink-0">
                {savedCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
