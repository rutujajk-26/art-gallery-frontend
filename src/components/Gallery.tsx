import React, { useState, useRef, useCallback, memo, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useStore } from '../store/useStore';
import ArtworkCard from './ArtworkCard';
import { Artwork, ArtworkCategory } from '../types/artwork';
import { ChevronLeft, ChevronRight, Search, X, ArrowRight, ImageOff } from 'lucide-react';

// Fallback images by category in case primary images fail to load
const fallbackImages = {
  "Post-Impressionism": "https://images.unsplash.com/photo-1541680670548-88e8cd23c0f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "Surrealism": "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "Renaissance": "https://images.unsplash.com/photo-1577083552334-28b7fb7500d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "Impressionism": "https://images.unsplash.com/photo-1577720580479-7d839d829c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "Abstract": "https://images.unsplash.com/photo-1573521193826-58c7270f6c42?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "Modern": "https://images.unsplash.com/photo-1501472312651-726afe119ff1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "Art Nouveau": "https://images.unsplash.com/photo-1576773042289-e387d6088928?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "Rococo": "https://images.unsplash.com/photo-1577720645755-32eb5f0ab81a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "Ukiyo-e": "https://images.unsplash.com/photo-1565375706404-082d37dd1f5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "Romanticism": "https://images.unsplash.com/photo-1579762593175-20226054cad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "Contemporary": "https://images.unsplash.com/photo-1554188248-986adbb73be4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
};

// Default fallback image if category-specific fallback also fails
const defaultFallbackImage = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

