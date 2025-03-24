import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useStore } from '../store/useStore';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Using artwork data from various parts of the app
// These would normally be imported from a central data source
const allArtworks = [
  // Paintings
  {
    id: 'pt1',
    title: 'Starry Night',
    artist: 'Vincent van Gogh',
    year: '1889',
    image: 'https://www.artic.edu/iiif/2/5edc6dde-871b-c162-4b24-a6952516e3e3/full/843,/0/default.jpg',
    category: 'Painting'
  },
  {
    id: 'pt2',
    title: 'The Persistence of Memory',
    artist: 'Salvador Dalí',
    year: '1931',
    image: 'https://www.moma.org/media/W1siZiIsIjM4NjQ3MCJdLFsicCIsImNvbnZlcnQiLCItcXVhbGl0eSA5MCAtcmVzaXplIDIwMDB4MjAwMFx1MDAzZSJdXQ.jpg?sha=4c0635a9ee70d3b6',
    category: 'Painting'
  },
  {
    id: 'pt3',
    title: 'Guernica',
    artist: 'Pablo Picasso',
    year: '1937',
    image: 'https://www.museoreinasofia.es/sites/default/files/styles/foto_horizontal_normal/public/obras/DE00050_0.jpg?itok=pGgJ-Hy4',
    category: 'Painting'
  },
  // Sculptures
  {
    id: 'sc1',
    title: 'David',
    artist: 'Michelangelo',
    year: '1501-1504',
    image: 'https://smarthistory.org/wp-content/uploads/2021/12/David.jpg',
    category: 'Sculpture'
  },
  {
    id: 'sc2',
    title: 'The Thinker',
    artist: 'Auguste Rodin',
    year: '1880',
    image: 'https://smarthistory.org/wp-content/uploads/2022/10/Thinker.jpg',
    category: 'Sculpture'
  },
  // Digital art
  {
    id: 'dg1',
    title: 'Everydays: The First 5000 Days',
    artist: 'Beeple (Mike Winkelmann)',
    year: '2021',
    image: 'https://cdn.vox-cdn.com/thumbor/8V8oohsUJHW0_gOuGMYB9is81f0=/1400x0/filters:no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/22343250/beeple_art.jpg',
    category: 'Digital'
  },
  // More artwork examples
  {
    id: 'imp4',
    title: 'Water Lilies',
    artist: 'Claude Monet',
    year: '1919',
    image: 'https://smarthistory.org/wp-content/uploads/2017/02/Screen-Shot-2017-02-13-at-11.48.24-PM-e1534880168783.png',
    category: 'Painting'
  },
  {
    id: 'imp5',
    title: 'Girl with a Pearl Earring',
    artist: 'Johannes Vermeer',
    year: '1665',
    image: 'https://lh3.googleusercontent.com/MonoflMfS0YXlI-2kBd5LsEbCNgMJCxJdCSAQa7EFg_ZCVJ_5MMKMlD4Gp39OfEMiDK2JjhL4hFPNmJFXecPSIrh-Q=s0',
    category: 'Painting'
  }
];

