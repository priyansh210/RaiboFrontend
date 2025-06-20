
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
}) => {  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 bg-background/90 backdrop-blur-sm border border-border rounded-lg shadow-lg p-2 z-30 dark:bg-card/90 dark:text-white touch-none">
      <Button
        size="sm"
        variant="outline"
        onClick={onZoomIn}
        disabled={zoom >= maxZoom}
        className="w-8 h-8 md:w-10 md:h-10 p-0 touch-manipulation"
        aria-label="Zoom in"
      >
        <ZoomIn className="w-4 h-4 md:w-5 md:h-5" />
      </Button>
      
      <div className="text-xs text-center font-medium dark:text-white px-1">
        {Math.round(zoom * 100)}%
      </div>
      
      <Button
        size="sm"
        variant="outline"
        onClick={onZoomOut}
        disabled={zoom <= minZoom}
        className="w-8 h-8 md:w-10 md:h-10 p-0 touch-manipulation"
        aria-label="Zoom out"
      >
        <ZoomOut className="w-4 h-4 md:w-5 md:h-5" />
      </Button>
        <Button
        size="sm"
        variant="outline"
        onClick={onResetZoom}
        className="w-8 h-8 md:w-10 md:h-10 p-0 touch-manipulation"
        title="Reset Zoom"
        aria-label="Reset zoom"
      >
        <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
      </Button>
    </div>
  );
};
