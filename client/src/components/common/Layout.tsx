import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
    const summaryTranslations = {
        suburban: "근교",
        large: "대형",
        dessert: "디저트",
        rooftop: "루프탑",
        bookCafe: "북카페",
        scenicView: "뷰맛집",
        culturalComplex: "복합문화",
        architectureTheme: "건축/테마"
    };

    const [showFavorites, setShowFavorites] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [selectedSummary, setSelectedSummary] = useState<string>("");
    const [showFilterModal, setShowFilterModal] = useState(false);

    const filterModalRef = useRef<HTMLDivElement>(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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

    const toggleFilterModal = useCallback(() => {
        if (!isButtonDisabled) {
            setShowFilterModal((prev) => !prev);
            setIsButtonDisabled(true);

            setTimeout(() => {
                setIsButtonDisabled(false);
            }, 300);
        }
    }, [isButtonDisabled]);

    const handleFilterApply = () => {
        setShowFilterModal(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterModalRef.current && !filterModalRef.current.contains(event.target as Node)) {
                setShowFilterModal(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <NavbarContainer>
            <header className={`flex items-center justify-between py-4 px-6 ${isDetailPage ? "max-w-screen-xl mx-auto" : ""}`}>
                <Link to="/" className="flex items-center gap-2">
                    <img src="/logo.png" alt="Cafe Spot Logo" className="w-24 h-14" />
                </Link>

                {/* Set relative positioning for the filter area */}
                <div className="relative hidden md:flex items-center gap-2 mx-4 flex-1 justify-center">
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
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleFilterModal();
                        }}
                        disabled={isButtonDisabled}
                        className="flex items-center gap-1 px-4 py-2 border border-primary text-primary rounded-full"
                    >
                        {selectedSummary ? summaryTranslations[selectedSummary as keyof typeof summaryTranslations] : "필터"}
                        <PiSlidersHorizontal className="w-5 h-5" />
                    </button>

                    {showFilterModal && (
                        <div ref={filterModalRef} className="absolute top-full mt-2 w-auto bg-white rounded-lg shadow-lg p-4 z-50">
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                    {/* Filter options */}
                                    {Object.entries(summaryTranslations).map(([value, display]) => (
                                        <button
                                            key={value}
                                            onClick={() => setSelectedSummary((prev) => (prev === value ? "" : value))}
                                            className={`px-4 py-2 rounded-full border ${selectedSummary === value ? "bg-primary text-white border-primary-400" : "text-[#D1B282] border-[#D1B282]"}`}
                                        >
                                            {display}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowFilterModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleFilterApply}
                                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
                                >
                                    적용하기
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative flex items-center gap-4">
                    <button
                        onClick={toggleFavorites}
                        className="font-medium bg-secondary text-primary flex items-center gap-1 px-4 py-3 rounded-lg "
                    >
                        My <FaHeart className="text-primary" />s List <FaChevronDown className="text-primary" />
                    </button>
                </div>
            </header>

            {showFavorites && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                        onClick={() => setShowFavorites(false)}
                    ></div>

                    <div className="fixed top-0 right-0 w-80 h-full bg-[#F8E1C3] shadow-lg z-50 flex flex-col transform transition-transform duration-300 ease-in-out translate-x-0">
                        <button
                            onClick={() => setShowFavorites(false)}
                            className="absolute top-4 right-4 text-[#B37E2E]"
                        >
                            <FaTimes />
                        </button>

                        <div className="flex items-center justify-center h-32">
                            <h4 className="text-2xl font-semibold text-[#B37E2E] flex items-center gap-1">
                                My <FaHeart className="text-primary" /> Likes List
                            </h4>
                        </div>

                        <ul className="flex-1 overflow-y-auto bg-white p-5">
                            {favoriteDetails.length > 0 ? (
                                favoriteDetails.map((favorite) => (
                                    <li key={favorite.id} className="flex items-center justify-between mb-5">
                                        <Link
                                            to={`/cafes/${favorite.id}`}
                                            className="text-gray-900 font-bold text-lg"
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
                </>
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
