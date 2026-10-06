import React from 'react';
import { BOOK_CONFIG } from '../config/bookConfig';
import { Instagram, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();

  return (
    <footer className="bg-[#030303] text-neutral-400 font-sans border-t border-crimson-950/60 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-neutral-900">
        
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4">
          <button
            onClick={() => onNavigate('hero')}
            className="text-left focus:outline-none group block"
          >
            <span className="font-serif text-2xl font-bold tracking-wider text-white group-hover:text-crimson-400 transition-colors block">
              {BOOK_CONFIG.BOOK_TITLE.toUpperCase()}
            </span>
            <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase block -mt-1">
              By {BOOK_CONFIG.AUTHOR_NAME}
            </span>
          </button>
          <p className="text-xs text-neutral-400 max-w-sm leading-relaxed font-light">
            The official digital home of "Whisper to You" by Ladup Sherpa. A collection of poetry & prose exploring emotion, silence, and memory.
          </p>
          <div className="pt-2 flex items-center space-x-4">
            <a
              href={BOOK_CONFIG.INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-[#0D0D0D] border border-neutral-800 hover:border-crimson-600 text-neutral-300 hover:text-white rounded-full transition-colors"
              aria-label="Author Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${BOOK_CONFIG.CONTACT_EMAIL}`}
              className="p-2.5 bg-[#0D0D0D] border border-neutral-800 hover:border-crimson-600 text-neutral-300 hover:text-white rounded-full transition-colors"
              aria-label="Author Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-sans tracking-[0.2em] text-white uppercase font-semibold">
            Navigation
          </h4>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            {['Home', 'The Book', 'Preview', 'Order', 'Reviews', 'Contact'].map((item) => {
              const target = item.toLowerCase().replace(/\s+/g, '');
              const sectionTarget = target === 'thebook' ? 'about' : target;
              return (
                <li key={item}>
                  <button
                    onClick={() => onNavigate(sectionTarget)}
                    className="hover:text-white transition-colors"
                  >
                    {item}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Legal Column */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-sans tracking-[0.2em] text-white uppercase font-semibold">
            Legal & Support
          </h4>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            <li>
              <button onClick={() => onNavigate('shipping')} className="hover:text-white transition-colors">
                Shipping Information
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">
                Terms & Conditions
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('refund')} className="hover:text-white transition-colors">
                Refund / Return Policy
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright & Admin Trigger */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-4">
        <p>© {currentYear} {BOOK_CONFIG.AUTHOR_NAME}. All rights reserved.</p>
        <div className="flex items-center space-x-6">
          {user?.role === 'admin' && (
            <button
              onClick={onOpenAdmin}
              className="hover:text-crimson-400 transition-colors flex items-center gap-1.5 focus:outline-none"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
