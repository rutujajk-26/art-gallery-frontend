import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { ArrowLeft, ArrowRight, Volume2, VolumeX, Info, Sparkles, MessageSquare, Headphones } from 'lucide-react';
import { getArtworkInsights, getArtworkVoiceResponse, getSimilarArtworkRecommendations } from '../utils/geminiApi';

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

// Global texture cache
const textureCache = new Map<string, THREE.Texture>();

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
  
  // AI-related state
  const [aiInsights, setAiInsights] = useState<string>('');
  const [isLoadingInsights, setIsLoadingInsights] = useState<boolean>(false);
  const [aiVoiceResponse, setAiVoiceResponse] = useState<string>('');
  const [isLoadingVoice, setIsLoadingVoice] = useState<boolean>(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState<boolean>(false);
  const [similarArtworkIds, setSimilarArtworkIds] = useState<string[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState<boolean>(false);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  
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
    
    // Only start animation if all components are initialized
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      animate();
    }
    
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
    const audio = new Audio();
    audio.src = '/audio/exhibition-ambient.mp3';
    audio.loop = true;
    audio.volume = 0.3;
    
    // Add error handling for audio
    audio.addEventListener('error', (e) => {
      console.warn('Audio error:', e);
      // Continue without audio if there's an issue
    });
    
    audioRef.current = audio;
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      // Dispose renderer
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      
      // Clear scene
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) {
              object.geometry.dispose();
            }
            
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => {
                  disposeMaterial(material);
                });
              } else {
                disposeMaterial(object.material);
              }
            }
          }
        });
      }
      
      // Clean up audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Helper function to dispose materials
  const disposeMaterial = (material: THREE.Material) => {
    // Cast to MeshBasicMaterial or MeshStandardMaterial which have maps
    if (material instanceof THREE.MeshBasicMaterial || material instanceof THREE.MeshStandardMaterial) {
      if (material.map) material.map.dispose();
    }
    
    // Cast to relevant material types for specific properties
    if (material instanceof THREE.MeshStandardMaterial) {
      if (material.lightMap) material.lightMap.dispose();
      if (material.aoMap) material.aoMap.dispose();
      if (material.emissiveMap) material.emissiveMap.dispose();
      if (material.bumpMap) material.bumpMap.dispose();
      if (material.normalMap) material.normalMap.dispose();
      if (material.displacementMap) material.displacementMap.dispose();
      if (material.roughnessMap) material.roughnessMap.dispose();
      if (material.metalnessMap) material.metalnessMap.dispose();
      if (material.alphaMap) material.alphaMap.dispose();
      if (material.envMap) material.envMap.dispose();
    }
    
    // Always dispose the material itself
    material.dispose();
  };
  
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
    
    // If showing the panel, fetch AI insights for the current artwork
    if (!showArtworkInfo && selectedCategory) {
      fetchAiInsights();
      fetchSimilarArtworks();
    }
  };
  
  // Fetch AI insights about current artwork
  const fetchAiInsights = async () => {
    if (!selectedCategory) return;
    
    const currentArtwork = artworks[selectedCategory as keyof typeof artworks][currentArtworkIndex];
    setIsLoadingInsights(true);
    
    try {
      const insights = await getArtworkInsights(currentArtwork);
      setAiInsights(insights);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      setAiInsights('I couldn\'t generate insights for this artwork at the moment.');
    } finally {
      setIsLoadingInsights(false);
    }
  };
  
  // Fetch similar artworks based on the current one
  const fetchSimilarArtworks = async () => {
    if (!selectedCategory) return;
    
    const currentArtwork = artworks[selectedCategory as keyof typeof artworks][currentArtworkIndex];
    setIsLoadingRecommendations(true);
    
    try {
      // Get all artworks from the current category
      const categoryArtworks = artworks[selectedCategory as keyof typeof artworks];
      
      // Generate recommendations
      const recommendedIds = await getSimilarArtworkRecommendations(
        currentArtwork,
        categoryArtworks.map(art => ({ ...art }))
      );
      
      setSimilarArtworkIds(recommendedIds);
    } catch (error) {
      console.error('Error fetching similar artworks:', error);
      setSimilarArtworkIds([]);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };
  
  // Handle AI voice guidance
  const handleAiVoiceGuidance = async () => {
    if (!selectedCategory) return;
    
    if (isPlayingVoice) {
      // Stop current voice playback
      window.speechSynthesis.cancel();
      setIsPlayingVoice(false);
      return;
    }
    
    const currentArtwork = artworks[selectedCategory as keyof typeof artworks][currentArtworkIndex];
    setIsLoadingVoice(true);
    
    try {
      // If we already have a response for this artwork, use it
      if (!aiVoiceResponse) {
        const response = await getArtworkVoiceResponse(currentArtwork);
        setAiVoiceResponse(response);
      }
      
      // Use Speech Synthesis to speak the response
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiVoiceResponse || 'Loading AI response...');
        
        // Configure voice settings for more natural sound
        utterance.rate = 0.9; // Slightly slower
        utterance.pitch = 1.0; // Natural pitch
        
        // Get available voices and try to select a good one
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          voice => voice.lang === 'en-US' && voice.name.includes('Female')
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        // Handle speech end
        utterance.onend = () => {
          setIsPlayingVoice(false);
        };
        
        speechSynthRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlayingVoice(true);
      } else {
        console.warn('Speech synthesis not supported in this browser');
      }
    } catch (error) {
      console.error('Error with AI voice guidance:', error);
    } finally {
      setIsLoadingVoice(false);
    }
  };
  
  // Go to specific artwork by ID
  const goToArtworkById = (artworkId: string) => {
    if (!selectedCategory) return;
    
    const categoryArtworks = artworks[selectedCategory as keyof typeof artworks];
    const index = categoryArtworks.findIndex(art => art.id === artworkId);
    
    if (index !== -1) {
      // Save camera position before changing artwork
      const cameraPos = cameraRef.current?.position.clone();
      
      // Pre-highlight the next artwork before state change to prevent flicker
      updateArtworkHighlight(index);
      
      // Update the state
      setCurrentArtworkIndex(index);
      
      // Show info panel automatically
      setShowArtworkInfo(true);
      
      // Restore camera position if needed
      if (cameraPos && cameraRef.current) {
        cameraRef.current.position.copy(cameraPos);
      }
      
      // Fetch new insights and recommendations
      fetchAiInsights();
      fetchSimilarArtworks();
    }
  };
  
  // Reset AI state when changing artworks
  useEffect(() => {
    if (selectedCategory) {
      setAiInsights('');
      setAiVoiceResponse('');
      setSimilarArtworkIds([]);
      
      // Stop any ongoing speech
      if (isPlayingVoice) {
        window.speechSynthesis.cancel();
        setIsPlayingVoice(false);
      }
    }
  }, [currentArtworkIndex, selectedCategory]);
  
  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (speechSynthRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
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
        
        // Create a temporary placeholder while image loads
        const placeholderMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x262626,
          transparent: true,
          opacity: 0.7
        });
        const placeholderArt = new THREE.Mesh(geometries.artwork, placeholderMaterial);
        placeholderArt.position.z = 0.06;
        frame.add(placeholderArt);
        
        // Add loading indicator
        const loadingGeometry = new THREE.RingGeometry(0.5, 0.6, 32);
        const loadingMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x9c27b0,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide
        });
        const loadingRing = new THREE.Mesh(loadingGeometry, loadingMaterial);
        loadingRing.position.z = 0.07;
        loadingRing.name = 'loadingIndicator';
        frame.add(loadingRing);
        
        // Animate loading indicator
        gsap.to(loadingRing.rotation, {
          z: Math.PI * 2,
          duration: 1.5,
          repeat: -1,
          ease: 'none'
        });
        
        // Check texture cache first
        if (textureCache.has(artwork.image)) {
          console.log(`Using cached texture for: ${artwork.image}`);
          
          // Remove placeholder and loading indicator
          frame.remove(placeholderArt);
          const loadingIndicator = frame.children.find(child => child.name === 'loadingIndicator');
          if (loadingIndicator) {
            frame.remove(loadingIndicator);
          }
          
          // Use cached texture
          const cachedTexture = textureCache.get(artwork.image)!;
          const artMaterial = new THREE.MeshBasicMaterial({
            map: cachedTexture
          });
          
          const art = new THREE.Mesh(geometries.artwork, artMaterial);
          art.position.z = 0.06;
          art.name = 'artwork';
          
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
          
          return; // Skip loading image
        }
        
        // Create artwork texture
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = function() {
          const texture = new THREE.Texture(img);
          texture.needsUpdate = true;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          
          // Add to texture cache
          textureCache.set(artwork.image, texture);
          
          const artMaterial = new THREE.MeshBasicMaterial({
            map: texture
          });
          
          // Remove placeholder and loading indicator
          frame.remove(placeholderArt);
          const loadingIndicator = frame.children.find(child => child.name === 'loadingIndicator');
          if (loadingIndicator) {
            frame.remove(loadingIndicator);
          }
          
          const art = new THREE.Mesh(geometries.artwork, artMaterial);
          art.position.z = 0.06;
          art.name = 'artwork';
          
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
        
        img.onerror = function() {
          console.warn(`Failed to load image: ${artwork.image}`);
          
          // Remove loading indicator
          const loadingIndicator = frame.children.find(child => child.name === 'loadingIndicator');
          if (loadingIndicator) {
            frame.remove(loadingIndicator);
          }
          
          // Remove placeholder
          frame.remove(placeholderArt);
          
          // Create error texture with text
          const canvas = document.createElement('canvas');
          canvas.width = 384;
          canvas.height = 280;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            // Draw error background
            ctx.fillStyle = '#262626';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw border
            ctx.strokeStyle = '#9c27b0';
            ctx.lineWidth = 6;
            ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
            
            // Draw text
            ctx.fillStyle = '#ffffff';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(artwork.title, canvas.width / 2, canvas.height / 2 - 30);
            ctx.font = '18px Arial';
            ctx.fillText('Image failed to load', canvas.width / 2, canvas.height / 2 + 10);
            ctx.fillText('by ' + artwork.artist, canvas.width / 2, canvas.height / 2 + 40);
          }
          
          const errorTexture = new THREE.CanvasTexture(canvas);
          const errorMaterial = new THREE.MeshBasicMaterial({ map: errorTexture });
          const errorArt = new THREE.Mesh(geometries.artwork, errorMaterial);
          errorArt.position.z = 0.06;
          errorArt.name = 'artwork-error';
          
          frame.add(errorArt);
          
          // Add glow to first artwork even if it fails to load
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
        
        // Set a timeout to detect stalled image loads
        const imageLoadTimeout = setTimeout(() => {
          // If image hasn't loaded or errored after 10 seconds, trigger error handler
          if (!img.complete && typeof img.onerror === 'function') {
            const timeoutEvent = new Event('timeout');
            img.onerror(timeoutEvent);
          }
        }, 10000);
        
        // Start loading the image
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
    <div className="relative w-full h-screen min-h-[600px] bg-[#0a0a1a]">
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
            AI-Powered 3D Art Exhibition
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-xl text-center max-w-md z-10 text-white mb-8"
          >
            Experience art with AI voice guidance, insights, and personalized recommendations
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            onClick={startTour}
            className="px-6 py-3 bg-indigo-800 hover:bg-indigo-700 text-white rounded-full text-lg font-medium z-10 flex items-center"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Your AI-Guided Tour
          </motion.button>
        </div>
      )}
      
      {/* Category Selection UI */}
      {exhibitionState === 'category-selection' && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-[#0a0a1a]/80 border-2 border-purple-900 backdrop-blur-sm rounded-xl p-8 max-w-3xl">
            <h2 className="text-2xl font-bold mb-2 text-white text-center">
              Select an Art Category
            </h2>
            
            <p className="text-center text-indigo-300 mb-6">
              Our AI will provide insights and recommendations as you explore
            </p>
            
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
          {/* Info panel with image and AI insights */}
          {showArtworkInfo && (
            <div className="absolute right-4 top-36 w-96 max-h-[70vh] overflow-y-auto bg-[#0a0a1a]/90 backdrop-blur-sm rounded-lg border border-purple-900 p-4 z-20">
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
              
              <p className="text-gray-300 text-sm mb-4">
                {artworks[selectedCategory as keyof typeof artworks][currentArtworkIndex].description}
              </p>
              
              {/* AI Voice Guide Button */}
              <button
                onClick={handleAiVoiceGuidance}
                disabled={isLoadingVoice}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 mb-4 bg-indigo-900/50 hover:bg-indigo-900/80 rounded-lg text-white text-sm font-medium disabled:opacity-50"
              >
                {isPlayingVoice ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    Stop AI Voice Guide
                  </>
                ) : isLoadingVoice ? (
                  <>
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    Loading Voice...
                  </>
                ) : (
                  <>
                    <Headphones className="w-4 h-4" />
                    Listen to AI Voice Guide
                  </>
                )}
              </button>
              
              {/* AI Insights Section */}
              <div className="mb-4">
                <h4 className="text-indigo-400 text-sm font-semibold flex items-center mb-2">
                  <Sparkles className="w-4 h-4 mr-1" />
                  AI Art Insights
                </h4>
                <div className="border border-indigo-900/50 rounded-lg p-3 bg-indigo-950/30">
                  {isLoadingInsights ? (
                    <div className="flex items-center justify-center py-3">
                      <div className="w-5 h-5 border-2 border-t-transparent border-indigo-400 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-300 italic">
                      {aiInsights || "Tap the info button to generate AI insights about this artwork."}
                    </p>
                  )}
                </div>
              </div>
              
              {/* AI Recommendations Section */}
              <div>
                <h4 className="text-indigo-400 text-sm font-semibold flex items-center mb-2">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Similar Artworks You Might Like
                </h4>
                <div className="border border-indigo-900/50 rounded-lg p-3 bg-indigo-950/30">
                  {isLoadingRecommendations ? (
                    <div className="flex items-center justify-center py-3">
                      <div className="w-5 h-5 border-2 border-t-transparent border-indigo-400 rounded-full animate-spin"></div>
                    </div>
                  ) : similarArtworkIds.length > 0 ? (
                    <div className="space-y-2">
                      {similarArtworkIds.map(id => {
                        const artwork = artworks[selectedCategory as keyof typeof artworks].find(art => art.id === id);
                        if (!artwork) return null;
                        
                        return (
                          <button
                            key={id}
                            onClick={() => goToArtworkById(id)}
                            className="w-full text-left p-2 hover:bg-indigo-900/30 rounded-lg flex items-center gap-2 transition-colors"
                          >
                            <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                              <img 
                                src={artwork.image} 
                                alt={artwork.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-indigo-200 text-xs font-medium">{artwork.title}</p>
                              <p className="text-gray-400 text-xs">{artwork.artist}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-300">
                      Explore more artworks to get personalized recommendations.
                    </p>
                  )}
                </div>
              </div>
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
              className="px-5 py-3 bg-indigo-800/90 backdrop-blur-sm rounded-full text-white hover:bg-indigo-700/90 flex items-center"
            >
              <Info size={16} className="inline mr-2" />
              {showArtworkInfo ? "Hide Info" : "Show AI Insights"}
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
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-indigo-900/80 backdrop-blur-sm rounded-full text-white text-sm z-10">
            {currentArtworkIndex + 1} / {selectedCategory ? artworks[selectedCategory as keyof typeof artworks].length : 0}
          </div>
        </>
      )}
    </div>
  );
};

export default Exhibition3D; 