import React from 'react';

export const SpiderLilyDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center gap-4 my-6 opacity-80 ${className}`}>
      <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-r from-transparent to-crimson-600" />
      {/* Spider Lily Center Embellishment */}
      <svg
        viewBox="0 0 40 40"
        className="w-6 h-6 text-crimson-500 fill-current animate-pulse"
        style={{ animationDuration: '4s' }}
      >
        <path d="M20 2C21 10 25 15 38 20C25 25 21 30 20 38C19 30 15 25 2 20C15 15 19 10 20 2Z" opacity="0.8" />
        <path d="M20 8C20.5 13 23 16 32 20C23 24 20.5 27 20 32C19.5 27 17 24 8 20C17 16 19.5 13 20 8Z" opacity="0.5" />
        <circle cx="20" cy="20" r="2" className="fill-crimson-400" />
      </svg>
      <div className="h-[1px] w-16 sm:w-24 bg-gradient-to-l from-transparent to-crimson-600" />
    </div>
  );
};