const artworks: Artwork[] = [
  {
    id: 1,
    title: "The Starry Night",
    artist: "Vincent van Gogh",
    year: "1889",
    medium: "Oil on canvas",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
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
    image: "https://upload.wikimedia.org/wikipedia/en/d/dd/The_Persistence_of_Memory.jpg",
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
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/800px-1665_Girl_with_a_Pearl_Earring.jpg",
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
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Claude_Monet_-_Water_Lilies_-_Google_Art_Project_%28462013%29.jpg/1280px-Claude_Monet_-_Water_Lilies_-_Google_Art_Project_%28462013%29.jpg",
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
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Vassily_Kandinsky%2C_1923_-_Composition_8%2C_huile_sur_toile%2C_140_cm_x_201_cm%2C_Mus%C3%A9e_Guggenheim%2C_New_York.jpg/1280px-Vassily_Kandinsky%2C_1923_-_Composition_8%2C_huile_sur_toile%2C_140_cm_x_201_cm%2C_Mus%C3%A9e_Guggenheim%2C_New_York.jpg",
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
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/1200px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg",
    description: "Expressionist painting depicting an agonized figure against a landscape with a tumultuous orange sky. Represents anxiety and the human condition.",
    dimensions: "91 cm × 73.5 cm",
    category: "Modern",
    tags: ["expressionism", "anxiety", "landscape"]
  },
  {
    id: 7,
    title: "Guernica",
    artist: "Pablo Picasso",
    year: "1937",
    medium: "Oil on canvas",
    image: "https://upload.wikimedia.org/wikipedia/en/7/74/PicassoGuernica.jpg",
    description: "Powerful anti-war statement depicting the bombing of Guernica during the Spanish Civil War. One of Picasso's most famous works showing the tragedies of war.",
    dimensions: "349.3 cm × 776.6 cm",
    category: "Modern",
    tags: ["war", "political", "cubism"]
  },
  {
    id: 8,
    title: "The Kiss",
    artist: "Gustav Klimt",
    year: "1908",
    medium: "Oil and gold leaf on canvas",
    image: "https://upload.wikimedia.org/wikipedia/commons/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg",
    description: "A masterpiece of the Art Nouveau period featuring two figures embracing in elaborate golden robes. Exemplifies Klimt's signature ornate style and the 'Golden Phase' of his work.",
    dimensions: "180 cm × 180 cm",
    category: "Art Nouveau",
    tags: ["love", "gold", "portrait"]
  },
  {
    id: 9,
    title: "American Gothic",
    artist: "Grant Wood",
    year: "1930",
    medium: "Oil on beaverboard",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg/1200px-Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg",
    description: "Depicts a farmer standing beside his daughter in front of their house. One of the most recognizable images in American art, it has become part of American popular culture.",
    dimensions: "78 cm × 65.3 cm",
    category: "Modern",
    tags: ["americana", "portrait", "rural"]
  },
  {
    id: 10,
    title: "Nighthawks",
    artist: "Edward Hopper",
    year: "1942",
    medium: "Oil on canvas",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Nighthawks_by_Edward_Hopper_1942.jpg/1920px-Nighthawks_by_Edward_Hopper_1942.jpg",
    description: "Portrays people in a downtown diner late at night. It is Hopper's most famous work and is one of the most recognizable paintings in American art.",
    dimensions: "84.1 cm × 152.4 cm",
    category: "Modern",
    tags: ["americana", "urban", "night"]
  },
  {
    id: 11,
    title: "Christina's World",
    artist: "Andrew Wyeth",
    year: "1948",
    medium: "Tempera on panel",
    image: "https://upload.wikimedia.org/wikipedia/en/a/a2/Christinasworld.jpg",
    description: "A realist painting depicting a woman crawling across a field toward a house in the distance. Wyeth was inspired by Christina Olson, who had a degenerative muscle condition.",
    dimensions: "81.9 cm × 121.3 cm",
    category: "Modern",
    tags: ["realism", "landscape", "americana"]
  },
  {
    id: 12,
    title: "The Great Wave off Kanagawa",
    artist: "Katsushika Hokusai",
    year: "1831",
    medium: "Woodblock print",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/2560px-Tsunami_by_hokusai_19th_century.jpg",
    description: "A woodblock print depicting a giant wave threatening boats off the coast of Kanagawa. It's Hokusai's most famous work and one of the most recognized works of Japanese art.",
    dimensions: "25.7 cm × 38 cm",
    category: "Ukiyo-e",
    tags: ["japanese", "wave", "ocean"]
  },
  {
    id: 13,
    title: "A Sunday Afternoon on the Island of La Grande Jatte",
    artist: "Georges Seurat",
    year: "1884",
    medium: "Oil on canvas",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg/1200px-A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg",
    description: "A masterpiece of pointillist technique and a founding work of Neo-impressionism. It shows members of different social classes participating in various activities on an island in the Seine.",
    dimensions: "207.6 cm × 308 cm",
    category: "Post-Impressionism",
    tags: ["pointillism", "park", "leisure"]
  },
  {
    id: 14,
    title: "Mont Sainte-Victoire",
    artist: "Paul Cézanne",
    year: "1904",
    medium: "Oil on canvas",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Paul_C%C3%A9zanne_-_Mont_Sainte-Victoire_-_Google_Art_Project.jpg/1280px-Paul_C%C3%A9zanne_-_Mont_Sainte-Victoire_-_Google_Art_Project.jpg",
    description: "One of Cézanne's many paintings of Mont Sainte-Victoire in Provence. Shows his approach to creating structure through color and form, and was influential in the development of Cubism.",
    dimensions: "65 cm × 81 cm",
    category: "Post-Impressionism",
    tags: ["landscape", "mountain", "provence"]
  },
  {
    id: 15,
    title: "Café Terrace at Night",
    artist: "Vincent van Gogh",
    year: "1888",
    medium: "Oil on canvas",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Van_Gogh_-_Terrasse_des_Caf%C3%A9s_an_der_Place_du_Forum_in_Arles_am_Abend1.jpeg/1024px-Van_Gogh_-_Terrasse_des_Caf%C3%A9s_an_der_Place_du_Forum_in_Arles_am_Abend1.jpeg",
    description: "One of Van Gogh's first paintings of night scenes. It depicts a colorful outdoor café illuminated by a large gas lamp while the square is illuminated by the stars.",
    dimensions: "80.7 cm × 65.3 cm",
    category: "Post-Impressionism",
    tags: ["night", "cafe", "stars"]
  },
  {
    id: 16,
    title: "The Swing",
    artist: "Jean-Honoré Fragonard",
    year: "1767",
    medium: "Oil on canvas",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Jean-Honor%C3%A9_Fragonard_-_The_Swing_-_WGA08010.jpg/1200px-Jean-Honor%C3%A9_Fragonard_-_The_Swing_-_WGA08010.jpg",
    description: "A quintessential example of Rococo style, showing a young woman on a swing, pushed by a bishop, while her lover watches from below. It's known for its playful, sensuous style.",
    dimensions: "81 cm × 64.2 cm",
    category: "Rococo",
    tags: ["garden", "swing", "romance"]
  },
  {
    id: 17,
    title: "Balloon Dog (Orange)",
    artist: "Jeff Koons",
    year: "1994-2000",
    medium: "Mirror-polished stainless steel with transparent color coating",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Balloon_Dog_-_Orange.jpg/1280px-Balloon_Dog_-_Orange.jpg",
    description: "Part of Koons' Celebration series, this sculpture resembles a balloon animal made of stainless steel. It's one of the most iconic works of contemporary art, known for its reflective surface and playful form.",
    dimensions: "307.3 × 363.2 × 114.3 cm",
    category: "Contemporary",
    tags: ["sculpture", "pop art", "reflective"]
  },
  {
    id: 18,
    title: "Number 5",
    artist: "Jackson Pollock",
    year: "1948",
    medium: "Oil, enamel, and aluminum paint on fiberboard",
    image: "https://upload.wikimedia.org/wikipedia/en/4/45/Number_5_by_Jackson_Pollock.jpg",
    description: "A signature example of Pollock's 'drip painting' technique, featuring layers of brown, yellow, and gray paint. Created during Pollock's most acclaimed period, it's a defining work of abstract expressionism.",
    dimensions: "243.8 × 121.9 cm",
    category: "Contemporary",
    tags: ["abstract expressionism", "drip painting", "action painting"]
  },
  {
    id: 19,
    title: "Campbell's Soup Cans",
    artist: "Andy Warhol",
    year: "1962",
    medium: "Synthetic polymer paint on canvas",
    image: "https://upload.wikimedia.org/wikipedia/en/9/9f/Campbells_Soup_Cans_MOMA.jpg",
    description: "A series of 32 canvases, each featuring a painting of a Campbell's Soup can—one of each variety offered at the time. This iconic work helped define Pop Art movement and challenged traditional distinctions between high art and mass-produced images.",
    dimensions: "50.8 × 40.6 cm (each)",
    category: "Contemporary",
    tags: ["pop art", "commercial", "mundane"]
  },
  {
    id: 20,
    title: "Cloud Gate",
    artist: "Anish Kapoor",
    year: "2006",
    medium: "Stainless steel",
    image: "https://upload.wikimedia.org/wikipedia/en/c/c1/Cloud_Gate_%28The_Bean%29_from_east%27.jpg",
    description: "Popularly known as 'The Bean', this public sculpture in Chicago's Millennium Park has a highly polished exterior that reflects and distorts the city's skyline. Its stainless steel surface invites visitors to touch and interact with it.",
    dimensions: "10 m × 20 m × 13 m",
    category: "Contemporary",
    tags: ["sculpture", "reflective", "public art"]
  },
  {
    id: 21,
    title: "The Physical Impossibility of Death in the Mind of Someone Living",
    artist: "Damien Hirst",
    year: "1991",
    medium: "Tiger shark, glass, steel, formaldehyde solution",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/The_Physical_Impossibility_of_Death_in_the_Mind_of_Someone_Living_-_panoramio.jpg/1280px-The_Physical_Impossibility_of_Death_in_the_Mind_of_Someone_Living_-_panoramio.jpg",
    description: "A tiger shark preserved in formaldehyde in a vitrine. This iconic work exemplifies Hirst's interest in the relationship between art, life, and death, and became one of the most recognizable symbols of British art in the 1990s.",
    dimensions: "213 × 518 × 213 cm",
    category: "Contemporary",
    tags: ["conceptual", "preservation", "mortality"]
  },
  {
    id: 22,
    title: "Infinity Mirror Room - Phalli's Field",
    artist: "Yayoi Kusama",
    year: "1965/2016",
    medium: "Mixed media installation",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Yayoi_Kusama_%E8%8D%89%E9%96%93_%E5%BD%8C%E7%94%9F_Kusama_Yayoi_YAYOI_KUSAMA_2017_%E2%80%9CINFINITY_MIRRORED_ROOM_-_ALL_THE_ETERNAL_LOVE_I_HAVE_FOR_THE_PUMPKINS%E2%80%9D_2016.jpg",
    description: "A mirrored room filled with hundreds of red polka-dotted soft sculptures. Visitors enter the installation and become part of the seemingly endless field, creating an immersive, disorienting experience.",
    dimensions: "Variable",
    category: "Contemporary",
    tags: ["installation", "immersive", "mirrors"]
  },
  {
    id: 23,
    title: "Impression, Sunrise",
    artist: "Claude Monet",
    year: "1872",
    medium: "Oil on canvas",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Monet_-_Impression%2C_Sunrise.jpg/1280px-Monet_-_Impression%2C_Sunrise.jpg",
    description: "This painting gave the Impressionist movement its name. It depicts the port of Le Havre at sunrise, with the red sun reflecting on the water with loose brushstrokes that suggest rather than define the scene.",
    dimensions: "48 cm × 63 cm",
    category: "Impressionism",
    tags: ["harbor", "sunrise", "boats"]
  },
  {
    id: 24,
    title: "The Night Watch",
    artist: "Rembrandt van Rijn",
    year: "1642",
    medium: "Oil on canvas",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Rembrandt_van_Rijn-De_Nachtwacht-1642.jpg/1280px-Rembrandt_van_Rijn-De_Nachtwacht-1642.jpg",
    description: "One of Rembrandt's most famous works, it depicts a militia company moving out, led by Captain Frans Banning Cocq. Known for its effective use of light and shadow (chiaroscuro) and for its perception of motion in what would have traditionally been a static military portrait.",
    dimensions: "363 cm × 437 cm",
    category: "Renaissance",
    tags: ["militia", "dutch", "chiaroscuro"]
  },
  {
    id: 25,
    title: "Wheat Field with Cypresses",
    artist: "Vincent van Gogh",
    year: "1889",
    medium: "Oil on canvas",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Vincent_van_Gogh_-_Wheat_Field_with_Cypresses_-_Google_Art_Project.jpg/1280px-Vincent_van_Gogh_-_Wheat_Field_with_Cypresses_-_Google_Art_Project.jpg",
    description: "Painted during van Gogh's stay at the Saint-Rémy-de-Provence asylum, this landscape captures the characteristic swirling sky and vibrant colors of his late period. The cypress trees were a common feature in van Gogh's southern French landscapes.",
    dimensions: "73 cm × 93.4 cm",
    category: "Post-Impressionism",
    tags: ["landscape", "cypresses", "wheat field"]
  },
  {
    id: 26,
    title: "Autumn Rhythm (Number 30)",
    artist: "Jackson Pollock",
    year: "1950",
    medium: "Enamel on canvas",
    image: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Autumn_Rhythm.jpg/1280px-Autumn_Rhythm.jpg",
    description: "A masterpiece of the abstract expressionist movement, created through Pollock's distinctive drip painting technique. It embodies the spontaneous, dynamic energy of action painting.",
    dimensions: "266.7 cm × 525.8 cm",
    category: "Modern",
    tags: ["abstract expressionism", "action painting", "drip technique"]
  },
  {
    id: 27,
    title: "The Hay Wain",
    artist: "John Constable",
    year: "1821",
    medium: "Oil on canvas",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/John_Constable_The_Hay_Wain.jpg/1280px-John_Constable_The_Hay_Wain.jpg",
    description: "A quintessential English landscape showing a rural scene with a hay wain (cart) crossing a river. It's celebrated for its naturalistic depiction of the countryside and atmospheric conditions.",
    dimensions: "130.2 cm × 185.4 cm",
    category: "Romanticism",
    tags: ["landscape", "countryside", "english"]
  }
] as Artwork[];

