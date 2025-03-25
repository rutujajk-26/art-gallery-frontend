// Utility functions for interacting with the Gemini API

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * Sends a prompt to the Gemini API and returns the response text
 */
export async function getGeminiResponse(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API error:', data);
      return 'Sorry, I could not generate a response at this time.';
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return 'Sorry, an error occurred while generating content.';
  }
}

/**
 * Generates AI insights about an artwork
 */
export async function getArtworkInsights(artwork: {
  title: string;
  artist: string;
  year: string;
  description: string;
}): Promise<string> {
  const prompt = `
    Act as an art history expert. Provide interesting insights about this artwork:
    Title: ${artwork.title}
    Artist: ${artwork.artist}
    Year: ${artwork.year}
    Description: ${artwork.description}
    
    Give me 3-4 sentences of expert analysis and interesting facts that would engage museum visitors.
    Focus on technique, historical context, or symbolic elements. Be concise but insightful.
  `;

  return getGeminiResponse(prompt);
}

/**
 * Generates AI recommendations for similar artworks
 */
export async function getSimilarArtworkRecommendations(
  currentArtwork: {
    title: string;
    artist: string;
    year: string;
    description: string;
  },
  availableArtworks: Array<{
    id: string;
    title: string;
    artist: string;
    year: string;
    description: string;
    image: string;
  }>
): Promise<Array<string>> {
  const otherArtworks = availableArtworks.filter(
    art => art.title !== currentArtwork.title
  );

  if (otherArtworks.length === 0) return [];

  const artworksInfo = otherArtworks
    .map((art, index) => 
      `${index + 1}. ${art.title} by ${art.artist} (${art.year}): ${art.description.substring(0, 100)}...`
    )
    .join('\n');

  const prompt = `
    You are an art curator AI. Based on a visitor's interest in this artwork:
    
    Title: ${currentArtwork.title}
    Artist: ${currentArtwork.artist}
    Year: ${currentArtwork.year}
    Description: ${currentArtwork.description}
    
    Recommend 2 similar or related artworks from this list that the visitor might also enjoy:
    
    ${artworksInfo}
    
    Return ONLY the numbers of the recommended artworks (e.g., "1,3"). Do not include any explanation or additional text.
  `;

  const response = await getGeminiResponse(prompt);
  
  // Extract numbers from response
  const recommendationIds = response.match(/\d+/g) || [];
  
  // Map back to artwork ids (limited to 2)
  return recommendationIds
    .slice(0, 2)
    .map(numStr => {
      const index = parseInt(numStr) - 1;
      return index >= 0 && index < otherArtworks.length 
        ? otherArtworks[index].id 
        : '';
    })
    .filter(id => id !== '');
}

/**
 * Generates a voice-like response for an artwork
 */
export async function getArtworkVoiceResponse(artwork: {
  title: string;
  artist: string;
  year: string;
  description: string;
}): Promise<string> {
  const prompt = `
    You are an AI museum guide speaking to a visitor. Give a brief, engaging, and conversational 
    explanation about this artwork as if you're speaking directly to the visitor:
    
    Title: ${artwork.title}
    Artist: ${artwork.artist}
    Year: ${artwork.year}
    Description: ${artwork.description}
    
    Your response should be warm, approachable, and sound like natural speech (30-60 words). Include a 
    greeting and one interesting fact about the work that would surprise the visitor.
  `;

  return getGeminiResponse(prompt);
}

/**
 * Search for artworks based on description
 */
export async function searchArtworksByDescription(
  query: string,
  availableArtworks: Array<{
    id: string;
    title: string;
    artist: string;
    year: string;
    description: string;
  }>
): Promise<Array<string>> {
  const artworksInfo = availableArtworks
    .map((art, index) => 
      `${index + 1}. ${art.title} by ${art.artist} (${art.year}): ${art.description}`
    )
    .join('\n');

  const prompt = `
    You are an art database search engine. A user is searching for: "${query}"
    
    From the following artworks, return the numbers of up to 3 artworks that best match this search:
    
    ${artworksInfo}
    
    Return ONLY the numbers of the matching artworks (e.g., "1,3,5"). Do not include any explanation or additional text.
  `;

  const response = await getGeminiResponse(prompt);
  
  // Extract numbers from response
  const matchingIds = response.match(/\d+/g) || [];
  
  // Map back to artwork ids (limited to 3)
  return matchingIds
    .slice(0, 3)
    .map(numStr => {
      const index = parseInt(numStr) - 1;
      return index >= 0 && index < availableArtworks.length 
        ? availableArtworks[index].id 
        : '';
    })
    .filter(id => id !== '');
} 