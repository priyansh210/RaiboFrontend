
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Heart, Search, Menu, X, Grid3X3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const BuyerNavbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const buyerMenuItems = [
    { label: 'My Account', path: '/account' },
    { label: 'Order History', path: '/orders' },
    { label: 'Wishlist', path: '/wishlist' },
    { label: 'Addresses', path: '/addresses' },
    { label: 'Payment Methods', path: '/payment-methods' },
    { label: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="bg-white dark:bg-charcoal shadow-sm border-b border-sand dark:border-gray-700 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-playfair text-2xl text-foreground">
            RAIBO
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/browse/all" className="text-muted-foreground hover:text-foreground transition-colors">
              All Products
            </Link>
            <Link to="/browse/living-room" className="text-muted-foreground hover:text-foreground transition-colors">
              Living Room
            </Link>
            <Link to="/browse/bedroom" className="text-muted-foreground hover:text-foreground transition-colors">
              Bedroom
            </Link>
            <Link to="/browse/dining" className="text-muted-foreground hover:text-foreground transition-colors">
              Dining
            </Link>
            <Link to="/browse/office" className="text-muted-foreground hover:text-foreground transition-colors">
              Office
            </Link>
            <Link to="/raiboards" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Grid3X3 size={16} />
              RaiBoards
            </Link>
            <Link to="/search" className="text-muted-foreground hover:text-foreground transition-colors">
              <Search size={20} />
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link to="/wishlist" className="text-muted-foreground hover:text-foreground transition-colors">
              <Heart size={20} />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative text-muted-foreground hover:text-foreground transition-colors">
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs h-5 w-5 flex items-center justify-center rounded-full"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Link>

            {/* User Account */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <User size={20} className="mr-2" />
                    <span className="hidden sm:inline">
                      {user?.firstName || 'Account'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 z-50">
                  <DropdownMenuLabel>
                    Hello, {user?.firstName || 'Buyer'}!
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {buyerMenuItems.map((item, index) => (
                    <DropdownMenuItem key={index} asChild>
                      <Link to={item.path} className="cursor-pointer">
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-sand dark:border-gray-700 bg-white dark:bg-charcoal py-4">
            <div className="space-y-2">
              <Link 
                to="/browse/all" 
                className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Products
              </Link>
              <Link 
                to="/browse/living-room" 
                className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Living Room
              </Link>
              <Link 
                to="/browse/bedroom" 
                className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Bedroom
              </Link>
              <Link 
                to="/browse/dining" 
                className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dining
              </Link>
              <Link 
                to="/browse/office" 
                className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Office
              </Link>
              <Link 
                to="/raiboards" 
                className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                RaiBoards
              </Link>
              <Link 
                to="/search" 
                className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Search
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default BuyerNavbar;
