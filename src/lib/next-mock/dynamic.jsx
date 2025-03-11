// Mock implementation for next/dynamic
import React, { lazy, Suspense } from 'react';

export default function dynamic(importFunc, options = {}) {
  const LazyComponent = lazy(importFunc);
  
  return function DynamicComponent(props) {
    const LoadingComponent = options.loading || (() => null);
    
    return (
      <Suspense fallback={<LoadingComponent />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}