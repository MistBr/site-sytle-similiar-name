
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Heart, Menu, ShoppingCart, User, X, LogOut } from 'lucide-react';
import ShoppingCartDrawer from './ShoppingCartDrawer';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Use the imported hook
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { currentUser, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [cartItemCount, setCartItemCount] = useState(0);
  
  const isActive = (path: string) => location.pathname === path;
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {
    // Close the menu when route changes
    setIsOpen(false);
  }, [location]);
  
  useEffect(() => {
    // Update cart item count
    const savedCart = localStorage.getItem('robotCleanerCart');
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        const count = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
        setCartItemCount(count);
      } catch (error) {
        console.error('Error parsing cart:', error);
      }
    }
  }, [isCartOpen, location]);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleLogout = () => {
    logout();
  };

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const links = [
    { path: '/', label: 'Início' },
    { path: '/loja', label: 'Loja' },
    { path: '/workshop', label: 'Workshop' },
    { path: '/novidades', label: 'Novidades' },
    { path: '/sobre-nos', label: 'Sobre Nós' },
    { path: '/faq', label: 'FAQ' },
    { path: '/contato', label: 'Contato' },
  ];

  return (
    <>
      <header 
        className={`sticky top-0 z-50 border-b ${
          scrollPosition > 10 
            ? 'bg-white/95 backdrop-blur-sm shadow-sm' 
            : 'bg-white'
        } transition-all duration-200`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="font-bold text-2xl text-robot-blue">ROBOT</span>
                <span className="font-medium text-xl text-gray-700">Cleaner</span>
              </Link>
            </div>
            
            {!isMobile && (
              <nav className="hidden md:flex items-center space-x-1">
                {links.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? 'text-robot-blue'
                        : 'text-gray-700 hover:text-robot-blue'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
            
            <div className="flex items-center gap-2">
              <Link to="/favoritos" className="p-2 text-gray-700 hover:text-robot-blue">
                <Heart className="h-6 w-6" />
              </Link>
              
              <button 
                className="p-2 text-gray-700 hover:text-robot-blue relative"
                onClick={toggleCart}
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-robot-blue rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>
              
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="relative h-10 w-10 rounded-full p-0">
                      <Avatar className="h-9 w-9">
                        {currentUser?.photoURL ? (
                          <AvatarImage src={currentUser.photoURL} alt={currentUser.name} />
                        ) : (
                          <AvatarFallback className="bg-blue-100 text-blue-800">
                            {currentUser ? getInitials(currentUser.name) : 'U'}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {currentUser?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/perfil')}>
                      Meu Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/favoritos')}>
                      Favoritos
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/entrar" className="hidden md:block">
                  <Button className="gap-2">
                    <User className="h-4 w-4" />
                    Entrar
                  </Button>
                </Link>
              )}
              
              {isMobile && (
                <button 
                  className="p-2 text-gray-700 md:hidden"
                  onClick={toggleMenu}
                >
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      {isMobile && (
        <div 
          className={`fixed inset-0 z-40 bg-white transform ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-200 ease-in-out md:hidden`}
          style={{ top: '64px' }}
        >
          <div className="px-4 pt-4 pb-20 h-full overflow-y-auto">
            <nav className="flex flex-col space-y-2">
              {links.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-blue-50 text-robot-blue'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t my-4"></div>
              <Link
                to="/favoritos"
                className={`px-4 py-3 rounded-md text-base font-medium flex items-center ${
                  isActive('/favoritos')
                    ? 'bg-blue-50 text-robot-blue'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart className="h-5 w-5 mr-2" />
                Favoritos
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/perfil"
                    className={`px-4 py-3 rounded-md text-base font-medium flex items-center ${
                      isActive('/perfil')
                        ? 'bg-blue-50 text-robot-blue'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <User className="h-5 w-5 mr-2" />
                    Meu Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 rounded-md text-base font-medium flex items-center text-red-500 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Sair
                  </button>
                </>
              ) : (
                <Link
                  to="/entrar"
                  className="px-4 py-3 rounded-md text-base font-medium flex items-center text-gray-700 hover:bg-gray-50"
                >
                  <User className="h-5 w-5 mr-2" />
                  Entrar
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
      
      {/* Shopping Cart Drawer */}
      <ShoppingCartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={[]} 
        updateQuantity={() => {}} 
        totalPrice={0} 
      />
    </>
  );
};

export default Navbar;
