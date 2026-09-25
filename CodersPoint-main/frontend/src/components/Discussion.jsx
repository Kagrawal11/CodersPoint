import React, { useEffect, useState } from "react";
import { MessageSquare, Send, Trash2, Loader } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const Discussion = ({ problemId }) => {
    const { authUser } = useAuthStore();
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isPosting, setIsPosting] = useState(false);

    const fetchComments = async () => {
        try {
            const res = await axiosInstance.get(`/comments/problem/${problemId}`);
            setComments(res.data.data);
        } catch {
            toast.error("Couldn't load discussion");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [problemId]);

    const handlePost = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        try {
            setIsPosting(true);
            const res = await axiosInstance.post(`/comments/problem/${problemId}`, {
                content,
            });
            setComments((prev) => [res.data.data, ...prev]);
            setContent("");
        } catch {
            toast.error("Couldn't post comment");
        } finally {
            setIsPosting(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/comments/${id}`);
            setComments((prev) => prev.filter((c) => c.id !== id));
        } catch {
            toast.error("Couldn't delete comment");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <form onSubmit={handlePost} className="flex flex-col gap-2">
                <textarea
                    className="textarea w-full resize-y rounded-xl border-white/10 bg-base-300/40 p-3 focus:border-primary focus:outline-none"
                    rows={3}
                    placeholder="Share your approach or ask a question..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button
                    type="submit"
                    className="btn btn-primary btn-sm gap-2 self-end rounded-xl"
                    disabled={isPosting || !content.trim()}
                >
                    {isPosting ? (
                        <span className="loading loading-spinner loading-xs" />
                    ) : (
                        <Send className="h-3.5 w-3.5" />
                    )}
                    Post
                </button>
            </form>

            {comments.length === 0 ? (
                <div className="flex flex-col items-center gap-2 p-8 text-center text-base-content/50">
                    <MessageSquare className="h-8 w-8 text-base-content/25" />
                    <p className="font-medium">No discussions yet</p>
                    <p className="text-sm text-base-content/40">
                        Be the first to share your approach.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="rounded-xl border border-white/5 bg-base-300/60 p-4"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="avatar">
                                        <div className="w-7 rounded-full">
                                            <img
                                                src={
                                                    comment.user?.image ||
                                                    "https://avatar.iran.liara.run/public/boy"
                                                }
                                                alt={comment.user?.name}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-base-content">
                                            {comment.user?.name || "Anonymous"}
                                        </p>
                                        <p className="text-xs text-base-content/40">
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                {(authUser?.id === comment.userId ||
                                    authUser?.role === "ADMIN") && (
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="btn btn-ghost btn-xs btn-circle text-error"
                                        title="Delete comment"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                            <p className="mt-3 whitespace-pre-wrap text-sm text-base-content/80">
                                {comment.content}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Discussion;
