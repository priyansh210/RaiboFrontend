import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
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
  mobile_number: z
    .string()
    .regex(/^\d{10}$/, { message: "Mobile number must be 10 digits" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirm_password: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
  company_name: z.string().min(2, { message: "Company name must be at least 2 characters" }),
  tax_id: z.string().min(2, { message: "Tax ID must be at least 2 characters" }),
}).superRefine((values, ctx) => {
  if (values.confirm_password !== values.password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['confirm_password'],
      message: "Passwords do not match",
    });
  }
});


const SellerRegister = () => {
  const { register, isAuthenticated, isLoading, roles } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      mobile_number: "",
      password: "",
      confirm_password: "",
      terms: false,
      company_name: "",
      tax_id: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated && roles.includes('seller')) {
      navigate('/seller/dashboard', { replace: true });
    } else if (isAuthenticated && !roles.includes('seller')) {
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
        values.mobile_number, // Pass mobile number
        values.password,
        values.company_name,
        values.tax_id
      );
      
      toast({
        title: "Registration Successful",
        description: "Your seller account has been created successfully.",
        duration: 3000,
      });
      
      navigate('/seller/dashboard', { replace: true });
    } catch (err) {
      setError((err as Error).message || 'Failed to create account. Please try again.');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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
                          <Input {...field} className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50" />
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
                          <Input {...field} className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="mobile_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-earth">Mobile Number</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="tel" 
                          placeholder="Enter your 10-digit mobile number"
                          className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-earth">Business Name</FormLabel>
                      <FormControl>
                        <Input {...field} className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50" />
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
                        <Input {...field} className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50" />
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
                      <FormLabel className="text-sm text-earth">Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50" />
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SellerRegister;