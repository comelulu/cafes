// components/CafeDetail/CafeListPage.tsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCafes } from "../api";
import Container from "../components/Common/Container";
import CafeList from "../components/CafeList/CafeList";
import LoadingMessage from "../components/CafeList/LoadingMessages";
import ErrorMessage from "../components/CafeList/ErrorMessage";

interface Cafe {
    id: string;
    name: string;
    address: string;
    photos: string[];
    description: string;
}

function CafeListPage(): JSX.Element {
    const [cafes, setCafes] = useState<Cafe[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const location = useLocation();

    const fetchCafes = async () => {
        setIsLoading(true);
        setError(null);

        const queryParams = new URLSearchParams(location.search);
        const nameQuery = queryParams.get("name");
        const addressQuery = queryParams.get("address");

        const filterType = nameQuery ? "name" : addressQuery ? "address" : null;
        const query = nameQuery || addressQuery;

        try {
            const filters = filterType && query ? { [filterType]: query } as Record<"name" | "address", string> : {};
            const response = await getCafes(filters);
            const reversedCafes = (response.data.data as Cafe[]).reverse();

            const formattedCafes = reversedCafes.map(cafe => ({
                ...cafe,
                address: cafe.address.split(" ").slice(0, 2).join(", ")
            }));

            setCafes(formattedCafes);
        } catch (error) {
            console.error("Error fetching cafés:", error);
            setError("Failed to load cafes. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCafes();
    }, [location.search]);

    return (
        <Container>
            {isLoading ? (
                <LoadingMessage />
            ) : error ? (
                <ErrorMessage message={error} />
            ) : (
                <CafeList cafes={cafes} />
            )}
        </Container>
    );
}

export default CafeListPage;
