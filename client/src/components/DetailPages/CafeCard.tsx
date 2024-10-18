import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useFavorite } from "../../context/FavoriteProvider";

interface Cafe {
    id: string;
    name: string;
    photos: string[];
    address: string;
}

interface CafeCardProps {
    cafe: Cafe;
}

const CafeCard = ({ cafe }: CafeCardProps): JSX.Element => {
    const { favorites, toggleFavorite } = useFavorite();
    const isFavorite = favorites.includes(cafe.id);

    return (
        <div className="col-span-1 cursor-pointer group">
            <div className="aspect-square w-full relative overflow-hidden rounded-xl">
                <Link to={`/cafes/${cafe.id}`}>
                    <img
                        src={cafe.photos[0]}
                        alt={cafe.name}
                        loading="lazy"
                        className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-300"
                    />
                </Link>

                {/* Heart Icon */}
                <button
                    className="absolute top-3 right-3 p-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(cafe.id);
                    }}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                    {isFavorite ? (
                        <AiFillHeart
                            size={28}
                            className="fill-rose-500 transition-transform duration-200 hover:scale-110"
                        />
                    ) : (
                        <AiOutlineHeart
                            size={28}
                            className="fill-neutral-500/70 transition-transform duration-200 hover:scale-110"
                        />
                    )}
                </button>
            </div>
            <Link to={`/cafes/${cafe.id}`}>
                <div className="font-semibold text-lg mt-2">{cafe.name}</div>
                <div className="font-light text-neutral-500">{cafe.address}</div>
            </Link>
        </div>
    );
};

export default CafeCard;
