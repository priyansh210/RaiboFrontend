
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
  terms: z.boolean().refine(val => val === true, { message: "You must accept the terms and conditions" }),
  company_name: z.string().min(2, { message: "Company name must be at least 2 characters" }),
  tax_id: z.string().min(2, { message: "Tax ID must be at least 2 characters" }),
});

const SellerRegister = () => {
  const { register, googleLogin, isAuthenticated, isLoading, roles } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      terms: false,
      company_name: "",
      tax_id: "",
    },
  });

  useEffect(() => {
    // If already authenticated and has seller role, redirect to seller dashboard
    if (isAuthenticated && roles.includes('seller')) {
      navigate('/seller/dashboard', { replace: true });
    }
    // If authenticated but is only a buyer, show error message
    else if (isAuthenticated && !roles.includes('seller')) {
      setError('You are already registered as a buyer. Please contact support to become a seller.');
    }
  }, [isAuthenticated, roles, navigate]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError('');
    
    try {
      await register(
        values.first_name,
        values.last_name,
        values.email,
        values.password,
        'seller'
      );
      
      // Update the profile with seller-specific information
      navigate('/seller/dashboard', { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Failed to create account. Please try again.');
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  // Handle Google login for seller
  const handleGoogleLogin = async () => {
    try {
      // Store the fact that this was a seller signup in local storage
      // This will be used in the callback to assign seller role
      localStorage.setItem('sellerSignup', 'true');
      await googleLogin();
    } catch (err) {
      setError((err as Error).message || 'Failed to sign up with Google. Please try again.');
    }
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
        <div className="container-custom max-w-md">
          <div className="bg-white p-8 rounded-sm shadow-sm animate-fade-in">
            <h1 className="font-playfair text-2xl text-center text-charcoal mb-6">Become a Seller</h1>
            
            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-sm flex items-center">
                <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                
                <FormField
                  control={form.control}
                  name="company_name"
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
                
                <FormField
                  control={form.control}
                  name="tax_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-earth">Tax ID / Business Registration Number</FormLabel>
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
                          I agree to the <Link to="/terms" className="text-terracotta hover:underline">Terms and Conditions</Link>, <Link to="/privacy" className="text-terracotta hover:underline">Privacy Policy</Link>, and <Link to="/seller-agreement" className="text-terracotta hover:underline">Seller Agreement</Link>.
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-terracotta hover:bg-umber text-white py-2 transition-colors disabled:bg-taupe"
                >
                  {isLoading ? 'Creating account...' : 'Create Seller Account'}
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
                  onClick={handleGoogleLogin}
                  className="w-full py-2 border border-gray-300 flex justify-center items-center space-x-2 hover:bg-gray-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 186.69 190.5">
                    <g transform="translate(1184.583 765.171)">
                      <path d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z" fill="#4285f4"/>
                      <path d="M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z" fill="#34a853"/>
                      <path d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.693-24.592 31.693-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z" fill="#fbbc05"/>
                      <path d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.692 24.592c7.533-22.514 28.575-39.226 53.34-39.226z" fill="#ea4335"/>
                    </g>
                  </svg>
                  <span>Sign up with Google</span>
                </button>
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm text-earth">
              Already have a seller account?{' '}
              <Link to="/seller/login" className="text-terracotta hover:underline">
                Sign in
              </Link>
            </div>

            <div className="mt-4 text-center text-sm text-earth">
              Want to shop on RAIBO?{' '}
              <Link to="/buyer/register" className="text-terracotta hover:underline">
                Register as a buyer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SellerRegister;
