import React from 'react';
import { X, Bookmark, Trash2, ArrowRight, Clock, Layers } from 'lucide-react';
import { SavedWorkflow } from '../types';

interface SavedWorkflowsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedList: SavedWorkflow[];
  onSelectWorkflow: (saved: SavedWorkflow) => void;
  onDeleteWorkflow: (id: string) => void;
}

export const SavedWorkflowsModal: React.FC<SavedWorkflowsModalProps> = ({
  isOpen,
  onClose,
  savedList,
  onSelectWorkflow,
  onDeleteWorkflow
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 sm:pb-4 mb-3 sm:mb-4 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Bookmark className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-white truncate">Saved Workflows</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">Access your saved AI tool pipelines & prompts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Workflows List */}
        <div className="flex-grow overflow-y-auto space-y-3 pr-1">
          {savedList.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Bookmark className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-sm font-medium">No saved workflows yet.</p>
              <p className="text-xs text-slate-500">Generate a workflow and click "Save Workflow" to store it here.</p>
            </div>
          ) : (
            savedList.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-brand-500/40 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 shrink-0">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" /> {item.createdAt}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-xs sm:text-sm group-hover:text-brand-300 transition-colors break-words">
                    {item.goal}
                  </h4>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 shrink-0">
                      <Layers className="w-3 h-3 text-cyan-400" /> {item.stepCount} Steps
                    </span>
                    <span>•</span>
                    <span className="truncate">Tools: {item.toolsUsed.join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      onSelectWorkflow(item);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/20 transition-all"
                  >
                    <span>Load</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteWorkflow(item.id)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                    title="Delete workflow"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
