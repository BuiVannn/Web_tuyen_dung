import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Loading from '../../components/Loading';

import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
    Filler
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';

// Đăng ký các component của Chart.js
ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Component StatCard với animation và hover effect
const StatCard = ({ title, value, icon, color, subtitle, percentChange }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-start hover:shadow-lg transition-all duration-300 border-l-4 border-transparent hover:border-l-4 hover:border-l-blue-500">
        <div className={`${color} rounded-full p-3 mr-4 flex items-center justify-center w-12 h-12`}>
            <span className="material-icons text-white">{icon}</span>
        </div>
        <div className="flex-1">
            <h3 className="text-gray-500 text-sm mb-1">{title}</h3>
            <p className="text-2xl font-semibold mb-1">
                {value === null || value === undefined ? '-' : value.toLocaleString()}
            </p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            {percentChange !== undefined && (
                <div className={`mt-2 flex items-center text-xs ${percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <span className="material-icons text-sm mr-1">
                        {percentChange >= 0 ? 'trending_up' : 'trending_down'}
                    </span>
                    <span>{Math.abs(percentChange)}% so với tháng trước</span>
                </div>
            )}
        </div>
    </div>
);

// Component Card dùng cho các widget thống kê
const Card = ({ title, children, className = "" }) => (
    <div className={`bg-white p-5 rounded-lg shadow-md ${className}`}>
        <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">{title}</h3>
        {children}
    </div>
);

// Component ActivityItem
const ActivityItem = ({ time, message, icon, color }) => (
    <div className="flex items-start mb-4">
        <div className={`${color} p-2 rounded-full mr-3`}>
            <span className="material-icons text-white text-sm">{icon}</span>
        </div>
        <div className="flex-1 border-b pb-3">
            <p className="text-sm text-gray-600">{message}</p>
            <span className="text-xs text-gray-500">{time}</span>
        </div>
    </div>
);

// Component JobItem
const JobItem = ({ job }) => (
    <div className="flex items-center justify-between p-3 border-b hover:bg-gray-50">
        <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center overflow-hidden">
                {job.company?.image ? (
                    <img src={job.company.image} alt={job.company?.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="material-icons text-gray-400">business</span>
                )}
            </div>
            <div>
                <h4 className="text-sm font-medium">{job.title}</h4>
                <p className="text-xs text-gray-500">{job.company?.name || 'Công ty không xác định'}</p>
            </div>
        </div>
        <div className="flex flex-col items-end">
            <span className={`text-xs px-2 py-1 rounded-full ${job.status === 'active' ? 'bg-green-100 text-green-800' :
                job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                }`}>
                {job.status === 'active' ? 'Đang hiển thị' :
                    job.status === 'pending' ? 'Chờ duyệt' :
                        job.status}
            </span>
            <span className="text-xs text-gray-500 mt-1">{new Date(job.createdAt).toLocaleDateString('vi-VN')}</span>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        users: { total: null, active: null, newToday: null, newThisWeek: null },
        companies: { total: null, verified: null, newToday: null },
        jobs: { total: null, active: null, pending: null, newToday: null },
        applications: { total: null, pending: null, newToday: null },
        blogs: { total: null, published: null },
        resources: { total: null }
    });
    const [loading, setLoading] = useState(true);
    const [recentJobs, setRecentJobs] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const { backendUrl } = useContext(AppContext);
    const { setHeaderTitle } = useOutletContext() || {};

    const navigate = useNavigate();

    useEffect(() => {
        // Set title cho header khi component mount
        if (setHeaderTitle) {
            setHeaderTitle("Dashboard");
        }
    }, [setHeaderTitle]);

    // Hàm fetchStats để lấy dữ liệu chi tiết
    const fetchStats = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                toast.error("Không tìm thấy token admin. Vui lòng đăng nhập lại.");
                setLoading(false);
                return;
            }

            // Gọi API thống kê chi tiết
            const response = await axios.get(`${backendUrl}/api/admin/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setStats(response.data.stats);

                // Lấy dữ liệu về việc làm gần đây
                const jobsResponse = await axios.get(`${backendUrl}/api/admin/jobs?limit=5`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (jobsResponse.data.success) {
                    setRecentJobs(jobsResponse.data.jobs);
                }

                // Giả lập dữ liệu hoạt động gần đây (trong thực tế cần API riêng)
                setRecentActivities([
                    {
                        time: '10 phút trước',
                        message: 'Ứng viên Nguyễn Văn A đã nộp đơn vào vị trí Kỹ sư phần mềm',
                        icon: 'person',
                        color: 'bg-blue-500'
                    },
                    {
                        time: '30 phút trước',
                        message: 'Công ty XYZ đã đăng tin tuyển dụng mới',
                        icon: 'business',
                        color: 'bg-green-500'
                    },
                    {
                        time: '1 giờ trước',
                        message: 'Admin đã duyệt 5 việc làm mới',
                        icon: 'task_alt',
                        color: 'bg-purple-500'
                    },
                    {
                        time: '3 giờ trước',
                        message: 'Đã có 15 ứng viên mới đăng ký trong ngày hôm nay',
                        icon: 'group_add',
                        color: 'bg-yellow-500'
                    }
                ]);
            } else {
                toast.error(response.data.message || "Không thể tải dữ liệu thống kê.");
            }
        } catch (error) {
            console.error("Lỗi tải dữ liệu Dashboard:", error);
            toast.error(error.response?.data?.message || error.message || "Lỗi máy chủ khi tải dữ liệu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (backendUrl) {
            fetchStats();
        } else {
            toast.error("Lỗi cấu hình: Không tìm thấy backend URL.");
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [backendUrl]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full pt-20">
                <Loading />
            </div>
        );
    }

    // Dữ liệu cho biểu đồ Doughnut (Tình trạng việc làm)
    const jobStatusData = {
        labels: ['Đang hiển thị', 'Chờ duyệt', 'Khác'],
        datasets: [
            {
                data: [stats.jobs.active || 0, stats.jobs.pending || 0, (stats.jobs.total || 0) - (stats.jobs.active || 0) - (stats.jobs.pending || 0)],
                backgroundColor: ['#10B981', '#FBBF24', '#9CA3AF'],
                borderWidth: 0,
            },
        ],
    };

    // Dữ liệu cho biểu đồ Line (số lượng người dùng mới theo tuần)
    const userGrowthData = {
        labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        datasets: [
            {
                label: 'Người dùng mới',
                data: [12, 19, 15, 17, 20, 25, 30], // Dữ liệu mẫu
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.3,
                fill: true,
            },
        ],
    };

    // Dữ liệu cho biểu đồ Bar (số lượng đơn ứng tuyển theo loại việc làm)
    const applicationsByJobType = {
        labels: ['IT', 'Marketing', 'Kế toán', 'Thiết kế', 'Bán hàng', 'Khác'],
        datasets: [
            {
                label: 'Số lượng đơn ứng tuyển',
                data: [65, 45, 37, 28, 50, 30], // Dữ liệu mẫu
                backgroundColor: 'rgba(147, 51, 234, 0.6)',
                borderRadius: 5,
            },
        ],
    };

    return (
        <div className="space-y-8">
            {/* Thống kê tổng quan */}
            <div>
                <h2 className="text-xl font-bold text-gray-700 mb-4">Tổng quan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Tổng số ứng viên"
                        value={stats.users.total}
                        icon="person"
                        color="bg-blue-500"
                        subtitle={`${stats.users.active || 0} người dùng đang hoạt động`}
                        percentChange={8}
                    />
                    <StatCard
                        title="Tổng số nhà tuyển dụng"
                        value={stats.companies.total}
                        icon="business"
                        color="bg-green-500"
                        subtitle={`${stats.companies.verified || 0} công ty đã xác minh`}
                        percentChange={12}
                    />
                    <StatCard
                        title="Tổng số công việc"
                        value={stats.jobs.total}
                        icon="work"
                        color="bg-yellow-500"
                        subtitle={`${stats.jobs.active || 0} việc làm đang hiển thị`}
                        percentChange={-3}
                    />
                    <StatCard
                        title="Tổng số đơn ứng tuyển"
                        value={stats.applications.total}
                        icon="description"
                        color="bg-purple-500"
                        subtitle={`${stats.applications.pending || 0} đơn đang chờ xử lý`}
                        percentChange={15}
                    />
                </div>
            </div>

            {/* Biểu đồ */}
            <div>
                <h2 className="text-xl font-bold text-gray-700 mb-4">Thống kê chi tiết</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Biểu đồ tròn - Tình trạng việc làm */}
                    <Card title="Tình trạng việc làm">
                        <div className="h-64 flex items-center justify-center">
                            <Doughnut
                                data={jobStatusData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: function (context) {
                                                    const label = context.label || '';
                                                    const value = context.formattedValue;
                                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                                    const percentage = Math.round((context.raw / total) * 100);
                                                    return `${label}: ${value} (${percentage}%)`;
                                                }
                                            }
                                        }
                                    },
                                    cutout: '70%'
                                }}
                            />
                        </div>
                    </Card>

                    {/* Biểu đồ đường - Người dùng mới theo tuần */}
                    <Card title="Người dùng mới trong tuần" className="lg:col-span-2">
                        <div className="h-64">
                            <Line
                                data={userGrowthData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false
                                        }
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true
                                        }
                                    }
                                }}
                            />
                        </div>
                    </Card>
                </div>

                {/* Biểu đồ cột - Đơn ứng tuyển theo loại việc làm */}
                <div className="mt-6">
                    <Card title="Đơn ứng tuyển theo loại việc làm">
                        <div className="h-80">
                            <Bar
                                data={applicationsByJobType}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false
                                        }
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true
                                        }
                                    }
                                }}
                            />
                        </div>
                    </Card>
                </div>
            </div>

            {/* Hoạt động gần đây và việc làm mới */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hoạt động gần đây */}
                <Card title="Hoạt động gần đây">
                    <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2">
                        {recentActivities.length > 0 ? (
                            recentActivities.map((activity, index) => (
                                <ActivityItem
                                    key={index}
                                    time={activity.time}
                                    message={activity.message}
                                    icon={activity.icon}
                                    color={activity.color}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm italic">Không có hoạt động nào gần đây</p>
                        )}
                    </div>
                </Card>

                {/* Việc làm mới đăng */}
                <Card title="Việc làm mới đăng">
                    <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2">
                        {recentJobs.length > 0 ? (
                            recentJobs.map((job) => (
                                <JobItem key={job._id} job={job} />
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm italic">Không có việc làm mới nào được đăng gần đây</p>
                        )}
                    </div>
                </Card>
            </div>

            {/* Thống kê khác */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Thống kê blog">
                    <div className="flex justify-around items-center h-full">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-indigo-600">{stats.blogs?.total || 0}</p>
                            <p className="text-sm text-gray-500 mt-1">Tổng số bài viết</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-green-600">{stats.blogs?.published || 0}</p>
                            <p className="text-sm text-gray-500 mt-1">Đã xuất bản</p>
                        </div>
                    </div>
                </Card>

                <Card title="Thống kê tài nguyên">
                    <div className="flex justify-center items-center h-full">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-blue-600">{stats.resources?.total || 0}</p>
                            <p className="text-sm text-gray-500 mt-1">Tổng số tài nguyên</p>
                        </div>
                    </div>
                </Card>

                <Card title="Hoạt động hôm nay">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Ứng viên mới</span>
                            <span className="text-lg font-semibold">{stats.users?.newToday || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Việc làm mới</span>
                            <span className="text-lg font-semibold">{stats.jobs?.newToday || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Đơn ứng tuyển mới</span>
                            <span className="text-lg font-semibold">{stats.applications?.newToday || 0}</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;