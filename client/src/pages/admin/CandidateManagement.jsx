import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import DataTable from '../../components/admin/DataTable';

const CandidateManagement = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Giả lập việc fetch dữ liệu
    useEffect(() => {
        // Trong dự án thực tế, bạn sẽ gọi API ở đây
        setTimeout(() => {
            setCandidates([
                { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', phone: '0901234567', skills: 'React, JavaScript, HTML, CSS', status: 'active', created_at: '10/02/2025' },
                { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com', phone: '0912345678', skills: 'Angular, TypeScript, NodeJS', status: 'active', created_at: '15/02/2025' },
                { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', phone: '0923456789', skills: 'Vue, PHP, Laravel', status: 'inactive', created_at: '20/02/2025' },
                { id: 4, name: 'Phạm Thị D', email: 'phamthid@example.com', phone: '0934567890', skills: 'Java, Spring Boot, SQL', status: 'active', created_at: '25/02/2025' },
                { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@example.com', phone: '0945678901', skills: 'Python, Django, React', status: 'pending', created_at: '01/03/2025' },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    // Xử lý lọc và tìm kiếm
    const filteredCandidates = candidates.filter(candidate => {
        const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || candidate.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const columns = [
        { header: 'Tên ứng viên', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Số điện thoại', accessor: 'phone' },
        { header: 'Kỹ năng', accessor: 'skills' },
        {
            header: 'Trạng thái',
            accessor: 'status',
            cell: (value) => {
                let color = '';
                switch (value) {
                    case 'active': color = 'bg-green-100 text-green-800'; break;
                    case 'inactive': color = 'bg-red-100 text-red-800'; break;
                    case 'pending': color = 'bg-yellow-100 text-yellow-800'; break;
                    default: color = 'bg-gray-100 text-gray-800';
                }
                return <span className={`px-2 py-1 rounded ${color}`}>{value}</span>;
            }
        },
        { header: 'Ngày đăng ký', accessor: 'created_at' },
        {
            header: 'Hành động',
            accessor: 'id',
            cell: (value) => (
                <div className="flex space-x-2">
                    <Link to={`/admin/candidates/${value}`} className="text-blue-600 hover:text-blue-800">
                        <span className="material-icons text-sm">visibility</span>
                    </Link>
                    <button className="text-green-600 hover:text-green-800">
                        <span className="material-icons text-sm">edit</span>
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                        <span className="material-icons text-sm">delete</span>
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader title="Quản lý ứng viên" />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex flex-wrap justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold">Danh sách ứng viên</h3>
                            <div className="flex space-x-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        //placeholder="Tìm kiếm..."
                                        className="border rounded-lg px-4 py-2 pl-10"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                    <span className="material-icons absolute left-3 top-2.5 text-gray-400">search</span>
                                </div>
                                <select
                                    className="border rounded-lg px-4 py-2"
                                    value={filterStatus}
                                    onChange={e => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="active">Đang hoạt động</option>
                                    <option value="inactive">Không hoạt động</option>
                                    <option value="pending">Chờ xác nhận</option>
                                </select>
                                <button className="bg-primary text-white px-4 py-2 rounded-lg">
                                    Xuất Excel
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center py-10">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <DataTable
                                columns={columns}
                                data={filteredCandidates}
                                emptyMessage="Không tìm thấy ứng viên nào"
                            />
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CandidateManagement;