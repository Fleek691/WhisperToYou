import React from 'react';
import { BOOK_CONFIG } from '../config/bookConfig';

export const ShippingPage: React.FC = () => {
  return (
    <section className="py-28 bg-[#050505] min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <span className="text-crimson-500 font-sans text-xs tracking-[0.3em] uppercase font-semibold block mb-2">
          Dispatch & Delivery
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-white tracking-tight mb-8">
          SHIPPING INFORMATION
        </h1>
        <div className="crimson-divider mb-12" />

        <div className="space-y-8 bg-[#0D0D0D] p-8 border border-neutral-800 rounded-sm text-neutral-300 font-sans text-sm">
          <div>
            <h3 className="font-serif text-xl text-white font-medium mb-2">Shipping Locations</h3>
            <p className="text-neutral-400">{BOOK_CONFIG.SHIPPING.locations}</p>
          </div>

          <div>
            <h3 className="font-serif text-xl text-white font-medium mb-2">Processing Time</h3>
            <p className="text-neutral-400">{BOOK_CONFIG.SHIPPING.processingTime}</p>
          </div>

          <div>
            <h3 className="font-serif text-xl text-white font-medium mb-2">Estimated Delivery</h3>
            <p className="text-neutral-400">{BOOK_CONFIG.SHIPPING.estimatedDelivery}</p>
          </div>

          <div>
            <h3 className="font-serif text-xl text-white font-medium mb-2">Shipping Charges</h3>
            <p className="text-neutral-400">{BOOK_CONFIG.SHIPPING.shippingCharge}</p>
          </div>

          <div>
            <h3 className="font-serif text-xl text-white font-medium mb-2">Free Shipping Eligibility</h3>
            <p className="text-neutral-400">{BOOK_CONFIG.SHIPPING.freeShipping}</p>
          </div>

          <div>
            <h3 className="font-serif text-xl text-white font-medium mb-2">Order Tracking</h3>
            <p className="text-neutral-400">{BOOK_CONFIG.SHIPPING.tracking}</p>
          </div>

          <div>
            <h3 className="font-serif text-xl text-white font-medium mb-2">Return & Exchange Overview</h3>
            <p className="text-neutral-400">{BOOK_CONFIG.SHIPPING.returns}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
