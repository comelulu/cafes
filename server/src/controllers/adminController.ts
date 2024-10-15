// controllers/adminController.ts
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const adminUsername = process.env.ADMIN_USERNAME || "";
const adminPassword = process.env.ADMIN_PASSWORD || "";

// 관리자 로그인 핸들러
export const login = (req: Request, res: Response) => {
    const { username, password } = req.body as { username: string; password: string };

    if (!username || !password) {
        res.status(400).json({ success: false, message: "Username and password required" });
        return;
    }

    if (username === adminUsername && password === adminPassword) {
        res.cookie("admin", "true", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        });
        res.json({ success: true, message: "Login successful" });
    } else {
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
};

// 인증 상태 확인 핸들러
export const checkAuth = (req: Request, res: Response) => {
    const isAuthenticated = req.cookies && req.cookies.admin === "true";
    if (isAuthenticated) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
};