const categories = ["All", "Modern", "Renaissance", "Contemporary", "Abstract", "Impressionism", "Surrealism", "Post-Impressionism", "Art Nouveau", "Rococo", "Ukiyo-e", "Romanticism"];

// Optimized filter button with reduced re-renders
const FilterButton = memo(({ 
  category, 
  isSelected, 
  onClick,
  layoutId
}: { 
  category: string; 
  isSelected: boolean; 
  onClick: () => void;
  layoutId: string;
}) => (
  <div className="relative">
    <motion.button
      onClick={onClick}
      className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap relative z-10
        ${isSelected 
          ? 'text-black' 
          : 'text-black-700 dark:text-balck-300 hover:text-gray-900 dark:hover:text-violet-500'
        }`}
      whileTap={{ scale: 0.97 }}
    >
      {category}
    </motion.button>
    
    {/* Simplified animated background */}
    {isSelected && (
      <motion.div
        layoutId={layoutId}
        className="absolute inset-0 rounded-full bg-blue-600 shadow-md -z-0"
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
      />
    )}
  </div>
));

// Image preloader component to improve loading performance
const ImagePreloader = ({ imagesToPreload }: { imagesToPreload: string[] }) => {
  return (
    <div style={{ display: 'none' }}>
      {imagesToPreload.map((src, index) => (
        <img key={index} src={src} alt="preload" />
      ))}
    </div>
  );
};

// Utility function to verify if an image loads successfully
const verifyImageLoads = (url: string): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

const Gallery = () => {
  const { isDarkMode, lightingMode } = useStore();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<string[]>([]);
  const [imagesLoading, setImagesLoading] = useState(true);

  const sectionRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [scrollPosition, setScrollPosition] = useState(0);
  const maxScroll = useRef(0);
  const activeButtonRef = useRef<HTMLDivElement>(null);

  // Check all artwork images on component mount
  useEffect(() => {
    const checkAllImages = async () => {
      // Start with initial loading state
      setImagesLoading(true);
      
      const newFailedImages = new Set<number>();
      
      // Process in batches to avoid overwhelming the browser
      const batchSize = 5;
      for (let i = 0; i < artworks.length; i += batchSize) {
        const batch = artworks.slice(i, i + batchSize);
        const results = await Promise.all(
          batch.map(artwork => verifyImageLoads(artwork.image)
            .then(success => ({ id: artwork.id, success })))
        );
        
        results.forEach(result => {
          if (!result.success) {
            newFailedImages.add(result.id);
            console.log(`Failed to load image for artwork ID ${result.id}: ${artworks.find(a => a.id === result.id)?.title}`);
          }
        });
      }
      
      // Update the failed images state if any were found
      setFailedImages(newFailedImages);
      
      // Finish loading
      setImagesLoading(false);
      
      if (newFailedImages.size > 0) {
        console.log(`Found ${newFailedImages.size} failed images out of ${artworks.length} total artworks`);
      } else {
        console.log('All images loaded successfully');
      }
    };
    
    // Run the check
    checkAllImages();
  }, []); // Run once on component mount

  // Reset scroll position and perform initial setup
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    // Preload first few images
    const imagesToPreload = artworks.slice(0, 6).map(artwork => artwork.image);
    setPreloadedImages(imagesToPreload);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Handle image loading errors
  const handleImageError = useCallback((artworkId: number) => {
    setFailedImages(prevFailed => new Set([...prevFailed, artworkId]));
  }, []);

  // Debounced scroll handler for navbar
  useEffect(() => {
    const updateMaxScroll = () => {
      if (navbarRef.current) {
        maxScroll.current = navbarRef.current.scrollWidth - navbarRef.current.clientWidth;
      }
    };
    
    updateMaxScroll();
    
    // Add resize listener with debounce
    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(updateMaxScroll, 150); // Increased debounce time
    };
    
    window.addEventListener('resize', handleResize, { passive: true }); // Added passive for better performance
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Handle keyboard shortcuts with dependency optimization
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+K (or Cmd+K on Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        // Focus the search input after a small delay to ensure it's rendered
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }, 10);
      } else if (e.key === 'Escape' && isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(false);
        setSearchFocused(false);
        setSearchQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen]); // Only depends on isSearchOpen

  // Focus search input when search is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Optimized search loading effect
  useEffect(() => {
    if (searchQuery) {
      setSearchLoading(true);
      const timer = setTimeout(() => {
        setSearchLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  // Optimized scroll handler for active category
  useEffect(() => {
    if (navbarRef.current && activeButtonRef.current) {
      const container = navbarRef.current;
      const activeButton = activeButtonRef.current;
      
      // Calculate position to center the button
      const buttonLeft = activeButton.offsetLeft;
      const buttonWidth = activeButton.offsetWidth;
      const containerWidth = container.clientWidth;
      
      const scrollTo = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
      
      // Smooth scroll to the position
      requestAnimationFrame(() => {
        container.scrollTo({
          left: scrollTo,
          behavior: isReducedMotion ? 'auto' : 'smooth'
        });
        
        // Update scroll position state
        setScrollPosition(scrollTo);
      });
    }
  }, [selectedCategory, isReducedMotion]);

  // Optimized scroll handlers
  const handleScrollLeft = useCallback(() => {
    if (navbarRef.current) {
      const newPosition = Math.max(0, scrollPosition - 200);
      navbarRef.current.scrollTo({ 
        left: newPosition, 
        behavior: isReducedMotion ? 'auto' : 'smooth' 
      });
      setScrollPosition(newPosition);
    }
  }, [scrollPosition, isReducedMotion]);

  const handleScrollRight = useCallback(() => {
    if (navbarRef.current) {
      const newPosition = Math.min(maxScroll.current, scrollPosition + 200);
      navbarRef.current.scrollTo({ 
        left: newPosition, 
        behavior: isReducedMotion ? 'auto' : 'smooth' 
      });
      setScrollPosition(newPosition);
    }
  }, [scrollPosition, isReducedMotion]);

  // Toggle search bar with optimized state updates
  const toggleSearch = useCallback(() => {
    setIsSearchOpen(prev => {
      const newState = !prev;
      
      if (newState) {
        // Only set focus when opening
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
            setSearchFocused(true);
          }
        }, 10);
      } else {
        // Clear on close
        setSearchFocused(false);
        setSearchQuery('');
      }
      
      return newState;
    });
  }, []);

  // Clear search with optimized state updates
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      setSearchFocused(true);
    }
  }, []);

  // Handle search submission
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Add to recent searches if not already there
      if (!recentSearches.includes(searchQuery.trim()) && searchQuery.trim().length > 0) {
        setRecentSearches(prev => [searchQuery.trim(), ...prev.slice(0, 2)]);
      }
    }
  }, [searchQuery, recentSearches]);

  // Apply a recent search with optimized callback
  const applyRecentSearch = useCallback((search: string) => {
    setSearchQuery(search);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Memoize filtered artworks to improve performance
  const filteredArtworks = useMemo(() => {
    let filtered = artworks;
    
    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(artwork => 
        artwork.category === selectedCategory || 
        artwork.tags.includes(selectedCategory.toLowerCase())
      );
    }
    
    // Apply search filter if there's a search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(artwork => 
        artwork.title.toLowerCase().includes(query) ||
        artwork.artist.toLowerCase().includes(query) ||
        artwork.category.toLowerCase().includes(query) ||
        artwork.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [selectedCategory, searchQuery]);

  // Animation variants with reduced motion awareness
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isReducedMotion ? 0 : 0.02 // Reduced for better performance
      }
    }
  }), [isReducedMotion]);

  const cardVariants = useMemo(() => ({
    hidden: { opacity: 0, y: isReducedMotion ? 0 : 8 }, // Reduced animation distance
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: isReducedMotion ? 0.1 : 0.25 } // Faster animation
    }
  }), [isReducedMotion]);
  
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

  // Handle filter button click - optimized callback
  const handleCategoryClick = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  // Handle opening and closing the modal - optimized callbacks
  const handleArtworkClick = useCallback((artwork: Artwork) => {
    setSelectedArtwork(artwork);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Preload next few images in that category for smoother browsing
    const categoryArtworks = artworks.filter(a => a.category === artwork.category);
    const currentIndex = categoryArtworks.findIndex(a => a.id === artwork.id);
    
    if (currentIndex !== -1 && categoryArtworks.length > 1) {
      const nextImages: string[] = []; // Fixed type issue
      // Get next 2 images (wrapping around if needed)
      for (let i = 1; i <= 2; i++) {
        const nextIndex = (currentIndex + i) % categoryArtworks.length;
        nextImages.push(categoryArtworks[nextIndex].image);
      }
      
      if (nextImages.length > 0) {
        setPreloadedImages(prevImages => [...new Set([...prevImages, ...nextImages])]);
      }
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedArtwork(null);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  }, []);

  // Get fallback image URL by artwork ID
  const getFallbackImage = useCallback((artwork: Artwork): string => {
    const categoryFallback = fallbackImages[artwork.category as keyof typeof fallbackImages];
    return categoryFallback || defaultFallbackImage;
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="gallery"
      className={`min-h-screen pt-16 sm:pt-20 transition-colors duration-300 ${getLightingStyles()}`}
    >
      {/* Preload important images */}
      <ImagePreloader imagesToPreload={preloadedImages} />
      
      <div className="container mx-auto px-2 sm:px-4 md:px-6">
        {/* Show loading indicator if initial images are still being verified */}
        {imagesLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-xl flex flex-col items-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3 sm:mb-4"></div>
              <p className="text-base sm:text-lg font-medium">Loading gallery images...</p>
            </div>
          </div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Art Gallery</h2>
          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto opacity-80 px-2">
            Explore our curated selection of masterpieces from renowned artists throughout history
          </p>
        </motion.div>
        
        {/* Enhanced Search Bar - now with better responsive design */}
        <div className="relative max-w-3xl mx-auto mb-6 sm:mb-8 z-10 px-2 sm:px-0">
          <motion.div 
            initial={false}
            animate={{
              width: isSearchOpen ? '100%' : '240px',
              height: isSearchOpen && searchFocused && (recentSearches.length > 0 || searchQuery) ? 'auto' : '48px',
              y: isSearchOpen ? 0 : -10,
              opacity: isSearchOpen ? 1 : 0.9,
              scale: isSearchOpen ? 1 : 0.97,
            }}
            transition={{ duration: 0.2, type: 'spring', stiffness: 500, damping: 30 }}
            className={`mx-auto overflow-hidden ${
              !isSearchOpen && 'pointer-events-none'
            }`}
          >
            <motion.form 
              onSubmit={handleSearchSubmit}
              className={`relative ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              } rounded-lg border shadow-lg flex items-center p-2 transition-all duration-300 ${
                searchFocused ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
            >
              <motion.div
                animate={{ rotate: searchLoading ? 360 : 0 }}
                transition={{ duration: 1, repeat: searchLoading ? Infinity : 0, ease: "linear" }}
                className="mx-2"
              >
                <Search className={`w-4 h-4 sm:w-5 sm:h-5 ${searchLoading ? 'text-blue-500' : 'text-gray-500'}`} />
              </motion.div>
              
              <input
                ref={searchInputRef}
                type="text"
                placeholder={window.innerWidth < 480 ? "Search... (Ctrl+K)" : "Search by title, artist, or style... (Ctrl+K)"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 100)}
                className={`flex-1 py-1 sm:py-2 px-1 sm:px-2 outline-none ${
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                } transition-all duration-300 text-xs sm:text-sm md:text-base`}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    setIsSearchOpen(false);
                    setSearchFocused(false);
                    setSearchQuery('');
                  }
                }}
              />
              
              <AnimatePresence mode="wait">
                {searchQuery ? (
                  <motion.button
                    key="clear-button"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    type="button"
                    onClick={clearSearch}
                    className={`p-1 sm:p-1.5 rounded-full ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    } transition-colors`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                  </motion.button>
                ) : (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <motion.div
                      key="kbd-hint-ctrl-k"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      exit={{ opacity: 0 }}
                      className="hidden sm:block text-xs bg-gray-200 dark:bg-gray-700 px-1 sm:px-1.5 py-0.5 rounded mx-1 text-gray-500 dark:text-gray-400"
                    >
                      Ctrl+K
                    </motion.div>
                    {isSearchOpen && (
                      <motion.div
                        key="kbd-hint-esc"
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: 0.7, x: 0 }}
                        exit={{ opacity: 0, x: 5 }}
                        className="hidden sm:block text-xs bg-gray-200 dark:bg-gray-700 px-1 sm:px-1.5 py-0.5 rounded mx-1 text-gray-500 dark:text-gray-400"
                      >
                        ESC to close
                      </motion.div>
                    )}
                  </div>
                )}
              </AnimatePresence>
            </motion.form>
            
            {/* Recent searches dropdown */}
            <AnimatePresence>
              {isSearchOpen && searchFocused && recentSearches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mt-1 rounded-lg border overflow-hidden ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="p-1.5 sm:p-2 text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700">
                    Recent searches
                  </div>
                  <ul>
                    {recentSearches.map((search, index) => (
                      <motion.li 
                        key={search + index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`px-2 sm:px-3 py-1.5 sm:py-2 cursor-pointer flex items-center justify-between ${
                          isDarkMode 
                            ? 'hover:bg-gray-700' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => applyRecentSearch(search)}
                      >
                        <div className="flex items-center">
                          <Search className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-500 mr-2" />
                          <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {search}
                          </span>
                        </div>
                        <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-500" />
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          <div className="flex justify-center mt-2">
            <motion.button
              onClick={toggleSearch}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`text-xs sm:text-sm flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg ${
                isSearchOpen
                  ? isDarkMode 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-200 text-gray-700'
                  : isDarkMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-blue-500 text-white'
              } transition-colors shadow-sm`}
            >
              <Search className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              <span className="flex items-center gap-1">
                {isSearchOpen ? (
                  <>
                    Close Search
                    <kbd className="ml-1 text-xs bg-gray-600 bg-opacity-30 px-1 py-0.5 rounded hidden sm:inline-block">ESC</kbd>
                  </>
                ) : (
                  'Search Gallery'
                )}
              </span>
            </motion.button>
          </div>
        </div>
        
        {/* Optimized navbar with better responsiveness */}
        <div className="relative mb-6 sm:mb-8 overflow-hidden mx-auto">
          {/* Left scroll button */}
          <button
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            } shadow-md ${scrollPosition <= 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
            onClick={handleScrollLeft}
            disabled={scrollPosition <= 0}
          >
            <ChevronLeft size={12} className="xs:hidden" />
            <ChevronLeft size={16} className="hidden xs:block sm:hidden" />
            <ChevronLeft size={18} className="hidden sm:block" />
          </button>
          
          {/* Categories container with horizontal scroll - improved for mobile */}
          <div 
            ref={navbarRef}
            className="flex overflow-x-auto py-2 sm:py-3 md:py-4 px-6 sm:px-8 md:px-12 scrollbar-hide scroll-smooth mx-auto max-w-full sm:max-w-4xl"
            onScroll={() => {
              if (navbarRef.current) {
                setScrollPosition(navbarRef.current.scrollLeft);
              }
            }}
          >
            <div className="flex space-x-1 xs:space-x-2 sm:space-x-4 mx-auto">
              {categories.map((category) => (
                <div
                  key={category}
                  ref={selectedCategory === category ? activeButtonRef : undefined}
                  className="relative"
                >
                  <FilterButton
                    category={category}
                    isSelected={selectedCategory === category}
                    onClick={() => handleCategoryClick(category)}
                    layoutId="activeCategory"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Right scroll button */}
          <button
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            } shadow-md ${scrollPosition >= maxScroll.current ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
            onClick={handleScrollRight}
            disabled={scrollPosition >= maxScroll.current}
          >
            <ChevronRight size={12} className="xs:hidden" />
            <ChevronRight size={16} className="hidden xs:block sm:hidden" />
            <ChevronRight size={18} className="hidden sm:block" />
          </button>
        </div>

        {/* Simplified category title with animation */}
        <motion.div 
          key={selectedCategory + searchQuery}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4 sm:mb-6 md:mb-8 text-center px-2 sm:px-0"
        >
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold">
            {searchQuery 
              ? `Search results for "${searchQuery}"` 
              : selectedCategory === "All" 
                ? "All Artworks" 
                : selectedCategory
            }
          </h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-sm mt-1 sm:mt-2"
          >
            {filteredArtworks.length} artwork{filteredArtworks.length !== 1 ? 's' : ''} found
          </motion.p>
          
          {/* Animated underline for active category */}
          <motion.div 
            className="h-0.5 bg-blue-500 w-12 sm:w-16 md:w-20 mx-auto mt-1 sm:mt-2"
            initial={{ width: 0 }}
            animate={{ width: window.innerWidth < 640 ? (window.innerWidth < 400 ? '48px' : '64px') : '80px' }}
            transition={{ delay: 0.1, duration: 0.3 }}
          />
        </motion.div>

        {/* Artwork grid with optimized rendering - Improved responsiveness */}
        <motion.div
          className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {filteredArtworks.length > 0 ? (
            filteredArtworks.map((artwork) => (
              <motion.div
                key={artwork.id}
                variants={cardVariants}
                className="animate-fadeIn"
              >
                <ArtworkCard
                  artwork={artwork}
                  onClick={() => handleArtworkClick(artwork)}
                  onImageError={() => handleImageError(artwork.id)}
                  imageHasError={failedImages.has(artwork.id)}
                  fallbackImage={getFallbackImage(artwork)}
                />
              </motion.div>
            ))
          ) : (
            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
              }}
              className="col-span-1 xs:col-span-2 lg:col-span-3 text-center py-8 sm:py-12 md:py-16"
            >
              <p className="text-base sm:text-lg md:text-xl opacity-70">
                {searchQuery 
                  ? `No artworks found matching "${searchQuery}"`
                  : "No artworks found in this category"
                }
              </p>
              {searchQuery && (
                <motion.button 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={clearSearch}
                  className="mt-4 px-3 sm:px-4 py-1 sm:py-1.5 md:py-2 bg-blue-600 text-white text-xs sm:text-sm md:text-base rounded-md hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear Search
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Modal with improved responsiveness */}
        <AnimatePresence>
          {selectedArtwork && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
            >
              <motion.div
                className={`bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden max-w-xs sm:max-w-lg md:max-w-4xl w-full h-[90vh] sm:h-auto shadow-2xl`}
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
              >
                <div className="flex flex-col md:flex-row max-h-[90vh] sm:max-h-[80vh] md:max-h-[70vh]">
                  <div className="md:w-1/2 h-48 xs:h-56 sm:h-64 md:h-full relative">
                    {failedImages.has(selectedArtwork.id) ? (
                      <div className="w-full h-full relative">
                        <img
                          src={getFallbackImage(selectedArtwork)}
                          alt={selectedArtwork.title}
                          className="w-full h-full object-cover"
                          loading="eager"
                          onError={() => console.error("Even fallback image failed to load")}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-2 text-center">
                          Original image unavailable. Showing placeholder.
                        </div>
                      </div>
                    ) : (
                      <img
                        src={selectedArtwork.image}
                        alt={selectedArtwork.title}
                        className="w-full h-full object-cover"
                        loading="eager" 
                        onError={() => handleImageError(selectedArtwork.id)}
                      />
                    )}
                  </div>
                  <div className="md:w-1/2 p-3 xs:p-4 sm:p-5 md:p-6 flex flex-col overflow-y-auto">
                    <button 
                      className="self-end text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white"
                      onClick={handleCloseModal}
                      aria-label="Close details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">{selectedArtwork.title}</h3>
                    <p className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-2 sm:mb-4">{selectedArtwork.artist}, {selectedArtwork.year}</p>
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 sm:p-3 md:p-4 rounded-lg mb-3 sm:mb-4 md:mb-6 max-h-24 xs:max-h-32 sm:max-h-36 md:max-h-48 overflow-y-auto">
                      <p className="text-xs xs:text-xs sm:text-sm md:text-base text-gray-800 dark:text-gray-200">{selectedArtwork.description}</p>
                    </div>
                    <div className="mt-auto space-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      <p>Medium: {selectedArtwork.medium}</p>
                      <p>Dimensions: {selectedArtwork.dimensions}</p>
                      <p>Category: {selectedArtwork.category}</p>
                      <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3 md:mt-4">
                        {selectedArtwork.tags.map(tag => (
                          <button
                            key={tag} 
                            className="px-1.5 sm:px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCategoryClick(tag.charAt(0).toUpperCase() + tag.slice(1));
                              handleCloseModal();
                            }}
                          >
                            #{tag}
                          </button>
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

export default memo(Gallery);