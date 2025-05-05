// src/pages/ManageJobs.jsx

import React, { useContext, useEffect, useState } from "react";
import moment from 'moment';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { Eye, EyeOff, Edit, Trash2, AlertCircle, Search, RefreshCw } from 'lucide-react';
import Modal from "../components/Modal";

const ManageJobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // State cho phân trang và tìm kiếm
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });

    // Cập nhật state searchParams để khớp với backend
    const [searchParams, setSearchParams] = useState({
        keyword: '',
        status: '',
        sortBy: 'createdAt',  // Mặc định sắp xếp theo ngày tạo
        sortOrder: 'desc'     // Mặc định giảm dần (mới nhất trước)
    });

    const [searchLoading, setSearchLoading] = useState(false);

    const { backendUrl, companyToken } = useContext(AppContext);

    // Hàm fetch danh sách jobs của công ty có hỗ trợ phân trang và tìm kiếm
    const fetchCompanyJobs = async (page = 1, limit = pagination.limit, params = {}) => {
        setLoading(true);
        try {
            // Xây dựng query params
            const queryParams = new URLSearchParams({
                page: page,
                limit: limit,
                ...params
            }).toString();

            const { data } = await axios.get(
                `${backendUrl}/api/companies/list-jobs?${queryParams}`,
                {
                    headers: {
                        'Authorization': `Bearer ${companyToken}`
                    },
                    timeout: 15000
                }
            );

            if (data.success) {
                setJobs(data.jobs || []);
                // Cập nhật thông tin phân trang
                setPagination({
                    page: data.pagination?.page || 1,
                    limit: data.pagination?.limit || 10,
                    total: data.pagination?.total || 0,
                    pages: data.pagination?.pages || 0
                });

                // Cập nhật thông tin sắp xếp từ response
                if (data.filters) {
                    setSearchParams(prev => ({
                        ...prev,
                        sortBy: data.filters.sortBy || prev.sortBy,
                        sortOrder: data.filters.sortOrder || prev.sortOrder
                    }));
                }
            } else {
                toast.error(data.message || "Không thể tải danh sách công việc");
                setJobs([]);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error(error.response?.data?.message || "Lỗi khi tải danh sách công việc");
            setJobs([]);

            if (error.response?.status === 401) {
                localStorage.removeItem('companyToken');
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý thay đổi trang
    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > pagination.pages) return;
        fetchCompanyJobs(newPage, pagination.limit, searchParams);
    };

    // Hàm xử lý thay đổi số lượng hiển thị mỗi trang
    const handleLimitChange = (newLimit) => {
        fetchCompanyJobs(1, newLimit, searchParams);
    };

    // Hàm xử lý tìm kiếm
    const handleSearch = (e) => {
        e.preventDefault();
        setSearchLoading(true);
        fetchCompanyJobs(1, pagination.limit, searchParams)
            .finally(() => setSearchLoading(false));
    };

    // Hàm xử lý reset search
    const handleResetSearch = () => {
        const defaultParams = {
            keyword: '',
            status: '',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        };
        setSearchParams(defaultParams);
        fetchCompanyJobs(1, pagination.limit, defaultParams);
    };

    // Hàm xử lý thay đổi input search
    const handleSearchInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleJobVisibility = async (jobId, currentVisibility) => {
        try {
            // Optimistic update
            setJobs(prevJobs => prevJobs.map(job =>
                job._id === jobId ? { ...job, visible: !currentVisibility } : job
            ));

            const { data } = await axios.patch(
                `${backendUrl}/api/jobs/${jobId}/visibility`,
                {},  // Body trống vì server sẽ tự toggle
                {
                    headers: {
                        'Authorization': `Bearer ${companyToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data.success) {
                toast.success(data.message);
            } else {
                // Rollback if failed
                setJobs(prevJobs => prevJobs.map(job =>
                    job._id === jobId ? { ...job, visible: currentVisibility } : job
                ));
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error toggling visibility:', error);
            // Rollback on error
            setJobs(prevJobs => prevJobs.map(job =>
                job._id === jobId ? { ...job, visible: currentVisibility } : job
            ));
            toast.error(error.response?.data?.message || "Lỗi khi cập nhật trạng thái hiển thị");
        }
    };

    const handleDeleteJob = async () => {
        if (!jobToDelete) return;

        setDeleteLoading(true);
        try {
            const { data } = await axios.delete(
                `${backendUrl}/api/jobs/${jobToDelete._id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${companyToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data.success) {
                // Cập nhật danh sách job sau khi xóa
                setJobs(prevJobs => prevJobs.filter(job => job._id !== jobToDelete._id));
                // Cập nhật lại số lượng
                setPagination(prev => ({
                    ...prev,
                    total: prev.total - 1
                }));
                toast.success("Xóa công việc thành công");
                setDeleteModalOpen(false);
            } else {
                toast.error(data.message || "Không thể xóa công việc");
            }
        } catch (error) {
            console.error('Error deleting job:', error);
            toast.error(error.response?.data?.message || "Lỗi khi xóa công việc");
        } finally {
            setDeleteLoading(false);
        }
    };

    const openDeleteModal = (job) => {
        setJobToDelete(job);
        setDeleteModalOpen(true);
    };

    useEffect(() => {
        if (companyToken) {
            fetchCompanyJobs(1, pagination.limit);
        } else {
            setJobs([]);
            setLoading(false);
        }
    }, [companyToken]);

    // Helper function để hiển thị tên người dùng thân thiện cho giá trị sortBy
    const getSortByDisplayName = (sortBy) => {
        const sortByNames = {
            'createdAt': 'Ngày đăng',
            'title': 'Tiêu đề',
            'applicationsCount': 'Số lượng ứng viên',
            'location': 'Địa điểm',
            'maxSalary': 'Mức lương',
            'minSalary': 'Mức lương tối thiểu',
            'visible': 'Trạng thái hiển thị',
            'status': 'Trạng thái công việc'
        };

        return sortByNames[sortBy] || sortBy;
    };

    // Render Pagination Controls
    const renderPagination = () => {
        const { page, pages } = pagination;

        // Nếu tổng số trang <= 1, không hiển thị phân trang
        if (pages <= 1) return null;

        // Hiển thị tối đa 5 nút trang
        const maxVisiblePages = 5;
        let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(pages, startPage + maxVisiblePages - 1);

        // Điều chỉnh startPage nếu endPage đã đạt max
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Tạo mảng các nút trang
        const pageButtons = [];

        // Nút trang đầu và "..."
        if (startPage > 1) {
            pageButtons.push(
                <button
                    key="first"
                    onClick={() => handlePageChange(1)}
                    className="relative inline-flex items-center px-4 py-2 border text-sm font-medium bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                >
                    1
                </button>
            );

            if (startPage > 2) {
                pageButtons.push(
                    <span key="dots1" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                    </span>
                );
            }
        }

        // Các nút trang giữa
        for (let i = startPage; i <= endPage; i++) {
            pageButtons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === i
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                >
                    {i}
                </button>
            );
        }

        // "..." và nút trang cuối
        if (endPage < pages) {
            if (endPage < pages - 1) {
                pageButtons.push(
                    <span key="dots2" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                    </span>
                );
            }

            pageButtons.push(
                <button
                    key="last"
                    onClick={() => handlePageChange(pages)}
                    className="relative inline-flex items-center px-4 py-2 border text-sm font-medium bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                >
                    {pages}
                </button>
            );
        }

        return (
            <nav className="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
                {/* Nút Previous */}
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${page === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50'
                        }`}
                >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </button>

                {/* Các nút trang */}
                {pageButtons}

                {/* Nút Next */}
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === pages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${page === pages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-500 hover:bg-gray-50'
                        }`}
                >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
            </nav>
        );
    };

    // Hiển thị Loading
    if (loading && jobs.length === 0) {
        return <div className="flex justify-center items-center h-64"><Loading /></div>;
    }

    return (
        <div className="container p-4 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-2xl font-semibold mb-4 sm:mb-0">Quản lý Công việc đã đăng</h2>
                <button
                    onClick={() => navigate('/dashboard/add-job')}
                    className="bg-black text-white py-2 px-5 rounded hover:bg-gray-800"
                >
                    Đăng công việc mới
                </button>
            </div>

            {/* Search form - Cập nhật để khớp với backend API */}
            <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                            Từ khóa
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="keyword"
                                name="keyword"
                                value={searchParams.keyword}
                                onChange={handleSearchInputChange}
                                placeholder="Tên công việc..."
                                className="w-full border border-gray-300 rounded-md pl-10 py-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Trạng thái
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={searchParams.status}
                            onChange={handleSearchInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Sắp xếp theo trường */}
                    <div>
                        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                            Sắp xếp theo
                        </label>
                        <select
                            id="sortBy"
                            name="sortBy"
                            value={searchParams.sortBy}
                            onChange={handleSearchInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="createdAt">Ngày đăng</option>
                            <option value="title">Tiêu đề</option>
                            <option value="applicationsCount">Số lượng ứng viên</option>
                            <option value="location">Địa điểm</option>
                            <option value="maxSalary">Mức lương</option>
                        </select>
                    </div>

                    {/* Thứ tự sắp xếp */}
                    <div>
                        <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
                            Thứ tự
                        </label>
                        <select
                            id="sortOrder"
                            name="sortOrder"
                            value={searchParams.sortOrder}
                            onChange={handleSearchInputChange}
                            className="w-full border border-gray-300 rounded-md py-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="desc">Giảm dần</option>
                            <option value="asc">Tăng dần</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end mt-4 gap-2">
                    <button
                        type="button"
                        onClick={handleResetSearch}
                        className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        <RefreshCw size={16} className="mr-1" />
                        Đặt lại
                    </button>
                    <button
                        type="submit"
                        disabled={searchLoading}
                        className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        <Search size={16} className="mr-1" />
                        {searchLoading ? "Đang tìm..." : "Tìm kiếm"}
                    </button>
                </div>
            </form>

            {/* Hiển thị nếu không có jobs hoặc fetch lỗi */}
            {jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 bg-white rounded-lg shadow-sm p-6">
                    <p className="text-xl sm:text-xl mb-4 text-gray-600">Không tìm thấy công việc nào.</p>
                    <button
                        onClick={handleResetSearch}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Xóa bộ lọc và thử lại
                    </button>
                </div>
            ) : (
                <>
                    {/* Hiển thị thông tin sắp xếp và tổng số */}
                    <div className="mb-3 text-sm text-gray-600 flex flex-wrap gap-2 items-center">
                        <span>Hiển thị {jobs.length} trong tổng số {pagination.total} công việc</span>
                        {searchParams.sortBy && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                Sắp xếp theo: {getSortByDisplayName(searchParams.sortBy)} - {searchParams.sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
                            </span>
                        )}
                    </div>

                    {/* Bảng jobs */}
                    <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
                        <table className="min-w-full bg-white border-collapse max-sm:text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-4 border-b text-left max-sm:hidden">#</th>
                                    <th className="py-3 px-4 border-b text-left">Tiêu đề Công việc</th>
                                    <th className="py-3 px-4 border-b text-left max-sm:hidden">Ngày đăng</th>
                                    <th className="py-3 px-4 border-b text-left max-sm:hidden">Địa điểm</th>
                                    <th className="py-3 px-4 border-b text-center">Ứng viên</th>
                                    <th className="py-3 px-4 border-b text-center">Trạng thái</th>
                                    <th className="py-3 px-4 border-b text-center">Hiển thị</th>
                                    <th className="py-3 px-4 border-b text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job, index) => (
                                    <tr key={job._id} className="text-gray-700 hover:bg-gray-50">
                                        <td className="py-3 px-4 border-b max-sm:hidden">
                                            {(pagination.page - 1) * pagination.limit + index + 1}
                                        </td>
                                        <td className="py-3 px-4 border-b font-medium">{job.title}</td>
                                        <td className="py-3 px-4 border-b max-sm:hidden">
                                            {moment(job.createdAt).format('DD/MM/YYYY')}
                                        </td>
                                        <td className="py-3 px-4 border-b max-sm:hidden">{job.location}</td>
                                        <td className="py-3 px-4 border-b text-center">
                                            <span className="inline-flex items-center gap-1">
                                                <span className="font-medium">{job.applicationsCount || 0}</span>
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 border-b text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${job.status === 'active' || job.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    job.status === 'inactive' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                {job.status === 'active' || job.status === 'approved' ? 'Active' :
                                                    job.status === 'inactive' ? 'Inactive' :
                                                        'Pending'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 border-b text-center">
                                            <button
                                                onClick={() => toggleJobVisibility(job._id, job.visible)}
                                                title={job.visible ? "Nhấn để ẩn" : "Nhấn để hiện"}
                                                className={`p-1 rounded ${job.visible && (job.status === 'active' || job.status === 'approved') ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'}`}
                                                disabled={job.status !== 'active' && job.status !== 'approved'}
                                            >
                                                {job.visible && (job.status === 'active' || job.status === 'approved') ? <Eye size={18} /> : <EyeOff size={18} />}
                                            </button>
                                        </td>
                                        <td className="py-3 px-4 border-b text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    to={`/dashboard/manage-jobs/${job._id}/applicants`}
                                                    className="text-blue-600 hover:text-blue-800 p-1"
                                                    title={`Xem ${job.applicationsCount || 0} ứng viên`}
                                                >
                                                    Xem CV
                                                </Link>

                                                <Link
                                                    to={`/dashboard/edit-job/${job._id}`}
                                                    className="text-indigo-600 hover:text-indigo-800 p-1"
                                                    title="Chỉnh sửa công việc"
                                                >
                                                    <Edit size={18} />
                                                </Link>

                                                <button
                                                    onClick={() => openDeleteModal(job)}
                                                    className="text-red-600 hover:text-red-800 p-1"
                                                    title="Xóa công việc"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Phân trang và chọn số lượng hiển thị */}
                    {jobs.length > 0 && (
                        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>Hiển thị</span>
                                <select
                                    value={pagination.limit}
                                    onChange={(e) => handleLimitChange(parseInt(e.target.value))}
                                    className="border rounded px-2 py-1 text-sm"
                                >
                                    {[5, 10, 20, 50].map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                <span>mục mỗi trang | Tổng cộng: {pagination.total} công việc</span>
                            </div>

                            {/* Phân trang nâng cao */}
                            {pagination.pages > 1 && (
                                <div className="flex justify-center">
                                    {renderPagination()}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Modal xác nhận xóa */}
            {deleteModalOpen && (
                <Modal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    title="Xác nhận xóa công việc"
                >
                    <div className="p-6">
                        <div className="flex items-start mb-4">
                            <AlertCircle className="text-red-500 mr-3" size={24} />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Bạn có chắc chắn muốn xóa công việc này?</h3>
                                {jobToDelete && (
                                    <p className="mt-1 text-gray-600">"{jobToDelete.title}"</p>
                                )}
                                <p className="mt-4 text-sm text-gray-500">
                                    Hành động này không thể hoàn tác. Tất cả thông tin về công việc và các đơn ứng tuyển liên quan sẽ bị xóa vĩnh viễn.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDeleteJob}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center"
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? "Đang xóa..." : "Xóa công việc"}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ManageJobs;
// // src/pages/ManageJobs.jsx

// import React, { useContext, useEffect, useState } from "react";
// import moment from 'moment';
// import { useNavigate, Link } from 'react-router-dom';
// import { AppContext } from '../context/AppContext';
// import axios from "axios";
// import { toast } from "react-toastify";
// import Loading from "../components/Loading";
// import { Eye, EyeOff, Edit, Trash2, AlertCircle, Search, RefreshCw } from 'lucide-react';
// import Modal from "../components/Modal";

// const ManageJobs = () => {
//     const navigate = useNavigate();
//     const [jobs, setJobs] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//     const [jobToDelete, setJobToDelete] = useState(null);
//     const [deleteLoading, setDeleteLoading] = useState(false);

//     // State cho phân trang và tìm kiếm
//     const [pagination, setPagination] = useState({
//         page: 1,
//         limit: 10,
//         total: 0,
//         pages: 0
//     });
//     const [searchParams, setSearchParams] = useState({
//         keyword: '',
//         status: '',
//         sort: 'newest'
//     });
//     const [searchLoading, setSearchLoading] = useState(false);

//     const { backendUrl, companyToken } = useContext(AppContext);

//     // Hàm fetch danh sách jobs của công ty có hỗ trợ phân trang và tìm kiếm
//     const fetchCompanyJobs = async (page = 1, limit = pagination.limit, params = {}) => {
//         setLoading(true);
//         try {
//             // Xây dựng query params
//             const queryParams = new URLSearchParams({
//                 page: page,
//                 limit: limit,
//                 ...params
//             }).toString();

//             const { data } = await axios.get(
//                 `${backendUrl}/api/companies/list-jobs?${queryParams}`,
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${companyToken}`
//                     },
//                     timeout: 15000
//                 }
//             );

//             if (data.success) {
//                 setJobs(data.jobs || []);
//                 // Cập nhật thông tin phân trang
//                 setPagination({
//                     page: data.pagination?.page || 1,
//                     limit: data.pagination?.limit || 10,
//                     total: data.pagination?.total || 0,
//                     pages: data.pagination?.pages || 0
//                 });
//             } else {
//                 toast.error(data.message || "Không thể tải danh sách công việc");
//                 setJobs([]);
//             }
//         } catch (error) {
//             console.error('Error fetching jobs:', error);
//             toast.error(error.response?.data?.message || "Lỗi khi tải danh sách công việc");
//             setJobs([]);

//             if (error.response?.status === 401) {
//                 localStorage.removeItem('companyToken');
//                 navigate('/login');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Hàm xử lý thay đổi trang
//     const handlePageChange = (newPage) => {
//         if (newPage < 1 || newPage > pagination.pages) return;
//         fetchCompanyJobs(newPage, pagination.limit, searchParams);
//     };

//     // Hàm xử lý thay đổi số lượng hiển thị mỗi trang
//     const handleLimitChange = (newLimit) => {
//         fetchCompanyJobs(1, newLimit, searchParams);
//     };

//     // Hàm xử lý tìm kiếm
//     const handleSearch = (e) => {
//         e.preventDefault();
//         setSearchLoading(true);
//         fetchCompanyJobs(1, pagination.limit, searchParams)
//             .finally(() => setSearchLoading(false));
//     };

//     // Hàm xử lý reset search
//     const handleResetSearch = () => {
//         setSearchParams({
//             keyword: '',
//             status: '',
//             sort: 'newest'
//         });
//         fetchCompanyJobs(1, pagination.limit, {});
//     };

//     // Hàm xử lý thay đổi input search
//     const handleSearchInputChange = (e) => {
//         const { name, value } = e.target;
//         setSearchParams(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const toggleJobVisibility = async (jobId, currentVisibility) => {
//         try {
//             // Optimistic update
//             setJobs(prevJobs => prevJobs.map(job =>
//                 job._id === jobId ? { ...job, visible: !currentVisibility } : job
//             ));

//             const { data } = await axios.patch(
//                 `${backendUrl}/api/jobs/${jobId}/visibility`,
//                 {},  // Body trống vì server sẽ tự toggle
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${companyToken}`,
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );

//             if (data.success) {
//                 toast.success(data.message);
//             } else {
//                 // Rollback if failed
//                 setJobs(prevJobs => prevJobs.map(job =>
//                     job._id === jobId ? { ...job, visible: currentVisibility } : job
//                 ));
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             console.error('Error toggling visibility:', error);
//             // Rollback on error
//             setJobs(prevJobs => prevJobs.map(job =>
//                 job._id === jobId ? { ...job, visible: currentVisibility } : job
//             ));
//             toast.error(error.response?.data?.message || "Lỗi khi cập nhật trạng thái hiển thị");
//         }
//     };

//     const handleDeleteJob = async () => {
//         if (!jobToDelete) return;

//         setDeleteLoading(true);
//         try {
//             const { data } = await axios.delete(
//                 `${backendUrl}/api/jobs/${jobToDelete._id}`,
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${companyToken}`,
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );

//             if (data.success) {
//                 // Cập nhật danh sách job sau khi xóa
//                 setJobs(prevJobs => prevJobs.filter(job => job._id !== jobToDelete._id));
//                 // Cập nhật lại số lượng
//                 setPagination(prev => ({
//                     ...prev,
//                     total: prev.total - 1
//                 }));
//                 toast.success("Xóa công việc thành công");
//                 setDeleteModalOpen(false);
//             } else {
//                 toast.error(data.message || "Không thể xóa công việc");
//             }
//         } catch (error) {
//             console.error('Error deleting job:', error);
//             toast.error(error.response?.data?.message || "Lỗi khi xóa công việc");
//         } finally {
//             setDeleteLoading(false);
//         }
//     };

//     const openDeleteModal = (job) => {
//         setJobToDelete(job);
//         setDeleteModalOpen(true);
//     };

//     useEffect(() => {
//         if (companyToken) {
//             fetchCompanyJobs(1, pagination.limit);
//         } else {
//             setJobs([]);
//             setLoading(false);
//         }
//     }, [companyToken]);

//     // Render Pagination Controls
//     const renderPagination = () => {
//         const { page, pages } = pagination;

//         // Nếu tổng số trang <= 1, không hiển thị phân trang
//         if (pages <= 1) return null;

//         // Hiển thị tối đa 5 nút trang
//         const maxVisiblePages = 5;
//         let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
//         let endPage = Math.min(pages, startPage + maxVisiblePages - 1);

//         // Điều chỉnh startPage nếu endPage đã đạt max
//         if (endPage - startPage + 1 < maxVisiblePages) {
//             startPage = Math.max(1, endPage - maxVisiblePages + 1);
//         }

//         // Tạo mảng các nút trang
//         const pageButtons = [];

//         // Nút trang đầu và "..."
//         if (startPage > 1) {
//             pageButtons.push(
//                 <button
//                     key="first"
//                     onClick={() => handlePageChange(1)}
//                     className="relative inline-flex items-center px-4 py-2 border text-sm font-medium bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
//                 >
//                     1
//                 </button>
//             );

//             if (startPage > 2) {
//                 pageButtons.push(
//                     <span key="dots1" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
//                         ...
//                     </span>
//                 );
//             }
//         }

//         // Các nút trang giữa
//         for (let i = startPage; i <= endPage; i++) {
//             pageButtons.push(
//                 <button
//                     key={i}
//                     onClick={() => handlePageChange(i)}
//                     className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === i
//                             ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
//                             : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                         }`}
//                 >
//                     {i}
//                 </button>
//             );
//         }

//         // "..." và nút trang cuối
//         if (endPage < pages) {
//             if (endPage < pages - 1) {
//                 pageButtons.push(
//                     <span key="dots2" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
//                         ...
//                     </span>
//                 );
//             }

//             pageButtons.push(
//                 <button
//                     key="last"
//                     onClick={() => handlePageChange(pages)}
//                     className="relative inline-flex items-center px-4 py-2 border text-sm font-medium bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
//                 >
//                     {pages}
//                 </button>
//             );
//         }

//         return (
//             <nav className="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
//                 {/* Nút Previous */}
//                 <button
//                     onClick={() => handlePageChange(page - 1)}
//                     disabled={page === 1}
//                     className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${page === 1
//                             ? 'text-gray-300 cursor-not-allowed'
//                             : 'text-gray-500 hover:bg-gray-50'
//                         }`}
//                 >
//                     <span className="sr-only">Previous</span>
//                     <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                         <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//                     </svg>
//                 </button>

//                 {/* Các nút trang */}
//                 {pageButtons}

//                 {/* Nút Next */}
//                 <button
//                     onClick={() => handlePageChange(page + 1)}
//                     disabled={page === pages}
//                     className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${page === pages
//                             ? 'text-gray-300 cursor-not-allowed'
//                             : 'text-gray-500 hover:bg-gray-50'
//                         }`}
//                 >
//                     <span className="sr-only">Next</span>
//                     <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                         <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                     </svg>
//                 </button>
//             </nav>
//         );
//     };

//     // Hiển thị Loading
//     if (loading && jobs.length === 0) {
//         return <div className="flex justify-center items-center h-64"><Loading /></div>;
//     }

//     return (
//         <div className="container p-4 max-w-5xl mx-auto">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//                 <h2 className="text-2xl font-semibold mb-4 sm:mb-0">Quản lý Công việc đã đăng</h2>
//                 <button
//                     onClick={() => navigate('/dashboard/add-job')}
//                     className="bg-black text-white py-2 px-5 rounded hover:bg-gray-800"
//                 >
//                     Đăng công việc mới
//                 </button>
//             </div>

//             {/* Search form */}
//             <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-sm mb-6">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                         <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
//                             Từ khóa
//                         </label>
//                         <div className="relative">
//                             <input
//                                 type="text"
//                                 id="keyword"
//                                 name="keyword"
//                                 value={searchParams.keyword}
//                                 onChange={handleSearchInputChange}
//                                 placeholder="Tên công việc..."
//                                 className="w-full border border-gray-300 rounded-md pl-10 py-2 focus:ring-blue-500 focus:border-blue-500"
//                             />
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                 <Search size={18} className="text-gray-400" />
//                             </div>
//                         </div>
//                     </div>

//                     <div>
//                         <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
//                             Trạng thái
//                         </label>
//                         <select
//                             id="status"
//                             name="status"
//                             value={searchParams.status}
//                             onChange={handleSearchInputChange}
//                             className="w-full border border-gray-300 rounded-md py-2 focus:ring-blue-500 focus:border-blue-500"
//                         >
//                             <option value="">Tất cả trạng thái</option>
//                             <option value="active">Active</option>
//                             <option value="pending">Pending</option>
//                             <option value="inactive">Inactive</option>
//                         </select>
//                     </div>

//                     <div>
//                         <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
//                             Sắp xếp theo
//                         </label>
//                         <select
//                             id="sort"
//                             name="sort"
//                             value={searchParams.sort}
//                             onChange={handleSearchInputChange}
//                             className="w-full border border-gray-300 rounded-md py-2 focus:ring-blue-500 focus:border-blue-500"
//                         >
//                             <option value="newest">Mới nhất</option>
//                             <option value="oldest">Cũ nhất</option>
//                             <option value="title-az">Tiêu đề A-Z</option>
//                             <option value="title-za">Tiêu đề Z-A</option>
//                         </select>
//                     </div>
//                 </div>

//                 <div className="flex justify-end mt-4 gap-2">
//                     <button
//                         type="button"
//                         onClick={handleResetSearch}
//                         className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
//                     >
//                         <RefreshCw size={16} className="mr-1" />
//                         Đặt lại
//                     </button>
//                     <button
//                         type="submit"
//                         disabled={searchLoading}
//                         className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
//                     >
//                         <Search size={16} className="mr-1" />
//                         {searchLoading ? "Đang tìm..." : "Tìm kiếm"}
//                     </button>
//                 </div>
//             </form>

//             {/* Hiển thị nếu không có jobs hoặc fetch lỗi */}
//             {jobs.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-40 bg-white rounded-lg shadow-sm p-6">
//                     <p className="text-xl sm:text-xl mb-4 text-gray-600">Không tìm thấy công việc nào.</p>
//                     <button
//                         onClick={handleResetSearch}
//                         className="text-blue-600 hover:text-blue-800 font-medium"
//                     >
//                         Xóa bộ lọc và thử lại
//                     </button>
//                 </div>
//             ) : (
//                 <>
//                     {/* Hiển thị tổng số jobs */}
//                     <div className="mb-3 text-sm text-gray-600">
//                         Hiển thị {jobs.length} trong tổng số {pagination.total} công việc
//                     </div>

//                     {/* Bảng jobs */}
//                     <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
//                         <table className="min-w-full bg-white border-collapse max-sm:text-sm">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="py-3 px-4 border-b text-left max-sm:hidden">#</th>
//                                     <th className="py-3 px-4 border-b text-left">Tiêu đề Công việc</th>
//                                     <th className="py-3 px-4 border-b text-left max-sm:hidden">Ngày đăng</th>
//                                     <th className="py-3 px-4 border-b text-left max-sm:hidden">Địa điểm</th>
//                                     <th className="py-3 px-4 border-b text-center">Ứng viên</th>
//                                     <th className="py-3 px-4 border-b text-center">Trạng thái</th>
//                                     <th className="py-3 px-4 border-b text-center">Hiển thị</th>
//                                     <th className="py-3 px-4 border-b text-center">Hành động</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {jobs.map((job, index) => (
//                                     <tr key={job._id} className="text-gray-700 hover:bg-gray-50">
//                                         <td className="py-3 px-4 border-b max-sm:hidden">
//                                             {(pagination.page - 1) * pagination.limit + index + 1}
//                                         </td>
//                                         <td className="py-3 px-4 border-b font-medium">{job.title}</td>
//                                         <td className="py-3 px-4 border-b max-sm:hidden">
//                                             {moment(job.createdAt).format('DD/MM/YYYY')}
//                                         </td>
//                                         <td className="py-3 px-4 border-b max-sm:hidden">{job.location}</td>
//                                         <td className="py-3 px-4 border-b text-center">
//                                             <span className="inline-flex items-center gap-1">
//                                                 <span className="font-medium">{job.applicationsCount || 0}</span>
//                                                 {job.applicationStats && (
//                                                     <span className="text-xs text-gray-500">
//                                                         ({job.applicationStats.pending || 0} mới)
//                                                     </span>
//                                                 )}
//                                             </span>
//                                         </td>
//                                         <td className="py-3 px-4 border-b text-center">
//                                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
//                                                     ${job.status === 'active' || job.status === 'approved' ? 'bg-green-100 text-green-800' :
//                                                     job.status === 'inactive' ? 'bg-red-100 text-red-800' :
//                                                         'bg-yellow-100 text-yellow-800'}`}>
//                                                 {job.status === 'active' || job.status === 'approved' ? 'Active' :
//                                                     job.status === 'inactive' ? 'Inactive' :
//                                                         'Pending'}
//                                             </span>
//                                         </td>
//                                         <td className="py-3 px-4 border-b text-center">
//                                             <button
//                                                 onClick={() => toggleJobVisibility(job._id, job.visible)}
//                                                 title={job.visible ? "Nhấn để ẩn" : "Nhấn để hiện"}
//                                                 className={`p-1 rounded ${job.visible && (job.status === 'active' || job.status === 'approved') ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'}`}
//                                                 disabled={job.status !== 'active' && job.status !== 'approved'}
//                                             >
//                                                 {job.visible && (job.status === 'active' || job.status === 'approved') ? <Eye size={18} /> : <EyeOff size={18} />}
//                                             </button>
//                                         </td>
//                                         <td className="py-3 px-4 border-b text-center">
//                                             <div className="flex items-center justify-center gap-2">
//                                                 <Link
//                                                     to={`/dashboard/manage-jobs/${job._id}/applicants`}
//                                                     className="text-blue-600 hover:text-blue-800 p-1"
//                                                     title={`Xem ${job.applicationsCount || 0} ứng viên`}
//                                                 >
//                                                     Xem CV
//                                                 </Link>

//                                                 <Link
//                                                     to={`/dashboard/edit-job/${job._id}`}
//                                                     className="text-indigo-600 hover:text-indigo-800 p-1"
//                                                     title="Chỉnh sửa công việc"
//                                                 >
//                                                     <Edit size={18} />
//                                                 </Link>

//                                                 <button
//                                                     onClick={() => openDeleteModal(job)}
//                                                     className="text-red-600 hover:text-red-800 p-1"
//                                                     title="Xóa công việc"
//                                                 >
//                                                     <Trash2 size={18} />
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Phân trang và chọn số lượng hiển thị */}
//                     {jobs.length > 0 && (
//                         <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
//                             <div className="flex items-center gap-2 text-sm text-gray-600">
//                                 <span>Hiển thị</span>
//                                 <select
//                                     value={pagination.limit}
//                                     onChange={(e) => handleLimitChange(parseInt(e.target.value))}
//                                     className="border rounded px-2 py-1 text-sm"
//                                 >
//                                     {[5, 10, 20, 50].map(option => (
//                                         <option key={option} value={option}>{option}</option>
//                                     ))}
//                                 </select>
//                                 <span>mục mỗi trang | Tổng cộng: {pagination.total} công việc</span>
//                             </div>

//                             {/* Phân trang nâng cao */}
//                             {pagination.pages > 1 && (
//                                 <div className="flex justify-center">
//                                     {renderPagination()}
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </>
//             )}

//             {/* Modal xác nhận xóa */}
//             {deleteModalOpen && (
//                 <Modal
//                     isOpen={deleteModalOpen}
//                     onClose={() => setDeleteModalOpen(false)}
//                     title="Xác nhận xóa công việc"
//                 >
//                     <div className="p-6">
//                         <div className="flex items-start mb-4">
//                             <AlertCircle className="text-red-500 mr-3" size={24} />
//                             <div>
//                                 <h3 className="text-lg font-semibold text-gray-900">Bạn có chắc chắn muốn xóa công việc này?</h3>
//                                 {jobToDelete && (
//                                     <p className="mt-1 text-gray-600">"{jobToDelete.title}"</p>
//                                 )}
//                                 <p className="mt-4 text-sm text-gray-500">
//                                     Hành động này không thể hoàn tác. Tất cả thông tin về công việc và các đơn ứng tuyển liên quan sẽ bị xóa vĩnh viễn.
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="flex justify-end gap-3 mt-6">
//                             <button
//                                 onClick={() => setDeleteModalOpen(false)}
//                                 className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
//                             >
//                                 Hủy
//                             </button>
//                             <button
//                                 onClick={handleDeleteJob}
//                                 className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center"
//                                 disabled={deleteLoading}
//                             >
//                                 {deleteLoading ? "Đang xóa..." : "Xóa công việc"}
//                             </button>
//                         </div>
//                     </div>
//                 </Modal>
//             )}
//         </div>
//     );
// };

// export default ManageJobs;


// // src/pages/ManageJobs.jsx

// import React, { useContext, useEffect, useState } from "react";
// import moment from 'moment';
// import { useNavigate, Link } from 'react-router-dom'; // <<< Thêm Link
// import { AppContext } from '../context/AppContext';
// import axios from "axios";
// import { toast } from "react-toastify";
// import Loading from "../components/Loading";
// import { Eye, EyeOff, Edit, Trash2, AlertCircle } from 'lucide-react'; // <<< Thêm icons nếu muốn cho nút visibility
// import Modal from "../components/Modal";

// const ManageJobs = () => {
//     const navigate = useNavigate();
//     const [jobs, setJobs] = useState(null); // Khởi tạo là null thay vì false để phân biệt chưa fetch và fetch về mảng rỗng
//     const [loading, setLoading] = useState(true); // Thêm state loading

//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//     const [jobToDelete, setJobToDelete] = useState(null);
//     const [deleteLoading, setDeleteLoading] = useState(false);

//     const { backendUrl, companyToken } = useContext(AppContext);

//     // Hàm fetch danh sách jobs của công ty
//     const fetchCompanyJobs = async (retryCount = 0) => {
//         setLoading(true);
//         try {
//             const { data } = await axios.get(`${backendUrl}/api/companies/list-jobs`, {
//                 headers: {
//                     'Authorization': `Bearer ${companyToken}`
//                 },
//                 timeout: 15000 // Set axios timeout to 15s
//             });

//             if (data.success) {
//                 setJobs(data.jobs);
//             } else {
//                 toast.error(data.message || "Không thể tải danh sách công việc");
//                 setJobs([]);
//             }
//         } catch (error) {
//             console.error('Error fetching jobs:', error);

//             // Retry logic for timeout errors
//             if (error.code === 'ECONNABORTED' && retryCount < 3) {
//                 console.log(`Retrying... Attempt ${retryCount + 1}`);
//                 return fetchCompanyJobs(retryCount + 1);
//             }

//             toast.error(error.response?.data?.message || "Lỗi khi tải danh sách công việc");
//             setJobs([]);

//             if (error.response?.status === 401) {
//                 localStorage.removeItem('companyToken');
//                 navigate('/login');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };
//     const fetchCompanyJobs_1 = async () => {
//         setLoading(true);
//         try {
//             const { data } = await axios.get(`${backendUrl}/api/companies/list-jobs`, {
//                 headers: {
//                     'Authorization': `Bearer ${companyToken}`
//                 }
//             });

//             if (data.success) {
//                 setJobs(data.jobs);
//             } else {
//                 toast.error(data.message || "Không thể tải danh sách công việc");
//                 setJobs([]);
//             }
//         } catch (error) {
//             console.error('Error fetching jobs:', error);
//             toast.error(error.response?.data?.message || "Lỗi khi tải danh sách công việc");
//             setJobs([]);
//             if (error.response?.status === 401) {
//                 // Handle unauthorized access
//                 localStorage.removeItem('companyToken');
//                 navigate('/login');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };
//     const fetchCompanyJobs_0 = async () => {
//         setLoading(true);
//         try {
//             const { data } = await axios.get(`${backendUrl}/api/company/list-jobs`, {
//                 headers: {
//                     Authorization: `Bearer ${companyToken}` // Change from token to Bearer token
//                 }
//             });

//             if (data.success) {
//                 // Log the response to check the structure
//                 console.log('Jobs data:', data);

//                 // Make sure we handle the correct data structure
//                 const jobsList = data.jobs || data.jobsData || [];
//                 setJobs(jobsList.reverse());
//             } else {
//                 toast.error(data.message || "Không thể tải danh sách công việc.");
//                 setJobs([]);
//             }
//         } catch (error) {
//             console.error('Error fetching jobs:', error);
//             toast.error(error.response?.data?.message || "Lỗi khi tải công việc.");
//             setJobs([]);
//         } finally {
//             setLoading(false);
//         }
//     };
//     // const fetchCompanyJobs = async () => {
//     // setLoading(true); // Bắt đầu loading
//     // try {
//     // const { data } = await axios.get(backendUrl + '/api/company/list-jobs', {
//     // headers: { token: companyToken } // Hoặc Authorization: Bearer
//     // });
//     // if (data.success) {
//     //Đảm bảo data.jobsData là mảng trước khi reverse
//     // setJobs(Array.isArray(data.jobsData) ? data.jobsData.reverse() : []);
//     // console.log(data.jobsData);
//     // } else {
//     // toast.error(data.message || "Không thể tải danh sách công việc.");
//     // setJobs([]); // Đặt thành mảng rỗng nếu lỗi
//     // }
//     // } catch (error) {
//     // toast.error(error.message || "Lỗi khi tải công việc.");
//     // setJobs([]); // Đặt thành mảng rỗng nếu lỗi
//     // } finally {
//     // setLoading(false); // Kết thúc loading
//     // }
//     // };

//     // --- HÀM MỚI: Bật/Tắt hiển thị job (dùng API PATCH) ---

//     const toggleJobVisibility = async (jobId, currentVisibility) => {
//         try {
//             // Optimistic update
//             setJobs(prevJobs => prevJobs.map(job =>
//                 job._id === jobId ? { ...job, visible: !currentVisibility } : job
//             ));

//             const { data } = await axios.patch(
//                 `${backendUrl}/api/jobs/${jobId}/visibility`,
//                 {},  // Body trống vì server sẽ tự toggle
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${companyToken}`,
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );

//             if (data.success) {
//                 toast.success(data.message);
//             } else {
//                 // Rollback if failed
//                 setJobs(prevJobs => prevJobs.map(job =>
//                     job._id === jobId ? { ...job, visible: currentVisibility } : job
//                 ));
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             console.error('Error toggling visibility:', error);
//             // Rollback on error
//             setJobs(prevJobs => prevJobs.map(job =>
//                 job._id === jobId ? { ...job, visible: currentVisibility } : job
//             ));
//             toast.error(error.response?.data?.message || "Lỗi khi cập nhật trạng thái hiển thị");
//         }
//     };
//     const toggleJobVisibility_1 = async (jobId, currentVisibility) => {
//         try {
//             // Optimistic update
//             setJobs(prevJobs => prevJobs.map(job =>
//                 job._id === jobId ? { ...job, visible: !currentVisibility } : job
//             ));

//             const { data } = await axios.patch(
//                 `${backendUrl}/api/company/jobs/${jobId}/visibility`,
//                 { visible: !currentVisibility },
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${companyToken}`,
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );

//             if (data.success) {
//                 toast.success("Cập nhật trạng thái hiển thị thành công");
//             } else {
//                 // Rollback if failed
//                 setJobs(prevJobs => prevJobs.map(job =>
//                     job._id === jobId ? { ...job, visible: currentVisibility } : job
//                 ));
//                 toast.error(data.message || "Cập nhật thất bại");
//             }
//         } catch (error) {
//             console.error('Error toggling visibility:', error);
//             // Rollback on error
//             setJobs(prevJobs => prevJobs.map(job =>
//                 job._id === jobId ? { ...job, visible: currentVisibility } : job
//             ));
//             toast.error("Lỗi khi cập nhật trạng thái hiển thị");
//         }
//     };
//     const toggleJobVisibility_0 = async (jobId, currentVisibility) => {
//         // Optimistic Update
//         setJobs(prevJobs => prevJobs.map(job =>
//             job._id === jobId ? { ...job, isVisible: !currentVisibility } : job
//         ));

//         try {
//             const { data } = await axios.patch(`${backendUrl}/api/company/jobs/${jobId}/visibility`,
//                 {}, // Không cần gửi body nếu backend chỉ toggle
//                 { headers: { token: companyToken } } // Hoặc Authorization: Bearer
//             );

//             if (data.success) {
//                 toast.success(data.message);
//                 // Không cần fetch lại vì đã Optimistic Update
//             } else {
//                 toast.error(data.message || "Cập nhật hiển thị thất bại.");
//                 // Rollback
//                 setJobs(prevJobs => prevJobs.map(job =>
//                     job._id === jobId ? { ...job, isVisible: currentVisibility } : job
//                 ));
//             }
//         } catch (error) {
//             toast.error(error.message || "Lỗi khi cập nhật hiển thị.");
//             // Rollback
//             setJobs(prevJobs => prevJobs.map(job =>
//                 job._id === jobId ? { ...job, isVisible: currentVisibility } : job
//             ));
//         }
//     };

//     const handleDeleteJob = async () => {
//         if (!jobToDelete) return;

//         setDeleteLoading(true);
//         try {
//             const { data } = await axios.delete(
//                 `${backendUrl}/api/companies/jobs/${jobToDelete._id}`,
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${companyToken}`,
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );

//             if (data.success) {
//                 // Cập nhật danh sách job sau khi xóa
//                 setJobs(prevJobs => prevJobs.filter(job => job._id !== jobToDelete._id));
//                 toast.success("Xóa công việc thành công");
//                 setDeleteModalOpen(false);
//             } else {
//                 toast.error(data.message || "Không thể xóa công việc");
//             }
//         } catch (error) {
//             console.error('Error deleting job:', error);
//             toast.error(error.response?.data?.message || "Lỗi khi xóa công việc");
//         } finally {
//             setDeleteLoading(false);
//         }
//     };

//     const openDeleteModal = (job) => {
//         setJobToDelete(job);
//         setDeleteModalOpen(true);
//     };


//     useEffect(() => {
//         if (companyToken) {
//             fetchCompanyJobs();
//         } else {
//             setJobs([]); // Nếu không có token, không có jobs
//             setLoading(false);
//         }
//     }, [companyToken]); // Bỏ fetchCompanyJobs khỏi dependency array nếu nó không thay đổi

//     // Hiển thị Loading
//     if (loading) {
//         return <div className="flex justify-center items-center h-64"><Loading /></div>;
//     }

//     // Hiển thị nếu không có jobs hoặc fetch lỗi
//     if (!jobs || jobs.length === 0) {
//         return (
//             <div className="flex flex-col items-center justify-center h-[70vh]">
//                 <p className="text-xl sm:text-2xl mb-4">Chưa có công việc nào được đăng.</p>
//                 <button
//                     onClick={() => navigate('/dashboard/add-job')}
//                     className="bg-black text-white py-2 px-5 rounded hover:bg-gray-800"
//                 >
//                     Đăng công việc mới
//                 </button>
//             </div>
//         );
//     }

//     // Hiển thị bảng jobs
//     return (
//         <div className="container p-4 max-w-5xl mx-auto"> {/* Thêm mx-auto */}
//             <h2 className="text-2xl font-semibold mb-4">Quản lý Công việc đã đăng</h2>
//             <div className="overflow-x-auto ">
//                 <table className="min-w-full bg-white border border-gray-200 border-collapse max-sm:text-sm">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="py-2 px-4 border-b text-left max-sm:hidden">#</th>
//                             <th className="py-2 px-4 border-b text-left ">Tiêu đề Công việc</th>
//                             <th className="py-2 px-4 border-b text-left max-sm:hidden">Ngày đăng</th>
//                             <th className="py-2 px-4 border-b text-left max-sm:hidden">Địa điểm</th>
//                             <th className="py-2 px-4 border-b text-center ">Ứng viên</th>
//                             <th className="py-2 px-4 border-b text-center">Trạng thái</th>
//                             <th className="py-2 px-4 border-b text-center ">Hiển thị</th>
//                             {/* <<< THÊM CỘT HÀNH ĐỘNG >>> */}
//                             <th className="py-2 px-4 border-b text-center ">Hành động</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {jobs.map((job, index) => (
//                             <tr key={job._id} className="text-gray-700 hover:bg-gray-50">
//                                 <td className="py-2 px-4 border-b max-sm:hidden">{index + 1}</td>
//                                 <td className="py-2 px-4 border-b font-medium">{job.title}</td>
//                                 <td className="py-2 px-4 border-b max-sm:hidden">{moment(job.date || job.createdAt).format('DD/MM/YYYY')}</td> {/* Ưu tiên date nếu có, fallback về createdAt */}
//                                 <td className="py-2 px-4 border-b max-sm:hidden">{job.location}</td>
//                                 <td className="py-2 px-4 border-b text-center">
//                                     <span className="inline-flex items-center gap-1">
//                                         <span className="font-medium">{job.applicationsCount || 0}</span>
//                                         {job.applicationStats && (
//                                             <span className="text-xs text-gray-500">
//                                                 ({job.applicationStats.pending || 0} mới)
//                                             </span>
//                                         )}
//                                     </span>
//                                 </td>
//                                 <td className="py-2 px-4 border-b text-center">
//                                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
//                                             ${job.status === 'active' ? 'bg-green-100 text-green-800' :
//                                             job.status === 'inactive' ? 'bg-red-100 text-red-800' :
//                                                 'bg-yellow-100 text-yellow-800'}`}>
//                                         {job.status === 'active' ? 'Active' :
//                                             job.status === 'inactive' ? 'Inactive' :
//                                                 'Pending'}
//                                     </span>
//                                 </td>
//                                 <td className="py-2 px-4 border-b text-center">
//                                     {/* Sử dụng hàm toggleJobVisibility mới */}
//                                     <button
//                                         onClick={() => toggleJobVisibility(job._id, job.visible)}
//                                         title={job.visible ? "Nhấn để ẩn" : "Nhấn để hiện"}
//                                         className={`p-1 rounded ${job.visible && job.status === 'active' ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'}`}
//                                         disabled={job.status !== 'active'} // Disable nếu không phải active
//                                     >
//                                         {job.visible && job.status === 'active' ? <Eye size={18} /> : <EyeOff size={18} />}
//                                     </button>
//                                     {/* Hoặc dùng checkbox nếu muốn
//                                     <input
//                                         onChange={() => toggleJobVisibility(job._id, job.isVisible)}
//                                         className="scale-125" type="checkbox"
//                                         checked={job.isVisible === undefined ? true : job.isVisible} // Mặc định checked nếu isVisible không tồn tại
//                                     />
//                                      */}
//                                 </td>
//                                 {/* <<< THÊM Ô TD CHO HÀNH ĐỘNG >>> */}
//                                 <td className="py-2 px-4 border-b text-center">
//                                     <div className="flex items-center justify-center gap-2">
//                                         <Link
//                                             to={`/dashboard/manage-jobs/${job._id}/applicants`}
//                                             className="text-blue-600 hover:text-blue-800 p-1"
//                                             title={`Xem ${job.applicationsCount || 0} ứng viên`}
//                                         >
//                                             Xem CV
//                                         </Link>

//                                         <Link
//                                             to={`/dashboard/edit-job/${job._id}`}
//                                             className="text-indigo-600 hover:text-indigo-800 p-1"
//                                             title="Chỉnh sửa công việc"
//                                         >
//                                             <Edit size={18} />
//                                         </Link>

//                                         <button
//                                             onClick={() => openDeleteModal(job)}
//                                             className="text-red-600 hover:text-red-800 p-1"
//                                             title="Xóa công việc"
//                                         >
//                                             <Trash2 size={18} />
//                                         </button>
//                                     </div>

//                                     {/* <Link */}
//                                     {/* to={`/dashboard/manage-jobs/${job._id}/applicants`} // <<< LINK ĐẾN TRANG XEM ỨNG VIÊN */}
//                                     {/* className="text-blue-600 hover:text-blue-800 hover:underline text-sm px-2 py-1" */}
//                                     {/* title={`Xem ${job.applicants} ứng viên`} */}
//                                     {/* > */}
//                                     {/* Xem CV ({job.applicants || 0}) */}
//                                     {/* </Link> */}
//                                     {/* Thêm nút sửa job nếu cần */}
//                                     {/* <Link to={`/dashboard/edit-job/${job._id}`}>Sửa</Link> */}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Nút Add new job */}
//             <div className="mt-6 flex justify-end gap-2">
//                 <button
//                     onClick={() => navigate('/dashboard/add-job')}
//                     className="bg-black text-white py-2 px-5 rounded hover:bg-gray-800"
//                 >
//                     Đăng công việc mới
//                 </button>
//             </div>

//             {/* Modal xác nhận xóa */}
//             {deleteModalOpen && (
//                 <Modal
//                     isOpen={deleteModalOpen}
//                     onClose={() => setDeleteModalOpen(false)}
//                     title="Xác nhận xóa công việc"
//                 >
//                     <div className="p-6">
//                         <div className="flex items-start mb-4">
//                             <AlertCircle className="text-red-500 mr-3" size={24} />
//                             <div>
//                                 <h3 className="text-lg font-semibold text-gray-900">Bạn có chắc chắn muốn xóa công việc này?</h3>
//                                 {jobToDelete && (
//                                     <p className="mt-1 text-gray-600">"{jobToDelete.title}"</p>
//                                 )}
//                                 <p className="mt-4 text-sm text-gray-500">
//                                     Hành động này không thể hoàn tác. Tất cả thông tin về công việc và các đơn ứng tuyển liên quan sẽ bị xóa vĩnh viễn.
//                                 </p>
//                             </div>
//                         </div>

//                         <div className="flex justify-end gap-3 mt-6">
//                             <button
//                                 onClick={() => setDeleteModalOpen(false)}
//                                 className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
//                             >
//                                 Hủy
//                             </button>
//                             <button
//                                 onClick={handleDeleteJob}
//                                 className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center"
//                                 disabled={deleteLoading}
//                             >
//                                 {deleteLoading ? "Đang xóa..." : "Xóa công việc"}
//                             </button>
//                         </div>
//                     </div>
//                 </Modal>
//             )}

//         </div>
//     );
// };

// export default ManageJobs;