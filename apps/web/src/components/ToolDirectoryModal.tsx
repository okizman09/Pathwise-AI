import React, { useState } from 'react';
import { X, Wrench, Search, Star, ExternalLink, Sparkles, RefreshCw, BarChart2 } from 'lucide-react';
import { CURATED_TOOLS } from '../data/knowledgeData';
import { analyzeToolsWithGemini, getGeminiApiKey } from '../services/geminiService';

interface ToolDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = ['All', 'Emerging / Niche', 'Coding', 'Content', 'Video', 'Audio', 'Website', 'Design'];

export const ToolDirectoryModal: React.FC<ToolDirectoryModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiAnalytics, setAiAnalytics] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const filteredTools = CURATED_TOOLS.filter((t) => {
    let matchesCat = false;
    if (selectedCategory === 'All') {
      matchesCat = true;
    } else if (selectedCategory === 'Emerging / Niche') {
      matchesCat = Boolean(t.badge) || ['antigravity', 'dala-gebeya', 'v0-dev', 'bolt-new', 'kling-ai', 'udio', 'phind'].includes(t.id);
    } else {
      matchesCat = t.category === selectedCategory;
    }

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      t.name.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query) ||
      (t.badge && t.badge.toLowerCase().includes(query)) ||
      t.keyFeatures.some((f) => f.toLowerCase().includes(query));

    return matchesCat && matchesSearch;
  });

  const handleRunAiAnalytics = async () => {
    const queryToUse = searchQuery.trim() || selectedCategory;
    setIsAnalyzing(true);
    try {
      const result = await analyzeToolsWithGemini(queryToUse);
      setAiAnalytics(result || `AI Analytics for "${queryToUse}": Best tools include ChatGPT, Claude 3.5, and specialized developer suites.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 sm:pb-4 mb-3 sm:mb-4 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Wrench className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white truncate">AI Tools Directory & Analytics</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  Latest & Emerging Tools
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">Real-time indexed AI tools including Antigravity, Dala Gebeya, v0 & Udio</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none max-w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setAiAnalytics(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                    : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box & Real AI Analytics trigger */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setAiAnalytics(null);
                }}
                placeholder="Search tools or trading EA..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            {getGeminiApiKey() && (
              <button
                onClick={handleRunAiAnalytics}
                disabled={isAnalyzing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all shrink-0"
                title="Run Gemini AI Tool Analytics"
              >
                {isAnalyzing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <BarChart2 className="w-3.5 h-3.5 text-cyan-300" />
                )}
                <span className="hidden sm:inline">AI Analytics</span>
              </button>
            )}
          </div>
        </div>

        {/* Live AI Analytics Report Box */}
        {aiAnalytics && (
          <div className="mb-4 p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold text-cyan-300 mb-1">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Gemini Real-time Tool Evaluation ({searchQuery || selectedCategory}):</span>
            </div>
            <div className="whitespace-pre-wrap leading-relaxed break-words text-slate-200">
              {aiAnalytics}
            </div>
          </div>
        )}

        {/* Tools Grid */}
        <div className="flex-grow overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3 pr-1">
          {filteredTools.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-400 space-y-2">
              <Sparkles className="w-8 h-8 mx-auto text-brand-400 animate-pulse" />
              <p className="text-sm font-semibold text-white">No indexed tools matching "{searchQuery}"</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Search for any task on the home page and Gemini AI will automatically generate custom steps and recommendations tailored to your exact goal!
              </p>
            </div>
          ) : (
            filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex flex-col justify-between min-w-0"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-brand-700 to-purple-700 border border-slate-800 flex items-center justify-center font-bold text-white text-xs sm:text-sm shrink-0 shadow-md">
                        {tool.logoText}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-white text-xs sm:text-sm truncate">{tool.name}</h4>
                          {tool.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 shrink-0">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="flex items-center gap-1 text-amber-400 font-semibold shrink-0">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {tool.rating}
                          </span>
                          <span>•</span>
                          <span className="truncate">{tool.pricingModel}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={tool.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-brand-600 text-slate-400 hover:text-white transition-colors shrink-0"
                      title="Open Tool Website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <p className="text-xs text-slate-300 mb-3 leading-relaxed break-words">
                    {tool.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 truncate">Category: <strong className="text-slate-200">{tool.category}</strong></span>
                  <span className="text-cyan-400 font-medium shrink-0">{tool.skillLevel} Level</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
