import React from 'react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`rounded-full border-indigo-500/20 ${sizeClasses[size]}`}></div>
      <div className={`absolute inset-0 rounded-full border-t-indigo-500 border-r-pink-500 animate-spin ${sizeClasses[size]}`}></div>
    </div>
  );
};

export const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const renderSkeleton = (key) => {
    if (type === 'card') {
      return (
        <div key={key} className="glass-panel rounded-2xl p-6 space-y-4 animate-pulse">
          <div className="h-6 bg-slate-800 rounded-md w-1/3"></div>
          <div className="h-4 bg-slate-800 rounded-md w-3/4"></div>
          <div className="h-4 bg-slate-800 rounded-md w-1/2"></div>
        </div>
      );
    }
    if (type === 'table') {
      return (
        <div key={key} className="space-y-3 p-4 animate-pulse">
          <div className="flex gap-4">
            <div className="h-4 bg-slate-800 rounded w-1/4"></div>
            <div className="h-4 bg-slate-800 rounded w-1/2"></div>
            <div className="h-4 bg-slate-800 rounded w-1/4"></div>
          </div>
        </div>
      );
    }
    return (
      <div key={key} className="h-10 bg-slate-800 rounded-lg w-full animate-pulse"></div>
    );
  };

  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, idx) => renderSkeleton(idx))}
    </div>
  );
};

export const AILoader = ({ message = 'AI Agent is thinking...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-dashed border-indigo-500/20 animate-spin" style={{ animationDuration: '8s' }}></div>
        <div className="absolute inset-2 rounded-full border-4 border-dashed border-pink-500/30 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
        <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 blur-md opacity-20 animate-pulse-slow"></div>
        <div className="absolute inset-6 rounded-full bg-slate-950 border border-indigo-500/40 flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-indigo-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      </div>
      <p className="text-lg font-semibold bg-gradient-to-r from-indigo-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent animate-pulse tracking-wide font-outfit">
        {message}
      </p>
      <p className="text-sm text-slate-500 mt-2 max-w-xs">
        Parsing dataset & compiling real-time insights
      </p>
    </div>
  );
};
