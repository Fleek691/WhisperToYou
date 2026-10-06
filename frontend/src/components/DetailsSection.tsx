import React from 'react';
import { BOOK_CONFIG } from '../config/bookConfig';

export const DetailsSection: React.FC = () => {
  const specs = [
    { label: 'Title', value: BOOK_CONFIG.SPECIFICATIONS.title },
    { label: 'Author', value: BOOK_CONFIG.SPECIFICATIONS.author },
    { label: 'Genre', value: BOOK_CONFIG.SPECIFICATIONS.genre },
    { label: 'Language', value: BOOK_CONFIG.SPECIFICATIONS.language },
    { label: 'Pages', value: BOOK_CONFIG.SPECIFICATIONS.pages },
    { label: 'Dimensions', value: BOOK_CONFIG.SPECIFICATIONS.dimensions },
    { label: 'Format', value: BOOK_CONFIG.SPECIFICATIONS.format },
    { label: 'ISBN', value: BOOK_CONFIG.SPECIFICATIONS.isbn },
    { label: 'Publisher', value: BOOK_CONFIG.SPECIFICATIONS.publisher },
    { label: 'Publication Date', value: BOOK_CONFIG.SPECIFICATIONS.publicationDate },
    { label: 'Weight', value: BOOK_CONFIG.SPECIFICATIONS.weight },
    { label: 'Price', value: `₹${BOOK_CONFIG.SPECIFICATIONS.price}` },
  ];

  return (
    <section className="py-24 bg-[#050505] relative">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="text-crimson-500 font-sans text-xs tracking-[0.3em] uppercase font-semibold block mb-2">
            Bibliographic Specification
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight">
            BOOK DETAILS
          </h2>
          <div className="crimson-divider max-w-xs mx-auto mt-4" />
        </div>

        {/* Specification Grid */}
        <div className="bg-[#0A0A0A] border border-crimson-900/40 rounded-sm divide-y divide-neutral-900 overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-neutral-900">
            {specs.map((spec, idx) => (
              <div
                key={idx}
                className="p-6 flex flex-col justify-between hover:bg-neutral-900/40 transition-colors"
              >
                <span className="text-[11px] font-sans tracking-[0.2em] text-crimson-500 uppercase font-medium">
                  {spec.label}
                </span>
                <span className="font-serif text-lg text-neutral-100 mt-2 tracking-wide font-medium">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
