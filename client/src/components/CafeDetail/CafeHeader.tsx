import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoCopyOutline } from "react-icons/io5";
import AddressLink from "./AddressLink";
import { useFavorite } from "../../context/FavoriteProvider";

interface CafeHeaderProps {
    id: string;
    name: string;
    address: string;
}

function CafeHeader({ id, name, address }: CafeHeaderProps): JSX.Element {
    const { favorites, toggleFavorite } = useFavorite();
    const isFavorited = favorites.includes(id);

    const copyLinkToClipboard = () => {
        const link = `${window.location.origin}/cafes/${id}`;
        navigator.clipboard.writeText(link).then(() => {
            alert("링크가 클립보드에 복사되었습니다!");
        }).catch(() => {
            alert("링크 복사에 실패했습니다.");
        });
    };

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
                        onClick={copyLinkToClipboard}
                        className="flex items-center gap-1 text-darkBrown hover:text-darkBrown transition"
                        title="Copy Link"
                    >
                        <IoCopyOutline size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CafeHeader;
