
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Register = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await register(name, email, password);
      toast({
        title: "Welcome to RAIBO!",
        description: "Your account has been created successfully.",
      });
      navigate('/');
    } catch (err) {
      setError((err as Error).message || 'Failed to create account. Please try again.');
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  // Password strength indicators
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
            <h1 className="font-playfair text-2xl text-center text-charcoal mb-6">Create Account</h1>
            
            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-sm flex items-center">
                <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm text-earth mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                  required
                />
              </div>
              
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
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm text-earth mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full py-2 px-3 border focus:outline-none focus:border-terracotta/50 ${
                    confirmPassword && password !== confirmPassword 
                      ? 'border-red-500' 
                      : 'border-taupe/30'
                  }`}
                  required
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                )}
              </div>
              
              <div>
                <label className="flex items-start text-sm text-earth">
                  <input type="checkbox" className="mt-1 mr-2" required />
                  <span>
                    I agree to the <Link to="/terms" className="text-terracotta hover:underline">Terms and Conditions</Link> and <Link to="/privacy" className="text-terracotta hover:underline">Privacy Policy</Link>.
                  </span>
                </label>
              </div>
              
              <button
                type="submit"
                disabled={isLoading || (confirmPassword && password !== confirmPassword)}
                className="w-full bg-terracotta hover:bg-umber text-white py-2 transition-colors disabled:bg-taupe"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm text-earth">
              Already have an account?{' '}
              <Link to="/login" className="text-terracotta hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
