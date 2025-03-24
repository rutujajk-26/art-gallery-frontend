import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../store/useStore';
import { ArrowRight, Info, Volume2, VolumeX, Sparkles, MessageCircle, X, User } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Define exhibition categories with metadata
const exhibitionCategories = [
  {
    id: 'impressionism',
    title: 'Impressionism',
    description: 'Experience the revolutionary approach to light and color that changed the art world forever.',
    thumbnail: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?q=80&w=1920',
    coverImage: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?q=80&w=1920',
    period: '19th Century • Paris, France',
    featuredArtists: 'Claude Monet, Pierre-Auguste Renoir, Edgar Degas'
  },
  {
    id: 'surrealism',
    title: 'Surrealism',
    description: 'Explore the dreamlike world of surrealist art that challenges perception and reality.',
    thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1920',
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1920',
    period: '20th Century • Europe',
    featuredArtists: 'Salvador Dalí, René Magritte, Max Ernst'
  },
  {
    id: 'renaissance',
    title: 'Renaissance',
    description: 'Step into the world of Renaissance art and experience the mastery of light, perspective, and human form.',
    thumbnail: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988a5?q=80&w=1920',
    coverImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988a5?q=80&w=1920',
    period: '15th-16th Century • Florence, Italy',
    featuredArtists: 'Leonardo da Vinci, Michelangelo, Raphael'
  },
  {
    id: 'abstract',
    title: 'Abstract Art',
    description: 'Discover the bold world of abstract art that broke free from traditional representation.',
    thumbnail: 'https://images.unsplash.com/photo-1553949345-eb786bb3f7ba?q=80&w=1920',
    coverImage: 'https://images.unsplash.com/photo-1553949345-eb786bb3f7ba?q=80&w=1920',
    period: '20th Century • Global',
    featuredArtists: 'Wassily Kandinsky, Piet Mondrian, Jackson Pollock'
  },
  {
    id: 'modernism',
    title: 'Modern Art',
    description: 'Experience the revolutionary art movements that defined the 20th century.',
    thumbnail: 'https://images.unsplash.com/photo-1584448097639-77e13a1d8d8e?q=80&w=1920',
    coverImage: 'https://images.unsplash.com/photo-1584448097639-77e13a1d8d8e?q=80&w=1920',
    period: '20th Century • Global',
    featuredArtists: 'Pablo Picasso, Henri Matisse, Georgia O\'Keeffe'
  },
  {
    id: 'realism',
    title: 'Realism',
    description: 'Explore art that captures everyday life and ordinary people with extraordinary attention to detail.',
    thumbnail: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=1920',
    coverImage: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=1920',
    period: '19th Century • Europe',
    featuredArtists: 'Gustave Courbet, Jean-Francois Millet, Edouard Manet'
  }
];

