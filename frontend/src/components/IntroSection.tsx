import React from 'react';
import { BOOK_CONFIG } from '../config/bookConfig';

export const IntroSection: React.FC = () => {
  return (
    <section className="py-24 bg-[#080808] border-y border-crimson-950/40 relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-10">
        
        {/* Section Heading */}
        <div className="space-y-2">
          <span className="text-crimson-500 font-sans text-xs tracking-[0.3em] uppercase font-semibold">
            Prologue & Reflection
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-wide">
            AN INTRODUCTION
          </h2>
        </div>

        {/* Crimson Center Divider */}
        <div className="crimson-divider max-w-xs mx-auto my-6" />

        {/* Prominent Epigraph Quote */}
        <div className="space-y-4 px-4 sm:px-12">
          <p className="font-serif text-2xl sm:text-3xl italic text-neutral-200 leading-relaxed font-light">
            "{BOOK_CONFIG.EPIGRAPH}"
          </p>
          <p className="font-sans text-xs tracking-[0.25em] text-crimson-400 uppercase font-semibold">
            — {BOOK_CONFIG.AUTHOR_NAME}
          </p>
        </div>

        {/* Book Introduction Content */}
        <div className="pt-6">
          <p className="font-sans text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl mx-auto font-light">
            {BOOK_CONFIG.INTRODUCTION}
          </p>
        </div>

      </div>
    </section>
  );
};
