// src/components/AdminProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
    // Bước 1: Kiểm tra xem adminToken có tồn tại trong localStorage không
    const adminToken = localStorage.getItem('adminToken');

    // Bước 2: Xác định trạng thái đã đăng nhập
    // Cách đơn giản nhất là chỉ cần kiểm tra token có tồn tại hay không.
    // Toán tử !! sẽ chuyển đổi giá trị token (chuỗi hoặc null) thành boolean (true hoặc false).
    const isAdminAuthenticated = !!adminToken;

    // --- Ghi chú (Nâng cao/Sau này): ---
    // Để bảo mật tốt hơn, bạn có thể thêm các bước kiểm tra khác ở đây:
    // 1. Kiểm tra xem token có hợp lệ về mặt cấu trúc không.
    // 2. Dùng thư viện như 'jwt-decode' để kiểm tra xem token đã hết hạn chưa.
    // 3. (Bảo mật nhất) Gọi một API backend nhỏ để xác thực token phía server.
    // Tuy nhiên, với dự án sinh viên, việc kiểm tra sự tồn tại của token thường là đủ.
    // --- Hết ghi chú ---

    // Bước 3: Quyết định render hoặc điều hướng
    if (isAdminAuthenticated) {
        // Nếu đã đăng nhập (có token), cho phép hiển thị các component con (các trang admin)
        // <Outlet /> là component đặc biệt của react-router-dom v6, đại diện cho component con khớp với route lồng bên trong
        return <Outlet />;
    } else {
        // Nếu chưa đăng nhập (không có token), điều hướng người dùng về trang đăng nhập admin
        // `replace` được dùng để trang login thay thế trang hiện tại trong lịch sử trình duyệt,
        // tránh trường hợp người dùng nhấn nút Back lại quay về trang admin bị lỗi.
        return <Navigate to="/admin/login" replace />;
    }
};

export default AdminProtectedRoute;