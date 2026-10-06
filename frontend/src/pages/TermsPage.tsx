import React from 'react';
import { BOOK_CONFIG } from '../config/bookConfig';

export const TermsPage: React.FC = () => {
  return (
    <section className="py-28 bg-[#050505] min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <span className="text-crimson-500 font-sans text-xs tracking-[0.3em] uppercase font-semibold block mb-2">
          Legal
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-white tracking-tight mb-8">
          TERMS & CONDITIONS
        </h1>
        <div className="crimson-divider mb-12" />

        <div className="space-y-6 bg-[#0D0D0D] p-8 border border-neutral-800 rounded-sm text-neutral-300 font-sans text-sm leading-relaxed">
          <p>
            Welcome to the official publication website for <strong>"{BOOK_CONFIG.BOOK_TITLE}"</strong> by {BOOK_CONFIG.AUTHOR_NAME}. By placing an order, you agree to the following terms.
          </p>

          <h3 className="font-serif text-xl text-white pt-4">1. Intellectual Property</h3>
          <p className="text-neutral-400">
            All literary work, cover design, poems, text, and artwork associated with "{BOOK_CONFIG.BOOK_TITLE}" are copyright © {BOOK_CONFIG.AUTHOR_NAME}. Unauthorized copying or distribution is prohibited.
          </p>

          <h3 className="font-serif text-xl text-white pt-4">2. Orders & Pricing</h3>
          <p className="text-neutral-400">
            [PLACEHOLDER: Details regarding order acceptance, pricing verification, and right to cancel orders in case of erroneous submissions.]
          </p>

          <h3 className="font-serif text-xl text-white pt-4">3. Governing Law</h3>
          <p className="text-neutral-400">
            [PLACEHOLDER: Legal jurisdiction and dispute resolution policies.]
          </p>
        </div>
      </div>
    </section>
  );
};
