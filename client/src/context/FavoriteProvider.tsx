import { createContext, useContext, useState, useEffect, ReactNode } from "react";
interface FavoriteContextType {
  favorites: string[];
  toggleFavorite: (cafeId: string) => void;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const useFavorite = (): FavoriteContextType => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorite must be used within a FavoriteProvider");
  }
  return context;
};

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

  const saveFavoritesToLocalStorage = (favorites: string[]) => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

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
