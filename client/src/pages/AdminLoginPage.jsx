import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Lấy navigate từ react-router-dom
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy backendUrl từ AppContext
    const { backendUrl } = useContext(AppContext);

    // Kiểm tra nếu đã đăng nhập thì redirect đến dashboard
    useEffect(() => {
        // Kiểm tra token trong localStorage
        const adminToken = localStorage.getItem('adminToken');

        if (adminToken) {
            navigate('/admin/dashboard');
        }

        // Xóa token admin cũ nếu đã đăng xuất
        if (location.state?.loggedOut) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminName');
        }
    }, [navigate, location]);

    // Hàm xử lý khi submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!backendUrl) {
            toast.error("Lỗi cấu hình: Không tìm thấy backend URL.");
            setLoading(false);
            return;
        }

        try {
            console.log(`Gửi yêu cầu đăng nhập admin đến ${backendUrl}/api/auth/admin/login`);

            const response = await axios.post(`${backendUrl}/api/auth/admin/login`, {
                email: email.toLowerCase(),
                password: password,
            });

            const data = response.data;

            if (data.success) {
                // Lưu token vào localStorage
                localStorage.setItem('adminToken', data.token);

                // Lưu tên admin nếu có
                if (data.admin && data.admin.name) {
                    localStorage.setItem('adminName', data.admin.name);
                }

                toast.success(data.message || "Đăng nhập thành công!");

                // Khởi động lại trang để đảm bảo token được sử dụng đúng cách
                window.location.href = '/admin/dashboard';
            } else {
                toast.error(data.message || "Đăng nhập thất bại.");
            }
        } catch (error) {
            console.error("Lỗi đăng nhập Admin:", error);

            // Hiển thị thông báo lỗi cụ thể nếu có
            if (error.response && error.response.data) {
                console.log("Server trả về lỗi:", error.response.data);
                toast.error(error.response.data.message || "Đăng nhập thất bại!");
            } else {
                toast.error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Đăng nhập quản trị viên</h2>

                {/* Thêm phần debugging hiển thị thông tin trạng thái */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
                        <p>BackendUrl: {backendUrl ? 'Đã cấu hình' : 'Chưa cấu hình'}</p>
                        <p>AdminToken trong localStorage: {localStorage.getItem('adminToken') ? 'Đã có token' : 'Chưa có token'}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nhập email của bạn"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nhập mật khẩu của bạn"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </div>
                </form>

                {/* Các liên kết khác */}
                <div className="mt-6 text-center">
                    <Link
                        to="/"
                        className="text-sm text-blue-500 hover:text-blue-700"
                    >
                        Quay lại trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;