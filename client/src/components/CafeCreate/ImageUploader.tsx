// components/CafeCreate/ImageUploader.tsx
interface ImageUploaderProps {
    images: File[];
    previews: string[];
    setImages: React.Dispatch<React.SetStateAction<File[]>>;
    setPreviews: React.Dispatch<React.SetStateAction<string[]>>;
}

function ImageUploader({ images, previews, setImages, setPreviews }: ImageUploaderProps): JSX.Element {
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).filter((file) => file.size < 5 * 1024 * 1024);
            setImages((prev) => [...prev, ...files]);
            setPreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
        }
    };

    const handleRemoveImage = (index: number) => {
        URL.revokeObjectURL(previews[index]);
        setImages((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div>
            <label className="block mb-2 font-bold text-gray-700">Upload Images:</label>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                multiple
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-full file:bg-[#002D74] file:text-white file:font-semibold file:hover:bg-[#003366]"
            />
            <div className="flex gap-4 mt-4 flex-wrap">
                {previews.map((preview, index) => (
                    <div key={index} className="relative">
                        <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-800"
                        >
                            &times;
                        </button>
                        <img src={preview} alt={`Preview ${index + 1}`} className="w-36 h-36 object-cover rounded-lg shadow-md" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ImageUploader;
