// routes/admin.ts
import express from "express";
import { login, checkAuth } from "../controllers/adminController";

const router = express.Router();

// 로그인 경로
router.post("/login", login);

// 인증 상태 확인 경로
router.get("/check-auth", checkAuth);

export default router;
