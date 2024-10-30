// components/Admin/AdminManageCafes.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCafes, deleteCafe } from "../api";

interface Cafe {
    id: number;
    name: string;
    address: string;
    description: string;
}

const AdminManageCafes = (): JSX.Element => {
    const [cafes, setCafes] = useState<Cafe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCafes = async () => {
            try {
                const response = await getCafes();
                // Sort cafes to show the latest added at the top
                setCafes(response.data.data.sort((a: Cafe, b: Cafe) => b.id - a.id));
            } catch (err) {
                console.error("Error fetching cafes:", err);
                setError("Failed to load cafes. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCafes();
    }, []);

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this cafe?");
        if (!confirmDelete) return;

        try {
            await deleteCafe(id);
            setCafes(cafes.filter((cafe) => cafe.id !== id));
            alert("Cafe deleted successfully!");
            navigate("/admin");
        } catch (err) {
            console.error("Error deleting cafe:", err);
            alert("Failed to delete the cafe. Please try again.");
        }
    };

    if (loading) return <div className="loader">Loading...</div>;
    if (error) return <p className="text-red-600 text-center">{error}</p>;

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-semibold text-darkBrown text-center mb-6">Manage Cafes</h1>
                <div className="flex flex-col gap-4">
                    {cafes.map((cafe) => (
                        <div key={cafe.id} className="p-4 border border-gray-200 rounded-md flex justify-between items-center bg-white shadow-sm">
                            <div>
                                <h3 className="text-lg font-medium text-darkBrown">{cafe.name}</h3>
                                <p className="text-gray-700">{cafe.address}</p>
                                <p className="text-gray-400 text-sm">
                                    {cafe.description.length > 100 ? `${cafe.description.slice(0, 100)}...` : cafe.description}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    to={`/admin/edit-cafe/${cafe.id}`}
                                    className="px-4 py-2 bg-secondary text-primary rounded-md  text-sm font-medium"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(cafe.id)}
                                    className="px-4 py-2 bg-primary text-secondary rounded-md text-sm font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminManageCafes;
