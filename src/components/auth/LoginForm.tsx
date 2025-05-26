
import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import GoogleSignInButton from './GoogleSignInButton';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
  isLoading: boolean;
  error: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  onGoogleLogin, 
  isLoading, 
  error 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <>
      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-sm flex items-center">
          <AlertCircle size={18} className="mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm text-earth mb-1">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm text-earth mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-earth"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-terracotta hover:bg-umber text-white py-3 transition-colors disabled:bg-taupe"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-earth">
              Or continue with
            </span>
          </div>
        </div>
        
        <div className="mt-4">
          <GoogleSignInButton
            onClick={onGoogleLogin}
            disabled={isLoading}
          />
        </div>
      </div>
    </>
  );
};

export default LoginForm;
