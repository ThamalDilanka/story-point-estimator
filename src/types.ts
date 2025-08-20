export interface CriterionLevel {
  [key: string]: string;
}

export interface Criterion {
  id: string;
  name: string;
  weight: number;
  value: number;
  levels: CriterionLevel;
}

export interface Threshold {
  max: number;
  sp: number;
}

export interface EstimationConfig {
  criteria: Criterion[];
  thresholds: Threshold[];
}

export interface AppState {
  currentSheet: 'estimator' | 'editor';
  title: string;
  notes: string;
  config: EstimationConfig;
}

export interface EstimationResult {
  weightedScore: number;
  storyPoints: number;
  breakdown: Array<{
    criterion: Criterion;
    contribution: number;
  }>;
  signals: string[];
}