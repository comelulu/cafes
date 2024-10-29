// components/CafeDetail/CafeList.tsx
import CafeCard from "./CafeCard";

interface Cafe {
    id: string;
    name: string;
    address: string;
    photos: string[];
    description: string;
}

interface CafeListProps {
    cafes: Cafe[];
}

function CafeList({ cafes }: CafeListProps): JSX.Element {
    return (
        <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
            {cafes.map((cafe) => (
                <CafeCard key={cafe.id} cafe={cafe} />
            ))}
        </div>
    );
}

export default CafeList;
