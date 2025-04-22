import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { useOutletContext } from 'react-router-dom';
import Loading from '../../components/Loading';

// Tab component
const Tab = ({ id, activeTab, title, onClick }) => {
    return (
        <button
            onClick={() => onClick(id)}
            className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
        >
            {title}
        </button>
    );
};

const AdminSettings = () => {
    const { backendUrl } = useContext(AppContext);
    const { setHeaderTitle } = useOutletContext() || {};
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('notifications');
    const [saving, setSaving] = useState(false);

    // Notifications settings
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        applicationAlerts: true,
        newUserAlerts: true,
        securityAlerts: true,
        marketingEmails: false
    });

    // Appearance settings
    const [appearanceSettings, setAppearanceSettings] = useState({
        theme: 'light',
        sidebarCollapsed: false,
        denseMode: false,
        animation: true
    });

    // Security settings
    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: false,
        sessionTimeout: 60,
        allowMultipleSessions: true,
        notifyOnNewLogin: true,
        loginHistory: true
    });

    useEffect(() => {
        if (setHeaderTitle) {
            setHeaderTitle("Cài đặt");
        }

        // Giả lập tải cài đặt
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, [setHeaderTitle]);

    const handleNotificationChange = (e) => {
        const { name, checked } = e.target;
        setNotificationSettings({
            ...notificationSettings,
            [name]: checked
        });
    };

    const handleAppearanceChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAppearanceSettings({
            ...appearanceSettings,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSecurityChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSecuritySettings({
            ...securitySettings,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSaveSettings = async (settingsType) => {
        setSaving(true);

        try {
            // Giả lập lưu cài đặt - trong thực tế bạn sẽ gọi API
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success(`Lưu cài đặt ${settingsType === 'notifications' ? 'thông báo' :
                    settingsType === 'appearance' ? 'giao diện' : 'bảo mật'
                } thành công`);
        } catch (error) {
            console.error(`Error saving ${settingsType} settings:`, error);
            toast.error(`Lỗi khi lưu cài đặt ${settingsType === 'notifications' ? 'thông báo' :
                    settingsType === 'appearance' ? 'giao diện' : 'bảo mật'
                }`);
        } finally {
            setSaving(false);
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
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-gray-200">
                    <div className="flex overflow-x-auto">
                        <Tab id="notifications" activeTab={activeTab} title="Thông báo" onClick={setActiveTab} />
                        <Tab id="appearance" activeTab={activeTab} title="Giao diện" onClick={setActiveTab} />
                        <Tab id="security" activeTab={activeTab} title="Bảo mật" onClick={setActiveTab} />
                    </div>
                </div>

                <div className="p-6">
                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            name="emailNotifications"
                                            id="emailNotifications"
                                            checked={notificationSettings.emailNotifications}
                                            onChange={handleNotificationChange}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="emailNotifications" className="font-medium text-gray-700">Thông báo qua email</label>
                                        <p className="text-gray-500">Nhận thông báo qua email về các hoạt động quan trọng</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            name="applicationAlerts"
                                            id="applicationAlerts"
                                            checked={notificationSettings.applicationAlerts}
                                            onChange={handleNotificationChange}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="applicationAlerts" className="font-medium text-gray-700">Thông báo về đơn ứng tuyển</label>
                                        <p className="text-gray-500">Nhận thông báo khi có đơn ứng tuyển mới</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            name="newUserAlerts"
                                            id="newUserAlerts"
                                            checked={notificationSettings.newUserAlerts}
                                            onChange={handleNotificationChange}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="newUserAlerts" className="font-medium text-gray-700">Thông báo về người dùng mới</label>
                                        <p className="text-gray-500">Nhận thông báo khi có người dùng mới đăng ký</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            name="securityAlerts"
                                            id="securityAlerts"
                                            checked={notificationSettings.securityAlerts}
                                            onChange={handleNotificationChange}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="securityAlerts" className="font-medium text-gray-700">Cảnh báo bảo mật</label>
                                        <p className="text-gray-500">Nhận thông báo về các vấn đề bảo mật tiềm ẩn</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            name="marketingEmails"
                                            id="marketingEmails"
                                            checked={notificationSettings.marketingEmails}
                                            onChange={handleNotificationChange}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="marketingEmails" className="font-medium text-gray-700">Email marketing</label>
                                        <p className="text-gray-500">Nhận các email về tính năng mới, mẹo và cập nhật</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => handleSaveSettings('notifications')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                            </svg>
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-icons text-sm mr-1">save</span>
                                            Lưu cài đặt
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Appearance Tab */}
                    {activeTab === 'appearance' && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                                        Chủ đề
                                    </label>
                                    <select
                                        id="theme"
                                        name="theme"
                                        value={appearanceSettings.theme}
                                        onChange={handleAppearanceChange}
                                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                    >
                                        <option value="light">Sáng</option>
                                        <option value="dark">Tối</option>
                                        <option value="system">Theo hệ thống</option>
                                    </select>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            name="sidebarCollapsed"
                                            id="sidebarCollapsed"
                                            checked={appearanceSettings.sidebarCollapsed}
                                            onChange={handleAppearanceChange}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="sidebarCollapsed" className="font-medium text-gray-700">Thu gọn sidebar</label>
                                        <p className="text-gray-500">Thu gọn sidebar khi mở trang admin</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            name="denseMode"
                                            id="denseMode"
                                            checked={appearanceSettings.denseMode}
                                            onChange={handleAppearanceChange}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="denseMode" className="font-medium text-gray-700">Chế độ gọn</label>
                                        <p className="text-gray-500">Hiển thị nhiều thông tin hơn trên mỗi trang</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            name="animation"
                                            id="animation"
                                            checked={appearanceSettings.animation}
                                            onChange={handleAppearanceChange}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="animation" className="font-medium text-gray-700">Hiệu ứng</label>
                                        <p className="text-gray-500">Bật hiệu ứng chuyển động</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => handleSaveSettings('appearance')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                            </svg>
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-icons text-sm mr-1">save</span>
                                            Lưu cài đặt
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            name="twoFactorAuth"
                                            id="twoFactorAuth"
                                            checked={securitySettings.twoFactorAuth}
                                            onChange={handleSecurityChange}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="twoFactorAuth" className="font-medium text-gray-700">Xác thực hai yếu tố</label>
                                        <p className="text-gray-500">Yêu cầu xác thực bổ sung khi đăng nhập</p>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 mb-1">
                                        Thời gian hết phiên (phút)
                                    </label>
                                    <input
                                        type="number"
                                        name="sessionTimeout"
                                        id="sessionTimeout"
                                        value={securitySettings.sessionTimeout}
                                        onChange={handleSecurityChange}
                                        min="5"
                                        max="1440"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Tự động đăng xuất sau khoảng thời gian không hoạt động</p>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            name="allowMultipleSessions"
                                            id="allowMultipleSessions"
                                            checked={securitySettings.allowMultipleSessions}
                                            onChange={handleSecurityChange}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="allowMultipleSessions" className="font-medium text-gray-700">Cho phép nhiều phiên đăng nhập</label>
                                        <p className="text-gray-500">Cho phép đăng nhập từ nhiều thiết bị cùng lúc</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            name="notifyOnNewLogin"
                                            id="notifyOnNewLogin"
                                            checked={securitySettings.notifyOnNewLogin}
                                            onChange={handleSecurityChange}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="notifyOnNewLogin" className="font-medium text-gray-700">Thông báo đăng nhập mới</label>
                                        <p className="text-gray-500">Nhận email khi có đăng nhập mới từ thiết bị lạ</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            name="loginHistory"
                                            id="loginHistory"
                                            checked={securitySettings.loginHistory}
                                            onChange={handleSecurityChange}
                                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="loginHistory" className="font-medium text-gray-700">Lưu lịch sử đăng nhập</label>
                                        <p className="text-gray-500">Theo dõi các phiên đăng nhập của bạn</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => handleSaveSettings('security')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                            </svg>
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-icons text-sm mr-1">save</span>
                                            Lưu cài đặt
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Xuất & Nhập cài đặt</h3>

                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Bạn có thể xuất cài đặt hiện tại để sao lưu hoặc nhập cài đặt từ file.
                    </p>

                    <div className="flex space-x-4">
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                        >
                            <span className="material-icons text-sm mr-1">file_download</span>
                            Xuất cài đặt
                        </button>

                        <button
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center"
                        >
                            <span className="material-icons text-sm mr-1">file_upload</span>
                            Nhập cài đặt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;