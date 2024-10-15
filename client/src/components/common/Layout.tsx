import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Outlet, Link } from "react-router-dom";
import Container from "./Container";
import { useFavorite } from "../../context/FavoriteProvider";
import { FaTimes } from "react-icons/fa";
import { getCafeById } from "../../api";

interface Cafe {
    id: string;
    name: string;
    address: string;
}

interface NavbarProps {
    isDetailPage: boolean;
}

interface FavoriteListProps {
    details: Cafe[];
}

const Navbar: React.FC<NavbarProps> = ({ isDetailPage }) => {
    const [showFavorites, setShowFavorites] = useState<boolean>(false);
    const { favorites, toggleFavorite } = useFavorite();
    const [favoriteDetails, setFavoriteDetails] = useState<Cafe[]>([]);

    // Cache for fetched favorite cafe details
    const favoriteCache = useMemo(() => new Map<number, Cafe>(), []);

    const toggleFavorites = useCallback(() => {
        setShowFavorites((prev) => !prev);
    }, []);

    // Fetch favorite cafe details when favorites change
    useEffect(() => {
        const fetchFavoritesDetails = async () => {
            const details = await Promise.all(
                favorites.map(async (favoriteId) => {
                    const id = Number(favoriteId); // Convert to number if necessary
                    if (favoriteCache.has(id)) {
                        return favoriteCache.get(id)!; // Use cached data
                    } else {
                        const response = await getCafeById(id);
                        const data = response.data.data as unknown as Cafe;

                        // Ensure data has all required fields or handle optional fields
                        if (data && data.name && data.address) { // Check if all required fields are present
                            favoriteCache.set(id, data); // Add to cache
                            return data;
                        } else {
                            throw new Error("Invalid cafe data received");
                        }
                    }
                })
            );
            setFavoriteDetails(details);
        };

        if (favorites.length > 0) {
            fetchFavoritesDetails();
        } else {
            setFavoriteDetails([]);
        }
    }, [favorites, favoriteCache]);

    const FavoriteList: React.FC<FavoriteListProps> = ({ details }) => (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            <h4 className="px-4 py-2 font-semibold text-gray-700">Your Favorites</h4>
            <ul>
                {details.length > 0 ? (
                    details.map((favorite) => (
                        <li
                            key={favorite.id}
                            className="px-4 py-2 flex items-center justify-between hover:bg-gray-100"
                        >
                            <Link
                                to={`/cafes/${favorite.id}`}
                                className="text-gray-600"
                                onClick={() => setShowFavorites(false)}
                            >
                                {favorite.name}
                            </Link>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(favorite.id);
                                }}
                                className="ml-2 text-gray-400 hover:text-red-600"
                            >
                                <FaTimes />
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="px-4 py-2 text-gray-600">No favorites added</li>
                )}
            </ul>
        </div>
    );

    return (
        <Container>
            <header
                className={`flex items-center justify-between py-4 border-b border-gray-200 ${isDetailPage ? "max-w-screen-xl mx-auto" : ""
                    }`}
            >
                <Link to="/" className="flex items-center gap-1">
                    {/* Left - Logo */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-8 h-8 text-brown-600"
                    >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                    <span className="font-bold text-xl text-brown-700">CafeShare</span>
                </Link>

                {/* Right - User Menu & Favorites */}
                <div className="relative">
                    <button
                        onClick={toggleFavorites}
                        className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4 hover:shadow-md transition-shadow duration-200"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6 text-gray-700"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                        <div className="bg-gray-500 text-white rounded-full p-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </button>

                    {showFavorites && <FavoriteList details={favoriteDetails} />}
                </div>
            </header>
        </Container>
    );
};

interface LayoutProps {
    isDetailPage: boolean;
}

const Layout: React.FC<LayoutProps> = ({ isDetailPage }) => (
    <div>
        <Navbar isDetailPage={isDetailPage} />
        <Outlet />
    </div>
);

export default Layout;
