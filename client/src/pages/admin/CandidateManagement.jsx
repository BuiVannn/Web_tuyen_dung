import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import DataTable from '../../components/admin/DataTable';
import Loading from '../../components/Loading';
import { useOutletContext } from 'react-router-dom';
const CandidateManagement = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { backendUrl } = useContext(AppContext);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState(null);
    const { setHeaderTitle } = useOutletContext() || {};
    // Hàm fetchCandidates
    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                toast.error("Yêu cầu xác thực Admin.");
                setLoading(false);
                return;
            }
            const response = await axios.get(`${backendUrl}/api/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                console.log('Dữ liệu Users từ API:', response.data.users);
                setCandidates(response.data.users || []);
            } else {
                toast.error(response.data.message || "Không thể tải danh sách ứng viên.");
            }
        } catch (error) {
            console.error("Lỗi tải danh sách ứng viên:", error);
            toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ.");
        } finally {
            setLoading(false);
        }
    };

    // useEffect
    useEffect(() => {
        if (setHeaderTitle) {
            setHeaderTitle("Quản lý ứng viên");
        }
    }, [setHeaderTitle]);
    useEffect(() => {
        if (backendUrl) { fetchCandidates(); }
        else { toast.error("Lỗi cấu hình: Không tìm thấy backend URL."); setLoading(false); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [backendUrl]);

    // Hàm mở modal xác nhận xóa
    const openDeleteConfirmation = (userId, userName) => {
        setCandidateToDelete({ id: userId, name: userName || userId });
        setShowDeleteModal(true);
    };

    // Hàm xử lý xóa ứng viên
    const handleDelete = async () => {
        if (!candidateToDelete) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                toast.error("Yêu cầu xác thực Admin.");
                setShowDeleteModal(false);
                setLoading(false);
                return;
            }

            const response = await axios.delete(`${backendUrl}/api/admin/users/${candidateToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success(response.data.message || `Đã xóa ứng viên "${candidateToDelete.name}"`);
                setCandidates(prevCandidates => prevCandidates.filter(
                    candidate => candidate._id !== candidateToDelete.id
                ));
            } else {
                toast.error(response.data.message || "Xóa ứng viên thất bại.");
            }
        } catch (error) {
            console.error("Lỗi xóa ứng viên:", error);
            toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ khi xóa ứng viên.");
        } finally {
            setLoading(false);
            setShowDeleteModal(false);
            setCandidateToDelete(null);
        }
    };

    // filteredCandidates
    const filteredCandidates = candidates.filter(candidate => {
        const fullName = `${candidate.name || ''}`.trim();
        const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // columns
    const columns = [
        {
            header: 'Tên ứng viên',
            accessor: 'name',
            cell: (nameValue) => nameValue || 'N/A'
        },
        {
            header: 'Email',
            accessor: 'email'
        },
        {
            header: 'Ngày đăng ký',
            accessor: 'createdAt',
            cell: (value) => value ? new Date(value).toLocaleDateString('vi-VN') : 'N/A'
        },
        {
            header: 'Hành động',
            accessor: '_id',
            cell: (userId, row) => (
                <div className="flex space-x-4">
                    <Link
                        to={`/admin/candidates/${userId}`}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-2 py-1 rounded flex items-center"
                        title="Xem chi tiết"
                    >
                        <span className="material-icons text-sm">visibility</span>
                        <span className="ml-1 text-xs">Xem</span>
                    </Link>
                    <button
                        onClick={() => openDeleteConfirmation(userId, row.name)}
                        className="bg-gray-50 hover:bg-gray-100 text-gray-600 px-2 py-1 rounded flex items-center"
                        title="Xóa ứng viên"
                    >
                        <span className="material-icons text-sm">delete</span>
                        <span className="ml-1 text-xs">Xóa</span>
                    </button>
                </div>
            )
        }
    ];

    return (
        <>
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <h3 className="text-lg font-semibold">Danh sách ứng viên</h3>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm theo tên hoặc email..."
                                className="border rounded-lg px-4 py-2 pl-10"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">search</span>
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                            Xuất Excel (Chưa hoạt động)
                        </button>
                    </div>
                </div>

                {/* Hiển thị Loading hoặc DataTable */}
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <Loading />
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredCandidates}
                        emptyMessage="Không tìm thấy ứng viên nào phù hợp"
                    />
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && candidateToDelete && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
                        <div className="flex items-center justify-center text-red-500 mb-4">
                            <span className="material-icons text-5xl">warning</span>
                        </div>
                        <h3 className="text-xl font-bold text-center mb-4">Xác nhận xóa ứng viên</h3>
                        <p className="text-gray-600 mb-6 text-center">
                            Bạn có chắc chắn muốn xóa ứng viên <span className="font-semibold">{candidateToDelete.name}</span>?<br />
                            Tất cả thông tin và đơn ứng tuyển của ứng viên sẽ bị xóa vĩnh viễn.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setCandidateToDelete(null);
                                }}
                                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg flex-1"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex-1"
                            >
                                Xác nhận xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CandidateManagement;
// import React, { useState, useEffect, useContext } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { AppContext } from '../../context/AppContext';
// // ĐÃ XÓA import AdminSidebar
// // ĐÃ XÓA import AdminHeader
// import DataTable from '../../components/admin/DataTable';
// import Loading from '../../components/Loading';

