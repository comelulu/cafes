import { useState, useEffect, useCallback, useMemo } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useFavorite } from "../../context/FavoriteProvider";
import { PiSlidersHorizontal } from "react-icons/pi";
import { FaTimes, FaHeart, FaChevronDown } from "react-icons/fa";
import { getCafeById } from "../../api";
import NavbarContainer from "./NavbarContainer";

interface Cafe {
    id: string;
    name: string;
    address: string;
}

interface NavbarProps {
    isDetailPage: boolean;
}

const Navbar = ({ isDetailPage }: NavbarProps): JSX.Element => {
    const [showFavorites, setShowFavorites] = useState<boolean>(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [selectedSummary, setSelectedSummary] = useState<string>("");
    const [showFilterModal, setShowFilterModal] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const isSpecialRoute = ["/login", "/admin"].some(route => location.pathname.startsWith(route));

    const { favorites, toggleFavorite } = useFavorite();
    const [favoriteDetails, setFavoriteDetails] = useState<Cafe[]>([]);
    const favoriteCache = useMemo(() => new Map<number, Cafe>(), []);

    useEffect(() => {
        const storedFilterQuery = localStorage.getItem("filterQuery");
        const storedSummary = localStorage.getItem("selectedSummary");

        if (storedFilterQuery) setFilterQuery(storedFilterQuery);
        if (storedSummary) setSelectedSummary(storedSummary);
    }, []);

    useEffect(() => {
        localStorage.setItem("filterQuery", filterQuery);
    }, [filterQuery]);

    useEffect(() => {
        if (selectedSummary) {
            localStorage.setItem("selectedSummary", selectedSummary);
        } else {
            localStorage.removeItem("selectedSummary");
        }
    }, [selectedSummary]);

    const toggleFavorites = useCallback(() => {
        setShowFavorites((prev) => !prev);
    }, []);

    useEffect(() => {
        const fetchFavoritesDetails = async () => {
            const details = await Promise.all(
                favorites.map(async (favoriteId) => {
                    const id = Number(favoriteId);
                    if (favoriteCache.has(id)) {
                        return favoriteCache.get(id)!;
                    } else {
                        const response = await getCafeById(id);
                        const data = response.data.data as unknown as Cafe;

                        if (data && data.name && data.address) {
                            favoriteCache.set(id, data);
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

    useEffect(() => {
        if (isSpecialRoute) return;

        const urlParams = new URLSearchParams();
        if (selectedSummary) {
            urlParams.set("summary", selectedSummary);
        }
        if (filterQuery.trim()) {
            urlParams.set("query", filterQuery);
        }

        navigate(`/?${urlParams.toString()}`, { replace: true });
    }, [filterQuery, selectedSummary, navigate, isSpecialRoute]);

    const handleFilterApply = () => {
        setShowFilterModal(false);
    };

    return (
        <NavbarContainer>
            <header className={`flex items-center justify-between py-4 px-6 ${isDetailPage ? "max-w-screen-xl mx-auto" : ""}`}>
                <Link to="/" className="flex items-center gap-2">
                    <img src="/logo.png" alt="Cafe Spot Logo" className="w-24 h-14" />
                </Link>

                <div className="hidden md:flex items-center gap-2 mx-4 flex-1 justify-center">
                    <div className="relative w-80">
                        <input
                            type="text"
                            placeholder="Search cafes"
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            className="w-full px-4 py-2 text-gray-500 border-b border-gray-300 focus:outline-none focus:border-b-2 focus:border-yellow-500 placeholder-gray-400"
                        />
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="w-5 h-5"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </span>
                    </div>

                    <button
                        onClick={() => setShowFilterModal(true)}
                        className="flex items-center gap-1 px-4 py-2 border border-yellow-500 text-yellow-600 rounded-full hover:bg-yellow-50"
                    >
                        필터 <PiSlidersHorizontal className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative flex items-center gap-4">
                    <button
                        onClick={toggleFavorites}
                        className="font-medium bg-warning text-primary flex items-center gap-1 px-4 py-3 rounded-lg hover:bg-secondary transition-shadow duration-200"
                    >
                        My <FaHeart className="text-primary" />s List <FaChevronDown className="text-primary" />
                    </button>

                    {showFavorites && (
                        <div className="absolute right-0 top-full mt-1 w-64 bg-[#F8E1C3] shadow-lg z-50 p-4 flex flex-col rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-semibold text-[#B37E2E] flex items-center gap-1">My <FaHeart className="text-primary" />Likes List</h4>
                                <button onClick={() => setShowFavorites(false)}>
                                    <FaTimes className="text-[#B37E2E]" />
                                </button>
                            </div>
                            <ul className="flex-1 overflow-y-auto">
                                {favoriteDetails.length > 0 ? (
                                    favoriteDetails.map((favorite) => (
                                        <li key={favorite.id} className="flex items-center justify-between mb-3">
                                            <Link
                                                to={`/cafes/${favorite.id}`}
                                                className="text-black font-medium"
                                                onClick={() => setShowFavorites(false)}
                                            >
                                                {favorite.name}
                                            </Link>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavorite(favorite.id);
                                                }}
                                                className="text-[#B37E2E]"
                                            >
                                                <FaHeart />
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-600">No favorites added</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </header>

            {showFilterModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-[90%] max-w-xl p-6 shadow-lg">
                        <h3 className="text-xl font-semibold mb-4 text-gray-700">Summary</h3>
                        <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { display: "근교", value: "suburban" },
                                    { display: "대형", value: "large" },
                                    { display: "디저트", value: "dessert" },
                                    { display: "루프탑", value: "rooftop" },
                                    { display: "북카페", value: "bookCafe" },
                                    { display: "뷰맛집", value: "scenicView" },
                                    { display: "복합문화", value: "culturalComplex" },
                                    { display: "건축/테마", value: "architectureTheme" }
                                ].map((summary) => (
                                    <button
                                        key={summary.value}
                                        onClick={() =>
                                            setSelectedSummary((prev) =>
                                                prev === summary.value ? "" : summary.value
                                            )
                                        }
                                        className={`px-4 py-2 rounded-full border ${selectedSummary === summary.value
                                            ? "bg-yellow-500 text-white border-yellow-500"
                                            : "text-yellow-600 border-yellow-500"
                                            }`}
                                    >
                                        {summary.display}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowFilterModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFilterApply}
                                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </NavbarContainer>
    );
};

interface LayoutProps {
    isDetailPage: boolean;
}

const Layout = ({ isDetailPage }: LayoutProps): JSX.Element => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith("/admin");

    return (
        <div>
            {!isAdminRoute && <Navbar isDetailPage={isDetailPage} />}
            <Outlet />
        </div>
    );
};

export default Layout;
