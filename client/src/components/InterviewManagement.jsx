import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import {
    Calendar, Clock, MapPin, User, Briefcase, CheckCircle, XCircle,
    AlertCircle, Calendar as CalendarIcon, Video, Phone, Building
} from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';
import Loading from '../components/Loading';

const InterviewManagement = () => {
    const navigate = useNavigate();
    const { backendUrl, companyToken } = useContext(AppContext);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [applications, setApplications] = useState([]);
    const [filteredByStatus, setFilteredByStatus] = useState('all');

    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState(null);

    const fetchInterviews = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/api/interviews/company`, {
                headers: {
                    'Authorization': `Bearer ${companyToken}`
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

    const fetchApplications = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/companies/applicants`, {
                headers: {
                    'Authorization': `Bearer ${companyToken}`
                }
            });

            if (data.success) {
                // Filter applications with status 'shortlisted' or 'viewed'
                const eligibleApplications = data.applications.filter(
                    app => app.status === 'interviewing'
                );
                setApplications(eligibleApplications);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to fetch eligible applications');
        }
    };

    useEffect(() => {
        if (companyToken) {
            fetchInterviews();
        }
    }, [companyToken]);

    const handleCancelInterview = async (interviewId) => {
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/interviews/${interviewId}/cancel`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${companyToken}`
                    }
                }
            );

            if (data.success) {
                toast.success('Interview cancelled successfully');
                fetchInterviews(); // Refresh the list
            } else {
                toast.error(data.message || 'Failed to cancel interview');
            }
        } catch (error) {
            console.error('Error cancelling interview:', error);
            toast.error('Failed to cancel interview');
        }
    };

    // Cập nhật hàm handleCompleteInterview khoảng dòng 82-100
    const handleCompleteInterview = async (interviewId) => {
        try {
            // Check thời gian phỏng vấn
            const interview = interviews.find(int => int._id === interviewId);
            if (!interview) {
                toast.error('Không tìm thấy thông tin phỏng vấn');
                return;
            }

            // Kiểm tra xem người dùng đã xác nhận chưa
            if (!interview.userConfirmed) {
                toast.error('Ứng viên chưa xác nhận tham gia phỏng vấn');
                return;
            }

            // Kiểm tra thời gian hiện tại so với thời gian phỏng vấn
            const now = new Date();
            const interviewDate = new Date(interview.scheduledDate);
            const [endHours, endMinutes] = interview.endTime.split(':').map(Number);
            interviewDate.setHours(endHours, endMinutes, 0, 0);

            if (now < interviewDate) {
                toast.warning('Chưa thể hoàn thành cuộc phỏng vấn vì chưa đến giờ kết thúc');
                return;
            }

            const { data } = await axios.put(
                `${backendUrl}/api/interviews/${interviewId}/complete`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${companyToken}`
                    }
                }
            );

            if (data.success) {
                toast.success('Interview marked as completed');
                fetchInterviews(); // Refresh the list
            } else {
                toast.error(data.message || 'Failed to update interview status');
            }
        } catch (error) {
            console.error('Error completing interview:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Lỗi khi cập nhật trạng thái phỏng vấn');
            }
        }
    };
    const handleRescheduleClick = (interview) => {
        setSelectedInterview(interview);
        setShowRescheduleModal(true);
    };

    // Filter interviews based on selected status
    const filteredInterviews = filteredByStatus === 'all'
        ? interviews
        : interviews.filter(interview => interview.status === filteredByStatus);

    // Group interviews by date
    const groupedInterviews = filteredInterviews.reduce((groups, interview) => {
        const date = new Date(interview.scheduledDate).toLocaleDateString();
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(interview);
        return groups;
    }, {});

    // Sort dates
    const sortedDates = Object.keys(groupedInterviews).sort((a, b) =>
        new Date(a) - new Date(b)
    );

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
                        Culture
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

    const renderInterviewLocationIcon = (location) => {
        switch (location) {
            case 'online':
                return <Video className="text-blue-600" size={16} />;
            case 'onsite':
                return <Building className="text-green-600" size={16} />;
            case 'phone':
                return <Phone className="text-yellow-600" size={16} />;
            default:
                return <MapPin className="text-gray-600" size={16} />;
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
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Interview Management</h1>
                <button
                    onClick={() => {
                        fetchApplications();
                        setShowScheduleModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                    Schedule New Interview
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md mb-6 p-4">
                <div className="flex flex-wrap gap-3 mb-4">
                    <button
                        onClick={() => setFilteredByStatus('all')}
                        className={`px-3 py-1 text-sm rounded-full ${filteredByStatus === 'all'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilteredByStatus('scheduled')}
                        className={`px-3 py-1 text-sm rounded-full ${filteredByStatus === 'scheduled'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-yellow-100 text-yellow-800'
                            }`}
                    >
                        Scheduled
                    </button>
                    <button
                        onClick={() => setFilteredByStatus('confirmed')}
                        className={`px-3 py-1 text-sm rounded-full ${filteredByStatus === 'confirmed'
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-800'
                            }`}
                    >
                        Confirmed
                    </button>
                    <button
                        onClick={() => setFilteredByStatus('rescheduled')}
                        className={`px-3 py-1 text-sm rounded-full ${filteredByStatus === 'rescheduled'
                            ? 'bg-orange-600 text-white'
                            : 'bg-orange-100 text-orange-800'
                            }`}
                    >
                        Rescheduled
                    </button>
                    <button
                        onClick={() => setFilteredByStatus('cancelled')}
                        className={`px-3 py-1 text-sm rounded-full ${filteredByStatus === 'cancelled'
                            ? 'bg-red-600 text-white'
                            : 'bg-red-100 text-red-800'
                            }`}
                    >
                        Cancelled
                    </button>
                    <button
                        onClick={() => setFilteredByStatus('completed')}
                        className={`px-3 py-1 text-sm rounded-full ${filteredByStatus === 'completed'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-800'
                            }`}
                    >
                        Completed
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loading />
                </div>
            ) : filteredInterviews.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews found</h3>
                    <p className="text-gray-500 mb-6">
                        {filteredByStatus === 'all'
                            ? "You haven't scheduled any interviews yet."
                            : `No interviews with status "${filteredByStatus}" found.`}
                    </p>
                    <button
                        onClick={() => {
                            fetchApplications();
                            setShowScheduleModal(true);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Schedule Interview
                    </button>
                </div>
            ) : (
                <div className="space-y-8">
                    {sortedDates.map(date => (
                        <div key={date} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {new Date(date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </h2>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {groupedInterviews[date].map(interview => (
                                    <div
                                        key={interview._id}
                                        className="p-6 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0">
                                                    <ImageWithFallback
                                                        src={interview.userId?.image}
                                                        alt={interview.userId?.name}
                                                        className="h-12 w-12 rounded-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-medium">
                                                        {interview.userId?.name || 'Unnamed Candidate'}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {interview.jobId?.title || 'Unnamed Position'}
                                                    </p>
                                                    <div className="flex items-center space-x-4 mt-2">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Clock size={16} className="mr-1" />
                                                            {interview.startTime} - {interview.endTime}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            {renderInterviewLocationIcon(interview.location)}
                                                            <span className="ml-1 capitalize">{interview.location}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                                <div className="flex space-x-2">
                                                    {renderInterviewTypeLabel(interview.interviewType)}
                                                    {renderStatusBadge(interview.status)}
                                                </div>

                                                <div className="flex space-x-2">
                                                    {interview.status !== 'cancelled' && interview.status !== 'completed' && (
                                                        <>
                                                            <button
                                                                onClick={() => navigate(`/dashboard/interviews/${interview._id}`)}
                                                                className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm"
                                                            >
                                                                View details
                                                            </button>
                                                            <button
                                                                onClick={() => handleRescheduleClick(interview)}
                                                                className="text-orange-600 hover:bg-orange-50 px-3 py-1 rounded text-sm"
                                                            >
                                                                Reschedule
                                                            </button>
                                                            <button
                                                                onClick={() => handleCancelInterview(interview._id)}
                                                                className="text-red-600 hover:bg-red-50 px-3 py-1 rounded text-sm"
                                                            >
                                                                Cancel
                                                            </button>
                                                            {/* Chỉ hiển thị nút Complete khi người dùng đã xác nhận và đã qua thời gian phỏng vấn */}
                                                            {(interview.status === 'confirmed' || interview.status === 'rescheduled') &&
                                                                interview.userConfirmed &&
                                                                new Date() > new Date(new Date(interview.scheduledDate).setHours(
                                                                    parseInt(interview.endTime.split(':')[0]),
                                                                    parseInt(interview.endTime.split(':')[1])
                                                                )) && (
                                                                    <button
                                                                        onClick={() => handleCompleteInterview(interview._id)}
                                                                        className="text-green-600 hover:bg-green-50 px-3 py-1 rounded text-sm"
                                                                    >
                                                                        Complete
                                                                    </button>
                                                                )}
                                                        </>
                                                    )}

                                                    {(interview.status === 'cancelled' || interview.status === 'completed') && (
                                                        <button
                                                            onClick={() => navigate(`/dashboard/interviews/${interview._id}`)}
                                                            className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm"
                                                        >
                                                            View details
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Schedule Interview Modal */}
            {showScheduleModal && (
                <ScheduleInterviewModal
                    applications={applications}
                    onClose={() => setShowScheduleModal(false)}
                    onSuccess={() => {
                        fetchInterviews();
                        setShowScheduleModal(false);
                    }}
                />
            )}
            {/* Reschedule Interview Modal - Thêm đoạn này */}
            {showRescheduleModal && selectedInterview && (
                <RescheduleInterviewModal
                    interview={selectedInterview}
                    onClose={() => {
                        setShowRescheduleModal(false);
                        setSelectedInterview(null);
                    }}
                    onSuccess={() => {
                        fetchInterviews();
                        setShowRescheduleModal(false);
                        setSelectedInterview(null);
                    }}
                />
            )}
        </div>
    );
};

const ScheduleInterviewModal = ({ applications, onClose, onSuccess }) => {
    const { backendUrl, companyToken } = useContext(AppContext);
    const [formData, setFormData] = useState({
        applicationId: '',
        scheduledDate: '',
        startTime: '09:00',
        endTime: '10:00',
        location: 'online',
        meetingLink: '',
        meetingAddress: '',
        interviewType: 'screening',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.applicationId) newErrors.applicationId = 'Please select a candidate';
        if (!formData.scheduledDate) newErrors.scheduledDate = 'Please select a date';
        if (!formData.startTime) newErrors.startTime = 'Please select a start time';
        if (!formData.endTime) newErrors.endTime = 'Please select an end time';

        if (formData.location === 'online' && !formData.meetingLink) {
            newErrors.meetingLink = 'Please provide a meeting link for online interviews';
        }

        if (formData.location === 'onsite' && !formData.meetingAddress) {
            newErrors.meetingAddress = 'Please provide an address for onsite interviews';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/interviews/schedule`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${companyToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data.success) {
                toast.success('Interview scheduled successfully');
                onSuccess();
            } else {
                toast.error(data.message || 'Failed to schedule interview');
            }
        } catch (error) {
            console.error('Error scheduling interview:', error);
            toast.error(error.response?.data?.message || 'Failed to schedule interview');
        } finally {
            setLoading(false);
        }
    };

    // Calculate tomorrow's date for min date input
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">Schedule New Interview</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                            <XCircle size={24} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Candidate Selection */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Candidate
                            </label>
                            <select
                                name="applicationId"
                                value={formData.applicationId}
                                onChange={handleChange}
                                className={`block w-full rounded-md border ${errors.applicationId ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                            >
                                <option value="">-- Select a candidate --</option>
                                {applications.map(app => (
                                    <option key={app._id} value={app._id}>
                                        {app.userId?.name} - {app.jobId?.title}
                                    </option>
                                ))}
                            </select>
                            {errors.applicationId && (
                                <p className="mt-1 text-sm text-red-600">{errors.applicationId}</p>
                            )}
                        </div>

                        {/* Date and Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Interview Date
                            </label>
                            <input
                                type="date"
                                name="scheduledDate"
                                value={formData.scheduledDate}
                                onChange={handleChange}
                                min={minDate}
                                className={`block w-full rounded-md border ${errors.scheduledDate ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {errors.scheduledDate && (
                                <p className="mt-1 text-sm text-red-600">{errors.scheduledDate}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Time
                                </label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className={`block w-full rounded-md border ${errors.startTime ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                                {errors.startTime && (
                                    <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Time
                                </label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    className={`block w-full rounded-md border ${errors.endTime ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                                {errors.endTime && (
                                    <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
                                )}
                            </div>
                        </div>

                        {/* Interview Type and Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Interview Type
                            </label>
                            <select
                                name="interviewType"
                                value={formData.interviewType}
                                onChange={handleChange}
                                className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="screening">Screening</option>
                                <option value="technical">Technical</option>
                                <option value="hr">HR</option>
                                <option value="culture">Culture Fit</option>
                                <option value="final">Final</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Interview Location
                            </label>
                            <select
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="online">Online</option>
                                <option value="onsite">On-site</option>
                                <option value="phone">Phone</option>
                            </select>
                        </div>

                        {/* Meeting Details */}
                        {formData.location === 'online' && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Meeting Link
                                </label>
                                <input
                                    type="text"
                                    name="meetingLink"
                                    value={formData.meetingLink}
                                    onChange={handleChange}
                                    placeholder="e.g., https://zoom.us/j/..."
                                    className={`block w-full rounded-md border ${errors.meetingLink ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                                {errors.meetingLink && (
                                    <p className="mt-1 text-sm text-red-600">{errors.meetingLink}</p>
                                )}
                            </div>
                        )}

                        {formData.location === 'onsite' && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Meeting Address
                                </label>
                                <input
                                    type="text"
                                    name="meetingAddress"
                                    value={formData.meetingAddress}
                                    onChange={handleChange}
                                    placeholder="e.g., 123 Office Street, Suite 100"
                                    className={`block w-full rounded-md border ${errors.meetingAddress ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                                {errors.meetingAddress && (
                                    <p className="mt-1 text-sm text-red-600">{errors.meetingAddress}</p>
                                )}
                            </div>
                        )}

                        {/* Notes */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Additional Notes (Optional)
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={4}
                                className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Add any additional information for the candidate..."
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                            {loading ? 'Scheduling...' : 'Schedule Interview'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Thêm vào dưới component ScheduleInterviewModal
const RescheduleInterviewModal = ({ interview, onClose, onSuccess }) => {
    const { backendUrl, companyToken } = useContext(AppContext);
    const [formData, setFormData] = useState({
        scheduledDate: new Date(interview.scheduledDate).toISOString().split('T')[0],
        startTime: interview.startTime,
        endTime: interview.endTime,
        location: interview.location,
        meetingLink: interview.meetingLink || '',
        meetingAddress: interview.meetingAddress || '',
        notes: interview.notes || ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.scheduledDate) newErrors.scheduledDate = 'Vui lòng chọn ngày';
        if (!formData.startTime) newErrors.startTime = 'Vui lòng chọn giờ bắt đầu';
        if (!formData.endTime) newErrors.endTime = 'Vui lòng chọn giờ kết thúc';

        if (formData.location === 'online' && !formData.meetingLink) {
            newErrors.meetingLink = 'Vui lòng cung cấp đường dẫn họp cho phỏng vấn trực tuyến';
        }

        if (formData.location === 'onsite' && !formData.meetingAddress) {
            newErrors.meetingAddress = 'Vui lòng cung cấp địa chỉ cho phỏng vấn trực tiếp';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/interviews/${interview._id}/reschedule`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${companyToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data.success) {
                toast.success('Đã lên lịch lại phỏng vấn thành công');
                onSuccess();
            } else {
                toast.error(data.message || 'Không thể lên lịch lại phỏng vấn');
            }
        } catch (error) {
            console.error('Lỗi khi lên lịch lại phỏng vấn:', error);
            toast.error(error.response?.data?.message || 'Không thể lên lịch lại phỏng vấn');
        } finally {
            setLoading(false);
        }
    };

    // Calculate tomorrow's date for min date input
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">Lên lịch lại phỏng vấn</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                            <XCircle size={24} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <div className="flex items-center space-x-2 mb-2">
                            <User size={20} className="text-gray-500" />
                            <span className="font-medium">{interview.userId?.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Briefcase size={20} className="text-gray-500" />
                            <span>{interview.jobId?.title}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Date and Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ngày phỏng vấn
                            </label>
                            <input
                                type="date"
                                name="scheduledDate"
                                value={formData.scheduledDate}
                                onChange={handleChange}
                                min={minDate}
                                className={`block w-full rounded-md border ${errors.scheduledDate ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                            />
                            {errors.scheduledDate && (
                                <p className="mt-1 text-sm text-red-600">{errors.scheduledDate}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Giờ bắt đầu
                                </label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className={`block w-full rounded-md border ${errors.startTime ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                                {errors.startTime && (
                                    <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Giờ kết thúc
                                </label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    className={`block w-full rounded-md border ${errors.endTime ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                                {errors.endTime && (
                                    <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
                                )}
                            </div>
                        </div>

                        {/* Interview Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Địa điểm phỏng vấn
                            </label>
                            <select
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="online">Trực tuyến</option>
                                <option value="onsite">Trực tiếp</option>
                                <option value="phone">Điện thoại</option>
                            </select>
                        </div>

                        {/* Empty space to maintain grid alignment */}
                        <div></div>

                        {/* Meeting Details */}
                        {formData.location === 'online' && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Đường dẫn họp
                                </label>
                                <input
                                    type="text"
                                    name="meetingLink"
                                    value={formData.meetingLink}
                                    onChange={handleChange}
                                    placeholder="VD: https://zoom.us/j/..."
                                    className={`block w-full rounded-md border ${errors.meetingLink ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                                {errors.meetingLink && (
                                    <p className="mt-1 text-sm text-red-600">{errors.meetingLink}</p>
                                )}
                            </div>
                        )}

                        {formData.location === 'onsite' && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Địa chỉ họp
                                </label>
                                <input
                                    type="text"
                                    name="meetingAddress"
                                    value={formData.meetingAddress}
                                    onChange={handleChange}
                                    placeholder="VD: 123 Đường Nguyễn Huệ, Quận 1"
                                    className={`block w-full rounded-md border ${errors.meetingAddress ? 'border-red-300' : 'border-gray-300'} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                                />
                                {errors.meetingAddress && (
                                    <p className="mt-1 text-sm text-red-600">{errors.meetingAddress}</p>
                                )}
                            </div>
                        )}

                        {/* Notes */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ghi chú bổ sung (Tùy chọn)
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={4}
                                className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Thêm thông tin bổ sung cho ứng viên..."
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                            {loading ? 'Đang cập nhật...' : 'Lên lịch lại'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default InterviewManagement;