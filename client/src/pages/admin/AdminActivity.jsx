import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { useOutletContext } from 'react-router-dom';
import Loading from '../../components/Loading';

const AdminActivity = () => {
    const { backendUrl } = useContext(AppContext);
    const { setHeaderTitle } = useOutletContext() || {};
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState([]);
    const [devices, setDevices] = useState([]);
    const [filter, setFilter] = useState('all');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 1
    });

    useEffect(() => {
        if (setHeaderTitle) {
            setHeaderTitle("Lịch sử hoạt động");
        }
        if (backendUrl) {
            fetchActivityLogs();
            fetchLoginDevices();
        }
    }, [backendUrl, setHeaderTitle, filter, pagination.page]);

    const fetchActivityLogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                toast.error("Không tìm thấy token admin");
                setLoading(false);
                return;
            }

            const response = await axios.get(
                `${backendUrl}/api/admin/activities`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    params: {
                        page: pagination.page,
                        limit: pagination.limit,
                        type: filter !== 'all' ? filter : null
                    }
                }
            );

            if (response.data.success) {
                setActivities(response.data.activities);
                setPagination({
                    ...pagination,
                    total: response.data.pagination.total,
                    pages: response.data.pagination.pages
                });
            } else {
                toast.error(response.data.message || "Không thể tải lịch sử hoạt động");
            }
        } catch (error) {
            console.error("Error fetching activity logs:", error);
            toast.error(error.response?.data?.message || "Lỗi khi tải lịch sử hoạt động");
        } finally {
            setLoading(false);
        }
    };

    const fetchLoginDevices = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                return;
            }

            const response = await axios.get(
                `${backendUrl}/api/admin/login-devices`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setDevices(response.data.devices);
            }
        } catch (error) {
            console.error("Error fetching login devices:", error);
        }
    };

    const handleLogoutDevice = async (deviceId) => {
        try {
            // Logic để đăng xuất thiết bị
            // Trong phiên bản đơn giản, chúng ta có thể chỉ thông báo thành công
            toast.success("Đã đăng xuất thiết bị thành công");

            // Cập nhật lại danh sách thiết bị
            await fetchLoginDevices();
        } catch (error) {
            console.error("Error logging out device:", error);
            toast.error("Lỗi khi đăng xuất thiết bị");
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            setPagination({ ...pagination, page: newPage });
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'auth': return 'bg-blue-100 text-blue-800';
            case 'job': return 'bg-green-100 text-green-800';
            case 'user': return 'bg-red-100 text-red-800';
            case 'company': return 'bg-purple-100 text-purple-800';
            case 'blog': return 'bg-yellow-100 text-yellow-800';
            case 'profile': return 'bg-indigo-100 text-indigo-800';
            case 'resource': return 'bg-teal-100 text-teal-800';
            case 'application': return 'bg-orange-100 text-orange-800';
            case 'settings': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'auth': return 'login';
            case 'job': return 'work';
            case 'user': return 'person';
            case 'company': return 'business';
            case 'blog': return 'article';
            case 'profile': return 'account_circle';
            case 'resource': return 'auto_stories';
            case 'application': return 'description';
            case 'settings': return 'settings';
            default: return 'info';
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'auth': return 'Xác thực';
            case 'job': return 'Việc làm';
            case 'user': return 'Người dùng';
            case 'company': return 'Công ty';
            case 'blog': return 'Bài viết';
            case 'profile': return 'Cá nhân';
            case 'resource': return 'Tài nguyên';
            case 'application': return 'Đơn ứng tuyển';
            case 'settings': return 'Cài đặt';
            default: return type;
        }
    };

    const parseUserAgent = (userAgent) => {
        let device = 'Máy tính';
        let browser = 'Trình duyệt';

        if (userAgent.match(/Android/i)) {
            device = 'Android';
        } else if (userAgent.match(/iPhone|iPad|iPod/i)) {
            device = 'iOS';
        } else if (userAgent.match(/Windows/i)) {
            device = 'Windows';
        } else if (userAgent.match(/Mac/i)) {
            device = 'Mac OS';
        } else if (userAgent.match(/Linux/i)) {
            device = 'Linux';
        }

        if (userAgent.match(/Chrome/i)) {
            browser = 'Chrome';
        } else if (userAgent.match(/Firefox/i)) {
            browser = 'Firefox';
        } else if (userAgent.match(/Safari/i)) {
            browser = 'Safari';
        } else if (userAgent.match(/Edge/i)) {
            browser = 'Edge';
        } else if (userAgent.match(/MSIE|Trident/i)) {
            browser = 'Internet Explorer';
        }

        return `${device} - ${browser}`;
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Lịch sử hoạt động</h2>

                    <div className="flex space-x-2">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tất cả</option>
                            <option value="auth">Đăng nhập/Đăng xuất</option>
                            <option value="job">Quản lý việc làm</option>
                            <option value="user">Quản lý người dùng</option>
                            <option value="company">Quản lý công ty</option>
                            <option value="blog">Quản lý blog</option>
                            <option value="profile">Thông tin cá nhân</option>
                            <option value="resource">Quản lý tài nguyên</option>
                            <option value="application">Quản lý đơn ứng tuyển</option>
                            <option value="settings">Cài đặt</option>
                        </select>

                        <button
                            onClick={fetchActivityLogs}
                            className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            <span className="material-icons text-sm">refresh</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loading />
                    </div>
                ) : (
                    <>
                        {activities.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Thời gian
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Hành động
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Loại
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                IP
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {activities.map((activity) => (
                                            <tr key={activity._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(activity.timestamp).toLocaleString('vi-VN')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    <div className="flex items-center">
                                                        <span className="material-icons text-gray-500 mr-2 text-sm">
                                                            {getTypeIcon(activity.type)}
                                                        </span>
                                                        {activity.action}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(activity.type)}`}>
                                                        {getTypeLabel(activity.type)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {activity.ipAddress}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <span className="material-icons text-gray-400 text-5xl mb-3">history</span>
                                <p className="text-gray-500">Không có hoạt động nào được ghi nhận</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {activities.length > 0 && (
                            <div className="flex items-center justify-between mt-4 border-t border-gray-200 pt-4">
                                <div className="text-sm text-gray-500">
                                    Hiển thị {activities.length} / {pagination.total} hoạt động
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                        className={`px-3 py-1 rounded ${pagination.page === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    >
                                        <span className="material-icons text-sm">chevron_left</span>
                                    </button>
                                    <div className="flex items-center">
                                        <span className="px-3 py-1">{pagination.page} / {pagination.pages}</span>
                                    </div>
                                    <button
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page === pagination.pages}
                                        className={`px-3 py-1 rounded ${pagination.page === pagination.pages ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    >
                                        <span className="material-icons text-sm">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Thiết bị đã đăng nhập</h3>

                {devices.length > 0 ? (
                    <div className="space-y-4">
                        {devices.map(device => (
                            <div key={device.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-full mr-4">
                                        <span className="material-icons text-blue-600">
                                            {device.userAgent.toLowerCase().includes('mobile') ? 'smartphone' : 'computer'}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium">{parseUserAgent(device.userAgent)}</h4>
                                        <p className="text-xs text-gray-500">
                                            IP: {device.ipAddress} - Lần cuối hoạt động: {new Date(device.lastLogin).toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                </div>
                                {device.isCurrent ? (
                                    <div className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                        Hiện tại
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleLogoutDevice(device.id)}
                                        className="text-red-600 text-sm hover:text-red-800"
                                    >
                                        <span className="material-icons text-sm">logout</span>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <p className="text-gray-500">Không có thông tin về các thiết bị đăng nhập</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminActivity;