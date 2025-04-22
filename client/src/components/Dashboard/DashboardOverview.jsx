import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import {
    Briefcase, FileText, Calendar, Bookmark, Clock,
    ChevronRight, AlertCircle, AlertTriangle, RefreshCw
} from 'lucide-react';

const DashboardOverview = () => {
    const { backendUrl, userToken, userData } = useContext(AppContext);
    const [stats, setStats] = useState({
        applications: 0,
        interviews: 0,
        savedJobs: 0
    });
    const [upcomingInterviews, setUpcomingInterviews] = useState([]);
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userToken) {
            fetchDashboardData();
        }
    }, [userToken]);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Tải dữ liệu từ API
            const response = await axios.get(`${backendUrl}/api/users/dashboard`, {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });

            if (response.data.success) {
                // Lấy stats từ API
                setStats({
                    ...response.data.stats,
                    // Cập nhật savedJobs từ localStorage
                    savedJobs: JSON.parse(localStorage.getItem("favoriteJobs"))?.length || 0
                });

                // Lấy dữ liệu ứng tuyển gần đây và phỏng vấn sắp tới
                setRecentApplications(response.data.recentApplications || []);
                setUpcomingInterviews(response.data.upcomingInterviews || []);
            } else {
                throw new Error(response.data.message || 'Failed to fetch dashboard data');
            }
        } catch (error) {
            console.error('Dashboard data error:', error);
            setError('Failed to load dashboard data. Please try again later.');

            // Dữ liệu mặc định nếu API lỗi
            const savedJobs = JSON.parse(localStorage.getItem("favoriteJobs")) || [];
            setStats({
                applications: 0,
                interviews: 0,
                savedJobs: savedJobs.length
            });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
            viewing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Reviewing' },
            viewed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Viewed' },
            shortlisted: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Shortlisted' },
            interviewing: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Interviewing' },
            interview_scheduled: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Interview Scheduled' },
            accepted: { bg: 'bg-green-100', text: 'text-green-800', label: 'Accepted' },
            rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
            hired: { bg: 'bg-green-100', text: 'text-green-800', label: 'Hired' }
        };

        const statusInfo = statusMap[status?.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                {statusInfo.label}
            </span>
        );
    };

    const getInterviewStatusBadge = (status) => {
        const statusMap = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
            confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed' },
            completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' },
            canceled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Canceled' },
            rescheduled: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Rescheduled' }
        };

        const statusInfo = statusMap[status?.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>
                {statusInfo.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col items-center justify-center h-64">
                    <AlertTriangle size={48} className="text-red-500 mb-4" />
                    <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Dashboard</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <RefreshCw size={16} className="mr-2" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium text-gray-900">Applications</h3>
                        <div className="p-2 bg-blue-100 rounded-md">
                            <FileText size={20} className="text-blue-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-700">{stats.applications || 0}</p>
                    <div className="mt-2">
                        <Link
                            to="/applications"
                            className="text-sm text-blue-600 inline-flex items-center hover:text-blue-800"
                        >
                            View all applications <ChevronRight size={16} className="ml-1" />
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium text-gray-900">Interviews</h3>
                        <div className="p-2 bg-green-100 rounded-md">
                            <Calendar size={20} className="text-green-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-700">{stats.interviews || 0}</p>
                    <div className="mt-2">
                        <Link
                            to="/interviews"
                            className="text-sm text-green-600 inline-flex items-center hover:text-green-800"
                        >
                            View all interviews <ChevronRight size={16} className="ml-1" />
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium text-gray-900">Saved Jobs</h3>
                        <div className="p-2 bg-purple-100 rounded-md">
                            <Bookmark size={20} className="text-purple-600" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-700">{stats.savedJobs || 0}</p>
                    <div className="mt-2">
                        <Link
                            to="/saved-jobs"
                            className="text-sm text-purple-600 inline-flex items-center hover:text-purple-800"
                        >
                            View saved jobs <ChevronRight size={16} className="ml-1" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Upcoming Interviews */}
            <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Upcoming Interviews</h3>
                </div>
                <div className="p-6">
                    {upcomingInterviews && upcomingInterviews.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Company
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Position
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date & Time
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {upcomingInterviews.map((interview) => (
                                        <tr key={interview._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img className="h-10 w-10 rounded-full object-cover" src={interview.companyId?.image || 'https://via.placeholder.com/40'} alt={interview.companyId?.name} />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{interview.companyId?.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{interview.jobId?.title}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{formatDate(interview.scheduledTime)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getInterviewStatusBadge(interview.status)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <Calendar size={40} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming interviews</h3>
                            <p className="text-gray-500 mb-4">You don't have any interviews scheduled in the near future.</p>
                            <Link
                                to="/"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Find more jobs
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Recent Applications</h3>
                </div>
                <div className="p-6">
                    {recentApplications && recentApplications.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Job Title
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Company
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Applied Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentApplications.map((application) => (
                                        <tr key={application._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{application.jobId?.title}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img className="h-10 w-10 rounded-full object-cover" src={application.companyId?.image || 'https://via.placeholder.com/40'} alt={application.companyId?.name} />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm text-gray-900">{application.companyId?.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{formatDate(application.date || application.createdAt)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(application.status)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <Briefcase size={40} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No recent applications</h3>
                            <p className="text-gray-500 mb-4">You haven't applied to any jobs recently.</p>
                            <Link
                                to="/"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Explore jobs
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
// import React, { useState, useEffect, useContext } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { AppContext } from '../../context/AppContext';
// import {
//     Calendar, Clock, Briefcase, FileText, Bookmark, ChevronRight,
//     Building, Search, MapPin, Phone, Video, CheckCircle, XCircle
// } from 'lucide-react';
// import ImageWithFallback from '../ImageWithFallback';

// const DashboardOverview = () => {
//     const { backendUrl, userToken, userData } = useContext(AppContext);
//     const [stats, setStats] = useState({
//         applications: 0,
//         interviews: 0,
//         savedJobs: 0
//     });
//     const [upcomingInterviews, setUpcomingInterviews] = useState([]);
//     const [recentApplications, setRecentApplications] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (userToken) {
//             fetchDashboardData();
//         }
//     }, [userToken]);

//     const fetchDashboardData = async () => {
//         try {
//             setLoading(true);
//             // Fetch stats & summary data
//             const statsPromise = axios.get(`${backendUrl}/api/users/dashboard/stats`, {
//                 headers: { 'Authorization': `Bearer ${userToken}` }
//             });

//             // Fetch upcoming interviews
//             const interviewsPromise = axios.get(`${backendUrl}/api/users/upcoming-interviews`, {
//                 headers: { 'Authorization': `Bearer ${userToken}` }
//             });

//             // Fetch recent applications
//             const applicationsPromise = axios.get(`${backendUrl}/api/users/applications?limit=3`, {
//                 headers: { 'Authorization': `Bearer ${userToken}` }
//             });

//             // Wait for all requests to complete
//             const [statsResponse, interviewsResponse, applicationsResponse] = await Promise.all([
//                 statsPromise, interviewsPromise, applicationsPromise
//             ]);

//             if (statsResponse.data.success) {
//                 setStats(statsResponse.data.stats);
//             }

//             if (interviewsResponse.data.success) {
//                 setUpcomingInterviews(interviewsResponse.data.upcomingInterviews);
//             }

//             if (applicationsResponse.data.success) {
//                 setRecentApplications(applicationsResponse.data.applications.slice(0, 3));
//             }
//         } catch (error) {
//             console.error('Error fetching dashboard data:', error);
//             toast.error('Failed to load dashboard data');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             month: 'short',
//             day: 'numeric',
//             year: 'numeric'
//         });
//     };

//     const getStatusBadge = (status) => {
//         switch (status) {
//             case 'pending':
//                 return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>;
//             case 'reviewing':
//                 return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Reviewing</span>;
//             case 'shortlisted':
//                 return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Shortlisted</span>;
//             case 'rejected':
//                 return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Rejected</span>;
//             case 'interviewing':
//                 return <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Interviewing</span>;
//             case 'offered':
//                 return <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">Offered</span>;
//             case 'hired':
//                 return <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">Hired</span>;
//             case 'withdrawn':
//                 return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Withdrawn</span>;
//             default:
//                 return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full capitalize">{status}</span>;
//         }
//     };

//     const getInterviewStatusBadge = (status) => {
//         switch (status) {
//             case 'scheduled':
//                 return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Scheduled</span>;
//             case 'confirmed':
//                 return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Confirmed</span>;
//             case 'completed':
//                 return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Completed</span>;
//             case 'cancelled':
//                 return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Cancelled</span>;
//             case 'rescheduled':
//                 return <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">Rescheduled</span>;
//             default:
//                 return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full capitalize">{status}</span>;
//         }
//     };

//     return (
//         <div className="space-y-6">
//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="bg-white rounded-lg shadow-sm p-6">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="text-sm font-medium text-gray-500">Applications</p>
//                             <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.applications}</h3>
//                         </div>
//                         <div className="bg-blue-100 p-3 rounded-full">
//                             <FileText size={20} className="text-blue-600" />
//                         </div>
//                     </div>
//                     <Link
//                         to="/dashboard/applications"
//                         className="text-sm text-blue-600 flex items-center mt-4 hover:text-blue-800"
//                     >
//                         View All <ChevronRight size={16} className="ml-1" />
//                     </Link>
//                 </div>
//                 <div className="bg-white rounded-lg shadow-sm p-6">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="text-sm font-medium text-gray-500">Interviews</p>
//                             <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.interviews}</h3>
//                         </div>
//                         <div className="bg-green-100 p-3 rounded-full">
//                             <Calendar size={20} className="text-green-600" />
//                         </div>
//                     </div>
//                     <Link
//                         to="/dashboard/interviews"
//                         className="text-sm text-blue-600 flex items-center mt-4 hover:text-blue-800"
//                     >
//                         View All <ChevronRight size={16} className="ml-1" />
//                     </Link>
//                 </div>
//                 <div className="bg-white rounded-lg shadow-sm p-6">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="text-sm font-medium text-gray-500">Saved Jobs</p>
//                             <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.savedJobs}</h3>
//                         </div>
//                         <div className="bg-purple-100 p-3 rounded-full">
//                             <Bookmark size={20} className="text-purple-600" />
//                         </div>
//                     </div>
//                     <Link
//                         to="/dashboard/saved-jobs"
//                         className="text-sm text-blue-600 flex items-center mt-4 hover:text-blue-800"
//                     >
//                         View All <ChevronRight size={16} className="ml-1" />
//                     </Link>
//                 </div>
//             </div>

//             {/* Upcoming Interviews */}
//             <div className="bg-white rounded-lg shadow-sm p-6">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-lg font-medium text-gray-900">Upcoming Interviews</h2>
//                     <Link
//                         to="/dashboard/interviews"
//                         className="text-sm text-blue-600 hover:text-blue-800"
//                     >
//                         View All
//                     </Link>
//                 </div>

//                 {loading ? (
//                     <div className="flex justify-center py-6">
//                         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//                     </div>
//                 ) : upcomingInterviews.length > 0 ? (
//                     <div className="space-y-4">
//                         {upcomingInterviews.map(interview => (
//                             <div key={interview._id} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
//                                 <div className="flex justify-between items-start mb-2">
//                                     <div className="flex items-start space-x-3">
//                                         <div className="flex-shrink-0">
//                                             <ImageWithFallback
//                                                 src={interview.companyId?.image}
//                                                 alt={interview.companyId?.name}
//                                                 className="h-10 w-10 rounded-full object-cover"
//                                             />
//                                         </div>
//                                         <div>
//                                             <h3 className="font-medium text-gray-900">{interview.jobId?.title || 'Interview'}</h3>
//                                             <p className="text-sm text-gray-600">{interview.companyId?.name}</p>
//                                         </div>
//                                     </div>
//                                     {getInterviewStatusBadge(interview.status)}
//                                 </div>
//                                 <div className="flex flex-wrap gap-2 text-sm text-gray-600 mt-2">
//                                     <div className="flex items-center">
//                                         <Calendar size={14} className="mr-1 text-gray-400" />
//                                         {formatDate(interview.scheduledDate)}
//                                     </div>
//                                     <div className="flex items-center">
//                                         <Clock size={14} className="mr-1 text-gray-400" />
//                                         {interview.startTime} - {interview.endTime}
//                                     </div>
//                                     <div className="flex items-center">
//                                         {interview.location === 'online' ? (
//                                             <Video size={14} className="mr-1 text-blue-500" />
//                                         ) : interview.location === 'onsite' ? (
//                                             <Building size={14} className="mr-1 text-green-500" />
//                                         ) : (
//                                             <Phone size={14} className="mr-1 text-purple-500" />
//                                         )}
//                                         <span className="capitalize">{interview.location}</span>
//                                     </div>
//                                 </div>
//                                 <div className="mt-3">
//                                     <Link
//                                         to={`/dashboard/interviews/${interview._id}`}
//                                         className="text-sm text-blue-600 hover:text-blue-800"
//                                     >
//                                         View Details
//                                     </Link>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="text-center py-8 text-gray-500">
//                         <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-3" />
//                         <p>You don't have any upcoming interviews.</p>
//                     </div>
//                 )}
//             </div>

//             {/* Recent Applications */}
//             <div className="bg-white rounded-lg shadow-sm p-6">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
//                     <Link
//                         to="/dashboard/applications"
//                         className="text-sm text-blue-600 hover:text-blue-800"
//                     >
//                         View All
//                     </Link>
//                 </div>

//                 {loading ? (
//                     <div className="flex justify-center py-6">
//                         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//                     </div>
//                 ) : recentApplications.length > 0 ? (
//                     <div className="overflow-hidden">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Company
//                                     </th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Job
//                                     </th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Date
//                                     </th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Status
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {recentApplications.map(application => (
//                                     <tr key={application._id} className="hover:bg-gray-50">
//                                         <td className="px-4 py-3 whitespace-nowrap">
//                                             <div className="flex items-center">
//                                                 <ImageWithFallback
//                                                     src={application.companyId?.image}
//                                                     alt={application.companyId?.name}
//                                                     className="h-8 w-8 rounded-full mr-2 object-cover"
//                                                 />
//                                                 <span className="text-sm text-gray-900">
//                                                     {application.companyId?.name}
//                                                 </span>
//                                             </div>
//                                         </td>
//                                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
//                                             {application.jobId?.title}
//                                         </td>
//                                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                                             {formatDate(application.date)}
//                                         </td>
//                                         <td className="px-4 py-3 whitespace-nowrap">
//                                             {getStatusBadge(application.status)}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 ) : (
//                     <div className="text-center py-8 text-gray-500">
//                         <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
//                         <p>You haven't applied to any jobs yet.</p>
//                         <Link
//                             to="/"
//                             className="text-blue-600 mt-2 inline-block hover:text-blue-800"
//                         >
//                             Browse Jobs
//                         </Link>
//                     </div>
//                 )}
//             </div>

//             {/* Find Jobs CTA */}
//             <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-sm p-6 text-white">
//                 <h2 className="text-xl font-semibold mb-2">Ready to find your next opportunity?</h2>
//                 <p className="mb-4 text-blue-100">Search from thousands of jobs matching your skills and experience.</p>
//                 <Link
//                     to="/"
//                     className="inline-flex items-center px-4 py-2 bg-white text-blue-700 rounded-md shadow-sm hover:bg-blue-50"
//                 >
//                     <Search size={16} className="mr-2" />
//                     Search Jobs
//                 </Link>
//             </div>
//         </div>
//     );
// };

// export default DashboardOverview;