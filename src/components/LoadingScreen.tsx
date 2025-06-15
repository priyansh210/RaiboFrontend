
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-fade-in">
          <h1 className="font-playfair text-6xl md:text-8xl mb-4 animate-pulse text-foreground">
            RAIBO
          </h1>
          <div className="w-24 h-1 mx-auto rounded animate-scale-in bg-primary"></div>
          <p className="mt-4 text-lg animate-fade-in text-muted-foreground" style={{ animationDelay: '0.5s' }}>
            Loading your marketplace...
          </p>
        </div>
        
        {/* Loading spinner */}
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
