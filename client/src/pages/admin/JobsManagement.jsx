// src/pages/admin/JobsManagement.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'; // Dùng cho nút xem chi tiết (nếu cần)
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
// Không cần import AdminHeader, AdminSidebar nếu dùng AdminLayout
// import AdminHeader from '../../components/admin/AdminHeader';
// import AdminSidebar from '../../components/admin/AdminSidebar';
import Loading from '../../components/Loading';
//import { Search, Filter, Eye, Edit2, Trash2, ToggleLeft, ToggleRight, Check, X } from 'lucide-react'; // Thêm icon
import { Search, Filter, Eye, Trash2, CheckCircle, XCircle, AlertCircle, PauseCircle, PlayCircle } from 'lucide-react';
const JobsManagement = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // Filter theo trạng thái công việc
    const [currentPage, setCurrentPage] = useState(1);

    const { backendUrl } = useContext(AppContext);
    const itemsPerPage = 10;

    // Các trạng thái công việc có thể có (dựa trên backend)
    //const jobStatuses = ['active', 'inactive', 'pending', 'approved', 'rejected']; // Cập nhật nếu cần
    const jobStatuses = ['active', 'inactive', 'pending', 'rejected'];
    // Hàm fetch danh sách jobs
    const fetchJobs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                toast.error("Yêu cầu xác thực Admin."); setLoading(false); return;
            }
            const response = await axios.get(`${backendUrl}/api/admin/jobs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setJobs(response.data.jobs || []);
            } else {
                toast.error(response.data.message || "Không thể tải danh sách công việc.");
            }
        } catch (error) {
            console.error("Lỗi tải danh sách công việc:", error);
            toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ.");
        } finally {
            setLoading(false);
        }
    };

    // useEffect để fetch dữ liệu khi component mount
    useEffect(() => {
        if (backendUrl) { fetchJobs(); }
        else { toast.error("Lỗi cấu hình: Không tìm thấy backend URL."); setLoading(false); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [backendUrl]);

    // Hàm xử lý xóa job
    const handleDeleteJob = async (jobId, jobTitle) => {
        if (window.confirm(`Bạn chắc chắn muốn xóa công việc "${jobTitle}" không?`)) {
            setLoading(true);
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) { toast.error("Yêu cầu xác thực Admin."); setLoading(false); return; }

                const response = await axios.delete(`${backendUrl}/api/admin/jobs/${jobId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    toast.success(response.data.message || `Đã xóa công việc "${jobTitle}"`);
                    setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
                    // Xử lý phân trang sau khi xóa (tương tự RecruiterManagement)
                    const newTotalPages = Math.ceil((jobs.length - 1) / itemsPerPage);
                    if (currentPage > newTotalPages && newTotalPages > 0) setCurrentPage(newTotalPages);
                    else if (jobs.length - 1 === 0) setCurrentPage(1);
                } else {
                    toast.error(response.data.message || "Xóa công việc thất bại.");
                }
            } catch (error) {
                console.error("Lỗi xóa công việc:", error);
                toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ khi xóa.");
            } finally {
                setLoading(false);
            }
        }
    };

    // Hàm xử lý cập nhật trạng thái job
    const handleUpdateJobStatus = async (jobId, jobTitle, newStatus) => {
        if (!jobStatuses.includes(newStatus)) {
            toast.error(`Trạng thái "${newStatus}" không hợp lệ.`);
            return;
        }
        // Có thể thêm confirm nếu muốn
        // if (!window.confirm(`Bạn có muốn đổi trạng thái công việc "${jobTitle}" thành "${newStatus}" không?`)) return;

        // Tìm job hiện tại để tối ưu cập nhật state
        const currentJob = jobs.find(job => job._id === jobId);
        if (!currentJob) return;
        const oldStatus = currentJob.status; // Lưu trạng thái cũ phòng trường hợp lỗi

        // Cập nhật state trước để UI phản hồi nhanh (Optimistic Update)
        setJobs(prevJobs => prevJobs.map(job =>
            job._id === jobId ? { ...job, status: newStatus } : job
        ));

        try {
            const token = localStorage.getItem('adminToken');
            if (!token) { toast.error("Yêu cầu xác thực Admin."); throw new Error("No Admin Token"); } // Throw để catch xử lý rollback

            const response = await axios.patch(`${backendUrl}/api/admin/jobs/${jobId}/status`,
                { status: newStatus }, // Dữ liệu gửi lên body
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success(response.data.message || `Đã cập nhật trạng thái công việc "${jobTitle}"`);
                // Không cần setJobs lại vì đã làm Optimistic Update
            } else {
                // Rollback nếu API báo lỗi
                toast.error(response.data.message || "Cập nhật trạng thái thất bại.");
                setJobs(prevJobs => prevJobs.map(job =>
                    job._id === jobId ? { ...job, status: oldStatus } : job // Trả về trạng thái cũ
                ));
            }
        } catch (error) {
            // Rollback nếu gọi API lỗi
            console.error("Lỗi cập nhật trạng thái công việc:", error);
            toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ khi cập nhật.");
            setJobs(prevJobs => prevJobs.map(job =>
                job._id === jobId ? { ...job, status: oldStatus } : job // Trả về trạng thái cũ
            ));
        }
        // Không cần setLoading vì đã dùng Optimistic Update
    };


    // Filter và search jobs (Client-side)
    const filteredJobs = jobs.filter(job => {
        const companyName = job.companyId?.name || ''; // Lấy tên công ty an toàn
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase())); // Thêm tìm theo location

        const matchesStatus = filterStatus === 'all' || job.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // Pagination logic (giữ nguyên)
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Helper function để render status badge               
    // Helper function để render status badge với icon
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


    return (
        // Bỏ div layout ngoài cùng nếu dùng AdminLayout
        // <div className="flex h-screen bg-gray-50">
        //     <AdminSidebar />
        //     <div className="flex-1 flex flex-col overflow-hidden">
        //         <AdminHeader title="Quản lý Công việc" />
        //         <main className="flex-1 overflow-y-auto p-6">
        <> {/* Dùng Fragment nếu bỏ layout */}
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div className="flex items-center bg-white rounded-lg border border-gray-300 px-3 py-2 w-full md:w-96">
                    <Search size={20} className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Tìm theo tiêu đề, công ty, địa điểm..."
                        className="outline-none w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                    <div className="flex items-center bg-white rounded-lg border border-gray-300 px-3 py-2">
                        <Filter size={18} className="text-gray-400 mr-2" />
                        <select
                            className="outline-none bg-transparent"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            {jobStatuses.map(status => (
                                <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Có thể thêm nút Add Job nếu cần */}
                </div>
            </div>

            {/* Jobs Table */}
            {loading ? (
                <div className="flex justify-center items-center h-64"> <Loading /> </div>
            ) : (
                <>
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề Công việc</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Công ty</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa điểm</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đăng</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.length > 0 ? currentItems.map((job) => (
                                    <tr key={job._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{job.title || 'N/A'}</div>
                                            <div className="text-sm text-gray-500">{job.category || 'N/A'} - {job.level || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{job.companyId?.name || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.location || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {renderStatusBadge(job.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {job.createdAt ? new Date(job.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Nút Xem chi tiết */}
                                                <Link to={`/admin/jobs/${job._id}`} className="p-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full" title="Xem chi tiết công việc">
                                                    <Eye size={18} />
                                                </Link>

                                                {/* Các nút thay đổi trạng thái */}
                                                {job.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateJobStatus(job._id, job.title, 'active')}
                                                            className="p-1 bg-green-50 text-green-600 hover:bg-green-100 rounded-full"
                                                            title="Phê duyệt công việc"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateJobStatus(job._id, job.title, 'rejected')}
                                                            className="p-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-full"
                                                            title="Từ chối công việc"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}

                                                {job.status === 'active' && (
                                                    <button
                                                        onClick={() => handleUpdateJobStatus(job._id, job.title, 'inactive')}
                                                        className="p-1 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-full"
                                                        title="Tạm ẩn công việc"
                                                    >
                                                        <PauseCircle size={18} />
                                                    </button>
                                                )}

                                                {job.status === 'inactive' && (
                                                    <button
                                                        onClick={() => handleUpdateJobStatus(job._id, job.title, 'active')}
                                                        className="p-1 bg-green-50 text-green-600 hover:bg-green-100 rounded-full"
                                                        title="Kích hoạt lại công việc"
                                                    >
                                                        <PlayCircle size={18} />
                                                    </button>
                                                )}

                                                {job.status === 'rejected' && (
                                                    <button
                                                        onClick={() => handleUpdateJobStatus(job._id, job.title, 'active')}
                                                        className="p-1 bg-green-50 text-green-600 hover:bg-green-100 rounded-full"
                                                        title="Phê duyệt công việc đã từ chối"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}

                                                {/* Nút Xóa */}
                                                <button
                                                    onClick={() => handleDeleteJob(job._id, job.title)}
                                                    className="p-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-full"
                                                    title="Xóa công việc"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr> <td colSpan="6" className="px-6 py-10 text-center text-gray-500">Không tìm thấy công việc nào.</td> </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-6">
                            {/* ... Pagination controls (giống như RecruiterManagement) ... */}
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredJobs.length)}</span> of <span className="font-medium">{filteredJobs.length}</span> jobs
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`px-3 py-1 rounded text-sm ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>Previous</button>
                                {/* Nên có logic render số trang tốt hơn nếu quá nhiều trang */}
                                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2)).map((page) => (
                                    <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-1 rounded text-sm ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>{page}</button>
                                ))}
                                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`px-3 py-1 rounded text-sm ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>Next</button>
                            </div>
                        </div>
                    )}
                </>
            )}
            {/* </main> */}
            {/* </div> */}
            {/* // </div> */}
        </> // Dùng Fragment nếu bỏ layout
    );
};

export default JobsManagement;