import React from 'react';
import { BOOK_CONFIG } from '../config/bookConfig';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <section className="py-28 bg-[#050505] min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <span className="text-crimson-500 font-sans text-xs tracking-[0.3em] uppercase font-semibold block mb-2">
          Legal
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-white tracking-tight mb-8">
          PRIVACY POLICY
        </h1>
        <div className="crimson-divider mb-12" />

        <div className="space-y-6 bg-[#0D0D0D] p-8 border border-neutral-800 rounded-sm text-neutral-300 font-sans text-sm leading-relaxed">
          <p>
            This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from the official website of <strong>"{BOOK_CONFIG.BOOK_TITLE}"</strong> by {BOOK_CONFIG.AUTHOR_NAME}.
          </p>

          <h3 className="font-serif text-xl text-white pt-4">1. Information We Collect</h3>
          <p className="text-neutral-400">
            [PLACEHOLDER: Details regarding customer name, email address, shipping address, phone number, and transaction logs collected strictly for order fulfillment.]
          </p>

          <h3 className="font-serif text-xl text-white pt-4">2. Payment Security</h3>
          <p className="text-neutral-400">
            All payment transactions are processed securely through Razorpay. We do not store or transmit raw debit/credit card numbers, CVVs, or bank passwords on our servers.
          </p>

          <h3 className="font-serif text-xl text-white pt-4">3. Data Usage & Protection</h3>
          <p className="text-neutral-400">
            [PLACEHOLDER: Information regarding data retention, non-sharing policy with unauthorized third parties, and email notification usage.]
          </p>

          <h3 className="font-serif text-xl text-white pt-4">4. Contact Us</h3>
          <p className="text-neutral-400">
            For questions regarding privacy, please contact us at: <a href={`mailto:${BOOK_CONFIG.CONTACT_EMAIL}`} className="text-crimson-400 hover:underline">{BOOK_CONFIG.CONTACT_EMAIL}</a>
          </p>
        </div>
      </div>
    </section>
  );
};
