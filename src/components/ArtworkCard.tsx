import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ColorThief from 'colorthief';
import { Artwork } from '../types/artwork';

interface Props {
  artwork: Artwork;
  onClick: () => void;
}

const ArtworkCard: React.FC<Props> = ({ artwork, onClick }) => {
  const [dominantColors, setDominantColors] = useState<string[]>([]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = artwork.image;
    
    img.onload = () => {
      const colorThief = new ColorThief();
      const palette = colorThief.getPalette(img, 3);
      setDominantColors(palette.map(color => `rgb(${color.join(',')})`));
    };
  }, [artwork.image]);

  return (
    <motion.div
      layoutId={`artwork-${artwork.id}`}
      whileHover={{ scale: 1.02 }}
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-xl aspect-[3/4]">
        <motion.img
          src={artwork.image}
          alt={artwork.title}
          className="w-full h-full object-cover"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end"
        >
          <h3 className="text-xl font-bold text-white mb-1">{artwork.title}</h3>
          <p className="text-sm text-white/80">{artwork.artist}, {artwork.year}</p>
          
          {dominantColors.length > 0 && (
            <div className="flex gap-2 mt-3">
              {dominantColors.map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ArtworkCard;