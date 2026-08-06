import React from 'react';

/**
 * Layout-matched loading skeleton (9.5).
 *
 * Renders pulsing placeholder blocks shaped like the real screen so the UI
 * feels responsive while data loads. The pulse animation lives in index.css
 * (.skeleton-block) and is collapsed to an instant frame by the existing
 * reduced-motion kill-switch (ASD consideration).
 *
 * Variants: 'app' (auth boot), 'dashboard', 'profile'.
 */
const Block = ({ className = '' }) => (
  <div className={`skeleton-block ${className}`} aria-hidden="true" />
);

const LoadingSkeleton = ({ variant = 'dashboard' }) => {
  if (variant === 'app') {
    return (
      <div
        role="status"
        aria-label="Loading"
        data-testid="loading-skeleton"
        className="min-h-screen flex items-center justify-center p-6"
      >
        <div className="w-full max-w-md space-y-4">
          <Block className="h-24 rounded-[2rem]" />
          <Block className="h-14 rounded-xl" />
          <Block className="h-14 rounded-xl" />
        </div>
      </div>
    );
  }

  if (variant === 'profile') {
    return (
      <div
        role="status"
        aria-label="Loading"
        data-testid="loading-skeleton"
        className="flex flex-col min-h-screen p-4 md:p-8 w-full max-w-4xl mx-auto gap-8"
      >
        {/* Header */}
        <Block className="h-28 rounded-[2rem]" />
        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Block key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        {/* Badge shelf */}
        <Block className="h-24 rounded-xl" />
        {/* Session history rows */}
        <Block className="h-20 rounded-xl" />
        <Block className="h-20 rounded-xl" />
      </div>
    );
  }

  // dashboard
  return (
    <div
      role="status"
      aria-label="Loading"
      data-testid="loading-skeleton"
      className="flex flex-col min-h-screen p-4 md:p-8 w-full max-w-6xl mx-auto gap-8"
    >
      {/* Header */}
      <Block className="h-28 rounded-[2rem]" />
      {/* QuickStats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Block key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      {/* Level grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Block key={i} className="h-40 rounded-[1.5rem]" />
        ))}
      </div>
      {/* Badge shelf */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Block key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
