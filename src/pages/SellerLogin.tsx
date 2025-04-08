
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/hooks/use-toast';

const SellerLogin = () => {
  const { login, user, roles } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Redirect if already logged in as seller
  useEffect(() => {
    if (user && roles.includes('seller')) {
      navigate('/seller/dashboard');
    }
  }, [user, roles, navigate]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      
      // Check if the user has a seller role after login
      if (!roles.includes('seller')) {
        toast({
          title: "Access denied",
          description: "This account doesn't have seller permissions.",
          variant: "destructive",
        });
        
        // Log out since they don't have seller permissions
        setIsLoading(false);
        return;
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate('/seller/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError((err as Error).message || 'Please check your credentials and try again.');
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDemoLogin = async () => {
    setIsLoading(true);
    
    try {
      const demoEmail = 'seller@example.com';
      const demoPassword = 'password123';
      
      await login(demoEmail, demoPassword);
      
      toast({
        title: "Demo login successful",
        description: "Welcome to the seller dashboard!",
      });
      
      navigate('/seller/dashboard');
    } catch (err) {
      console.error('Demo login error:', err);
      setError((err as Error).message || 'An unexpected error occurred. Please try again later.');
      toast({
        title: "Demo login failed",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="min-h-screen bg-cream py-16 px-4 flex items-center justify-center">
      <div className="bg-white p-8 rounded-sm shadow-sm max-w-md w-full">
        <div className="mb-6 text-center">
          <h1 className="font-playfair text-2xl text-charcoal mb-2">Seller Login</h1>
          <p className="text-earth text-sm">Sign in to access your seller dashboard</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-sm flex items-center">
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-charcoal mb-1">Email</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth">
                <Mail size={18} />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-sand focus:border-terracotta focus:outline-none"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm text-charcoal mb-1">Password</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth">
                <Lock size={18} />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-sand focus:border-terracotta focus:outline-none"
                placeholder="•••••••••"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-charcoal text-white py-2 hover:bg-charcoal/90 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <button
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full mt-4 border border-charcoal text-charcoal py-2 hover:bg-charcoal/5 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Use Demo Account'}
        </button>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-earth">
            Don't have a seller account?{' '}
            <Link to="/seller/register" className="text-terracotta hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;
