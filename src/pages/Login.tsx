
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Get the redirect URL from the location state or default to home
  const from = (location.state as any)?.from || '/';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Failed to log in. Please try again.');
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  // Demo login
  const handleDemoLogin = async () => {
    setEmail('user@example.com');
    setPassword('password');
    
    try {
      await login('user@example.com', 'password');
      toast({
        title: "Demo Login Successful",
        description: "You've been logged in with demo credentials.",
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Failed to log in. Please try again.');
    }
  };
  
  return (
    <Layout>
      <div className="page-transition min-h-screen bg-cream py-10">
        <div className="container-custom max-w-md">
          <div className="bg-white p-8 rounded-sm shadow-sm animate-fade-in">
            <h1 className="font-playfair text-2xl text-center text-charcoal mb-6">Sign In</h1>
            
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
                    onClick={toggleShowPassword}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-earth"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <label className="flex items-center text-sm text-earth">
                  <input type="checkbox" className="mr-2" />
                  <span>Remember me</span>
                </label>
                
                <Link to="/forgot-password" className="text-sm text-terracotta hover:underline">
                  Forgot password?
                </Link>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-terracotta hover:bg-umber text-white py-2 transition-colors disabled:bg-taupe"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            
            <div className="mt-6">
              <div className="relative flex items-center justify-center">
                <div className="border-t border-taupe/20 absolute w-full"></div>
                <span className="bg-white px-2 text-sm text-earth relative">
                  Or continue with
                </span>
              </div>
              
              <div className="mt-4">
                <button
                  onClick={handleDemoLogin}
                  className="w-full py-2 border border-charcoal text-charcoal hover:bg-linen transition-colors"
                >
                  Demo Account
                </button>
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm text-earth">
              Don't have an account?{' '}
              <Link to="/register" className="text-terracotta hover:underline">
                Create one
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
