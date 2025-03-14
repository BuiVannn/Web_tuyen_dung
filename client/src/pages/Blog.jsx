import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react"; // Clerk hook để lấy thông tin user
import BlogPost from "../components/BlogPost";
import BlogForm from "../components/BlogForm";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Blog = () => {
    const { user } = useUser(); // Lấy thông tin user từ Clerk
    const [posts, setPosts] = useState([
        {
            id: 1,
            title: "5 mẹo để chuẩn bị phỏng vấn thành công",
            content: "Hãy nghiên cứu công ty, luyện tập câu trả lời, và tự tin!",
            author: "Nguyễn Văn A - Ứng viên",
            date: "2025-03-14",
        },
        {
            id: 2,
            title: "Cách thu hút ứng viên giỏi",
            content: "Đưa ra mức lương cạnh tranh và môi trường làm việc tốt.",
            author: "Công ty XYZ - Nhà tuyển dụng",
            date: "2025-03-13",
        },
    ]);

    const [editPost, setEditPost] = useState(null);
    const [isManageMode, setIsManageMode] = useState(false); // Chuyển đổi giữa view/manage mode

    // Mock tạm cho nhà tuyển dụng (vì chưa có backend)
    const currentUser = user
        ? { id: user.id, name: `${user.fullName} - Ứng viên` } // Ứng viên từ Clerk
        : { id: "mock-recruiter", name: "Công ty ABC - Nhà tuyển dụng" }; // Mock nhà tuyển dụng

    const addPost = (newPost) => {
        setPosts([
            ...posts,
            {
                ...newPost,
                id: posts.length + 1,
                author: currentUser.name, // Tự động lấy tên người đăng nhập
                date: new Date().toISOString().split("T")[0],
            },
        ]);
    };

    const updatePost = (updatedPost) => {
        setPosts(posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
        setEditPost(null);
    };

    const deletePost = (id) => {
        setPosts(posts.filter((post) => post.id !== id));
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-300">
            <Navbar />
            <main className="flex-grow container mx-auto p-6 max-w-4xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 bg-white shadow-md p-6 rounded-xl">
                    <h1 className="text-4xl font-extrabold text-gray-800">📢 Blog Tuyển Dụng</h1>
                    {currentUser && (
                        <button
                            onClick={() => setIsManageMode(!isManageMode)}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-lg transition-all duration-200 hover:bg-blue-700"
                        >
                            {isManageMode ? "🔍 Chuyển sang xem" : "✏️ Quản lý bài viết"}
                        </button>
                    )}
                </div>

                {/* Quản lý bài viết */}
                {isManageMode && currentUser ? (
                    <>
                        <BlogForm addPost={addPost} editPost={editPost} updatePost={updatePost} />
                        <div className="mt-8 space-y-4">
                            {posts
                                .filter((post) => post.author === currentUser.name)
                                .map((post) => (
                                    <BlogPost
                                        key={post.id}
                                        post={post}
                                        onEdit={() => setEditPost(post)}
                                        onDelete={() => deletePost(post.id)}
                                        isManageMode={true}
                                    />
                                ))}
                        </div>
                    </>
                ) : (
                    // Danh sách bài viết (Chế độ xem)
                    <div className="mt-8 grid gap-6">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-all duration-200"
                                >
                                    <BlogPost post={post} isManageMode={false} />
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 text-lg">📭 Chưa có bài viết nào.</p>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>

    );
};

export default Blog;