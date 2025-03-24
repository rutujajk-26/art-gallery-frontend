import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Lightbulb, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';

// Memoized control button to optimize re-renders
const ControlButton = memo(({ 
  icon: Icon, 
  isActive, 
  onClick, 
  label, 
  isDarkMode 
}: { 
  icon: React.ElementType; 
  isActive: boolean; 
  onClick: () => void; 
  label: string;
  isDarkMode: boolean;
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`p-2 rounded-xl flex flex-col items-center justify-center transition-colors ${
      isActive
        ? isDarkMode 
          ? 'bg-gray-700 text-white' 
          : 'bg-gray-200 text-gray-900'
        : 'hover:bg-gray-800/10'
    }`}
    title={label}
    aria-label={label}
  >
    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500' : ''}`} />
    <span className="text-[10px] mt-1">{label.split(' ')[0]}</span>
  </motion.button>
));

// Memoized floating button to optimize re-renders
const FloatingButton = memo(({ 
  icon: Icon, 
  isActive, 
  onClick, 
  label, 
  isDarkMode 
}: { 
  icon: React.ElementType; 
  isActive: boolean; 
  onClick: () => void; 
  label: string;
  isDarkMode: boolean;
}) => (
  <motion.button
    whileHover={{ scale: 1.1, rotate: 5 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`p-3 rounded-full shadow-lg ${
      isActive
        ? isDarkMode 
          ? 'bg-blue-600 text-white' 
          : 'bg-blue-600 text-white'
        : isDarkMode
          ? 'bg-gray-800/80 text-white backdrop-blur-sm hover:bg-gray-800'
          : 'bg-white/80 text-gray-900 backdrop-blur-sm hover:bg-white'
    }`}
    title={label}
    aria-label={label}
  >
    <Icon className="w-5 h-5" />
    <motion.span
      initial={{ opacity: 0, width: 0 }}
      whileHover={{ opacity: 1, width: 'auto' }}
      className="absolute left-0 transform -translate-x-full -translate-y-1/2 top-1/2 bg-black/70 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap mr-2"
    >
      {label}
    </motion.span>
  </motion.button>
));

const LightingControls = () => {
  const { lightingMode, setLightingMode, isDarkMode, setDarkMode } = useStore();
  const [expanded, setExpanded] = useState(false);

  const controls = [
    { mode: 'daylight', icon: Sun, label: 'Daylight' },
    { mode: 'dim', icon: Moon, label: 'Dim Lighting' },
    { mode: 'spotlight', icon: Lightbulb, label: 'Spotlight' },
  ] as const;

  // Memoize background style for better performance
  const getBackgroundStyle = useCallback(() => {
    return isDarkMode 
      ? 'bg-gray-900/70 text-white backdrop-blur-lg border border-gray-800'
      : 'bg-white/70 text-gray-900 backdrop-blur-lg border border-gray-200';
  }, [isDarkMode]);

  // Handle setting lighting mode
  const handleLightingChange = useCallback((mode: 'daylight' | 'dim' | 'spotlight') => {
    setLightingMode(mode);
    // Give haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, [setLightingMode]);

  // Handle theme toggle
  const handleThemeToggle = useCallback((isDark: boolean) => {
    setDarkMode(isDark);
    // Give haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, [setDarkMode]);

  // Toggle expanded state with performance throttling
  const toggleExpanded = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);
  
  return (
    <>
      {/* Controls panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed right-6 top-24 z-40 rounded-2xl overflow-hidden shadow-lg ${getBackgroundStyle()}`}
      >
        <div className="p-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleExpanded}
            className={`p-3 rounded-xl flex items-center justify-center ${
              expanded ? (isDarkMode ? 'bg-gray-800' : 'bg-gray-100') : ''
            }`}
            aria-label="Toggle lighting controls panel"
          >
            <Settings className="w-5 h-5" />
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
                  <p className="text-xs font-medium opacity-70 px-2">Lighting Mode</p>
                  <div className="grid grid-cols-3 gap-2">
                    {controls.map(({ mode, icon, label }) => (
                      <ControlButton
                        key={mode}
                        icon={icon}
                        isActive={lightingMode === mode}
                        onClick={() => handleLightingChange(mode)}
                        label={label}
                        isDarkMode={isDarkMode}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium opacity-70 px-2">Theme</p>
                  <div className="flex rounded-xl overflow-hidden">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleThemeToggle(false)}
                      className={`flex-1 py-2 text-xs font-medium ${
                        !isDarkMode 
                          ? 'bg-blue-600 text-white'
                          : isDarkMode ? 'text-white hover:bg-gray-800/30' : 'hover:bg-gray-200'
                      }`}
                      aria-label="Light theme"
                      aria-pressed={!isDarkMode}
                    >
                      Light
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleThemeToggle(true)}
                      className={`flex-1 py-2 text-xs font-medium ${
                        isDarkMode 
                          ? 'bg-blue-600 text-white'
                          : isDarkMode ? 'text-white hover:bg-gray-800/30' : 'hover:bg-gray-200'
                      }`}
                      aria-label="Dark theme"
                      aria-pressed={isDarkMode}
                    >
                      Dark
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quick floating controls */}
      <AnimatePresence>
        {!expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 z-40"
          >
            {controls.map(({ mode, icon, label }) => (
              <FloatingButton
                key={mode}
                icon={icon}
                isActive={lightingMode === mode}
                onClick={() => handleLightingChange(mode)}
                label={label}
                isDarkMode={isDarkMode}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LightingControls;