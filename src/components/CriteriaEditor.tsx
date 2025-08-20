import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Save, RotateCcw, Download, Upload, CheckCircle, AlertCircle, FileText, FlipHorizontal as Normalize, AlertTriangle, RefreshCw } from 'lucide-react';
import { AppState } from '../types';
import { validateConfig, normalizeWeights } from '../utils/estimation';
import { defaultConfig } from '../data/defaultConfig';
import { Button } from './ui/Button';
import { Section } from './ui/Section';
import { Badge } from './ui/Badge';

interface CriteriaEditorProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
}

export function CriteriaEditor({ state, updateState }: CriteriaEditorProps) {
  const [editorValue, setEditorValue] = useState('');
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; errors: string[] } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const configJson = JSON.stringify(state.config, null, 2);
    setEditorValue(configJson);
    setHasUnsavedChanges(false);
  }, [state.config]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditorValue(value);
      setHasUnsavedChanges(true);
      
      // Auto-validate
      try {
        const parsed = JSON.parse(value);
        const validation = validateConfig(parsed);
        setValidationResult(validation);
      } catch (error) {
        setValidationResult({
          isValid: false,
          errors: ['Invalid JSON: ' + (error as Error).message],
        });
      }
    }
  };

  const handleSave = () => {
    if (!validationResult?.isValid) return;
    
    try {
      const parsed = JSON.parse(editorValue);
      updateState({ config: parsed });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  };

  const handleRevert = () => {
    const configJson = JSON.stringify(state.config, null, 2);
    setEditorValue(configJson);
    setHasUnsavedChanges(false);
    setValidationResult(null);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(state.config, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'story-point-criteria.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setEditorValue(content);
          setHasUnsavedChanges(true);
          
          try {
            const parsed = JSON.parse(content);
            const validation = validateConfig(parsed);
            setValidationResult(validation);
          } catch {
            setValidationResult({
              isValid: false,
              errors: ['Invalid JSON file'],
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleNormalizeWeights = () => {
    try {
      const parsed = JSON.parse(editorValue);
      const normalizedConfig = normalizeWeights(parsed);
      const normalizedJson = JSON.stringify(normalizedConfig, null, 2);
      setEditorValue(normalizedJson);
      setHasUnsavedChanges(true);
      
      // Re-validate after normalization
      const validation = validateConfig(normalizedConfig);
      setValidationResult(validation);
    } catch (error) {
      console.error('Failed to normalize weights:', error);
    }
  };

  const handleResetToDefault = () => {
    const confirmReset = window.confirm(
      'Are you sure you want to reset to the default configuration? This will discard any unsaved changes.'
    );
    
    if (confirmReset) {
      const defaultJson = JSON.stringify(defaultConfig, null, 2);
      setEditorValue(defaultJson);
      setHasUnsavedChanges(true);
      
      // Validate the default config
      const validation = validateConfig(defaultConfig);
      setValidationResult(validation);
    }
  };

  // Check if weights need normalization
  let needsNormalization = false;
  let totalWeight = 0;
  try {
    const parsed = JSON.parse(editorValue);
    if (parsed.criteria && Array.isArray(parsed.criteria)) {
      totalWeight = parsed.criteria.reduce((sum: number, c: any) => sum + (c.weight || 0), 0);
      needsNormalization = Math.abs(totalWeight - 1.0) > 0.01;
    }
  } catch {
    // Ignore parsing errors for weight check
  }
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Section className="bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <FileText className="w-8 h-8 text-red-500 flex-shrink-0" />
            <div>
              <h1 className="text-2xl font-bold text-white">Criteria Editor</h1>
              <p className="text-gray-400">Modify estimation criteria and thresholds</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            
            <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
              <Button 
                variant="ghost" 
                icon={Upload} 
                onClick={handleUpload}
                className="flex-1 sm:flex-initial"
              >
                Upload
              </Button>
              <Button 
                variant="ghost" 
                icon={Download} 
                onClick={handleDownload}
                className="flex-1 sm:flex-initial"
              >
                Download
              </Button>
            </div>
            
            <div className="w-full sm:hidden border-t border-gray-700"></div>
            
            <Button 
              variant="ghost" 
              icon={RefreshCw} 
              onClick={handleResetToDefault}
              className="flex-grow sm:flex-grow-0"
            >
              Reset to Default
            </Button>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button 
                variant="secondary" 
                icon={RotateCcw}
                onClick={handleRevert}
                disabled={!hasUnsavedChanges}
                className="w-full sm:w-auto"
              >
                Revert
              </Button>
              <Button 
                variant="primary" 
                icon={Save}
                onClick={handleSave}
                disabled={!validationResult?.isValid || !hasUnsavedChanges}
                className="w-full sm:w-auto"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* JSON Editor */}
        <div className="lg:col-span-2">
          {/* Weight Normalization Warning */}
          {needsNormalization && (
            <div className="mb-4">
              <Section className="bg-yellow-900/20 border-yellow-700">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-yellow-400 font-medium text-sm mb-2">
                      Weights Need Normalization
                    </h3>
                    <p className="text-yellow-200 text-sm mb-3">
                      Current total weight is {(totalWeight * 100).toFixed(1)}%, but should be 100%. 
                      Normalization will proportionally adjust all weights to sum to exactly 1.0 
                      while preserving their relative importance.
                    </p>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      icon={Normalize}
                      onClick={handleNormalizeWeights}
                      className="bg-yellow-800 hover:bg-yellow-700 text-yellow-100 border-yellow-600"
                    >
                      Normalize Weights to 100%
                    </Button>
                  </div>
                </div>
              </Section>
            </div>
          )}

          <Section title="Configuration JSON">
            <div className="relative">
              <div className="h-96 border border-gray-700 rounded-lg overflow-hidden">
                <Editor
                  height="100%"
                  language="json"
                  theme="vs-dark"
                  value={editorValue}
                  onChange={handleEditorChange}
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 13,
                    lineNumbers: 'on',
                    renderWhitespace: 'selection',
                    tabSize: 2,
                    insertSpaces: true,
                    automaticLayout: true,
                  }}
                />
              </div>
              
              {hasUnsavedChanges && (
                <div className="absolute top-2 right-2">
                  <Badge variant="warning" size="sm">
                    Unsaved Changes
                  </Badge>
                </div>
              )}
            </div>
          </Section>
        </div>

        {/* Validation & Automation Panel */}
        <div className="space-y-4">
          {/* Validation Status */}
          <Section title="Validation Status">
            {validationResult ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  {validationResult.isValid ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <Badge variant="success" size="sm">Valid Configuration</Badge>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <Badge variant="danger" size="sm">Invalid Configuration</Badge>
                    </>
                  )}
                </div>

                {validationResult.errors.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-red-400">Errors:</h4>
                    {validationResult.errors.map((error, index) => (
                      <div key={index} className="text-xs text-red-300 bg-red-900/20 p-2 rounded">
                        {error}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                Make changes to see validation results
              </div>
            )}
          </Section>

          {/* Quick Stats */}
          <Section title="Configuration Stats">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Criteria Count:</span>
                <span className="text-white">{state.config.criteria.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Threshold Levels:</span>
                <span className="text-white">{state.config.thresholds.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Weight:</span>
                <span className="text-white">
                  {(state.config.criteria.reduce((sum, c) => sum + c.weight, 0) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}