
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Login = () => {
  const { login, googleLogin, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.redirect || '/';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // If already logged in, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Failed to login. Please check your credentials and try again.');
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      toast({
        title: "Google login successful",
        description: "Welcome to RAIBO!",
      });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Failed to login with Google. Please try again.');
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <Layout>
      <div className="min-h-screen bg-cream py-10">
        <div className="container-custom max-w-md">
          <div className="bg-white p-8 rounded-sm shadow-sm">
            <h1 className="font-playfair text-2xl text-center text-charcoal mb-6">Sign In</h1>
            
            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-sm flex items-center">
                <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
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
                    onClick={toggleShowPassword}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-earth"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="text-right mt-1">
                  <Link to="/forgot-password" className="text-sm text-terracotta hover:underline">
                    Forgot password?
                  </Link>
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
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 border border-taupe/30 py-3 hover:bg-sand/10 transition-colors"
                >
                  <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm text-earth">
              Don't have an account?{' '}
              <Link to="/buyer/register" className="text-terracotta hover:underline">
                Register
              </Link>
            </div>
            
            <div className="mt-4 text-center text-xs text-earth">
              Are you a seller?{' '}
              <Link to="/seller/login" className="text-terracotta hover:underline">
                Sign in as Seller
              </Link>
              {' '}or{' '}
              <Link to="/seller/register" className="text-terracotta hover:underline">
                Register as Seller
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
