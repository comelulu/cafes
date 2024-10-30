import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { checkAuth, getCafes } from "../api";

const AdminDashboard = (): JSX.Element => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [cafeCount, setCafeCount] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const verifyAuthentication = async () => {
            try {
                const response = await checkAuth();
                setIsAuthenticated(response.data.success);

                if (response.data.success) {
                    const cafeResponse = await getCafes();
                    setCafeCount(cafeResponse.data.data.length);
                } else {
                    setErrorMessage("Authentication failed. Please login again.");
                }
            } catch (error) {
                console.error("Error occurred during authentication or data fetching:", error);
                setErrorMessage("Failed to fetch cafe data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        verifyAuthentication();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="loader">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/login" />;

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8 md:p-12">
                <h1 className="text-3xl font-semibold text-center text-darkBrown mb-6">
                    Admin Dashboard
                </h1>
                {errorMessage ? (
                    <p className="text-center text-red-600 mb-6">{errorMessage}</p>
                ) : (
                    <div className="text-center mb-6">
                        <p className="text-lg font-bold text-gray-800 flex items-center justify-center gap-3">
                            Total Cafes:
                            <span className="text-2xl font-semibold text-gray-800">
                                {cafeCount !== null ? cafeCount : "N/A"}
                            </span>
                        </p>
                    </div>
                )}
                <div className="flex flex-col gap-4">
                    <Link
                        to="/admin/cafes"
                        className="w-full py-3 bg-secondary text-primary text-center rounded-lg font-semibold hover:bg-[#E4C69E] transition duration-300"
                    >
                        Manage Cafes
                    </Link>
                    <Link
                        to="/admin/create-cafe"
                        className="w-full py-3 bg-secondary text-primary text-center rounded-lg font-semibold hover:bg-[#E4C69E] transition duration-300"
                    >
                        Create New Cafe
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
