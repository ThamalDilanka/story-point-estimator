import React from 'react';
import { ArrowLeft, Settings, Target } from 'lucide-react';
import { AppState } from '../types';

interface NavigationProps {
  currentSheet: AppState['currentSheet'];
  onSheetChange: (sheet: AppState['currentSheet']) => void;
}

export function Navigation({ currentSheet, onSheetChange }: NavigationProps) {
  return (
    <nav className="bg-black/90 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo on estimator page, Back button on editor page */}
          <div className="flex items-center">
            {currentSheet === 'estimator' ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-white hidden sm:block">Story Point Estimator</span>
              </div>
            ) : (
              <button
                onClick={() => onSheetChange('estimator')}
                className="flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Estimator</span>
              </button>
            )}
          </div>

          {/* Right side - Edit button (only visible on estimator page) */}
          <div className="flex items-center ml-auto">
            {currentSheet === 'estimator' && (
              <button
                onClick={() => onSheetChange('editor')}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-200"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">Edit Criteria</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}