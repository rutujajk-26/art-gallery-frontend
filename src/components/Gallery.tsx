import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';
import ArtworkCard from './ArtworkCard';
import { Artwork } from '../types/artwork';

const artworks: Artwork[] = [
  {
    id: 1,
    title: "The Starry Night",
    artist: "Vincent van Gogh",
    year: "1889",
    medium: "Oil on canvas",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=1000",
    description: "A masterpiece showcasing the night sky in swirling patterns.",
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
    description: "Surrealist work featuring melting clocks in a desert landscape.",
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
    description: "A tronie depicting a girl in exotic dress with a pearl earring.",
    dimensions: "44.5 cm × 39 cm",
    category: "Renaissance",
    tags: ["portrait", "dutch", "baroque"]
  }
] as Artwork[];

const Gallery = () => {
  const { isDarkMode } = useTheme();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  return (
    <section className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-12"
        >
          Featured Collection
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artworks.map((artwork) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              onClick={() => setSelectedArtwork(artwork)}
            />
          ))}
        </div>

        {/* Modal */}
        {selectedArtwork && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedArtwork(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg overflow-hidden max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedArtwork.image}
                alt={selectedArtwork.title}
                className="w-full h-96 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{selectedArtwork.title}</h3>
                <p className="text-gray-600 mb-4">{selectedArtwork.artist}, {selectedArtwork.year}</p>
                <p className="text-gray-800">{selectedArtwork.description}</p>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Medium: {selectedArtwork.medium}</p>
                  <p>Dimensions: {selectedArtwork.dimensions}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;