
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Since we're using a mock API without auth flow, 
    // we can just redirect to the home page
    toast({
      title: "Sign in successful",
      description: "You've been successfully signed in",
    });
    
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta mb-4"></div>
        <h2 className="text-xl text-charcoal">Authenticating...</h2>
      </div>
    </div>
  );
};

export default AuthCallback;
