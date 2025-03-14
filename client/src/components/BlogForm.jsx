import React, { useState, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import CSS của Quill

const BlogForm = ({ addPost, editPost, updatePost }) => {
    const [title, setTitle] = useState(editPost ? editPost.title : "");
    const [content, setContent] = useState(editPost ? editPost.content : "");
    const editorRef = useRef(null);
    const quillRef = useRef(null);


    useEffect(() => {
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: "snow",
                placeholder: "Nhập nội dung bài viết...",
                modules: {
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["blockquote", "code-block"],
                        ["link", "image"],
                    ],
                },
            });

            // Lắng nghe thay đổi nội dung
            quillRef.current.on("text-change", () => {
                setContent(quillRef.current.root.innerHTML);
            });
            quillRef.current.root.style.fontSize = "18px";
        }

    }, []); // Chỉ chạy 1 lần khi component mount

    // 🛠 Cập nhật nội dung khi editPost thay đổi
    useEffect(() => {
        if (editPost) {
            setTitle(editPost.title); // Cập nhật tiêu đề khi chỉnh sửa
            setContent(editPost.content); // Cập nhật state nội dung
            if (quillRef.current) {
                quillRef.current.root.innerHTML = editPost.content; // Cập nhật Quill Editor
            }
        }
    }, [editPost]);




    const handleSubmit = (e) => {
        e.preventDefault();
        const newPost = { title, content };

        if (editPost) {
            updatePost({ ...editPost, ...newPost });
        } else {
            addPost(newPost);
        }

        // Reset form
        setTitle("");
        setContent("");
        quillRef.current.root.innerHTML = "";
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">{editPost ? "✏️ Chỉnh sửa bài viết" : "📝 Đăng bài mới"}</h2>

            {/* Tiêu đề bài viết */}
            <div className="mb-4">
                <label className="block text-gray-700 font-medium text-xl">Tiêu đề</label>
                <input
                    type="text"
                    placeholder="Nhập tiêu đề bài viết"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Nội dung bài viết (Quill Editor) */}
            <div className="mb-4">
                <label className="block text-gray-700 font-medium text-xl">Nội dung</label>
                <div ref={editorRef} className="mt-2 border border-gray-300 rounded-lg h-56"></div>
            </div>

            {/* Nút gửi */}
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full font-bold shadow-lg hover:bg-blue-700 transition-all">
                {editPost ? "Cập nhật bài viết" : "Đăng bài"}
            </button>
        </form>
    );
};

export default BlogForm;
