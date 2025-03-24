import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../store/useStore';

gsap.registerPlugin(ScrollTrigger);

const ExhibitWalkthrough = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { lightingMode } = useStore();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  useEffect(() => {
    if (!containerRef.current) return;

    const sections = gsap.utils.toArray('.exhibit-section');
    
    sections.forEach((section: Element, i) => {
      gsap.fromTo(section,
        {
          opacity: 0,
          y: 100,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top center+=100",
            end: "bottom center",
            toggleActions: "play none none reverse",
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const getLightingFilter = () => {
    switch (lightingMode) {
      case 'dim':
        return 'brightness(0.7) contrast(1.1)';
      case 'spotlight':
        return 'brightness(1.2) contrast(1.3)';
      default:
        return 'brightness(1) contrast(1)';
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        style={{
          y,
          scale,
          filter: getLightingFilter(),
        }}
        className="relative z-10"
      >
        {/* Exhibition Sections */}
        <div className="space-y-32 py-20 px-4">
          {[1, 2, 3].map((section) => (
            <div
              key={section}
              className="exhibit-section max-w-6xl mx-auto"
            >
              <motion.div
                className="relative h-[70vh] rounded-2xl overflow-hidden"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${section * 5}deg)`,
                }}
              >
                <img
                  src={`https://images.unsplash.com/photo-${1500000000000 + section}?q=80&w=1920`}
                  alt={`Exhibition ${section}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <h2 className="text-4xl font-bold mb-4">Exhibition {section}</h2>
                  <p className="text-lg max-w-xl">
                    Step into a world of artistic wonder and experience the beauty of human creativity.
                  </p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Parallax Elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity }}
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl" />
      </motion.div>
    </div>
  );
};

export default ExhibitWalkthrough;