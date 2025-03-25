import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import Exhibition3D from './components/Exhibition3D';
import LightingControls from './components/LightingControls';
import { useLenis } from './hooks/useLenis';
import { useStore } from './store/useStore';
import ThemeToggle from './components/LightingControls';

// Home component to wrap the main landing page content
const Home = () => (
  <>
    <section id="home">
      <Hero />
    </section>
  </>
);

const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [focused, setFocused] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { isDarkMode } = useStore();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formState.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formState.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formState.message.length < 10) {
      newErrors.message = 'Message should be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      // Simulate form submission
      setTimeout(() => {
        setSubmitted(true);
        setFormState({ name: '', email: '', message: '' });
      }, 1000);
    }
  };
  
  return (
    <section className="min-h-screen pt-24 px-4">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            <div className="md:w-1/2">
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Get in Touch
              </h1>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded mb-6"></div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg mb-6"
              >
                Have questions or feedback? We'd love to hear from you! Fill out the form and we'll get back to you as soon as possible.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center mb-4"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-blue-600 dark:text-blue-400">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Email Us</h3>
                  <p className="opacity-75">contact@artvistas.com</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center mb-4"
              >
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-purple-600 dark:text-purple-400">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Call Us</h3>
                  <p className="opacity-75">+1 (555) 123-4567</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center"
              >
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-green-600 dark:text-green-400">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-lg">Location</h3>
                  <p className="opacity-75">123 Art Street, New York, NY 10001</p>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="md:w-1/2"
            >
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-50 dark:bg-green-900/30 p-8 rounded-lg border border-green-200 dark:border-green-800 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full mx-auto flex items-center justify-center mb-4"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">Message Sent!</h3>
                  <p className="text-green-700 dark:text-green-400 mb-4">Thanks for reaching out. We'll get back to you soon.</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Send Another Message
                  </motion.button>
                </motion.div>
              ) : (
                <div className={`backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 rounded-xl shadow-lg p-6 border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                  <h2 className="text-2xl font-bold mb-4">Send a Message</h2>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label 
                        htmlFor="name" 
                        className={`block mb-1 font-medium transition-transform ${
                          focused === 'name' ? 'text-blue-600 dark:text-blue-400 translate-x-1' : ''
                        }`}
                      >
                        Name
                      </label>
                      <motion.div
                        initial={false}
                        animate={{ 
                          y: errors.name ? [0, -2, 2, -2, 0] : 0,
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        <input 
                          type="text" 
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          onFocus={() => setFocused('name')}
                          onBlur={() => setFocused(null)}
                          className={`w-full px-4 py-2 rounded-lg border outline-none transition-colors ${
                            errors.name 
                              ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                              : focused === 'name'
                                ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900'
                                : isDarkMode 
                                  ? 'border-gray-700 bg-gray-800'
                                  : 'border-gray-300 bg-white'
                          }`}
                        />
                        {errors.name && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 dark:text-red-400 text-xs mt-1"
                          >
                            {errors.name}
                          </motion.p>
                        )}
                      </motion.div>
                    </div>
                    
                    <div>
                      <label 
                        htmlFor="email" 
                        className={`block mb-1 font-medium transition-transform ${
                          focused === 'email' ? 'text-blue-600 dark:text-blue-400 translate-x-1' : ''
                        }`}
                      >
                        Email
                      </label>
                      <motion.div
                        initial={false}
                        animate={{ 
                          y: errors.email ? [0, -2, 2, -2, 0] : 0,
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        <input 
                          type="email" 
                          id="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          onFocus={() => setFocused('email')}
                          onBlur={() => setFocused(null)}
                          className={`w-full px-4 py-2 rounded-lg border outline-none transition-colors ${
                            errors.email 
                              ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                              : focused === 'email'
                                ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900'
                                : isDarkMode 
                                  ? 'border-gray-700 bg-gray-800'
                                  : 'border-gray-300 bg-white'
                          }`}
                        />
                        {errors.email && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 dark:text-red-400 text-xs mt-1"
                          >
                            {errors.email}
                          </motion.p>
                        )}
                      </motion.div>
                    </div>
                    
                    <div>
                      <label 
                        htmlFor="message" 
                        className={`block mb-1 font-medium transition-transform ${
                          focused === 'message' ? 'text-blue-600 dark:text-blue-400 translate-x-1' : ''
                        }`}
                      >
                        Message
                      </label>
                      <motion.div
                        initial={false}
                        animate={{ 
                          y: errors.message ? [0, -2, 2, -2, 0] : 0,
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        <textarea 
                          id="message"
                          name="message"
                          rows={4}
                          value={formState.message}
                          onChange={handleChange}
                          onFocus={() => setFocused('message')}
                          onBlur={() => setFocused(null)}
                          className={`w-full px-4 py-2 rounded-lg border outline-none transition-colors ${
                            errors.message 
                              ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                              : focused === 'message'
                                ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-900'
                                : isDarkMode 
                                  ? 'border-gray-700 bg-gray-800'
                                  : 'border-gray-300 bg-white'
                          }`}
                        ></textarea>
                        {errors.message && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-600 dark:text-red-400 text-xs mt-1"
                          >
                            {errors.message}
                          </motion.p>
                        )}
                      </motion.div>
                    </div>
                    
                    <motion.button 
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
                    >
                      Send Message
                    </motion.button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

function App() {
  const { isDarkMode } = useStore();
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
          key={`${isDarkMode ? 'dark' : 'light'}`}
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
            <ThemeToggle />
            
            <main className="relative">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gallery" element={<Gallery />} />
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
                        {['Home', 'Gallery', '3D Exhibition', 'Contact'].map(item => (
                          <li key={item}>
                            <Link 
                              to={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase().replace(/\s+/g, '-')}`}
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