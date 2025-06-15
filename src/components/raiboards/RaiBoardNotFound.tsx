
import React from 'react';
import { Button } from '@/components/ui/button';

interface RaiBoardNotFoundProps {
    onNavigateBack: () => void;
}

export const RaiBoardNotFound: React.FC<RaiBoardNotFoundProps> = ({ onNavigateBack }) => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Board not found</p>
        <Button onClick={onNavigateBack} className="mt-4">
          Back to Boards
        </Button>
      </div>
    </div>
  );
};
