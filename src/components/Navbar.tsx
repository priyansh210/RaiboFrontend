import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, ChevronDown, LogOut, Package, CreditCard, Truck, BarChart3, User, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import ThemeLanguageToggle from './ThemeLanguageToggle';
import { productService } from '../services/ProductService';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Product } from '@/models/internal/Product';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { cart: cartItems } = useCart();
  const { isAuthenticated, user, logout, isGuest } = useAuth();
  const { t } = useLanguage();
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

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: t('success'),
        description: "You have been logged out of your account.",
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: t('error'),
        description: "There was an issue logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Run search and redirect to Search page with results
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Only buyer search
      setIsLoading(true);
      try {
        let productsData;
        productsData = await productService.searchProducts(searchQuery);
        // Pass results to Search page
        navigate('/search', { state: { searchTerm: searchQuery, products: productsData } });
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
      if (isGuest) {
        toast({
          title: "Search results",
          description: "Sign in to save your search history and get personalized recommendations.",
          action: (
            <ToastAction 
              altText={t('signIn')}
              onClick={() => navigate('/login')}
            >
              {t('signIn')}
            </ToastAction>
          ),
        });
      }
    }
  };

  const redirectToAccountPage = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/account');
    }
  };

  const handleBackButton = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white dark:bg-charcoal shadow-md' : 'bg-terracotta'
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
              placeholder={t('searchForFurniture')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-md border-none pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-ring ${
                isScrolled ? 'bg-background text-foreground placeholder:text-muted-foreground' : 'bg-terracotta/90 text-white placeholder-white/80'
              }`}
            />
            <button 
              type="submit"
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-primary transition-colors ${
                isScrolled ? 'text-muted-foreground' : 'text-white/80'
              }`}
            >
              <Search size={18} />
            </button>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Theme and Language Toggle */}
            <ThemeLanguageToggle />

            <Link 
              to="/for-you" 
              className={`${isScrolled ? 'text-foreground' : 'text-white'} hover:text-primary/80 transition-colors`}
              onClick={(e) => {
                if (isGuest) {
                  e.preventDefault();
                  toast({
                    title: "Sign in for personalized recommendations",
                    description: "Create an account to get recommendations tailored just for you.",
                    action: (
                      <ToastAction 
                        altText={t('signIn')}
                        onClick={() => navigate('/login')}
                      >
                        {t('signIn')}
                      </ToastAction>
                    ),
                  });
                }
              }}
            >
              {t('forYou')}
            </Link>
            
            {/* Account Dropdown with Avatar for authenticated users */}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                {isAuthenticated ? (
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback className="placeholder-white/80 text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <button 
                    className={`flex items-center ${isScrolled ? 'text-foreground' : 'text-white'} hover:text-primary/80 transition-colors`}
                  >
                    <User size={16} className="mr-1" />
                    {t('account')} <ChevronDown size={16} className="ml-1" />
                  </button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 mt-1 z-50 ">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem className="cursor-default font-medium">
                      {user?.firstName || ''} {user?.lastName || ''}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/account" className="cursor-pointer w-full">{t('myAccount')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/my-orders" className="cursor-pointer w-full">{t('orders')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/wishlist" className="cursor-pointer w-full">{t('wishlist')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/raiboards" className="cursor-pointer w-full">{t('raiboards')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/my-rooms" className="cursor-pointer w-full">{t('my_rooms')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut size={16} className="mr-2" />
                      {t('signOut')}
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login" className="cursor-pointer w-full">{t('signIn')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register" className="cursor-pointer w-full">{t('signUp')}</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Cart Icon - show for everyone but with different behavior */}
            <Link 
              to="/cart" 
              className={`${isScrolled ? 'text-foreground' : 'text-white'} hover:text-primary/80 transition-colors relative`}
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
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Link 
              to="/cart" 
              className={`${isScrolled ? 'text-foreground' : 'text-white'} hover:text-primary/80 transition-colors relative mr-4`}
            >
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-umber text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button 
              className={`${isScrolled ? 'text-foreground' : 'text-white'} p-1`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden fixed inset-0 bg-background z-40 transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="pt-20 px-6 pb-6 h-full overflow-y-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button 
              onClick={handleBackButton}
              className="flex items-center text-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </button>
          </div>

          {/* Mobile Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder={t('searchForFurniture')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border bg-background pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Theme and Language Toggle for mobile */}
          <div className="mb-6 md:hidden flex justify-center">
            <ThemeLanguageToggle />
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Account</h3>
              <ul className="space-y-3">
                {isAuthenticated ? (
                  <>
                    <li className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-foreground">{user?.firstName} {user?.lastName}</span>
                    </li>
                    <li>
                      <Link to="/account" className="text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                        My Account
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/for-you" 
                        className="text-foreground hover:text-primary"
                        onClick={(e) => {
                          if (isGuest) {
                            e.preventDefault();
                            setIsMenuOpen(false);
                            toast({
                              title: "Sign in for personalized recommendations",
                              description: "Create an account to get recommendations tailored just for you.",
                              action: (
                                <ToastAction 
                                  altText={t('signIn')}
                                  onClick={() => navigate('/login')}
                                >
                                  {t('signIn')}
                                </ToastAction>
                              ),
                            });
                          } else {
                            setIsMenuOpen(false);
                          }
                        }}
                      >
                        For You
                      </Link>
                    </li>
                    <li>
                      <Link to="/my-rooms" className="text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                        My Rooms
                      </Link>
                    </li>
                    <li>
                      <Link to="/raiboards" className="text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                        RaiBoards
                      </Link>
                    </li>
                    <li>
                      <button 
                        onClick={handleLogout}
                        className="text-foreground hover:text-primary flex items-center"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login" className="text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                        Sign In
                      </Link>
                    </li>
                    <li>
                      <Link to="/register" className="text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                        Register
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <Link to="/cart" className="text-foreground hover:text-primary flex items-center" onClick={() => setIsMenuOpen(false)}>
                    <ShoppingCart size={18} className="mr-2" />
                    Cart ({cartItems.length})
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
