import React, { useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";

interface CarouselModalProps {
    photos: string[];
    currentIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

const CarouselModal: React.FC<CarouselModalProps> = ({
    photos,
    currentIndex,
    onClose,
    onNext,
    onPrev,
}) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            } else if (event.key === "ArrowLeft") {
                onPrev();
            } else if (event.key === "ArrowRight") {
                onNext();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose, onNext, onPrev]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            {/* Close Button */}
            <button onClick={onClose} className="absolute top-4 right-4 text-white">
                <FaTimes size={32} />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 text-white text-3xl font-semibold">
                {`${currentIndex + 1} / ${photos.length}`}
            </div>

            {/* Navigation Buttons */}
            {photos.length > 1 && (
                <>
                    <button
                        onClick={onPrev}
                        disabled={currentIndex === 0}
                        className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-white ${currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        <FaArrowLeft size={40} />
                    </button>
                    <button
                        onClick={onNext}
                        disabled={currentIndex === photos.length - 1}
                        className={`absolute right-4 top-1/2 transform -translate-y-1/2 text-white ${currentIndex === photos.length - 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                            }`}
                    >
                        <FaArrowRight size={40} />
                    </button>
                </>
            )}

            {/* Image Display */}
            <div className="flex justify-center items-center max-h-screen w-full px-4">
                <img
                    src={photos[currentIndex]}
                    alt={`Images ${currentIndex + 1}`}
                    className="object-contain max-h-[80vh] max-w-full rounded-lg"
                />
            </div>
        </div>
    );
};

export default CarouselModal;
