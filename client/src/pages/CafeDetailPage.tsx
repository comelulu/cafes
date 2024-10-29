// components/CafeDetail/CafeDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCafeById } from "../api";
import Container from "../components/Common/Container";
import Carousel from "../components/CafeDetail/Carousel";
import CommentSection from "../components/CafeDetail/CommentSection";
import CafeHeader from "../components/CafeDetail/CafeHeader";
import CafeSummary from "../components/CafeDetail/CafeSummary";
import CafeDescription from "../components/CafeDetail/CafeDescription";
import CafeFacilities from "../components/CafeDetail/CafeFacilities";
import CafeLocation from "../components/CafeDetail/CafeLocation";

interface Cafe {
    id: string;
    name: string;
    address: string;
    description: string;
    photos: string[];
    facilities: { [key: string]: boolean };
    summaries: { [key: string]: boolean };
    comments: { user: string; text: string }[];
}

function CafeDetailPage(): JSX.Element | null {
    const { id } = useParams<{ id: string }>();
    const [cafe, setCafe] = useState<Cafe | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCafeDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (id) {
                    const response = await getCafeById(parseInt(id));
                    setCafe(response.data.data as unknown as Cafe);
                }
            } catch (error) {
                console.error("Error fetching cafe details:", error);
                setError("Failed to load cafe details. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCafeDetails();
    }, [id]);

    const handleShare = () => {
        const shareData = {
            title: cafe?.name || "",
            text: `Check out this cafe: ${cafe?.name}`,
            url: window.location.href,
        };
        if (navigator.share) {
            navigator.share(shareData).catch((error) => {
                console.error("Error sharing:", error);
                alert("Unable to share. Please try again.");
            });
        } else {
            navigator.clipboard.writeText(shareData.url).then(() => {
                alert("Link copied to clipboard!");
            });
        }
    };

    if (isLoading) return <div className="text-secondary">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (!cafe) return null;

    const summaryLabels = {
        suburban: "Suburban",
        large: "Large",
        dessert: "Dessert",
        rooftop: "Rooftop",
        bookCafe: "Book Cafe",
        scenicView: "Scenic View",
        culturalComplex: "Cultural Complex",
        architectureTheme: "Architecture Theme",
    };

    return (
        <Container>
            <div className="max-w-screen-xl mx-auto text-secondary">
                <div className="flex flex-col gap-6">
                    <CafeHeader name={cafe.name} address={cafe.address} onShare={handleShare} />
                    <Carousel photos={cafe.photos} />
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 mt-6">
                        <div className="flex flex-col gap-4">
                            <CafeSummary summaries={cafe.summaries} summaryLabels={summaryLabels} />
                            <CafeDescription description={cafe.description} />
                            <CafeFacilities facilities={cafe.facilities} />
                        </div>
                        <CafeLocation address={cafe.address} />
                    </div>
                    <CommentSection comments={cafe.comments} cafeId={parseInt(cafe.id)} />
                </div>
            </div>
        </Container>
    );
}

export default CafeDetailPage;
