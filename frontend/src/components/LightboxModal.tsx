import React, { useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  imageSrc: string;
  title: string;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  imageSrc,
  title,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8 animate-fadeIn">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-3 bg-neutral-900/80 hover:bg-crimson-800 text-white rounded-full transition-colors border border-neutral-800"
        aria-label="Close Lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Image Container */}
      <div className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center">
        <img
          src={imageSrc}
          alt={title}
          className="max-h-[82vh] w-auto max-w-full object-contain rounded-sm border border-neutral-800 shadow-2xl"
        />
        <p className="font-serif text-lg text-neutral-300 mt-4 tracking-wide text-center">
          {title}
        </p>
      </div>
    </div>
  );
};
