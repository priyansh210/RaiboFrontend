
import React from 'react';

export const RaiBoardLoading: React.FC = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading board...</p>
      </div>
    </div>
  );
};
