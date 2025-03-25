import { create } from 'zustand';
import { Artwork } from '../types/artwork';

interface StoreState {
  isDarkMode: boolean;
  viewedArtworks: Artwork[];
  currentExhibition: number | null;
  setDarkMode: (isDark: boolean) => void;
  addViewedArtwork: (artwork: Artwork) => void;
  setCurrentExhibition: (id: number | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  isDarkMode: false,
  viewedArtworks: [],
  currentExhibition: null,
  
  setDarkMode: (isDark) => set({ isDarkMode: isDark }),
  addViewedArtwork: (artwork) => 
    set((state) => ({
      viewedArtworks: [...state.viewedArtworks, artwork]
    })),
  setCurrentExhibition: (id) => set({ currentExhibition: id })
}));