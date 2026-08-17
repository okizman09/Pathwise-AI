import React, { useState } from 'react';
import { Copy, Check, Sparkles, HelpCircle, ChevronDown, Terminal } from 'lucide-react';
import { PromptTemplate } from '../types';

interface PromptEditorCardProps {
  prompt: PromptTemplate;
  stepNumber: number;
}

export const PromptEditorCard: React.FC<PromptEditorCardProps> = ({
  prompt,
  stepNumber
}) => {
  // State for editable prompt variables
  const [variableValues, setVariableValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    prompt.variables.forEach(v => {
      initial[v.key] = v.defaultValue;
    });
    return initial;
  });

  const [copied, setCopied] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Compute final rendered prompt string
  const getRenderedPrompt = () => {
    let result = prompt.rawTemplate;
    prompt.variables.forEach(v => {
      const val = variableValues[v.key] ?? v.defaultValue;
      result = result.replace(new RegExp(`\\{${v.key}\\}`, 'g'), val);
    });
    return result;
  };

  const handleCopyPrompt = () => {
    const rendered = getRenderedPrompt();
    navigator.clipboard.writeText(rendered);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleVariableChange = (key: string, value: string) => {
    setVariableValues(prev => ({ ...prev, [key]: value }));
  };

  const renderedPrompt = getRenderedPrompt();

  return (
    <div className="glass-panel-glow bg-slate-900/90 rounded-2xl border border-brand-500/30 overflow-hidden shadow-2xl max-w-full">
      
      {/* Header Bar */}
      <div className="px-3.5 sm:px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 text-white text-xs font-extrabold flex items-center justify-center shadow-md shrink-0">
            P{stepNumber}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-white text-xs sm:text-sm truncate">{prompt.title}</h4>
            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-400">
              <span className="truncate">Optimized for: <strong className="text-brand-300 font-semibold">{prompt.targetTool}</strong></span>
            </div>
          </div>
        </div>

        {/* Copy Prompt Button */}
        <button
          onClick={handleCopyPrompt}
          className={`flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl font-bold text-xs transition-all shadow-md shrink-0 ${
            copied
              ? 'bg-emerald-600 text-white shadow-emerald-600/30'
              : 'bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white shadow-brand-500/20'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Copy Prompt</span>
            </>
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="p-3.5 sm:p-5">
        
        {/* Rendered Prompt Block */}
        <div className="relative rounded-xl bg-slate-950 p-3.5 sm:p-4 border border-slate-800 text-slate-200 text-xs sm:text-sm font-mono leading-relaxed whitespace-pre-wrap break-words max-w-full overflow-x-auto selection:bg-brand-500 selection:text-white">
          <div className="absolute top-2 right-2 text-[9px] sm:text-[10px] text-slate-500 font-sans tracking-wide uppercase font-bold flex items-center gap-1">
            <Terminal className="w-3 h-3 text-brand-400 shrink-0" />
            Editable Template
          </div>
          {renderedPrompt}
        </div>

        {/* Dynamic Variable Customizers */}
        {prompt.variables.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span>Customize Prompt Variables:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {prompt.variables.map((v) => (
                <div key={v.key} className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400 block truncate">
                    {v.label} <code className="text-brand-300 font-mono text-[10px]">({'{' + v.key + '}'})</code>
                  </label>
                  <input
                    type="text"
                    value={variableValues[v.key] ?? v.defaultValue}
                    onChange={(e) => handleVariableChange(v.key, e.target.value)}
                    placeholder={v.placeholder}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-brand-500 text-white text-xs focus:outline-none transition-colors font-medium min-w-0"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prompt Explanation Accordion */}
        <div className="mt-4 pt-3 border-t border-slate-800/60">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-slate-200 py-1 transition-colors gap-2"
          >
            <span className="flex items-center gap-1.5 font-medium truncate">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">Why is this prompt structured this way?</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${showExplanation ? 'rotate-180' : ''}`} />
          </button>

          {showExplanation && (
            <div className="mt-2 p-3 sm:p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 animate-in fade-in">
              <p className="text-slate-300 leading-relaxed break-words">{prompt.explanation}</p>
              {prompt.bestPractices && prompt.bestPractices.length > 0 && (
                <div className="pt-2 border-t border-slate-800">
                  <span className="font-bold text-brand-300 block mb-1">Pro Tips for Best Results:</span>
                  <ul className="list-disc list-inside text-slate-400 space-y-1">
                    {prompt.bestPractices.map((bp, idx) => (
                      <li key={idx} className="break-words">{bp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
