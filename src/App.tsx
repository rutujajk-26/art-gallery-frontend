import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import ExhibitWalkthrough from './components/ExhibitWalkthrough';
import LightingControls from './components/LightingControls';
import { useLenis } from './hooks/useLenis';
import { useStore } from './store/useStore';

function App() {
  const { isDarkMode, lightingMode } = useStore();
  useLenis();

  // Handle body class changes for theme
  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
    document.body.style.backgroundColor = isDarkMode ? '#121212' : '#f8f9fa';
    document.body.style.color = isDarkMode ? '#ffffff' : '#212529';
  }, [isDarkMode]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${isDarkMode ? 'dark' : 'light'}-${lightingMode}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`min-h-screen transition-colors duration-500 ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
        }`}
      >
        <div className="relative overflow-x-hidden">
          <Navbar />
          <LightingControls />
          
          <main className="relative">
            <section id="home">
              <Hero />
            </section>
            
            <section id="gallery">
              <Gallery />
            </section>
            
            <section id="exhibitions">
              <ExhibitWalkthrough />
            </section>
            
            {/* Footer */}
            <footer className={`py-12 px-4 ${
              isDarkMode ? 'bg-gray-950 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}>
              <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4">ArtVistas</h3>
                    <p className="opacity-70 max-w-xs">
                      Experience art like never before in our immersive virtual gallery.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4">Explore</h4>
                    <ul className="space-y-2">
                      {['Home', 'Gallery', 'Exhibitions', 'Artists', 'Collections'].map(item => (
                        <li key={item}>
                          <a href={`#${item.toLowerCase()}`} className="opacity-70 hover:opacity-100 transition-opacity">
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4">Information</h4>
                    <ul className="space-y-2">
                      {['About', 'Contact', 'FAQ', 'Terms', 'Privacy'].map(item => (
                        <li key={item}>
                          <a href={`#${item.toLowerCase()}`} className="opacity-70 hover:opacity-100 transition-opacity">
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4">Connect</h4>
                    <div className="flex space-x-4">
                      {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map(social => (
                        <a 
                          key={social}
                          href={`#${social.toLowerCase()}`}
                          className="w-10 h-10 rounded-full flex items-center justify-center border border-current opacity-70 hover:opacity-100 transition-opacity"
                        >
                          {social.charAt(0)}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-12 pt-8 border-t border-gray-800 text-center opacity-60 text-sm">
                  <p>© {new Date().getFullYear()} ArtVistas. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default App;