
import React from 'react';
import { Color } from '@/models/internal/Color';

interface ColorPickerProps {
  colors: Color[];
  selectedColor: Color;
  onChange: (color: Color) => void;
  className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selectedColor,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {colors.map((color) => (
        <button
          key={color.name}
          type="button"
          onClick={() => onChange(color)}
          className={`w-8 h-8 rounded-full transition-all ${
            selectedColor.code === color.code 
              ? 'ring-2 ring-terracotta ring-offset-2 scale-110' 
              : 'hover:scale-110'
          }`}
          style={{ backgroundColor: color.code }}
          aria-label={`Select ${color.name} color`}
          title={color.name}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
