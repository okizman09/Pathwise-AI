import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { ClarificationBar } from './components/ClarificationBar';
import { WorkflowTimeline } from './components/WorkflowTimeline';
import { InteractiveQuestionnaire } from './components/InteractiveQuestionnaire';
import { SavedWorkflowsModal } from './components/SavedWorkflowsModal';
import { ToolDirectoryModal } from './components/ToolDirectoryModal';
import { WorkflowResult, SavedWorkflow } from './types';
import { INITIAL_SAVED_WORKFLOWS } from './data/knowledgeData';
import { fetchWorkflowFromAPI, fetchQuestionnaireFromAPI } from './services/api';
import { QuestionnaireItem } from './services/geminiService';

export default function App() {
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingWorkflow, setIsLoadingWorkflow] = useState(false);
  const [currentGoal, setCurrentGoal] = useState('');
  
  // Interactive Questionnaire Flow State
  const [appStage, setAppStage] = useState<'hero' | 'questionnaire' | 'workflow'>('hero');
  const [questionnaireItems, setQuestionnaireItems] = useState<QuestionnaireItem[]>([]);

  // Modals state
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);

  // Saved Workflows state with localStorage persistence
  const [savedWorkflows, setSavedWorkflows] = useState<SavedWorkflow[]>(() => {
    const local = localStorage.getItem('pathwise_saved_workflows');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SAVED_WORKFLOWS;
  });

  // Save state back to localStorage
  useEffect(() => {
    localStorage.setItem('pathwise_saved_workflows', JSON.stringify(savedWorkflows));
  }, [savedWorkflows]);

  // Load initial default workflow on first mount
  useEffect(() => {
    if (!activeWorkflow && INITIAL_SAVED_WORKFLOWS.length > 0) {
      setActiveWorkflow(INITIAL_SAVED_WORKFLOWS[0].workflow);
      setCurrentGoal(INITIAL_SAVED_WORKFLOWS[0].goal);
    }
  }, []);

  // Handle Search / Goal Submission -> Triggers Interactive Questionnaire
  const handleStartGoal = async (goal: string) => {
    setCurrentGoal(goal);
    setIsLoading(true);

    try {
      // Fetch 2-3 dynamic follow-up questions from AI for this goal
      const questions = await fetchQuestionnaireFromAPI(goal);
      setQuestionnaireItems(questions);
      setAppStage('questionnaire');
    } finally {
      setIsLoading(false);

      setTimeout(() => {
        const elem = document.getElementById('interactive-questionnaire-section');
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Handle Interactive Questionnaire Answers Submission -> Generates Workflow
  const handleQuestionnaireSubmit = async (answers: Record<string, string>) => {
    setIsLoadingWorkflow(true);

    try {
      const result = await fetchWorkflowFromAPI(currentGoal, answers);
      setActiveWorkflow(result);
      setAppStage('workflow');
    } finally {
      setIsLoadingWorkflow(false);

      setTimeout(() => {
        const elem = document.getElementById('workflow-results');
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Handle "Assume & Refine" Assumption Toggles on result view
  const handleRefineAssumption = async (assumptionId: string, newValue: string) => {
    if (!activeWorkflow) return;

    const updatedAssumptions = activeWorkflow.triageAssumptions.map((a) =>
      a.id === assumptionId ? { ...a, currentValue: newValue } : a
    );

    const explicitRecord: Record<string, string> = {};
    updatedAssumptions.forEach((a) => {
      explicitRecord[a.id] = a.currentValue;
    });

    setIsLoading(true);
    try {
      const regenerated = await fetchWorkflowFromAPI(currentGoal || activeWorkflow.goal, explicitRecord);
      regenerated.triageAssumptions = updatedAssumptions;
      setActiveWorkflow(regenerated);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Save Workflow
  const handleSaveWorkflow = (workflowToSave: WorkflowResult) => {
    const exists = savedWorkflows.some((s) => s.id === workflowToSave.id);
    if (exists) return;

    const newSavedItem: SavedWorkflow = {
      id: workflowToSave.id,
      goal: workflowToSave.goal,
      category: workflowToSave.category,
      createdAt: 'Just now',
      stepCount: workflowToSave.steps.length,
      toolsUsed: workflowToSave.steps.map((s) => s.primaryTool.name),
      workflow: workflowToSave
    };

    setSavedWorkflows([newSavedItem, ...savedWorkflows]);
  };

  // Handle Delete Saved Workflow
  const handleDeleteSaved = (id: string) => {
    setSavedWorkflows(savedWorkflows.filter((s) => s.id !== id));
  };

  // Handle Load Saved Workflow
  const handleLoadSaved = (savedItem: SavedWorkflow) => {
    setActiveWorkflow(savedItem.workflow);
    setCurrentGoal(savedItem.goal);
    setAppStage('workflow');
    setTimeout(() => {
      const elem = document.getElementById('workflow-results');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const isCurrentSaved = activeWorkflow ? savedWorkflows.some((s) => s.id === activeWorkflow.id) : false;

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-brand-500 selection:text-white bg-grid-pattern">
      
      {/* Navigation Header */}
      <Header
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenDirectory={() => setIsDirectoryOpen(true)}
        savedCount={savedWorkflows.length}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        
        {/* Hero Prompt Section */}
        <HeroSearch
          onSearch={handleStartGoal}
          isLoading={isLoading}
        />

        {/* Interactive Questionnaire Section (Stage: questionnaire) */}
        {appStage === 'questionnaire' && (
          <div id="interactive-questionnaire-section">
            <InteractiveQuestionnaire
              goal={currentGoal}
              questions={questionnaireItems}
              onSubmitAnswers={handleQuestionnaireSubmit}
              isLoadingWorkflow={isLoadingWorkflow}
              onCancel={() => setAppStage('hero')}
            />
          </div>
        )}

        {/* Workflow Results Container (Stage: workflow) */}
        {activeWorkflow && appStage === 'workflow' && (
          <div id="workflow-results" className="pt-6">
            
            {/* Smart Triage Clarification Bar (Assume & Refine Pattern) */}
            <ClarificationBar
              assumptions={activeWorkflow.triageAssumptions}
              onRefineAssumption={handleRefineAssumption}
            />

            {/* Workflow Timeline & Editable Prompts */}
            <WorkflowTimeline
              workflow={activeWorkflow}
              onSaveWorkflow={handleSaveWorkflow}
              isSaved={isCurrentSaved}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Pathwise AI</span>
            <span>•</span>
            <span>Interactive AI Tool Pipelines & Prompt Guidance</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setIsDirectoryOpen(true)} className="hover:text-white transition-colors">
              AI Tools Directory
            </button>
            <span>•</span>
            <button onClick={() => setIsSavedOpen(true)} className="hover:text-white transition-colors">
              Saved Workflows ({savedWorkflows.length})
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SavedWorkflowsModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedList={savedWorkflows}
        onSelectWorkflow={handleLoadSaved}
        onDeleteWorkflow={handleDeleteSaved}
      />

      <ToolDirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
      />

    </div>
  );
}