// Mock artworks data for each category - this would normally come from an API/database
const mockArtworksByCategory = {
  impressionism: [
    {
      id: 'imp1',
      title: 'Water Lilies',
      artist: 'Claude Monet',
      year: '1919',
      image: 'https://cdn11.bigcommerce.com/s-x49po/images/stencil/1500x1500/products/77917/256107/1639542887847_Waterliliy-1_Acrylic_on_canvas_20in_x_24in__73221.1687162855.jpg?c=2&imbypass=on',
      description: "Part of Monet's famous Water Lilies series, depicting the artist's flower garden at Giverny. This work showcases Monet's mastery of light and color in Impressionist style.",
      aiInsight: "Monet painted this series over 30 years, creating approximately 250 oil paintings. The works evolved as his vision deteriorated with cataracts, adding unique blurring and color shifts. These later works influenced Abstract Expressionism decades later.",
      medium: 'Oil on canvas',
      dimensions: '100 cm × 300 cm',
      location: "Musee de l'Orangerie, Paris",
      audioGuide: 'https://example.com/audio/water-lilies.mp3'
    },
    {
      id: 'imp2',
      title: 'Dance at Le Moulin de la Galette',
      artist: 'Pierre-Auguste Renoir',
      year: '1876',
      image: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Auguste_Renoir_-_Dance_at_Le_Moulin_de_la_Galette_-_Mus%C3%A9e_d%27Orsay_RF_2739_-_Edit.jpg',
      description: "One of Impressionism's most celebrated masterpieces, showing a typical Sunday afternoon at the Moulin de la Galette, a windmill converted into an open-air dance hall in Montmartre.",
      aiInsight: "Renoir used over 30 individual models for this painting, creating a complex composition that captures the vibrant social scene of working-class Paris. The scattered light filtering through trees demonstrates Renoir's mastery of depicting the effects of natural light.",
      medium: 'Oil on canvas',
      dimensions: '131 cm × 175 cm',
      location: 'Musee d\'Orsay, Paris',
      audioGuide: 'https://example.com/audio/dance-galette.mp3'
    },
    {
      id: 'imp3',
      title: 'Impression, Sunrise',
      artist: 'Claude Monet',
      year: '1872',
      image: 'https://upload.wikimedia.org/wikipedia/commons/5/59/Monet_-_Impression%2C_Sunrise.jpg',
      description: "The painting that gave the Impressionist movement its name, showing the harbor of Le Havre at sunrise.",
      aiInsight: "This painting was initially ridiculed by critics, with one mockingly using the term 'Impressionism' as an insult, inadvertently naming the entire movement. The artwork appears to be a quick sketch but actually employs sophisticated techniques to capture light effects.",
      medium: 'Oil on canvas',
      dimensions: '48 cm × 63 cm',
      location: 'Musée Marmottan Monet, Paris',
      audioGuide: 'https://example.com/audio/impression-sunrise.mp3'
    },
    {
      id: 'imp4',
      title: 'The Boulevard Montmartre at Night',
      artist: 'Camille Pissarro',
      year: '1897',
      image: 'https://images.metmuseum.org/CRDImages/ep/original/LC-EP_1995.437.5.jpg',
      description: "A breathtaking nighttime scene of Paris's Boulevard Montmartre, showcasing Pissarro's masterful handling of artificial light.",
      aiInsight: "Pissarro, the oldest of the Impressionists, created an entire series of the Boulevard Montmartre at different times of day and in varying weather conditions. This nocturnal version is particularly rare as Impressionists typically favored painting in daylight.",
      medium: 'Oil on canvas',
      dimensions: '53.3 cm × 64.8 cm',
      location: 'The National Gallery, London',
      audioGuide: 'https://example.com/audio/boulevard-night.mp3'
    },
    {
      id: 'imp5',
      title: 'A Bar at the Folies-Bergere',
      artist: 'Edouard Manet',
      year: '1882',
      image: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Edouard_Manet%2C_A_Bar_at_the_Folies-Berg%C3%A8re.jpg',
      description: "Manet's last major work, depicting a scene at the famous Parisian cabaret with complex mirror reflections.",
      aiInsight: "This painting contains a deliberate optical puzzle - the reflection in the mirror doesn't follow correct perspective laws, creating an enigmatic spatial relationship. Art historians debate whether this was intentional or a technique to convey multiple viewpoints simultaneously.",
      medium: 'Oil on canvas',
      dimensions: '96 cm × 130 cm',
      location: 'Courtauld Gallery, London',
      audioGuide: 'https://example.com/audio/folies-bergere.mp3'
    }
  ],
  // Additional categories would be populated with similar data
};

// Enhanced AI recommendation system with context awareness
const getAIRecommendations = (artworkId: string, userInteractions: UserInteraction[] = []) => {
  // This would be replaced with actual AI recommendation logic
  // The userInteractions parameter would influence the recommendations based on user behavior
  const recommendations = {
    'imp1': ['imp4', 'imp5'], // If viewing Water Lilies, recommend these
    'imp2': ['imp3', 'imp5'],
    'imp3': ['imp1', 'imp4'],
    'imp4': ['imp2', 'imp3'],
    'imp5': ['imp2', 'imp1'],
  };
  
  return recommendations[artworkId as keyof typeof recommendations] || [];
};

