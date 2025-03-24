export interface Artwork {
  id: number;
  title: string;
  artist: string;
  year: string;
  medium: string;
  image: string;
  description: string;
  dimensions: string;
  category: ArtworkCategory;
  dominantColors?: string[];
  tags: string[];
}

export type ArtworkCategory = 
  | 'Renaissance'
  | 'Modern'
  | 'Contemporary'
  | 'Abstract'
  | 'Impressionism'
  | 'Surrealism';

export interface Exhibition {
  id: number;
  title: string;
  description: string;
  curator: string;
  artworks: Artwork[];
  theme: string;
  startDate: string;
  endDate: string;
  image: string;
}