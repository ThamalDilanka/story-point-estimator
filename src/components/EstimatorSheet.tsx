import React, { useState } from 'react';
import { Copy, Target, RotateCcw } from 'lucide-react';
import { AppState } from '../types';
import { calculateEstimation, generateJiraMarkdown } from '../utils/estimation';
import { Button } from './ui/Button';
import { Section } from './ui/Section';
import { Badge } from './ui/Badge';
import { CriterionCard } from './CriterionCard';

interface EstimatorSheetProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function EstimatorSheet({ state, updateState }: EstimatorSheetProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  
  const estimation = calculateEstimation(state.config);

  const handleCopyMarkdown = async () => {
    const markdown = generateJiraMarkdown(estimation, state.title, state.notes);
    try {
      await navigator.clipboard.writeText(markdown);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const updateCriterion = (criterionId: string, updates: { value?: number; weight?: number }) => {
    const updatedCriteria = state.config.criteria.map(criterion =>
      criterion.id === criterionId
        ? { ...criterion, ...updates }
        : criterion
    );
    updateState({
      config: { ...state.config, criteria: updatedCriteria }
    });
  };

  const handleResetAllCriteria = () => {
    const resetCriteria = state.config.criteria.map(criterion => ({
      ...criterion,
      value: 0
    }));
    updateState({
      config: { ...state.config, criteria: resetCriteria }
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <Section className="bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <Target className="w-8 h-8 text-red-500" />
            <div>
              <h1 className="text-2xl font-bold text-white">Story Point Estimator</h1>
              <p className="text-gray-400">No magic numbers. Just consistent story points.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="secondary"
              icon={RotateCcw}
              onClick={handleResetAllCriteria}
              className="w-full sm:w-auto"
            >
              Reset All
            </Button>
            <Button 
              variant="primary" 
              icon={Copy}
              onClick={handleCopyMarkdown}
              className="w-full sm:w-auto"
            >
              {copySuccess ? 'Copied!' : 'Copy Jira Markdown'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Story Title
            </label>
            <input
              type="text"
              value={state.title}
              onChange={(e) => updateState({ title: e.target.value })}
              placeholder="e.g., JIRA-3212"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes
            </label>
            <input
              type="text"
              value={state.notes}
              onChange={(e) => updateState({ notes: e.target.value })}
              placeholder="Additional context or requirements..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
            />
          </div>
        </div>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Criteria Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-white">Estimation Criteria</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {estimation.breakdown.map(({ criterion, contribution }) => (
              <CriterionCard
                key={criterion.id}
                criterion={criterion}
                contribution={contribution}
                onValueChange={(value) => updateCriterion(criterion.id, { value })}
              />
            ))}
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Title space to align with criteria section title */}
          <h2 className="text-lg font-semibold text-white opacity-0 pointer-events-none">Results</h2>
          
          {/* Story Points Display */}
          <Section className="text-center bg-gradient-to-b from-gray-800 to-gray-900 h-fit">
            <div className="space-y-3">
              <div className="text-6xl font-bold text-red-500">
                {estimation.storyPoints}
              </div>
              <div className="text-gray-300 font-medium">Story Points</div>
              <div className="text-sm text-gray-500">
                Score {estimation.weightedScore.toFixed(2)}
              </div>
            </div>
          </Section>

          {/* Analysis Card with Signals and Contributors */}
          <Section title="Analysis">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Complexity Signals</h4>
                <div className="space-y-2">
                  {estimation.signals.map((signal, index) => (
                    <Badge 
                      key={index} 
                      variant={signal === 'None' ? 'success' : 'warning'}
                      size="sm"
                      className="mr-1 mb-1"
                    >
                      {signal}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <hr className="border-gray-700" />
              
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Top Contributors</h4>
                <div className="space-y-2">
                  {estimation.breakdown
                    .sort((a, b) => b.contribution - a.contribution)
                    .slice(0, 3)
                    .map(({ criterion, contribution }) => (
                      <div key={criterion.id} className="flex justify-between text-sm">
                        <span className="text-gray-300 truncate">{criterion.name}</span>
                        <span className="text-red-400 font-medium">+{contribution.toFixed(2)}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}