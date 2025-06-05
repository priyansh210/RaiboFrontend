
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-fade-in">
          <h1 className="font-playfair text-6xl md:text-8xl text-charcoal mb-4 animate-pulse">
            RAIBO
          </h1>
          <div className="w-24 h-1 bg-terracotta mx-auto rounded animate-scale-in"></div>
          <p className="text-earth mt-4 text-lg animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Loading your marketplace...
          </p>
        </div>
        
        {/* Loading spinner */}
        <div className="mt-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
