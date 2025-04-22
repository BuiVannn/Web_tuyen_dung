import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/Loading';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, PauseCircle, PlayCircle } from 'lucide-react';

const JobDetailPage = () => {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { backendUrl } = useContext(AppContext);

    useEffect(() => {
        const fetchJobDetails = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    toast.error("Yêu cầu xác thực Admin.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(
                    `${backendUrl}/api/admin/jobs/${jobId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.data.success) {
                    setJob(response.data.job);
                    setApplications(response.data.applications || []);
                } else {
                    toast.error(response.data.message || "Không thể tải thông tin công việc");
                }
            } catch (error) {
                console.error("Error fetching job details:", error);
                toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ");
            } finally {
                setLoading(false);
            }
        };

        if (jobId) {
            fetchJobDetails();
        }
    }, [jobId, backendUrl]);

    // Helper function để render status badge
    const renderStatusBadge = (status) => {
        let colorClasses = 'bg-gray-100 text-gray-800';
        let icon = null;
        let label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A';

        switch (status) {
            case 'active':
                colorClasses = 'bg-green-100 text-green-800 border border-green-200';
                icon = <CheckCircle size={14} className="mr-1" />;
                label = 'Đang hiển thị';
                break;
            case 'pending':
                colorClasses = 'bg-yellow-100 text-yellow-800 border border-yellow-200';
                icon = <AlertCircle size={14} className="mr-1" />;
                label = 'Chờ duyệt';
                break;
            case 'inactive':
                colorClasses = 'bg-gray-100 text-gray-800 border border-gray-200';
                icon = <PauseCircle size={14} className="mr-1" />;
                label = 'Tạm ẩn';
                break;
            case 'rejected':
                colorClasses = 'bg-red-100 text-red-800 border border-red-200';
                icon = <XCircle size={14} className="mr-1" />;
                label = 'Đã từ chối';
                break;
            default:
                colorClasses = 'bg-gray-100 text-gray-800 border border-gray-200';
                icon = <AlertCircle size={14} className="mr-1" />;
        }

        return (
            <span className={`px-2 py-1 inline-flex items-center text-xs leading-4 font-semibold rounded-full ${colorClasses}`}>
                {icon}{label}
            </span>
        );
    };

    // Xử lý cập nhật trạng thái
    const handleUpdateStatus = async (newStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                toast.error("Yêu cầu xác thực Admin.");
                return;
            }

            const response = await axios.patch(
                `${backendUrl}/api/admin/jobs/${jobId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setJob({ ...job, status: newStatus });
                toast.success(`Đã cập nhật trạng thái thành ${newStatus}`);
            } else {
                toast.error(response.data.message || "Cập nhật trạng thái thất bại");
            }
        } catch (error) {
            console.error("Error updating job status:", error);
            toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loading />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="p-8">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Không tìm thấy công việc</h2>
                    <p className="text-gray-600 mb-6">Công việc bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
                    <Link to="/admin/jobs" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200">
                        Quay lại danh sách công việc
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-1">
                    <Link to="/admin/jobs" className="text-blue-600 hover:text-blue-800">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Chi tiết công việc</h1>
                </div>
                <p className="text-gray-500">Quản lý thông tin và trạng thái công việc</p>
            </div>

            {/* Job Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col md:flex-row justify-between mb-6">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-2xl font-bold text-gray-800">{job.title}</h2>
                        <div className="flex items-center flex-wrap gap-3 mt-2">
                            <div className="text-gray-700 flex items-center">
                                <span className="material-icons text-sm mr-1">business</span>
                                {job.companyId?.name || 'Không có thông tin công ty'}
                            </div>
                            <div className="text-gray-700 flex items-center">
                                <span className="material-icons text-sm mr-1">location_on</span>
                                {job.location || 'Không có địa điểm'}
                            </div>
                            <div className="text-gray-700 flex items-center">
                                <span className="material-icons text-sm mr-1">work</span>
                                {job.type || 'Không có loại công việc'}
                            </div>
                            <div>
                                {renderStatusBadge(job.status)}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {job.status === 'pending' && (
                            <>
                                <button
                                    onClick={() => handleUpdateStatus('active')}
                                    className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-2 rounded-lg flex items-center transition duration-200"
                                >
                                    <CheckCircle size={16} className="mr-1" />
                                    Phê duyệt
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus('rejected')}
                                    className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-2 rounded-lg flex items-center transition duration-200"
                                >
                                    <XCircle size={16} className="mr-1" />
                                    Từ chối
                                </button>
                            </>
                        )}
                        {job.status === 'active' && (
                            <button
                                onClick={() => handleUpdateStatus('inactive')}
                                className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-3 py-2 rounded-lg flex items-center transition duration-200"
                            >
                                <PauseCircle size={16} className="mr-1" />
                                Tạm ẩn
                            </button>
                        )}
                        {job.status === 'inactive' && (
                            <button
                                onClick={() => handleUpdateStatus('active')}
                                className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-2 rounded-lg flex items-center transition duration-200"
                            >
                                <PlayCircle size={16} className="mr-1" />
                                Kích hoạt
                            </button>
                        )}
                        {job.status === 'rejected' && (
                            <button
                                onClick={() => handleUpdateStatus('active')}
                                className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-2 rounded-lg flex items-center transition duration-200"
                            >
                                <CheckCircle size={16} className="mr-1" />
                                Phê duyệt
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Ngành nghề</p>
                        <p className="font-medium">{job.category || 'Không có thông tin'}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Mức lương</p>
                        <p className="font-medium">{job.salary || 'Không có thông tin'}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Kinh nghiệm</p>
                        <p className="font-medium">{job.experience || 'Không có thông tin'}</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Số lượng ứng tuyển</p>
                        <p className="font-medium">{applications.length}</p>
                    </div>
                </div>

                <div className="prose max-w-none">
                    <h3 className="text-xl font-semibold mb-4">Mô tả công việc</h3>
                    <div className="whitespace-pre-line">{job.description}</div>
                </div>
            </div>

            {/* Applicants Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4">Danh sách ứng viên ({applications.length})</h3>

                {applications.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ứng viên</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày ứng tuyển</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {applications.map((application) => (
                                    <tr key={application._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{application.userId?.name || 'N/A'}</div>
                                            <div className="text-sm text-gray-500">{application.userId?.email || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(application.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {renderStatusBadge(application.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link to={`/admin/candidates/${application.userId?._id}`} className="text-blue-600 hover:text-blue-900">
                                                Xem chi tiết
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-8 text-center text-gray-500">
                        Chưa có ứng viên nào ứng tuyển vào công việc này.
                    </div>
                )}
            </div>

            {/* Company Info */}
            {job.companyId && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-xl font-semibold mb-4">Thông tin công ty</h3>
                    <div className="flex items-start">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-4 flex items-center justify-center">
                            {job.companyId.image ? (
                                <img src={job.companyId.image} alt={job.companyId.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="material-icons text-3xl text-gray-400">business</span>
                            )}
                        </div>
                        <div>
                            <h4 className="text-lg font-medium text-gray-900">{job.companyId.name}</h4>
                            <p className="text-sm text-gray-500">{job.companyId.email}</p>
                            {job.companyId.location && (
                                <p className="text-sm text-gray-700 mt-1 flex items-center">
                                    <span className="material-icons text-sm mr-1">location_on</span>
                                    {job.companyId.location}
                                </p>
                            )}
                            {job.companyId.phone && (
                                <p className="text-sm text-gray-700 mt-1 flex items-center">
                                    <span className="material-icons text-sm mr-1">phone</span>
                                    {job.companyId.phone}
                                </p>
                            )}
                        </div>
                    </div>

                    {job.companyId.description && (
                        <div className="mt-4">
                            <h5 className="text-md font-medium text-gray-800 mb-2">Giới thiệu công ty</h5>
                            <p className="text-gray-700 whitespace-pre-line">{job.companyId.description}</p>
                        </div>
                    )}

                    <div className="mt-4">
                        <Link
                            to={`/admin/recruiters?company=${job.companyId._id}`}
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                            Xem tất cả công việc của công ty
                            <span className="material-icons text-sm ml-1">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            )}

            {/* Back button */}
            <div className="flex justify-end">
                <Link
                    to="/admin/jobs"
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition duration-200 flex items-center"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Quay lại danh sách
                </Link>
            </div>
        </div>
    );
};

export default JobDetailPage;