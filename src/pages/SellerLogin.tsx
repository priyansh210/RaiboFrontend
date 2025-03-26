
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const SellerLogin = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/seller/dashboard');
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      
      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Login failed",
          description: error.message || "Please check your credentials and try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Check if the user has a seller role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id);
        
      if (roleError) {
        console.error('Role check error:', roleError);
        toast({
          title: "Login failed",
          description: "Error checking permissions.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
        
      const roles = roleData?.map(r => r.role) || [];
      
      if (!roles.includes('seller')) {
        toast({
          title: "Access denied",
          description: "This account doesn't have seller permissions.",
          variant: "destructive",
        });
        
        // Sign out the user since they don't have seller permissions
        await supabase.auth.signOut();
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
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
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
      
      // Check if the login was successful and the user has a seller role
      const { data } = await supabase.auth.getSession();
      
      if (data?.session?.user) {
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.session.user.id);
          
        if (roleError) {
          console.error('Role check error:', roleError);
          toast({
            title: "Demo login failed",
            description: "Error checking permissions.",
            variant: "destructive",
          });
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }
          
        const roles = roleData?.map(r => r.role) || [];
        
        if (!roles.includes('seller')) {
          toast({
            title: "Access denied",
            description: "The demo account doesn't have seller permissions. Please contact support.",
            variant: "destructive",
          });
          
          // Sign out the user since they don't have seller permissions
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }
        
        toast({
          title: "Demo login successful",
          description: "Welcome to the seller dashboard!",
        });
        
        navigate('/seller/dashboard');
      } else {
        toast({
          title: "Demo login failed",
          description: "Could not authenticate with demo credentials.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Demo login error:', err);
      toast({
        title: "Demo login failed",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-cream py-16 px-4 flex items-center justify-center">
      <div className="bg-white p-8 rounded-sm shadow-sm max-w-md w-full">
        <div className="mb-6 text-center">
          <h1 className="font-playfair text-2xl text-charcoal mb-2">Seller Login</h1>
          <p className="text-earth text-sm">Sign in to access your seller dashboard</p>
        </div>
        
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
                type="password"
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
