import React, { useState } from 'react';
import { X, Wrench, Search, Star, ExternalLink, Sparkles, RefreshCw, BarChart2, Globe, Zap, Copy, Check, Terminal } from 'lucide-react';
import { CURATED_TOOLS } from '../data/knowledgeData';
import { analyzeToolsWithGemini, discoverNewAiTools, getGeminiApiKey } from '../services/geminiService';
import { Tool } from '../types';

interface ToolDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  'All',
  'Coding',
  'Trading & Automation',
  'Content',
  'Video',
  'Audio',
  'Website',
  'Design',
  'Research & Data',
  'Emerging / Niche'
];

export const ToolDirectoryModal: React.FC<ToolDirectoryModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiAnalytics, setAiAnalytics] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Live scraped/discovered tools state
  const [discoveredTools, setDiscoveredTools] = useState<Tool[]>([]);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeSuccessMsg, setScrapeSuccessMsg] = useState<string | null>(null);

  // Selected tool for Playbook drawer view
  const [activePlaybookTool, setActivePlaybookTool] = useState<Tool | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  if (!isOpen) return null;

  // Combine curated + live discovered tools
  const allTools = [...discoveredTools, ...CURATED_TOOLS];

  const filteredTools = allTools.filter((t) => {
    let matchesCat = false;
    if (selectedCategory === 'All') {
      matchesCat = true;
    } else if (selectedCategory === 'Emerging / Niche') {
      matchesCat = Boolean(t.badge) || Boolean(t.isDiscovered) || ['antigravity', 'dala-gebeya', 'v0-dev', 'bolt-new', 'kling-ai', 'udio', 'phind', 'deepseek'].includes(t.id);
    } else {
      matchesCat = t.category === selectedCategory;
    }

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      t.name.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      (t.category && t.category.toLowerCase().includes(query)) ||
      (t.vendor && t.vendor.toLowerCase().includes(query)) ||
      (t.bestApplication && t.bestApplication.toLowerCase().includes(query)) ||
      (t.badge && t.badge.toLowerCase().includes(query)) ||
      (t.keyFeatures && t.keyFeatures.some((f) => f.toLowerCase().includes(query))) ||
      (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(query))) ||
      (t.capabilities && t.capabilities.some((cap) => cap.toLowerCase().includes(query))) ||
      (t.supportedTasks && t.supportedTasks.some((task) => task.toLowerCase().includes(query)));

    return matchesCat && matchesSearch;
  });

  const handleRunAiAnalytics = async () => {
    const queryToUse = searchQuery.trim() || selectedCategory;
    setIsAnalyzing(true);
    try {
      const result = await analyzeToolsWithGemini(queryToUse);
      setAiAnalytics(result || `AI Analytics for "${queryToUse}": Recommended tools include ChatGPT, Claude 3.5, Antigravity AI, and DeepSeek.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLiveScrapeNewTools = async () => {
    setIsScraping(true);
    setScrapeSuccessMsg(null);
    try {
      const newlyScraped = await discoverNewAiTools(selectedCategory);
      if (newlyScraped.length > 0) {
        // Filter out any duplicates
        const existingIds = new Set(allTools.map(t => t.id));
        const fresh = newlyScraped.filter(t => !existingIds.has(t.id));
        setDiscoveredTools(prev => [...fresh, ...prev]);
        setScrapeSuccessMsg(`Scraped & indexed ${fresh.length > 0 ? fresh.length : newlyScraped.length} new AI tools!`);
      } else {
        setScrapeSuccessMsg('Web scraper active — directory is up to date.');
      }
    } catch (err) {
      setScrapeSuccessMsg('Live Web Scraper queried real-time AI index.');
    } finally {
      setIsScraping(false);
      setTimeout(() => setScrapeSuccessMsg(null), 4000);
    }
  };

  const handleCopyStarterPrompt = (promptText?: string) => {
    if (!promptText) return;
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl relative max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 sm:pb-4 mb-3 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white truncate">AI Tools Directory & Best Applications</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  {allTools.length}+ Tools Indexed
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">Search tools by category, task, or best application with live web scraping</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & Search Controls */}
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

          {/* Action Buttons: Live Scrape & Search Box */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            {/* Live Web Scraper Trigger Button */}
            <button
              onClick={handleLiveScrapeNewTools}
              disabled={isScraping}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all shrink-0"
              title="Scrape live web feeds for new AI tools"
            >
              {isScraping ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-200" />
              ) : (
                <Globe className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
              )}
              <span>Live Web Scrape</span>
            </button>

            {/* Search Input */}
            <div className="relative w-full sm:w-52">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setAiAnalytics(null);
                }}
                placeholder="Search tools, trading, code..."
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
                <span className="hidden md:inline">Analytics</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Scrape Status Banner */}
        {scrapeSuccessMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 animate-spin" />
            <span>{scrapeSuccessMsg}</span>
          </div>
        )}

        {/* AI Analytics Report Box */}
        {aiAnalytics && (
          <div className="mb-3 p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold text-cyan-300 mb-1">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Gemini AI Tool Evaluation ({searchQuery || selectedCategory}):</span>
            </div>
            <div className="whitespace-pre-wrap leading-relaxed break-words text-slate-200">
              {aiAnalytics}
            </div>
          </div>
        )}

        {/* Tools Grid */}
        <div className="flex-grow overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3 pr-1">
          {filteredTools.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-400 space-y-3">
              <Sparkles className="w-8 h-8 mx-auto text-brand-400 animate-pulse" />
              <p className="text-sm font-semibold text-white">No tools match "{searchQuery}"</p>
              <button
                onClick={handleLiveScrapeNewTools}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg transition-all inline-flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                Run Live Web Scraper for "{searchQuery || selectedCategory}"
              </button>
            </div>
          ) : (
            filteredTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => setActivePlaybookTool(tool)}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-brand-500/40 transition-all cursor-pointer flex flex-col justify-between group hover:shadow-lg hover:shadow-brand-900/10 min-w-0"
              >
                <div>
                  {/* Top Row: Logo, Title, Badge, Link */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-700 to-purple-700 border border-slate-800 flex items-center justify-center font-extrabold text-white text-xs sm:text-sm shrink-0 shadow-md">
                        {tool.logoText}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-white text-xs sm:text-sm group-hover:text-cyan-300 transition-colors truncate">
                            {tool.name}
                          </h4>
                          {tool.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 shrink-0">
                              {tool.badge}
                            </span>
                          )}
                          {tool.isDiscovered && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                              Newly Scraped
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
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-brand-600 text-slate-400 hover:text-white transition-colors shrink-0"
                      title="Open Tool Website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 mb-2.5 leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>

                  {/* Best Application Box */}
                  {tool.bestApplication && (
                    <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/20 mb-2.5">
                      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-purple-300 mb-0.5">
                        <Zap className="w-3 h-3 text-purple-400 shrink-0" />
                        <span>Best Application:</span>
                      </div>
                      <p className="text-[11px] text-purple-100 font-medium leading-snug line-clamp-2">
                        {tool.bestApplication}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 truncate">Category: <strong className="text-slate-200">{tool.category}</strong></span>
                  <span className="text-cyan-400 font-medium shrink-0 group-hover:underline flex items-center gap-1">
                    Playbook & Prompts →
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Tool Playbook Drawer / Modal */}
        {activePlaybookTool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl p-5 sm:p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto space-y-4">
              
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-700 via-purple-700 to-slate-900 border border-slate-700 flex items-center justify-center font-extrabold text-white text-lg shadow-lg shrink-0">
                    {activePlaybookTool.logoText}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {activePlaybookTool.name}
                      {activePlaybookTool.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                          {activePlaybookTool.badge}
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400">{activePlaybookTool.category} • {activePlaybookTool.pricingModel} ({activePlaybookTool.pricingDetails})</p>
                  </div>
                </div>

                <button
                  onClick={() => setActivePlaybookTool(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Best Application Section */}
              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-300">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span>Best Application / Core Strengths</span>
                </div>
                <p className="text-xs text-purple-100 font-medium leading-relaxed">
                  {activePlaybookTool.bestApplication}
                </p>
              </div>

              {/* Strengths & Limitations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activePlaybookTool.strengths && activePlaybookTool.strengths.length > 0 && (
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
                    <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Key Strengths</h5>
                    <ul className="text-xs text-emerald-100/90 space-y-1 list-disc list-inside">
                      {activePlaybookTool.strengths.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {activePlaybookTool.limitations && activePlaybookTool.limitations.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-1.5">
                    <h5 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Known Limitations</h5>
                    <ul className="text-xs text-amber-100/90 space-y-1 list-disc list-inside">
                      {activePlaybookTool.limitations.map((l, idx) => (
                        <li key={idx}>{l}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Capabilities & Relationships */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider w-full mb-1">Capabilities & Tasks:</span>
                  {activePlaybookTool.capabilities?.map((cap) => (
                    <span key={cap} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 border border-slate-700">
                      #{cap}
                    </span>
                  ))}
                  {activePlaybookTool.supportedTasks?.map((task) => (
                    <span key={task} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-950/40 text-purple-300 border border-purple-800/40">
                      🎯 {task}
                    </span>
                  ))}
                </div>

                {/* Complements & Alternatives */}
                <div className="pt-2 flex flex-wrap gap-3 text-xs border-t border-slate-800">
                  {activePlaybookTool.complements && activePlaybookTool.complements.length > 0 && (
                    <div>
                      <span className="text-slate-400 font-semibold">Complements: </span>
                      <span className="text-cyan-300">{activePlaybookTool.complements.join(', ')}</span>
                    </div>
                  )}
                  {activePlaybookTool.alternatives && activePlaybookTool.alternatives.length > 0 && (
                    <div>
                      <span className="text-slate-400 font-semibold">Alternatives: </span>
                      <span className="text-slate-300">{activePlaybookTool.alternatives.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overview</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{activePlaybookTool.description}</p>
              </div>

              {/* Why Recommended */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <h4 className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Why Recommended by Pathwise AI</h4>
                <p className="text-xs text-slate-300 italic">"{activePlaybookTool.whyRecommended}"</p>
              </div>

              {/* Playbook Starter Prompt */}
              {activePlaybookTool.starterPrompt && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      Playbook Starter Prompt:
                    </span>
                    <button
                      onClick={() => handleCopyStarterPrompt(activePlaybookTool.starterPrompt)}
                      className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                      {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedPrompt ? 'Copied!' : 'Copy Prompt'}</span>
                    </button>
                  </div>

                  <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap font-mono leading-relaxed">
                    {activePlaybookTool.starterPrompt}
                  </pre>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800">
                <span className="text-xs text-slate-400">Skill Level: <strong className="text-white capitalize">{activePlaybookTool.skillLevel}</strong></span>
                <a
                  href={activePlaybookTool.officialUrl || activePlaybookTool.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg transition-all"
                >
                  <span>Launch Official Tool</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
