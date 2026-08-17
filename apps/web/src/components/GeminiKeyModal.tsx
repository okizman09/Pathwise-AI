import React, { useState, useEffect } from 'react';
import { X, Key, Sparkles, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, Cpu, ShieldCheck } from 'lucide-react';
import {
  getGeminiApiKey,
  setGeminiApiKey,
  getGeminiModel,
  setGeminiModel,
  testGeminiApiKey,
  fetchAvailableModels,
  ModelOption,
  FALLBACK_GEMINI_MODELS
} from '../services/geminiService';

interface GeminiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: () => void;
}

export const GeminiKeyModal: React.FC<GeminiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated
}) => {
  const [apiKey, setApiKeyValue] = useState('');
  const [selectedModel, setSelectedModel] = useState(getGeminiModel());
  const [availableModels, setAvailableModels] = useState<ModelOption[]>(FALLBACK_GEMINI_MODELS);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const currentKey = getGeminiApiKey();
      setApiKeyValue(currentKey);
      setSelectedModel(getGeminiModel());
      setTestResult(null);

      if (currentKey) {
        loadModelsForKey(currentKey);
      }
    }
  }, [isOpen]);

  const loadModelsForKey = async (key: string) => {
    if (!key.trim()) return;
    setIsLoadingModels(true);
    try {
      const models = await fetchAvailableModels(key);
      setAvailableModels(models);
      if (models.length > 0 && !models.some(m => m.id === selectedModel)) {
        setSelectedModel(models[0].id);
      }
    } finally {
      setIsLoadingModels(false);
    }
  };

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'Please enter a valid Gemini API Key first.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const result = await testGeminiApiKey(apiKey, selectedModel);
    setTestResult(result);
    setIsTesting(false);

    if (result.success) {
      loadModelsForKey(apiKey);
    }
  };

  const handleSave = () => {
    setGeminiApiKey(apiKey);
    setGeminiModel(selectedModel);
    onKeyUpdated();
    onClose();
  };

  const handleClearKey = () => {
    setApiKeyValue('');
    setGeminiApiKey('');
    setAvailableModels(FALLBACK_GEMINI_MODELS);
    setTestResult({ success: true, message: 'Gemini API Key removed. Pathwise AI will use local smart engine.' });
    onKeyUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 p-[1px] shadow-lg shadow-brand-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">Gemini API Settings</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Google AI
                </span>
              </div>
              <p className="text-xs text-slate-400">Power Pathwise AI features with your Gemini API key</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4">
          
          {/* Key Info Banner */}
          <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-200 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold mb-0.5">Your Key Remains Private</strong>
              <span>Your key is stored locally in your browser (`localStorage`) and never leaves your computer except to call Google Gemini servers directly.</span>
            </div>
          </div>

          {/* Input field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-brand-400" />
                Gemini API Key
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Get Free Gemini Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                const val = e.target.value;
                setApiKeyValue(val);
                setTestResult(null);
                if (val.length > 20) {
                  loadModelsForKey(val);
                }
              }}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-brand-500 text-white placeholder-slate-600 text-sm focus:outline-none transition-colors font-mono"
            />
          </div>

          {/* Model Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                Available Models for your Key
              </span>
              {isLoadingModels && (
                <span className="text-[10px] text-cyan-400 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Querying Google API...
                </span>
              )}
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
              {availableModels.map((model) => {
                const isSelected = selectedModel === model.id;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => setSelectedModel(model.id)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs text-left font-medium border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-brand-600/20 text-brand-300 border-brand-500/50 shadow-md'
                        : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800/80'
                    }`}
                  >
                    <span className="font-mono">{model.name}</span>
                    {model.recommended && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 shrink-0">
                        Flash
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test connection status badge */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 animate-in fade-in ${
                testResult.success
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || !apiKey.trim()}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 disabled:opacity-50 flex items-center gap-1.5 transition-all"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-300" />
                  <span>Testing Key...</span>
                </>
              ) : (
                <span>Test Connection</span>
              )}
            </button>

            <div className="flex items-center gap-2">
              {apiKey.trim() && (
                <button
                  type="button"
                  onClick={handleClearKey}
                  className="px-3 py-2 rounded-xl text-slate-400 hover:text-rose-400 text-xs font-medium transition-colors"
                >
                  Clear Key
                </button>
              )}
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all"
              >
                Save Settings
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
