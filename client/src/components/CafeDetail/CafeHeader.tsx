import { FaHeart, FaRegHeart, FaRegShareSquare } from "react-icons/fa";
import { LuUpload } from "react-icons/lu";
import AddressLink from "./AddressLink";
import { useFavorite } from "../../context/FavoriteProvider";

interface CafeHeaderProps {
    id: string;
    name: string;
    address: string;
    onShare: () => void;
}

function CafeHeader({ id, name, address, onShare }: CafeHeaderProps): JSX.Element {
    const { favorites, toggleFavorite } = useFavorite();
    const isFavorited = favorites.includes(id);

    return (
        <div className="flex flex-col justify-between mt-7">
            <h2 className="text-3xl font-semibold text-darkBrown">{name}</h2>
            <div className="flex justify-between items-center mt-4">
                <AddressLink className="flex items-center text-darkBrown">{address}</AddressLink>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => toggleFavorite(id)}
                        className="flex items-center gap-1 text-darkBrown hover:text-darkBrown transition"
                        title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
                    >
                        {isFavorited ? <FaHeart size={22} className="text-darkBrown" /> : <FaRegHeart size={22} className="text-darkBrown" />}
                    </button>
                    <button
                        onClick={onShare}
                        className="flex items-center gap-1 text-darkBrown hover:text-darkBrown transition"
                        title="Share"
                    >
                        <LuUpload size={24} /> 공유하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CafeHeader;
