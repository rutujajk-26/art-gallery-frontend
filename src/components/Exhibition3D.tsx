import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { ArrowLeft, ArrowRight, Volume2, VolumeX, Info } from 'lucide-react';

// Art categories
const artCategories = [
  {
    id: 'sculptures',
    name: 'Sculptures',
    description: 'Explore masterpieces of three-dimensional art through the ages',
    color: '#9C27B0' // Purple
  },
  {
    id: 'paintings',
    name: 'Paintings',
    description: 'Discover iconic paintings from different periods and movements',
    color: '#3F51B5' // Indigo
  },
  {
    id: 'digital',
    name: 'Digital Art',
    description: 'Experience the cutting edge of digital artistic expression',
    color: '#2196F3' // Blue
  }
];

// Simplified artwork data
const artworks = {
  sculptures: [
    {
      id: 'sc1',
      title: 'David',
      artist: 'Michelangelo',
      year: '1501-1504',
      image: 'https://images.unsplash.com/photo-1612264348081-b3842a7bc2a3?q=80&w=1920',
      description: 'One of the most recognized sculptures in art history, representing the biblical hero David.'
    },
    {
      id: 'sc2',
      title: 'The Thinker',
      artist: 'Auguste Rodin',
      year: '1880',
      image: 'https://images.unsplash.com/photo-1599281546043-88ebe9611bd1?q=80&w=1920',
      description: 'A bronze sculpture depicting a nude male figure in deep contemplation.'
    },
    {
      id: 'sc3',
      title: 'Venus de Milo',
      artist: 'Alexandros of Antioch',
      year: '~130-100 BC',
      image: 'https://images.unsplash.com/photo-1610016302534-6f67f1c968d8?q=80&w=1920',
      description: 'An ancient Greek statue and one of the most famous works of ancient Greek sculpture.'
    }
  ],
  paintings: [
    {
      id: 'pt1',
      title: 'Starry Night',
      artist: 'Vincent van Gogh',
      year: '1889',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1920px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
      description: 'One of Van Gogh\'s most famous works, depicting a night scene with a swirling sky and a quiet village.'
    },
    {
      id: 'pt2',
      title: 'The Persistence of Memory',
      artist: 'Salvador Dalí',
      year: '1931',
      image: 'https://uploads6.wikiart.org/images/salvador-dali/the-persistence-of-memory-1931.jpg',
      description: 'A surrealist masterpiece featuring melting clocks in a dreamlike landscape.'
    },
    {
      id: 'pt3',
      title: 'Guernica',
      artist: 'Pablo Picasso',
      year: '1937',
      image: 'https://upload.wikimedia.org/wikipedia/en/7/74/PicassoGuernica.jpg',
      description: 'A powerful anti-war statement depicting the bombing of Guernica during the Spanish Civil War.'
    }
  ],
  digital: [
    {
      id: 'dg1',
      title: 'Everydays: The First 5000 Days',
      artist: 'Beeple (Mike Winkelmann)',
      year: '2021',
      image: 'https://news.artnet.com/app/news-upload/2021/03/Beeple-Everydays-—-The-First-5000-Days-2007-—-2021-1536x877.jpg',
      description: 'A digital collage of 5,000 images created over 13 years, famous for being sold as an NFT.'
    },
    {
      id: 'dg2',
      title: 'Genesis',
      artist: 'Refik Anadol',
      year: '2018',
      image: 'https://images.squarespace-cdn.com/content/v1/5d54aa43f2d1fa0001ea4d52/1626127273618-OPWQYFBWV8EFNJNX25AM/refik-anadol-machine-hallucinations-nature-dreams-visualization-02.jpeg',
      description: 'An AI data sculpture using machine learning algorithms to create mesmerizing visualizations.'
    },
    {
      id: 'dg3',
      title: 'Quantum Memories',
      artist: 'Refik Anadol',
      year: '2020',
      image: 'https://images.squarespace-cdn.com/content/v1/5d54aa43f2d1fa0001ea4d52/1619735186441-Z8VBAXFV84J1K87Q8FJI/refik-anadol-quantum-memories-installation-view-03.jpeg',
      description: 'A data-driven artwork exploring the intersection of quantum computing and human consciousness.'
    }
  ]
};

// Types
type ExhibitionState = 'entrance' | 'category-selection' | 'exhibition-hall';

