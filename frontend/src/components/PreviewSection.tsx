import React, { useState } from 'react';
import { BOOK_CONFIG } from '../config/bookConfig';
import { LightboxModal } from './LightboxModal';
import { Maximize2 } from 'lucide-react';

export const PreviewSection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<{ src: string; title: string } | null>(null);

  return (
    <section id="preview" className="py-28 bg-[#070707] border-t border-neutral-900 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="text-crimson-500 font-sans text-xs tracking-[0.3em] uppercase font-semibold block mb-2">
            Excerpt Selection
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-white tracking-tight">
            POEM PREVIEWS
          </h2>
          <p className="font-serif text-lg text-neutral-400 italic mt-2">
            "A glimpse inside the original pages."
          </p>
          <div className="crimson-divider max-w-xs mx-auto mt-4" />
        </div>

        {/* Asymmetrical Editorial Gallery Layout on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Card 1: Featured Excerpt */}
          <div
            onClick={() => setSelectedImage({ src: BOOK_CONFIG.POEM_PREVIEWS[0].image, title: BOOK_CONFIG.POEM_PREVIEWS[0].title })}
            className="md:col-span-7 cursor-pointer group relative bg-[#0C0C0C] p-4 rounded-sm border border-neutral-800 hover:border-crimson-700/60 transition-all duration-500 shadow-xl overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-square overflow-hidden bg-neutral-950 flex items-center justify-center p-4 rounded-sm border border-neutral-900">
              <img
                src={BOOK_CONFIG.POEM_PREVIEWS[0].image}
                alt={BOOK_CONFIG.POEM_PREVIEWS[0].alt}
                className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-700 filter contrast-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity pointer-events-none" />
              
              <div className="absolute bottom-4 right-4 p-2.5 bg-black/80 rounded-full border border-neutral-700 group-hover:bg-crimson-800 transition-colors shadow-lg">
                <Maximize2 className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between">
              <span className="font-serif text-xl tracking-wide text-white group-hover:text-crimson-400 transition-colors">
                {BOOK_CONFIG.POEM_PREVIEWS[0].title}
              </span>
              <span className="text-xs font-sans text-neutral-400 tracking-widest uppercase">
                Click to expand
              </span>
            </div>
          </div>

          {/* Cards 2 & 3: Secondary Stack */}
          <div className="md:col-span-5 flex flex-col gap-8 justify-between">
            {BOOK_CONFIG.POEM_PREVIEWS.slice(1).map((preview) => (
              <div
                key={preview.id}
                onClick={() => setSelectedImage({ src: preview.image, title: preview.title })}
                className="cursor-pointer group relative bg-[#0C0C0C] p-4 rounded-sm border border-neutral-800 hover:border-crimson-700/60 transition-all duration-500 shadow-lg overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-950 flex items-center justify-center p-3 rounded-sm border border-neutral-900">
                  <img
                    src={preview.image}
                    alt={preview.alt}
                    className="w-full h-full object-contain group-hover:scale-102 transition-transform duration-700 filter contrast-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity pointer-events-none" />
                  
                  <div className="absolute bottom-3 right-3 p-2 bg-black/80 rounded-full border border-neutral-700 group-hover:bg-crimson-800 transition-colors shadow-lg">
                    <Maximize2 className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-900 flex items-center justify-between">
                  <span className="font-serif text-lg tracking-wide text-white group-hover:text-crimson-400 transition-colors">
                    {preview.title}
                  </span>
                  <span className="text-[10px] font-sans text-neutral-400 tracking-widest uppercase">
                    Click to expand
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <LightboxModal
          isOpen={!!selectedImage}
          imageSrc={selectedImage.src}
          title={selectedImage.title}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </section>
  );
};

