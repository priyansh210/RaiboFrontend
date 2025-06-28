import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { toast } from '@/hooks/use-toast';
import LoginForm from '../components/auth/LoginForm';
import { googleAuthService } from '../services/GoogleAuthService';
import { useTheme } from '@/context/ThemeContext';
import { Card, CardContent } from '@/components/ui/card';

const Login = () => {
  const { login, googleLogin, isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();
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
    
    try {
      await login(email, password);
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
      await googleLogin();
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error('Google login error:', err);
      toast({
        title: "Login failed",
        description: "Failed to login with Google. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Layout>
      <div className="min-h-screen bg-background py-10">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="border border-border shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <h1 className="font-playfair text-2xl text-center font-semibold text-foreground mb-6">Sign In</h1>
              
              <LoginForm
                onSubmit={handleLogin}
                onGoogleLogin={handleGoogleLogin}
                isLoading={isLoading}
                error={error}
              />
              
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/buyer/register" className="text-primary hover:underline font-medium">
                  Register
                </Link>
              </div>
              
              {/* Remove seller references as this is now buyer-focused */}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