const Exhibition3D: React.FC = () => {
  // Core refs for THREE.js
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const frameIdRef = useRef<number>(0);
  const artworkFramesRef = useRef<THREE.Mesh[]>([]);
  
  // State
  const [exhibitionState, setExhibitionState] = useState<ExhibitionState>('entrance');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showArtworkInfo, setShowArtworkInfo] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isDarkMode } = useStore();
  
  // Materials for the 3D scene
  const materials = useMemo(() => ({
    carpet: new THREE.MeshStandardMaterial({ color: 0x3f51b5, roughness: 0.7 }), // Indigo
    floor: new THREE.MeshStandardMaterial({ color: 0x121212, roughness: 0.8 }),
    wall: new THREE.MeshStandardMaterial({ color: 0x121212, roughness: 0.7 }),
    frame: new THREE.MeshStandardMaterial({ color: 0x303030, metalness: 0.3 }),
    frameBorder: new THREE.MeshStandardMaterial({ color: 0x9c27b0, metalness: 0.5 }), // Purple
  }), []);
  
  // Pre-create geometries
  const geometries = useMemo(() => ({
    carpet: new THREE.BoxGeometry(20, 0.1, 2),
    floor: new THREE.BoxGeometry(30, 0.1, 10),
    backWall: new THREE.BoxGeometry(30, 10, 0.1),
    sideWall: new THREE.BoxGeometry(0.1, 10, 10),
    frame: new THREE.BoxGeometry(4, 3, 0.1),
    artwork: new THREE.PlaneGeometry(3.8, 2.8),
  }), []);
  
  // Initialize 3D scene
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a); // Dark blue-black background
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: 'high-performance',
      precision: 'mediump',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = false;
    
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add controls with fixed rotation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI * 0.25;
    controls.maxPolarAngle = Math.PI * 0.75;
    controls.minDistance = 5;
    controls.maxDistance = 15;
    controls.enableRotate = false; // Disable rotation to prevent unwanted movement
    controlsRef.current = controls;
    
    // Add basic lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    
    // Create and position directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);
    
    // Create and position red point light
    const accentLight = new THREE.PointLight(0x9c27b0, 0.8, 15); // Purple light
    accentLight.position.set(0, 2, 3);
    scene.add(accentLight);
    
    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Resize handler
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Audio setup
    const audio = new Audio('/audio/exhibition-ambient.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;
    
    // Cleanup
    return () => {
      cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && mountRef.current) {
        // Dispose resources
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
        
        renderer.dispose();
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [materials]);
  
  // Toggle audio
  const toggleAudio = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    
    if (audioRef.current) {
      if (newState) {
        audioRef.current.play().catch(e => console.error('Error playing audio:', e));
      } else {
        audioRef.current.pause();
      }
    }
  };
  
  // Toggle artwork info panel
  const toggleArtworkInfo = () => {
    setShowArtworkInfo(prev => !prev);
  };
  
  // Go to next artwork with fixed camera
  const goToNextArtwork = useCallback(() => {
    if (!selectedCategory) return;
    
    const artworksInCategory = artworks[selectedCategory as keyof typeof artworks];
    if (currentArtworkIndex < artworksInCategory.length - 1) {
      // Save camera position before changing artwork
      const cameraPos = cameraRef.current?.position.clone();
      
      // First update the visual state to prevent flicker
      const nextIndex = currentArtworkIndex + 1;
      
      // Pre-highlight the next artwork before state change to prevent flicker
      updateArtworkHighlight(nextIndex);
      
      // Then update the state
      setCurrentArtworkIndex(nextIndex);
      
      // Automatically show info panel when navigating
      setShowArtworkInfo(true);
      
      // Restore camera position if needed
      if (cameraPos && cameraRef.current) {
        cameraRef.current.position.copy(cameraPos);
      }
    }
  }, [currentArtworkIndex, selectedCategory]);
  
  // Go to previous artwork with fixed camera
  const goToPrevArtwork = useCallback(() => {
    if (!selectedCategory || currentArtworkIndex <= 0) return;
    
    // Save camera position before changing artwork
    const cameraPos = cameraRef.current?.position.clone();
    
    // First update the visual state to prevent flicker
    const prevIndex = currentArtworkIndex - 1;
    
    // Pre-highlight the previous artwork before state change to prevent flicker
    updateArtworkHighlight(prevIndex);
    
    // Then update the state
    setCurrentArtworkIndex(prevIndex);
    
    // Automatically show info panel when navigating
    setShowArtworkInfo(true);
    
    // Restore camera position if needed
    if (cameraPos && cameraRef.current) {
      cameraRef.current.position.copy(cameraPos);
    }
  }, [currentArtworkIndex, selectedCategory]);
  
  // Helper function to update artwork highlight without state change
  const updateArtworkHighlight = useCallback((newIndex: number) => {
    if (!artworkFramesRef.current.length || !selectedCategory) return;
    
    // Reset all artwork highlights
    artworkFramesRef.current.forEach((frame, i) => {
      const isCurrentArtwork = i === newIndex;
      
      // Scale animation with faster duration for immediate effect
      gsap.to(frame.scale, {
        x: isCurrentArtwork ? 1.1 : 1,
        y: isCurrentArtwork ? 1.1 : 1,
        z: isCurrentArtwork ? 1.1 : 1,
        duration: 0.2, // Faster transition
        ease: 'back.out(1.7)',
        overwrite: true // Ensure animations don't stack
      });
      
      // Handle glow effect
      const existingGlow = frame.children.find(child => child.name === 'glow');
      
      if (isCurrentArtwork && !existingGlow) {
        // Add glow to current artwork
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: 0x9c27b0, // Purple glow
          transparent: true,
          opacity: 0.3
        });
        
        const glowMesh = new THREE.Mesh(
          new THREE.BoxGeometry(4.5, 3.5, 0.2),
          glowMaterial
        );
        
        glowMesh.position.z = -0.1;
        glowMesh.name = 'glow';
        frame.add(glowMesh);
        
        // Animate glow
        gsap.to(glowMaterial, {
          opacity: 0.5,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      } else if (!isCurrentArtwork && existingGlow) {
        // Remove glow from non-current artworks
        frame.remove(existingGlow);
        if (existingGlow instanceof THREE.Mesh && existingGlow.material) {
          existingGlow.material.dispose();
        }
      }
      
      // Update spotlight
      if (isCurrentArtwork && sceneRef.current) {
        const spotlight = sceneRef.current.children.find(
          obj => obj instanceof THREE.SpotLight
        ) as THREE.SpotLight | undefined;
        
        if (spotlight && spotlight.target) {
          const posX = frame.position.x;
          
          gsap.to(spotlight.position, {
            x: posX,
            duration: 0.3, // Faster transition
            ease: 'power2.out',
            overwrite: true // Ensure animations don't stack
          });
          
          gsap.to(spotlight.target.position, {
            x: posX, 
            y: 3, 
            z: -4.9,
            duration: 0.3, // Faster transition
            ease: 'power2.out',
            overwrite: true // Ensure animations don't stack
          });
        }
      }
    });
  }, [selectedCategory]);
  
  // Highlight the current artwork - updated to use the new helper function
  const highlightCurrentArtwork = useCallback(() => {
    updateArtworkHighlight(currentArtworkIndex);
  }, [currentArtworkIndex, updateArtworkHighlight]);
  
  // Start the tour
  const startTour = () => {
    setExhibitionState('category-selection');
    
    if (cameraRef.current) {
      gsap.to(cameraRef.current.position, {
        x: 0, y: 3, z: 8,
        duration: 1, ease: 'power2.out'
      });
    }
  };
  
  // Go back to category selection
  const returnToCategorySelection = () => {
    setExhibitionState('category-selection');
    setSelectedCategory(null);
    setShowArtworkInfo(false);
    
    if (cameraRef.current) {
      gsap.to(cameraRef.current.position, {
        x: 0, y: 3, z: 8,
        duration: 1, ease: 'power2.out'
      });
    }
  };
  
  // Load a category with fixed camera
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentArtworkIndex(0);
    setExhibitionState('exhibition-hall');
    setShowArtworkInfo(false);
    
    // Position camera with fixed orientation
    if (cameraRef.current) {
      // Set a fixed position that shows all artworks well
      gsap.to(cameraRef.current.position, {
        x: 0, 
        y: 1.5, 
        z: 10,
        duration: 1.5, 
        ease: 'power2.out'
      });
      
      // Set a fixed rotation looking at the exhibition
      cameraRef.current.lookAt(0, 3, -5);
      
      if (controlsRef.current) {
        // Update controls target to match the look-at point
        controlsRef.current.target.set(0, 3, -5);
        controlsRef.current.update();
      }
    }
    
    // Reset scene
    if (sceneRef.current) {
      const scene = sceneRef.current;
      
      // Clear previous objects
      artworkFramesRef.current = [];
      scene.children.forEach(child => {
        if (!(child instanceof THREE.Light || child === scene)) {
          scene.remove(child);
        }
      });
      
      // Add lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.4));
      
      const mainLight = new THREE.DirectionalLight(0xffffff, 0.6);
      mainLight.position.set(0, 10, 5);
      scene.add(mainLight);
      
      const spotlight = new THREE.SpotLight(0x9c27b0, 2, 20, Math.PI / 6, 0.3, 1); // Purple spotlight
      spotlight.position.set(0, 5, 2);
      scene.add(spotlight);
      scene.add(spotlight.target);
      
      // Add environment
      const carpet = new THREE.Mesh(geometries.carpet, materials.carpet);
      carpet.position.y = -1;
      scene.add(carpet);
      
      const carpetLight = new THREE.PointLight(0x3f51b5, 1, 10); // Indigo carpet light
      carpetLight.position.set(0, -0.5, 0);
      scene.add(carpetLight);
      
      gsap.to(carpetLight, {
        intensity: 1.5,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
      
      const floor = new THREE.Mesh(geometries.floor, materials.floor);
      floor.position.y = -1.05;
      scene.add(floor);
      
      const backWall = new THREE.Mesh(geometries.backWall, materials.wall);
      backWall.position.z = -5;
      backWall.position.y = 4;
      scene.add(backWall);
      
      const leftWall = new THREE.Mesh(geometries.sideWall, materials.wall);
      leftWall.position.x = -15;
      leftWall.position.y = 4;
      scene.add(leftWall);
      
      const rightWall = new THREE.Mesh(geometries.sideWall, materials.wall);
      rightWall.position.x = 15;
      rightWall.position.y = 4;
      scene.add(rightWall);
      
      // Create artworks
      const selectedArtworks = artworks[categoryId as keyof typeof artworks];
      
      // Calculate position for the first artwork to position spotlight correctly later
      const totalArtworks = selectedArtworks.length;
      const firstArtworkPosX = (0 - (totalArtworks - 1) / 2) * 5;
      
      // Position the spotlight on the first artwork in advance
      if (spotlight && spotlight.target) {
        spotlight.position.x = firstArtworkPosX;
        spotlight.target.position.set(firstArtworkPosX, 3, -4.9);
      }
      
      // Load all artworks
      selectedArtworks.forEach((artwork, index) => {
        // Create frame
        const posX = (index - (totalArtworks - 1) / 2) * 5;
        
        const frame = new THREE.Mesh(geometries.frame, materials.frame);
        
        // Add border
        const borderGeometry = new THREE.BoxGeometry(4.2, 3.2, 0.05);
        const borderMesh = new THREE.Mesh(borderGeometry, materials.frameBorder);
        borderMesh.position.z = -0.02;
        frame.add(borderMesh);
        
        frame.position.set(posX, 3, -4.9);
        frame.userData = { 
          type: 'artwork',
          artworkIndex: index,
        };
        
        // Highlight first artwork by scaling it
        if (index === 0) {
          frame.scale.set(1.1, 1.1, 1.1);
        }
        
        // Store reference
        artworkFramesRef.current.push(frame);
        scene.add(frame);
        
        // Create artwork texture
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = function() {
          const texture = new THREE.Texture(img);
          texture.needsUpdate = true;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          
          const artMaterial = new THREE.MeshBasicMaterial({
            map: texture
          });
          
          const art = new THREE.Mesh(geometries.artwork, artMaterial);
          art.position.z = 0.06;
          
          frame.add(art);
          
          // Add glow to first artwork
          if (index === 0) {
            const glowMaterial = new THREE.MeshBasicMaterial({
              color: 0x9c27b0, // Purple glow
              transparent: true,
              opacity: 0.3
            });
            
            const glowMesh = new THREE.Mesh(
              new THREE.BoxGeometry(4.5, 3.5, 0.2),
              glowMaterial
            );
            
            glowMesh.position.z = -0.1;
            glowMesh.name = 'glow';
            frame.add(glowMesh);
            
            // Animate glow
            gsap.to(glowMaterial, {
              opacity: 0.5,
              duration: 1.5,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut'
            });
          }
        };
        
        img.src = artwork.image;
      });
    }
  };
  
  // Apply highlight whenever the current artwork index changes
  useEffect(() => {
    if (exhibitionState === 'exhibition-hall' && selectedCategory) {
      // Use a short timeout to ensure the artwork frames are available
      const timerId = setTimeout(() => {
        highlightCurrentArtwork();
      }, 50);
      
      return () => clearTimeout(timerId);
    }
  }, [currentArtworkIndex, exhibitionState, selectedCategory]);
  
  return (
    <div className="relative w-full h-screen bg-[#0a0a1a]">
      {/* 3D scene container */}
      <div ref={mountRef} className="absolute inset-0" />
      
      {/* Audio toggle */}
      <button
        className="absolute top-24 right-4 z-50 p-3 bg-indigo-900/80 backdrop-blur-sm rounded-full text-white hover:bg-indigo-800"
        onClick={toggleAudio}
      >
        {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
      
      {/* Entrance UI */}
      {exhibitionState === 'entrance' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-1/3 h-full bg-gradient-to-t from-indigo-900 to-purple-700/70 origin-bottom absolute bottom-0 z-0"
          />
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-8 text-center z-10 text-white"
          >
            3D Art Exhibition
          </motion.h1>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            onClick={startTour}
            className="px-6 py-3 bg-indigo-800 hover:bg-indigo-700 text-white rounded-full text-lg font-medium z-10"
          >
            Start Your Tour
          </motion.button>
        </div>
      )}
      
      {/* Category Selection UI */}
      {exhibitionState === 'category-selection' && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-[#0a0a1a]/80 border-2 border-purple-900 backdrop-blur-sm rounded-xl p-8 max-w-3xl">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">
              Select an Art Category
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {artCategories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className="p-4 rounded-lg text-white text-center hover:scale-105 transition-transform border border-purple-900/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ backgroundColor: category.color }}
                >
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.description}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Exhibition Hall UI */}
      {exhibitionState === 'exhibition-hall' && selectedCategory && (
        <>
          {/* Info panel with image */}
          {showArtworkInfo && (
            <div className="absolute right-4 top-36 w-96 bg-[#0a0a1a]/90 backdrop-blur-sm rounded-lg border border-purple-900 p-4 z-20">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-purple-400">
                  {artworks[selectedCategory as keyof typeof artworks][currentArtworkIndex].title}
                </h3>
                <button 
                  className="text-purple-400 hover:text-white"
                  onClick={toggleArtworkInfo}
                >
                  ×
                </button>
              </div>
              
              {/* Artwork image */}
              <div className="mb-3 rounded-md overflow-hidden border border-indigo-900">
                <img 
                  src={artworks[selectedCategory as keyof typeof artworks][currentArtworkIndex].image}
                  alt={artworks[selectedCategory as keyof typeof artworks][currentArtworkIndex].title}
                  className="w-full h-48 object-cover"
                />
              </div>
              
              <p className="text-indigo-300 mb-3 text-sm">
                <span className="font-medium">{artworks[selectedCategory as keyof typeof artworks][currentArtworkIndex].artist}</span>, 
                <span className="opacity-80"> {artworks[selectedCategory as keyof typeof artworks][currentArtworkIndex].year}</span>
              </p>
              
              <p className="text-gray-300 text-sm">
                {artworks[selectedCategory as keyof typeof artworks][currentArtworkIndex].description}
              </p>
            </div>
          )}
          
          {/* Navigation controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 z-10">
            <button
              onClick={goToPrevArtwork}
              disabled={currentArtworkIndex === 0}
              className="p-3 bg-indigo-900/70 backdrop-blur-sm rounded-full text-white hover:bg-indigo-800/90 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={20} />
            </button>
            
            <button
              onClick={toggleArtworkInfo}
              className="px-5 py-3 bg-indigo-800/90 backdrop-blur-sm rounded-full text-white hover:bg-indigo-700/90"
            >
              <Info size={16} className="inline mr-2" />
              {showArtworkInfo ? "Hide Info" : "Show Info"}
            </button>
            
            <button
              onClick={goToNextArtwork}
              disabled={!selectedCategory || currentArtworkIndex === artworks[selectedCategory as keyof typeof artworks].length - 1}
              className="p-3 bg-indigo-900/70 backdrop-blur-sm rounded-full text-white hover:bg-indigo-800/90 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowRight size={20} />
            </button>
          </div>
          
          {/* Back button */}
          <button
            onClick={returnToCategorySelection}
            className="absolute top-24 left-4 z-10 px-4 py-2 bg-indigo-900/80 backdrop-blur-sm rounded-full text-white hover:bg-indigo-800/90"
          >
            ← Back to Categories
          </button>
          
          {/* Artwork counter */}
          <div className="absolute top-24 right-1/2 transform translate-x-1/2 px-4 py-2 bg-indigo-900/80 backdrop-blur-sm rounded-full text-white text-sm z-10">
            {currentArtworkIndex + 1} / {selectedCategory ? artworks[selectedCategory as keyof typeof artworks].length : 0}
          </div>
        </>
      )}
    </div>
  );
};

export default Exhibition3D; 