import React, { useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useStore } from '../store/useStore';

const Hero = () => {
  const { isDarkMode, lightingMode } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const translateY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // Memoize this function to avoid recalculation on every render
  const getVideoFilter = useCallback(() => {
    switch (lightingMode) {
      case 'dim':
        return 'brightness(0.6) contrast(1.1)';
      case 'spotlight':
        return 'brightness(0.8) contrast(1.3) saturate(1.2)';
      default:
        return isDarkMode ? 'brightness(0.7)' : 'brightness(1)';
    }
  }, [lightingMode, isDarkMode]);

  // Scroll to gallery section when "Start Exploring" is clicked
  const handleExploreClick = () => {
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      className="relative h-screen overflow-hidden"
      style={{ opacity }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background Video - with preload metadata for faster loading */}
      <motion.video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute w-full h-full object-cover"
        style={{ 
          filter: getVideoFilter(),
          scale
        }}
      >
        <source src="https://player.vimeo.com/external/517090081.hd.mp4?s=0e69c365fdf1aef00873e3c22a4c6b00f8c5c744&profile_id=175" type="video/mp4" />
      </motion.video>

      {/* Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b ${
        isDarkMode 
          ? 'from-black/70 via-black/60 to-black/80' 
          : 'from-black/40 via-transparent to-black/60'
      }`} />

      {/* Animated shapes - reduce CPU usage with simpler animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute w-[40vw] h-[40vw] rounded-full bg-purple-500/20 blur-[120px]"
          animate={{
            x: ['-20vw', '10vw', '-20vw'],
            y: ['10vh', '30vh', '10vh'],
          }}
          transition={{
            repeat: Infinity,
            duration: 30, // Slower animation for better performance
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute w-[30vw] h-[30vw] rounded-full bg-blue-500/20 blur-[100px]"
          animate={{
            x: ['60vw', '30vw', '60vw'],
            y: ['40vh', '20vh', '40vh'],
          }}
          transition={{
            repeat: Infinity,
            duration: 25, // Slower animation for better performance
            ease: "linear"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
        <motion.div
          className="flex flex-col items-center"
          style={{ y: translateY }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6 tracking-tight"
          >
            <span className="block">Art<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600">Vistas</span></span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-center max-w-2xl mb-10 opacity-90"
          >
            Experience art like never before in our immersive virtual gallery
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 20px rgba(255,255,255,0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-white text-black rounded-full font-semibold hover:bg-opacity-90 transition-all"
            onClick={handleExploreClick}
            aria-label="Start exploring the gallery"
          >
            Start Exploring
          </motion.button>
        </motion.div>
        
        {/* Scroll indicator - click to scroll */}
        <motion.button 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-transparent border-none cursor-pointer"
          animate={{ 
            y: [0, 12, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
          onClick={handleExploreClick}
          aria-label="Scroll down"
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5L12 19M12 19L19 12M12 19L5 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Hero;