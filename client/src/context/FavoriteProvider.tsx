import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the type for the context value
interface FavoriteContextType {
  favorites: string[];
  toggleFavorite: (cafeId: string) => void;
}

// Create the context with an initial undefined value
const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

// Custom hook to use the Favorite context
export const useFavorite = (): FavoriteContextType => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorite must be used within a FavoriteProvider");
  }
  return context;
};

// Define the props for FavoriteProvider
interface FavoriteProviderProps {
  children: ReactNode;
}

export const FavoriteProvider = ({ children }: FavoriteProviderProps) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const savedFavorites = localStorage.getItem("favorites");
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch {
      return [];
    }
  });

  // Function to save favorites to localStorage
  const saveFavoritesToLocalStorage = (favorites: string[]) => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  // Update localStorage whenever favorites change
  useEffect(() => {
    saveFavoritesToLocalStorage(favorites);
  }, [favorites]);

  const toggleFavorite = (cafeId: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(cafeId)
        ? prevFavorites.filter((id) => id !== cafeId)
        : [...prevFavorites, cafeId]
    );
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};
