import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCafeById } from "../api";
import Container from "../components/common/Container";
import Carousel from "../components/CafeDetail/Carousel";
import CommentSection from "../components/CafeDetail/CafeComment";
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
                    console.log("response.data.data: ", response.data.data.facilities);

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

    const handleShare = async () => {
        if (!cafe) return;

        const shareData = {
            title: cafe.name,
            text: `Check out this cafe: ${cafe.name}\nLocation: ${cafe.address}\n${cafe.description || ''}`,
            url: window.location.href,
        };

        const htmlContent = `
            <h3>Check out this cafe: ${cafe.name}</h3>
            <p><strong>Location:</strong> ${cafe.address}</p>
            <p>${cafe.description || ''}</p>
            <a href="${window.location.href}">View more details</a>
        `;

        try {
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
                console.log("Data was shared successfully");
            } else {
                console.log("Cannot share data through Web Share API. Fallback to clipboard copy.");
                fallbackToClipboardAsHtml(htmlContent);
            }
        } catch (error) {
            console.error("Error sharing:", error);
            alert("Sharing failed. Trying to copy the content to your clipboard.");
            fallbackToClipboardAsHtml(htmlContent);
        }
    };

    const fallbackToClipboardAsHtml = (htmlContent: string) => {
        const blob = new Blob([htmlContent], { type: "text/html" });
        const data = [new ClipboardItem({ "text/html": blob })];

        navigator.clipboard.write(data)
            .then(() => alert("Link and cafe details copied to clipboard in HTML format!"))
            .catch((error) => {
                console.error("Clipboard write error:", error);
                alert("Failed to copy link to clipboard. Please copy manually.");
            });
    };

    if (isLoading) return <div className="text-secondary">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (!cafe) return null;

    const summaryLabels = {
        suburban: "근교",
        large: "대형",
        dessert: "디저트",
        rooftop: "루프탑",
        bookCafe: "북카페",
        scenicView: "뷰맛집",
        culturalComplex: "복합문화",
        architectureTheme: "건축/테마",
    };


    return (
        <Container>
            <div className="max-w-screen-xl mx-auto text-secondary">
                <div className="flex flex-col gap-6">
                    <CafeHeader id={cafe.id} name={cafe.name} address={cafe.address} onShare={handleShare} />
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
