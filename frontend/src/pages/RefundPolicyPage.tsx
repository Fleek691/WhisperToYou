import React from 'react';
import { BOOK_CONFIG } from '../config/bookConfig';

export const RefundPolicyPage: React.FC = () => {
  return (
    <section className="py-28 bg-[#050505] min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <span className="text-crimson-500 font-sans text-xs tracking-[0.3em] uppercase font-semibold block mb-2">
          Legal & Support
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-white tracking-tight mb-8">
          REFUND & RETURN POLICY
        </h1>
        <div className="crimson-divider mb-12" />

        <div className="space-y-6 bg-[#0D0D0D] p-8 border border-neutral-800 rounded-sm text-neutral-300 font-sans text-sm leading-relaxed">
          <p>
            Our commitment is to ensure your physical copy of <strong>"{BOOK_CONFIG.BOOK_TITLE}"</strong> arrives in pristine condition.
          </p>

          <h3 className="font-serif text-xl text-white pt-4">1. Damaged or Misprinted Copies</h3>
          <p className="text-neutral-400">
            [PLACEHOLDER: Policy regarding replacement or refund eligibility if the book arrives damaged in transit or with printing defects.]
          </p>

          <h3 className="font-serif text-xl text-white pt-4">2. Return Window</h3>
          <p className="text-neutral-400">
            [PLACEHOLDER: Number of days within which a return or replacement request must be filed upon receipt.]
          </p>

          <h3 className="font-serif text-xl text-white pt-4">3. Request Process</h3>
          <p className="text-neutral-400">
            To report a damaged shipment, please contact <a href={`mailto:${BOOK_CONFIG.CONTACT_EMAIL}`} className="text-crimson-400 hover:underline">{BOOK_CONFIG.CONTACT_EMAIL}</a> with your Order ID and photo of the defect.
          </p>
        </div>
      </div>
    </section>
  );
};
