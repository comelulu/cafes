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
        <div className="flex-col cursor-pointer group flex">
            <div className="aspect-square w-full relative overflow-hidden rounded-xl">
                <Link to={`/cafes/${cafe.id}`}>
                    <img
                        src={cafe.photos[0]}
                        alt={cafe.name}
                        loading="lazy"
                        className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-300"
                    />
                </Link>
            </div>

            <Link className="flex flex-col" to={`/cafes/${cafe.id}`}>
                <div className="font-semibold text-[15px] flex items-center justify-between">
                    <span>{cafe.name}</span>
                    <button
                        className="p-1"
                        onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(cafe.id);
                        }}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        {isFavorite ? (
                            <AiFillHeart
                                size={24}
                                className="fill-primary transition-transform duration-200 hover:scale-110"
                            />
                        ) : (
                            <AiOutlineHeart
                                size={24}
                                className="fill-neutral-500/70 transition-transform duration-200 hover:scale-110"
                            />
                        )}
                    </button>
                </div>
                <div className="font-light text-neutral-500 text-[14px]">{cafe.address}</div>
            </Link>
        </div>
    );
};

export default CafeCard;
