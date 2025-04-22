// src/pages/admin/ApplicationManagement.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/Loading';
import { Search, Filter, Eye, Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';

// Helper function render status badge (tương tự JobsManagement)
const renderStatusBadge = (status) => {
    let colorClasses = 'bg-gray-100 text-gray-800'; // Default for unknown/pending
    switch (status?.toLowerCase()) { // Thêm ?. để tránh lỗi nếu status là null/undefined
        case 'viewed':
            colorClasses = 'bg-blue-100 text-blue-800'; break;
        case 'shortlisted':
            colorClasses = 'bg-yellow-100 text-yellow-800'; break;
        case 'rejected':
            colorClasses = 'bg-red-100 text-red-800'; break;
        case 'hired':
        case 'accepted': // Có thể có trạng thái hired/accepted
            colorClasses = 'bg-green-100 text-green-800'; break;
        case 'pending':
            colorClasses = 'bg-orange-100 text-orange-800'; break; // Ví dụ màu khác cho pending
    }
    // Viết hoa chữ cái đầu
    const displayStatus = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A';
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses}`}>
            {displayStatus}
        </span>
    );
};


const ApplicationManagement = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [processingAction, setProcessingAction] = useState(false);

    const { backendUrl } = useContext(AppContext);
    const itemsPerPage = 10;

    // Các trạng thái đơn ứng tuyển
    //const applicationStatuses = ['pending', 'viewed', 'shortlisted', 'rejected', 'hired'];

    // Hàm fetch danh sách applications
    const fetchApplications = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) { toast.error("Yêu cầu xác thực Admin."); setLoading(false); return; }

            const response = await axios.get(`${backendUrl}/api/admin/applications`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setApplications(response.data.applications || []);
            } else {
                toast.error(response.data.message || "Không thể tải danh sách đơn ứng tuyển.");
            }
        } catch (error) {
            console.error("Lỗi tải danh sách đơn ứng tuyển:", error);
            toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ.");
        } finally {
            setLoading(false);
        }
    };

    // Xem chi tiết đơn ứng tuyển
    const handleViewDetail = (application) => {
        setSelectedApplication(application);
        setShowDetailModal(true);
    };



    // Xác nhận xóa đơn ứng tuyển
    const confirmDelete = (application) => {
        setSelectedApplication(application);
        setShowDeleteModal(true);
    };

    // Xóa đơn ứng tuyển
    const handleDeleteApplication = async () => {
        setProcessingAction(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                toast.error("Yêu cầu xác thực Admin.");
                setProcessingAction(false);
                return;
            }

            const response = await axios.delete(
                `${backendUrl}/api/admin/applications/${selectedApplication._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success("Đã xóa đơn ứng tuyển thành công");

                // Cập nhật state
                setApplications(applications.filter(app => app._id !== selectedApplication._id));
                setShowDeleteModal(false);

                // Tính lại paging
                const newTotalPages = Math.ceil((applications.length - 1) / itemsPerPage);
                if (currentPage > newTotalPages && newTotalPages > 0) {
                    setCurrentPage(newTotalPages);
                }
            } else {
                toast.error(response.data.message || "Xóa đơn ứng tuyển thất bại");
            }
        } catch (error) {
            console.error("Error deleting application:", error);
            toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ");
        } finally {
            setProcessingAction(false);
            setShowDeleteModal(false);
        }
    };

    // useEffect để fetch dữ liệu
    useEffect(() => {
        if (backendUrl) { fetchApplications(); }
        else { toast.error("Lỗi cấu hình: Không tìm thấy backend URL."); setLoading(false); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [backendUrl]);

    // Filter và search applications (Client-side)
    const filteredApplications = applications.filter(app => {
        const applicantName = app.userId?.name || '';
        const jobTitle = app.jobId?.title || '';
        const companyName = app.companyId?.name || '';

        const matchesSearch = applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            companyName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || app.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
    const handlePageChange = (page) => { setCurrentPage(page); };

    // Lấy danh sách các status duy nhất từ data để tạo bộ lọc động
    const uniqueStatuses = ['all', ...new Set(applications.map(app => app.status).filter(Boolean))];


    return (
        <> {/* Dùng Fragment vì component này sẽ nằm trong AdminLayout */}
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Danh sách Đơn ứng tuyển</h3>
                <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                    <div className="flex items-center bg-white rounded-lg border border-gray-300 px-3 py-2 w-full md:w-auto">
                        <Search size={20} className="text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Tìm ứng viên, công việc, công ty..."
                            className="outline-none w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center bg-white rounded-lg border border-gray-300 px-3 py-2">
                        <Filter size={18} className="text-gray-400 mr-2" />
                        <select
                            className="outline-none bg-transparent"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            {uniqueStatuses.map(status => (
                                <option key={status} value={status}>
                                    {status === 'all' ? 'Tất cả trạng thái' : (status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Chưa xác định')}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Applications Table */}
            {loading ? (
                <div className="flex justify-center items-center h-64"> <Loading /> </div>
            ) : (
                <>
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ứng viên</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Công việc</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Công ty</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày ứng tuyển</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.length > 0 ? currentItems.map((app) => (
                                    <tr key={app._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img className="h-10 w-10 rounded-full object-cover mr-3" src={app.userId?.image || '/avatar-placeholder.jpg'} alt={app.userId?.name || 'N/A'} />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{app.userId?.name || 'N/A'}</div>
                                                    <div className="text-sm text-gray-500">{app.userId?.email || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.jobId?.title || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.companyId?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {app.date ? new Date(app.date).toLocaleDateString('vi-VN') : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {renderStatusBadge(app.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleViewDetail(app)}
                                                    className="p-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full"
                                                    title="Xem chi tiết đơn ứng tuyển"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                <button
                                                    onClick={() => confirmDelete(app)}
                                                    className="p-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-full"
                                                    title="Xóa đơn ứng tuyển"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr> <td colSpan="6" className="px-6 py-10 text-center text-gray-500">Không có đơn ứng tuyển nào.</td> </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredApplications.length)}</span> of <span className="font-medium">{filteredApplications.length}</span> applications
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`px-3 py-1 rounded text-sm ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>Previous</button>
                                {/* Nên có logic render số trang tốt hơn */}
                                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2)).map((page) => (
                                    <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-1 rounded text-sm ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>{page}</button>
                                ))}
                                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`px-3 py-1 rounded text-sm ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>Next</button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modal xem chi tiết đơn ứng tuyển */}
            {/* Modal xem chi tiết đơn ứng tuyển - backdrop mờ thay vì tối hoàn toàn */}
            {showDetailModal && selectedApplication && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 transform transition-all duration-300 ease-in-out">
                        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Chi tiết đơn ứng tuyển
                            </h3>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-5 max-h-[70vh] overflow-y-auto">
                            <div className="flex items-center mb-5">
                                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                    {selectedApplication.userId?.image ? (
                                        <img
                                            src={selectedApplication.userId.image}
                                            alt={selectedApplication.userId?.name || 'Ứng viên'}
                                            className="w-14 h-14 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-blue-600 font-bold text-xl">
                                            {selectedApplication.userId?.name?.charAt(0) || 'U'}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold">{selectedApplication.userId?.name || 'Ứng viên không xác định'}</h4>
                                    <p className="text-gray-600 text-sm">{selectedApplication.userId?.email || 'Email không có'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <p className="text-sm text-gray-500 mb-1">Ngày ứng tuyển</p>
                                    <p className="font-medium">
                                        {selectedApplication.date
                                            ? new Date(selectedApplication.date).toLocaleDateString('vi-VN', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })
                                            : 'Không có thông tin'}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
                                    <div>{renderStatusBadge(selectedApplication.status)}</div>
                                </div>
                            </div>

                            <div className="mb-5">
                                <h4 className="text-md font-semibold border-b pb-2 mb-3">Thông tin công việc</h4>
                                <div className="mb-2">
                                    <span className="text-gray-500 text-sm">Vị trí:</span>
                                    <p className="font-medium">{selectedApplication.jobId?.title || 'Không có thông tin'}</p>
                                </div>
                                <div className="mb-2">
                                    <span className="text-gray-500 text-sm">Công ty:</span>
                                    <p className="font-medium">{selectedApplication.companyId?.name || 'Không có thông tin'}</p>
                                </div>
                                {selectedApplication.jobId?.location && (
                                    <div className="mb-2">
                                        <span className="text-gray-500 text-sm">Địa điểm:</span>
                                        <p>{selectedApplication.jobId.location}</p>
                                    </div>
                                )}
                            </div>

                            {selectedApplication.resumeUrl && (
                                <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md mb-5">
                                    <div>
                                        <h4 className="font-medium text-blue-800">CV ứng viên</h4>
                                        <p className="text-sm text-gray-600">Nhấn nút bên cạnh để xem CV của ứng viên</p>
                                    </div>
                                    <a
                                        href={selectedApplication.resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition duration-150 text-sm"
                                    >
                                        Xem CV
                                    </a>
                                </div>
                            )}

                            {selectedApplication.coverLetter && (
                                <div className="mb-5">
                                    <h4 className="text-md font-semibold border-b pb-2 mb-3">Thư giới thiệu</h4>
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <p className="text-gray-700 whitespace-pre-line text-sm">
                                            {selectedApplication.coverLetter.length > 200
                                                ? `${selectedApplication.coverLetter.substring(0, 200)}...`
                                                : selectedApplication.coverLetter}
                                        </p>
                                        {selectedApplication.coverLetter.length > 200 && (
                                            <button
                                                className="text-blue-600 text-sm mt-2 hover:text-blue-800"
                                                onClick={() => {
                                                    // Hiển thị đầy đủ thư trong một modal riêng nếu cần
                                                    alert(selectedApplication.coverLetter);
                                                }}
                                            >
                                                Xem thêm
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 px-5 py-3 flex justify-end space-x-2 rounded-b-lg">
                            <button
                                onClick={() => confirmDelete(selectedApplication)}
                                className="bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 transition duration-150 text-sm font-medium"
                                disabled={processingAction}
                            >
                                Xóa đơn
                            </button>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition duration-150 text-sm font-medium"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal xác nhận xóa */}
            {showDeleteModal && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 mb-4">
                                <AlertTriangle size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa đơn ứng tuyển</h3>
                            <p className="text-gray-600">
                                Bạn có chắc chắn muốn xóa đơn ứng tuyển của <span className="font-semibold">{selectedApplication.userId?.name || 'ứng viên này'}</span> cho vị trí <span className="font-semibold">{selectedApplication.jobId?.title || 'này'}</span>?
                            </p>
                            <p className="text-sm text-red-600 mt-2">Hành động này không thể hoàn tác.</p>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                                disabled={processingAction}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDeleteApplication}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
                                disabled={processingAction}
                            >
                                {processingAction ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin mr-2" />
                                        Đang xử lý...
                                    </>
                                ) : 'Xác nhận xóa'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ApplicationManagement;
// // src/pages/admin/ApplicationManagement.jsx

// import React, { useState, useEffect, useContext } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { AppContext } from '../../context/AppContext';
// import Loading from '../../components/Loading';
// //import { Search, Filter, Eye } from 'lucide-react'; // Import icons
// import { Search, Filter, Eye, Trash2, AlertCircle, AlertTriangle, X, Loader2 } from 'lucide-react'; // Import icons
// // Helper function render status badge (tương tự JobsManagement)
// const renderStatusBadge = (status) => {
//     let colorClasses = 'bg-gray-100 text-gray-800'; // Default for unknown/pending
//     switch (status?.toLowerCase()) { // Thêm ?. để tránh lỗi nếu status là null/undefined
//         case 'viewed':
//             colorClasses = 'bg-blue-100 text-blue-800'; break;
//         case 'shortlisted':
//             colorClasses = 'bg-yellow-100 text-yellow-800'; break;
//         case 'rejected':
//             colorClasses = 'bg-red-100 text-red-800'; break;
//         case 'hired':
//         case 'accepted': // Có thể có trạng thái hired/accepted
//             colorClasses = 'bg-green-100 text-green-800'; break;
//         case 'pending':
//             colorClasses = 'bg-orange-100 text-orange-800'; break; // Ví dụ màu khác cho pending
//     }
//     // Viết hoa chữ cái đầu
//     const displayStatus = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A';
//     return (
//         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses}`}>
//             {displayStatus}
//         </span>
//     );
// };


// const ApplicationManagement = () => {
//     const [applications, setApplications] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filterStatus, setFilterStatus] = useState('all');
//     const [currentPage, setCurrentPage] = useState(1);

//     const [selectedApplication, setSelectedApplication] = useState(null);
//     const [showDetailModal, setShowDetailModal] = useState(false);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [processingAction, setProcessingAction] = useState(false);


//     const { backendUrl } = useContext(AppContext);
//     const itemsPerPage = 10;

//     // Hàm fetch danh sách applications
//     const fetchApplications = async () => {
//         setLoading(true);
//         try {
//             const token = localStorage.getItem('adminToken');
//             if (!token) { toast.error("Yêu cầu xác thực Admin."); setLoading(false); return; }

//             const response = await axios.get(`${backendUrl}/api/admin/applications`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (response.data.success) {
//                 setApplications(response.data.applications || []);
//             } else {
//                 toast.error(response.data.message || "Không thể tải danh sách đơn ứng tuyển.");
//             }
//         } catch (error) {
//             console.error("Lỗi tải danh sách đơn ứng tuyển:", error);
//             toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ.");
//         } finally {
//             setLoading(false);
//         }
//     };
//     // Thêm vào sau hàm fetchApplications

//     // Xem chi tiết đơn ứng tuyển
//     const handleViewDetail = (application) => {
//         setSelectedApplication(application);
//         setShowDetailModal(true);
//     };

//     // Cập nhật trạng thái đơn ứng tuyển
//     const handleUpdateStatus = async (applicationId, newStatus) => {
//         setProcessingAction(true);
//         try {
//             const token = localStorage.getItem('adminToken');
//             if (!token) {
//                 toast.error("Yêu cầu xác thực Admin.");
//                 setProcessingAction(false);
//                 return;
//             }

//             const response = await axios.patch(
//                 `${backendUrl}/api/admin/applications/${applicationId}/status`,
//                 { status: newStatus },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             if (response.data.success) {
//                 toast.success(`Đã cập nhật trạng thái thành ${newStatus}`);

//                 // Cập nhật state
//                 setApplications(applications.map(app =>
//                     app._id === applicationId ? { ...app, status: newStatus } : app
//                 ));

//                 // Nếu đang xem chi tiết, cập nhật luôn selectedApplication
//                 if (selectedApplication && selectedApplication._id === applicationId) {
//                     setSelectedApplication({ ...selectedApplication, status: newStatus });
//                 }
//             } else {
//                 toast.error(response.data.message || "Cập nhật trạng thái thất bại");
//             }
//         } catch (error) {
//             console.error("Error updating application status:", error);
//             toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ");
//         } finally {
//             setProcessingAction(false);
//         }
//     };

//     // Xác nhận xóa đơn ứng tuyển
//     const confirmDelete = (application) => {
//         setSelectedApplication(application);
//         setShowDeleteModal(true);
//     };

//     // Xóa đơn ứng tuyển
//     const handleDeleteApplication = async () => {
//         setProcessingAction(true);
//         try {
//             const token = localStorage.getItem('adminToken');
//             if (!token) {
//                 toast.error("Yêu cầu xác thực Admin.");
//                 setProcessingAction(false);
//                 return;
//             }

//             const response = await axios.delete(
//                 `${backendUrl}/api/admin/applications/${selectedApplication._id}`,
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             if (response.data.success) {
//                 toast.success("Đã xóa đơn ứng tuyển thành công");

//                 // Cập nhật state
//                 setApplications(applications.filter(app => app._id !== selectedApplication._id));
//                 setShowDeleteModal(false);

//                 // Tính lại paging
//                 const newTotalPages = Math.ceil((applications.length - 1) / itemsPerPage);
//                 if (currentPage > newTotalPages && newTotalPages > 0) {
//                     setCurrentPage(newTotalPages);
//                 }
//             } else {
//                 toast.error(response.data.message || "Xóa đơn ứng tuyển thất bại");
//             }
//         } catch (error) {
//             console.error("Error deleting application:", error);
//             toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ");
//         } finally {
//             setProcessingAction(false);
//             setShowDeleteModal(false);
//         }
//     };

//     // useEffect để fetch dữ liệu
//     useEffect(() => {
//         if (backendUrl) { fetchApplications(); }
//         else { toast.error("Lỗi cấu hình: Không tìm thấy backend URL."); setLoading(false); }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [backendUrl]);

//     // Filter và search applications (Client-side)
//     const filteredApplications = applications.filter(app => {
//         const applicantName = app.userId?.name || '';
//         const jobTitle = app.jobId?.title || '';
//         const companyName = app.companyId?.name || '';

//         const matchesSearch = applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             companyName.toLowerCase().includes(searchTerm.toLowerCase());

//         const matchesStatus = filterStatus === 'all' || app.status === filterStatus;

//         return matchesSearch && matchesStatus;
//     });

//     // Pagination logic
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItems = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
//     const handlePageChange = (page) => { setCurrentPage(page); };

//     // Lấy danh sách các status duy nhất từ data để tạo bộ lọc động
//     const uniqueStatuses = ['all', ...new Set(applications.map(app => app.status).filter(Boolean))];


//     return (
//         <> {/* Dùng Fragment vì component này sẽ nằm trong AdminLayout */}
//             {/* Search and Filter */}
//             <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 bg-white p-4 rounded-lg shadow">
//                 <h3 className="text-lg font-semibold">Danh sách Đơn ứng tuyển</h3>
//                 <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
//                     <div className="flex items-center bg-white rounded-lg border border-gray-300 px-3 py-2 w-full md:w-auto">
//                         <Search size={20} className="text-gray-400 mr-2" />
//                         <input
//                             type="text"
//                             placeholder="Tìm ứng viên, công việc, công ty..."
//                             className="outline-none w-full"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                     </div>
//                     <div className="flex items-center bg-white rounded-lg border border-gray-300 px-3 py-2">
//                         <Filter size={18} className="text-gray-400 mr-2" />
//                         <select
//                             className="outline-none bg-transparent"
//                             value={filterStatus}
//                             onChange={(e) => setFilterStatus(e.target.value)}
//                         >
//                             {uniqueStatuses.map(status => (
//                                 <option key={status} value={status}>
//                                     {status === 'all' ? 'Tất cả trạng thái' : (status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Chưa xác định')}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>
//             </div>

//             {/* Applications Table */}
//             {loading ? (
//                 <div className="flex justify-center items-center h-64"> <Loading /> </div>
//             ) : (
//                 <>
//                     <div className="bg-white rounded-lg shadow overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ứng viên</th>
//                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Công việc</th>
//                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Công ty</th>
//                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày ứng tuyển</th>
//                                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
//                                     <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {currentItems.length > 0 ? currentItems.map((app) => (
//                                     <tr key={app._id} className="hover:bg-gray-50">
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <div className="flex items-center">
//                                                 <img className="h-10 w-10 rounded-full object-cover mr-3" src={app.userId?.image || '/avatar-placeholder.jpg'} alt={app.userId?.name || 'N/A'} />
//                                                 <div>
//                                                     <div className="text-sm font-medium text-gray-900">{app.userId?.name || 'N/A'}</div>
//                                                     <div className="text-sm text-gray-500">{app.userId?.email || 'N/A'}</div>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.jobId?.title || 'N/A'}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.companyId?.name || 'N/A'}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                             {app.date ? new Date(app.date).toLocaleDateString('vi-VN') : 'N/A'}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             {renderStatusBadge(app.status)}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                             <div className="flex justify-end space-x-2">
//                                                 <button
//                                                     onClick={() => handleViewDetail(app)}
//                                                     className="p-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full"
//                                                     title="Xem chi tiết đơn ứng tuyển"
//                                                 >
//                                                     <Eye size={16} />
//                                                 </button>

//                                                 <div className="relative group">
//                                                     <button
//                                                         className="p-1 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-full"
//                                                         title="Cập nhật trạng thái"
//                                                     >
//                                                         <AlertCircle size={16} />
//                                                     </button>
//                                                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
//                                                         {applicationStatuses.map(status => (
//                                                             <button
//                                                                 key={status}
//                                                                 onClick={() => handleUpdateStatus(app._id, status)}
//                                                                 className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${app.status === status ? 'bg-gray-100' : ''}`}
//                                                                 disabled={app.status === status}
//                                                             >
//                                                                 {status.charAt(0).toUpperCase() + status.slice(1)}
//                                                             </button>
//                                                         ))}
//                                                     </div>
//                                                 </div>

//                                                 <button
//                                                     onClick={() => confirmDelete(app)}
//                                                     className="p-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-full"
//                                                     title="Xóa đơn ứng tuyển"
//                                                 >
//                                                     <Trash2 size={16} />
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 )) : (
//                                     <tr> <td colSpan="6" className="px-6 py-10 text-center text-gray-500">Không có đơn ứng tuyển nào.</td> </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Pagination */}
//                     {totalPages > 1 && (
//                         <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow">
//                             <div className="text-sm text-gray-700">
//                                 Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredApplications.length)}</span> of <span className="font-medium">{filteredApplications.length}</span> applications
//                             </div>
//                             <div className="flex gap-1">
//                                 <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`px-3 py-1 rounded text-sm ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>Previous</button>
//                                 {/* Nên có logic render số trang tốt hơn */}
//                                 {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2)).map((page) => (
//                                     <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-1 rounded text-sm ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>{page}</button>
//                                 ))}
//                                 <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`px-3 py-1 rounded text-sm ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>Next</button>
//                             </div>
//                         </div>
//                     )}
//                 </>
//             )}

//             {/* Modal xem chi tiết đơn ứng tuyển */}
//             {showDetailModal && selectedApplication && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
//                         <div className="p-6">
//                             <div className="flex justify-between items-start">
//                                 <h2 className="text-2xl font-bold text-gray-800 mb-4">Chi tiết đơn ứng tuyển</h2>
//                                 <button
//                                     onClick={() => setShowDetailModal(false)}
//                                     className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
//                                 >
//                                     <X size={20} />
//                                 </button>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                                 {/* Thông tin ứng viên */}
//                                 <div className="bg-blue-50 p-4 rounded-lg">
//                                     <h3 className="text-lg font-semibold mb-3 text-blue-800">Thông tin ứng viên</h3>
//                                     <div className="flex items-center mb-3">
//                                         <img
//                                             src={selectedApplication.userId?.image || '/avatar-placeholder.jpg'}
//                                             alt={selectedApplication.userId?.name || 'Ứng viên'}
//                                             className="h-16 w-16 rounded-full object-cover mr-3"
//                                         />
//                                         <div>
//                                             <p className="font-semibold text-gray-800">{selectedApplication.userId?.name || 'N/A'}</p>
//                                             <p className="text-sm text-gray-600">{selectedApplication.userId?.email || 'N/A'}</p>
//                                             <p className="text-sm text-gray-600 mt-1">
//                                                 {selectedApplication.date ? new Date(selectedApplication.date).toLocaleDateString('vi-VN', {
//                                                     year: 'numeric',
//                                                     month: 'long',
//                                                     day: 'numeric',
//                                                     hour: '2-digit',
//                                                     minute: '2-digit'
//                                                 }) : 'N/A'}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <div className="space-y-2">
//                                         <div className="flex justify-between">
//                                             <span className="text-gray-600">Trạng thái:</span>
//                                             {renderStatusBadge(selectedApplication.status)}
//                                         </div>
//                                         {selectedApplication.phone && (
//                                             <div className="flex justify-between">
//                                                 <span className="text-gray-600">Số điện thoại:</span>
//                                                 <span>{selectedApplication.phone}</span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>

//                                 {/* Thông tin công việc */}
//                                 <div className="bg-green-50 p-4 rounded-lg">
//                                     <h3 className="text-lg font-semibold mb-3 text-green-800">Thông tin công việc</h3>
//                                     <div className="space-y-2">
//                                         <div>
//                                             <span className="text-gray-600">Vị trí:</span>
//                                             <p className="font-semibold">{selectedApplication.jobId?.title || 'N/A'}</p>
//                                         </div>
//                                         <div>
//                                             <span className="text-gray-600">Công ty:</span>
//                                             <p className="font-semibold">{selectedApplication.companyId?.name || 'N/A'}</p>
//                                         </div>
//                                         {selectedApplication.jobId?.location && (
//                                             <div>
//                                                 <span className="text-gray-600">Địa điểm:</span>
//                                                 <p>{selectedApplication.jobId.location}</p>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* CV và thông tin bổ sung */}
//                             <div className="mb-6">
//                                 <h3 className="text-lg font-semibold mb-3">CV & Thông tin ứng tuyển</h3>

//                                 {selectedApplication.coverLetter && (
//                                     <div className="bg-gray-50 p-4 rounded-lg mb-4">
//                                         <h4 className="font-medium mb-2">Thư giới thiệu</h4>
//                                         <p className="text-gray-600 whitespace-pre-line">{selectedApplication.coverLetter}</p>
//                                     </div>
//                                 )}

//                                 {selectedApplication.resumeUrl && (
//                                     <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
//                                         <div>
//                                             <h4 className="font-medium">CV đính kèm</h4>
//                                             <p className="text-sm text-gray-500">Tệp đính kèm: CV_{selectedApplication.userId?.name || 'candidate'}.pdf</p>
//                                         </div>
//                                         <a
//                                             href={selectedApplication.resumeUrl}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                                         >
//                                             Xem CV
//                                         </a>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Hành động */}
//                             <div className="border-t pt-4 flex justify-between items-center">
//                                 <div className="space-x-2">
//                                     {applicationStatuses.map(status => (
//                                         <button
//                                             key={status}
//                                             onClick={() => handleUpdateStatus(selectedApplication._id, status)}
//                                             className={`px-3 py-1 rounded-full text-sm ${selectedApplication.status === status
//                                                 ? 'bg-blue-100 text-blue-800 border border-blue-300'
//                                                 : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                                                 }`}
//                                             disabled={selectedApplication.status === status || processingAction}
//                                         >
//                                             {status.charAt(0).toUpperCase() + status.slice(1)}
//                                         </button>
//                                     ))}
//                                 </div>

//                                 <div className="space-x-2">
//                                     <button
//                                         onClick={() => confirmDelete(selectedApplication)}
//                                         className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
//                                         disabled={processingAction}
//                                     >
//                                         Xóa đơn
//                                     </button>
//                                     <button
//                                         onClick={() => setShowDetailModal(false)}
//                                         className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
//                                     >
//                                         Đóng
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Modal xác nhận xóa */}
//             {showDeleteModal && selectedApplication && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
//                         <div className="text-center mb-6">
//                             <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 mb-4">
//                                 <AlertTriangle size={32} />
//                             </div>
//                             <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa đơn ứng tuyển</h3>
//                             <p className="text-gray-600">
//                                 Bạn có chắc chắn muốn xóa đơn ứng tuyển của <span className="font-semibold">{selectedApplication.userId?.name || 'ứng viên này'}</span> cho vị trí <span className="font-semibold">{selectedApplication.jobId?.title || 'này'}</span>?
//                             </p>
//                             <p className="text-sm text-red-600 mt-2">Hành động này không thể hoàn tác.</p>
//                         </div>

//                         <div className="flex justify-end space-x-3">
//                             <button
//                                 onClick={() => setShowDeleteModal(false)}
//                                 className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
//                                 disabled={processingAction}
//                             >
//                                 Hủy
//                             </button>
//                             <button
//                                 onClick={handleDeleteApplication}
//                                 className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
//                                 disabled={processingAction}
//                             >
//                                 {processingAction ? (
//                                     <>
//                                         <Loader2 size={16} className="animate-spin mr-2" />
//                                         Đang xử lý...
//                                     </>
//                                 ) : 'Xác nhận xóa'}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// };

// export default ApplicationManagement;