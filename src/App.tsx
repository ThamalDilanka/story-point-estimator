import React from 'react';
import { useAppState } from './hooks/useAppState';
import { Navigation } from './components/Navigation';
import { EstimatorSheet } from './components/EstimatorSheet';
import { CriteriaEditor } from './components/CriteriaEditor';

function App() {
  const [state, updateState] = useAppState();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navigation
        currentSheet={state.currentSheet}
        onSheetChange={(sheet) => updateState({ currentSheet: sheet })}
      />
      
      <main className="pb-8">
        <div className="relative overflow-hidden">
          <div 
            className={`transition-transform duration-300 ease-in-out ${
              state.currentSheet === 'estimator' ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <EstimatorSheet state={state} updateState={updateState} />
          </div>
          <div 
            className={`absolute top-0 left-0 w-full transition-transform duration-300 ease-in-out ${
              state.currentSheet === 'editor' ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <CriteriaEditor state={state} updateState={updateState} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;