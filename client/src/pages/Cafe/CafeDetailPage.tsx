import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../../components/DetailPages/AddressLink";
import { getCafeById } from "../../api";
import Container from "../../components/common/Container";
import Map from "../../components/common/Map";
import CommentSection from "../../components/DetailPages/CommentSection";
import CarouselModal from "../../components/DetailPages/CarouselModal";
import { FaWifi, FaParking, FaDog, FaCamera, FaCouch, FaHeart, FaRestroom, FaShareAlt } from "react-icons/fa";

interface Cafe {
    id: string;
    name: string;
    address: string;
    description: string;
    photos: string[];
    facilities: { [key: string]: boolean };
    comments: { user: string; text: string }[];
}

const CafeDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [cafe, setCafe] = useState<Cafe | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    useEffect(() => {
        const fetchCafeDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                if (id) {
                    const response = await getCafeById(parseInt(id)); // Ensure `id` is parsed to number if required
                    setCafe(response.data.data as unknown as Cafe);
                }
            } catch (error) {
                console.error("Error fetching café details:", error);
                setError("Failed to load café details. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCafeDetails();
    }, [id]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (!cafe) return null;

    const facilities = cafe.facilities || {};

    const handleShare = () => {
        const shareData = {
            title: cafe.name,
            text: `Check out this café: ${cafe.name}`,
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

    const openModal = (index: number) => {
        setCurrentImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % cafe.photos.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + cafe.photos.length) % cafe.photos.length);
    };

    return (
        <Container>
            <div className="max-w-screen-xl mx-auto">
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center mt-5">
                        <h2 className="text-3xl">{cafe.name}</h2>
                        <button
                            onClick={handleShare}
                            className="text-gray-600 hover:text-blue-600 transition"
                            title="Share"
                        >
                            <FaShareAlt size={24} />
                        </button>
                    </div>
                    <AddressLink>{cafe.address}</AddressLink>

                    <div
                        className="w-full h-[50vh] overflow-hidden rounded-xl relative cursor-pointer"
                        onClick={() => openModal(0)}
                    >
                        <img
                            alt="Coffee Not Found"
                            src={cafe.photos[0]}
                            loading="lazy"
                            className="object-cover w-full h-full"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-7 md:gap-8 mt-6">
                        <div className="col-span-1 md:col-span-4 flex flex-col gap-8">
                            <div className="text-xl font-semibold flex flex-row items-center gap-2">
                                <div className="font-mono">Introduced by Coding Valley</div>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-4 font-light text-neutral-500">
                                <div>{cafe.address}</div>
                                <div>50 likes</div>
                            </div>
                            <div className="text-lg font-light text-neutral-500">
                                {cafe.description}
                            </div>

                            <div className="mt-4">
                                <hr />
                                <ul className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 text-neutral-600">
                                    {facilities.wifi && (
                                        <li className="flex items-center gap-2">
                                            <FaWifi size={32} className="text-gray-600" /> WiFi
                                        </li>
                                    )}
                                    {facilities.parking && (
                                        <li className="flex items-center gap-2">
                                            <FaParking size={32} className="text-gray-600" /> Parking
                                        </li>
                                    )}
                                    {facilities.bathroom && (
                                        <li className="flex items-center gap-2">
                                            <FaRestroom size={32} className="text-gray-600" /> Bathroom
                                        </li>
                                    )}
                                    {facilities.petFriendly && (
                                        <li className="flex items-center gap-2">
                                            <FaDog size={32} className="text-gray-600" /> Pet Friendly
                                        </li>
                                    )}
                                    {facilities.photoSpot && (
                                        <li className="flex items-center gap-2">
                                            <FaCamera size={32} className="text-gray-600" /> Photo Spot
                                        </li>
                                    )}
                                    {facilities.cozySeats && (
                                        <li className="flex items-center gap-2">
                                            <FaCouch size={32} className="text-gray-600" /> Cozy Seats
                                        </li>
                                    )}
                                    {facilities.suitableForDate && (
                                        <li className="flex items-center gap-2">
                                            <FaHeart size={32} className="text-gray-600" /> Suitable for Date
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <Map cafeAddress={cafe.address} />
                        </div>

                        <div className="col-span-1 md:col-span-3 flex flex-col justify-evenly mt-6 md:mt-0">
                            {cafe.photos.map((photo, index) => (
                                <div
                                    key={index}
                                    className="aspect-w-4 aspect-h-3 cursor-pointer"
                                    onClick={() => openModal(index)}
                                >
                                    <img
                                        src={photo}
                                        alt={`Cafe ${index + 1}`}
                                        loading="lazy"
                                        className="w-full h-full object-cover rounded-lg shadow-md"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <hr />

                    <CommentSection comments={cafe.comments} cafeId={parseInt(cafe.id)} />
                </div>
            </div>

            {isModalOpen && (
                <CarouselModal
                    photos={cafe.photos}
                    currentIndex={currentImageIndex}
                    onClose={closeModal}
                    onNext={handleNextImage}
                    onPrev={handlePrevImage}
                />
            )}
        </Container>
    );
};

export default CafeDetailPage;
