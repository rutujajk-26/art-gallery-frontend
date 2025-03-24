import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import ExhibitWalkthrough from './components/ExhibitWalkthrough';
import LightingControls from './components/LightingControls';
import { useLenis } from './hooks/useLenis';
import { useStore } from './store/useStore';

function App() {
  const { isDarkMode } = useStore();
  useLenis();

  return (
    <AnimatePresence>
      <div className={`min-h-screen transition-colors duration-500 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <Navbar />
        <LightingControls />
        
        <main>
          <Hero />
          <Gallery />
          <ExhibitWalkthrough />
        </main>
      </div>
    </AnimatePresence>
  );
}

export default App;