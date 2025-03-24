import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useWindowScroll } from 'react-use';

interface VirtualTourProps {
  isDarkMode: boolean;
}

const exhibits = [
  {
    id: 1,
    title: "Renaissance Masters",
    image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=1000",
    description: "Step into the world of Renaissance art and experience the mastery of light and perspective."
  },
  {
    id: 2,
    title: "Modern Expressions",
    image: "https://images.unsplash.com/photo-1577720580479-7d839d829c73?q=80&w=1000",
    description: "Explore contemporary artworks that challenge traditional perspectives."
  },
  {
    id: 3,
    title: "Abstract Visions",
    image: "https://images.unsplash.com/photo-1578301978776-c8162acb8f2a?q=80&w=1000",
    description: "Immerse yourself in the world of abstract art and its endless interpretations."
  }
];

const VirtualTour: React.FC<VirtualTourProps> = ({ isDarkMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useWindowScroll();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  return (
    <section
      ref={containerRef}
      className={`min-h-screen relative overflow-hidden ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <div className="container mx-auto px-4 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-16"
        >
          Virtual Exhibition Tour
        </motion.h2>

        <div className="space-y-32">
          {exhibits.map((exhibit, index) => (
            <motion.div
              key={exhibit.id}
              className="flex flex-col md:flex-row items-center gap-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="w-full md:w-1/2">
                <div className="relative overflow-hidden rounded-lg aspect-video">
                  <motion.img
                    src={exhibit.image}
                    alt={exhibit.title}
                    className="w-full h-full object-cover"
                    style={{
                      scale: useTransform(
                        scrollYProgress,
                        [index * 0.3, (index + 1) * 0.3],
                        [1, 1.1]
                      )
                    }}
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-bold mb-4">{exhibit.title}</h3>
                <p className="text-lg opacity-80">{exhibit.description}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
                >
                  Enter Exhibition
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Parallax Background Elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y, opacity }}
      >
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20" />
      </motion.div>
    </section>
  );
};

export default VirtualTour;