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
                setError("Unauthorized access. Check your credentials.");
            }
        } catch (error) {
            setError("Invalid credentials. Please try again.");
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
                <h2 className="text-3xl font-semibold text-center text-[#002D74] mb-6">
                    Admin Login
                </h2>
                {error && <p className="text-red-600 text-center mb-6">{error}</p>}
                <form className="flex flex-col gap-6" onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002D74]"
                        required
                    />
                    <div className="relative w-full">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002D74]"
                            required
                        />
                        <span
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
                        >
                            {passwordVisible ? "Hide" : "Show"}
                        </span>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 bg-[#002D74] text-white rounded-lg font-semibold hover:bg-[#003366] transition duration-300"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
