import React, { useState } from 'react';
import { BOOK_CONFIG } from '../config/bookConfig';
import { api } from '../services/api';
import { Instagram, Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitContact({ name, email, message });
      setSuccessMsg(res.message || 'Your message has been sent successfully.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-28 bg-[#050505] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Title */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <span className="text-crimson-500 font-sans text-xs tracking-[0.3em] uppercase font-semibold block mb-2">
            Get In Touch
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-white tracking-tight">
            CONTACT
          </h1>
          <div className="crimson-divider max-w-xs mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
          
          {/* Direct Social & Email Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0D0D0D] p-8 border border-crimson-900/40 rounded-sm space-y-6">
              <h3 className="font-serif text-2xl text-white font-medium">
                Connect Directly
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                For literary inquiries, press, or general reader feedback:
              </p>

              <div className="space-y-4 pt-2">
                {/* Instagram Link */}
                <a
                  href={BOOK_CONFIG.INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-[#121212] border border-neutral-800 hover:border-crimson-600/80 rounded-sm transition-all group"
                >
                  <div className="p-2.5 bg-crimson-950/80 rounded-full text-crimson-400 group-hover:text-white transition-colors">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] tracking-widest text-neutral-400 uppercase block">Instagram</span>
                    <span className="text-sm font-medium text-white group-hover:text-crimson-400 transition-colors">
                      @ladupsherpa
                    </span>
                  </div>
                </a>

                {/* Email Link */}
                <a
                  href={`mailto:${BOOK_CONFIG.CONTACT_EMAIL}`}
                  className="flex items-center gap-4 p-4 bg-[#121212] border border-neutral-800 hover:border-crimson-600/80 rounded-sm transition-all group"
                >
                  <div className="p-2.5 bg-crimson-950/80 rounded-full text-crimson-400 group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] tracking-widest text-neutral-400 uppercase block">Email</span>
                    <span className="text-sm font-medium text-white group-hover:text-crimson-400 transition-colors">
                      {BOOK_CONFIG.CONTACT_EMAIL}
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-[#0D0D0D] p-8 sm:p-10 border border-neutral-800 rounded-sm shadow-xl space-y-6">
            <h3 className="font-serif text-2xl text-white font-medium border-b border-neutral-800 pb-3">
              Send a Message
            </h3>

            {successMsg && (
              <div className="bg-crimson-950/60 border border-crimson-700/60 p-4 rounded-sm text-crimson-200 text-sm flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-crimson-400 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="bg-crimson-950/60 border border-crimson-700/60 p-4 rounded-sm text-crimson-200 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-crimson-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-sans tracking-widest text-neutral-300 uppercase mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-[#121212] border border-neutral-800 focus:border-crimson-600 px-4 py-3 text-sm text-white focus:outline-none transition-colors rounded-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-sans tracking-widest text-neutral-300 uppercase mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-[#121212] border border-neutral-800 focus:border-crimson-600 px-4 py-3 text-sm text-white focus:outline-none transition-colors rounded-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-sans tracking-widest text-neutral-300 uppercase mb-2">
                  Message *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message..."
                  className="w-full bg-[#121212] border border-neutral-800 focus:border-crimson-600 px-4 py-3 text-sm text-white focus:outline-none transition-colors rounded-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-crimson-800 hover:bg-crimson-600 disabled:bg-neutral-800 text-white font-sans text-xs tracking-[0.25em] uppercase font-semibold rounded-sm border border-crimson-600 transition-all duration-300 shadow-crimson-glow flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'SENDING...' : 'SEND MESSAGE'}</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
