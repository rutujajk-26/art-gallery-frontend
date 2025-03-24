import { create } from 'zustand';
import { Artwork } from '../types/artwork';

interface StoreState {
  lightingMode: 'daylight' | 'dim' | 'spotlight';
  isDarkMode: boolean;
  viewedArtworks: Artwork[];
  currentExhibition: number | null;
  setLightingMode: (mode: 'daylight' | 'dim' | 'spotlight') => void;
  setDarkMode: (isDark: boolean) => void;
  addViewedArtwork: (artwork: Artwork) => void;
  setCurrentExhibition: (id: number | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  lightingMode: 'daylight',
  isDarkMode: false,
  viewedArtworks: [],
  currentExhibition: null,
  
  setLightingMode: (mode) => set({ lightingMode: mode }),
  setDarkMode: (isDark) => set({ isDarkMode: isDark }),
  addViewedArtwork: (artwork) => 
    set((state) => ({
      viewedArtworks: [...state.viewedArtworks, artwork]
    })),
  setCurrentExhibition: (id) => set({ currentExhibition: id })
}));