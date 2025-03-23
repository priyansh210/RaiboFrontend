
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from '../integrations/supabase/client';

const formSchema = z.object({
  first_name: z.string().min(2, { message: "First name must be at least 2 characters" }),
  last_name: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirm_password: z.string(),
  business_name: z.string().min(2, { message: "Business name must be at least 2 characters" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  terms: z.boolean().refine(val => val === true, { message: "You must accept the terms and conditions" })
}).refine(data => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"]
});

const SellerRegister = () => {
  const { register: authRegister, isAuthenticated, isLoading, roles } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      business_name: "",
      phone: "",
      terms: false
    },
  });

  useEffect(() => {
    // If already authenticated and has seller role, redirect to seller dashboard
    if (isAuthenticated && roles.includes('seller')) {
      navigate('/seller/dashboard', { replace: true });
    }
    // If authenticated and is a buyer, redirect to home
    else if (isAuthenticated && roles.includes('buyer')) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, roles, navigate]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError('');
    setIsSubmitting(true);
    
    try {
      // Register the user through auth
      await authRegister(
        values.first_name,
        values.last_name,
        values.email,
        values.password,
        'buyer' // Initially register as buyer
      );
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Failed to create account");
      
      // Update user's profile with business info
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          phone: values.phone
        })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Add seller role to the user
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: 'seller'
        });
        
      if (roleError) throw roleError;
      
      toast({
        title: "Seller Registration Successful",
        description: "Your seller account has been created. You can now access your dashboard.",
      });
      
      // Redirect to the seller dashboard
      navigate('/seller/dashboard', { replace: true });
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  // Password strength indicators
  const password = form.watch('password');
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const passwordStrength = 
    hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
      ? 'Strong'
      : hasMinLength && (hasUpperCase || hasLowerCase) && (hasNumber || hasSpecialChar)
        ? 'Medium'
        : password.length > 0
          ? 'Weak'
          : '';
  
  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'Strong': return 'text-green-600';
      case 'Medium': return 'text-orange-500';
      case 'Weak': return 'text-red-600';
      default: return '';
    }
  };
  
  return (
    <Layout>
      <div className="page-transition min-h-screen bg-cream py-10">
        <div className="container-custom max-w-lg">
          <div className="bg-white p-8 rounded-sm shadow-sm animate-fade-in">
            <h1 className="font-playfair text-2xl text-center text-charcoal mb-6">Apply to become a Seller</h1>
            
            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-sm flex items-center">
                <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="bg-linen/30 p-4 rounded-sm">
                  <h2 className="font-medium text-charcoal mb-4">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-earth">First Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-earth">Last Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-earth">Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="tel" 
                              className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="bg-linen/30 p-4 rounded-sm">
                  <h2 className="font-medium text-charcoal mb-4">Business Information</h2>
                  
                  <FormField
                    control={form.control}
                    name="business_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-earth">Business Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="bg-linen/30 p-4 rounded-sm">
                  <h2 className="font-medium text-charcoal mb-4">Account Security</h2>
                  
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
                        
                        {password && (
                          <div className="mt-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-earth">Password strength:</span>
                              <span className={`text-xs font-medium ${getPasswordStrengthColor()}`}>
                                {passwordStrength}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center text-xs">
                                <span className={`mr-1 ${hasMinLength ? 'text-green-600' : 'text-earth'}`}>
                                  {hasMinLength ? <Check size={12} /> : '•'}
                                </span>
                                <span className={hasMinLength ? 'text-green-600' : 'text-earth'}>
                                  At least 8 characters
                                </span>
                              </div>
                              <div className="flex items-center text-xs">
                                <span className={`mr-1 ${hasUpperCase && hasLowerCase ? 'text-green-600' : 'text-earth'}`}>
                                  {hasUpperCase && hasLowerCase ? <Check size={12} /> : '•'}
                                </span>
                                <span className={hasUpperCase && hasLowerCase ? 'text-green-600' : 'text-earth'}>
                                  Upper and lowercase letters
                                </span>
                              </div>
                              <div className="flex items-center text-xs">
                                <span className={`mr-1 ${hasNumber ? 'text-green-600' : 'text-earth'}`}>
                                  {hasNumber ? <Check size={12} /> : '•'}
                                </span>
                                <span className={hasNumber ? 'text-green-600' : 'text-earth'}>
                                  At least one number
                                </span>
                              </div>
                              <div className="flex items-center text-xs">
                                <span className={`mr-1 ${hasSpecialChar ? 'text-green-600' : 'text-earth'}`}>
                                  {hasSpecialChar ? <Check size={12} /> : '•'}
                                </span>
                                <span className={hasSpecialChar ? 'text-green-600' : 'text-earth'}>
                                  At least one special character
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="confirm_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-earth">Confirm Password</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type={showPassword ? 'text' : 'password'} 
                              className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-start">
                        <FormControl>
                          <input
                            type="checkbox"
                            className="mt-1 mr-2"
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm text-earth">
                          I agree to the <Link to="/terms" className="text-terracotta hover:underline">Terms and Conditions</Link>, <Link to="/privacy" className="text-terracotta hover:underline">Privacy Policy</Link>, and <Link to="/seller-terms" className="text-terracotta hover:underline">Seller Terms</Link>.
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="w-full bg-terracotta hover:bg-umber text-white py-2 transition-colors disabled:bg-taupe"
                >
                  {isLoading || isSubmitting ? 'Creating account...' : 'Apply to Become a Seller'}
                </button>
              </form>
            </Form>
            
            <div className="mt-6 text-center text-sm text-earth">
              Already have a seller account?{' '}
              <Link to="/seller/login" className="text-terracotta hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SellerRegister;
