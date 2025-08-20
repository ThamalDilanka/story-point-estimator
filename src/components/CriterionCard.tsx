import React from 'react';
import { Criterion } from '../types';
import { Badge } from './ui/Badge';
import { Slider } from './ui/Slider';

interface CriterionCardProps {
  criterion: Criterion;
  contribution: number;
  onValueChange: (value: number) => void;
}

export function CriterionCard({
  criterion,
  contribution,
  onValueChange,
}: CriterionCardProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-white font-medium text-xs mb-1">{criterion.name}</h3>
          <p className="text-gray-400 text-xs leading-tight">
            {criterion.levels[criterion.value.toString()] || 'Unknown level'}
          </p>
        </div>
        <div className="text-right ml-3">
          <div className="text-red-400 font-medium text-xs">
            +{contribution.toFixed(2)}
          </div>
          <div className="text-gray-500 text-xs">
            {criterion.value} × {criterion.weight.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-gray-300 text-xs font-medium">Value</label>
            <Badge variant="secondary" size="sm">{criterion.value}</Badge>
          </div>
          <Slider
            value={criterion.value}
            onChange={onValueChange}
            min={1}
            max={5}
            step={1}
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-gray-400 text-xs">Weight</span>
          <Badge variant="secondary" size="sm">
            {(criterion.weight * 100).toFixed(0)}%
          </Badge>
        </div>
      </div>
    </div>
  );
}