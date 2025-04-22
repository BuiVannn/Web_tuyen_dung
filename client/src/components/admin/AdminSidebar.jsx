import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';

// Nhận props từ AdminLayout
const AdminSidebar = ({ isCollapsed, setIsCollapsed }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { backendUrl } = useContext(AppContext);
    const [stats, setStats] = useState({
        pendingJobs: 0,
        pendingApplications: 0
    });

    // Lấy thông báo các công việc, đơn ứng tuyển đang chờ phê duyệt
    useEffect(() => {
        const fetchPendingItems = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    return;
                }

                const response = await axios.get(`${backendUrl}/api/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setStats({
                        pendingJobs: response.data.stats.jobs?.pending || 0,
                        pendingApplications: response.data.stats.applications?.pending || 0
                    });
                }
            } catch (error) {
                console.error('Error fetching pending items:', error);
            }
        };

        if (backendUrl) {
            fetchPendingItems();
        }
    }, [backendUrl]);

    // Danh sách menu - đã bỏ phần phân quyền và cài đặt hệ thống
    const menuItems = [
        {
            title: 'Dashboard',
            path: '/admin/dashboard',
            icon: 'dashboard',
            badge: null
        },
        {
            title: 'Quản lý ứng viên',
            path: '/admin/candidates',
            icon: 'people',
            badge: null
        },
        {
            title: 'Quản lý nhà tuyển dụng',
            path: '/admin/recruiters',
            icon: 'business',
            badge: null
        },
        {
            title: 'Quản lý công việc',
            path: '/admin/jobs',
            icon: 'work',
            badge: stats.pendingJobs > 0 ? stats.pendingJobs : null
        },
        {
            title: 'Đơn ứng tuyển',
            path: '/admin/applications',
            icon: 'description',
            badge: stats.pendingApplications > 0 ? stats.pendingApplications : null
        },
        {
            title: 'Quản lý blog',
            path: '/admin/blogs',
            icon: 'article',
            badge: null
        },
        {
            title: 'Tài nguyên nghề nghiệp',
            path: '/admin/resources',
            icon: 'auto_stories',
            badge: null
        },
        // {
        // title: 'Cài đặt trang chủ',
        // path: '/admin/home-settings',
        // icon: 'home',
        // badge: null
        // }
    ];

    // Xử lý logout  
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                console.error("No admin token found");
                return;
            }

            console.log(`Sending logout request to: ${backendUrl}/api/auth/admin/logout`);
            console.log("Using token:", token.substring(0, 15) + "...");

            const response = await axios.post(
                `${backendUrl}/api/auth/admin/logout`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("Logout response:", response.data);
        } catch (error) {
            console.error("Logout error:", error.response?.data || error.message);
        } finally {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminName');
            toast.success('Đăng xuất thành công');
            navigate('/admin/login');
        }
    };

    return (
        <div className={`bg-gradient-to-b from-blue-800 to-blue-900 text-white h-screen fixed left-0 top-0 z-20 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            {/* Logo và Toggle Button */}
            <div className="flex items-center justify-between p-4 border-b border-blue-700/50 h-[65px]">
                {!isCollapsed && (
                    <Link to="/admin/dashboard" className="text-xl font-bold text-white flex items-center">
                        <span className="material-icons mr-2">admin_panel_settings</span>
                        <span>JobPortal</span>
                    </Link>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-white/80 hover:text-white p-1 rounded hover:bg-blue-700/30"
                >
                    <span className="material-icons">{isCollapsed ? 'menu_open' : 'menu'}</span>
                </button>
            </div>

            {/* Admin Info */}
            {!isCollapsed && (
                <div className="px-4 py-3 border-b border-blue-700/50">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <span className="material-icons">person</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">{localStorage.getItem('adminName') || 'Admin'}</p>
                            <p className="text-xs text-blue-200">Quản trị viên</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto pt-4 px-2">
                <ul className="space-y-1">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                title={isCollapsed ? item.title : ''}
                                className={`flex items-center p-3 rounded-lg transition-colors duration-200 relative
                                    ${location.pathname.startsWith(item.path)
                                        ? 'bg-blue-700/40 text-white font-medium'
                                        : 'text-blue-100 hover:bg-blue-700/20 hover:text-white'
                                    } ${isCollapsed ? 'justify-center' : ''}`}
                            >
                                <span className="material-icons mr-0 md:mr-3">{item.icon}</span>
                                {!isCollapsed && <span className="text-sm">{item.title}</span>}

                                {/* Badge for notifications */}
                                {item.badge && (
                                    <span className={`absolute ${isCollapsed ? 'top-1 right-1' : 'top-3 right-3'} bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center`}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-blue-700/50 space-y-2">
                <Link
                    to="/"
                    target="_blank"
                    title={isCollapsed ? "Xem trang chính" : ""}
                    className={`flex items-center text-blue-100 hover:text-white ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <span className="material-icons mr-0 md:mr-3">public</span>
                    {!isCollapsed && <span className="text-sm">Xem trang chính</span>}
                </Link>

                <button
                    onClick={handleLogout}
                    title={isCollapsed ? "Đăng xuất" : ""}
                    className={`flex items-center text-blue-100 hover:text-white w-full ${isCollapsed ? 'justify-center' : ''}`}
                >
                    <span className="material-icons mr-0 md:mr-3">logout</span>
                    {!isCollapsed && <span className="text-sm">Đăng xuất</span>}
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;