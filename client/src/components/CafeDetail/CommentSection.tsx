// components/CommentSection.tsx
import { useState } from "react";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { addComment } from "../../api";
import { BsChevronDown } from "react-icons/bs";

interface Comment {
    user: string;
    text: string;
}

interface CommentSectionProps {
    comments: Comment[];
    cafeId: number;
}

const CommentSection = ({ comments = [], cafeId }: CommentSectionProps): JSX.Element => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
    const [newComment, setNewComment] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [showAllComments, setShowAllComments] = useState<boolean>(false);

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

    const displayedComments = showAllComments ? comments : comments.slice(0, 3);

    return (
        <div className="mt-6 mb-10">
            <div className="flex items-center mb-4">
                <h3 className="text-xl font-bold text-darkBrown">Comments</h3>
                {isCollapsed ? (
                    <AiFillPlusCircle
                        size={28}
                        className="ml-2 text-secondary cursor-pointer hover:text-secondary transition duration-300"
                        onClick={() => setIsCollapsed(false)}
                    />
                ) : (
                    <AiFillMinusCircle
                        size={28}
                        className="ml-2 text-secondary cursor-pointer hover:text-secondary transition duration-300"
                        onClick={() => setIsCollapsed(true)}
                    />
                )}
            </div>

            {!isCollapsed && (
                <div className="mt-4 p-4 bg-white border border-secondary rounded-md shadow-sm space-y-4 mb-6">
                    {error && (
                        <p className="text-red-500 text-sm font-semibold">{error}</p>
                    )}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="ID"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="outline-none flex-1 border border-secondary rounded-md p-2 focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                        />
                        <input
                            type="password"
                            placeholder="PW"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="outline-none flex-1 border border-secondary rounded-md p-2 focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                        />
                    </div>
                    <textarea
                        className="outline-none w-full border border-secondary rounded-md p-2 focus:ring-2 focus:ring-secondary focus:border-transparent transition"
                        placeholder="Write your comment here..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        maxLength={500}
                    />
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">{newComment.length}/500</span>
                        <button
                            onClick={handleAddComment}
                            className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary-dark transition"
                        >
                            Register
                        </button>
                    </div>
                </div>
            )}

            {comments.length > 0 ? (
                <div className="space-y-4">
                    {displayedComments.map((comment, index) => (
                        <div
                            key={index}
                            className="p-4 bg-white border border-gray-100 rounded-md shadow-sm"
                        >
                            <div className="flex items-center mb-2">
                                <div className="bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center text-gray-600 font-bold">
                                    {comment.user.charAt(0)}
                                </div>
                                <p className="ml-4 font-bold text-darkBrown text-lg">{comment.user}</p>
                            </div>
                            <p className="pl-4 text-darkBrown text-base font-normal">{comment.text}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-secondary">No comments available.</p>
            )}

            {/* More Button */}
            {comments.length > 3 && !showAllComments && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => setShowAllComments(true)}
                        className="relative w-full py-3 bg-[#F7E2C5] rounded-full text-[#A47B47] text-lg font-semibold flex items-center justify-center transition hover:bg-[#EFD2B1]"
                    >
                        <span className="flex items-center gap-2 justify-center">More <BsChevronDown size={16} /></span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentSection;
