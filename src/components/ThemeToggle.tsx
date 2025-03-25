import React, { useState, useCallback, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Settings, ChevronDown } from 'lucide-react';
import { useStore } from '../store/useStore';

// Enhanced theme toggle component with better responsiveness
const ThemeToggle = () => {
  const { isDarkMode, setDarkMode } = useStore();
  const [expanded, setExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Close panel on escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expanded) {
        setExpanded(false);
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [expanded]);

  // Memoize background style for better performance
  const getBackgroundStyle = useCallback(() => {
    return isDarkMode 
      ? 'bg-gray-900/90 text-white backdrop-blur-md border border-gray-700/50'
      : 'bg-white/90 text-gray-900 backdrop-blur-md border border-gray-200/50';
  }, [isDarkMode]);

  // Toggle expanded state with performance throttling
  const toggleExpanded = useCallback(() => {
    setExpanded(prev => !prev);
    // Give haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  }, []);
  
  // Handle theme toggle with visual feedback
  const handleThemeToggle = useCallback((isDark: boolean) => {
    setDarkMode(isDark);
    
    // Give haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Automatically close panel after selection on mobile
    if (window.innerWidth < 768) {
      setTimeout(() => setExpanded(false), 800);
    }
  }, [setDarkMode]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ 
        duration: 0.5,
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
      className={`fixed right-3 sm:right-6 top-20 sm:top-24 z-40 rounded-2xl overflow-hidden ${
        expanded ? 'shadow-xl' : 'shadow-lg'
      } ${
        isDarkMode 
          ? 'shadow-black/20' 
          : 'shadow-gray-400/30'
      } ${getBackgroundStyle()}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="p-3">
        <motion.button
          whileHover={{ 
            scale: 1.05, 
            backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.7)' : 'rgba(243, 244, 246, 0.7)'
          }}
          whileTap={{ scale: 0.97 }}
          onClick={toggleExpanded}
          className={`p-3 rounded-xl flex items-center justify-center transition-all duration-200 ${
            expanded 
              ? isDarkMode 
                ? 'bg-gray-800/80 shadow-inner' 
                : 'bg-gray-100/80 shadow-inner' 
              : isDarkMode
                ? 'hover:bg-gray-800/60'
                : 'hover:bg-gray-100/60'
          } ${isHovering && !expanded ? 'ring-2 ring-blue-500/30' : ''}`}
          aria-label="Toggle theme settings"
          aria-expanded={expanded}
        >
          <motion.div className="flex items-center gap-2">
            <motion.div
              animate={{ 
                rotate: expanded ? 180 : 0,
                scale: isHovering ? 1.1 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              {expanded ? (
                <ChevronDown className={`w-5 h-5 ${expanded ? 'text-blue-500' : ''}`} />
              ) : (
                <Settings className={`w-5 h-5 ${
                  isHovering ? 'text-blue-500' : ''
                }`} />
              )}
            </motion.div>
            <motion.span 
              initial={{ opacity: 0, width: 0 }}
              animate={{ 
                opacity: isHovering || expanded ? 1 : 0,
                width: isHovering || expanded ? 'auto' : 0
              }}
              className="text-xs font-medium whitespace-nowrap overflow-hidden"
            >
              {expanded ? 'Close' : 'Theme'}
            </motion.span>
          </motion.div>
        </motion.button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-4">
              <div className="space-y-2">
                <motion.p 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-xs font-medium opacity-80 px-2 flex items-center"
                >
                  <span className="mr-1">Select theme</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                </motion.p>
                <div className="flex rounded-xl overflow-hidden shadow-md">
                  <motion.button
                    whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleThemeToggle(false)}
                    className={`flex-1 py-3 text-xs font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                      !isDarkMode 
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 shadow-inner'
                        : isDarkMode 
                          ? 'text-white/90 hover:bg-gray-800/60 hover:text-white' 
                          : 'hover:bg-gray-200/70'
                    }`}
                    aria-label="Light theme"
                    aria-pressed={!isDarkMode}
                  >
                    <motion.div
                      animate={{ 
                        rotate: !isDarkMode ? [0, 15, 0] : 0,
                        scale: !isDarkMode ? 1.2 : 1
                      }}
                      transition={{ 
                        rotate: { repeat: !isDarkMode ? Infinity : 0, repeatDelay: 3, duration: 1 }, 
                        scale: { duration: 0.2 } 
                      }}
                    >
                      <Sun className={`w-4 h-4 ${!isDarkMode ? 'text-amber-600' : ''}`} />
                    </motion.div>
                    <span>Light</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleThemeToggle(true)}
                    className={`flex-1 py-3 text-xs font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-indigo-700 to-blue-700 text-white shadow-inner'
                        : 'text-gray-700 hover:bg-gray-200/70 hover:text-gray-900'
                    }`}
                    aria-label="Dark theme"
                    aria-pressed={isDarkMode}
                  >
                    <motion.div
                      animate={{ 
                        rotate: isDarkMode ? [0, 360] : 0,
                        scale: isDarkMode ? 1.2 : 1
                      }}
                      transition={{ 
                        rotate: { repeat: isDarkMode ? Infinity : 0, repeatDelay: 5, duration: 2 },
                        scale: { duration: 0.2 }
                      }}
                    >
                      <Moon className={`w-4 h-4 ${isDarkMode ? 'text-blue-300' : ''}`} />
                    </motion.div>
                    <span>Dark</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ThemeToggle;