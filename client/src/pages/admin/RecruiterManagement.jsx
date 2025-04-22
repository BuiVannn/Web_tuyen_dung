import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { useOutletContext } from 'react-router-dom';
import DataTable from '../../components/admin/DataTable';
import Loading from '../../components/Loading';

const RecruiterManagement = () => {
    const [recruiters, setRecruiters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRecruiter, setSelectedRecruiter] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [recruiterDetail, setRecruiterDetail] = useState(null);
    const [recruiterStats, setRecruiterStats] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecruiters, setTotalRecruiters] = useState(0);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [industryFilter, setIndustryFilter] = useState('all');
    const { backendUrl } = useContext(AppContext);
    const { setHeaderTitle } = useOutletContext() || {};

    useEffect(() => {
        if (setHeaderTitle) {
            setHeaderTitle("Quản lý nhà tuyển dụng");
        }
    }, [setHeaderTitle]);

    useEffect(() => {
        if (!showDetailModal) {
            setRecruiterStats({});
        }
    }, [showDetailModal]);

    const fetchRecruiters = async (page = 1) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                toast.error("Yêu cầu xác thực Admin");
                setLoading(false);
                return;
            }

            // Tạo query parameters
            const queryParams = new URLSearchParams({
                page,
                limit: 10,
                sortBy,
                sortOrder
            }).toString();

            const response = await axios.get(`${backendUrl}/api/admin/companies?${queryParams}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setRecruiters(response.data.companies);
                setTotalPages(response.data.pagination.pages);
                setTotalRecruiters(response.data.pagination.total);
                setCurrentPage(page);
            } else {
                toast.error(response.data.message || "Không thể tải danh sách nhà tuyển dụng");
            }
        } catch (error) {
            console.error("Error fetching recruiters:", error);
            toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ");
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteRecruiter = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.delete(
                `${backendUrl}/api/admin/companies/${selectedRecruiter._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success("Đã xóa nhà tuyển dụng thành công");
                setRecruiters(recruiters.filter(recruiter => recruiter._id !== selectedRecruiter._id));
                setShowDeleteModal(false);
                setShowDetailModal(false);

                // Refresh data if the last recruiter on the page was deleted
                if (recruiters.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                    fetchRecruiters(currentPage - 1);
                }
            } else {
                toast.error(response.data.message || "Xóa nhà tuyển dụng thất bại");
            }
        } catch (error) {
            console.error("Error deleting recruiter:", error);
            toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ");
        }
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    // Get unique industries for filter
    const getUniqueIndustries = () => {
        const industries = new Set();
        recruiters.forEach(recruiter => {
            if (recruiter.industry) {
                industries.add(recruiter.industry);
            }
        });
        return Array.from(industries);
    };

    useEffect(() => {
        if (backendUrl) {
            fetchRecruiters(currentPage);
        }
    }, [backendUrl, currentPage, sortBy, sortOrder]);

    // Filter recruiters based on search term and industry filter
    const filteredRecruiters = recruiters.filter(recruiter => {
        const companyName = recruiter.name?.toLowerCase() || '';
        const email = recruiter.email?.toLowerCase() || '';
        const industry = recruiter.industry || '';
        const searchTermLower = searchTerm.toLowerCase();

        const matchesSearch = companyName.includes(searchTermLower) ||
            email.includes(searchTermLower);

        const matchesIndustry = industryFilter === 'all' ||
            industry === industryFilter;

        return matchesSearch && matchesIndustry;
    });

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Table columns configuration
    const columns = [
        {
            header: (
                <div
                    className="flex items-center cursor-pointer hover:text-blue-700"
                    onClick={() => handleSort('name')}
                >
                    <span>Tên công ty</span>
                    {sortBy === 'name' && (
                        <span className="material-icons text-sm ml-1">
                            {sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                    )}
                </div>
            ),
            accessor: 'name',
            cell: (value, row) => (
                <div className="flex items-center">
                    <div className="w-10 h-10 flex-shrink-0 mr-3 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                        {row.image ? (
                            <img src={row.image} alt={value} className="w-full h-full object-cover" />
                        ) : (
                            <span className="material-icons text-gray-400">business</span>
                        )}
                    </div>
                    <div>
                        <div className="font-medium text-gray-900">{value || "Không có tên"}</div>
                        {row.industry && <div className="text-xs text-gray-500">{row.industry}</div>}
                    </div>
                </div>
            )
        },
        {
            header: 'Email',
            accessor: 'email'
        },
        {
            header: (
                <div
                    className="flex items-center cursor-pointer hover:text-blue-700"
                    onClick={() => handleSort('createdAt')}
                >
                    <span>Ngày đăng ký</span>
                    {sortBy === 'createdAt' && (
                        <span className="material-icons text-sm ml-1">
                            {sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                    )}
                </div>
            ),
            accessor: 'createdAt',
            cell: (value) => formatDate(value)
        },
        {
            header: 'Thao tác',
            accessor: '_id',
            width: '120px',
            cell: (value, row) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => fetchRecruiterDetail(value)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-2 py-1 rounded flex items-center text-xs"
                        title="Xem chi tiết"
                    >
                        <span className="material-icons text-sm mr-1">visibility</span>
                        Xem
                    </button>
                    <button
                        onClick={() => {
                            setSelectedRecruiter(row);
                            setShowDeleteModal(true);
                        }}
                        className="bg-red-50 hover:bg-red-100 text-red-600 px-2 py-1 rounded flex items-center text-xs"
                        title="Xóa nhà tuyển dụng"
                    >
                        <span className="material-icons text-sm mr-1">delete</span>
                        Xóa
                    </button>
                </div>
            )
        }
    ];
    const [showList, setShowList] = useState(true);

    // Modify fetchRecruiterDetail
    const fetchRecruiterDetail = async (recruiterId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(
                `${backendUrl}/api/admin/companies/${recruiterId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setRecruiterDetail(response.data.company);
                setRecruiterStats(response.data.stats || {
                    jobsCount: 0,
                    activeJobsCount: 0,
                    pendingJobsCount: 0,
                    applicationsCount: 0
                });
                setShowList(false); // Hide list view, show detail view
            } else {
                toast.error(response.data.message || "Không thể tải thông tin nhà tuyển dụng");
            }
        } catch (error) {
            console.error("Error fetching recruiter details:", error);
            toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {showList ? "Quản lý nhà tuyển dụng" : (
                                <div className="flex items-center">
                                    <button
                                        onClick={() => setShowList(true)}
                                        className="mr-2 text-blue-600 hover:text-blue-800"
                                    >
                                        <span className="material-icons">arrow_back</span>
                                    </button>
                                    Chi tiết nhà tuyển dụng
                                </div>
                            )}
                        </h1>
                        {showList && <p className="text-gray-500 mt-1">Tổng số: {totalRecruiters} nhà tuyển dụng</p>}
                    </div>
                    <Link
                        to="/admin/jobs"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
                    >
                        <span className="material-icons text-sm mr-1">work</span>
                        Quản lý công việc
                    </Link>
                </div>
            </div>

            {/* Show recruiter list or detail view based on state */}
            {showList ? (
                <>
                    {/* Filter and Search */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-6/12 relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên công ty, email..."
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    search
                                </span>
                            </div>

                            <div className="w-full md:w-3/12">
                                <select
                                    value={industryFilter}
                                    onChange={(e) => setIndustryFilter(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">Tất cả ngành nghề</option>
                                    {getUniqueIndustries().map(industry => (
                                        <option key={industry} value={industry}>
                                            {industry}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-full md:w-3/12">
                                <select
                                    value={`${sortBy}:${sortOrder}`}
                                    onChange={(e) => {
                                        const [newSortBy, newSortOrder] = e.target.value.split(':');
                                        setSortBy(newSortBy);
                                        setSortOrder(newSortOrder);
                                    }}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="createdAt:desc">Mới nhất trước</option>
                                    <option value="createdAt:asc">Cũ nhất trước</option>
                                    <option value="name:asc">Tên A-Z</option>
                                    <option value="name:desc">Tên Z-A</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Recruiters Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="p-8 flex justify-center">
                                <Loading />
                            </div>
                        ) : (
                            <>
                                <DataTable
                                    columns={columns}
                                    data={filteredRecruiters}
                                    emptyMessage="Không tìm thấy nhà tuyển dụng nào phù hợp"
                                />

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between">
                                        <div className="text-sm text-gray-500 mb-3 sm:mb-0">
                                            Hiển thị <span className="font-medium">{filteredRecruiters.length}</span> trong tổng số <span className="font-medium">{totalRecruiters}</span> nhà tuyển dụng
                                        </div>
                                        <div className="flex justify-center space-x-1">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className={`px-3 py-1 rounded ${currentPage === 1
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                    }`}
                                            >
                                                <span className="material-icons text-sm">chevron_left</span>
                                            </button>
                                            {[...Array(totalPages)].map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentPage(i + 1)}
                                                    className={`px-3 py-1 rounded ${currentPage === i + 1
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                        }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className={`px-3 py-1 rounded ${currentPage === totalPages
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                    }`}
                                            >
                                                <span className="material-icons text-sm">chevron_right</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </>
            ) : (
                // Recruiter Detail View
                <>
                    {loading ? (
                        <div className="p-8 flex justify-center">
                            <Loading />
                        </div>
                    ) : recruiterDetail && (
                        <>
                            {/* Company Header */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start">
                                    <div className="flex items-center mb-4 md:mb-0">
                                        <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden mr-4 flex items-center justify-center">
                                            {recruiterDetail.image ? (
                                                <img
                                                    src={recruiterDetail.image}
                                                    alt={recruiterDetail.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="material-icons text-5xl text-gray-400">business</span>
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                                {recruiterDetail.name}
                                                {recruiterDetail.verified && (
                                                    <span className="material-icons text-blue-500 ml-2 text-xl">verified</span>
                                                )}
                                            </h2>
                                            <p className="text-gray-600 flex items-center mt-1">
                                                <span className="material-icons text-sm mr-1">email</span>
                                                {recruiterDetail.email}
                                            </p>
                                            <p className="text-gray-500 text-sm mt-1">
                                                Đăng ký: {formatDate(recruiterDetail.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedRecruiter(recruiterDetail);
                                                setShowDeleteModal(true);
                                            }}
                                            className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg flex items-center transition duration-200"
                                        >
                                            <span className="material-icons text-sm mr-1">delete</span>
                                            Xóa
                                        </button>
                                        <Link
                                            to={`/admin/jobs?company=${recruiterDetail._id}`}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition duration-200"
                                        >
                                            <span className="material-icons text-sm mr-2">work</span>
                                            Quản lý công việc
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-gray-500 text-sm">Việc làm đã đăng</p>
                                            <p className="text-2xl font-bold text-gray-800">{recruiterStats.jobsCount || 0}</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                            <span className="material-icons text-blue-600">work</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-gray-500 text-sm">Đơn ứng tuyển</p>
                                            <p className="text-2xl font-bold text-gray-800">{recruiterStats.applicationsCount || 0}</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                            <span className="material-icons text-green-600">assignment</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-emerald-500">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-gray-500 text-sm">Việc làm đang hiển thị</p>
                                            <p className="text-2xl font-bold text-gray-800">{recruiterStats.activeJobsCount || 0}</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <span className="material-icons text-emerald-600">visibility</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-amber-500">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-gray-500 text-sm">Việc làm chờ duyệt</p>
                                            <p className="text-2xl font-bold text-gray-800">{recruiterStats.pendingJobsCount || 0}</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                                            <span className="material-icons text-amber-600">pending</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Company Info */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <span className="material-icons text-blue-600 mr-2">info</span>
                                    Thông tin liên hệ
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        {recruiterDetail.website && (
                                            <div className="flex items-start">
                                                <span className="material-icons text-gray-500 mr-2">language</span>
                                                <div>
                                                    <p className="text-sm text-gray-500">Website:</p>
                                                    <a
                                                        href={recruiterDetail.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {recruiterDetail.website}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {recruiterDetail.location && (
                                            <div className="flex items-start">
                                                <span className="material-icons text-gray-500 mr-2">location_on</span>
                                                <div>
                                                    <p className="text-sm text-gray-500">Địa chỉ:</p>
                                                    <p className="text-gray-800">{recruiterDetail.location}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        {recruiterDetail.phone && (
                                            <div className="flex items-start">
                                                <span className="material-icons text-gray-500 mr-2">phone</span>
                                                <div>
                                                    <p className="text-sm text-gray-500">Số điện thoại:</p>
                                                    <p className="text-gray-800">{recruiterDetail.phone}</p>
                                                </div>
                                            </div>
                                        )}

                                        {recruiterDetail.email && (
                                            <div className="flex items-start">
                                                <span className="material-icons text-gray-500 mr-2">email</span>
                                                <div>
                                                    <p className="text-sm text-gray-500">Email:</p>
                                                    <p className="text-gray-800">{recruiterDetail.email}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Company Description */}
                            {recruiterDetail.description && (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <span className="material-icons text-green-600 mr-2">description</span>
                                        Giới thiệu công ty
                                    </h3>
                                    <div className="prose max-w-none text-gray-700">
                                        <p className="whitespace-pre-line leading-relaxed">{recruiterDetail.description}</p>
                                    </div>
                                </div>
                            )}

                            {/* Recent Jobs */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                        <span className="material-icons text-blue-600 mr-2">work</span>
                                        Việc làm gần đây
                                    </h3>
                                    <Link
                                        to={`/admin/jobs?company=${recruiterDetail._id}`}
                                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                                    >
                                        Xem tất cả
                                        <span className="material-icons text-sm ml-1">arrow_forward</span>
                                    </Link>
                                </div>

                                <div className="text-center py-6 text-gray-500">
                                    <Link
                                        to={`/admin/jobs?company=${recruiterDetail._id}`}
                                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                                    >
                                        <span className="material-icons mr-2">visibility</span>
                                        Xem danh sách công việc
                                    </Link>
                                </div>
                            </div>

                            {/* Back Button */}
                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => setShowList(true)}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition duration-200 flex items-center"
                                >
                                    <span className="material-icons text-sm mr-2">arrow_back</span>
                                    Quay lại danh sách
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}

            {/* Delete Confirmation Modal - Keep as is */}
            {showDeleteModal && selectedRecruiter && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md mx-auto">
                        <div className="flex items-center justify-center text-red-500 mb-6">
                            <span className="material-icons text-5xl">warning</span>
                        </div>
                        <h3 className="text-xl font-bold text-center mb-4">Xác nhận xóa nhà tuyển dụng</h3>
                        <p className="text-gray-600 mb-6 text-center">
                            Bạn có chắc chắn muốn xóa nhà tuyển dụng <span className="font-semibold">{selectedRecruiter.name}</span>?<br />
                            Tất cả dữ liệu liên quan đến công ty này, bao gồm việc làm và đơn ứng tuyển sẽ bị xóa vĩnh viễn. <br />
                            Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg flex-1 transition duration-200"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDeleteRecruiter}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex-1 transition duration-200"
                            >
                                Xác nhận xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default RecruiterManagement;
//     return (
//         <div className="space-y-6">
//             {/* Header Section */}
//             <div className="bg-white rounded-lg shadow-sm p-6">
//                 <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-800">Quản lý nhà tuyển dụng</h1>
//                         <p className="text-gray-500 mt-1">Tổng số: {totalRecruiters} nhà tuyển dụng</p>
//                     </div>
//                     <Link
//                         to="/admin/jobs"
//                         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
//                     >
//                         <span className="material-icons text-sm mr-1">work</span>
//                         Quản lý công việc
//                     </Link>
//                 </div>
//             </div>

//             {/* Filter and Search */}
//             <div className="bg-white rounded-lg shadow-sm p-6">
//                 <div className="flex flex-col md:flex-row gap-4">
//                     <div className="w-full md:w-6/12 relative">
//                         <input
//                             type="text"
//                             placeholder="Tìm kiếm theo tên công ty, email..."
//                             className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                         <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//                             search
//                         </span>
//                     </div>

//                     <div className="w-full md:w-3/12">
//                         <select
//                             value={industryFilter}
//                             onChange={(e) => setIndustryFilter(e.target.value)}
//                             className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         >
//                             <option value="all">Tất cả ngành nghề</option>
//                             {getUniqueIndustries().map(industry => (
//                                 <option key={industry} value={industry}>
//                                     {industry}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>

//                     <div className="w-full md:w-3/12">
//                         <select
//                             value={`${sortBy}:${sortOrder}`}
//                             onChange={(e) => {
//                                 const [newSortBy, newSortOrder] = e.target.value.split(':');
//                                 setSortBy(newSortBy);
//                                 setSortOrder(newSortOrder);
//                             }}
//                             className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         >
//                             <option value="createdAt:desc">Mới nhất trước</option>
//                             <option value="createdAt:asc">Cũ nhất trước</option>
//                             <option value="name:asc">Tên A-Z</option>
//                             <option value="name:desc">Tên Z-A</option>
//                         </select>
//                     </div>
//                 </div>
//             </div>

//             {/* Recruiters Table */}
//             <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//                 {loading ? (
//                     <div className="p-8 flex justify-center">
//                         <Loading />
//                     </div>
//                 ) : (
//                     <>
//                         <DataTable
//                             columns={columns}
//                             data={filteredRecruiters}
//                             emptyMessage="Không tìm thấy nhà tuyển dụng nào phù hợp"
//                         />

//                         {/* Pagination */}
//                         {totalPages > 1 && (
//                             <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between">
//                                 <div className="text-sm text-gray-500 mb-3 sm:mb-0">
//                                     Hiển thị <span className="font-medium">{filteredRecruiters.length}</span> trong tổng số <span className="font-medium">{totalRecruiters}</span> nhà tuyển dụng
//                                 </div>
//                                 <div className="flex justify-center space-x-1">
//                                     <button
//                                         onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                                         disabled={currentPage === 1}
//                                         className={`px-3 py-1 rounded ${currentPage === 1
//                                             ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                                             : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
//                                             }`}
//                                     >
//                                         <span className="material-icons text-sm">chevron_left</span>
//                                     </button>
//                                     {[...Array(totalPages)].map((_, i) => (
//                                         <button
//                                             key={i}
//                                             onClick={() => setCurrentPage(i + 1)}
//                                             className={`px-3 py-1 rounded ${currentPage === i + 1
//                                                 ? 'bg-blue-600 text-white'
//                                                 : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
//                                                 }`}
//                                         >
//                                             {i + 1}
//                                         </button>
//                                     ))}
//                                     <button
//                                         onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                                         disabled={currentPage === totalPages}
//                                         className={`px-3 py-1 rounded ${currentPage === totalPages
//                                             ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                                             : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
//                                             }`}
//                                     >
//                                         <span className="material-icons text-sm">chevron_right</span>
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>

//             {/* Delete Confirmation Modal */}
//             {showDeleteModal && selectedRecruiter && (
//                 <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-xl shadow-xl p-6 max-w-md mx-auto">
//                         <div className="flex items-center justify-center text-red-500 mb-6">
//                             <span className="material-icons text-5xl">warning</span>
//                         </div>
//                         <h3 className="text-xl font-bold text-center mb-4">Xác nhận xóa nhà tuyển dụng</h3>
//                         <p className="text-gray-600 mb-6 text-center">
//                             Bạn có chắc chắn muốn xóa nhà tuyển dụng <span className="font-semibold">{selectedRecruiter.name}</span>?<br />
//                             Tất cả dữ liệu liên quan đến công ty này, bao gồm việc làm và đơn ứng tuyển sẽ bị xóa vĩnh viễn. <br />
//                             Hành động này không thể hoàn tác.
//                         </p>
//                         <div className="flex justify-center space-x-4">
//                             <button
//                                 onClick={() => setShowDeleteModal(false)}
//                                 className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg flex-1 transition duration-200"
//                             >
//                                 Hủy
//                             </button>
//                             <button
//                                 onClick={handleDeleteRecruiter}
//                                 className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex-1 transition duration-200"
//                             >
//                                 Xác nhận xóa
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Recruiter Detail Modal */}
//             {showDetailModal && recruiterDetail && (
//                 <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-xl shadow-xl p-6 max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
//                         <div className="flex justify-between items-start mb-6">
//                             <div className="flex items-center">
//                                 <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden mr-4 flex items-center justify-center">
//                                     {recruiterDetail.image ? (
//                                         <img
//                                             src={recruiterDetail.image}
//                                             alt={recruiterDetail.name}
//                                             className="w-full h-full object-cover"
//                                         />
//                                     ) : (
//                                         <span className="material-icons text-4xl text-gray-400">business</span>
//                                     )}
//                                 </div>
//                                 <div>
//                                     <h2 className="text-2xl font-bold text-gray-800 flex items-center">
//                                         {recruiterDetail.name}
//                                         {recruiterDetail.verified && (
//                                             <span className="material-icons text-blue-500 ml-2 text-xl">verified</span>
//                                         )}
//                                     </h2>
//                                     <p className="text-gray-600 flex items-center">
//                                         <span className="material-icons text-sm mr-1">email</span>
//                                         {recruiterDetail.email}
//                                     </p>
//                                 </div>
//                             </div>
//                             <div className="flex space-x-2">
//                                 <button
//                                     onClick={() => {
//                                         setSelectedRecruiter(recruiterDetail);
//                                         setShowDeleteModal(true);
//                                     }}
//                                     className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg flex items-center transition duration-200"
//                                 >
//                                     <span className="material-icons text-sm mr-1">delete</span>
//                                     Xóa
//                                 </button>
//                                 <button
//                                     onClick={() => setShowDetailModal(false)}
//                                     className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg flex items-center transition duration-200"
//                                 >
//                                     <span className="material-icons text-sm">close</span>
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                             {/* Company Information Panel */}
//                             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                                 <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium">
//                                     Thông tin công ty
//                                 </div>
//                                 <div className="p-4 space-y-3">
//                                     <div>
//                                         <label className="text-sm text-gray-500">Ngày đăng ký:</label>
//                                         <p className="font-medium">{formatDate(recruiterDetail.createdAt)}</p>
//                                     </div>
//                                     <div>
//                                         <label className="text-sm text-gray-500">Ngành nghề:</label>
//                                         <p className="font-medium">{recruiterDetail.industry || 'Chưa cập nhật'}</p>
//                                     </div>
//                                     <div>
//                                         <label className="text-sm text-gray-500">Website:</label>
//                                         <p>
//                                             {recruiterDetail.website ? (
//                                                 <a
//                                                     href={recruiterDetail.website}
//                                                     target="_blank"
//                                                     rel="noopener noreferrer"
//                                                     className="text-blue-600 hover:underline font-medium"
//                                                 >
//                                                     {recruiterDetail.website}
//                                                 </a>
//                                             ) : 'Chưa cập nhật'}
//                                         </p>
//                                     </div>
//                                     <div>
//                                         <label className="text-sm text-gray-500">Địa chỉ:</label>
//                                         <p className="font-medium">{recruiterDetail.location || 'Chưa cập nhật'}</p>
//                                     </div>
//                                     <div>
//                                         <label className="text-sm text-gray-500">Số điện thoại:</label>
//                                         <p className="font-medium">{recruiterDetail.phone || 'Chưa cập nhật'}</p>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Activity Statistics Panel */}
//                             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                                 <div className="px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium">
//                                     Thống kê hoạt động
//                                 </div>
//                                 <div className="p-4">
//                                     <div className="grid grid-cols-2 gap-4">
//                                         <div className="bg-blue-50 rounded-lg p-4 text-center hover:shadow-md transition duration-200">
//                                             <p className="text-3xl font-bold text-blue-600">{recruiterStats.jobsCount || 0}</p>
//                                             <p className="text-sm text-gray-600">Việc làm đã đăng</p>
//                                         </div>
//                                         <div className="bg-green-50 rounded-lg p-4 text-center hover:shadow-md transition duration-200">
//                                             <p className="text-3xl font-bold text-green-600">{recruiterStats.applicationsCount || 0}</p>
//                                             <p className="text-sm text-gray-600">Đơn ứng tuyển</p>
//                                         </div>
//                                     </div>

//                                     {/* Job Status Statistics */}
//                                     <div className="mt-4 grid grid-cols-3 gap-2">
//                                         <div className="bg-emerald-50 rounded p-2 text-center hover:shadow-sm transition duration-200">
//                                             <p className="font-bold text-emerald-600">{recruiterStats.activeJobsCount || 0}</p>
//                                             <p className="text-xs text-gray-600">Đang hoạt động</p>
//                                         </div>
//                                         <div className="bg-amber-50 rounded p-2 text-center hover:shadow-sm transition duration-200">
//                                             <p className="font-bold text-amber-600">{recruiterStats.pendingJobsCount || 0}</p>
//                                             <p className="text-xs text-gray-600">Chờ duyệt</p>
//                                         </div>
//                                         <div className="bg-gray-50 rounded p-2 text-center hover:shadow-sm transition duration-200">
//                                             <p className="font-bold text-gray-600">{recruiterStats.inactiveJobsCount || 0}</p>
//                                             <p className="text-xs text-gray-600">Không hoạt động</p>
//                                         </div>
//                                     </div>

//                                     <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//                                         <p className="text-sm text-gray-500 mb-2">Lần đăng nhập cuối:</p>
//                                         <p className="font-medium text-blue-800">{recruiterDetail.lastLogin ? formatDate(recruiterDetail.lastLogin) : 'Chưa có thông tin'}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Company Description Panel */}
//                         {recruiterDetail.description && (
//                             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
//                                 <div className="px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium">
//                                     Giới thiệu công ty
//                                 </div>
//                                 <div className="p-4">
//                                     <p className="text-gray-700 whitespace-pre-line leading-relaxed">{recruiterDetail.description}</p>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Action Buttons */}
//                         <div className="flex justify-end space-x-3 mt-4">
//                             <Link
//                                 to={`/admin/jobs?company=${recruiterDetail._id}`}
//                                 className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition duration-200"
//                             >
//                                 <span className="material-icons text-sm mr-2">work</span>
//                                 Xem công việc
//                             </Link>
//                             <button
//                                 onClick={() => setShowDetailModal(false)}
//                                 className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition duration-200"
//                             >
//                                 Đóng
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default RecruiterManagement;