// AI guide messages for different contexts
const getAIGuideMessages = (artworkId: string, context: 'introduction' | 'detail' | 'technique' | 'history' = 'introduction') => {
  const messages: Record<string, Record<string, string>> = {
    'imp1': {
      introduction: "I see you're admiring Monet's Water Lilies. This series was particularly significant as it marked a transition in his style toward more abstract compositions.",
      detail: "Notice how Monet used small, broken brushstrokes of pure color to capture the changing effects of light on the water surface. This technique gives the painting its vibrant, shimmering quality.",
      technique: "Monet painted this series en plein air (outdoors) in his garden at Giverny. He built a special studio with skylights to work on the larger canvases in this series.",
      history: "Water Lilies was created during World War I, when the sounds of gunfire could be heard from Monet's garden. He described the act of painting as providing 'moments of peace' during troubled times."
    },
    'imp2': {
      introduction: "Renoir's 'Dance at Le Moulin de la Galette' captures the joyous atmosphere of Parisian social life in the late 19th century.",
      detail: "Look at how Renoir uses dappled light filtering through the trees, creating patches of sunlight on the dancers. This effect, known as 'taches soleil' (spots of sun), was a signature of Impressionist painting.",
      technique: "Renoir spent months frequenting this dance garden to make preliminary sketches. He painted many of the figures from life, with friends posing in his studio.",
      history: "The Moulin de la Galette was a working windmill that had been converted to an open-air café where Parisians of all social classes would gather to dance and enjoy themselves on Sunday afternoons."
    },
    // Add messages for other artworks
  };
  
  if (!messages[artworkId]) {
    return "This piece exemplifies the artist's unique approach to color and composition. Take your time to observe the details.";
  }
  
  return messages[artworkId][context] || messages[artworkId].introduction;
};

// Types for tracking user interactions
type InteractionType = 'view' | 'zoom' | 'info' | 'audio' | 'time_spent';
interface UserInteraction {
  artworkId: string;
  type: InteractionType;
  timestamp: number;
  duration?: number; // For time_spent
}

