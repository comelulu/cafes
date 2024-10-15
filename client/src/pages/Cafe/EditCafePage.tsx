// src/pages/EditCafePage.tsx

import React, { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import KakaoMap from "../../components/common/KakaoMap";
import { checkAuth, getCafeById, updateCafe } from "../../api";

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

const EditCafePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
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
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAuthentication = async () => {
            try {
                const response = await checkAuth();
                setIsAuthenticated(response.data.success);

                const cafeData = await getCafeById(Number(id));
                const { name, address, description, facilities, photos } = cafeData.data.data;

                const parsedFacilities: Facilities = {
                    wifi: facilities.wifi === "true" || facilities.wifi === true,
                    parking: facilities.parking === "true" || facilities.parking === true,
                    bathroom: facilities.bathroom === "true" || facilities.bathroom === true,
                    petFriendly: facilities.petFriendly === "true" || facilities.petFriendly === true,
                    photoSpot: facilities.photoSpot === "true" || facilities.photoSpot === true,
                    cozySeats: facilities.cozySeats === "true" || facilities.cozySeats === true,
                    suitableForDate: facilities.suitableForDate === "true" || facilities.suitableForDate === true,
                };

                setFormData({
                    name,
                    address,
                    description,
                    facilities: parsedFacilities,
                });
            } catch (error) {
                console.error("Authentication check or data fetch failed:", error);
            } finally {
                setLoading(false);
            }
        };

        verifyAuthentication();
    }, [id]);

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const facilities = Object.fromEntries(
            Object.entries(formData.facilities).map(([key, value]) => [key, value.toString()])
        );

        try {
            await updateCafe(Number(id), { ...formData, facilities });
            alert("Cafe updated successfully!");
            navigate("/admin");
        } catch (error) {
            console.error("Error updating cafe:", error);
            alert("Failed to update the cafe. Please try again.");
        }
    };

    if (loading) return <div className="loader">Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" />;

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-10">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-12 md:p-16">
                <h1 className="text-4xl font-semibold text-center text-[#002D74] mb-8">
                    Edit Cafe
                </h1>
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

                    <button
                        type="submit"
                        className="w-full py-4 bg-[#002D74] text-white rounded-lg font-semibold hover:bg-[#003366] transition duration-300"
                    >
                        Update Cafe
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditCafePage;
