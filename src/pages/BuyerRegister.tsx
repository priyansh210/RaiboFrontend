import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BuyerRegister = () => {
  const { register, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  
  const countryCodes = [
    { code: '+1', name: 'US/Canada' },
    { code: '+91', name: 'India' },
    { code: '+44', name: 'UK' },
    { code: '+86', name: 'China' },
    { code: '+49', name: 'Germany' },
    { code: '+33', name: 'France' },
    { code: '+81', name: 'Japan' },
    { code: '+61', name: 'Australia' }
  ];
  
  // If already logged in, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  const validateForm = () => {
    if (!firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword) {
      setError('All fields are required');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    if (!agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    try {
      const fullPhone = `${countryCode}${phoneNumber}`;
      await register(firstName, lastName, email, fullPhone);
      navigate('/', { replace: true });
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
            <h1 className="font-playfair text-2xl text-center text-charcoal mb-6">Create Your RAIBO Account</h1>
            
            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-sm flex items-center">
                <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm text-earth mb-1">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm text-earth mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                    required
                  />
                </div>
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
                <label className="block text-sm text-earth mb-1">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-32 py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-taupe/30 shadow-lg">
                      {countryCodes.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.code} {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                    className="flex-1 py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                    required
                  />
                </div>
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
                  className="w-full py-2 px-3 border border-taupe/30 focus:outline-none focus:border-terracotta/50"
                  required
                />
              </div>
              
              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 mr-2"
                />
                <label htmlFor="terms" className="text-sm text-earth">
                  I agree to the <Link to="/terms" className="text-terracotta hover:underline">Terms and Conditions</Link> and <Link to="/privacy" className="text-terracotta hover:underline">Privacy Policy</Link>
                </label>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-terracotta hover:bg-umber text-white py-2 transition-colors disabled:bg-taupe"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm text-earth">
              Already have an account?{' '}
              <Link to="/buyer/login" className="text-terracotta hover:underline">
                Sign in
              </Link>
            </div>
            
            <div className="mt-4 text-center text-sm text-earth">
              Are you a seller?{' '}
              <Link to="/seller/register" className="text-terracotta hover:underline">
                Register as a seller
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BuyerRegister;
