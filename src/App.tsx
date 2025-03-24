import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import ExhibitWalkthrough from './components/ExhibitWalkthrough';
import Exhibition3D from './components/Exhibition3D';
import LightingControls from './components/LightingControls';
import { useLenis } from './hooks/useLenis';
import { useStore } from './store/useStore';

// Home component to wrap the main landing page content
const Home = () => (
  <>
    <section id="home">
      <Hero />
    </section>
  </>
);

// Exhibitions page with 3D component
const Exhibitions = () => (
  <section className="min-h-screen pt-24 px-4">
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-6">Exhibitions</h1>
      <ExhibitWalkthrough />
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-4">3D Exhibition Experience</h2>
        <Exhibition3D />
      </div>
    </div>
  </section>
);

const About = () => (
  <section className="min-h-screen pt-24 px-4">
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-6">About ArtVistas</h1>
      <p className="text-lg mb-4">
        ArtVistas is a virtual gallery dedicated to showcasing the world's most beloved artworks.
        Our mission is to make art accessible to everyone, regardless of geographical limitations.
      </p>
      <p className="text-lg mb-4">
        Founded in 2023, our platform brings together classic masterpieces and contemporary works,
        allowing visitors to explore and appreciate art in an immersive digital environment.
      </p>
    </div>
  </section>
);

const Contact = () => (
  <section className="min-h-screen pt-24 px-4">
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <div className="max-w-lg">
        <p className="mb-6">
          Have questions or feedback? We'd love to hear from you! Fill out the form below and we'll get back to you as soon as possible.
        </p>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-2">Name</label>
            <input type="text" id="name" className="w-full px-4 py-2 rounded-lg border" />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2">Email</label>
            <input type="email" id="email" className="w-full px-4 py-2 rounded-lg border" />
          </div>
          <div>
            <label htmlFor="message" className="block mb-2">Message</label>
            <textarea id="message" rows={4} className="w-full px-4 py-2 rounded-lg border"></textarea>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Send Message
          </button>
        </form>
      </div>
    </div>
  </section>
);

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
    <Router>
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
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/exhibitions" element={<Exhibitions />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/3d-exhibition" element={
                  <section className="min-h-screen pt-24 px-4">
                    <div className="container mx-auto">
                      <h1 className="text-4xl font-bold mb-6">3D Exhibition Experience</h1>
                      <Exhibition3D />
                    </div>
                  </section>
                } />
              </Routes>
              
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
                        {['Home', 'Gallery', 'Exhibitions', 'About', 'Contact'].map(item => (
                          <li key={item}>
                            <Link 
                              to={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                              className="opacity-70 hover:opacity-100 transition-opacity"
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-4">Information</h4>
                      <ul className="space-y-2">
                        {['FAQ', 'Terms', 'Privacy'].map(item => (
                          <li key={item}>
                            <Link 
                              to={`/${item.toLowerCase()}`}
                              className="opacity-70 hover:opacity-100 transition-opacity"
                            >
                              {item}
                            </Link>
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
                            href={`https://${social.toLowerCase()}.com`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full flex items-center justify-center border border-current opacity-70 hover:opacity-100 transition-opacity"
                          >
                            {social.charAt(0)}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm opacity-70">
                    <p>&copy; {new Date().getFullYear()} ArtVistas. All rights reserved.</p>
                  </div>
                </div>
              </footer>
            </main>
          </div>
        </motion.div>
      </AnimatePresence>
    </Router>
  );
}

export default App;