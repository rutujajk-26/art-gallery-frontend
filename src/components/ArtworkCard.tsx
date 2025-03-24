import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ColorThief from 'colorthief';
import { Artwork } from '../types/artwork';
import { useStore } from '../store/useStore';

interface Props {
  artwork: Artwork;
  onClick: () => void;
}

const ArtworkCard: React.FC<Props> = ({ artwork, onClick }) => {
  const { lightingMode } = useStore();
  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // 3D tilt effect - only use on desktop
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const springConfig = { damping: 25, stiffness: 300 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current || window.innerWidth < 768) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    x.set(mouseX);
    y.set(mouseY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  // Extract color palette - with performance optimization
  useEffect(() => {
    if (!imageLoaded || !imgRef.current) return;
    
    const imageElement = imgRef.current; // Get reference to avoid null check issues
    
    // Run color extraction with a delay to not block rendering
    const timer = setTimeout(() => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(imageElement, 3);
        setDominantColors(palette.map((color: number[]) => `rgb(${color.join(',')})`));
      } catch (err) {
        console.error('Error extracting colors:', err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [imageLoaded]);

  // Lighting effect
  const getLightingStyles = () => {
    switch (lightingMode) {
      case 'dim':
        return 'brightness-75 contrast-110';
      case 'spotlight':
        return 'brightness-110 contrast-125 saturate-110 drop-shadow-xl';
      default:
        return 'brightness-100 contrast-100';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      layoutId={`artwork-${artwork.id}`}
      className="relative group cursor-pointer h-full"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1000
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative overflow-hidden rounded-xl aspect-[3/4] shadow-lg h-full transition-all duration-300 group-hover:shadow-2xl">
        <motion.img
          ref={imgRef}
          src={artwork.image}
          alt={artwork.title}
          className={`w-full h-full object-cover transition-all duration-500 ${getLightingStyles()}`}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          style={{ transformStyle: "preserve-3d", z: 20 }}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Glare effect - only show on hover for better performance */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300"
          style={{
            rotateX: useTransform(springRotateY, [-10, 10], [5, -5]),
            rotateY: useTransform(springRotateX, [-10, 10], [-5, 5]),
          }}
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end transform translate-z-10"
          style={{ transformStyle: "preserve-3d", z: 30 }}
        >
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">{artwork.title}</h3>
            <p className="text-sm text-white/90 mb-3">{artwork.artist}, {artwork.year}</p>
            
            {dominantColors.length > 0 && (
              <div className="flex gap-2 mt-3 mb-2">
                {dominantColors.map((color, index) => (
                  <motion.div
                    key={index}
                    className="w-6 h-6 rounded-full drop-shadow-md"
                    style={{ backgroundColor: color }}
                    whileHover={{ scale: 1.2 }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  />
                ))}
              </div>
            )}
            
            <motion.div 
              className="flex items-center mt-4"
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.span
                className="px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                View details
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ArtworkCard;