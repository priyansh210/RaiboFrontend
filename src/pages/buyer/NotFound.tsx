
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

const NotFound = () => {
  const location = useLocation();
  const { theme } = useTheme();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.background }}>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4" style={{ color: theme.foreground }}>404</h1>
        <p className="text-xl mb-4" style={{ color: theme.mutedForeground }}>Oops! Page not found</p>
        <a href="/" className="underline" style={{ color: theme.primary }}>
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
