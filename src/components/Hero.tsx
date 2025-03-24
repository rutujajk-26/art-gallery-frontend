import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';

const Hero = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover"
        style={{ filter: isDarkMode ? 'brightness(0.7)' : 'brightness(1)' }}
      >
        <source src="https://player.vimeo.com/external/517090081.hd.mp4?s=0e69c365fdf1aef00873e3c22a4c6b00f8c5c744&profile_id=175" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6"
        >
          ArtVistas
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-center max-w-2xl mb-8"
        >
          Experience art like never before in our immersive virtual gallery
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-opacity-90 transition-all"
        >
          Start Exploring
        </motion.button>
      </div>
    </div>
  );
};

export default Hero;