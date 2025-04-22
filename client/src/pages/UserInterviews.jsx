import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import {
    Calendar, Clock, MapPin, Building, Video, Phone,
    CheckCircle, XCircle, CalendarX, Info, AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageWithFallback from '../components/ImageWithFallback';

const UserInterviews = () => {
    const navigate = useNavigate();
    const { backendUrl, userToken } = useContext(AppContext);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        if (userToken) {
            fetchInterviews();
        }
    }, [userToken]);

    const fetchInterviews = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/api/interviews/user`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            if (data.success) {
                setInterviews(data.interviews);
            } else {
                toast.error(data.message || 'Failed to fetch interviews');
            }
        } catch (error) {
            console.error('Error fetching interviews:', error);
            toast.error('Failed to fetch interviews');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmInterview = async (interviewId) => {
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/interviews/${interviewId}/confirm`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                }
            );

            if (data.success) {
                toast.success('Interview confirmed successfully');
                fetchInterviews(); // Refresh the list
            } else {
                toast.error(data.message || 'Failed to confirm interview');
            }
        } catch (error) {
            console.error('Error confirming interview:', error);
            toast.error('Failed to confirm interview');
        }
    };

    // Filter interviews based on date and status
    const currentDate = new Date();

    const upcomingInterviews = interviews.filter(interview => {
        const interviewDate = new Date(interview.scheduledDate);
        return (
            interviewDate >= currentDate &&
            interview.status !== 'cancelled'
        );
    });

    const pastInterviews = interviews.filter(interview => {
        const interviewDate = new Date(interview.scheduledDate);
        return (
            interviewDate < currentDate ||
            interview.status === 'completed' ||
            interview.status === 'cancelled'
        );
    });

    // Sort interviews by date (newest first for upcoming, oldest first for past)
    upcomingInterviews.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
    pastInterviews.sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));

    const activeInterviews = activeTab === 'upcoming' ? upcomingInterviews : pastInterviews;

    const renderLocationIcon = (location) => {
        switch (location) {
            case 'online':
                return <Video className="text-blue-500" size={18} />;
            case 'onsite':
                return <Building className="text-green-500" size={18} />;
            case 'phone':
                return <Phone className="text-purple-500" size={18} />;
            default:
                return <MapPin className="text-gray-500" size={18} />;
        }
    };

    const renderInterviewTypeLabel = (type) => {
        switch (type) {
            case 'technical':
                return (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        Technical
                    </span>
                );
            case 'hr':
                return (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        HR
                    </span>
                );
            case 'culture':
                return (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Culture Fit
                    </span>
                );
            case 'screening':
                return (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Screening
                    </span>
                );
            case 'final':
                return (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        Final
                    </span>
                );
            default:
                return (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        {type}
                    </span>
                );
        }
    };

    const renderStatusBadge = (status) => {
        switch (status) {
            case 'scheduled':
                return (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Scheduled
                    </span>
                );
            case 'confirmed':
                return (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Confirmed
                    </span>
                );
            case 'rescheduled':
                return (
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                        Rescheduled
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        Cancelled
                    </span>
                );
            case 'completed':
                return (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        Completed
                    </span>
                );
            default:
                return (
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        {status}
                    </span>
                );
        }
    };

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 min-h-screen py-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">My Interviews</h1>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`py-3 px-4 text-sm font-medium ${activeTab === 'upcoming'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Upcoming Interviews
                            {upcomingInterviews.length > 0 && (
                                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                    {upcomingInterviews.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('past')}
                            className={`py-3 px-4 text-sm font-medium ${activeTab === 'past'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Past Interviews
                            {pastInterviews.length > 0 && (
                                <span className="ml-2 bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                                    {pastInterviews.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : activeInterviews.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            {activeTab === 'upcoming' ? (
                                <>
                                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming interviews</h3>
                                    <p className="text-gray-500">
                                        You don't have any upcoming interviews scheduled. Check back later or look in the 'Past Interviews' tab for previous interviews.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <CalendarX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No past interviews</h3>
                                    <p className="text-gray-500">
                                        You don't have any past interviews. When you complete interviews, they will appear here.
                                    </p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activeInterviews.map((interview) => (
                                <div
                                    key={interview._id}
                                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row justify-between">
                                            <div className="mb-4 md:mb-0">
                                                <div className="flex items-center mb-3">
                                                    <div className="flex-shrink-0 mr-3">
                                                        <ImageWithFallback
                                                            src={interview.companyId?.image}
                                                            alt={interview.companyId?.name}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-900">
                                                            {interview.companyId?.name || 'Unknown Company'}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">
                                                            {interview.jobId?.title || 'Unknown Position'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                                    {renderInterviewTypeLabel(interview.interviewType)}
                                                    {renderStatusBadge(interview.status)}
                                                    {interview.userConfirmed && (
                                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                                                            <CheckCircle size={12} className="mr-1" />
                                                            Confirmed
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="space-y-2 text-sm text-gray-600">
                                                    <div className="flex items-center">
                                                        <Calendar size={16} className="mr-2" />
                                                        {new Date(interview.scheduledDate).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock size={16} className="mr-2" />
                                                        {interview.startTime} - {interview.endTime}
                                                    </div>
                                                    <div className="flex items-center">
                                                        {renderLocationIcon(interview.location)}
                                                        <span className="ml-2 capitalize">{interview.location}</span>
                                                        {interview.location === 'online' && interview.meetingLink && (
                                                            <a
                                                                href={interview.meetingLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                                            >
                                                                (Join Meeting)
                                                            </a>
                                                        )}
                                                        {interview.location === 'onsite' && interview.meetingAddress && (
                                                            <span className="ml-2 text-gray-600">
                                                                ({interview.meetingAddress})
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col justify-center">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => navigate(`/interviews/${interview._id}`)}
                                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        View Details
                                                    </button>

                                                    {['scheduled', 'rescheduled'].includes(interview.status) && !interview.userConfirmed && (
                                                        <button
                                                            onClick={() => handleConfirmInterview(interview._id)}
                                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                                                        >
                                                            Confirm Interview
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default UserInterviews;
// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { AppContext } from '../context/AppContext';
// import {
//     Calendar, Clock, MapPin, Building, Video, Phone,
//     CheckCircle, XCircle, CalendarX, Info, AlertCircle
// } from 'lucide-react';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import ImageWithFallback from '../components/ImageWithFallback';

// const UserInterviews = () => {
//     const navigate = useNavigate();
//     const { backendUrl, userToken } = useContext(AppContext);
//     const [interviews, setInterviews] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState('upcoming');

//     useEffect(() => {
//         if (userToken) {
//             fetchInterviews();
//         }
//     }, [userToken]);

//     const fetchInterviews = async () => {
//         try {
//             setLoading(true);
//             const { data } = await axios.get(`${backendUrl}/api/interviews/user`, {
//                 headers: {
//                     'Authorization': `Bearer ${userToken}`
//                 }
//             });

//             if (data.success) {
//                 setInterviews(data.interviews);
//             } else {
//                 toast.error(data.message || 'Failed to fetch interviews');
//             }
//         } catch (error) {
//             console.error('Error fetching interviews:', error);
//             toast.error('Failed to fetch interviews');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleConfirmInterview = async (interviewId) => {
//         try {
//             const { data } = await axios.put(
//                 `${backendUrl}/api/interviews/${interviewId}/confirm`,
//                 {},
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${userToken}`
//                     }
//                 }
//             );

//             if (data.success) {
//                 toast.success('Interview confirmed successfully');
//                 fetchInterviews(); // Refresh the list
//             } else {
//                 toast.error(data.message || 'Failed to confirm interview');
//             }
//         } catch (error) {
//             console.error('Error confirming interview:', error);
//             toast.error('Failed to confirm interview');
//         }
//     };

//     // Filter interviews based on date and status
//     const currentDate = new Date();

//     const upcomingInterviews = interviews.filter(interview => {
//         const interviewDate = new Date(interview.scheduledDate);
//         return (
//             interviewDate >= currentDate &&
//             interview.status !== 'cancelled'
//         );
//     });

//     const pastInterviews = interviews.filter(interview => {
//         const interviewDate = new Date(interview.scheduledDate);
//         return (
//             interviewDate < currentDate ||
//             interview.status === 'completed' ||
//             interview.status === 'cancelled'
//         );
//     });

//     // Sort interviews by date (newest first for upcoming, oldest first for past)
//     upcomingInterviews.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
//     pastInterviews.sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));

//     const activeInterviews = activeTab === 'upcoming' ? upcomingInterviews : pastInterviews;

//     const renderLocationIcon = (location) => {
//         switch (location) {
//             case 'online':
//                 return <Video className="text-blue-500" size={18} />;
//             case 'onsite':
//                 return <Building className="text-green-500" size={18} />;
//             case 'phone':
//                 return <Phone className="text-purple-500" size={18} />;
//             default:
//                 return <MapPin className="text-gray-500" size={18} />;
//         }
//     };

//     const renderInterviewTypeLabel = (type) => {
//         switch (type) {
//             case 'technical':
//                 return (
//                     <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
//                         Technical
//                     </span>
//                 );
//             case 'hr':
//                 return (
//                     <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
//                         HR
//                     </span>
//                 );
//             case 'culture':
//                 return (
//                     <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
//                         Culture Fit
//                     </span>
//                 );
//             case 'screening':
//                 return (
//                     <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
//                         Screening
//                     </span>
//                 );
//             case 'final':
//                 return (
//                     <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
//                         Final
//                     </span>
//                 );
//             default:
//                 return (
//                     <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
//                         {type}
//                     </span>
//                 );
//         }
//     };

//     const renderStatusBadge = (status) => {
//         switch (status) {
//             case 'scheduled':
//                 return (
//                     <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
//                         Scheduled
//                     </span>
//                 );
//             case 'confirmed':
//                 return (
//                     <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
//                         Confirmed
//                     </span>
//                 );
//             case 'rescheduled':
//                 return (
//                     <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
//                         Rescheduled
//                     </span>
//                 );
//             case 'cancelled':
//                 return (
//                     <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
//                         Cancelled
//                     </span>
//                 );
//             case 'completed':
//                 return (
//                     <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
//                         Completed
//                     </span>
//                 );
//             default:
//                 return (
//                     <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
//                         {status}
//                     </span>
//                 );
//         }
//     };

//     return (
//         <>
//             <Navbar />
//             <div className="bg-gray-50 min-h-screen py-10">
//                 <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
//                     <h1 className="text-2xl font-bold text-gray-900 mb-6">My Interviews</h1>

//                     {/* Tabs */}
//                     <div className="flex border-b border-gray-200 mb-6">
//                         <button
//                             onClick={() => setActiveTab('upcoming')}
//                             className={`py-3 px-4 text-sm font-medium ${activeTab === 'upcoming'
//                                     ? 'border-b-2 border-blue-500 text-blue-600'
//                                     : 'text-gray-500 hover:text-gray-700'
//                                 }`}
//                         >
//                             Upcoming Interviews
//                             {upcomingInterviews.length > 0 && (
//                                 <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
//                                     {upcomingInterviews.length}
//                                 </span>
//                             )}
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('past')}
//                             className={`py-3 px-4 text-sm font-medium ${activeTab === 'past'
//                                     ? 'border-b-2 border-blue-500 text-blue-600'
//                                     : 'text-gray-500 hover:text-gray-700'
//                                 }`}
//                         >
//                             Past Interviews
//                             {pastInterviews.length > 0 && (
//                                 <span className="ml-2 bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
//                                     {pastInterviews.length}
//                                 </span>
//                             )}
//                         </button>
//                     </div>

//                     {loading ? (
//                         <div className="flex justify-center items-center h-64">
//                             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                         </div>
//                     ) : activeInterviews.length === 0 ? (
//                         <div className="bg-white rounded-lg shadow-md p-8 text-center">
//                             {activeTab === 'upcoming' ? (
//                                 <>
//                                     <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//                                     <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming interviews</h3>
//                                     <p className="text-gray-500">
//                                         You don't have any upcoming interviews scheduled. Check back later or look in the 'Past Interviews' tab for previous interviews.
//                                     </p>
//                                 </>
//                             ) : (
//                                 <>
//                                     <CalendarX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//                                     <h3 className="text-lg font-medium text-gray-900 mb-2">No past interviews</h3>
//                                     <p className="text-gray-500">
//                                         You don't have any past interviews. When you complete interviews, they will appear here.
//                                     </p>
//                                 </>
//                             )}
//                         </div>
//                     ) : (
//                         <div className="space-y-4">
//                             {activeInterviews.map((interview) => (
//                                 <div
//                                     key={interview._id}
//                                     className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
//                                 >
//                                     <div className="p-6">
//                                         <div className="flex flex-col md:flex-row justify-between">
//                                             <div className="mb-4 md:mb-0">
//                                                 <div className="flex items-center mb-3">
//                                                     <div className="flex-shrink-0 mr-3">
//                                                         <ImageWithFallback
//                                                             src={interview.companyId?.image}
//                                                             alt={interview.companyId?.name}
//                                                             className="h-10 w-10 rounded-full object-cover"
//                                                         />
//                                                     </div>
//                                                     <div>
//                                                         <h3 className="text-lg font-medium text-gray-900">
//                                                             {interview.companyId?.name || 'Unknown Company'}
//                                                         </h3>
//                                                         <p className="text-sm text-gray-600">
//                                                             {interview.jobId?.title || 'Unknown Position'}
//                                                         </p>
//                                                     </div>
//                                                 </div>

//                                                 <div className="flex flex-wrap items-center gap-2 mb-3">
//                                                     {renderInterviewTypeLabel(interview.interviewType)}
//                                                     {renderStatusBadge(interview.status)}
//                                                     {interview.userConfirmed && (
//                                                         <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
//                                                             <CheckCircle size={12} className="mr-1" />
//                                                             Confirmed
//                                                         </span>
//                                                     )}
//                                                 </div>

//                                                 <div className="space-y-2 text-sm text-gray-600">
//                                                     <div className="flex items-center">
//                                                         <Calendar size={16} className="mr-2" />
//                                                         {new Date(interview.scheduledDate).toLocaleDateString('en-US', {
//                                                             weekday: 'long',
//                                                             year: 'numeric',
//                                                             month: 'long',
//                                                             day: 'numeric'
//                                                         })}
//                                                     </div>
//                                                     <div className="flex items-center">
//                                                         <Clock size={16} className="mr-2" />
//                                                         {interview.startTime} - {interview.endTime}
//                                                     </div>
//                                                     <div className="flex items-center">
//                                                         {renderLocationIcon(interview.location)}
//                                                         <span className="ml-2 capitalize">{interview.location}</span>
//                                                         {interview.location === 'online' && interview.meetingLink && (
//                                                             <a
//                                                                 href={interview.meetingLink}
//                                                                 target="_blank"
//                                                                 rel="noopener noreferrer"
//                                                                 className="ml-2 text-blue-600 hover:text-blue-800"
//                                                             >
//                                                                 (Join Meeting)
//                                                             </a>
//                                                         )}
//                                                         {interview.location === 'onsite' && interview.meetingAddress && (
//                                                             <span className="ml-2 text-gray-600">
//                                                                 ({interview.meetingAddress})
//                                                             </span>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             <div className="flex flex-col justify-center">
//                                                 <div className="flex space-x-2">
//                                                     <button
//                                                         onClick={() => navigate(`/interviews/${interview._id}`)}
//                                                         className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//                                                     >
//                                                         View Details
//                                                     </button>

//                                                     {['scheduled', 'rescheduled'].includes(interview.status) && !interview.userConfirmed && (
//                                                         <button
//                                                             onClick={() => handleConfirmInterview(interview._id)}
//                                                             className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
//                                                         >
//                                                             Confirm Interview
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>
//             <Footer />
//         </>
//     );
// };

// export default UserInterviews;