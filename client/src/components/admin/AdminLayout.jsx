// src/components/admin/AdminLayout.jsx
import React, { useState, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

// Tạo Context để component con có thể set title cho Header (Cách nâng cao, tùy chọn)
const LayoutContext = createContext(null);
export const useAdminLayout = () => useContext(LayoutContext);

const AdminLayout = () => {
    // Quản lý trạng thái đóng/mở Sidebar ở Layout cha
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    // Quản lý title cho Header
    const [headerTitle, setHeaderTitle] = useState("Dashboard"); // Title mặc định

    // --- TODO (Nâng cao/Sau này): ---
    // Lấy thông tin admin đang đăng nhập (từ Context hoặc localStorage) để hiển thị avatar/tên trên Header
    // const { adminData } = useContext(AdminContext); // Ví dụ nếu có AdminContext
    // Lấy hàm logout (từ Context) để truyền vào Header
    // const { logoutAdmin } = useContext(AdminContext);
    // ---------------------------------

    return (
        // Cung cấp hàm setHeaderTitle cho các component con qua Context Provider
        <LayoutContext.Provider value={{ setHeaderTitle }}>
            <div className="flex h-screen bg-gray-100">
                {/* Truyền trạng thái và hàm cập nhật xuống Sidebar */}
                <AdminSidebar
                    isCollapsed={isSidebarCollapsed}
                    setIsCollapsed={setIsSidebarCollapsed}
                />

                {/* Phần nội dung chính, co giãn theo Sidebar */}
                {/* Sử dụng class Tailwind để thay đổi margin-left dựa trên trạng thái sidebar */}
                <div className={`flex-1 flex flex-col overflow-hidden transition-margin duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}> {/* Giả sử width là w-20 và w-64 */}
                    {/* Truyền title và các props cần thiết khác xuống Header */}
                    <AdminHeader
                        title={headerTitle}
                    // handleLogout={logoutAdmin} // Truyền hàm logout nếu có
                    // adminUser={adminData} // Truyền data admin nếu có
                    />
                    {/* Phần nội dung chính của từng trang con sẽ được render ở đây */}
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50"> {/* Thêm pading và bg */}
                        <Outlet context={{ setHeaderTitle }} /> {/* Truyền context xuống Outlet */}
                    </main>
                </div>
            </div>
        </LayoutContext.Provider>
    );
};

export default AdminLayout;