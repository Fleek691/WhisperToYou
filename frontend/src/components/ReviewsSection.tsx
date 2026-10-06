import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ReviewItem } from '../types';
import { Star, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchApprovedReviews();
  }, []);

  const fetchApprovedReviews = async () => {
    try {
      const data = await api.getApprovedReviews();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedMessage(null);
    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !reviewText.trim()) {
      setErrorMessage('Please complete all fields before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitReview({
        customerName: name,
        email,
        rating,
        review: reviewText,
      });
      setSubmittedMessage(res.message || 'Thank you! Your review has been submitted for moderation.');
      setName('');
      setEmail('');
      setRating(5);
      setReviewText('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-28 bg-[#050505] relative border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <span className="text-crimson-500 font-sans text-xs tracking-[0.3em] uppercase font-semibold block mb-2">
            Reader Reflections
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-white tracking-tight">
            REVIEWS
          </h2>
          <div className="crimson-divider max-w-xs mx-auto mt-4" />
        </div>

        {/* Reviews List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {reviews.length === 0 && !loading ? (
            <div className="col-span-full text-center py-12 bg-[#0D0D0D] border border-neutral-800 rounded-sm">
              <p className="font-serif text-xl text-neutral-400 italic">
                Be the first to share your thoughts on "Whisper to You".
              </p>
            </div>
          ) : (
            reviews.map((rev, idx) => (
              <div
                key={rev._id || idx}
                className="bg-[#0D0D0D] p-8 border border-crimson-900/30 rounded-sm flex flex-col justify-between space-y-4 hover:border-crimson-700/50 transition-all duration-300"
              >
                <div className="space-y-3">
                  {/* Crimson Star Rating */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating
                            ? 'text-crimson-500 fill-crimson-500'
                            : 'text-neutral-800'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="font-sans text-sm text-neutral-300 leading-relaxed font-light italic">
                    "{rev.review}"
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-900 flex justify-between items-center text-xs">
                  <span className="font-serif text-base text-white font-medium">
                    {rev.customerName}
                  </span>
                  <span className="text-[10px] tracking-widest text-neutral-400 uppercase font-sans">
                    Verified Reader
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Write A Review Section */}
        <div className="max-w-2xl mx-auto bg-[#0A0A0A] border border-neutral-800/90 p-8 sm:p-12 rounded-sm shadow-2xl">
          <h3 className="font-serif text-3xl text-white font-light text-center mb-2">
            WRITE A REVIEW
          </h3>
          <p className="text-center text-xs text-neutral-400 mb-8 uppercase tracking-widest">
            Share your reading experience
          </p>

          {submittedMessage && (
            <div className="mb-6 bg-crimson-950/60 border border-crimson-700/60 p-4 rounded-sm text-crimson-200 text-sm flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-crimson-400 flex-shrink-0" />
              <span>{submittedMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 bg-crimson-950/60 border border-crimson-700/60 p-4 rounded-sm text-crimson-200 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-crimson-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-sans tracking-widest text-neutral-300 uppercase mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-[#121212] border border-neutral-800 focus:border-crimson-600 px-4 py-3 text-sm text-white focus:outline-none transition-colors rounded-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-sans tracking-widest text-neutral-300 uppercase mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-[#121212] border border-neutral-800 focus:border-crimson-600 px-4 py-3 text-sm text-white focus:outline-none transition-colors rounded-sm"
                />
              </div>
            </div>

            {/* Interactive Crimson Star Rating */}
            <div>
              <label className="block text-xs font-sans tracking-widest text-neutral-300 uppercase mb-2">
                Rating *
              </label>
              <div className="flex items-center space-x-2 py-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const starVal = i + 1;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setRating(starVal)}
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          starVal <= (hoverRating || rating)
                            ? 'text-crimson-500 fill-crimson-500'
                            : 'text-neutral-700'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Review Content */}
            <div>
              <label className="block text-xs font-sans tracking-widest text-neutral-300 uppercase mb-2">
                Your Review *
              </label>
              <textarea
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your honest review..."
                className="w-full bg-[#121212] border border-neutral-800 focus:border-crimson-600 px-4 py-3 text-sm text-white focus:outline-none transition-colors rounded-sm"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-crimson-800 hover:bg-crimson-600 disabled:bg-neutral-800 text-white font-sans text-xs tracking-[0.25em] uppercase font-semibold rounded-sm border border-crimson-600 transition-all duration-300 shadow-crimson-glow flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>SUBMIT REVIEW</span>
            </button>

            <p className="text-[11px] text-center text-neutral-400">
              * Reviews are moderated before public display.
            </p>
          </form>
        </div>

      </div>
    </section>
  );
};
