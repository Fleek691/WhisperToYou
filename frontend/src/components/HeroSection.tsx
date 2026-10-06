import React from 'react';
import { BOOK_CONFIG } from '../config/bookConfig';
import { ArrowRight, BookOpen } from 'lucide-react';
import { SpiderLilyDivider } from './SpiderLilyDivider';
import { ThreeBookCanvas } from './ThreeBookCanvas';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section id="hero" className="relative min-h-screen pt-24 pb-20 flex items-center justify-center overflow-hidden noise-bg">
      
      {/* Red Spider Lily Background Graphic Accent */}
      <div
        className="absolute top-10 right-0 w-[500px] h-[500px] pointer-events-none opacity-25 mix-blend-screen bg-no-repeat bg-contain bg-right-top z-0"
        style={{ backgroundImage: `url(/images/spider-lily-1.png)` }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none opacity-20 mix-blend-screen bg-no-repeat bg-contain bg-left-bottom z-0"
        style={{ backgroundImage: `url(/images/spider-lily-2.png)` }}
      />

      {/* Central Ambient Crimson Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-radial-crimson pointer-events-none opacity-90 blur-3xl z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* LEFT COLUMN: 3D Interactive Three.js Replica of the Book Photo */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-1">
          <div className="relative flex justify-center items-center w-full">
            {/* Ambient Crimson Aura */}
            <div className="absolute inset-0 bg-gradient-to-r from-crimson-950 via-crimson-700/40 to-crimson-950 rounded-full blur-3xl opacity-65 pointer-events-none" />

            {/* Three.js 3D Book Replica */}
            <ThreeBookCanvas
              coverUrl={BOOK_CONFIG.BOOK_COVER}
              title={BOOK_CONFIG.BOOK_TITLE}
              author={BOOK_CONFIG.AUTHOR_NAME}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Title, Author, Epigraph, Intro & CTAs */}
        <div className="lg:col-span-7 flex flex-col justify-center order-2 lg:order-2 text-center lg:text-left space-y-7">
          
          {/* Tagline / Category */}
          <div className="flex items-center justify-center lg:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-crimson-500 animate-ping" />
            <span className="text-crimson-500 font-sans text-xs tracking-[0.3em] uppercase font-semibold">
              A Poetry Collection by Ladup Sherpa
            </span>
          </div>

          {/* Main Title */}
          <div>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-none">
              WHISPER <br className="hidden sm:inline" />
              <span className="text-crimson-400 font-normal italic font-serif">TO YOU</span>
            </h1>

            {/* Author Credit */}
            <p className="mt-3 font-sans text-xs sm:text-sm tracking-[0.3em] text-neutral-400 uppercase">
              By <span className="text-white font-semibold">{BOOK_CONFIG.AUTHOR_NAME}</span>
            </p>
          </div>

          {/* Spider Lily Divider */}
          <div className="lg:self-start">
            <SpiderLilyDivider className="my-1 lg:justify-start" />
          </div>

          {/* Epigraph Placeholder Block */}
          <blockquote className="border-l-2 border-crimson-700/80 pl-4 lg:pl-6 py-1 italic font-serif text-lg sm:text-xl text-neutral-200 leading-relaxed max-w-xl mx-auto lg:mx-0">
            "{BOOK_CONFIG.EPIGRAPH}"
          </blockquote>

          {/* Short Introduction Placeholder */}
          <p className="font-sans text-sm sm:text-base text-neutral-400 leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
            {BOOK_CONFIG.INTRODUCTION}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            <button
              onClick={() => onNavigate('order')}
              className="w-full sm:w-auto px-8 py-4 bg-crimson-700 hover:bg-crimson-600 text-white font-sans text-xs tracking-[0.25em] uppercase font-semibold rounded-sm border border-crimson-500 transition-all duration-300 shadow-crimson-glow flex items-center justify-center gap-3 group cursor-pointer"
            >
              <span>ORDER YOUR COPY</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-white" />
            </button>

            <button
              onClick={() => onNavigate('preview')}
              className="w-full sm:w-auto px-8 py-4 bg-[#0D0D0D] hover:bg-neutral-900 text-neutral-300 hover:text-white font-sans text-xs tracking-[0.25em] uppercase font-medium rounded-sm border border-neutral-800 hover:border-crimson-900 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-crimson-500" />
              <span>READ PREVIEW</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