const Hero = () => {
  const { isDarkMode, lightingMode } = useStore();
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [randomArtworks, setRandomArtworks] = useState<any[]>([]);
  const navigate = useNavigate();
  
  // For parallax effects
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Smoother animations with springs
  const smoothProgress = useSpring(scrollYProgress, { damping: 15, stiffness: 100 });
  
  // Transform values for parallax effects
  const headerY = useTransform(smoothProgress, [0, 0.5], [0, -100]);
  const videoScale = useTransform(smoothProgress, [0, 1], [1, 1.2]);
  const videoY = useTransform(smoothProgress, [0, 1], [0, 100]);
  const opacityHero = useTransform(smoothProgress, [0, 0.5], [1, 0]);
  const aboutSectionY = useTransform(smoothProgress, [0.2, 0.4], [100, 0]);
  
  // Mouse parallax effect for the header
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Calculate mouse position as values between -0.5 and 0.5
    const xPos = (clientX / innerWidth - 0.5);
    const yPos = (clientY / innerHeight - 0.5);
    
    mouseX.set(xPos * 20); // Adjust multiplier for effect intensity
    mouseY.set(yPos * 20);
  };
  
  // Select random artworks for the showcase
  useEffect(() => {
    // Create a copy of the artworks array
    const shuffled = [...allArtworks].sort(() => 0.5 - Math.random());
    // Get the first 6 items (or fewer if the array is smaller)
    setRandomArtworks(shuffled.slice(0, 6));
  }, []);
  
  // Video filter based on lighting mode
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
  
  // Navigate to gallery when clicked
  const handleExploreClick = () => {
    navigate('/gallery');
  };

  return (
    <div ref={heroRef} className="relative" onMouseMove={handleMouseMove}>
      {/* Video Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Video with Parallax Effect */}
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            scale: videoScale,
            y: videoY,
          }}
        >
          <video 
            ref={videoRef}
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
            style={{ 
              filter: getVideoFilter()
            }}
          >
            {/* Using a reliable video source */}
            <source src="/videos/artgallery.mp4" type="video/mp4" />
            {/* Fallback image in case video doesn't load */}
            <img 
              src="https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=2070" 
              alt="Art Gallery" 
              className="w-full h-full object-cover" 
            />
          </video>
          
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-b ${
            isDarkMode 
              ? 'from-black/70 via-black/50 to-black/80' 
              : 'from-black/50 via-black/30 to-black/60'
          }`} />
        </motion.div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, index) => (
            <motion.div
              key={index}
              className="absolute rounded-full bg-white/10 backdrop-blur-sm"
              style={{
                width: Math.random() * 20 + 5,
                height: Math.random() * 20 + 5,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 20,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        
        {/* Hero Content with Mouse Parallax */}
        <motion.div 
          className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-white"
          style={{ 
            opacity: opacityHero 
          }}
        >
          <motion.div 
            className="text-center max-w-4xl"
            style={{ 
              y: headerY,
              x: mouseX,
              rotateX: mouseY,
              rotateY: mouseX,
            }}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="block">Art<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600">Vistas</span></span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 mx-auto max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Immerse yourself in a world where art transcends physical boundaries. Experience our virtual gallery from anywhere in the world.
            </motion.p>
            
            <motion.button
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-full font-medium flex items-center mx-auto space-x-2 group relative overflow-hidden"
              onClick={handleExploreClick}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Button background glow effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-600 opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              <span className="relative z-10">Discover Our Collection</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 relative z-10" />
            </motion.button>
          </motion.div>
          
          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
            onClick={handleExploreClick}
            animate={{ 
              y: [0, 10, 0],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{
              repeat: Infinity,
              duration: 2
            }}
            whileHover={{ scale: 1.2 }}
          >
            <ChevronDown className="text-white h-10 w-10" />
          </motion.div>
        </motion.div>
      </section>
      
      {/* About Gallery Section with Parallax Effect */}
      <motion.section 
        className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
        style={{ y: aboutSectionY }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 relative">
                <span className="relative z-10">About ArtVistas</span>
                <motion.span 
                  className="absolute -bottom-2 left-0 h-3 bg-purple-500/30 w-24 rounded-full -z-10"
                  initial={{ width: 0 }}
                  whileInView={{ width: 100 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </h2>
              <p className="mb-6 text-lg opacity-90">
                ArtVistas is a pioneering virtual art gallery designed to break the traditional boundaries of art appreciation. 
                Our mission is to make art accessible to everyone, everywhere, through immersive digital experiences.
              </p>
              <p className="mb-6 text-lg opacity-90">
                Founded in 2023, we collaborate with artists, museums, and private collectors worldwide to bring 
                you a diverse collection spanning classical masterpieces to cutting-edge digital creations.
              </p>
              <p className="text-lg opacity-90">
                Our virtual exhibition spaces are meticulously crafted to enhance your viewing experience, 
                with customizable lighting conditions and interactive elements that bring each artwork to life.
              </p>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 relative rounded-xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1594640033138-f15b3fb6577a?q=80&w=1974" 
                alt="Virtual Gallery Experience" 
                className="w-full h-96 object-cover"
                onError={(e) => {
                  // Fallback to a placeholder image if the original fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/600x400/3F51B5/ffffff?text=Virtual+Gallery+Experience";
                }}
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <p className="text-white font-medium text-lg">Experience art in a new dimension</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Featured Artworks Section with Staggered Animation */}
      <section className={`py-20 ${isDarkMode ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6 text-center relative inline-block mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <span className="relative z-10">Our Collection Highlights</span>
            <motion.div 
              className={`absolute -bottom-2 left-0 right-0 h-3 ${isDarkMode ? 'bg-purple-700/40' : 'bg-purple-500/30'} rounded-full -z-10`}
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </motion.h2>
          
          <motion.p 
            className="text-lg mb-12 text-center max-w-3xl mx-auto opacity-80"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Explore a selection of masterpieces from our diverse collection of paintings, sculptures, and digital art.
          </motion.p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {randomArtworks.map((artwork, index) => (
              <motion.div 
                key={artwork.id}
                className="group relative overflow-hidden rounded-xl shadow-lg aspect-[4/3] cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                {/* Card inner with hover effect */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <motion.img 
                    src={artwork.image} 
                    alt={artwork.title} 
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    onError={(e) => {
                      // Fallback to a placeholder image if the original fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = `https://placehold.co/600x400/3F51B5/ffffff?text=${encodeURIComponent(artwork.title)}`;
                    }}
                  />
                </div>
                
                {/* Card gradient overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60"
                  whileHover={{ opacity: 0.8 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Card content */}
                <motion.div 
                  className="absolute bottom-0 left-0 w-full p-6 z-10 transform translate-y-2"
                  whileHover={{ translateY: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <h3 className="text-white font-bold text-xl mb-1 drop-shadow-md">{artwork.title}</h3>
                  <p className="text-white/90 text-sm drop-shadow-md">{artwork.artist}, {artwork.year}</p>
                  
                  {/* Category badge */}
                  <motion.span 
                    className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium 
                      ${artwork.category === 'Painting' ? 'bg-blue-500/80' : 
                        artwork.category === 'Sculpture' ? 'bg-amber-500/80' : 'bg-green-500/80'}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    {artwork.category}
                  </motion.span>
                </motion.div>
                
                {/* Shine effect on hover */}
                <motion.div 
                  className="absolute -left-full top-0 w-1/4 h-full bg-white/20 skew-x-12 transform transition-all duration-1000 group-hover:left-[150%]"
                  initial={{ left: "-100%" }}
                  whileHover={{ left: "150%" }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.button
              onClick={handleExploreClick}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium inline-flex items-center space-x-2 group relative overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Button background animation */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-500 opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Button content */}
              <span className="relative z-10">Let's Explore</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 relative z-10" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Hero;