import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminHeader = ({ title }) => {
    const [date, setDate] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        const today = new Date();
        setDate(today.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

        // Giả lập dữ liệu thông báo
        setNotifications([
            { id: 1, message: 'Ứng viên mới đã đăng ký', time: '10 phút trước', read: false },
            { id: 2, message: 'Công ty ABC đã đăng tin tuyển dụng mới', time: '30 phút trước', read: false },
            { id: 3, message: 'Cập nhật hệ thống sắp diễn ra', time: '1 giờ trước', read: true },
        ]);
    }, []);

    const unreadNotifications = notifications.filter(notif => !notif.read).length;

    // Đánh dấu tất cả thông báo là đã đọc
    const markAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    };

    // Đăng xuất
    const handleLogout = () => {
        // Xử lý logic đăng xuất ở đây
        console.log('Đăng xuất');
    };

    return (
        <header className="bg-white shadow-sm z-10 px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
                    <p className="text-sm text-gray-500">{date}</p>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <div className="relative">
                        {/* <button */}
                        {/* // className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none" */}
                        {/* // onClick={() => setShowNotifications(!showNotifications)} */}
                        {/* // > */}
                        {/* <span className="material-icons">notifications</span> */}
                        {/* {unreadNotifications > 0 && ( */}
                        {/* // <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"> */}
                        {/* {unreadNotifications} */}
                        {/* </span> */}
                        {/* // )} */}
                        {/* </button> */}

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50">
                                {/* <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center"> */}
                                {/* <h3 className="text-sm font-semibold">Thông báo</h3> */}
                                {/* {unreadNotifications > 0 && ( */}
                                {/* // <button */}
                                {/* // onClick={markAllAsRead} */}
                                {/* // className="text-xs text-blue-600 hover:text-blue-800" */}
                                {/* // > */}
                                {/* Đánh dấu tất cả là đã đọc */}
                                {/* </button> */}
                                {/* // )} */}
                                {/* </div> */}
                                {/* {notifications.length > 0 ? ( */}
                                {/* // <div className="max-h-96 overflow-y-auto"> */}
                                {/* {notifications.map(notification => ( */}
                                {/* // <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}> */}
                                {/* <p className="text-sm">{notification.message}</p> */}
                                {/* <p className="text-xs text-gray-500">{notification.time}</p> */}
                                {/* </div> */}
                                {/* // ))} */}
                                {/* </div>) : ( */}
                                {/* // <div className="px-4 py-3 text-sm text-gray-500"> */}
                                {/* Không có thông báo mới */}
                                {/* </div>)} */}
                                <div className="px-4 py-2 border-t border-gray-200">
                                    <Link to="/admin/notifications" className="text-xs text-blue-600 hover:text-blue-800">
                                        Xem tất cả thông báo
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Search */}
                    <div className="hidden md:block">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="material-icons text-gray-400 text-sm">search</span>
                            </span>
                            <input
                                type="text"
                                //placeholder="Tìm kiếm..."
                                className="py-2 pl-10 pr-4 w-60 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-gray-300"
                            />
                        </div>
                    </div>

                    {/* Profile */}
                    <div className="relative">
                        <button
                            className="flex items-center space-x-2 focus:outline-none"
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                        >
                            <img
                                src="/avatar-placeholder.jpg"
                                alt="Avatar"
                                className="w-10 h-10 rounded-full border-2 border-gray-200"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '';
                                }}
                            />
                            <div className="hidden md:block text-left">
                                <h3 className="text-sm font-medium">Admin User</h3>
                                <p className="text-xs text-gray-500">Quản trị viên</p>
                            </div>
                            {/* <span className="material-icons text-gray-400">arrow_drop_down</span> */}
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50">
                                <Link to="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <span className="material-icons text-sm mr-2 align-middle">person</span>
                                    Thông tin cá nhân
                                </Link>
                                <Link to="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <span className="material-icons text-sm mr-2 align-middle">settings</span>
                                    Cài đặt
                                </Link>
                                <div className="border-t border-gray-200 my-1"></div>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    <span className="material-icons text-sm mr-2 align-middle">logout</span>
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;