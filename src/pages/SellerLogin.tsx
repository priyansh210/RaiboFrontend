
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '../integrations/supabase/client';

const SellerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      if (result.error) {
        toast({
          title: "Login failed",
          description: result.error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Check if user has seller role
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', result.data.user.id);
      
      if (rolesError) {
        throw rolesError;
      }
      
      const roles = rolesData?.map(r => r.role) || [];
      
      if (!roles.includes('seller')) {
        // Log out if not a seller
        await supabase.auth.signOut();
        toast({
          title: "Access denied",
          description: "This account does not have seller privileges",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      navigate('/seller/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: (error as Error).message || 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDemoLogin = async () => {
    setIsLoading(true);
    
    try {
      // Use the demo seller account
      const demoEmail = 'seller@example.com';
      const demoPassword = 'password123';
      
      const result = await login(demoEmail, demoPassword);
      if (result.error) {
        toast({
          title: "Demo login failed",
          description: result.error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      toast({
        title: "Demo login successful",
        description: "Welcome to the seller dashboard!",
      });
      
      navigate('/seller/dashboard');
    } catch (error) {
      console.error('Demo login error:', error);
      toast({
        title: "Demo login failed",
        description: (error as Error).message || 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="h-screen flex flex-col md:flex-row">
      <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop)' }}>
        <div className="h-full w-full bg-gradient-to-r from-charcoal/70 to-charcoal/40 flex items-center justify-center text-white p-10">
          <div className="max-w-md">
            <h1 className="font-playfair text-4xl mb-6">Sell Your Products with Us</h1>
            <p className="mb-8">Join our marketplace and reach thousands of customers looking for quality products like yours.</p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-terracotta text-white p-2 rounded-full mr-4">
                  <span>1</span>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Create your seller account</h3>
                  <p className="text-white/80 text-sm">Quick and easy setup process</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-terracotta text-white p-2 rounded-full mr-4">
                  <span>2</span>
                </div>
                <div>
                  <h3 className="font-medium mb-1">List your products</h3>
                  <p className="text-white/80 text-sm">Add details, photos, and pricing</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-terracotta text-white p-2 rounded-full mr-4">
                  <span>3</span>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Start selling</h3>
                  <p className="text-white/80 text-sm">Reach customers and grow your business</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10 bg-cream">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="font-playfair text-3xl text-charcoal mb-2">Seller Login</h2>
            <p className="text-earth">Access your seller dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-earth mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-sand bg-white focus:outline-none focus:ring-1 focus:ring-terracotta"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-earth mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-sand bg-white focus:outline-none focus:ring-1 focus:ring-terracotta"
                  placeholder="•••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-earth"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <a href="#" className="text-sm text-earth hover:text-terracotta">
                Forgot your password?
              </a>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-terracotta hover:bg-umber text-white transition-colors flex items-center justify-center disabled:bg-earth/50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center">
                  <LogIn size={18} className="mr-2" />
                  Sign In
                </span>
              )}
            </button>
          </form>
          
          <div className="mt-6">
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full py-3 border border-terracotta text-terracotta hover:bg-terracotta hover:text-white transition-colors flex items-center justify-center disabled:border-earth/50 disabled:text-earth/50 disabled:cursor-not-allowed"
            >
              Try Demo Account
            </button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-earth">
              Don't have a seller account?{' '}
              <Link to="/seller/register" className="text-terracotta hover:text-umber">
                Register now
              </Link>
            </p>
          </div>
          
          <div className="mt-6 text-center">
            <Link to="/buyer/login" className="text-earth hover:text-terracotta text-sm">
              Login as Buyer Instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;
