import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalCandidates: 0,
        totalRecruiters: 0,
        totalJobs: 0,
        newApplications: 0
    });

    // Giả lập việc fetch dữ liệu
    useEffect(() => {
        // Trong dự án thực tế, bạn sẽ gọi API ở đây
        setStats({
            totalCandidates: 1250,
            totalRecruiters: 320,
            totalJobs: 845,
            newApplications: 68
        });
    }, []);

    // Dữ liệu chart giả lập
    const recentActivities = [
        { id: 1, user: 'Nguyễn Văn A', action: 'đã đăng ký tài khoản ứng viên', time: '10 phút trước' },
        { id: 2, user: 'Công ty XYZ', action: 'đã đăng tin tuyển dụng mới', time: '30 phút trước' },
        { id: 3, user: 'Trần Thị B', action: 'đã ứng tuyển vào vị trí Frontend Developer', time: '1 giờ trước' },
        { id: 4, user: 'Công ty ABC', action: 'đã cập nhật thông tin công ty', time: '2 giờ trước' }
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader title="Dashboard" />
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Thẻ thống kê */}
                        <StatCard title="Tổng số ứng viên" value={stats.totalCandidates} icon="person" color="bg-blue-500" />
                        <StatCard title="Tổng số nhà tuyển dụng" value={stats.totalRecruiters} icon="business" color="bg-green-500" />
                        <StatCard title="Tổng số công việc" value={stats.totalJobs} icon="work" color="bg-yellow-500" />
                        <StatCard title="Đơn ứng tuyển mới" value={stats.newApplications} icon="description" color="bg-purple-500" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Biểu đồ và hoạt động gần đây */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4">Thống kê người dùng</h3>
                            <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                                <p className="text-gray-500">Biểu đồ thống kê sẽ hiển thị tại đây</p>
                            </div>
                        </div>

                        {/* <div className="bg-white rounded-lg shadow p-6"> */}
                        {/* <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3> */}
                        {/* <ul className="divide-y divide-gray-200"> */}
                        {/* {recentActivities.map((activity) => ( */}
                        {/* <li key={activity.id} className="py-3"> */}
                        {/* <p className="text-sm"> */}
                        {/* <span className="font-medium">{activity.user}</span> {activity.action} */}
                        {/* </p> */}
                        {/* <p className="text-xs text-gray-500">{activity.time}</p> */}
                        {/* </li>))} */}
                        {/* </ul> */}
                        {/* </div> */}
                    </div>

                    <div className="mt-6 bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4">Việc làm mới đăng</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Tiêu đề</th>
                                        <th className="px-4 py-3 text-left">Công ty</th>
                                        <th className="px-4 py-3 text-left">Ngày đăng</th>
                                        <th className="px-4 py-3 text-left">Trạng thái</th>
                                        <th className="px-4 py-3 text-left">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-4 py-3">Frontend Developer</td>
                                        <td className="px-4 py-3">Công ty ABC</td>
                                        <td className="px-4 py-3">15/03/2025</td>
                                        <td className="px-4 py-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded">Đang hiển thị</span></td>
                                        <td className="px-4 py-3">
                                            <button className="text-blue-600 hover:text-blue-800 mr-2">Xem</button>
                                            <button className="text-red-600 hover:text-red-800">Ẩn</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3">Backend Developer</td>
                                        <td className="px-4 py-3">Công ty XYZ</td>
                                        <td className="px-4 py-3">16/03/2025</td>
                                        <td className="px-4 py-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded">Đang hiển thị</span></td>
                                        <td className="px-4 py-3">
                                            <button className="text-blue-600 hover:text-blue-800 mr-2">Xem</button>
                                            <button className="text-red-600 hover:text-red-800">Ẩn</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

// Component StatCard
const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6 flex items-start">
        <div className={`${color} rounded-full p-3 mr-4`}>
            <span className="material-icons text-white">{icon}</span>
        </div>
        <div>
            <h3 className="text-gray-500 text-sm">{title}</h3>
            <p className="text-2xl font-semibold">{value.toLocaleString()}</p>
        </div>
    </div>
);

export default AdminDashboard;