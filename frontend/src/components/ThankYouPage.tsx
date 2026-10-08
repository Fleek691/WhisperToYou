import React from 'react';
import { OrderData } from '../types';
import { CheckCircle2, ArrowLeft, PackageCheck } from 'lucide-react';
import { BOOK_CONFIG } from '../config/bookConfig';
import { api } from '../services/api';

interface ThankYouPageProps {
  order: OrderData;
  onBackHome: () => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({ order: initialOrder, onBackHome }) => {
  const [order, setOrder] = React.useState<OrderData>(initialOrder);

  React.useEffect(() => {
    if (initialOrder.orderId) {
      api.getOrder(initialOrder.orderId)
        .then(data => {
          if (data) setOrder(data);
        })
        .catch(console.error);
    }
  }, [initialOrder.orderId]);

  return (
    <section className="min-h-screen py-28 bg-[#050505] flex items-center justify-center relative">
      <div className="max-w-2xl mx-auto px-6 w-full text-center">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-crimson-950/80 border border-crimson-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-crimson-glow">
          <CheckCircle2 className="w-10 h-10 text-crimson-400 animate-bounce" />
        </div>

        <span className="text-crimson-500 font-sans text-xs tracking-[0.3em] uppercase font-semibold block mb-2">
          Order Confirmed
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-white tracking-tight mb-3">
          THANK YOU
        </h1>
        <p className="font-sans text-sm text-neutral-300 mb-8">
          Your order has been successfully placed.
        </p>

        {/* Order Details Receipt Box */}
        <div className="bg-[#0D0D0D] border border-crimson-900/50 p-6 sm:p-8 rounded-sm text-left space-y-6 shadow-2xl mb-8">
          
          <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
            <div>
              <span className="text-[10px] tracking-widest text-neutral-400 uppercase block">Order ID</span>
              <span className="font-mono text-base text-crimson-400 font-semibold">{order.orderId}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] tracking-widest text-neutral-400 uppercase block">Status</span>
              <span className="inline-block px-2.5 py-0.5 bg-crimson-900/60 text-crimson-300 text-xs font-semibold rounded-sm border border-crimson-700">
                {order.orderStatus?.toUpperCase() || 'PROCESSING'}
              </span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-4 text-xs text-neutral-300 py-2 border-b border-neutral-900">
            <div>
              <span className="text-neutral-400 uppercase tracking-wider block mb-1">Customer</span>
              <span className="font-medium text-white">{order.fullName}</span>
              <span className="block text-neutral-400 mt-0.5">{order.email}</span>
              <span className="block text-neutral-400">{order.phone}</span>
            </div>

            <div>
              <span className="text-neutral-400 uppercase tracking-wider block mb-1">Item</span>
              <span className="font-medium text-white">{BOOK_CONFIG.BOOK_TITLE}</span>
              <span className="block text-neutral-400 mt-0.5">Quantity: {order.quantity}</span>
              <span className="block text-neutral-400">Total: ₹{order.totalAmount}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <span className="text-[10px] tracking-widest text-neutral-400 uppercase block mb-1">Delivery Address</span>
            <p className="text-xs text-neutral-200 leading-relaxed">
              {order.address}, {order.city}, {order.state} - {order.pincode}
            </p>
          </div>

          {/* Tracking Details */}
          {(order.trackingNumber || order.trackingUrl) && (
            <div className="pt-4 border-t border-neutral-900 mt-2">
              <span className="text-[10px] tracking-widest text-neutral-400 uppercase block mb-1">Shipping Details</span>
              {order.shippingCarrier && (
                <span className="block text-xs text-neutral-300 mb-1">Carrier: {order.shippingCarrier}</span>
              )}
              {order.trackingNumber && (
                <span className="block text-xs text-neutral-300 mb-2">Tracking #: <span className="font-mono text-crimson-400">{order.trackingNumber}</span></span>
              )}
              {order.trackingUrl && (
                <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="inline-block px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-xs text-white font-medium rounded-sm border border-neutral-700 transition-colors">
                  Track Package
                </a>
              )}
            </div>
          )}

        </div>

        {/* Dispatch Note */}
        <p className="font-serif text-lg text-neutral-300 italic mb-8">
          "Your copy of Whisper to You will be shipped soon."
        </p>

        {/* Back to Home Button */}
        <button
          onClick={onBackHome}
          className="px-8 py-4 bg-crimson-800 hover:bg-crimson-600 text-white font-sans text-xs tracking-[0.25em] uppercase font-semibold rounded-sm border border-crimson-500 transition-all duration-300 shadow-crimson-glow inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO HOME</span>
        </button>

      </div>
    </section>
  );
};
