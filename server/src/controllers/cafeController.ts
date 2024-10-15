// controllers/cafeController.ts
import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { loadCafes, saveCafes, loadUsers } from "../utils/fileUtils";

interface Cafe {
    id: number;
    name: string;
    address: string;
    description: string;
    facilities: Record<string, unknown>;
    comments: Array<{ user: string; text: string }>;  // comments 속성 정의
    photos: string[];
    likes: number;
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 카페 생성
export const createCafe = async (req: Request, res: Response) => {
    try {
        const { name, address, description, facilities } = req.body;
        if (!name || !address || !description) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Cloudinary에 이미지 업로드
        const photoUrls: string[] = [];
        if (req.files) {
            const uploadPromises = (req.files as Express.Multer.File[]).map((file) =>
                new Promise<string>((resolve, reject) => {
                    cloudinary.uploader
                        .upload_stream({ resource_type: "image" }, (error, result) =>
                            error ? reject(error) : resolve(result!.secure_url)
                        )
                        .end(file.buffer);
                })
            );
            photoUrls.push(...(await Promise.all(uploadPromises)));
        }

        // 시설 JSON 문자열을 객체로 변환
        const facilitiesData = JSON.parse(facilities);
        const newCafe: Cafe = {
            id: Date.now(),
            name,
            address,
            description,
            facilities: facilitiesData,
            comments: [],
            photos: photoUrls,
            likes: 0,
        };

        const cafes = loadCafes();
        cafes.push(newCafe);
        saveCafes(cafes);

        res.status(201).json({ success: true, data: newCafe });
    } catch (error) {
        console.log("error: ", error);
        const message = error instanceof Error ? error.message : "Unknown error occurred";
        res.status(500).json({ success: false, message });
    }
};

// 모든 카페 조회
export const getAllCafes = (req: Request, res: Response) => {
    try {
        const cafes = loadCafes();
        res.status(200).json({ success: true, data: cafes });
    } catch (error) {
        console.log("error: ", error);
        const message = error instanceof Error ? error.message : "Error loading cafes";
        res.status(500).json({ success: false, message });
    }
};

// 특정 카페 조회
export const getCafeById = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const cafes = loadCafes();
        const cafe = cafes.find((cafe) => cafe.id === parseInt(id));

        if (!cafe) {
            return res.status(404).json({ success: false, message: "cafe not found" });
        }

        res.status(200).json({ success: true, data: cafe });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error retrieving cafe";
        res.status(500).json({ success: false, message });
    }
};

// 카페 업데이트
export const updateCafe = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const cafes = loadCafes();
        const cafeIndex = cafes.findIndex((cafe) => cafe.id == parseInt(id));

        if (cafeIndex === -1) {
            return res.status(404).json({ success: false, message: "cafe not found" });
        }

        cafes[cafeIndex] = { ...cafes[cafeIndex], ...req.body };
        saveCafes(cafes);
        res.status(200).json({ success: true, data: cafes[cafeIndex] });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error updating cafe";
        res.status(500).json({ success: false, message });
    }
};

// 카페 삭제
export const deleteCafe = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let cafes = loadCafes();
        const cafeIndex = cafes.findIndex((cafe) => cafe.id == parseInt(id));

        if (cafeIndex === -1) {
            return res.status(404).json({ success: false, message: "cafe not found" });
        }

        cafes = cafes.filter((cafe) => cafe.id != parseInt(id));
        saveCafes(cafes);
        res.status(204).send();
    } catch (error) {
        const message = error instanceof Error ? error.message : "Error deleting cafe";
        res.status(500).json({ success: false, message });
    }
};

// 코멘트 추가
export const addComment = (req: Request, res: Response) => {
    try {
        const { id: cafeId } = req.params;
        const { userId, password, commentText } = req.body;
        const cafes = loadCafes();

        const users = loadUsers();
        const user = users.find((user) => user.id === userId && user.password === password);

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid user ID or password." });
        }

        const cafe = cafes.find((cafe) => cafe.id === parseInt(cafeId));
        if (!cafe) {
            return res.status(404).json({ success: false, message: "Cafe not found" });
        }

        const newComment = { user: userId, text: commentText };
        cafe.comments.push(newComment);

        saveCafes(cafes);
        res.status(201).json({ success: true, comment: newComment });
    } catch (error) {
        console.log("error: ", error);
        const message = error instanceof Error ? error.message : "Error adding comment";
        res.status(500).json({ success: false, message });
    }
};