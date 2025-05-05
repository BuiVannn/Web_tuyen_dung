import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const JobApplicationForm = ({ jobId, onSuccess, onCancel }) => {
    const navigate = useNavigate();
    const { userToken, backendUrl, userData, fetchUserData } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [resume, setResume] = useState(null);
    const [formData, setFormData] = useState({
        jobId: jobId || '',
        fullName: '',
        email: '',
        phoneNumber: '',
        birthYear: '',
        education: '',
        coverLetter: '',
        useExistingResume: true
    });

    // Khởi tạo form với dữ liệu người dùng nếu có
    useEffect(() => {
        if (userData) {
            setFormData(prev => ({
                ...prev,
                fullName: userData.name || '',
                email: userData.email || ''
            }));
        }
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type === 'application/pdf') {
                setResume(file);
                setFormData(prev => ({ ...prev, useExistingResume: false }));
            } else {
                toast.error('Vui lòng tải lên file PDF');
                e.target.value = null;
            }
        }
    };

    // Hàm xử lý upload resume
    const uploadResume = async () => {
        if (formData.useExistingResume || !resume) {
            return null;
        }

        const formDataUpload = new FormData();
        formDataUpload.append('resume', resume);

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/users/update-resume`,
                formDataUpload,
                {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (data.success) {
                await fetchUserData();
                return data.resume;
            } else {
                throw new Error(data.message || 'Tải lên CV thất bại');
            }
        } catch (error) {
            console.error('Resume upload error:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userToken) {
            toast.error('Vui lòng đăng nhập để ứng tuyển');
            navigate('/login?redirect=' + encodeURIComponent(`/apply-job/${jobId}`));
            return;
        }

        // Kiểm tra thông tin bắt buộc
        if (!formData.fullName || !formData.email || !formData.phoneNumber) {
            toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        try {
            setLoading(true);

            // Kiểm tra người dùng đã có CV chưa và không tải lên CV mới
            if (!userData?.resume && !resume && formData.useExistingResume) {
                toast.error('Vui lòng tải lên CV');
                return;
            }

            // Tải lên CV mới nếu có
            if (resume && !formData.useExistingResume) {
                await uploadResume();
            }

            // Gửi đơn ứng tuyển
            const { data } = await axios.post(
                `${backendUrl}/api/users/apply`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data.success) {
                toast.success('Ứng tuyển thành công');
                if (onSuccess) onSuccess(data.application);
            } else {
                toast.error(data.message || 'Ứng tuyển thất bại');
            }
        } catch (error) {
            console.error('Apply job error:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi ứng tuyển');
        } finally {
            setLoading(false);
        }
    };

    // Các tùy chọn học vấn
    const educationOptions = [
        'Trung học phổ thông',
        'Cao đẳng',
        'Đại học',
        'Thạc sĩ',
        'Tiến sĩ',
        'Khác'
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thông tin cá nhân */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Thông tin cá nhân</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                            Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="birthYear" className="block text-sm font-medium text-gray-700 mb-1">
                            Năm sinh
                        </label>
                        <input
                            type="number"
                            id="birthYear"
                            name="birthYear"
                            value={formData.birthYear}
                            onChange={handleInputChange}
                            min="1950"
                            max={new Date().getFullYear() - 15}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="VD: 1990"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                        Trình độ học vấn cao nhất
                    </label>
                    <select
                        id="education"
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Chọn trình độ học vấn</option>
                        {educationOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* CV */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">CV của bạn</h3>

                {userData?.resume && (
                    <div className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            id="useExistingResume"
                            name="useExistingResume"
                            checked={formData.useExistingResume}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="useExistingResume" className="ml-2 block text-sm text-gray-700">
                            Sử dụng CV có sẵn
                        </label>
                    </div>
                )}

                {(!userData?.resume || !formData.useExistingResume) && (
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tải lên CV <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center">
                            <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                                <span>{resume ? resume.name : "Chọn file PDF"}</span>
                                <input
                                    type="file"
                                    onChange={handleResumeChange}
                                    accept="application/pdf"
                                    className="sr-only"
                                    required={!userData?.resume}
                                />
                            </label>
                            {resume && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setResume(null);
                                        if (userData?.resume) {
                                            setFormData(prev => ({ ...prev, useExistingResume: true }));
                                        }
                                    }}
                                    className="ml-2 text-sm text-red-600 hover:text-red-800"
                                >
                                    Xóa
                                </button>
                            )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Chỉ chấp nhận định dạng PDF, tối đa 2MB</p>
                    </div>
                )}

                {userData?.resume && formData.useExistingResume && (
                    <div className="flex items-center gap-2 bg-blue-50 p-2 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                            <span className="text-sm text-gray-700">CV của bạn</span>
                        </div>
                        <a
                            href={userData.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                            Xem
                        </a>
                    </div>
                )}
            </div>

            {/* Thư xin việc */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Thư xin việc</h3>

                <div className="form-group">
                    <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                        Tại sao bạn muốn ứng tuyển vị trí này?
                    </label>
                    <textarea
                        id="coverLetter"
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Giới thiệu ngắn gọn về bản thân và lý do bạn quan tâm đến vị trí này..."
                    />
                </div>
            </div>

            {/* Các nút hành động */}
            <div className="pt-4 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Đang xử lý...' : 'Nộp đơn ứng tuyển'}
                </button>
            </div>
        </form>
    );
};

export default JobApplicationForm;