
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTheme } from '@/context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.background, color: theme.foreground }}>
      <Navbar />
      <main className="flex-grow pt-20 md:pt-28">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
