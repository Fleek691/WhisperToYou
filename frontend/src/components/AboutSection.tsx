import React from 'react';
import { BOOK_CONFIG } from '../config/bookConfig';
import { HeartHandshake, Feather } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-28 bg-[#050505] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24">
        
        {/* EDITORIAL SECTION 1: ABOUT THE BOOK */}
        <div>
          {/* Editorial Header */}
          <div className="mb-16">
            <span className="text-crimson-500 font-sans text-xs tracking-[0.3em] uppercase font-semibold block mb-2">
              The Work
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight">
              ABOUT THE BOOK
            </h2>
            <div className="w-20 h-[1px] bg-crimson-700 mt-4" />
          </div>

          {/* Editorial Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Large Editorial Typography & Quote Accent */}
            <div className="lg:col-span-5 bg-[#0D0D0D] p-8 sm:p-12 border border-crimson-900/30 rounded-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-radial-crimson opacity-40 pointer-events-none" />
              
              <span className="text-crimson-600/30 font-serif text-8xl font-bold leading-none block select-none -mb-8">
                "
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl text-neutral-100 font-light leading-snug relative z-10">
                "{BOOK_CONFIG.EPIGRAPH}"
              </h3>

              <div className="mt-8 pt-6 border-t border-neutral-800/80 flex items-center justify-between text-xs tracking-widest text-neutral-400 uppercase">
                <span>Whisper To You</span>
                <span className="text-crimson-500">{BOOK_CONFIG.AUTHOR_NAME}</span>
              </div>
            </div>

            {/* Right Column: Book Description & Summary */}
            <div className="lg:col-span-7 space-y-6">
              <div className="prose prose-invert max-w-none text-neutral-300 font-sans text-base sm:text-lg leading-relaxed font-light space-y-6">
                <p className="border-l-2 border-crimson-700/60 pl-4 text-neutral-200 italic font-serif text-xl">
                  {BOOK_CONFIG.DESCRIPTION}
                </p>
                <p className="text-neutral-400">
                  {BOOK_CONFIG.SUMMARY}
                </p>
              </div>

              {/* Subtle Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-neutral-900">
                <div>
                  <span className="text-xs font-sans tracking-widest text-crimson-500 uppercase font-semibold block">Author</span>
                  <span className="font-serif text-lg text-white">{BOOK_CONFIG.AUTHOR_NAME}</span>
                </div>
                <div>
                  <span className="text-xs font-sans tracking-widest text-crimson-500 uppercase font-semibold block">Format</span>
                  <span className="font-serif text-lg text-white">{BOOK_CONFIG.SPECIFICATIONS.format}</span>
                </div>
                <div>
                  <span className="text-xs font-sans tracking-widest text-crimson-500 uppercase font-semibold block">Pages</span>
                  <span className="font-serif text-lg text-white">{BOOK_CONFIG.SPECIFICATIONS.pages} Pages</span>
                </div>
                <div>
                  <span className="text-xs font-sans tracking-widest text-crimson-500 uppercase font-semibold block">Language</span>
                  <span className="font-serif text-lg text-white">{BOOK_CONFIG.SPECIFICATIONS.language}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* EDITORIAL SECTION 2: ABOUT THE AUTHOR & SPECIAL TOUCH */}
        <div className="bg-[#0A0A0A] border border-crimson-900/30 rounded-sm p-8 sm:p-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-radial-crimson opacity-25 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Author Bio Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3 text-crimson-500 font-sans text-xs tracking-[0.3em] uppercase font-semibold">
                <Feather className="w-4 h-4" />
                <span>About the Author</span>
              </div>

              <h3 className="font-serif text-3xl sm:text-4xl text-white font-light">
                Ladup Sherpa
              </h3>

              <div className="space-y-4 text-neutral-300 font-sans text-sm sm:text-base leading-relaxed font-light whitespace-pre-line">
                {BOOK_CONFIG.AUTHOR_BIO}
              </div>

              {/* Personal Note Callout */}
              <div className="pt-4">
                <blockquote className="border-l-2 border-crimson-600 pl-4 py-2 bg-crimson-950/20 text-neutral-200 font-serif italic text-base sm:text-lg">
                  "{BOOK_CONFIG.PERSONAL_NOTE}"
                </blockquote>
              </div>
            </div>

            {/* Special Touch Box */}
            <div className="lg:col-span-5 bg-[#111111] p-8 border border-neutral-800 rounded-sm space-y-6 relative group">
              <div className="w-12 h-12 rounded-full bg-crimson-950/80 border border-crimson-800/60 flex items-center justify-center text-crimson-400">
                <HeartHandshake className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-sans tracking-[0.25em] text-crimson-500 uppercase font-semibold block mb-2">
                  Special Touch
                </span>
                <h4 className="font-serif text-xl text-white font-medium mb-3">
                  Packed Directly by the Author
                </h4>
                <p className="font-serif text-lg text-neutral-300 italic leading-relaxed">
                  "{BOOK_CONFIG.SPECIAL_TOUCH}"
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-900 text-xs text-neutral-400 font-sans">
                Each copy is signed, inspected, and dispatched personally with care.
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

