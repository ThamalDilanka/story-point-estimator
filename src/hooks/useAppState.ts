import { useState } from 'react';
import { AppState } from '../types';
import { defaultConfig } from '../data/defaultConfig';

const STORAGE_KEY = 'story-point-estimator-state';

const defaultState: AppState = {
  currentSheet: 'estimator',
  title: '',
  notes: '',
  config: defaultConfig,
};

export function useAppState() {
  // Initialize state with saved data or defaults - prevents flickering
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        // Merge saved state with defaults to ensure all properties exist
        return { ...defaultState, ...parsedState };
      } catch (error) {
        console.error('Failed to load saved state:', error);
        return defaultState;
      }
    }
    return defaultState;
  });

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  };

  return [state, updateState] as const;
}