// const CandidateManagement = () => {
//     const [candidates, setCandidates] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const { backendUrl } = useContext(AppContext);

//     // Hàm fetchCandidates giữ nguyên
//     const fetchCandidates = async () => {
//         setLoading(true);
//         try {
//             const token = localStorage.getItem('adminToken');
//             if (!token) {
//                 toast.error("Yêu cầu xác thực Admin.");
//                 setLoading(false);
//                 return;
//             }
//             const response = await axios.get(`${backendUrl}/api/admin/users`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             if (response.data.success) {
//                 console.log('Dữ liệu Users từ API:', response.data.users);
//                 setCandidates(response.data.users || []);
//             } else {
//                 toast.error(response.data.message || "Không thể tải danh sách ứng viên.");
//             }
//         } catch (error) {
//             console.error("Lỗi tải danh sách ứng viên:", error);
//             toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // useEffect giữ nguyên
//     useEffect(() => {
//         if (backendUrl) { fetchCandidates(); }
//         else { toast.error("Lỗi cấu hình: Không tìm thấy backend URL."); setLoading(false); }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [backendUrl]);

//     // Hàm handleDelete giữ nguyên
//     const handleDelete = async (userId, userName) => {
//         if (window.confirm(`Bạn có chắc chắn muốn xóa ứng viên "${userName || userId}" không? Hành động này không thể hoàn tác.`)) { // Thêm fallback nếu userName rỗng
//             setLoading(true);
//             try {
//                 const token = localStorage.getItem('adminToken');
//                 if (!token) { toast.error("Yêu cầu xác thực Admin."); setLoading(false); return; }
//                 const response = await axios.delete(`${backendUrl}/api/admin/users/${userId}`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 if (response.data.success) {
//                     toast.success(response.data.message || `Đã xóa ứng viên "${userName || userId}"`);
//                     setCandidates(prevCandidates => prevCandidates.filter(candidate => candidate._id !== userId));
//                 } else {
//                     toast.error(response.data.message || "Xóa ứng viên thất bại.");
//                 }
//             } catch (error) {
//                 console.error("Lỗi xóa ứng viên:", error);
//                 toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ khi xóa ứng viên.");
//             } finally {
//                 setLoading(false);
//             }
//         }
//     };

//     // filteredCandidates giữ nguyên (lọc theo name, email)
//     const filteredCandidates = candidates.filter(candidate => {
//         const fullName = `${candidate.name || ''}`.trim(); // API trả về name
//         const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
//         return matchesSearch;
//     });

//     // columns - Sửa lại cell cho cột Tên và onClick cho nút Delete
//     const columns = [
//         {
//             header: 'Tên ứng viên',
//             accessor: 'name', // Dùng accessor name
//             cell: (nameValue) => nameValue || 'N/A' // Hiển thị trực tiếp giá trị name
//         },
//         { header: 'Email', accessor: 'email' },
//         {
//             header: 'Ngày đăng ký',
//             accessor: 'createdAt',
//             cell: (value) => value ? new Date(value).toLocaleDateString('vi-VN') : 'N/A'
//         },
//         // Trong phần định nghĩa columns, cập nhật cell của cột Action:

//         {
//             header: 'Hành động',
//             accessor: '_id',
//             cell: (userId, row) => (
//                 <div className="flex space-x-2">
//                     <Link to={`/admin/candidates/${userId}`} className="text-blue-600 hover:text-blue-800" title="Xem chi tiết">
//                         <span className="material-icons text-sm">visibility</span>
//                     </Link>
//                     <button
//                         onClick={() => handleDelete(userId, row.name)}
//                         className="text-red-600 hover:text-red-800"
//                         title="Xóa ứng viên"
//                     >
//                         <span className="material-icons text-sm">delete</span>
//                     </button>
//                 </div>
//             )
//         }

//     ];

//     // ** SỬA LẠI PHẦN RETURN **
//     // Chỉ trả về nội dung cần hiển thị bên trong <Outlet/> của AdminLayout
//     return (
//         <> {/* Sử dụng Fragment thay cho các thẻ div layout cũ */}
//             {/* Phần nội dung của trang Quản lý ứng viên */}
//             <div className="bg-white rounded-lg shadow p-6">
//                 <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
//                     <h3 className="text-lg font-semibold">Danh sách ứng viên</h3>
//                     <div className="flex items-center space-x-4">
//                         {/* Search Input */}
//                         <div className="relative">
//                             <input
//                                 type="text"
//                                 placeholder="Tìm theo tên hoặc email..."
//                                 className="border rounded-lg px-4 py-2 pl-10"
//                                 value={searchTerm}
//                                 onChange={e => setSearchTerm(e.target.value)}
//                             />
//                             <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">search</span>
//                         </div>
//                         <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
//                             Xuất Excel (Chưa hoạt động)
//                         </button>
//                     </div>
//                 </div>

//                 {/* Hiển thị Loading hoặc DataTable */}
//                 {loading ? (
//                     <div className="flex justify-center items-center py-10">
//                         <Loading />
//                     </div>
//                 ) : (
//                     <DataTable
//                         columns={columns}
//                         data={filteredCandidates}
//                         emptyMessage="Không tìm thấy ứng viên nào phù hợp"
//                     />
//                 )}
//             </div>
//         </>
//     );
// };

// export default CandidateManagement;