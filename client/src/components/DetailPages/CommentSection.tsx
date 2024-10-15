import React, { useState } from "react";
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import { addComment } from "../../api";

interface Comment {
    user: string;
    text: string;
}

interface CommentSectionProps {
    comments: Comment[];
    cafeId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments = [], cafeId }) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
    const [newComment, setNewComment] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleAddComment = async () => {
        if (!username || !password || !newComment.trim()) {
            setError("모든 필드를 채워주세요.");
            return;
        }

        try {
            const response = await addComment(cafeId, username, password, newComment);
            comments.push(response.data.comment);
            setNewComment("");
            setUsername("");
            setPassword("");
            setError(null);
            setIsCollapsed(true);
        } catch (error: any) {
            console.error("Error adding comment:", error);
            setError(
                error.response?.status === 401
                    ? "잘못된 계정 혹은 권한이 없습니다."
                    : "코멘트를 추가하는 중 오류가 발생했습니다."
            );
        }
    };

    return (
        <div className="mt-6 mb-10">
            <div className="flex items-center mb-4">
                <h3 className="text-2xl font-semibold text-gray-800">Comments</h3>
                {isCollapsed ? (
                    <AiOutlinePlusCircle
                        size={24}
                        className="ml-2 text-gray-500 cursor-pointer hover:text-gray-700 transition duration-300"
                        onClick={() => setIsCollapsed(false)}
                    />
                ) : (
                    <AiOutlineMinusCircle
                        size={24}
                        className="ml-2 text-gray-500 cursor-pointer hover:text-gray-700 transition duration-300"
                        onClick={() => setIsCollapsed(true)}
                    />
                )}
            </div>

            {comments.length > 0 ? (
                <div className="space-y-4">
                    {comments.map((comment, index) => (
                        <div
                            key={index}
                            className="p-4 bg-white border border-gray-100 rounded-md shadow-sm transition-transform transform hover:scale-105"
                        >
                            <div className="flex items-center mb-2">
                                <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center text-gray-600 font-bold">
                                    {comment.user.charAt(0)}
                                </div>
                                <p className="ml-4 font-medium text-gray-800">{comment.user}</p>
                            </div>
                            <p className="pl-12 text-gray-600">{comment.text}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">No comments available.</p>
            )}

            {!isCollapsed && (
                <div className="mt-4 space-y-2">
                    {error && (
                        <p className="text-red-500 text-sm font-semibold">{error}</p>
                    )}
                    <input
                        type="text"
                        placeholder="Your ID"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                    />
                    <textarea
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                        placeholder="Write your comment here..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                        onClick={handleAddComment}
                        className="mt-2 w-full bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
                    >
                        Create a Comment
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentSection;
