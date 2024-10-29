import { useState } from "react";

interface CafeFormData {
    name: string;
    address: string;
    description: string;
    photos: File[];
}

interface CafeFormProps {
    onSubmit: (data: CafeFormData) => void;
}

const CafeForm = ({ onSubmit }: CafeFormProps): JSX.Element => {
    const [name, setName] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [photos, setPhotos] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({ name, address, description, photos });
        // Reset form fields after submission
        setName("");
        setAddress("");
        setDescription("");
        setPhotos([]);
        setPreviewUrls([]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        const validFiles = files.filter((file) => file.type.startsWith("image/"));

        // Generate preview URLs for valid image files
        const fileUrls = validFiles.map((file) => URL.createObjectURL(file));
        setPhotos(validFiles);
        setPreviewUrls(fileUrls);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                required
            />
            <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                required
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
            />
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
            />

            {/* Image Previews */}
            {previewUrls.length > 0 && (
                <div className="preview-container">
                    {previewUrls.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="preview-image"
                        />
                    ))}
                </div>
            )}

            <button type="submit">Submit</button>
        </form>
    );
};

export default CafeForm;
