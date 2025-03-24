import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Menu } from 'lucide-react';
import { useStore } from '../store/useStore';

const Navbar = () => {
  const { isDarkMode, setDarkMode } = useStore();
  
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 ${
        isDarkMode ? 'bg-black/20' : 'bg-white/20'
      } backdrop-blur-lg`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold"
          >
            ArtVistas
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {['Home', 'Gallery', 'Walkthrough', 'About', 'Contact'].map((item) => (
              <motion.button
                key={item}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm font-medium"
              >
                {item}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-gray-100/10"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 rounded-full hover:bg-gray-100/10"
            >
              <Menu className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;