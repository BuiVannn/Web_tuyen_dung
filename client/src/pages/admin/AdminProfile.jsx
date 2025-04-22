import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { useOutletContext } from 'react-router-dom';
import Loading from '../../components/Loading';

const AdminProfile = () => {
    const { backendUrl } = useContext(AppContext);
    const { setHeaderTitle } = useOutletContext() || {};
    const [loading, setLoading] = useState(true);
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [admin, setAdmin] = useState({
        name: '',
        email: ''
    });
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (setHeaderTitle) {
            setHeaderTitle("Thông tin cá nhân");
        }
        if (backendUrl) {
            fetchAdminProfile();
        }
    }, [backendUrl, setHeaderTitle]);

    const fetchAdminProfile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${backendUrl}/api/admin/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                const adminData = response.data.admin;
                setAdmin(adminData);
                setFormData({
                    name: adminData.name,
                    email: adminData.email
                });
            } else {
                toast.error(response.data.message || "Không thể tải thông tin admin");
            }
        } catch (error) {
            console.error("Error fetching admin profile:", error);
            toast.error(error.response?.data?.message || "Lỗi khi tải thông tin admin");
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value
        });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setUpdatingProfile(true);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.put(
                `${backendUrl}/api/admin/profile`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success("Cập nhật thông tin thành công");
                setAdmin({
                    ...admin,
                    name: formData.name,
                    email: formData.email
                });
                // Cập nhật tên trong localStorage để AdminHeader hiển thị đúng
                localStorage.setItem('adminName', formData.name);
            } else {
                toast.error(response.data.message || "Không thể cập nhật thông tin");
            }
        } catch (error) {
            console.error("Error updating admin profile:", error);
            toast.error(error.response?.data?.message || "Lỗi khi cập nhật thông tin");
        } finally {
            setUpdatingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Mật khẩu mới không khớp");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }

        setUpdatingPassword(true);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.put(
                `${backendUrl}/api/admin/change-password`,
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success("Đổi mật khẩu thành công");
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                toast.error(response.data.message || "Không thể đổi mật khẩu");
            }
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error(error.response?.data?.message || "Lỗi khi đổi mật khẩu");
        } finally {
            setUpdatingPassword(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full py-20">
                <Loading />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b">Thông tin cá nhân</h2>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3">
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <span className="material-icons text-blue-500 text-5xl">person</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-800">{admin.name}</h3>
                            <p className="text-sm text-gray-500">{admin.email}</p>
                            <p className="mt-2 text-sm text-blue-600">Quản trị viên</p>
                        </div>
                    </div>

                    <div className="md:w-2/3">
                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Họ tên
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleProfileChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleProfileChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                                    disabled={updatingProfile}
                                >
                                    {updatingProfile ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                            </svg>
                                            Đang cập nhật...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-icons text-sm mr-1">save</span>
                                            Lưu thay đổi
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b">Đổi mật khẩu</h2>

                <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu hiện tại
                        </label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu mới
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            minLength={6}
                        />
                        <p className="text-xs text-gray-500 mt-1">Mật khẩu phải có ít nhất 6 ký tự</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Xác nhận mật khẩu mới
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                            disabled={updatingPassword}
                        >
                            {updatingPassword ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                    Đang cập nhật...
                                </>
                            ) : (
                                <>
                                    <span className="material-icons text-sm mr-1">lock</span>
                                    Đổi mật khẩu
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminProfile;