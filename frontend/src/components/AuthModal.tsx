import React from 'react';
import { X, Lock } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { login } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  const handleSuccess = async (credentialResponse: any) => {
    try {
      if (credentialResponse.credential) {
        await login(credentialResponse.credential);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/90 flex items-center justify-center p-6 animate-fadeIn">
      <div className="max-w-md w-full bg-[#0D0D0D] border border-crimson-900/60 p-8 rounded-sm shadow-2xl space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-crimson-950/80 border border-crimson-700 rounded-full flex items-center justify-center mx-auto text-crimson-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl text-white font-light">MEMBER ACCESS</h2>
          <p className="text-xs text-neutral-400 uppercase tracking-widest">
            Whisper to You • Exclusive Portal
          </p>
        </div>

        {error && (
          <div className="bg-crimson-950/60 border border-crimson-700 p-3 rounded-sm text-crimson-300 text-xs text-center">
            {error}
          </div>
        )}

        <div className="flex justify-center pt-4 pb-2">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => setError('Google Login Failed')}
            theme="filled_black"
            shape="rectangular"
            text="continue_with"
            size="large"
          />
        </div>

        <p className="text-[10px] text-center text-neutral-500 font-sans tracking-wider mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
