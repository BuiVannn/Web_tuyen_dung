import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';

const AdminHeader = ({ title }) => {
    const [date, setDate] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { backendUrl } = useContext(AppContext);

    // Lấy profile admin từ API
    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    return;
                }

                const response = await axios.get(`${backendUrl}/api/admin/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setAdminData(response.data.admin);
                    // Lưu thông tin admin vào localStorage để dùng khi cần
                    localStorage.setItem('adminName', response.data.admin.name);
                }
            } catch (error) {
                console.error('Error fetching admin profile:', error);
                // Nếu lỗi 401 hoặc 403, có thể token đã hết hạn
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    handleLogout();
                }
            } finally {
                setLoading(false);
            }
        };

        if (backendUrl) {
            fetchAdminProfile();
        }
    }, [backendUrl]);

    // Lấy ngày hiện tại
    useEffect(() => {
        const today = new Date();
        setDate(today.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }));
    }, []);

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

    // Hiển thị phần admin name từ dữ liệu lấy được hoặc từ localStorage
    const displayName = adminData?.name || localStorage.getItem('adminName') || 'Admin';

    // Định dạng tiêu đề
    const formatTitle = (title) => {
        if (!title) return 'Dashboard';

        // Nếu tiêu đề có dạng camelCase hoặc kebab-case, chuyển thành dạng có khoảng trắng
        return title
            .replace(/([A-Z])/g, ' $1') // camelCase -> camel Case
            .replace(/-/g, ' ') // kebab-case -> kebab case
            .replace(/^./, str => str.toUpperCase()); // Viết hoa chữ cái đầu
    };

    return (
        <header className="bg-white shadow-sm z-10 px-4 md:px-6 py-3 h-[65px] border-b border-gray-200">
            <div className="flex items-center justify-between h-full">
                {/* Title và Date */}
                <div>
                    <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
                        {formatTitle(title)}
                    </h1>
                    <p className="text-xs text-gray-500 hidden sm:block">{date}</p>
                </div>

                {/* Right side - Profile only (Notifications removed) */}
                <div className="flex items-center space-x-3 md:space-x-4">
                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            className="flex items-center space-x-2 focus:outline-none"
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center overflow-hidden border-2 border-gray-200">
                                {adminData?.avatar ? (
                                    <img src={adminData.avatar} alt={displayName} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="material-icons text-base">person</span>
                                )}
                            </div>
                            <div className="hidden md:block text-left">
                                <h3 className="text-sm font-medium text-gray-800">{displayName}</h3>
                                <p className="text-xs text-gray-600">Quản trị viên</p>
                            </div>
                            <span className={`material-icons text-gray-500 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`}>
                                expand_more
                            </span>
                        </button>

                        {/* Profile Menu */}
                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                                <div className="p-3 border-b border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-800">{displayName}</h3>
                                    <p className="text-xs text-gray-600">Quản trị viên</p>
                                </div>

                                <div className="py-1">
                                    <Link to="/admin/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <span className="material-icons text-base mr-2">account_circle</span>
                                        Thông tin cá nhân
                                    </Link>
                                    <Link to="/admin/activity" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <span className="material-icons text-base mr-2">history</span>
                                        Lịch sử hoạt động
                                    </Link>
                                    <Link to="/admin/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        <span className="material-icons text-base mr-2">settings</span>
                                        Cài đặt
                                    </Link>
                                </div>

                                <div className="border-t border-gray-100 mt-1 py-1">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        <span className="material-icons text-base mr-2">logout</span>
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
// import React, { useState, useEffect, useContext, Fragment } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { AppContext } from '../../context/AppContext';
// import { Menu, Transition } from '@headlessui/react';
// import { useNotifications } from '../../context/NotificationContext';

// const AdminHeader = ({ title }) => {
//     const [date, setDate] = useState('');
//     const [showProfileMenu, setShowProfileMenu] = useState(false);
//     const [adminData, setAdminData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [showNotifications, setShowNotifications] = useState(false);
//     const navigate = useNavigate();
//     const { backendUrl } = useContext(AppContext);
//     const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();

//     // Lấy profile admin từ API
//     useEffect(() => {
//         const fetchAdminProfile = async () => {
//             try {
//                 const token = localStorage.getItem('adminToken');
//                 if (!token) {
//                     return;
//                 }

//                 const response = await axios.get(`${backendUrl}/api/admin/profile`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });

//                 if (response.data.success) {
//                     setAdminData(response.data.admin);
//                     // Lưu thông tin admin vào localStorage để dùng khi cần
//                     localStorage.setItem('adminName', response.data.admin.name);
//                 }
//             } catch (error) {
//                 console.error('Error fetching admin profile:', error);
//                 // Nếu lỗi 401 hoặc 403, có thể token đã hết hạn
//                 if (error.response && (error.response.status === 401 || error.response.status === 403)) {
//                     handleLogout();
//                 }
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (backendUrl) {
//             fetchAdminProfile();
//         }
//     }, [backendUrl]);

//     // Lấy ngày hiện tại
//     useEffect(() => {
//         const today = new Date();
//         setDate(today.toLocaleDateString('vi-VN', {
//             weekday: 'long',
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//         }));
//     }, []);

//     // Làm mới thông báo khi mở dropdown
//     const toggleNotifications = () => {
//         if (!showNotifications) {
//             // Nếu đang mở dropdown, lấy thông báo mới
//             fetchNotifications();
//         }
//         setShowNotifications(!showNotifications);
//     };

//     const handleMarkAllAsRead = () => {
//         markAllAsRead();
//         toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
//     };

//     const handleLogout = async () => {
//         try {
//             const token = localStorage.getItem('adminToken');
//             if (!token) {
//                 console.error("No admin token found");
//                 return;
//             }
//             console.log(`Sending logout request to: ${backendUrl}/api/auth/admin/logout`);
//             console.log("Using token:", token.substring(0, 15) + "...");
//             const response = await axios.post(
//                 `${backendUrl}/api/auth/admin/logout`,
//                 {},
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//             console.log("Logout response:", response.data);
//         } catch (error) {
//             console.error("Logout error:", error.response?.data || error.message);
//         } finally {
//             localStorage.removeItem('adminToken');
//             localStorage.removeItem('adminName');
//             toast.success('Đăng xuất thành công');
//             navigate('/admin/login');
//         }
//     };

//     const handleDebugNotifications = async (e) => {
//         e.preventDefault();
//         e.stopPropagation();

//         try {
//             const token = localStorage.getItem('adminToken');
//             if (!token) {
//                 toast.error("Không tìm thấy token admin");
//                 return;
//             }

//             if (!backendUrl) {
//                 toast.error("Không tìm thấy URL backend");
//                 return;
//             }

//             toast.info("Đang kiểm tra thông báo...");

//             try {
//                 console.log(`Gọi API debug thông báo: ${backendUrl}/api/notifications/debug/admin`);

//                 const response = await axios.get(
//                     `${backendUrl}/api/notifications/debug/admin`,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`
//                         }
//                     }
//                 );

//                 console.log("Debug notification response:", response.data);

//                 if (response.data && response.data.success) {
//                     const totalCount = response.data.allAdminNotifications?.count || 0;
//                     const stringCount = response.data.stringNotifications?.count || 0;

//                     toast.success(`Tìm thấy ${totalCount} thông báo cho admin (${stringCount} thông báo chung)`);

//                     // Hiển thị chi tiết trong console
//                     if (response.data.allAdminNotifications?.items?.length > 0) {
//                         console.table(response.data.allAdminNotifications.items.map(n => ({
//                             id: n._id,
//                             recipient: typeof n.recipient === 'object' ? 'ObjectId' : n.recipient,
//                             message: n.message.substring(0, 50) + '...',
//                             read: n.read,
//                             createdAt: new Date(n.createdAt).toLocaleString()
//                         })));

//                         // Gợi ý thêm thông báo cho testing
//                         console.log('Để thêm thông báo test, mở MongoDB Compass và tạo document với recipient: "admin", recipientModel: "Admin"');
//                     } else {
//                         console.log("Không có thông báo nào cho admin");
//                     }

//                     // Refresh lại notifications
//                     fetchNotifications();
//                 } else {
//                     toast.error("Không thể lấy thông tin debug: " + (response.data?.message || 'Unknown error'));
//                 }
//             } catch (error) {
//                 console.error("Error checking notifications:", error);

//                 if (error.response) {
//                     toast.error(`Lỗi server: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
//                     console.error("Server response:", error.response.data);
//                 } else if (error.request) {
//                     toast.error("Không nhận được phản hồi từ server");
//                 } else {
//                     toast.error("Lỗi khi kiểm tra thông báo: " + error.message);
//                 }
//             }
//         } catch (error) {
//             console.error("Error in handleDebugNotifications:", error);
//             toast.error("Có lỗi xảy ra khi kiểm tra thông báo");
//         }
//     };

//     // Hiển thị phần admin name từ dữ liệu lấy được hoặc từ localStorage
//     const displayName = adminData?.name || localStorage.getItem('adminName') || 'Admin';

//     // Định dạng tiêu đề
//     const formatTitle = (title) => {
//         if (!title) return 'Dashboard';

//         // Nếu tiêu đề có dạng camelCase hoặc kebab-case, chuyển thành dạng có khoảng trắng
//         return title
//             .replace(/([A-Z])/g, ' $1') // camelCase -> camel Case
//             .replace(/-/g, ' ') // kebab-case -> kebab case
//             .replace(/^./, str => str.toUpperCase()); // Viết hoa chữ cái đầu
//     };

//     return (
//         <header className="bg-white shadow-sm z-10 px-4 md:px-6 py-3 h-[65px] border-b border-gray-200">
//             <div className="flex items-center justify-between h-full">
//                 {/* Title và Date */}
//                 <div>
//                     <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
//                         {formatTitle(title)}
//                     </h1>
//                     <p className="text-xs text-gray-500 hidden sm:block">{date}</p>
//                 </div>

//                 {/* Right side - Notifications and Profile */}
//                 <div className="flex items-center space-x-3 md:space-x-4">
//                     {/* Notifications - Sử dụng material-icons thay vì heroicons */}
//                     <Menu as="div" className="relative">
//                         <Menu.Button className="relative p-1 text-gray-600 hover:text-gray-900 focus:outline-none"
//                             onClick={() => fetchNotifications()}>
//                             <span className="material-icons">notifications</span>
//                             {unreadCount > 0 && (
//                                 <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
//                                     {unreadCount > 99 ? '99+' : unreadCount}
//                                 </span>
//                             )}
//                         </Menu.Button>

//                         <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
//                             <div className="px-4 py-3 flex justify-between items-center border-b">
//                                 <p className="text-sm font-medium text-gray-900">Thông báo ({unreadCount} chưa đọc)</p>
//                                 <div className="flex space-x-2">
//                                     <button
//                                         onClick={(e) => {
//                                             e.preventDefault();
//                                             e.stopPropagation();
//                                             fetchNotifications();
//                                         }}
//                                         className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
//                                     >
//                                         <span className="material-icons text-sm mr-1">refresh</span>
//                                         Làm mới
//                                     </button>
//                                     {unreadCount > 0 && (
//                                         <button
//                                             onClick={(e) => {
//                                                 e.preventDefault();
//                                                 e.stopPropagation();
//                                                 markAllAsRead();
//                                             }}
//                                             className="text-xs text-blue-600 hover:text-blue-800"
//                                         >
//                                             Đánh dấu tất cả đã đọc
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="max-h-60 overflow-y-auto">
//                                 {loading ? (
//                                     <div className="px-4 py-3 text-sm text-gray-500 text-center">
//                                         <span className="material-icons animate-spin inline-block mr-2">refresh</span>
//                                         Đang tải thông báo...
//                                     </div>
//                                 ) : !notifications || notifications.length === 0 ? (
//                                     <div className="px-4 py-3 text-sm text-gray-500">
//                                         Không có thông báo nào
//                                         {unreadCount > 0 && (
//                                             <>
//                                                 <p className="text-xs text-red-500 mt-1">
//                                                     <span className="material-icons text-xs align-middle mr-1">error</span>
//                                                     Có {unreadCount} thông báo chưa đọc nhưng không thể hiển thị
//                                                 </p>
//                                                 <button
//                                                     onClick={(e) => {
//                                                         e.preventDefault();
//                                                         e.stopPropagation();
//                                                         handleDebugNotifications(e);
//                                                     }}
//                                                     className="mt-2 text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-gray-800"
//                                                 >
//                                                     Kiểm tra thông báo
//                                                 </button>
//                                             </>
//                                         )}
//                                     </div>
//                                 ) : (
//                                     notifications.slice(0, 5).map(notif => (
//                                         <Menu.Item key={notif._id || `temp-${Math.random()}`}>
//                                             {({ active }) => (
//                                                 <div
//                                                     className={`px-4 py-2 border-b last:border-b-0 ${active ? 'bg-gray-100' : ''} ${!notif.read ? 'bg-blue-50' : ''}`}
//                                                     onClick={() => markAsRead(notif._id)}
//                                                 >
//                                                     <div className="flex items-start">
//                                                         <div className={`rounded-full p-2 bg-blue-500 text-white mr-3 flex-shrink-0`}>
//                                                             <span className="material-icons text-sm">
//                                                                 {notif.type === 'job_created' ? 'work' : 'notifications'}
//                                                             </span>
//                                                         </div>
//                                                         <div>
//                                                             <p className="text-sm text-gray-800">{notif.message}</p>
//                                                             <p className="text-xs text-gray-500 mt-1">
//                                                                 {notif.createdAt
//                                                                     ? new Date(notif.createdAt).toLocaleString()
//                                                                     : 'Thời gian không xác định'}
//                                                             </p>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </Menu.Item>
//                                     ))
//                                 )}
//                             </div>

//                             <div className="px-4 py-2 border-t">
//                                 <Link
//                                     to="/admin/notifications"
//                                     className="block text-sm text-center text-blue-600 hover:text-blue-800"
//                                     onClick={() => {
//                                         // Đóng dropdown khi click
//                                         document.body.click();
//                                     }}
//                                 >
//                                     Xem tất cả thông báo
//                                 </Link>
//                             </div>
//                         </Menu.Items>
//                     </Menu>

//                     {/* Profile Dropdown */}
//                     <div className="relative">
//                         <button
//                             className="flex items-center space-x-2 focus:outline-none"
//                             onClick={() => setShowProfileMenu(!showProfileMenu)}
//                         >
//                             <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center overflow-hidden border-2 border-gray-200">
//                                 {adminData?.avatar ? (
//                                     <img src={adminData.avatar} alt={displayName} className="w-full h-full object-cover" />
//                                 ) : (
//                                     <span className="material-icons text-base">person</span>
//                                 )}
//                             </div>
//                             <div className="hidden md:block text-left">
//                                 <h3 className="text-sm font-medium text-gray-800">{displayName}</h3>
//                                 <p className="text-xs text-gray-600">Quản trị viên</p>
//                             </div>
//                             <span className={`material-icons text-gray-500 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`}>
//                                 expand_more
//                             </span>
//                         </button>

//                         {/* Profile Menu */}
//                         {showProfileMenu && (
//                             <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50">
//                                 <div className="p-3 border-b border-gray-200">
//                                     <h3 className="text-sm font-medium text-gray-800">{displayName}</h3>
//                                     <p className="text-xs text-gray-600">Quản trị viên</p>
//                                 </div>

//                                 <div className="py-1">
//                                     <Link to="/admin/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         <span className="material-icons text-base mr-2">account_circle</span>
//                                         Thông tin cá nhân
//                                     </Link>
//                                     <Link to="/admin/activity" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         <span className="material-icons text-base mr-2">history</span>
//                                         Lịch sử hoạt động
//                                     </Link>
//                                     <Link to="/admin/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         <span className="material-icons text-base mr-2">settings</span>
//                                         Cài đặt
//                                     </Link>
//                                 </div>

//                                 <div className="border-t border-gray-100 mt-1 py-1">
//                                     <button
//                                         onClick={handleLogout}
//                                         className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                                     >
//                                         <span className="material-icons text-base mr-2">logout</span>
//                                         Đăng xuất
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </header>
//     );
// };

// export default AdminHeader;