import { useEffect, useState } from "react";
import CafeCard from "../../components/DetailPages/CafeCard";
import Container from "../../components/common/Container";
import { getCafes } from "../../api";

interface Cafe {
    id: string;
    name: string;
    address: string;
    photos: string[];
    description: string;
}

const CafeListPage = (): JSX.Element | null => {
    const [cafes, setCafes] = useState<Cafe[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCafes = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await getCafes();
                setCafes(response.data.data as unknown as Cafe[]);
            } catch (error) {
                console.error("Error fetching cafés:", error);
                setError("Failed to load cafes. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCafes();
    }, []);

    return (
        <Container>
            {isLoading ? (
                <div className="pt-24 text-center">Loading cafés...</div>
            ) : error ? (
                <div className="pt-24 text-center text-red-500">{error}</div>
            ) : (
                <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
                    {cafes.map((cafe) => (
                        <CafeCard key={cafe.id} cafe={cafe} />
                    ))}
                </div>
            )}
        </Container>
    );
};

export default CafeListPage;