const ExhibitWalkthrough = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { lightingMode, isDarkMode } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);
  
  // New state for enhanced AI features
  const [userInteractions, setUserInteractions] = useState<UserInteraction[]>([]);
  const [aiGuideOpen, setAiGuideOpen] = useState(false);
  const [aiGuideMessage, setAiGuideMessage] = useState('');
  const [aiGuideContext, setAiGuideContext] = useState<'introduction' | 'detail' | 'technique' | 'history'>('introduction');
  const [isAiThinking, setIsAiThinking] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Ensure correct typing for sections array from querySelectorAll
    const sections = Array.from(
      document.querySelectorAll('.exhibit-section')
    ) as Element[];
    
    sections.forEach((section, i) => {
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

  const getLightingFilter = useCallback(() => {
    switch (lightingMode) {
      case 'dim':
        return 'brightness(0.7) contrast(1.1)';
      case 'spotlight':
        return 'brightness(1.2) contrast(1.3)';
      default:
        return isDarkMode ? 'brightness(0.9) contrast(1.1)' : 'brightness(1) contrast(1)';
    }
  }, [lightingMode, isDarkMode]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentArtworkIndex(0);
    // Reset AI states when changing category
    setShowAIInsights(false);
    setAiRecommendations([]);
  };

  // Track user interactions for better AI recommendations
  const trackInteraction = (type: InteractionType, artworkId?: string) => {
    const newInteraction: UserInteraction = {
      artworkId: artworkId || (selectedCategory && mockArtworksByCategory[selectedCategory as keyof typeof mockArtworksByCategory]?.[currentArtworkIndex]?.id) || '',
      type,
      timestamp: Date.now()
    };
    
    setUserInteractions(prev => [...prev, newInteraction]);
  };

  // Enhanced artwork change handler with interaction tracking
  const handleArtworkChange = (index: number) => {
    // Track time spent on previous artwork before changing
    if (selectedCategory) {
      const artworks = mockArtworksByCategory[selectedCategory as keyof typeof mockArtworksByCategory];
      if (artworks && artworks[currentArtworkIndex]) {
        trackInteraction('time_spent', artworks[currentArtworkIndex].id);
      }
    }
    
    setCurrentArtworkIndex(index);
    
    // Simulate AI thinking when generating new recommendations
    setIsAiThinking(true);
    
    // Simulate AI generating recommendations based on the viewed artwork and user behavior
    if (selectedCategory) {
      const artworks = mockArtworksByCategory[selectedCategory as keyof typeof mockArtworksByCategory];
      if (artworks && artworks[index]) {
        const recommendations = getAIRecommendations(artworks[index].id, userInteractions);
        
        // Simulate AI processing time
        setTimeout(() => {
          setAiRecommendations(recommendations);
          setIsAiThinking(false);
          
          // Set initial AI guide message
          setAiGuideMessage(getAIGuideMessages(artworks[index].id, 'introduction'));
          setAiGuideContext('introduction');
          
          // Show the AI guide automatically when changing artwork
          if (!aiGuideOpen) {
            setTimeout(() => {
              setAiGuideOpen(true);
            }, 1500);
          }
        }, 800);
        
        // Track this new view
        trackInteraction('view', artworks[index].id);
      }
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    // Implementation would include actual audio control
  };

  const toggleAIInsights = () => {
    setShowAIInsights(!showAIInsights);
  };

  const toggleAIGuide = () => {
    setAiGuideOpen(!aiGuideOpen);
    trackInteraction('info');
  };
  
  const changeAIGuideContext = (context: 'introduction' | 'detail' | 'technique' | 'history') => {
    if (selectedCategory) {
      const artworks = mockArtworksByCategory[selectedCategory as keyof typeof mockArtworksByCategory];
      if (artworks && artworks[currentArtworkIndex]) {
        setIsAiThinking(true);
        setAiGuideContext(context);
        
        // Simulate AI processing time
        setTimeout(() => {
          setAiGuideMessage(getAIGuideMessages(artworks[currentArtworkIndex].id, context));
          setIsAiThinking(false);
        }, 600);
      }
    }
  };

  // Render content based on state
  const renderContent = () => {
    if (!selectedCategory) {
      // Category selection view with grand entrance
      return (
        <div className="container mx-auto px-4 py-12">
          {/* Grand Entrance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="relative w-full mb-16"
          >
            <div className="h-[40vh] relative rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1566054757965-8c4085344c96?q=80&w=2000" 
                alt="Grand Museum Entrance"
                className="w-full h-full object-cover"
                style={{ filter: getLightingFilter() }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Marble floor overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gray-200 opacity-20 bg-[url('https://images.unsplash.com/photo-1557148380-c49bdcfa6026?q=80&w=1000')] bg-cover"></div>
              
              <div className="absolute left-0 right-0 bottom-0 p-8 text-center text-white">
                <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">ArtVistas Gallery</h1>
                <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                  Experience art from around the world with our AI-enhanced exhibitions
                </p>
                <motion.div 
                  className="w-24 h-1 bg-red-700 mx-auto mt-6"
                  initial={{ width: 0 }}
                  animate={{ width: 96 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </div>
            </div>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-8 text-center"
          >
            Choose an Exhibition
          </motion.h2>
          
          {/* New 3D Exhibition button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12 flex justify-center"
          >
            <a 
              href="#3d-exhibition" 
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <span className="relative">
                <span className="absolute inset-0 blur-sm bg-white opacity-30 animate-pulse rounded-full"></span>
                <span className="relative">✨</span>
              </span>
              Experience our NEW 3D Virtual Exhibition
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exhibitionCategories.map((category, index) => (
              <motion.div
                key={category.id}
                className="relative rounded-xl overflow-hidden cursor-pointer shadow-lg transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.03]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => handleCategorySelect(category.id)}
              >
                <div className="h-64 relative">
                  <img 
                    src={category.thumbnail} 
                    alt={category.title}
                    className="w-full h-full object-cover"
                    style={{ filter: getLightingFilter() }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                    <p className="text-sm opacity-90 mb-4">{category.period}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs opacity-80">Featured Artists:</span>
                      <span className="text-xs">{category.featuredArtists}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      );
    }
    
    // Exhibition walkthrough view
    const artworks = mockArtworksByCategory[selectedCategory as keyof typeof mockArtworksByCategory] || [];
    const currentArtwork = artworks[currentArtworkIndex];
    
    if (!currentArtwork) {
      return <div>No artworks found in this collection.</div>;
    }

    return (
      <div className="min-h-screen">
        {/* Exhibition Controls */}
        <div className="fixed top-24 left-4 z-40 bg-black/20 backdrop-blur-sm rounded-full p-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-white rounded-full"
            onClick={() => setSelectedCategory(null)}
          >
            ← Back to Exhibitions
          </motion.button>
        </div>
        
        {/* 3D Exhibition link */}
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-40">
          <motion.a
            href="#3d-exhibition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-full flex items-center gap-1"
          >
            <span>✨</span>
            Try 3D Exhibition
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.a>
        </div>
        
        {/* Audio toggle */}
        <motion.button
          className="fixed top-24 right-24 z-40 p-3 bg-black/20 backdrop-blur-sm rounded-full text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            toggleSound();
            trackInteraction('audio');
          }}
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </motion.button>
        
        {/* AI insights toggle */}
        <motion.button
          className="fixed top-24 right-4 z-40 p-3 bg-black/20 backdrop-blur-sm rounded-full text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            toggleAIInsights();
            trackInteraction('info');
          }}
        >
          <Info size={20} />
        </motion.button>
        
        {/* AI Guide Button */}
        <motion.button
          className="fixed bottom-24 right-4 z-40 p-4 bg-blue-600 rounded-full text-white shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleAIGuide}
        >
          <MessageCircle size={24} />
        </motion.button>
        
        {/* AI Guide Chat Panel */}
        <AnimatePresence>
          {aiGuideOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 50, x: 20 }}
              className="fixed bottom-24 right-4 z-30 w-80 bg-gray-900/90 backdrop-blur-md rounded-lg overflow-hidden shadow-2xl border border-blue-800"
              style={{ maxHeight: '60vh' }}
            >
              {/* Chat header */}
              <div className="bg-blue-900/80 p-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-blue-300" />
                  <span className="font-medium text-white">AI Art Guide</span>
                </div>
                <button 
                  className="text-gray-300 hover:text-white"
                  onClick={toggleAIGuide}
                >
                  <X size={18} />
                </button>
              </div>
              
              {/* Chat content */}
              <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(60vh - 120px)' }}>
                {/* AI message */}
                <div className="flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={14} className="text-white" />
                  </div>
                  <div className="bg-blue-800/40 rounded-lg p-3 text-sm text-gray-100 max-w-[85%]">
                    {isAiThinking ? (
                      <div className="flex gap-1 items-center h-6">
                        <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    ) : (
                      aiGuideMessage
                    )}
                  </div>
                </div>
                
                {/* Context buttons for user to ask about different aspects */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <button 
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      aiGuideContext === 'introduction' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => changeAIGuideContext('introduction')}
                  >
                    Overview
                  </button>
                  <button 
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      aiGuideContext === 'detail' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => changeAIGuideContext('detail')}
                  >
                    Composition Details
                  </button>
                  <button 
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      aiGuideContext === 'technique' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => changeAIGuideContext('technique')}
                  >
                    Technique
                  </button>
                  <button 
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      aiGuideContext === 'history' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => changeAIGuideContext('history')}
                  >
                    Historical Context
                  </button>
                </div>
              </div>
              
              {/* Simulated user input */}
              <div className="p-3 border-t border-gray-700">
                <div className="bg-gray-700/50 rounded-full px-4 py-2 text-sm text-gray-400 flex items-center">
                  <User size={14} className="mr-2 text-gray-500" />
                  <span>Ask about this artwork...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Virtual Gallery Space */}
        <div className="relative min-h-screen bg-gray-900">
          {/* Marble floor */}
          <div className="absolute bottom-0 left-0 right-0 h-1/4 opacity-30 bg-[url('https://images.unsplash.com/photo-1557148380-c49bdcfa6026?q=80&w=1000')] bg-cover" />
          
          {/* Red carpet path */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-full max-w-md z-10">
            <div className="w-full h-full bg-red-800/70 blur-[2px]" />
            {/* Carpet texture overlay */}
            <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1602424147578-26386dc29802?q=80&w=1000')] bg-repeat-y" />
            {/* Carpet glow */}
            <div className="absolute inset-0 bg-red-500/20 blur-xl" />
          </div>
          
          {/* Soft ambient lighting */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-100/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-100/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '12s' }} />
          
          {/* Artwork display */}
          <div className="relative z-20 min-h-screen flex items-center justify-center">
            <div className="max-w-6xl w-full px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6 }}
                className="bg-gray-800/30 backdrop-blur-md rounded-xl p-8 shadow-2xl"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Artwork image with gold frame */}
                  <div className="lg:w-3/5">
                    <div className="relative rounded-lg overflow-hidden shadow-2xl border-8 bg-gray-900" 
                         style={{ 
                           borderImage: 'linear-gradient(45deg, #d4af37 0%, #f9f295 50%, #d4af37 100%) 1',
                           boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
                         }}>
                      <motion.img 
                        src={currentArtwork.image}
                        alt={currentArtwork.title}
                        className="w-full h-full object-contain"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                      />
                      
                      {/* Lighting effect */}
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-white/10" />
                      
                      {/* Frame shadow */}
                      <div className="absolute inset-0 pointer-events-none shadow-inner" />
                      
                      {/* Spotlight effect */}
                      <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />
                    </div>
                    
                    {/* Navigation dots */}
                    <div className="flex justify-center mt-6 space-x-2">
                      {artworks.map((_, index) => (
                        <button
                          key={index}
                          className={`w-3 h-3 rounded-full transition-all ${
                            index === currentArtworkIndex
                              ? 'bg-amber-400 scale-125'
                              : 'bg-gray-500 hover:bg-amber-300'
                          }`}
                          onClick={() => handleArtworkChange(index)}
                          aria-label={`View artwork ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Artwork information */}
                  <div className="lg:w-2/5 text-white">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <h2 className="text-3xl font-bold mb-2">{currentArtwork.title}</h2>
                      <p className="text-xl opacity-90 mb-4">{currentArtwork.artist}, {currentArtwork.year}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                          {currentArtwork.medium}
                        </span>
                        <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                          {currentArtwork.dimensions}
                        </span>
                        <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                          {currentArtwork.location}
                        </span>
                      </div>
                      
                      <div className="bg-black/30 rounded-lg p-4 mb-6">
                        <p className="text-gray-200">{currentArtwork.description}</p>
                      </div>
                      
                      {/* AI Insights */}
                      <AnimatePresence>
                        {showAIInsights && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4 mb-6">
                              <div className="flex items-center gap-2 mb-3">
                                <Sparkles size={16} className="text-blue-300" />
                                <h3 className="text-sm uppercase tracking-wider text-blue-300">AI Art Analysis</h3>
                              </div>
                              <p className="text-gray-200 text-sm">{currentArtwork.aiInsight}</p>
                              
                              {isAiThinking && (
                                <div className="flex gap-2 mt-4 items-center">
                                  <span className="text-xs text-blue-300">AI analyzing your preferences</span>
                                  <div className="w-4 h-4 relative">
                                    <div className="absolute inset-0 border-2 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Enhanced AI Recommendations */}
                            {aiRecommendations.length > 0 && (
                              <div className="mt-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <Sparkles size={16} className="text-blue-300" />
                                  <h3 className="text-sm uppercase tracking-wider text-blue-300">Personalized Recommendations</h3>
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                  {aiRecommendations.map(recId => {
                                    // Find the recommended artwork by ID
                                    const recIndex = artworks.findIndex(artwork => artwork.id === recId);
                                    if (recIndex === -1) return null;
                                    
                                    const recArtwork = artworks[recIndex];
                                    return (
                                      <motion.div 
                                        key={recId}
                                        className="flex-shrink-0 w-24 cursor-pointer relative group"
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => handleArtworkChange(recIndex)}
                                      >
                                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <img 
                                          src={recArtwork.image} 
                                          alt={recArtwork.title}
                                          className="w-full h-24 object-cover rounded-lg border border-gray-700 group-hover:border-blue-500 transition-colors"
                                        />
                                        <p className="text-xs mt-1 truncate">{recArtwork.title}</p>
                                        <div className="absolute bottom-6 left-0 right-0 text-[10px] text-center opacity-0 group-hover:opacity-100 transition-opacity text-blue-200 px-1">
                                          View artwork
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Navigation buttons */}
                      <div className="flex gap-4 mt-8">
                        <button
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={currentArtworkIndex === 0}
                          onClick={() => handleArtworkChange(currentArtworkIndex - 1)}
                        >
                          ← Previous
                        </button>
                        
                        <button
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={currentArtworkIndex === artworks.length - 1}
                          onClick={() => handleArtworkChange(currentArtworkIndex + 1)}
                        >
                          Next <ArrowRight size={16} />
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      id="exhibitions"
      className={`min-h-screen relative overflow-hidden ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      } ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
    >
      <motion.div
        style={{
          y,
          scale,
        }}
        className="relative z-10 pt-20"
      >
        {renderContent()}
      </motion.div>

      {/* Background Elements */}
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