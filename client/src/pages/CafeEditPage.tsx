// components/CafeEdit/EditCafePage.tsx
import { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { checkAuth, getCafeById, updateCafe } from "../api";
import LoadingSpinner from "../components/CafeEdit/LoadingSpinner";
import CafeForm from "../components/CafeEdit/CafeForm";

function EditCafePage(): JSX.Element | null {
    const { id } = useParams<{ id: string }>();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [formData, setFormData] = useState({
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
                const { name, address, description, facilities } = cafeData.data.data;

                setFormData({
                    name,
                    address,
                    description,
                    facilities: {
                        wifi: facilities.wifi === "true" || facilities.wifi === true,
                        parking: facilities.parking === "true" || facilities.parking === true,
                        bathroom: facilities.bathroom === "true" || facilities.bathroom === true,
                        petFriendly: facilities.petFriendly === "true" || facilities.petFriendly === true,
                        photoSpot: facilities.photoSpot === "true" || facilities.photoSpot === true,
                        cozySeats: facilities.cozySeats === "true" || facilities.cozySeats === true,
                        suitableForDate: facilities.suitableForDate === "true" || facilities.suitableForDate === true,
                    },
                });
            } catch (error) {
                console.error("Authentication check or data fetch failed:", error);
            } finally {
                setLoading(false);
            }
        };

        verifyAuthentication();
    }, [id]);

    const handleSubmit = async (updatedData: typeof formData) => {
        const facilities = Object.fromEntries(
            Object.entries(updatedData.facilities).map(([key, value]) => [key, value.toString()])
        );

        try {
            await updateCafe(Number(id), { ...updatedData, facilities });
            alert("Cafe updated successfully!");
            navigate("/admin");
        } catch (error) {
            console.error("Error updating cafe:", error);
            alert("Failed to update the cafe. Please try again.");
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!isAuthenticated) return <Navigate to="/login" />;

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-10">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-12 md:p-16">
                <h1 className="text-4xl font-semibold text-center text-[#002D74] mb-8">Edit Cafe</h1>
                <CafeForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} />
            </div>
        </div>
    );
}

export default EditCafePage;
