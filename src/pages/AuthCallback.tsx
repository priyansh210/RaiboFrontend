
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Extract hash parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        if (hashParams.get('error')) {
          throw new Error(hashParams.get('error_description') || 'Authentication error');
        }
        
        // Get the session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (data?.session) {
          // Get the user roles to determine where to redirect
          const { data: rolesData, error: rolesError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', data.session.user.id);
            
          if (rolesError) {
            console.error('Error fetching user roles:', rolesError);
            toast({
              title: "Error fetching user roles",
              description: "We couldn't determine your account type. Please contact support.",
              variant: "destructive",
            });
            navigate('/buyer/login', { replace: true });
            return;
          }
          
          const roles = rolesData?.map(r => r.role) || [];
          
          // Redirect based on role
          if (roles.includes('seller')) {
            navigate('/seller/dashboard', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
          
          toast({
            title: "Successfully signed in",
            description: "Welcome back!",
          });
        } else {
          navigate('/buyer/login', { replace: true });
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast({
          title: "Authentication failed",
          description: (error as Error).message || 'Failed to complete authentication. Please try again.',
          variant: "destructive",
        });
        navigate('/buyer/login', { replace: true });
      }
    };
    
    handleAuthCallback();
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-terracotta mb-4"></div>
        <h2 className="text-xl text-charcoal">Completing authentication...</h2>
      </div>
    </div>
  );
};

export default AuthCallback;
