import { useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { checkAuth, getCafeById, updateCafe } from "../api";
import LoadingSpinner from "../components/CafeEdit/LoadingSpinner";
import CafeForm from "../components/CafeEdit/CafeForm";

interface Facilities {
    wifi: boolean;
    parking: boolean;
    bathroom: boolean;
    petFriendly: boolean;
    toGo: boolean;
    delivery: boolean;
    groupAvailable: boolean;
    applePay: boolean;
}

interface Summaries {
    suburban: boolean;
    large: boolean;
    dessert: boolean;
    rooftop: boolean;
    bookCafe: boolean;
    scenicView: boolean;
    culturalComplex: boolean;
    architectureTheme: boolean;
}

interface FormData {
    name: string;
    address: string;
    description: string;
    facilities: Facilities;
    summaries: Summaries;
}

const summaryLabels: { [key in keyof Summaries]: string } = {
    suburban: "근교",
    large: "대형",
    dessert: "디저트",
    rooftop: "루프탑",
    bookCafe: "북카페",
    scenicView: "뷰맛집",
    culturalComplex: "복합문화",
    architectureTheme: "건축/테마",
};

function EditCafePage(): JSX.Element | null {
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
            toGo: false,
            delivery: false,
            groupAvailable: false,
            applePay: false,
        },
        summaries: {
            suburban: false,
            large: false,
            dessert: false,
            rooftop: false,
            bookCafe: false,
            scenicView: false,
            culturalComplex: false,
            architectureTheme: false,
        },
    });
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAuthentication = async () => {
            try {
                const response = await checkAuth();
                setIsAuthenticated(response.data.success);

                const cafeData = await getCafeById(Number(id));
                const { name, address, description, facilities, summaries } = cafeData.data.data;

                setFormData({
                    name,
                    address,
                    description,
                    facilities: {
                        wifi: facilities.wifi === "true" || facilities.wifi === true,
                        parking: facilities.parking === "true" || facilities.parking === true,
                        bathroom: facilities.bathroom === "true" || facilities.bathroom === true,
                        petFriendly: facilities.petFriendly === "true" || facilities.petFriendly === true,
                        toGo: facilities.toGo === "true" || facilities.toGo === true,
                        delivery: facilities.delivery === "true" || facilities.delivery === true,
                        groupAvailable: facilities.groupAvailable === "true" || facilities.groupAvailable === true,
                        applePay: facilities.applePay === "true" || facilities.applePay === true,
                    },
                    summaries: {
                        suburban: summaries?.suburban === "true" || summaries?.suburban === true,
                        large: summaries?.large === "true" || summaries?.large === true,
                        dessert: summaries?.dessert === "true" || summaries?.dessert === true,
                        rooftop: summaries?.rooftop === "true" || summaries?.rooftop === true,
                        bookCafe: summaries?.bookCafe === "true" || summaries?.bookCafe === true,
                        scenicView: summaries?.scenicView === "true" || summaries?.scenicView === true,
                        culturalComplex: summaries?.culturalComplex === "true" || summaries?.culturalComplex === true,
                        architectureTheme: summaries?.architectureTheme === "true" || summaries?.architectureTheme === true,
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

    const handleSubmit = async (updatedData: FormData) => {
        const facilities = Object.fromEntries(
            Object.entries(updatedData.facilities).map(([key, value]) => [key, value.toString()])
        );
        const summaries = Object.fromEntries(
            Object.entries(updatedData.summaries).map(([key, value]) => [key, value.toString()])
        );

        try {
            await updateCafe(Number(id), { ...updatedData, facilities, summaries });
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
                <h1 className="text-4xl font-semibold text-center text-darkBrown mb-8">Edit Cafe</h1>
                <CafeForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={handleSubmit}
                    summaryLabels={summaryLabels}
                />
            </div>
        </div>
    );
}

export default EditCafePage;
