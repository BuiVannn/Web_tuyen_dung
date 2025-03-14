import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BlogEdit = ({ posts, updatePost }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const post = posts.find((p) => p.id === parseInt(id));

    const [title, setTitle] = useState(post?.title || "");
    const [content, setContent] = useState(post?.content || "");

    if (!post) {
        return <p className="text-center text-gray-500">Bài viết không tồn tại.</p>;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        updatePost({ ...post, title, content });
        navigate(`/blog/${post.id}`); // Quay về trang chi tiết bài viết sau khi lưu
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto p-4">
                <button onClick={() => navigate("/blog")} className="text-blue-500 mb-4">← Quay lại</button>
                <h1 className="text-3xl font-bold">Chỉnh sửa bài viết</h1>
                <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded-lg bg-white shadow">
                    <label className="block mb-2">Tiêu đề:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />

                    <label className="block mt-4 mb-2">Nội dung:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-2 border rounded h-40"
                        required
                    ></textarea>

                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4">
                        💾 Lưu thay đổi
                    </button>
                </form>
            </main>
            <Footer />
        </div>
    );
};

export default BlogEdit;
