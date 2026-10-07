import React, { useState, useMemo } from 'react';
import { BOOK_CONFIG } from '../config/bookConfig';
import { api } from '../services/api';
import { CustomerDetails, OrderData } from '../types';
import { ShoppingBag, ShieldCheck, Truck, CreditCard, Minus, Plus, AlertCircle, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

interface OrderSectionProps {
  onOrderSuccess: (order: OrderData) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const OrderSection: React.FC<OrderSectionProps> = ({ onOrderSuccess }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [form, setForm] = useState<CustomerDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    utrNumber: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({});
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const cashfree = React.useRef<any>(null);

  React.useEffect(() => {
    // @ts-ignore
    import('@cashfreepayments/cashfree-js').then(({ load }) => {
      load({
        mode: import.meta.env.VITE_CASHFREE_MODE === 'production' ? 'production' : 'sandbox',
      }).then((cf: any) => {
        cashfree.current = cf;
      });
    });
  }, []);

  // Dynamic Shipping & Total Calculation
  const subtotal = useMemo(() => BOOK_CONFIG.BOOK_PRICE * quantity, [quantity]);
  const shippingCharge = useMemo(
    () => {
      if (subtotal >= BOOK_CONFIG.FREE_SHIPPING_THRESHOLD) return 0;
      if (!form.state) return BOOK_CONFIG.NATIONAL_SHIPPING_CHARGE; // default until they type
      const stateStr = form.state.trim().toLowerCase();
      const isWestBengal = stateStr === 'wb' || stateStr.includes('west bengal') || stateStr === 'w.b' || stateStr === 'w.b.';
      return isWestBengal ? BOOK_CONFIG.LOCAL_SHIPPING_CHARGE : BOOK_CONFIG.NATIONAL_SHIPPING_CHARGE;
    },
    [subtotal, form.state]
  );
  const totalAmount = useMemo(() => subtotal + shippingCharge, [subtotal, shippingCharge]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CustomerDetails]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerDetails, string>> = {};

    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    
    if (!form.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Enter valid 10-digit Indian mobile number';
    }

    if (!form.address.trim()) newErrors.address = 'Delivery address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.state.trim()) newErrors.state = 'State is required';

    if (!form.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(form.pincode.trim())) {
      newErrors.pincode = 'Pincode must be exactly 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      // 1. Create order in our DB
      const createdOrder = await api.createOrder({
        ...form,
        quantity,
      });

      // 2. Create Payment Session
      const sessionData = await api.createPaymentSession(createdOrder.orderId as string);

      if (sessionData.isTestMode) {
        // Skip actual payment for test mode fallback
        const verifyRes = await api.verifyPayment({ orderId: createdOrder.orderId as string, isTestMode: true });
        if (verifyRes.success) {
          onOrderSuccess(verifyRes.order);
        } else {
          setPaymentError('Test payment verification failed.');
        }
        setLoading(false);
        return;
      }

      // 3. Open Cashfree Checkout
      if (cashfree.current) {
        let checkoutOptions = {
          paymentSessionId: sessionData.payment_session_id,
          redirectTarget: "_modal"
        };
        cashfree.current.checkout(checkoutOptions).then((result: any) => {
          if (result.error) {
            console.error(result.error);
            setPaymentError(result.error.message || 'Payment cancelled or failed');
            setLoading(false);
          }
          if (result.redirect) {
            console.log("Redirection");
          }
          if (result.paymentDetails) {
            // 4. Verify Payment on Backend
            api.verifyPayment({ orderId: createdOrder.orderId as string })
              .then(verifyRes => {
                if (verifyRes.success) {
                  onOrderSuccess(verifyRes.order);
                } else {
                  setPaymentError('Payment verification failed.');
                }
              })
              .catch(err => setPaymentError(err.message))
              .finally(() => setLoading(false));
          }
        });
      } else {
        setPaymentError('Payment Gateway not initialized properly.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      setPaymentError(err.message || 'Could not process order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <section id="order" className="py-28 bg-[#050505] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Title */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-crimson-500 font-sans text-xs tracking-[0.3em] uppercase font-semibold block mb-2">
            Secure Order Form
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-white tracking-tight">
            ORDER YOUR COPY
          </h2>
          <div className="crimson-divider max-w-xs mx-auto mt-4" />
        </div>

        {/* Payment Notice Banner */}
        <div className="max-w-4xl mx-auto mb-8 bg-[#0E0E0E] border border-crimson-800/80 p-4 rounded-sm text-xs text-neutral-300 flex items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-crimson-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-white uppercase tracking-wider">SECURE CHECKOUT</p>
              <p className="text-neutral-400">Complete your payment securely via UPI, Cards, or Net Banking.</p>
            </div>
          </div>
        </div>

        {paymentError && (
          <div className="max-w-4xl mx-auto mb-8 bg-crimson-900/40 border border-crimson-600/80 p-4 rounded-sm text-crimson-200 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-crimson-400" />
            <div>
              <p className="font-medium">{paymentError}</p>
              <p className="text-xs text-neutral-400 mt-0.5">Please check your details and try again.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT: Shipping Form */}
          <div className="lg:col-span-7 bg-[#0B0B0B] border border-neutral-800/80 p-6 sm:p-10 rounded-sm shadow-xl space-y-8">
            <div>
              <h3 className="font-serif text-2xl text-white font-normal border-b border-neutral-800 pb-3">
                1. Delivery Address
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Please enter your shipping address below.
              </p>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-sans tracking-widest text-neutral-300 uppercase mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full bg-[#121212] border ${
                      errors.fullName ? 'border-crimson-500' : 'border-neutral-800 focus:border-crimson-600'
                    } px-4 py-3 text-sm text-white focus:outline-none transition-colors rounded-sm`}
                  />
                  {errors.fullName && <p className="text-xs text-crimson-400 mt-1">{errors.fullName}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-sans tracking-widest text-neutral-300 uppercase mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className={`w-full bg-[#121212] border ${
                      errors.email ? 'border-crimson-500' : 'border-neutral-800 focus:border-crimson-600'
                    } px-4 py-3 text-sm text-white focus:outline-none transition-colors rounded-sm`}
                  />
                  {errors.email && <p className="text-xs text-crimson-400 mt-1">{errors.email}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-sans tracking-widest text-neutral-300 uppercase mb-2">
                    Phone Number (10 Digits) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    maxLength={10}
                    className={`w-full bg-[#121212] border ${
                      errors.phone ? 'border-crimson-500' : 'border-neutral-800 focus:border-crimson-600'
                    } px-4 py-3 text-sm text-white focus:outline-none transition-colors rounded-sm`}
                  />
                  {errors.phone && <p className="text-xs text-crimson-400 mt-1">{errors.phone}</p>}
                </div>

                {/* Delivery Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-sans tracking-widest text-neutral-300 uppercase mb-2">
                    Complete Street Address *
                  </label>
                  <textarea
                    name="address"
                    rows={2}
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House/Flat No., Apartment, Street, Landmark"
                    className={`w-full bg-[#121212] border ${
                      errors.address ? 'border-crimson-500' : 'border-neutral-800 focus:border-crimson-600'
                    } px-4 py-3 text-sm text-white focus:outline-none transition-colors rounded-sm`}
                  />
                  {errors.address && <p className="text-xs text-crimson-400 mt-1">{errors.address}</p>}
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-sans tracking-widest text-neutral-300 uppercase mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="e.g. New Delhi"
                    className={`w-full bg-[#121212] border ${
                      errors.city ? 'border-crimson-500' : 'border-neutral-800 focus:border-crimson-600'
                    } px-4 py-3 text-sm text-white focus:outline-none transition-colors rounded-sm`}
                  />
                  {errors.city && <p className="text-xs text-crimson-400 mt-1">{errors.city}</p>}
                </div>

                {/* State */}
                <div>
                  <label className="block text-xs font-sans tracking-widest text-neutral-300 uppercase mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="e.g. Delhi"
                    className={`w-full bg-[#121212] border ${
                      errors.state ? 'border-crimson-500' : 'border-neutral-800 focus:border-crimson-600'
                    } px-4 py-3 text-sm text-white focus:outline-none transition-colors rounded-sm`}
                  />
                  {errors.state && <p className="text-xs text-crimson-400 mt-1">{errors.state}</p>}
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-xs font-sans tracking-widest text-neutral-300 uppercase mb-2">
                    Pincode (6 Digits) *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    placeholder="110001"
                    className={`w-full bg-[#121212] border ${
                      errors.pincode ? 'border-crimson-500' : 'border-neutral-800 focus:border-crimson-600'
                    } px-4 py-3 text-sm text-white focus:outline-none transition-colors rounded-sm`}
                  />
                  {errors.pincode && <p className="text-xs text-crimson-400 mt-1">{errors.pincode}</p>}
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="pt-8 space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-crimson-700 hover:bg-crimson-600 disabled:bg-neutral-800 text-white font-sans text-xs tracking-[0.2em] uppercase font-semibold rounded-sm border border-crimson-500 transition-all duration-300 shadow-crimson-glow flex items-center justify-center gap-3 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>PROCESSING PAYMENT...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-white" />
                      <span>PAY ₹{totalAmount} SECURELY</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 text-[11px] text-neutral-400 pt-2 border-t border-neutral-900 mt-4 pt-4">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-crimson-500" /> Secure Payment</span>
                <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-crimson-500" /> Dispatch in 2-3 days</span>
              </div>
            </form>
          </div>

          {/* RIGHT: Order Summary Card */}
          <div className="lg:col-span-5 bg-[#0D0D0D] border border-crimson-900/40 p-6 sm:p-8 rounded-sm shadow-2xl space-y-6">
            
            <h3 className="font-serif text-2xl text-white font-normal border-b border-neutral-800 pb-3">
              Order Summary
            </h3>

            {/* Book Item Preview */}
            <div className="flex gap-4 items-center border-b border-neutral-900 pb-6">
              <img
                src={BOOK_CONFIG.BOOK_COVER}
                alt={BOOK_CONFIG.BOOK_TITLE}
                className="w-20 h-28 object-cover rounded-sm border border-neutral-800 shadow-md"
              />
              <div className="space-y-1">
                <h4 className="font-serif text-xl text-white font-medium">
                  {BOOK_CONFIG.BOOK_TITLE}
                </h4>
                <p className="text-xs text-neutral-400">By {BOOK_CONFIG.AUTHOR_NAME}</p>
                <p className="text-sm font-semibold text-crimson-400 pt-1">
                  ₹{BOOK_CONFIG.BOOK_PRICE}
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between py-2 border-b border-neutral-900">
              <span className="text-xs font-sans tracking-widest text-neutral-300 uppercase">
                Quantity
              </span>
              <div className="flex items-center space-x-3 bg-[#141414] border border-neutral-800 rounded-sm px-3 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-neutral-400 hover:text-white p-1 focus:outline-none"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-sans text-sm text-white font-medium px-2">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-neutral-400 hover:text-white p-1 focus:outline-none"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Pricing Calculation Breakdown */}
            <div className="space-y-3 text-sm text-neutral-300 border-b border-neutral-900 pb-6">
              <div className="flex justify-between">
                <span className="text-neutral-400">Book Price</span>
                <span>₹{BOOK_CONFIG.BOOK_PRICE} × {quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Shipping</span>
                <span className={shippingCharge === 0 ? 'text-crimson-400 font-medium' : ''}>
                  {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}
                </span>
              </div>
              {subtotal < BOOK_CONFIG.FREE_SHIPPING_THRESHOLD && (
                <p className="text-[11px] text-neutral-400 italic pt-1">
                  Add ₹{BOOK_CONFIG.FREE_SHIPPING_THRESHOLD - subtotal} more for Free Shipping!
                </p>
              )}
            </div>

            {/* Total Amount */}
            <div className="flex justify-between items-center text-lg font-serif text-white font-bold pt-2">
              <span>TOTAL AMOUNT</span>
              <span className="text-2xl text-crimson-400">₹{totalAmount}</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
