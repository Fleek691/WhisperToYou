import React from 'react';
import { BOOK_CONFIG } from '../config/bookConfig';

export const ThemesSection: React.FC = () => {
  return (
    <section id="themes" className="py-28 bg-[#070707] border-t border-neutral-900 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <span className="text-crimson-500 font-sans text-xs tracking-[0.3em] uppercase font-semibold block mb-2">
            Motifs & Reflections
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-white tracking-tight">
            BOOK THEMES
          </h2>
          <div className="crimson-divider max-w-xs mx-auto mt-4" />
        </div>

        {/* 4 Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BOOK_CONFIG.THEMES.map((theme) => (
            <div
              key={theme.id}
              className="crimson-border-card p-8 sm:p-10 rounded-sm relative overflow-hidden flex flex-col justify-between group"
            >
              {/* Subtle crimson background glow on hover */}
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-radial-crimson opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none" />

              <div className="space-y-4 relative z-10">
                {/* Large Serif Number */}
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
                  <span className="font-serif text-4xl sm:text-5xl font-bold text-crimson-600/80 tracking-wider">
                    {theme.number}
                  </span>
                  <div className="w-2 h-2 rounded-full bg-crimson-800" />
                </div>

                {/* Theme Title Placeholder */}
                <h3 className="font-serif text-2xl text-white font-medium tracking-wide pt-2">
                  {theme.title}
                </h3>

                {/* Theme Description Placeholder */}
                <p className="font-sans text-sm text-neutral-400 leading-relaxed font-light">
                  {theme.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-neutral-900 text-[10px] tracking-[0.25em] text-neutral-400 uppercase font-sans">
                Whisper To You • Theme {theme.number}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
