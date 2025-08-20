import { EstimationConfig, EstimationResult } from '../types';

export function calculateEstimation(config: EstimationConfig): EstimationResult {
  const breakdown = config.criteria.map(criterion => ({
    criterion,
    contribution: criterion.value * criterion.weight,
  }));

  const weightedScore = breakdown.reduce((sum, item) => sum + item.contribution, 0);

  // Find the appropriate story points using thresholds
  const threshold = config.thresholds.find(t => weightedScore <= t.max);
  const storyPoints = threshold ? threshold.sp : config.thresholds[config.thresholds.length - 1].sp;

  // Generate signals for criteria with maximum complexity (value = 5)
  const signals: string[] = [];
  config.criteria.forEach(criterion => {
    if (criterion.value === 5) {
      signals.push(criterion.name);
    }
  });

  return {
    weightedScore,
    storyPoints,
    breakdown,
    signals: signals.length > 0 ? signals : ['None'],
  };
}

export function generateJiraMarkdown(
  result: EstimationResult,
  title: string,
  notes: string
): string {
  const breakdown = result.breakdown
    .map(item => `• ${item.criterion.name}: ${item.criterion.value} × ${item.criterion.weight.toFixed(2)} = ${item.contribution.toFixed(2)}`)
    .join('\n');

  return `*Estimation:* ${result.storyPoints} SP (weighted score ${result.weightedScore.toFixed(2)})
*Title:* ${title || 'Untitled'}
*Notes:* ${notes || 'None'}

*Breakdown:*
${breakdown}

*Signals:* ${result.signals.join(', ')}`;
}

export function normalizeWeights(config: EstimationConfig): EstimationConfig {
  const totalWeight = config.criteria.reduce((sum, c) => sum + c.weight, 0);
  
  if (totalWeight === 0) return config;

  return {
    ...config,
    criteria: config.criteria.map(criterion => ({
      ...criterion,
      weight: criterion.weight / totalWeight,
    })),
  };
}

export function validateConfig(config: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config || typeof config !== 'object') {
    errors.push('Configuration must be an object');
    return { isValid: false, errors };
  }

  if (!Array.isArray(config.criteria)) {
    errors.push('criteria must be an array');
  } else {
    config.criteria.forEach((criterion: any, index: number) => {
      if (!criterion.id || typeof criterion.id !== 'string') {
        errors.push(`Criterion ${index}: id must be a string`);
      }
      if (!criterion.name || typeof criterion.name !== 'string') {
        errors.push(`Criterion ${index}: name must be a string`);
      }
      if (typeof criterion.weight !== 'number' || criterion.weight < 0 || criterion.weight > 1) {
        errors.push(`Criterion ${index}: weight must be a number between 0 and 1`);
      }
      if (typeof criterion.value !== 'number' || criterion.value < 1 || criterion.value > 5) {
        errors.push(`Criterion ${index}: value must be a number between 1 and 5`);
      }
      if (!criterion.levels || typeof criterion.levels !== 'object') {
        errors.push(`Criterion ${index}: levels must be an object`);
      }
    });
  }

  if (!Array.isArray(config.thresholds)) {
    errors.push('thresholds must be an array');
  } else {
    config.thresholds.forEach((threshold: any, index: number) => {
      if (typeof threshold.max !== 'number') {
        errors.push(`Threshold ${index}: max must be a number`);
      }
      if (typeof threshold.sp !== 'number') {
        errors.push(`Threshold ${index}: sp must be a number`);
      }
    });
  }

  return { isValid: errors.length === 0, errors };
}