import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/Loading';
import {
    Edit,
    Trash2,
    PlusCircle,
    Filter,
    Search,
    RefreshCw,
    Eye,
    Clock
} from 'lucide-react';
import Pagination from '../../components/Pagination';
import { useOutletContext } from 'react-router-dom';
// Helper function render status badge
const renderStatusBadge = (status) => {
    let colorClasses = 'bg-gray-100 text-gray-800';
    let text = 'Unknown';

    switch (status?.toLowerCase()) {
        case 'published':
            colorClasses = 'bg-green-100 text-green-800';
            text = 'Đã xuất bản';
            break;
        case 'draft':
            colorClasses = 'bg-yellow-100 text-yellow-800';
            text = 'Bản nháp';
            break;
        case 'archived':
            colorClasses = 'bg-gray-100 text-gray-500';
            text = 'Lưu trữ';
            break;
        default:
            text = status || 'N/A';
    }

    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses}`}>
            {text}
        </span>
    );
};

const BlogManagement = () => {
    // --- STATE VARIABLES ---
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBlogs, setTotalBlogs] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // --- CONTEXT ---
    const { backendUrl } = useContext(AppContext);
    const { setHeaderTitle } = useOutletContext() || {};
    // --- EFFECTS ---
    useEffect(() => {
        if (setHeaderTitle) {
            setHeaderTitle("Quản lý blog");
        }
    }, [setHeaderTitle]);
    useEffect(() => {
        fetchBlogs();
    }, [currentPage, filterStatus, refreshTrigger, backendUrl]);

    // --- FUNCTIONS ---
    const fetchBlogs = async (searchQuery = searchTerm) => {
        setLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                toast.error("Yêu cầu xác thực Admin.");
                setLoading(false);
                return;
            }

            let url = `${backendUrl}/api/admin/blogs?page=${currentPage}&limit=10`;

            if (filterStatus) {
                url += `&status=${filterStatus}`;
            }

            if (searchQuery) {
                url += `&search=${encodeURIComponent(searchQuery)}`;
            }

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setBlogs(response.data.blogs || []);
                setTotalPages(response.data.totalPages || 1);
                setTotalBlogs(response.data.totalBlogs || 0);
            } else {
                toast.error(response.data.message || "Không thể tải danh sách bài viết.");
            }
        } catch (error) {
            console.error("Lỗi tải danh sách bài viết:", error);
            toast.error(error.response?.data?.message || "Lỗi kết nối đến máy chủ.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
        fetchBlogs();
    };

    const handleRefresh = () => {
        setSearchTerm('');
        setFilterStatus('');
        setCurrentPage(1);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleStatusChange = (e) => {
        setFilterStatus(e.target.value);
        setCurrentPage(1);
    };

    const handleDeleteBlog = async (blogId, blogTitle) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${blogTitle}" không?`)) {
            setIsDeleting(true);

            try {
                const token = localStorage.getItem('adminToken');
                if (!token) {
                    toast.error("Yêu cầu xác thực Admin.");
                    setIsDeleting(false);
                    return;
                }

                const response = await axios.delete(`${backendUrl}/api/admin/blogs/${blogId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    toast.success("Xóa bài viết thành công!");
                    // Cập nhật lại danh sách sau khi xóa
                    setRefreshTrigger(prev => prev + 1);
                } else {
                    toast.error(response.data.message || "Không thể xóa bài viết.");
                }
            } catch (error) {
                console.error("Lỗi khi xóa bài viết:", error);
                toast.error(error.response?.data?.message || "Lỗi máy chủ khi xóa bài viết.");
            } finally {
                setIsDeleting(false);
            }
        }
    };

    // Hàm hỗ trợ format ngày giờ
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Mở trang blog trong tab mới
    const openBlogInNewTab = (slug) => {
        window.open(`/blog/${slug}`, '_blank');
    };

    // --- RENDER ---
    return (
        <>
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-700">Quản lý Bài viết Blog</h2>
                <Link
                    to="/admin/blogs/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-150 ease-in-out"
                >
                    <PlusCircle size={18} className="mr-2" />
                    Thêm bài viết mới
                </Link>
            </div>

            {/* Thanh tìm kiếm và lọc */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Tìm kiếm */}
                    <div className="flex-1">
                        <form onSubmit={handleSearch} className="flex">
                            <input
                                type="text"
                                placeholder="Tìm kiếm bài viết..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md"
                                title="Tìm kiếm"
                            >
                                <Search size={20} />
                            </button>
                        </form>
                    </div>

                    {/* Lọc theo trạng thái */}
                    <div className="w-full md:w-64 flex items-center">
                        <div className="text-gray-500 mr-2">
                            <Filter size={20} />
                        </div>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filterStatus}
                            onChange={handleStatusChange}
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="published">Đã xuất bản</option>
                            <option value="draft">Bản nháp</option>
                            <option value="archived">Lưu trữ</option>
                        </select>
                    </div>

                    {/* Nút làm mới */}
                    <button
                        onClick={handleRefresh}
                        className="w-full md:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md inline-flex items-center justify-center"
                        title="Làm mới"
                    >
                        <RefreshCw size={20} className="mr-2" />
                        <span>Làm mới</span>
                    </button>
                </div>
            </div>

            {/* Thông tin tổng quan */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="text-sm text-gray-600">
                    Tổng số: <span className="font-semibold">{totalBlogs}</span> bài viết
                    {filterStatus && (
                        <span> | Lọc: <span className="font-semibold">
                            {filterStatus === 'published' ? 'Đã xuất bản' :
                                filterStatus === 'draft' ? 'Bản nháp' :
                                    filterStatus === 'archived' ? 'Lưu trữ' : filterStatus}
                        </span></span>
                    )}
                    {searchTerm && (
                        <span> | Tìm kiếm: <span className="font-semibold">"{searchTerm}"</span></span>
                    )}
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loading />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {blogs.length > 0 ? (
                                        blogs.map((blog) => (
                                            <tr key={blog._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center">
                                                        {blog.featuredImage && (
                                                            <img
                                                                src={blog.featuredImage}
                                                                alt={blog.title}
                                                                className="h-10 w-16 object-cover rounded mr-3"
                                                            />
                                                        )}
                                                        <div>
                                                            <div className="font-medium text-gray-900">{blog.title}</div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                <span title="Slug" className="inline-flex items-center">
                                                                    {blog.slug}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{blog.category || 'N/A'}</div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {blog.tags?.length > 0 ? (
                                                            <span className="inline-flex items-center">
                                                                Tags: {blog.tags.slice(0, 2).join(', ')}
                                                                {blog.tags.length > 2 && '...'}
                                                            </span>
                                                        ) : 'Không có tag'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    {renderStatusBadge(blog.status)}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Clock size={14} className="mr-1" />
                                                        {formatDate(blog.createdAt)}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-right">
                                                    <div className="flex items-center justify-end space-x-3">
                                                        {blog.status === 'published' ? (
                                                            <button
                                                                onClick={() => openBlogInNewTab(blog.slug)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                                title="Xem bài viết"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                        ) : (
                                                            <Link
                                                                to={`/admin/blogs/preview/${blog._id}`}
                                                                className="text-green-600 hover:text-green-900"
                                                                title="Xem trước bài viết"
                                                            >
                                                                <Eye size={18} />
                                                            </Link>
                                                        )}
                                                        <Link
                                                            to={`/admin/blogs/edit/${blog._id}`}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                            title="Chỉnh sửa bài viết"
                                                        >
                                                            <Edit size={18} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteBlog(blog._id, blog.title)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Xóa bài viết"
                                                            disabled={isDeleting}
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                                Không tìm thấy bài viết nào{searchTerm ? ` phù hợp với từ khóa "${searchTerm}"` : ''}.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Phân trang */}
                        {totalPages > 1 && (
                            <div className="px-4 py-3 bg-white border-t border-gray-200">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default BlogManagement;