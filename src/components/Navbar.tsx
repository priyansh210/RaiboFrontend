import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, ChevronDown, LogOut, Package, CreditCard, Truck, BarChart3, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { isAuthenticated, user, logout, isSeller, isGuest } = useAuth();
  const isMobile = useIsMobile();

  // Get user initials for avatar
  const getUserInitials = (): string => {
    if (!user) return '';
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    
    const firstInitial = firstName.charAt(0);
    const lastInitial = lastName.charAt(0);
    
    return (firstInitial + lastInitial).toUpperCase();
  };

  const categories = [
    { name: 'FURNITURE', path: '/browse/furniture' },
    { name: 'OUTDOOR', path: '/browse/outdoor' },
    { name: 'BEDDING & BATH', path: '/browse/bedding-bath' },
    { name: 'RUGS', path: '/browse/rugs' },
    { name: 'DECOR & PILLOWS', path: '/browse/decor' },
    { name: 'LIGHTING', path: '/browse/lighting' },
    { name: 'ORGANIZATION', path: '/browse/organization' },
    { name: 'KITCHEN', path: '/browse/kitchen' },
    { name: 'HOME IMPROVEMENT', path: '/browse/home-improvement' },
    { name: 'SHOP BY ROOMS', path: '/browse/rooms' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "There was an issue logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (isSeller) {
        // For sellers, search could be for their products/orders
        console.log('Seller search:', searchQuery);
      } else {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        
        // Show different message for guests vs authenticated users
        if (isGuest) {
          toast({
            title: "Search results",
            description: "Sign in to save your search history and get personalized recommendations.",
            action: (
              <ToastAction 
                altText="Sign In" 
                onClick={() => navigate('/login')}
              >
                Sign In
              </ToastAction>
            ),
          });
        }
      }
    }
  };

  const redirectToAccountPage = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (isSeller) {
      navigate('/seller/dashboard');
    } else {
      navigate('/account');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-terracotta'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className={`font-playfair text-2xl md:text-3xl font-bold tracking-wider ${
              isScrolled ? 'text-terracotta' : 'text-white'
            } transition-colors`}
          >
            RAIBO
          </Link>

          {/* Search Bar for desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex relative flex-grow max-w-md mx-4">
            <input
              type="text"
              placeholder={isSeller ? "Search products, orders..." : "Search for furniture..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-md border-none pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-terracotta/50 ${
                isScrolled ? 'bg-white text-charcoal placeholder-gray-500' : 'bg-terracotta/90 text-white placeholder-white/80'
              }`}
            />
            <button 
              type="submit"
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-terracotta transition-colors ${
                isScrolled ? 'text-gray-500' : 'text-white/80'
              }`}
            >
              <Search size={18} />
            </button>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Seller Navigation */}
            {isSeller ? (
              <>
                <Link 
                  to="/seller/dashboard" 
                  className={`flex items-center space-x-1 ${isScrolled ? 'text-charcoal' : 'text-white'} hover:text-terracotta/80 transition-colors`}
                >
                  <BarChart3 size={16} />
                  <span>Dashboard</span>
                </Link>
                
                <Link 
                  to="/seller/products" 
                  className={`flex items-center space-x-1 ${isScrolled ? 'text-charcoal' : 'text-white'} hover:text-terracotta/80 transition-colors`}
                >
                  <Package size={16} />
                  <span>Products</span>
                </Link>
                
                <Link 
                  to="/seller/payments" 
                  className={`flex items-center space-x-1 ${isScrolled ? 'text-charcoal' : 'text-white'} hover:text-terracotta/80 transition-colors`}
                >
                  <CreditCard size={16} />
                  <span>Payments</span>
                </Link>
                
                <Link 
                  to="/seller/logistics" 
                  className={`flex items-center space-x-1 ${isScrolled ? 'text-charcoal' : 'text-white'} hover:text-terracotta/80 transition-colors`}
                >
                  <Truck size={16} />
                  <span>Logistics</span>
                </Link>
              </>
            ) : (
              <Link 
                to="/for-you" 
                className={`${isScrolled ? 'text-charcoal' : 'text-white'} hover:text-terracotta/80 transition-colors`}
                onClick={(e) => {
                  if (isGuest) {
                    e.preventDefault();
                    toast({
                      title: "Sign in for personalized recommendations",
                      description: "Create an account to get recommendations tailored just for you.",
                      action: (
                        <ToastAction 
                          altText="Sign In" 
                          onClick={() => navigate('/login')}
                        >
                          Sign In
                        </ToastAction>
                      ),
                    });
                  }
                }}
              >
                For You
              </Link>
            )}
            
            {/* Account Dropdown with Avatar for authenticated users */}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                {isAuthenticated ? (
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback className="bg-terracotta text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <button 
                    className={`flex items-center ${isScrolled ? 'text-charcoal' : 'text-white'} hover:text-terracotta/80 transition-colors`}
                  >
                    <User size={16} className="mr-1" />
                    Account <ChevronDown size={16} className="ml-1" />
                  </button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 mt-1 z-50 bg-white">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem className="cursor-default font-medium">
                      {user?.firstName || ''} {user?.lastName || ''}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {isSeller ? (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/seller/dashboard" className="cursor-pointer w-full">Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/seller/products" className="cursor-pointer w-full">Products</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/seller/payments" className="cursor-pointer w-full">Payments</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to="/seller/logistics" className="cursor-pointer w-full">Logistics</Link>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem asChild>
                        <Link to="/account" className="cursor-pointer w-full">My Account</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="cursor-pointer w-full">Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/wishlist" className="cursor-pointer w-full">Wishlist</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login" className="cursor-pointer w-full">Sign In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/buyer/register" className="cursor-pointer w-full">Register</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <div className="text-sm text-gray-500 px-2 py-1">
                        <div className="text-xs text-gray-400 mb-1">Selling on RAIBO?</div>
                        <div className="flex flex-col space-y-1">
                          <Link to="/seller/login" className="text-terracotta hover:underline text-xs">
                            Seller Login
                          </Link>
                          <Link to="/seller/register" className="text-terracotta hover:underline text-xs">
                            Seller Register
                          </Link>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Cart Icon - show for everyone but with different behavior */}
            {!isSeller && (
              <Link 
                to="/cart" 
                className={`${isScrolled ? 'text-charcoal' : 'text-white'} hover:text-terracotta/80 transition-colors relative`}
                onClick={(e) => {
                  if (isGuest && cartItems.length === 0) {
                    e.preventDefault();
                    toast({
                      title: "Your cart is empty",
                      description: "Browse our products to add items to your cart.",
                    });
                  }
                }}
              >
                <ShoppingCart size={20} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-umber text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {!isSeller && (
              <Link 
                to="/cart" 
                className={`${isScrolled ? 'text-charcoal' : 'text-white'} hover:text-terracotta/80 transition-colors relative mr-4`}
              >
                <ShoppingCart size={20} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-umber text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            )}
            <button 
              className="text-white p-1"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X size={24} color={isScrolled ? '#373737' : 'white'} />
              ) : (
                <Menu size={24} color={isScrolled ? '#373737' : 'white'} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Categories Navigation for desktop - only show for non-sellers */}
      {!isSeller && (
        <nav className={`bg-linen hidden lg:block border-t border-taupe/20 transition-all ${isScrolled ? 'py-2' : 'py-3'}`}>
          <div className="container-custom">
            <ul className="flex items-center justify-center space-x-8">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link 
                    to={category.path} 
                    className="text-charcoal text-xs hover:text-terracotta transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}

      {/* Mobile Menu */}
      <div 
        className={`md:hidden fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="pt-20 px-6 pb-6 h-full overflow-y-auto">
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder={isSeller ? "Search products, orders..." : "Search for furniture..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-terracotta/50"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-terracotta"
              >
                <Search size={18} />
              </button>
            </div>
          </form>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500">Account</h3>
              <ul className="space-y-3">
                {isAuthenticated ? (
                  <>
                    <li className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-terracotta text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-charcoal">{user?.firstName} {user?.lastName}</span>
                    </li>
                    {isSeller ? (
                      <>
                        <li>
                          <Link to="/seller/dashboard" className="text-charcoal hover:text-terracotta flex items-center">
                            <BarChart3 size={16} className="mr-2" />
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link to="/seller/products" className="text-charcoal hover:text-terracotta flex items-center">
                            <Package size={16} className="mr-2" />
                            Products
                          </Link>
                        </li>
                        <li>
                          <Link to="/seller/payments" className="text-charcoal hover:text-terracotta flex items-center">
                            <CreditCard size={16} className="mr-2" />
                            Payments
                          </Link>
                        </li>
                        <li>
                          <Link to="/seller/logistics" className="text-charcoal hover:text-terracotta flex items-center">
                            <Truck size={16} className="mr-2" />
                            Logistics
                          </Link>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link to="/account" className="text-charcoal hover:text-terracotta">
                            My Account
                          </Link>
                        </li>
                        <li>
                          <Link to="/for-you" className="text-charcoal hover:text-terracotta">
                            For You
                          </Link>
                        </li>
                      </>
                    )}
                    <li>
                      <button 
                        onClick={handleLogout}
                        className="text-charcoal hover:text-terracotta flex items-center"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login" className="text-charcoal hover:text-terracotta">
                        Sign In
                      </Link>
                    </li>
                    <li>
                      <Link to="/buyer/register" className="text-charcoal hover:text-terracotta">
                        Register
                      </Link>
                    </li>
                    <li className="border-t pt-3">
                      <div className="text-sm text-gray-500 mb-2">Selling on RAIBO?</div>
                      <div className="space-y-2 pl-2">
                        <div>
                          <Link to="/seller/login" className="text-terracotta hover:underline text-sm">
                            Seller Sign In
                          </Link>
                        </div>
                        <div>
                          <Link to="/seller/register" className="text-terracotta hover:underline text-sm">
                            Seller Register
                          </Link>
                        </div>
                      </div>
                    </li>
                  </>
                )}
                {!isSeller && (
                  <li>
                    <Link to="/cart" className="text-charcoal hover:text-terracotta flex items-center">
                      <ShoppingCart size={18} className="mr-2" />
                      Cart ({cartItems.length})
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            
            {!isSeller && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-500">Categories</h3>
                  <button 
                    onClick={toggleCategories}
                    className="text-charcoal p-1"
                  >
                    {isCategoriesOpen ? (
                      <ChevronDown size={18} className="transform rotate-180" />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>
                </div>
                
                {isCategoriesOpen && (
                  <ul className="space-y-3">
                    {categories.map((category) => (
                      <li key={category.name}>
                        <Link 
                          to={category.path} 
                          className="text-charcoal hover:text-terracotta"
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
