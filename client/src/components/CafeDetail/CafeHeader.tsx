// components/CafeDetail/CafeHeader.tsx
import { FaHeart, FaRegShareSquare } from "react-icons/fa";
import AddressLink from "./AddressLink";

interface CafeHeaderProps {
    name: string;
    address: string;
    onShare: () => void;
}

function CafeHeader({ name, address, onShare }: CafeHeaderProps): JSX.Element {
    return (
        <div className="flex flex-col justify-between mt-5">
            <h2 className="text-3xl font-semibold">{name}</h2>
            <div className="flex justify-between items-center mt-4">
                <AddressLink className="flex items-center text-secondary">{address}</AddressLink>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1 text-secondary">
                        <FaHeart className="text-secondary" />
                        <span>25</span>
                    </div>
                    <button onClick={onShare} className="flex items-center gap-1 text-secondary hover:text-primary transition" title="Share">
                        <FaRegShareSquare size={20} /> 공유하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CafeHeader;
