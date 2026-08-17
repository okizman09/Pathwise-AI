import React, { useState } from 'react';
import { SlidersHorizontal, Check, ChevronDown, Sparkles } from 'lucide-react';
import { ClarificationAssumption } from '../types';

interface ClarificationBarProps {
  assumptions: ClarificationAssumption[];
  onRefineAssumption: (assumptionId: string, newValue: string) => void;
}

export const ClarificationBar: React.FC<ClarificationBarProps> = ({
  assumptions,
  onRefineAssumption
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  if (!assumptions || assumptions.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 sm:mb-8 px-3 sm:px-4 relative z-30">
      <div className="glass-panel-glow rounded-2xl p-3.5 sm:p-4 border border-brand-500/30 bg-slate-900/80 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-brand-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-300">
                  Smart Triage Assumptions
                </h3>
                <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Assume & Refine Pattern
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-tight">
                Pathwise AI inferred these preferences to avoid interrogating you. Click any chip to adjust!
              </p>
            </div>
          </div>

        </div>

        {/* Assumption Chips Grid */}
        <div className="flex flex-wrap items-center gap-2 pt-1 max-w-full relative">
          {assumptions.map((item, idx) => {
            const isOpen = activeDropdown === item.id;
            const isRightSide = idx >= Math.floor(assumptions.length / 2);

            return (
              <div key={item.id} className="relative">
                <button
                  onClick={() => setActiveDropdown(isOpen ? null : item.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold border transition-all max-w-full ${
                    isOpen
                      ? 'bg-brand-600 text-white border-brand-400 shadow-md shadow-brand-500/30 scale-102 z-30'
                      : 'bg-slate-950/80 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="text-slate-400 font-normal shrink-0">{item.label}:</span>
                  <span className="text-brand-300 font-bold truncate max-w-[150px] sm:max-w-[220px]">{item.currentValue}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-white' : ''}`} />
                </button>

                {/* Dropdown Options Menu - Smart Position Anchor */}
                {isOpen && (
                  <>
                    {/* Backdrop to dismiss */}
                    <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                    
                    <div
                      className={`absolute mt-2 z-50 w-64 max-w-[calc(100vw-32px)] glass-panel bg-slate-900/95 border border-slate-700 rounded-2xl shadow-2xl py-2 animate-in fade-in zoom-in-95 ${
                        isRightSide ? 'right-0 left-auto' : 'left-0 right-auto'
                      }`}
                    >
                      <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1 flex items-center justify-between">
                        <span className="truncate">Adjust {item.label}</span>
                        <Sparkles className="w-3 h-3 text-brand-400 shrink-0" />
                      </div>
                      {item.options.map((opt) => {
                        const isSelected = opt === item.currentValue;
                        return (
                          <button
                            key={opt}
                            onClick={() => {
                              onRefineAssumption(item.id, opt);
                              setActiveDropdown(null);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between gap-2 transition-colors ${
                              isSelected
                                ? 'bg-brand-500/20 text-brand-300 font-bold'
                                : 'text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <span className="break-words">{opt}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-brand-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
