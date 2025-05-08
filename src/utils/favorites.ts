
// Utility functions for managing favorites

// Types
export interface FavoriteItem {
  id: number;
  name: string;
  type: 'product' | 'project';
  image: string;
  description: string;
  date: string;
}

// Get favorites from localStorage
export const getFavorites = (): FavoriteItem[] => {
  const favorites = localStorage.getItem('favorites');
  if (favorites) {
    try {
      return JSON.parse(favorites);
    } catch (error) {
      console.error('Error parsing favorites:', error);
      return [];
    }
  }
  return [];
};

// Add item to favorites
export const addToFavorites = (item: FavoriteItem): boolean => {
  const favorites = getFavorites();
  
  // Check if already in favorites to avoid duplicates
  const exists = favorites.some(fav => fav.id === item.id && fav.type === item.type);
  
  if (!exists) {
    favorites.push({
      ...item,
      date: new Date().toISOString()
    });
    localStorage.setItem('favorites', JSON.stringify(favorites));
    return true;
  }
  
  return false;
};

// Remove item from favorites
export const removeFromFavorites = (id: number, type: 'product' | 'project'): boolean => {
  const favorites = getFavorites();
  const newFavorites = favorites.filter(item => !(item.id === id && item.type === type));
  
  if (newFavorites.length !== favorites.length) {
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    return true;
  }
  
  return false;
};

// Check if item is in favorites
export const isInFavorites = (id: number, type: 'product' | 'project'): boolean => {
  const favorites = getFavorites();
  return favorites.some(item => item.id === id && item.type === type);
};

// Share functionality
export const shareItem = (item: { id: number; type: string; name: string }): void => {
  const baseUrl = window.location.origin;
  let shareUrl = '';
  
  if (item.type === 'product') {
    shareUrl = `${baseUrl}/produto/${item.id}`;
  } else if (item.type === 'project') {
    shareUrl = `${baseUrl}/workshop/projeto/${item.id}`;
  }
  
  if (navigator.share) {
    navigator.share({
      title: item.name,
      url: shareUrl
    }).catch(err => {
      console.error('Error sharing:', err);
      // Fallback to clipboard
      copyToClipboard(shareUrl);
    });
  } else {
    // Fallback for browsers that don't support the Web Share API
    copyToClipboard(shareUrl);
  }
};

// Helper function to copy to clipboard
const copyToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text)
    .catch(err => {
      console.error('Failed to copy: ', err);
    });
};
