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
                setError("카페 정보를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
            } finally {
                setLoading(false);
            }
        };

        fetchCafes();
    }, []);

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("정말 이 카페를 삭제하시겠습니까?");
        if (!confirmDelete) return;

        try {
            await deleteCafe(id);
            setCafes(cafes.filter((cafe) => cafe.id !== id));
            alert("카페가 성공적으로 삭제되었습니다!");
            navigate("/admin");
        } catch (err) {
            console.error("Error deleting cafe:", err);
            alert("카페 삭제에 실패했습니다. 다시 시도해 주세요.");
        }
    };

    if (loading) return <div className="loader">로딩 중...</div>;
    if (error) return <p className="text-red-600 text-center">{error}</p>;

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-semibold text-darkBrown text-center mb-6">카페 관리</h1>
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
                                    수정
                                </Link>
                                <button
                                    onClick={() => handleDelete(cafe.id)}
                                    className="px-4 py-2 bg-secondary text-primary rounded-md text-sm font-medium"
                                >
                                    삭제
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
