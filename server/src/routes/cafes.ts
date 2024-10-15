// routes/cafes.ts
import express from "express";
import multer from "multer";
import { createCafe, getAllCafes, getCafeById, updateCafe, deleteCafe, addComment } from "../controllers/cafeController";
const router = express.Router();



const upload = multer({ storage: multer.memoryStorage() });

// Admin 확인 미들웨어
function verifyAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.cookies.admin === "true") {
        next();
    } else {
        res.status(403).json({ success: false, message: "Admin access required" });
    }
}

// 라우트 설정
router.post("/", verifyAdmin, upload.array("images", 5), createCafe as express.RequestHandler);
router.get("/", getAllCafes as express.RequestHandler);
router.get("/:id", getCafeById as express.RequestHandler);
router.put("/:id", verifyAdmin, updateCafe as express.RequestHandler);
router.delete("/:id", verifyAdmin, deleteCafe as express.RequestHandler);
router.post("/:id/comments", addComment as express.RequestHandler);

export default router;
