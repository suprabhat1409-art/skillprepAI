import React from 'react';

const GlassCard = ({ children, className = '', hoverEffect = true, delay = '' }) => {
  return (
    <div
      className={`glass-panel rounded-2xl p-6 animate-fade-in ${hoverEffect ? 'glass-panel-hover' : ''} ${className}`}
      style={delay ? { animationDelay: delay } : {}}
    >
      {children}
    </div>
  );
};

export default GlassCard;
