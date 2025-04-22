import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/Loading';
import { Search, PlusCircle, Edit, Trash2, Eye } from 'lucide-react';

const ResourceManagement = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [resourceToDelete, setResourceToDelete] = useState(null);

    const { backendUrl } = useContext(AppContext);
    const itemsPerPage = 10;

    // Fetch all resources
    const fetchResources = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                toast.error("Yêu cầu xác thực Admin.");
                setLoading(false);
                return;
            }

            const response = await axios.get(`${backendUrl}/api/admin/resources`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                console.log("API response:", response.data);
                setResources(response.data.resources || []);
            } else {
                toast.error(response.data.message || "Không thể tải danh sách tài nguyên.");
            }
        } catch (error) {
            console.error("Lỗi tải danh sách tài nguyên:", error);
            toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (backendUrl) {
            fetchResources();
        } else {
            toast.error("Lỗi cấu hình: Không tìm thấy backend URL.");
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [backendUrl]);

    // Delete resource
    const confirmDelete = (resource) => {
        setResourceToDelete(resource);
        setShowDeleteModal(true);
    };

    const handleDeleteResource = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                toast.error("Yêu cầu xác thực Admin.");
                return;
            }

            const response = await axios.delete(
                `${backendUrl}/api/admin/resources/${resourceToDelete._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success("Xóa tài nguyên thành công");
                setResources(resources.filter(resource => resource._id !== resourceToDelete._id));
                setShowDeleteModal(false);
                setResourceToDelete(null);
            } else {
                toast.error(response.data.message || "Xóa tài nguyên thất bại");
            }
        } catch (error) {
            console.error("Error deleting resource:", error);
            toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ");
        }
    };

    // Filter resources based on search term
    const filteredResources = resources.filter(resource => {
        return (
            resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredResources.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

    // Helper function to format resource type
    const formatResourceType = (type) => {
        return type
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <>
            {/* Header with Search and Add Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Quản lý tài nguyên nghề nghiệp</h3>
                <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                    <div className="flex items-center bg-white rounded-lg border border-gray-300 px-3 py-2 w-full md:w-auto">
                        <Search size={20} className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Tìm tài nguyên..."
                            className="outline-none w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Link
                        to="/admin/resources/new"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition duration-200"
                        onClick={(e) => {
                            // Ngăn chặn hành vi mặc định nếu cần debug
                            // e.preventDefault();
                            console.log("Chuyển đến trang tạo tài nguyên");
                        }}
                    >
                        <PlusCircle size={16} className="mr-2" />
                        Thêm tài nguyên
                    </Link>
                </div>
            </div>

            {/* Resources Table */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loading />
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng item</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.length > 0 ? currentItems.map((resource) => (
                                    <tr key={resource._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {formatResourceType(resource.type)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                {resource.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {resource.items?.length || 0} item
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(resource.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    to={`/resources/${resource.type}`}
                                                    target="_blank"
                                                    className="p-1 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-full"
                                                    title="Xem trên trang chính"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                                <Link
                                                    to={`/admin/resources/edit/${resource._id}`}
                                                    className="p-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full"
                                                    title="Chỉnh sửa tài nguyên"
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => confirmDelete(resource)}
                                                    className="p-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-full"
                                                    title="Xóa tài nguyên"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                            Không có tài nguyên nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredResources.length)}</span> of <span className="font-medium">{filteredResources.length}</span> resources
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 rounded text-sm ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2)).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-1 rounded text-sm ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 rounded text-sm ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && resourceToDelete && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                    <div className="relative bg-white rounded-lg shadow-lg max-w-md mx-auto p-6">
                        <div className="text-center">
                            <svg className="mx-auto mb-4 w-14 h-14 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Xóa tài nguyên</h3>
                            <p className="text-gray-500 mb-6">
                                Bạn có chắc chắn muốn xóa tài nguyên "{resourceToDelete.title}" không? Thao tác này không thể hoàn tác.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    type="button"
                                    className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                                    onClick={handleDeleteResource}
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ResourceManagement;