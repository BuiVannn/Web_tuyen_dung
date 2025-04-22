import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Calendar,
    Clock,
    MapPin,
    Building,
    Video,
    Phone,
    CheckCircle,
    XCircle,
    CalendarX,
    AlertCircle,
    Search,
    ExternalLink,
    Filter
} from 'lucide-react';
import ImageWithFallback from '../ImageWithFallback';

const DashboardInterviews = () => {
    const navigate = useNavigate();
    const { backendUrl, userToken } = useContext(AppContext);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleConfirmInterview = async (interviewId, e) => {
        e.preventDefault(); // Prevent navigation when clicking the button
        e.stopPropagation(); // Stop event propagation

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

    // Filter interviews by search term
    const filterInterviews = (interviews) => {
        if (!searchTerm.trim()) return interviews;

        return interviews.filter(interview => {
            const companyName = interview.companyId?.name?.toLowerCase() || '';
            const jobTitle = interview.jobId?.title?.toLowerCase() || '';
            const search = searchTerm.toLowerCase();

            return companyName.includes(search) || jobTitle.includes(search);
        });
    };

    const filteredUpcomingInterviews = filterInterviews(upcomingInterviews);
    const filteredPastInterviews = filterInterviews(pastInterviews);

    const activeInterviews = activeTab === 'upcoming' ? filteredUpcomingInterviews : filteredPastInterviews;

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">My Interviews</h2>
                <p className="text-gray-600 mt-1">Track and manage your upcoming and past interviews</p>
            </div>

            <div className="p-6">
                {/* Tabs and Search */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex border-b border-gray-200 w-full sm:w-auto">
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

                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search interviews..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : activeInterviews.length === 0 ? (
                    <div className="bg-white rounded-lg p-8 text-center">
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

                        {/* Show this message only when user searched something but no results */}
                        {searchTerm && (
                            <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md inline-flex items-center">
                                <AlertCircle size={18} className="mr-2" />
                                No results match your search term "{searchTerm}"
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activeInterviews.map((interview) => (
                            <div
                                key={interview._id}
                                onClick={() => navigate(`/dashboard/interviews/${interview._id}`)}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
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
                                                    {formatDate(interview.scheduledDate)}
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
                                                            className="ml-2 text-blue-600 hover:text-blue-800 flex items-center"
                                                            onClick={(e) => e.stopPropagation()} // Prevent navigation to detail page
                                                        >
                                                            <ExternalLink size={14} className="mr-1" />
                                                            Join Meeting
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-center">
                                            <div className="flex space-x-2">
                                                {['scheduled', 'rescheduled'].includes(interview.status) && !interview.userConfirmed && (
                                                    <button
                                                        onClick={(e) => handleConfirmInterview(interview._id, e)}
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
    );
};

export default DashboardInterviews;