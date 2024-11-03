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
                <div className="mt-4 p-4 bg-white rounded-md shadow-md mb-6 text-darkBrown">
                    {error && (
                        <p className="text-red-500 text-sm font-semibold">{error}</p>
                    )}
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="ID"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="outline-none w-1/2 border border-[#F3E5CF] rounded-md p-2 focus:ring-2 focus:ring-[#F3E5CF] focus:border-transparent transition"
                        />
                        <input
                            type="password"
                            placeholder="PW"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="outline-none w-1/2 border border-[#F3E5CF] rounded-md p-2 focus:ring-2 focus:ring-[#F3E5CF] focus:border-transparent transition"
                        />
                    </div>
                    <div className="flex items-start mt-2 justify-center">
                        <div className="relative flex-1">
                            <textarea
                                className="scrollbar-hide outline-none w-full border border-[#F3E5CF] rounded-md p-2 pr-12 focus:ring-2 focus:ring-[#F3E5CF] focus:border-transparent transition resize-none h-16 md:h-14"
                                placeholder="Write your comment here..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                maxLength={500}
                            />
                            <span className="absolute bottom-2 right-3 text-sm text-gray-400 pointer-events-none overflow-hidden">
                                {newComment.length}/500
                            </span>
                        </div>
                        <button
                            onClick={handleAddComment}
                            className="ml-2 bg-[#F3E5CF] text-darkBrown rounded-md hover:bg-[#e3d1b8] transition px-6 md:px-10 py-2 h-16 md:h-14"
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
                            className="p-4 bg-white rounded-md shadow-custom"
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
