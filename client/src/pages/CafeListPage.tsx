import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getCafes } from "../api";
import CafeList from "../components/CafeList/CafeList";
import LoadingMessage from "../components/CafeList/LoadingMessages";
import ErrorMessage from "../components/CafeList/ErrorMessage";
import Container from "../components/common/Container";

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
        const summaryQuery = queryParams.get("summary");
        const textQuery = queryParams.get("query");

        try {
            const filters: Record<string, string> = {};
            if (summaryQuery) filters["summary"] = summaryQuery;
            if (textQuery) filters["query"] = textQuery;

            const response = await getCafes(filters);
            const reversedCafes = (response.data.data as Cafe[]).reverse();

            const formattedCafes = reversedCafes.map(cafe => ({
                ...cafe,
                address: cafe.address.split(" ").slice(0, 2).join(", ")
            }));

            setCafes(formattedCafes);
        } catch (error) {
            console.error("Error fetching cafés:", error);
            setError("카페 정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
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
            ) : cafes.length === 0 ? (
                <p className="text-center text-gray-500 mt-2">카페 정보가 없습니다</p>
            ) : (
                <CafeList cafes={cafes} />
            )}
        </Container>
    );
}

export default CafeListPage;
