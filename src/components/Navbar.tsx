import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Link, useNavigate } from 'react-router-dom';

// Navigation item component to optimize re-renders
const NavItem = memo(({ 
  item, 
  isDarkMode,
  onClick
}: { 
  item: string; 
  isDarkMode: boolean;
  onClick?: () => void;
}) => (
  <motion.div
    whileHover={{ 
      scale: 1.05,
      backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
    }}
    whileTap={{ scale: 0.95 }}
    className={`
      px-4 py-2 text-sm font-medium rounded-full cursor-pointer
      ${isDarkMode ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'}
    `}
  >
    <Link to={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`} onClick={onClick}>
      {item}
    </Link>
  </motion.div>
));

const Navbar = () => {
  const { isDarkMode } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = ['Home', 'Gallery', 'Exhibitions', 'About', 'Contact'];
  
  // Optimized scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 30);
    };
    
    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoize background class calculation
  const navBgClass = useCallback(() => {
    if (isScrolled) {
      return isDarkMode 
        ? 'bg-gray-900/90 backdrop-blur-lg shadow-lg shadow-black/10' 
        : 'bg-white/90 backdrop-blur-lg shadow-lg shadow-black/5';
    } else {
      return isDarkMode 
        ? 'bg-transparent' 
        : 'bg-transparent';
    }
  }, [isScrolled, isDarkMode]);

  // Handle navigation click with smooth scrolling
  const handleNavClick = (section: string) => {
    setIsMobileMenuOpen(false); // Close mobile menu if open
    navigate(section.toLowerCase() === 'home' ? '/' : `/${section.toLowerCase()}`);
  };

  // Handle "Get Started" button click
  const handleGetStarted = () => {
    setIsMobileMenuOpen(false);
    navigate('/gallery');
  };
  
  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBgClass()}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center cursor-pointer"
              >
                <span className="text-2xl md:text-3xl font-bold tracking-tight">
                  Art
                  <span className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    Vistas
                  </span>
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <NavItem 
                  key={item} 
                  item={item} 
                  isDarkMode={isDarkMode} 
                  onClick={() => handleNavClick(item)}
                />
              ))}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`ml-4 px-5 py-2 text-sm font-medium rounded-full
                  ${isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }
                `}
                onClick={handleGetStarted}
              >
                Get Started
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100/10"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu with optimized rendering */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`absolute top-0 right-0 w-4/5 h-full max-w-sm shadow-xl ${
                isDarkMode ? 'bg-gray-900' : 'bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold">Menu</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100/10"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="p-5 space-y-1">
                {navItems.map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      flex items-center justify-between w-full p-3 rounded-lg text-left cursor-pointer
                      ${isDarkMode 
                        ? 'text-gray-200 hover:bg-gray-800' 
                        : 'text-gray-800 hover:bg-gray-100'
                      }
                    `}
                    onClick={() => handleNavClick(item)}
                  >
                    {item}
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </motion.div>
                ))}
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-200 dark:border-gray-800">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium"
                  onClick={handleGetStarted}
                >
                  Get Started
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;