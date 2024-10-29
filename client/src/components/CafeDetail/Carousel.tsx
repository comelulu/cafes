import { useState } from "react";

interface CarouselProps {
    photos: string[];
}

const Carousel = ({ photos }: CarouselProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % photos.length);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
    };

    return (
        <div className="relative w-full h-[50vh] overflow-hidden rounded-xl">
            <img
                alt="Cafe"
                src={photos[currentImageIndex]}
                className="object-cover w-full h-full"
            />

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                {photos.map((_, index) => (
                    <span
                        key={index}
                        className={`h-2 rounded-full cursor-pointer transition-all ${index === currentImageIndex ? 'bg-white w-8' : 'bg-gray-400 w-2'
                            }`}
                        onClick={() => setCurrentImageIndex(index)}
                    ></span>
                ))}
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl"
            >
                ‹
            </button>
            <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl"
            >
                ›
            </button>
        </div>
    );
};

export default Carousel;