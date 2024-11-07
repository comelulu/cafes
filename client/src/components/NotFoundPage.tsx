import { Link } from "react-router-dom";

const NotFoundPage = (): JSX.Element => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <h1 className="text-6xl font-bold mb-4 animate-bounce">404</h1>
            <h2 className="text-2xl font-semibold mb-4">페이지를 찾을 수 없습니다</h2>
            <p className="text-lg mb-6">
                죄송합니다! 찾으시는 페이지가 존재하지 않습니다.
            </p>
            <Link
                to="/"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
                홈으로 돌아가기
            </Link>
        </div>
    );
};

export default NotFoundPage;
