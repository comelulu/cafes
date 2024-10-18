import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import KakaoMap from "../../components/common/KakaoMap";
import { checkAuth, addCafe } from "../../api";

interface Facilities {
    wifi: boolean;
    parking: boolean;
    bathroom: boolean;
    petFriendly: boolean;
    photoSpot: boolean;
    cozySeats: boolean;
    suitableForDate: boolean;
}

interface FormData {
    name: string;
    address: string;
    description: string;
    facilities: Facilities;
}

const CreateCafePage = (): JSX.Element | null => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [formData, setFormData] = useState<FormData>({
        name: "",
        address: "",
        description: "",
        facilities: {
            wifi: false,
            parking: false,
            bathroom: false,
            petFriendly: false,
            photoSpot: false,
            cozySeats: false,
            suitableForDate: false,
        },
    });
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [redirect, setRedirect] = useState<boolean>(false);

    useEffect(() => {
        const verifyAuthentication = async () => {
            try {
                const response = await checkAuth();
                setIsAuthenticated(response.data.success);
            } catch (error) {
                console.error("Authentication check failed:", error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        verifyAuthentication();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prevData) => ({
                ...prevData,
                facilities: {
                    ...prevData.facilities,
                    [name]: checked,
                },
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).filter((file) => file.size < 5 * 1024 * 1024); // Max 5MB
            setImages((prevImages) => [...prevImages, ...files]);

            const newPreviews = files.map((file) => URL.createObjectURL(file));
            setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
        }
    };

    const handleRemoveImage = (index: number) => {
        URL.revokeObjectURL(previews[index]);
        setImages((prevImages) => prevImages.filter((_, imgIndex) => imgIndex !== index));
        setPreviews((prevPreviews) => prevPreviews.filter((_, previewIndex) => previewIndex !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === "facilities") {
                data.append(key, JSON.stringify(value));
            } else {
                data.append(key, value as string);
            }
        });
        images.forEach((image) => data.append("images", image));

        try {
            await addCafe(data);
            setSuccessMessage("Cafe added successfully!");
            setFormData({
                name: "",
                address: "",
                description: "",
                facilities: {
                    wifi: false,
                    parking: false,
                    bathroom: false,
                    petFriendly: false,
                    photoSpot: false,
                    cozySeats: false,
                    suitableForDate: false,
                },
            });
            setImages([]);
            setPreviews([]);
            setRedirect(
                window.confirm("Cafe added successfully! Click OK to go to the Admin page.")
            );
        } catch (error) {
            console.error("Error adding Cafe:", error);
        }
    };

    if (loading) return <div className="loader">Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (redirect) return <Navigate to="/admin" />;

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-10">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-12 md:p-16">
                <h1 className="text-4xl font-semibold text-center text-[#002D74] mb-8">
                    Create New Cafe
                </h1>
                {successMessage && <p className="text-green-500 text-center mb-6">{successMessage}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <input
                        type="text"
                        name="name"
                        placeholder="Cafe Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002D74]"
                        required
                    />

                    <KakaoMap formData={formData} setFormData={setFormData as any} />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002D74] h-48 resize-none"
                        required
                    />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.keys(formData.facilities).map((facility) => (
                            <label key={facility}>
                                <input
                                    type="checkbox"
                                    name={facility}
                                    checked={formData.facilities[facility as keyof Facilities]}
                                    onChange={handleChange}
                                />
                                <span className="ml-2 capitalize">{facility}</span>
                            </label>
                        ))}
                    </div>

                    <div>
                        <label className="block mb-2 font-bold text-gray-700">Upload Images:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            multiple
                            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-full file:bg-[#002D74] file:text-white file:font-semibold file:hover:bg-[#003366]"
                            required
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
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-36 h-36 object-cover rounded-lg shadow-md"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-[#002D74] text-white rounded-lg font-semibold hover:bg-[#003366] transition duration-300"
                    >
                        Add Cafe
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateCafePage;
