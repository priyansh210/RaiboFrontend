
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from '../integrations/supabase/client';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const SellerLogin = () => {
  const { login, isAuthenticated, isLoading, roles, refreshUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Get the redirect URL from the location state or default to seller dashboard
  const from = (location.state as any)?.from || '/seller/dashboard';
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    // If already authenticated and has seller role, redirect to seller dashboard
    if (isAuthenticated && roles.includes('seller')) {
      navigate('/seller/dashboard', { replace: true });
    }
    // If authenticated but isn't a seller, show error message
    else if (isAuthenticated && !roles.includes('seller')) {
      setError('Your account does not have seller permissions.');
    }
  }, [isAuthenticated, roles, navigate]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError('');
    
    try {
      await login(values.email, values.password);
      // The redirect will happen in useEffect when auth state changes
    } catch (err) {
      setError((err as Error).message || 'Failed to log in. Please try again.');
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  // Demo login
  const handleDemoLogin = async () => {
    const demoEmail = "seller@example.com";
    const demoPassword = "password123";
    
    try {
      // Check if demo seller account exists
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('*')
        .eq('role', 'seller');
      
      if (!userRoles || userRoles.length === 0) {
        // If no seller exists, create one
        toast({
          title: "Creating demo seller account",
          description: "This will take a moment...",
        });
        
        // Register new seller account
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: demoEmail,
          password: demoPassword,
          options: {
            data: {
              first_name: "Demo",
              last_name: "Seller",
            }
          }
        });
        
        if (signUpError) throw signUpError;
        
        // If demo user created, assign seller role
        if (data.user) {
          // Insert into user_roles
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: data.user.id,
              role: 'seller'
            });
            
          if (roleError) throw roleError;
          
          // Log in with the new account
          await login(demoEmail, demoPassword);
          
          // Wait for auth state to update
          setTimeout(async () => {
            await refreshUserProfile();
            navigate('/seller/dashboard', { replace: true });
          }, 1500);
          
          toast({
            title: "Demo Seller Account Created",
            description: "You've been logged in with demo seller credentials.",
          });
        }
      } else {
        // If seller exists, just log in
        form.setValue("email", demoEmail);
        form.setValue("password", demoPassword);
        
        await login(demoEmail, demoPassword);
        toast({
          title: "Demo Login Successful",
          description: "You've been logged in with demo seller credentials.",
        });
      }
    } catch (err) {
      console.error(err);
      setError((err as Error).message || 'Failed to log in with demo account. Please try again.');
    }
  };
  
  return (
    <Layout>
      <div className="page-transition min-h-screen bg-cream py-10">
        <div className="container-custom max-w-md">
          <div className="bg-white p-8 rounded-sm shadow-sm animate-fade-in">
            <h1 className="font-playfair text-2xl text-center text-charcoal mb-6">Seller Sign In</h1>
            
            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-sm flex items-center">
                <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-earth">Email address</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email" 
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-earth">Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            {...field} 
                            type={showPassword ? 'text' : 'password'} 
                            className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50" 
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={toggleShowPassword}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-earth"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
            </Form>
            
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
                  Demo Seller Account
                </button>
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm text-earth">
              Don't have a seller account?{' '}
              <Link to="/seller/register" className="text-terracotta hover:underline">
                Apply to become a seller
              </Link>
            </div>

            <div className="mt-4 text-center text-sm text-earth">
              Are you a buyer?{' '}
              <Link to="/buyer/login" className="text-terracotta hover:underline">
                Login as Buyer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SellerLogin;
