
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import { toast } from '@/hooks/use-toast';
import LoginForm from '../../components/auth/LoginForm';
import { googleAuthService } from '../../services/GoogleAuthService';
import { STORAGE_KEYS } from '../../api/config';

const Login = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.redirect || '/';
  
  const [error, setError] = useState('');
  
  // If already logged in, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  // Initialize Google Auth
  useEffect(() => {
    googleAuthService.initializeGoogleAuth().catch(console.error);
  }, []);
  
  const handleLogin = async (email: string, password: string) => {
    setError('');
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    console.log('Attempting login with:', { email, backendUrl: 'http://ec2-15-207-55-211.ap-south-1.compute.amazonaws.com:3000' });
    
    try {
      await login(email, password);
      console.log('Login successful');
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError((err as Error).message || 'Failed to login. Please check your credentials and try again.');
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      console.log('Attempting Google login');
      const authData = await googleAuthService.signInWithGoogle();
      
      // Store the auth data returned from backend
      if (authData.access_token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authData.access_token);
      }
      
      if (authData.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authData.user));
      }
      
      toast({
        title: "Google login successful",
        description: "Welcome to RAIBO!",
      });
      
      // Refresh the page to update auth context
      window.location.href = redirectPath;
    } catch (err) {
      console.error('Google login error:', err);
      setError((err as Error).message || 'Failed to login with Google. Please try again.');
    }
  };
  
  return (
    <Layout>
      <div className="min-h-screen bg-cream py-10">
        <div className="container-custom max-w-md">
          <div className="bg-white p-8 rounded-sm shadow-sm">
            <h1 className="font-playfair text-2xl text-center text-charcoal mb-6">Sign In</h1>
            
            <LoginForm
              onSubmit={handleLogin}
              onGoogleLogin={handleGoogleLogin}
              isLoading={isLoading}
              error={error}
            />
            
            <div className="mt-6 text-center text-sm text-earth">
              Don't have an account?{' '}
              <Link to="/buyer/register" className="text-terracotta hover:underline">
                Register
              </Link>
            </div>
            
            <div className="mt-4 text-center text-xs text-earth">
              Are you a seller?{' '}
              <Link to="/seller/login" className="text-terracotta hover:underline">
                Sign in as Seller
              </Link>
              {' '}or{' '}
              <Link to="/seller/register" className="text-terracotta hover:underline">
                Register as Seller
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
