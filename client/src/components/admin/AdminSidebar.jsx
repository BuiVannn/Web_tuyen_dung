import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        // { title: 'Dashboard', path: '/admin', icon: 'dashboard' },
        // { title: 'Quản lý ứng viên', path: '/admin/candidates', icon: 'person' },
        // { title: 'Quản lý nhà tuyển dụng', path: '/admin/recruiters', icon: 'business' },
        // { title: 'Quản lý công việc', path: '/admin/jobs', icon: 'work' },
        // { title: 'Thống kê', path: '/admin/statistics', icon: 'bar_chart' },
        // { title: 'Cài đặt', path: '/admin/settings', icon: 'settings' }

        { title: 'Dashboard', path: '/admin' },
        { title: 'Quản lý ứng viên', path: '/admin/candidates' },
        { title: 'Quản lý nhà tuyển dụng', path: '/admin/recruiters' },
        // { title: 'Quản lý công việc', path: '/admin/jobs' },
        // { title: 'Thống kê', path: '/admin/statistics' },
        // { title: 'Cài đặt', path: '/admin/settings' }
    ];

    return (
        <div className={`bg-primary text-black h-screen ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 flex flex-col`}>
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                {!isCollapsed && <h2 className="text-xl font-bold">Admin Dashboard</h2>}
                <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-black">
                    {/* <span className="material-icons">{isCollapsed ? 'arrow_forward' : 'arrow_back'}</span> */}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                <ul className="mt-6">
                    {menuItems.map((item) => (
                        <li key={item.path} className="mb-2">
                            <Link
                                to={item.path}
                                className={`flex items-center p-3 ${location.pathname === item.path ? 'bg-blue-700' : 'hover:bg-blue-800'} rounded-lg transition-all`}
                            >
                                <span className="material-icons mr-3">{item.icon}</span>
                                {!isCollapsed && <span>{item.title}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="p-4 border-t border-gray-700">
                <Link to="/" className="flex items-center text-black-300 hover:text-black">
                    {/* <span className="material-icons mr-3">exit_to_app</span> */}
                    {!isCollapsed && <span>Quay lại trang chính</span>}
                </Link>
            </div>
        </div>
    );
};

export default AdminSidebar;