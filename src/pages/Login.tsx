
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the unified login page
    navigate('/login', { replace: true });
  }, [navigate]);
  
  return null; // This component just redirects
};

export default Login;
