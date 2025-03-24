import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Lightbulb } from 'lucide-react';
import { useStore } from '../store/useStore';

const LightingControls = () => {
  const { lightingMode, setLightingMode } = useStore();

  const controls = [
    { mode: 'daylight', icon: Sun, label: 'Daylight' },
    { mode: 'dim', icon: Moon, label: 'Dim' },
    { mode: 'spotlight', icon: Lightbulb, label: 'Spotlight' },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-40"
    >
      {controls.map(({ mode, icon: Icon, label }) => (
        <motion.button
          key={mode}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setLightingMode(mode)}
          className={`p-3 rounded-full backdrop-blur-lg ${
            lightingMode === mode
              ? 'bg-white text-black'
              : 'bg-black/20 text-white hover:bg-black/30'
          }`}
          title={label}
        >
          <Icon className="w-5 h-5" />
        </motion.button>
      ))}
    </motion.div>
  );
};

export default LightingControls;