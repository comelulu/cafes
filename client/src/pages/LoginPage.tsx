import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin, checkAuth } from "../api";

const LoginPage = (): JSX.Element => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAuthentication = async () => {
            try {
                const response = await checkAuth();
                if (response.data.success) {
                    navigate("/admin");
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error("Authentication check failed:", error);
                setLoading(false);
            }
        };

        verifyAuthentication();
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await adminLogin({ username, password });
            if (response.data.success) {
                setError("");
                navigate("/admin");
            } else {
                setError("권한이 없습니다. 자격 증명을 확인해 주세요.");
            }
        } catch (error) {
            setError("자격 증명이 잘못되었습니다. 다시 시도해 주세요.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8 md:p-12">
                <h1 className="text-3xl font-semibold text-center text-darkBrown mb-6">
                    관리자 로그인
                </h1>
                {error && <p className="text-red-600 text-center mb-6">{error}</p>}
                <form className="flex flex-col gap-6" onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="사용자 이름"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        required
                    />
                    <div className="relative w-full">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                            required
                        />
                        <span
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
                        >
                            {passwordVisible ? "숨기기" : "보기"}
                        </span>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-secondary text-primary rounded-lg font-semibold "
                    >
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
