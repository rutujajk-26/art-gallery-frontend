import React, { useState, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useStore } from '../store/useStore';
import ArtworkCard from './ArtworkCard';
import { Artwork, ArtworkCategory } from '../types/artwork';

const artworks: Artwork[] = [
  {
    id: 1,
    title: "The Starry Night",
    artist: "Vincent van Gogh",
    year: "1889",
    medium: "Oil on canvas",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1000",
    description: "A masterpiece showcasing the night sky in swirling patterns of blue and yellow with a cypress tree in the foreground. This painting captures the view from Van Gogh's asylum room window.",
    dimensions: "73.7 cm × 92.1 cm",
    category: "Post-Impressionism",
    tags: ["night", "sky", "landscape"]
  },
  {
    id: 2,
    title: "The Persistence of Memory",
    artist: "Salvador Dalí",
    year: "1931",
    medium: "Oil on canvas",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000",
    description: "Surrealist work featuring melting clocks in a desert landscape, exploring concepts of time and space. The soft melting watches represent the relativity of space and time.",
    dimensions: "24.1 cm × 33 cm",
    category: "Surrealism",
    tags: ["surreal", "clocks", "desert"]
  },
  {
    id: 3,
    title: "Girl with a Pearl Earring",
    artist: "Johannes Vermeer",
    year: "1665",
    medium: "Oil on canvas",
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1000",
    description: "A tronie depicting a girl in exotic dress with a pearl earring. This masterpiece is renowned for its delicate use of light and the enigmatic gaze of the subject.",
    dimensions: "44.5 cm × 39 cm",
    category: "Renaissance",
    tags: ["portrait", "dutch", "baroque"]
  },
  {
    id: 4,
    title: "Water Lilies",
    artist: "Claude Monet",
    year: "1919",
    medium: "Oil on canvas",
    image: "https://cdn11.bigcommerce.com/s-x49po/images/stencil/1500x1500/products/77917/256107/1639542887847_Waterliliy-1_Acrylic_on_canvas_20in_x_24in__73221.1687162855.jpg?c=2&imbypass=on",
    description: "Part of Monet's famous Water Lilies series, depicting the artist's flower garden at Giverny. This work showcases Monet's mastery of light and color in Impressionist style.",
    dimensions: "100 cm × 300 cm",
    category: "Impressionism",
    tags: ["nature", "garden", "flowers"]
  },
  {
    id: 5,
    title: "Composition VIII",
    artist: "Wassily Kandinsky",
    year: "1923",
    medium: "Oil on canvas",
    image: "https://images.unsplash.com/photo-1553949345-eb786bb3f7ba?q=80&w=1000",
    description: "Abstract composition using geometric shapes, lines, and vibrant colors. Considered one of Kandinsky's most important works from his Bauhaus period.",
    dimensions: "140 cm × 201 cm",
    category: "Abstract",
    tags: ["geometry", "color", "abstract"]
  },
  {
    id: 6,
    title: "The Scream",
    artist: "Edvard Munch",
    year: "1893",
    medium: "Oil, tempera, pastel on cardboard",
    image: "https://www.edvardmunch.org/assets/img/paintings/the-scream.jpg",
    description: "Expressionist painting depicting an agonized figure against a landscape with a tumultuous orange sky. Represents anxiety and the human condition.",
    dimensions: "91 cm × 73.5 cm",
    category: "Modern",
    tags: ["expressionism", "anxiety", "landscape"]
  }
] as Artwork[];

const categories = ["All", "Modern", "Renaissance", "Contemporary", "Abstract", "Impressionism", "Surrealism", "Post-Impressionism"];

// Memoized filter button component
const FilterButton = memo(({ 
  category, 
  isSelected, 
  onClick 
}: { 
  category: string; 
  isSelected: boolean; 
  onClick: () => void; 
}) => (
  <motion.button
    onClick={onClick}
    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
      isSelected 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
        : 'bg-gray-200 bg-opacity-20 backdrop-blur-sm hover:bg-opacity-30'
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    layout
  >
    {category}
  </motion.button>
));

const Gallery = () => {
  const { isDarkMode, lightingMode } = useStore();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  // Memoize filtered artworks to improve performance
  const filteredArtworks = useCallback(() => {
    if (selectedCategory === "All") return artworks;
    
    return artworks.filter(artwork => 
      artwork.category === selectedCategory || 
      artwork.tags.includes(selectedCategory.toLowerCase())
    );
  }, [selectedCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  // Memoize lighting styles to improve performance
  const getLightingStyles = useCallback(() => {
    switch (lightingMode) {
      case 'dim':
        return 'bg-gray-900 text-white bg-opacity-95';
      case 'spotlight':
        return `bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white`;
      default:
        return isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
    }
  }, [lightingMode, isDarkMode]);

  // Handle filter button click
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  // Handle opening and closing the modal
  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setSelectedArtwork(null);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };

  const artworksToShow = filteredArtworks();

  return (
    <section 
      ref={sectionRef}
      id="gallery"
      className={`py-24 transition-colors duration-500 ${getLightingStyles()}`}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Featured Collection</h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-80">
            Explore our curated selection of masterpieces from renowned artists throughout history
          </p>
        </motion.div>
        
        {/* Filter Categories */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          layout
        >
          {categories.map((category) => (
            <FilterButton
              key={category}
              category={category}
              isSelected={selectedCategory === category}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
        >
          <AnimatePresence mode="wait">
            {artworksToShow.length > 0 ? (
              artworksToShow.map((artwork) => (
                <motion.div
                  key={artwork.id}
                  variants={cardVariants}
                  exit={{ opacity: 0, scale: 0.8 }}
                  layout
                  layoutId={`artwork-card-${artwork.id}`}
                >
                  <ArtworkCard
                    artwork={artwork}
                    onClick={() => handleArtworkClick(artwork)}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-3 text-center py-16"
              >
                <p className="text-xl opacity-70">No artworks found in this category</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {selectedArtwork && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
            >
              <motion.div
                layoutId={`artwork-card-${selectedArtwork.id}`}
                className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2">
                    <img
                      src={selectedArtwork.image}
                      alt={selectedArtwork.title}
                      className="w-full h-96 md:h-full object-cover"
                      loading="eager" // Force immediate loading for modal image
                    />
                  </div>
                  <div className="md:w-1/2 p-8 flex flex-col">
                    <motion.button 
                      className="self-end text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white"
                      onClick={handleCloseModal}
                      whileHover={{ rotate: 90 }}
                      transition={{ duration: 0.2 }}
                      aria-label="Close details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{selectedArtwork.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{selectedArtwork.artist}, {selectedArtwork.year}</p>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                      <p className="text-gray-800 dark:text-gray-200">{selectedArtwork.description}</p>
                    </div>
                    <div className="mt-auto space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <p>Medium: {selectedArtwork.medium}</p>
                      <p>Dimensions: {selectedArtwork.dimensions}</p>
                      <p>Category: {selectedArtwork.category}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {selectedArtwork.tags.map(tag => (
                          <motion.button
                            key={tag} 
                            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCategoryClick(tag.charAt(0).toUpperCase() + tag.slice(1));
                              handleCloseModal();
                            }}
                          >
                            #{tag}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Gallery;