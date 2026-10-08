import React, { useState, useEffect } from 'react';
import { Menu, X, BookOpen, ShoppingBag, User } from 'lucide-react';
import { BOOK_CONFIG } from '../config/bookConfig';
import { useAuth } from '../context/AuthContext';
interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  onOpenAuth: () => void;
  activeSection?: string;
  hasOrder?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onOpenAuth, hasOrder }) => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', target: 'hero' },
    { label: 'The Book', target: 'about' },
    { label: 'Preview', target: 'preview' },
    { label: 'Themes', target: 'themes' },
    { label: 'Reviews', target: 'reviews' },
    { label: 'Contact', target: 'contact' },
  ];

  const handleLinkClick = (target: string) => {
    setMobileMenuOpen(false);
    onNavigate(target);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050505]/95 backdrop-blur-md border-b border-[#3A0303]/40 py-4 shadow-xl'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => handleLinkClick('hero')}
          className="text-left group focus:outline-none"
        >
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-white group-hover:text-crimson-400 transition-colors block">
            {BOOK_CONFIG.BOOK_TITLE.toUpperCase()}
          </span>
          <span className="text-[10px] tracking-[0.25em] text-neutral-400 uppercase block font-sans -mt-1">
            By {BOOK_CONFIG.AUTHOR_NAME}
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-sans tracking-widest text-neutral-300">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => handleLinkClick(link.target)}
              className="hover:text-white transition-colors relative py-1 focus:outline-none text-xs uppercase group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-crimson-600 transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
          {hasOrder && (
            <button
              onClick={() => handleLinkClick('thankyou')}
              className="text-crimson-400 hover:text-crimson-300 font-semibold transition-colors relative py-1 focus:outline-none text-xs uppercase group"
            >
              My Order
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-crimson-600 transition-all duration-300 group-hover:w-full" />
            </button>
          )}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-neutral-300 text-xs font-sans tracking-widest">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full border border-crimson-800" />
                ) : (
                  <User className="w-4 h-4 text-crimson-500" />
                )}
                <span className="hidden lg:block">{user.name.split(' ')[0]}</span>
              </div>
              <button
                onClick={logout}
                className="text-xs text-neutral-500 hover:text-crimson-400 uppercase tracking-wider font-semibold transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-neutral-400 hover:text-white transition-colors"
              aria-label="Login"
            >
              <User className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => handleLinkClick('order')}
            className="relative px-6 py-2.5 bg-crimson-800/80 hover:bg-crimson-600 text-white font-sans text-xs tracking-[0.2em] uppercase font-semibold border border-crimson-500/50 rounded-sm transition-all duration-300 hover:shadow-crimson-glow flex items-center gap-2 group"
          >
            <ShoppingBag className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
            ORDER YOUR COPY
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <button onClick={logout} className="flex items-center gap-1.5 focus:outline-none">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full border border-crimson-800 object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-crimson-800 text-white flex items-center justify-center text-[10px] font-bold border border-crimson-600">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 hover:text-crimson-400 font-semibold">Exit</span>
              </button>
            </div>
          ) : (
            <button onClick={onOpenAuth} className="text-neutral-400 hover:text-white">
              <User className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => handleLinkClick('order')}
            className="px-3 py-1.5 bg-crimson-800 text-white text-[10px] tracking-widest uppercase font-semibold rounded-sm border border-crimson-600"
          >
            ORDER
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-neutral-300 hover:text-white focus:outline-none p-1"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D0D0D]/98 border-b border-crimson-900/50 px-6 py-8 backdrop-blur-lg animate-fadeIn">
          <nav className="flex flex-col space-y-5 text-center font-sans tracking-widest uppercase text-sm text-neutral-300">
            {navLinks.map((link) => (
              <button
                key={link.target}
                onClick={() => handleLinkClick(link.target)}
                className="py-2 border-b border-neutral-900/60 hover:text-crimson-400 text-left flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-crimson-700 text-xs">→</span>
              </button>
            ))}
            {hasOrder && (
              <button
                onClick={() => handleLinkClick('thankyou')}
                className="py-2 border-b border-neutral-900/60 text-crimson-400 text-left flex items-center justify-between font-bold"
              >
                <span>My Order</span>
                <span className="text-crimson-700 text-xs">→</span>
              </button>
            )}
            <div className="pt-4">
              <button
                onClick={() => handleLinkClick('order')}
                className="w-full py-3 bg-crimson-700 hover:bg-crimson-600 text-white font-sans text-xs tracking-[0.2em] uppercase font-semibold rounded-sm border border-crimson-500 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                ORDER YOUR COPY
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
