
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  minZoom: number;
  maxZoom: number;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  minZoom,
  maxZoom,
}) => {
  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2">
      <Button
        size="sm"
        variant="outline"
        onClick={onZoomIn}
        disabled={zoom >= maxZoom}
        className="w-10 h-10 p-0"
      >
        <ZoomIn className="w-4 h-4" />
      </Button>
      
      <div className="text-xs text-center font-medium text-gray-600 px-1">
        {Math.round(zoom * 100)}%
      </div>
      
      <Button
        size="sm"
        variant="outline"
        onClick={onZoomOut}
        disabled={zoom <= minZoom}
        className="w-10 h-10 p-0"
      >
        <ZoomOut className="w-4 h-4" />
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={onResetZoom}
        className="w-10 h-10 p-0"
        title="Reset Zoom"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
    </div>
  );
};
