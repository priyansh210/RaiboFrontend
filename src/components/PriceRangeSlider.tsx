
import * as React from 'react';
import { Slider } from '@/components/ui/slider';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min,
  max,
  step = 100,
  value,
  onChange,
}) => {
  return (
    <div className="space-y-4 py-2">
      <div className="flex justify-between items-center">
        <span className="text-earth text-sm">${value[0]}</span>
        <span className="text-earth text-sm">${value[1]}</span>
      </div>
      
      <Slider
        defaultValue={value}
        min={min}
        max={max}
        step={step}
        onValueChange={(values) => onChange([values[0], values[1]])}
        className="py-2"
      />
      
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>Min: ${min}</span>
        <span>Max: ${max}</span>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
