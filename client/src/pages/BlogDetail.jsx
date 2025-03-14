import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const mockPosts = [
    { id: 1, title: "5 mẹo để chuẩn bị phỏng vấn thành công", content: "Chi tiết mẹo...Axios xây dựng dựa trên nền tảng Promise do đó nó kế thừa các ưu điểm của Promise. Cho phép thực hiện các hook (intercept) ngay khi gửi request và nhận response. Cho phép hủy yêu cầu, đây là một chức năng mà các thư viện khác không có. Axios là HTTP Client giúp xây dựng các ứng dụng kết nối từ nhiều nguồn dữ liệu. Axios là phần công cụ giúp lấy dữ liệu dễ dàng cho các framework như Vue.js, React.js, Angular… xây dựng các ứng dụng font-end linh động.", author: "Nguyễn Văn A - Ứng viên", date: "2025-03-14" },
    { id: 2, title: "Cách thu hút ứng viên giỏi", content: "Chi tiết cách thu hút...", author: "Công ty XYZ - Nhà tuyển dụng", date: "2025-03-13" },
];

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const post = mockPosts.find((p) => p.id === parseInt(id));

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow container mx-auto p-4 text-center">
                    <p className="text-xl text-red-500 font-semibold">Bài viết không tồn tại.</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto p-6 max-w-3xl">
                {/* Nút quay lại */}
                <button
                    onClick={() => navigate("/blog")}
                    className="mb-6 text-blue-600 font-semibold hover:underline flex items-center"
                >
                    ← Quay lại
                </button>

                {/* Bài viết */}
                <div className="bg-white shadow-lg rounded-2xl p-6">
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-4">{post.title}</h1>

                    <div className="flex justify-between items-center text-gray-500 text-sm mb-6">
                        <span className="font-medium">{post.author}</span>
                        <span>{post.date}</span>
                    </div>

                    <p className="text-gray-700 leading-relaxed">{post.content}</p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BlogDetail;
