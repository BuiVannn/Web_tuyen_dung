import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams, Link } from 'react-router-dom';
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import { Eye, Mail, FileText, Calendar, MapPin, Briefcase, Award, Clock, ChevronDown, ChevronUp, Phone, RefreshCw } from 'lucide-react';

// Helper render status (giữ nguyên)
const renderStatusBadge = (status) => {
    let colorClasses = 'bg-gray-100 text-gray-800';
    let displayText = 'N/A';

    switch (status?.toLowerCase()) {
        case 'pending':
            colorClasses = 'bg-yellow-100 text-yellow-800';
            displayText = 'Chờ duyệt';
            break;
        case 'viewed':
            colorClasses = 'bg-blue-100 text-blue-800';
            displayText = 'Đã xem';
            break;
        case 'shortlisted':
            colorClasses = 'bg-purple-100 text-purple-800';
            displayText = 'Phù hợp';
            break;
        case 'interviewing':
            colorClasses = 'bg-cyan-100 text-cyan-800';
            displayText = 'Phỏng vấn';
            break;
        case 'hired':
        case 'accepted':
            colorClasses = 'bg-green-100 text-green-800';
            displayText = 'Đã tuyển';
            break;
        case 'rejected':
            colorClasses = 'bg-red-100 text-red-800';
            displayText = 'Từ chối';
            break;
        default:
            displayText = status ? (status.charAt(0).toUpperCase() + status.slice(1)) : 'N/A';
            break;
    }
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses}`}>
            {displayText}
        </span>
    );
};

const ViewApplications = () => {
    const { jobId } = useParams();
    const { backendUrl, companyToken } = useContext(AppContext);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [jobTitle, setJobTitle] = useState('');
    const [imageErrors, setImageErrors] = useState({});
    const [statusUpdating, setStatusUpdating] = useState(false);

    // State cho chi tiết ứng viên và expanded row
    const [expandedRow, setExpandedRow] = useState(null);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [submittedKeyword, setSubmittedKeyword] = useState('');

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPageOptions = [5, 10, 20, 50];

    // Thêm state cho sắp xếp
    const [sortParams, setSortParams] = useState({
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });


    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
        setSubmittedKeyword(searchKeyword); // Cập nhật từ khóa đã gửi
    };

    const handleClearSearch = () => {
        setSearchKeyword('');
        setSubmittedKeyword(''); // Xóa cả từ khóa đã gửi
        setCurrentPage(1);
    };

    // Thêm hàm xử lý thay đổi sắp xếp
    const handleSortChange = (e) => {
        const { name, value } = e.target;
        setSortParams(prev => ({
            ...prev,
            [name]: value
        }));
        setCurrentPage(1); // Reset về trang 1 khi thay đổi sắp xếp
    };

    // Hàm reset sắp xếp về mặc định
    const handleResetSort = () => {
        setSortParams({
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
        setCurrentPage(1);
    };

    // Hàm cập nhật trạng thái (giữ nguyên)
    const updateApplicationStatus = async (applicationId, newStatus) => {
        // Tránh nhiều lần gọi API cùng lúc
        if (statusUpdating) return;

        const currentApp = applicants.find(app => app._id === applicationId);
        if (!currentApp) return;
        const oldStatus = currentApp.status;

        // Optimistic Update
        setApplicants(prev => prev.map(app =>
            app._id === applicationId ? { ...app, status: newStatus } : app
        ));

        // Nếu đang xem chi tiết, cập nhật cả state selectedApplicant
        if (selectedApplicant && selectedApplicant._id === applicationId) {
            setSelectedApplicant({
                ...selectedApplicant,
                status: newStatus
            });
        }

        setStatusUpdating(true);

        try {
            if (!companyToken) {
                toast.error("Vui lòng đăng nhập lại");
                throw new Error("Missing token");
            }

            const { data } = await axios.patch(
                `${backendUrl}/api/companies/applications/${applicationId}/status`,
                { status: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${companyToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data.success) {
                toast.success("Cập nhật trạng thái thành công");
            } else {
                // Rollback if API returns error
                setApplicants(prev => prev.map(app =>
                    app._id === applicationId ? { ...app, status: oldStatus } : app
                ));

                if (selectedApplicant && selectedApplicant._id === applicationId) {
                    setSelectedApplicant({
                        ...selectedApplicant,
                        status: oldStatus
                    });
                }

                toast.error(data.message || "Cập nhật thất bại");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            // Rollback on error
            setApplicants(prev => prev.map(app =>
                app._id === applicationId ? { ...app, status: oldStatus } : app
            ));

            if (selectedApplicant && selectedApplicant._id === applicationId) {
                setSelectedApplicant({
                    ...selectedApplicant,
                    status: oldStatus
                });
            }

            if (error.response?.status === 401) {
                toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
            } else {
                toast.error(error.response?.data?.message || "Lỗi cập nhật trạng thái");
            }
        } finally {
            setStatusUpdating(false);
        }
    };

    // Xử lý thay đổi số item/trang
    const handleItemsPerPageChange = (newValue) => {
        console.log('Changing items per page to:', newValue);
        setItemsPerPage(parseInt(newValue));
        setCurrentPage(1); // Reset về trang 1 khi thay đổi số item/trang
    };

    // Hàm hiển thị thông tin chi tiết ứng viên (giữ nguyên)
    const toggleApplicantDetails = async (applicantId) => {
        // Nếu đang mở row này, đóng lại
        if (expandedRow === applicantId) {
            setExpandedRow(null);
            return;
        }

        // Mở row mới và tải dữ liệu
        setExpandedRow(applicantId);

        const applicant = applicants.find(app => app._id === applicantId);
        if (!applicant) return;

        setDetailLoading(true);

        try {
            // Gọi API để lấy chi tiết đơn ứng tuyển
            const { data } = await axios.get(
                `${backendUrl}/api/companies/applications/${applicantId}/detail`,
                {
                    headers: {
                        'Authorization': `Bearer ${companyToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data.success) {
                console.log("Thông tin chi tiết ứng viên:", data.application);

                // Lưu trạng thái trước đó
                const previousStatus = data.application.status;

                // Cập nhật state với thông tin chi tiết
                setSelectedApplicant(data.application);

                // Nếu trạng thái là 'pending', cập nhật thành 'viewed'
                if (previousStatus === 'pending') {
                    // Cập nhật cả trong state và gọi API
                    updateApplicationStatus(applicantId, 'viewed');
                }
            } else {
                toast.error(data.message || "Không thể tải thông tin chi tiết");
                // Fallback to local data
                setSelectedApplicant(applicant);
            }
        } catch (error) {
            console.error('Error fetching application detail:', error);
            toast.error(error.response?.data?.message || "Lỗi khi tải thông tin chi tiết");
            // Fallback to local data
            setSelectedApplicant(applicant);
        } finally {
            setDetailLoading(false);
        }
    };

    // Helper function hiển thị tên thân thiện cho tùy chọn sắp xếp
    const getSortByDisplayName = (sortBy) => {
        const sortByNames = {
            'createdAt': 'Ngày nộp đơn',
            'status': 'Trạng thái',
            'userName': 'Tên ứng viên',
            'jobTitle': 'Tên công việc',
            'companyName': 'Tên công ty',
            'date': 'Ngày nộp đơn',
            'appliedDate': 'Ngày nộp đơn'
        };

        return sortByNames[sortBy] || sortBy;
    };

    // Debug logging
    useEffect(() => {
        console.log('Current render state:', {
            currentPage,
            itemsPerPage,
            totalPages,
            totalItems,
            applicantsShown: applicants.length,
            sortParams
        });
    }, [applicants, currentPage, itemsPerPage, totalPages, totalItems, sortParams]);

    useEffect(() => {
        // Reset expandedRow khi chuyển trang để tránh lỗi
        setExpandedRow(null);

        // Kiểm tra token tồn tại
        if (!companyToken) {
            console.log('No company token found');
            return;
        }

        setLoading(true);

        // Tạo URL đúng cho API với tham số phân trang
        let apiUrl;
        if (jobId) {
            apiUrl = `${backendUrl}/api/companies/jobs/${jobId}/applicants`;
        } else {
            apiUrl = `${backendUrl}/api/companies/all-applications`;
        }

        // Đảm bảo thêm tham số page, limit và sắp xếp cho backend xử lý
        let paginatedUrl = `${apiUrl}?page=${currentPage}&limit=${itemsPerPage}`;

        // Thêm tham số sắp xếp vào URL
        paginatedUrl += `&sortBy=${sortParams.sortBy}&sortOrder=${sortParams.sortOrder}`;

        console.log('Fetching from URL:', paginatedUrl);

        if (submittedKeyword.trim()) {
            paginatedUrl += `&keyword=${encodeURIComponent(submittedKeyword.trim())}`;
        }

        // Gọi API
        axios.get(paginatedUrl, {
            headers: {
                'Authorization': `Bearer ${companyToken}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                const data = response.data;
                console.log('API Response:', data);

                if (data.success) {
                    setApplicants(data.applications || []);

                    // Cập nhật lại cách xử lý phân trang từ response
                    if (data.pagination) {
                        console.log('Pagination data:', data.pagination);
                        setTotalPages(data.pagination.pages || 1);
                        setTotalItems(data.pagination.total || 0);
                    } else {
                        console.log('No pagination data, setting defaults');
                        setTotalPages(1);
                        setTotalItems(data.applications?.length || 0);
                    }

                    if (jobId && data.jobTitle) {
                        setJobTitle(data.jobTitle);
                    }

                    // Quan trọng: Không cập nhật lại sortParams từ server
                    // Nếu muốn cập nhật, chỉ làm khi người dùng thực hiện một hành động cụ thể
                } else {
                    toast.error(data.message || "Không thể tải dữ liệu ứng viên");
                    setApplicants([]);
                    setTotalPages(1);
                    setTotalItems(0);
                }
            })
            .catch(error => {
                console.error('Error details:', error);
                setApplicants([]);
                setTotalPages(1);
                setTotalItems(0);
                toast.error(error.response?.data?.message || "Lỗi khi tải dữ liệu ứng viên");
            })
            .finally(() => {
                setLoading(false);
            });

    }, [jobId, companyToken, backendUrl, currentPage, itemsPerPage, submittedKeyword, sortParams]);

    // Tiêu đề trang
    const pageTitle = jobId ? `Ứng viên cho công việc: ${jobTitle || '...'}` : "Tất cả Đơn ứng tuyển";

    // Format date với định dạng đẹp hơn
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Hiển thị phân trang tối ưu (giữ nguyên)
    const renderPagination = () => {
        // Nếu tổng số trang <= 1, không hiển thị phân trang
        if (totalPages <= 1) return null;

        // Hiển thị tối đa 5 nút trang
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

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
                    onClick={() => setCurrentPage(1)}
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
                    onClick={() => setCurrentPage(i)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                >
                    {i}
                </button>
            );
        }

        // "..." và nút trang cuối
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageButtons.push(
                    <span key="dots2" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                    </span>
                );
            }

            pageButtons.push(
                <button
                    key="last"
                    onClick={() => setCurrentPage(totalPages)}
                    className="relative inline-flex items-center px-4 py-2 border text-sm font-medium bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                >
                    {totalPages}
                </button>
            );
        }

        return (
            <div className="flex justify-center mt-6">
                <nav className="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
                    {/* Nút Previous */}
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
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
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </nav>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-6">{pageTitle}</h2>

            {/* Tùy chọn tìm kiếm và sắp xếp */}
            {!loading && applicants.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    {/* Tìm kiếm */}
                    <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                placeholder="Tìm theo tên ứng viên hoặc công việc..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Tìm kiếm
                        </button>
                        {searchKeyword && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                            >
                                Xóa
                            </button>
                        )}
                    </form>

                    {/* Tùy chọn sắp xếp */}
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                            {/* Sắp xếp theo */}
                            <div>
                                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                                    Sắp xếp theo
                                </label>
                                <select
                                    id="sortBy"
                                    name="sortBy"
                                    value={sortParams.sortBy}
                                    onChange={handleSortChange}
                                    className="w-full border border-gray-300 rounded-md py-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="createdAt">Ngày nộp đơn</option>
                                    <option value="status">Trạng thái</option>
                                    <option value="userName">Tên ứng viên</option>
                                    <option value="jobTitle">Tên công việc</option>
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
                                    value={sortParams.sortOrder}
                                    onChange={handleSortChange}
                                    className="w-full border border-gray-300 rounded-md py-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="desc">Giảm dần</option>
                                    <option value="asc">Tăng dần</option>
                                </select>
                            </div>
                        </div>

                        {/* Nút đặt lại sắp xếp */}
                        <button
                            type="button"
                            onClick={handleResetSort}
                            className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors md:mb-1"
                        >
                            <RefreshCw size={16} />
                            Đặt lại sắp xếp
                        </button>
                    </div>
                </div>
            )}

            {/* Hiển thị thông tin sắp xếp và kết quả tìm kiếm */}
            {!loading && (
                <div className="mb-3 flex flex-wrap gap-2 items-center">
                    {sortParams.sortBy && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            Sắp xếp theo: {getSortByDisplayName(sortParams.sortBy)} - {sortParams.sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
                        </span>
                    )}

                    {submittedKeyword && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                            Tìm kiếm: "{submittedKeyword}" ({totalItems} kết quả)
                        </span>
                    )}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64"><Loading /></div>
            ) : applicants.length === 0 ? (
                <div className="flex items-center justify-center h-[50vh]">
                    <p className="text-xl text-gray-500">
                        {submittedKeyword
                            ? `Không tìm thấy ứng viên nào phù hợp với từ khóa "${submittedKeyword}"`
                            : jobId ? "Chưa có ứng viên nào cho công việc này." : "Không có đơn ứng tuyển nào."}
                    </p>
                </div>
            ) : (
                <div>
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="w-full bg-white border border-gray-200 max-sm:text-sm font-['Inter']">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">#</th>
                                    <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Ứng viên</th>
                                    <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider max-sm:hidden">Công việc</th>
                                    <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider max-sm:hidden">Ngày nộp</th>
                                    <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">CV</th>
                                    <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Trạng thái</th>
                                    <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {applicants.map((applicant, index) => (
                                    <React.Fragment key={applicant._id}>
                                        <tr className={`hover:bg-gray-50 ${expandedRow === applicant._id ? 'bg-blue-50' : ''}`}>
                                            <td className="py-2 px-4 border-b border-gray-200">
                                                {(currentPage - 1) * itemsPerPage + index + 1}
                                            </td>
                                            <td className="py-2 px-4 border-b border-gray-200">
                                                <div className="flex items-center">
                                                    <img
                                                        className="h-10 w-10 rounded-full mr-3 object-cover"
                                                        src={
                                                            imageErrors[applicant._id]
                                                                ? '/default-avatar.jpg'
                                                                : applicant.userId?.image || applicant.userId?.avatar || '/default-avatar.jpg'
                                                        }
                                                        alt={applicant.userId?.name}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            setImageErrors(prev => ({
                                                                ...prev,
                                                                [applicant._id]: true
                                                            }));
                                                            e.target.src = '/default-avatar.jpg';
                                                        }}
                                                    />
                                                    <div>
                                                        <div className="font-medium">
                                                            {applicant.basicInfo?.fullName || applicant.userId?.name || 'N/A'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {applicant.basicInfo?.email || applicant.userId?.email || 'N/A'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {applicant.basicInfo?.phoneNumber || applicant.userId?.phone || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-2 px-4 border-b border-gray-200 max-sm:hidden">
                                                {applicant.jobId?.title || 'N/A'}
                                                <div className="text-sm text-gray-500">{applicant.jobId?.location || 'N/A'}</div>
                                            </td>
                                            <td className="py-2 px-4 border-b border-gray-200 max-sm:hidden">
                                                {formatDate(applicant.date)}
                                            </td>
                                            <td className="py-2 px-4 border-b border-gray-200">
                                                {(applicant.basicInfo?.resumeUrl || applicant.userId?.resume) ? (
                                                    <a
                                                        href={applicant.basicInfo?.resumeUrl || applicant.userId?.resume}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded inline-flex gap-1 items-center text-xs font-medium">
                                                        Xem CV <FileText size={14} />
                                                    </a>
                                                ) : (
                                                    <span className='text-xs text-gray-400'>Chưa có</span>
                                                )}
                                            </td>
                                            <td className="py-2 px-4 border-b border-gray-200">
                                                {renderStatusBadge(applicant.status)}
                                            </td>
                                            <td className="py-2 px-4 border-b border-gray-200 relative">
                                                <div className="flex items-center justify-start gap-3">
                                                    {/* Nút Xem chi tiết (toggle) */}
                                                    <button
                                                        onClick={() => toggleApplicantDetails(applicant._id)}
                                                        className={`text-indigo-600 hover:text-indigo-900 flex items-center`}
                                                        title={`${expandedRow === applicant._id ? 'Ẩn' : 'Xem'} chi tiết ${applicant.basicInfo?.fullName || applicant.userId?.name}`}
                                                    >
                                                        {expandedRow === applicant._id ? (
                                                            <ChevronUp size={18} />
                                                        ) : (
                                                            <ChevronDown size={18} />
                                                        )}
                                                    </button>

                                                    {/* Nút Gửi Email */}
                                                    <a
                                                        href={`mailto:${applicant.basicInfo?.email || applicant.userId?.email}`}
                                                        className="text-gray-500 hover:text-blue-600"
                                                        title={`Gửi email tới ${applicant.basicInfo?.fullName || applicant.userId?.name}`}
                                                        onClick={(e) => {
                                                            if (!applicant.basicInfo?.email && !applicant.userId?.email) e.preventDefault()
                                                        }}
                                                    >
                                                        <Mail size={18} />
                                                    </a>

                                                    {/* Dropdown cập nhật status */}
                                                    <select
                                                        value={applicant.status || 'pending'}
                                                        onChange={(e) => updateApplicationStatus(applicant._id, e.target.value)}
                                                        disabled={statusUpdating}
                                                        className={`text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 ${statusUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        title="Thay đổi trạng thái"
                                                    >
                                                        <option value="pending">Chờ duyệt</option>
                                                        <option value="viewed">Đã xem</option>
                                                        <option value="shortlisted">Phù hợp</option>
                                                        <option value="interviewing">Phỏng vấn</option>
                                                        <option value="hired">Đã tuyển</option>
                                                        <option value="rejected">Từ chối</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Expanded Detail Row - giữ nguyên */}
                                        {expandedRow === applicant._id && (
                                            <tr>
                                                <td colSpan="7" className="p-0 border-b border-gray-200">
                                                    {detailLoading ? (
                                                        <div className="flex justify-center items-center p-8">
                                                            <Loading />
                                                        </div>
                                                    ) : selectedApplicant ? (
                                                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                                                {/* Cột thông tin cá nhân */}
                                                                <div className="md:col-span-4 bg-white rounded-lg shadow p-4 border border-gray-200">
                                                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                                        </svg>
                                                                        Thông tin ứng viên
                                                                    </h3>

                                                                    <div className="space-y-4">
                                                                        <div className="flex items-center gap-3 mb-4">
                                                                            <img
                                                                                src={selectedApplicant.userId?.image || selectedApplicant.userId?.avatar || '/default-avatar.jpg'}
                                                                                alt="Profile"
                                                                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                                                                onError={(e) => {
                                                                                    e.target.onerror = null;
                                                                                    e.target.src = '/default-avatar.jpg';
                                                                                }}
                                                                            />
                                                                            <div>
                                                                                <h4 className="font-semibold text-gray-800">
                                                                                    {selectedApplicant.basicInfo?.fullName || selectedApplicant.userId?.name || 'N/A'}
                                                                                </h4>
                                                                                <p className="text-sm text-gray-600">
                                                                                    Ứng tuyển: {selectedApplicant.jobId?.title || 'N/A'}
                                                                                </p>
                                                                                <p className="text-sm text-gray-500">
                                                                                    {formatDate(selectedApplicant.date)}
                                                                                </p>
                                                                            </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-1 gap-3">
                                                                            <div className="flex items-start">
                                                                                <Mail className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
                                                                                <div>
                                                                                    <p className="text-xs text-gray-500">Email</p>
                                                                                    <p className="font-medium text-gray-800 break-all">
                                                                                        {selectedApplicant.basicInfo?.email || selectedApplicant.userId?.email || 'N/A'}
                                                                                    </p>
                                                                                </div>
                                                                            </div>

                                                                            <div className="flex items-start">
                                                                                <Phone className="text-green-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
                                                                                <div>
                                                                                    <p className="text-xs text-gray-500">Số điện thoại</p>
                                                                                    <p className="font-medium text-gray-800">
                                                                                        {selectedApplicant.basicInfo?.phoneNumber || selectedApplicant.userId?.phone || 'N/A'}
                                                                                    </p>
                                                                                </div>
                                                                            </div>

                                                                            {selectedApplicant.basicInfo?.birthYear && (
                                                                                <div className="flex items-start">
                                                                                    <Calendar className="text-red-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
                                                                                    <div>
                                                                                        <p className="text-xs text-gray-500">Năm sinh</p>
                                                                                        <p className="font-medium text-gray-800">
                                                                                            {selectedApplicant.basicInfo.birthYear}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            {selectedApplicant.basicInfo?.education && (
                                                                                <div className="flex items-start">
                                                                                    <Award className="text-purple-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
                                                                                    <div>
                                                                                        <p className="text-xs text-gray-500">Trình độ học vấn</p>
                                                                                        <p className="font-medium text-gray-800">
                                                                                            {selectedApplicant.basicInfo.education}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            {selectedApplicant.jobId?.location && (
                                                                                <div className="flex items-start">
                                                                                    <MapPin className="text-indigo-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
                                                                                    <div>
                                                                                        <p className="text-xs text-gray-500">Địa điểm làm việc</p>
                                                                                        <p className="font-medium text-gray-800">
                                                                                            {selectedApplicant.jobId.location}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {/* CV Download */}
                                                                        <div className="mt-4 pt-4 border-t">
                                                                            {(selectedApplicant.basicInfo?.resumeUrl || selectedApplicant.userId?.resume) ? (
                                                                                <a
                                                                                    href={selectedApplicant.basicInfo?.resumeUrl || selectedApplicant.userId?.resume}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="w-full bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                                                                                >
                                                                                    <FileText size={16} />
                                                                                    Xem CV đầy đủ
                                                                                </a>
                                                                            ) : (
                                                                                <div className="text-center p-3 border border-dashed rounded text-gray-500 bg-gray-50">
                                                                                    Ứng viên chưa tải lên CV
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Cột thư xin việc và thông tin bổ sung */}
                                                                <div className="md:col-span-8 space-y-4">
                                                                    {/* Thư xin việc */}
                                                                    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                                                                        <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2 flex items-center gap-2">
                                                                            <Briefcase className="text-blue-600" size={18} />
                                                                            Thư xin việc
                                                                        </h3>

                                                                        {selectedApplicant.basicInfo?.coverLetter ? (
                                                                            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap bg-white p-3 rounded">
                                                                                {selectedApplicant.basicInfo.coverLetter}
                                                                            </div>
                                                                        ) : (
                                                                            <div className="bg-gray-50 p-4 rounded text-center text-gray-500 italic border border-dashed">
                                                                                Ứng viên không gửi thư xin việc
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Chi tiết công việc và hành động */}
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        {/* Chi tiết công việc */}
                                                                        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                                                                            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2 flex items-center gap-2">
                                                                                <Briefcase className="text-blue-600" size={18} />
                                                                                Chi tiết công việc
                                                                            </h3>

                                                                            {selectedApplicant.jobId && (
                                                                                <div className="grid grid-cols-1 gap-2 text-sm">
                                                                                    <div>
                                                                                        <span className="text-gray-600">Vị trí:</span>{' '}
                                                                                        <span className="font-medium text-gray-800">{selectedApplicant.jobId.title}</span>
                                                                                    </div>
                                                                                    {selectedApplicant.jobId.category && (
                                                                                        <div>
                                                                                            <span className="text-gray-600">Danh mục:</span>{' '}
                                                                                            <span className="font-medium text-gray-800">{selectedApplicant.jobId.category}</span>
                                                                                        </div>
                                                                                    )}
                                                                                    {selectedApplicant.jobId.type && (
                                                                                        <div>
                                                                                            <span className="text-gray-600">Loại hình:</span>{' '}
                                                                                            <span className="font-medium text-gray-800">{selectedApplicant.jobId.type}</span>
                                                                                        </div>
                                                                                    )}
                                                                                    {selectedApplicant.companyId?.name && (
                                                                                        <div>
                                                                                            <span className="text-gray-600">Công ty:</span>{' '}
                                                                                            <span className="font-medium text-gray-800">{selectedApplicant.companyId.name}</span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {/* Phần hành động - THIẾT KẾ LẠI */}
                                                                        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                                                                            <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2 flex items-center gap-2">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                                                </svg>
                                                                                Liên hệ ứng viên
                                                                            </h3>

                                                                            <div className="space-y-4">
                                                                                <div className="flex flex-col gap-2">
                                                                                    <p className="text-sm text-gray-600">
                                                                                        Trạng thái hiện tại: <span className="font-semibold">{renderStatusBadge(selectedApplicant.status)}</span>
                                                                                    </p>

                                                                                    <p className="text-sm text-gray-600 mt-1">
                                                                                        Bạn có thể liên hệ với ứng viên qua các phương thức sau:
                                                                                    </p>
                                                                                </div>

                                                                                <div className="flex gap-2 pt-3">
                                                                                    <a
                                                                                        href={`mailto:${selectedApplicant.basicInfo?.email || selectedApplicant.userId?.email}`}
                                                                                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-1 hover:bg-blue-700 transition-colors"
                                                                                        onClick={(e) => {
                                                                                            if (!selectedApplicant.basicInfo?.email && !selectedApplicant.userId?.email) {
                                                                                                e.preventDefault();
                                                                                                toast.error('Không có địa chỉ email');
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        <Mail size={16} />
                                                                                        Gửi Email
                                                                                    </a>
                                                                                </div>

                                                                                <div className="text-sm text-gray-500 mt-2">
                                                                                    <p className="mb-1 font-medium">Mẹo:</p>
                                                                                    <ul className="list-disc list-inside space-y-1 pl-2">
                                                                                        <li>Tham khảo CV trước khi liên hệ</li>
                                                                                        <li>Nêu rõ lịch phỏng vấn trong email</li>
                                                                                        <li>Thông báo cho ứng viên chi tiết về quy trình tuyển dụng</li>
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="p-8 text-center text-gray-500">
                                                            Không thể tải thông tin chi tiết ứng viên
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Phân trang và tùy chọn hiển thị */}
                    {totalPages > 0 && (
                        <div className="flex justify-between items-center mt-6">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>Hiển thị</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => handleItemsPerPageChange(e.target.value)}
                                    className="border rounded px-2 py-1 text-sm"
                                >
                                    {itemsPerPageOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                <span>mục mỗi trang | Tổng cộng: {totalItems} ứng viên</span>
                            </div>

                            {/* Phân trang */}
                            {totalPages > 1 && renderPagination()}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ViewApplications;
// import React, { useContext, useEffect, useState, useCallback } from "react";
// import { useParams, Link } from 'react-router-dom';
// import { AppContext } from "../context/AppContext";
// import axios from "axios";
// import { toast } from "react-toastify";
// import Loading from "../components/Loading";
// import { Eye, Mail, FileText, Calendar, MapPin, Briefcase, Award, Clock, ChevronDown, ChevronUp, Phone } from 'lucide-react';

// // Helper render status (giữ nguyên)
// const renderStatusBadge = (status) => {
//     let colorClasses = 'bg-gray-100 text-gray-800';
//     let displayText = 'N/A';

//     switch (status?.toLowerCase()) {
//         case 'pending':
//             colorClasses = 'bg-yellow-100 text-yellow-800';
//             displayText = 'Chờ duyệt';
//             break;
//         case 'viewed':
//             colorClasses = 'bg-blue-100 text-blue-800';
//             displayText = 'Đã xem';
//             break;
//         case 'shortlisted':
//             colorClasses = 'bg-purple-100 text-purple-800';
//             displayText = 'Phù hợp';
//             break;
//         case 'interviewing':
//             colorClasses = 'bg-cyan-100 text-cyan-800';
//             displayText = 'Phỏng vấn';
//             break;
//         case 'hired':
//         case 'accepted':
//             colorClasses = 'bg-green-100 text-green-800';
//             displayText = 'Đã tuyển';
//             break;
//         case 'rejected':
//             colorClasses = 'bg-red-100 text-red-800';
//             displayText = 'Từ chối';
//             break;
//         default:
//             displayText = status ? (status.charAt(0).toUpperCase() + status.slice(1)) : 'N/A';
//             break;
//     }
//     return (
//         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses}`}>
//             {displayText}
//         </span>
//     );
// };

// const ViewApplications = () => {
//     const { jobId } = useParams();
//     const { backendUrl, companyToken } = useContext(AppContext);
//     const [applicants, setApplicants] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [jobTitle, setJobTitle] = useState('');
//     const [imageErrors, setImageErrors] = useState({});
//     const [statusUpdating, setStatusUpdating] = useState(false);

//     // State cho chi tiết ứng viên và expanded row
//     const [expandedRow, setExpandedRow] = useState(null);
//     const [selectedApplicant, setSelectedApplicant] = useState(null);
//     const [detailLoading, setDetailLoading] = useState(false);
//     const [searchKeyword, setSearchKeyword] = useState('');
//     const [submittedKeyword, setSubmittedKeyword] = useState('');
//     // Phân trang
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage, setItemsPerPage] = useState(10);
//     const [totalPages, setTotalPages] = useState(1);
//     const [totalItems, setTotalItems] = useState(0);
//     const itemsPerPageOptions = [5, 10, 20, 50];

//     // Fetch dữ liệu
//     const fetchData = useCallback(async () => {
//         if (!companyToken) {
//             console.log('No company token found');
//             return;
//         }
//         setLoading(true);

//         try {
//             // Thay đổi 1: Tạo URL đúng cho API với tham số phân trang
//             let apiUrl;
//             if (jobId) {
//                 apiUrl = `${backendUrl}/api/companies/jobs/${jobId}/applicants`;
//             } else {
//                 apiUrl = `${backendUrl}/api/companies/all-applications`;
//             }

//             // Đảm bảo thêm tham số page và limit cho backend xử lý phân trang
//             let paginatedUrl = `${apiUrl}?page=${currentPage}&limit=${itemsPerPage}`;

//             console.log('Fetching from URL:', paginatedUrl);

//             if (submittedKeyword.trim()) {
//                 paginatedUrl += `&keyword=${encodeURIComponent(submittedKeyword.trim())}`;
//             }

//             const { data } = await axios.get(paginatedUrl, {
//                 headers: {
//                     'Authorization': `Bearer ${companyToken}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             console.log('API Response:', data);

//             if (data.success) {
//                 setApplicants(data.applications || []);

//                 // Thay đổi 2: Cập nhật lại cách xử lý phân trang từ response
//                 if (data.pagination) {
//                     console.log('Pagination data:', data.pagination);
//                     setTotalPages(data.pagination.pages || 1);
//                     setTotalItems(data.pagination.total || 0);
//                 } else {
//                     console.log('No pagination data, setting defaults');
//                     setTotalPages(1);
//                     setTotalItems(data.applications?.length || 0);
//                 }

//                 if (jobId && data.jobTitle) {
//                     setJobTitle(data.jobTitle);
//                 }
//             } else {
//                 toast.error(data.message || "Không thể tải dữ liệu ứng viên");
//                 setApplicants([]);
//                 setTotalPages(1);
//                 setTotalItems(0);
//             }
//         } catch (error) {
//             console.error('Error details:', error);
//             setApplicants([]);
//             setTotalPages(1);
//             setTotalItems(0);
//             toast.error(error.response?.data?.message || "Lỗi khi tải dữ liệu ứng viên");
//         } finally {
//             setLoading(false);
//         }
//     }, [jobId, companyToken, backendUrl, currentPage, itemsPerPage, submittedKeyword]);

//     const handleSearch = (e) => {
//         e.preventDefault();
//         setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
//         setSubmittedKeyword(searchKeyword); // Cập nhật từ khóa đã gửi
//     };
//     const handleClearSearch = () => {
//         setSearchKeyword('');
//         setSubmittedKeyword(''); // Xóa cả từ khóa đã gửi
//         setCurrentPage(1);
//     };
//     // Hàm cập nhật trạng thái
//     const updateApplicationStatus = async (applicationId, newStatus) => {
//         // Tránh nhiều lần gọi API cùng lúc
//         if (statusUpdating) return;

//         const currentApp = applicants.find(app => app._id === applicationId);
//         if (!currentApp) return;
//         const oldStatus = currentApp.status;

//         // Optimistic Update
//         setApplicants(prev => prev.map(app =>
//             app._id === applicationId ? { ...app, status: newStatus } : app
//         ));

//         // Nếu đang xem chi tiết, cập nhật cả state selectedApplicant
//         if (selectedApplicant && selectedApplicant._id === applicationId) {
//             setSelectedApplicant({
//                 ...selectedApplicant,
//                 status: newStatus
//             });
//         }

//         setStatusUpdating(true);

//         try {
//             if (!companyToken) {
//                 toast.error("Vui lòng đăng nhập lại");
//                 throw new Error("Missing token");
//             }

//             const { data } = await axios.patch(
//                 `${backendUrl}/api/companies/applications/${applicationId}/status`,
//                 { status: newStatus },
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${companyToken}`,
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );

//             if (data.success) {
//                 toast.success("Cập nhật trạng thái thành công");
//             } else {
//                 // Rollback if API returns error
//                 setApplicants(prev => prev.map(app =>
//                     app._id === applicationId ? { ...app, status: oldStatus } : app
//                 ));

//                 if (selectedApplicant && selectedApplicant._id === applicationId) {
//                     setSelectedApplicant({
//                         ...selectedApplicant,
//                         status: oldStatus
//                     });
//                 }

//                 toast.error(data.message || "Cập nhật thất bại");
//             }
//         } catch (error) {
//             console.error("Error updating status:", error);
//             // Rollback on error
//             setApplicants(prev => prev.map(app =>
//                 app._id === applicationId ? { ...app, status: oldStatus } : app
//             ));

//             if (selectedApplicant && selectedApplicant._id === applicationId) {
//                 setSelectedApplicant({
//                     ...selectedApplicant,
//                     status: oldStatus
//                 });
//             }

//             if (error.response?.status === 401) {
//                 toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
//             } else {
//                 toast.error(error.response?.data?.message || "Lỗi cập nhật trạng thái");
//             }
//         } finally {
//             setStatusUpdating(false);
//         }
//     };

//     // Xử lý thay đổi số item/trang
//     const handleItemsPerPageChange = (newValue) => {
//         console.log('Changing items per page to:', newValue);
//         setItemsPerPage(parseInt(newValue));
//         setCurrentPage(1); // Reset về trang 1 khi thay đổi số item/trang
//     };

//     // Hàm hiển thị thông tin chi tiết ứng viên (đã cập nhật)
//     const toggleApplicantDetails = async (applicantId) => {
//         // Nếu đang mở row này, đóng lại
//         if (expandedRow === applicantId) {
//             setExpandedRow(null);
//             return;
//         }

//         // Mở row mới và tải dữ liệu
//         setExpandedRow(applicantId);

//         const applicant = applicants.find(app => app._id === applicantId);
//         if (!applicant) return;

//         setDetailLoading(true);

//         try {
//             // Gọi API để lấy chi tiết đơn ứng tuyển
//             const { data } = await axios.get(
//                 `${backendUrl}/api/companies/applications/${applicantId}/detail`,
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${companyToken}`,
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );

//             if (data.success) {
//                 console.log("Thông tin chi tiết ứng viên:", data.application);

//                 // Lưu trạng thái trước đó
//                 const previousStatus = data.application.status;

//                 // Cập nhật state với thông tin chi tiết
//                 setSelectedApplicant(data.application);

//                 // Nếu trạng thái là 'pending', cập nhật thành 'viewed'
//                 if (previousStatus === 'pending') {
//                     // Cập nhật cả trong state và gọi API
//                     updateApplicationStatus(applicantId, 'viewed');
//                 }
//             } else {
//                 toast.error(data.message || "Không thể tải thông tin chi tiết");
//                 // Fallback to local data
//                 setSelectedApplicant(applicant);
//             }
//         } catch (error) {
//             console.error('Error fetching application detail:', error);
//             toast.error(error.response?.data?.message || "Lỗi khi tải thông tin chi tiết");
//             // Fallback to local data
//             setSelectedApplicant(applicant);
//         } finally {
//             setDetailLoading(false);
//         }
//     };

//     // Debug logging
//     useEffect(() => {
//         console.log('Current render state:', {
//             currentPage,
//             itemsPerPage,
//             totalPages,
//             totalItems,
//             applicantsShown: applicants.length
//         });
//     }, [applicants, currentPage, itemsPerPage, totalPages, totalItems]);

//     useEffect(() => {
//         // Reset expandedRow khi chuyển trang để tránh lỗi
//         setExpandedRow(null);

//         // Fetch dữ liệu khi currentPage hoặc itemsPerPage thay đổi
//         fetchData();
//     }, [fetchData, currentPage, itemsPerPage]);

//     // Tiêu đề trang
//     const pageTitle = jobId ? `Ứng viên cho công việc: ${jobTitle || '...'}` : "Tất cả Đơn ứng tuyển";

//     // Format date với định dạng đẹp hơn
//     const formatDate = (dateString) => {
//         if (!dateString) return 'N/A';
//         return new Date(dateString).toLocaleDateString('vi-VN', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//         });
//     };

//     // Hiển thị phân trang tối ưu
//     const renderPagination = () => {
//         // Nếu tổng số trang <= 1, không hiển thị phân trang
//         if (totalPages <= 1) return null;

//         // Hiển thị tối đa 5 nút trang
//         const maxVisiblePages = 5;
//         let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//         let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

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
//                     onClick={() => setCurrentPage(1)}
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
//                     onClick={() => setCurrentPage(i)}
//                     className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                         }`}
//                 >
//                     {i}
//                 </button>
//             );
//         }

//         // "..." và nút trang cuối
//         if (endPage < totalPages) {
//             if (endPage < totalPages - 1) {
//                 pageButtons.push(
//                     <span key="dots2" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
//                         ...
//                     </span>
//                 );
//             }

//             pageButtons.push(
//                 <button
//                     key="last"
//                     onClick={() => setCurrentPage(totalPages)}
//                     className="relative inline-flex items-center px-4 py-2 border text-sm font-medium bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
//                 >
//                     {totalPages}
//                 </button>
//             );
//         }

//         return (
//             <div className="flex justify-center mt-6">
//                 <nav className="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
//                     {/* Nút Previous */}
//                     <button
//                         onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                         disabled={currentPage === 1}
//                         className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
//                             }`}
//                     >
//                         <span className="sr-only">Previous</span>
//                         <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                             <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//                         </svg>
//                     </button>

//                     {/* Các nút trang */}
//                     {pageButtons}

//                     {/* Nút Next */}
//                     <button
//                         onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                         disabled={currentPage === totalPages}
//                         className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
//                             }`}
//                     >
//                         <span className="sr-only">Next</span>
//                         <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                             <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//                         </svg>
//                     </button>
//                 </nav>
//             </div>
//         );
//     };

//     return (
//         <div className="container mx-auto p-4">
//             <h2 className="text-2xl font-semibold mb-6">{pageTitle}</h2>

//             {/* Thêm form tìm kiếm ở đây */}
//             {!loading && applicants.length > 0 && (
//                 <div className="mb-4">
//                     <form onSubmit={handleSearch} className="flex gap-2">
//                         <div className="relative flex-grow">
//                             <input
//                                 type="text"
//                                 value={searchKeyword}
//                                 onChange={(e) => setSearchKeyword(e.target.value)}
//                                 placeholder="Tìm theo tên ứng viên hoặc công việc..."
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
//                             />
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                 </svg>
//                             </div>
//                         </div>
//                         <button
//                             type="submit"
//                             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
//                         >
//                             Tìm kiếm
//                         </button>
//                         {searchKeyword && (
//                             <button
//                                 type="button"
//                                 onClick={handleClearSearch}
//                                 className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
//                             >
//                                 Xóa
//                             </button>
//                         )}
//                     </form>
//                 </div>
//             )}

//             {/* Phần UI hiển thị kết quả tìm kiếm */}
//             {submittedKeyword && !loading && (
//                 <div className="mb-3 flex justify-between items-center">
//                     <p className="text-sm text-gray-600">
//                         {totalItems} ứng viên phù hợp với từ khóa "{submittedKeyword}"
//                     </p>
//                 </div>
//             )}

//             {loading ? (
//                 <div className="flex justify-center items-center h-64"><Loading /></div>
//             ) : applicants.length === 0 ? (
//                 <div className="flex items-center justify-center h-[50vh]">
//                     <p className="text-xl text-gray-500">
//                         {/* {jobId ? "Chưa có ứng viên nào cho công việc này." : "Không có đơn ứng tuyển nào."} */}
//                         {submittedKeyword
//                             ? `Không tìm thấy ứng viên nào phù hợp với từ khóa "${submittedKeyword}"`
//                             : jobId ? "Chưa có ứng viên nào cho công việc này." : "Không có đơn ứng tuyển nào."}
//                     </p>
//                 </div>
//             ) : (
//                 <div>
//                     <div className="bg-white rounded-lg shadow overflow-x-auto">
//                         <table className="w-full bg-white border border-gray-200 max-sm:text-sm font-['Inter']">
//                             <thead>
//                                 <tr className="border-b bg-gray-50">
//                                     <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">#</th>
//                                     <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Ứng viên</th>
//                                     <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider max-sm:hidden">Công việc</th>
//                                     <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider max-sm:hidden">Ngày nộp</th>
//                                     <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">CV</th>
//                                     <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Trạng thái</th>
//                                     <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Hành động</th>
//                                 </tr>
//                             </thead>

//                             <tbody className="divide-y divide-gray-200">
//                                 {applicants.map((applicant, index) => (
//                                     <React.Fragment key={applicant._id}>
//                                         <tr className={`hover:bg-gray-50 ${expandedRow === applicant._id ? 'bg-blue-50' : ''}`}>
//                                             <td className="py-2 px-4 border-b border-gray-200">
//                                                 {(currentPage - 1) * itemsPerPage + index + 1}
//                                             </td>
//                                             <td className="py-2 px-4 border-b border-gray-200">
//                                                 <div className="flex items-center">
//                                                     <img
//                                                         className="h-10 w-10 rounded-full mr-3 object-cover"
//                                                         src={
//                                                             imageErrors[applicant._id]
//                                                                 ? '/default-avatar.jpg'
//                                                                 : applicant.userId?.image || applicant.userId?.avatar || '/default-avatar.jpg'
//                                                         }
//                                                         alt={applicant.userId?.name}
//                                                         onError={(e) => {
//                                                             e.target.onerror = null;
//                                                             setImageErrors(prev => ({
//                                                                 ...prev,
//                                                                 [applicant._id]: true
//                                                             }));
//                                                             e.target.src = '/default-avatar.jpg';
//                                                         }}
//                                                     />
//                                                     <div>
//                                                         <div className="font-medium">
//                                                             {applicant.basicInfo?.fullName || applicant.userId?.name || 'N/A'}
//                                                         </div>
//                                                         <div className="text-sm text-gray-500">
//                                                             {applicant.basicInfo?.email || applicant.userId?.email || 'N/A'}
//                                                         </div>
//                                                         <div className="text-sm text-gray-500">
//                                                             {applicant.basicInfo?.phoneNumber || applicant.userId?.phone || 'N/A'}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                             <td className="py-2 px-4 border-b border-gray-200 max-sm:hidden">
//                                                 {applicant.jobId?.title || 'N/A'}
//                                                 <div className="text-sm text-gray-500">{applicant.jobId?.location || 'N/A'}</div>
//                                             </td>
//                                             <td className="py-2 px-4 border-b border-gray-200 max-sm:hidden">
//                                                 {formatDate(applicant.date)}
//                                             </td>
//                                             <td className="py-2 px-4 border-b border-gray-200">
//                                                 {(applicant.basicInfo?.resumeUrl || applicant.userId?.resume) ? (
//                                                     <a
//                                                         href={applicant.basicInfo?.resumeUrl || applicant.userId?.resume}
//                                                         target="_blank"
//                                                         rel="noopener noreferrer"
//                                                         className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded inline-flex gap-1 items-center text-xs font-medium">
//                                                         Xem CV <FileText size={14} />
//                                                     </a>
//                                                 ) : (
//                                                     <span className='text-xs text-gray-400'>Chưa có</span>
//                                                 )}
//                                             </td>
//                                             <td className="py-2 px-4 border-b border-gray-200">
//                                                 {renderStatusBadge(applicant.status)}
//                                             </td>
//                                             <td className="py-2 px-4 border-b border-gray-200 relative">
//                                                 <div className="flex items-center justify-start gap-3">
//                                                     {/* Nút Xem chi tiết (toggle) */}
//                                                     <button
//                                                         onClick={() => toggleApplicantDetails(applicant._id)}
//                                                         className={`text-indigo-600 hover:text-indigo-900 flex items-center`}
//                                                         title={`${expandedRow === applicant._id ? 'Ẩn' : 'Xem'} chi tiết ${applicant.basicInfo?.fullName || applicant.userId?.name}`}
//                                                     >
//                                                         {expandedRow === applicant._id ? (
//                                                             <ChevronUp size={18} />
//                                                         ) : (
//                                                             <ChevronDown size={18} />
//                                                         )}
//                                                     </button>

//                                                     {/* Nút Gửi Email */}
//                                                     <a
//                                                         href={`mailto:${applicant.basicInfo?.email || applicant.userId?.email}`}
//                                                         className="text-gray-500 hover:text-blue-600"
//                                                         title={`Gửi email tới ${applicant.basicInfo?.fullName || applicant.userId?.name}`}
//                                                         onClick={(e) => {
//                                                             if (!applicant.basicInfo?.email && !applicant.userId?.email) e.preventDefault()
//                                                         }}
//                                                     >
//                                                         <Mail size={18} />
//                                                     </a>

//                                                     {/* Dropdown cập nhật status */}
//                                                     <select
//                                                         value={applicant.status || 'pending'}
//                                                         onChange={(e) => updateApplicationStatus(applicant._id, e.target.value)}
//                                                         disabled={statusUpdating}
//                                                         className={`text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 ${statusUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
//                                                         title="Thay đổi trạng thái"
//                                                     >
//                                                         <option value="pending">Chờ duyệt</option>
//                                                         <option value="viewed">Đã xem</option>
//                                                         <option value="shortlisted">Phù hợp</option>
//                                                         <option value="interviewing">Phỏng vấn</option>
//                                                         <option value="hired">Đã tuyển</option>
//                                                         <option value="rejected">Từ chối</option>
//                                                     </select>
//                                                 </div>
//                                             </td>
//                                         </tr>

//                                         {/* Expanded Detail Row */}
//                                         {expandedRow === applicant._id && (
//                                             <tr>
//                                                 <td colSpan="7" className="p-0 border-b border-gray-200">
//                                                     {detailLoading ? (
//                                                         <div className="flex justify-center items-center p-8">
//                                                             <Loading />
//                                                         </div>
//                                                     ) : selectedApplicant ? (
//                                                         <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
//                                                             <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
//                                                                 {/* Cột thông tin cá nhân */}
//                                                                 <div className="md:col-span-4 bg-white rounded-lg shadow p-4 border border-gray-200">
//                                                                     <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
//                                                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
//                                                                             <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
//                                                                         </svg>
//                                                                         Thông tin ứng viên
//                                                                     </h3>

//                                                                     <div className="space-y-4">
//                                                                         <div className="flex items-center gap-3 mb-4">
//                                                                             <img
//                                                                                 src={selectedApplicant.userId?.image || selectedApplicant.userId?.avatar || '/default-avatar.jpg'}
//                                                                                 alt="Profile"
//                                                                                 className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
//                                                                                 onError={(e) => {
//                                                                                     e.target.onerror = null;
//                                                                                     e.target.src = '/default-avatar.jpg';
//                                                                                 }}
//                                                                             />
//                                                                             <div>
//                                                                                 <h4 className="font-semibold text-gray-800">
//                                                                                     {selectedApplicant.basicInfo?.fullName || selectedApplicant.userId?.name || 'N/A'}
//                                                                                 </h4>
//                                                                                 <p className="text-sm text-gray-600">
//                                                                                     Ứng tuyển: {selectedApplicant.jobId?.title || 'N/A'}
//                                                                                 </p>
//                                                                                 <p className="text-sm text-gray-500">
//                                                                                     {formatDate(selectedApplicant.date)}
//                                                                                 </p>
//                                                                             </div>
//                                                                         </div>

//                                                                         <div className="grid grid-cols-1 gap-3">
//                                                                             <div className="flex items-start">
//                                                                                 <Mail className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
//                                                                                 <div>
//                                                                                     <p className="text-xs text-gray-500">Email</p>
//                                                                                     <p className="font-medium text-gray-800 break-all">
//                                                                                         {selectedApplicant.basicInfo?.email || selectedApplicant.userId?.email || 'N/A'}
//                                                                                     </p>
//                                                                                 </div>
//                                                                             </div>

//                                                                             <div className="flex items-start">
//                                                                                 <Phone className="text-green-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
//                                                                                 <div>
//                                                                                     <p className="text-xs text-gray-500">Số điện thoại</p>
//                                                                                     <p className="font-medium text-gray-800">
//                                                                                         {selectedApplicant.basicInfo?.phoneNumber || selectedApplicant.userId?.phone || 'N/A'}
//                                                                                     </p>
//                                                                                 </div>
//                                                                             </div>

//                                                                             {selectedApplicant.basicInfo?.birthYear && (
//                                                                                 <div className="flex items-start">
//                                                                                     <Calendar className="text-red-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
//                                                                                     <div>
//                                                                                         <p className="text-xs text-gray-500">Năm sinh</p>
//                                                                                         <p className="font-medium text-gray-800">
//                                                                                             {selectedApplicant.basicInfo.birthYear}
//                                                                                         </p>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             )}

//                                                                             {selectedApplicant.basicInfo?.education && (
//                                                                                 <div className="flex items-start">
//                                                                                     <Award className="text-purple-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
//                                                                                     <div>
//                                                                                         <p className="text-xs text-gray-500">Trình độ học vấn</p>
//                                                                                         <p className="font-medium text-gray-800">
//                                                                                             {selectedApplicant.basicInfo.education}
//                                                                                         </p>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             )}

//                                                                             {selectedApplicant.jobId?.location && (
//                                                                                 <div className="flex items-start">
//                                                                                     <MapPin className="text-indigo-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
//                                                                                     <div>
//                                                                                         <p className="text-xs text-gray-500">Địa điểm làm việc</p>
//                                                                                         <p className="font-medium text-gray-800">
//                                                                                             {selectedApplicant.jobId.location}
//                                                                                         </p>
//                                                                                     </div>
//                                                                                 </div>
//                                                                             )}
//                                                                         </div>

//                                                                         {/* CV Download */}
//                                                                         <div className="mt-4 pt-4 border-t">
//                                                                             {(selectedApplicant.basicInfo?.resumeUrl || selectedApplicant.userId?.resume) ? (
//                                                                                 <a
//                                                                                     href={selectedApplicant.basicInfo?.resumeUrl || selectedApplicant.userId?.resume}
//                                                                                     target="_blank"
//                                                                                     rel="noopener noreferrer"
//                                                                                     className="w-full bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
//                                                                                 >
//                                                                                     <FileText size={16} />
//                                                                                     Xem CV đầy đủ
//                                                                                 </a>
//                                                                             ) : (
//                                                                                 <div className="text-center p-3 border border-dashed rounded text-gray-500 bg-gray-50">
//                                                                                     Ứng viên chưa tải lên CV
//                                                                                 </div>
//                                                                             )}
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>

//                                                                 {/* Cột thư xin việc và thông tin bổ sung */}
//                                                                 <div className="md:col-span-8 space-y-4">
//                                                                     {/* Thư xin việc */}
//                                                                     <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
//                                                                         <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2 flex items-center gap-2">
//                                                                             <Briefcase className="text-blue-600" size={18} />
//                                                                             Thư xin việc
//                                                                         </h3>

//                                                                         {selectedApplicant.basicInfo?.coverLetter ? (
//                                                                             <div className="prose max-w-none text-gray-700 whitespace-pre-wrap bg-white p-3 rounded">
//                                                                                 {selectedApplicant.basicInfo.coverLetter}
//                                                                             </div>
//                                                                         ) : (
//                                                                             <div className="bg-gray-50 p-4 rounded text-center text-gray-500 italic border border-dashed">
//                                                                                 Ứng viên không gửi thư xin việc
//                                                                             </div>
//                                                                         )}
//                                                                     </div>

//                                                                     {/* Chi tiết công việc và hành động */}
//                                                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                                                         {/* Chi tiết công việc */}
//                                                                         <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
//                                                                             <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2 flex items-center gap-2">
//                                                                                 <Briefcase className="text-blue-600" size={18} />
//                                                                                 Chi tiết công việc
//                                                                             </h3>

//                                                                             {selectedApplicant.jobId && (
//                                                                                 <div className="grid grid-cols-1 gap-2 text-sm">
//                                                                                     <div>
//                                                                                         <span className="text-gray-600">Vị trí:</span>{' '}
//                                                                                         <span className="font-medium text-gray-800">{selectedApplicant.jobId.title}</span>
//                                                                                     </div>
//                                                                                     {selectedApplicant.jobId.category && (
//                                                                                         <div>
//                                                                                             <span className="text-gray-600">Danh mục:</span>{' '}
//                                                                                             <span className="font-medium text-gray-800">{selectedApplicant.jobId.category}</span>
//                                                                                         </div>
//                                                                                     )}
//                                                                                     {selectedApplicant.jobId.type && (
//                                                                                         <div>
//                                                                                             <span className="text-gray-600">Loại hình:</span>{' '}
//                                                                                             <span className="font-medium text-gray-800">{selectedApplicant.jobId.type}</span>
//                                                                                         </div>
//                                                                                     )}
//                                                                                     {selectedApplicant.companyId?.name && (
//                                                                                         <div>
//                                                                                             <span className="text-gray-600">Công ty:</span>{' '}
//                                                                                             <span className="font-medium text-gray-800">{selectedApplicant.companyId.name}</span>
//                                                                                         </div>
//                                                                                     )}
//                                                                                 </div>
//                                                                             )}
//                                                                         </div>

//                                                                         {/* Phần hành động - THIẾT KẾ LẠI */}
//                                                                         <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
//                                                                             <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2 flex items-center gap-2">
//                                                                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
//                                                                                     <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//                                                                                     <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
//                                                                                 </svg>
//                                                                                 Liên hệ ứng viên
//                                                                             </h3>

//                                                                             <div className="space-y-4">
//                                                                                 <div className="flex flex-col gap-2">
//                                                                                     <p className="text-sm text-gray-600">
//                                                                                         Trạng thái hiện tại: <span className="font-semibold">{renderStatusBadge(selectedApplicant.status)}</span>
//                                                                                     </p>

//                                                                                     <p className="text-sm text-gray-600 mt-1">
//                                                                                         Bạn có thể liên hệ với ứng viên qua các phương thức sau:
//                                                                                     </p>
//                                                                                 </div>

//                                                                                 <div className="flex gap-2 pt-3">
//                                                                                     <a
//                                                                                         href={`mailto:${selectedApplicant.basicInfo?.email || selectedApplicant.userId?.email}`}
//                                                                                         className="flex-1 bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-1 hover:bg-blue-700 transition-colors"
//                                                                                         onClick={(e) => {
//                                                                                             if (!selectedApplicant.basicInfo?.email && !selectedApplicant.userId?.email) {
//                                                                                                 e.preventDefault();
//                                                                                                 toast.error('Không có địa chỉ email');
//                                                                                             }
//                                                                                         }}
//                                                                                     >
//                                                                                         <Mail size={16} />
//                                                                                         Gửi Email
//                                                                                     </a>
//                                                                                 </div>

//                                                                                 <div className="text-sm text-gray-500 mt-2">
//                                                                                     <p className="mb-1 font-medium">Mẹo:</p>
//                                                                                     <ul className="list-disc list-inside space-y-1 pl-2">
//                                                                                         <li>Tham khảo CV trước khi liên hệ</li>
//                                                                                         <li>Nêu rõ lịch phỏng vấn trong email</li>
//                                                                                         <li>Thông báo cho ứng viên chi tiết về quy trình tuyển dụng</li>
//                                                                                     </ul>
//                                                                                 </div>
//                                                                             </div>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     ) : (
//                                                         <div className="p-8 text-center text-gray-500">
//                                                             Không thể tải thông tin chi tiết ứng viên
//                                                         </div>
//                                                     )}
//                                                 </td>

//                                             </tr>
//                                         )}
//                                     </React.Fragment>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Phân trang và tùy chọn hiển thị */}
//                     {totalPages > 0 && (
//                         <div className="flex justify-between items-center mt-6">
//                             <div className="flex items-center gap-2 text-sm text-gray-600">
//                                 <span>Hiển thị</span>
//                                 <select
//                                     value={itemsPerPage}
//                                     onChange={(e) => handleItemsPerPageChange(e.target.value)}
//                                     className="border rounded px-2 py-1 text-sm"
//                                 >
//                                     {itemsPerPageOptions.map(option => (
//                                         <option key={option} value={option}>{option}</option>
//                                     ))}
//                                 </select>
//                                 <span>mục mỗi trang | Tổng cộng: {totalItems} ứng viên</span>
//                             </div>

//                             {/* Phân trang */}
//                             {totalPages > 1 && renderPagination()}
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ViewApplications;

