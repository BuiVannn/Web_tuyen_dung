// recruiter
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Calendar,
    Clock,
    MapPin,
    Video,
    Phone,
    User,
    Briefcase,
    FileText,
    Edit,
    Check,
    X,
    ArrowLeft,
    MessageSquare,
    Save,
    Loader,
    Mail,
} from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';

const InterviewDetail = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const { backendUrl, companyToken } = useContext(AppContext);
    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [feedbackMode, setFeedbackMode] = useState(false);
    const [formData, setFormData] = useState({
        scheduledDate: '',
        startTime: '',
        endTime: '',
        location: '',
        meetingLink: '',
        meetingAddress: '',
        interviewType: '',
        notes: ''
    });
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (companyToken && interviewId) {
            fetchInterviewDetail();
        }
    }, [companyToken, interviewId]);

    const fetchInterviewDetail = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/api/interviews/company/${interviewId}`, {
                headers: {
                    'Authorization': `Bearer ${companyToken}`
                }
            });

            if (data.success) {
                setInterview(data.interview);

                // Format date for form input
                const date = new Date(data.interview.scheduledDate);
                const formattedDate = date.toISOString().split('T')[0];

                // Initialize form data for editing
                setFormData({
                    scheduledDate: formattedDate,
                    startTime: data.interview.startTime,
                    endTime: data.interview.endTime,
                    location: data.interview.location,
                    meetingLink: data.interview.meetingLink || '',
                    meetingAddress: data.interview.meetingAddress || '',
                    interviewType: data.interview.interviewType,
                    notes: data.interview.notes || ''
                });

                // Initialize feedback if exists
                if (data.interview.companyFeedback) {
                    setFeedback(data.interview.companyFeedback);
                }
            } else {
                toast.error('Failed to load interview details');
                navigate('/dashboard/interviews');
            }
        } catch (error) {
            console.error('Error fetching interview details:', error);
            toast.error(error.response?.data?.message || 'Failed to load interview details');
            navigate('/dashboard/interviews');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateInterview = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const { data } = await axios.put(
                `${backendUrl}/api/interviews/${interviewId}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${companyToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data.success) {
                toast.success('Interview updated successfully');
                setEditMode(false);
                // Refresh data
                fetchInterviewDetail();
            } else {
                toast.error(data.message || 'Failed to update interview');
            }
        } catch (error) {
            console.error('Error updating interview:', error);
            toast.error(error.response?.data?.message || 'Failed to update interview');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitFeedback = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/interviews/company/${interviewId}/feedback`,
                { feedback },
                {
                    headers: {
                        'Authorization': `Bearer ${companyToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data.success) {
                toast.success('Feedback submitted successfully');
                setFeedbackMode(false);
                // Refresh data
                fetchInterviewDetail();
            } else {
                toast.error(data.message || 'Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error(error.response?.data?.message || 'Failed to submit feedback');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelInterview = async () => {
        if (!window.confirm('Are you sure you want to cancel this interview?')) {
            return;
        }

        try {
            setSubmitting(true);
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
                // Refresh data
                fetchInterviewDetail();
            } else {
                toast.error(data.message || 'Failed to cancel interview');
            }
        } catch (error) {
            console.error('Error cancelling interview:', error);
            toast.error(error.response?.data?.message || 'Failed to cancel interview');
        } finally {
            setSubmitting(false);
        }
    };

    // Cập nhật hàm handleCompleteInterview khoảng dòng 190-219
    const handleCompleteInterview = async () => {
        // Kiểm tra xem người dùng có xác nhận không
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

        if (!window.confirm('Xác nhận cuộc phỏng vấn đã hoàn thành?')) {
            return;
        }

        try {
            setSubmitting(true);
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
                toast.success('Đã cập nhật trạng thái phỏng vấn thành Hoàn thành');
                // Refresh data
                fetchInterviewDetail();
            } else {
                toast.error(data.message || 'Không thể cập nhật trạng thái phỏng vấn');
            }
        } catch (error) {
            console.error('Error completing interview:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Lỗi khi cập nhật trạng thái phỏng vấn');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const getInterviewTypeLabel = (type) => {
        const types = {
            'screening': 'Screening Interview',
            'technical': 'Technical Interview',
            'hr': 'HR Interview',
            'culture': 'Culture Fit Interview',
            'final': 'Final Interview'
        };
        return types[type] || type;
    };

    const getStatusBadge = (status) => {
        let colorClasses = '';

        switch (status) {
            case 'scheduled':
                colorClasses = 'bg-yellow-100 text-yellow-800';
                break;
            case 'confirmed':
                colorClasses = 'bg-green-100 text-green-800';
                break;
            case 'rescheduled':
                colorClasses = 'bg-orange-100 text-orange-800';
                break;
            case 'cancelled':
                colorClasses = 'bg-red-100 text-red-800';
                break;
            case 'completed':
                colorClasses = 'bg-blue-100 text-blue-800';
                break;
            default:
                colorClasses = 'bg-gray-100 text-gray-800';
        }

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses} capitalize`}>
                {status}
            </span>
        );
    };

    const getLocationIcon = (location) => {
        switch (location) {
            case 'online':
                return <Video size={18} className="text-blue-500" />;
            case 'onsite':
                return <MapPin size={18} className="text-green-500" />;
            case 'phone':
                return <Phone size={18} className="text-purple-500" />;
            default:
                return <MapPin size={18} />;
        }
    };
    // Thêm hàm này vào component InterviewDetail
    const handleRescheduleClick = (interview) => {
        navigate(`/dashboard/interviews/reschedule/${interviewId}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!interview) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-semibold text-gray-800">Interview not found</h2>
                <p className="mt-2 text-gray-600">The interview you're looking for doesn't exist or you don't have permission to view it.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Go Back
                </button>
            </div>
        );
    }

    const formattedDate = new Date(interview.scheduledDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Check if the interview can be edited/cancelled
    const isEditable = ['scheduled', 'rescheduled', 'confirmed'].includes(interview.status);
    const isPastInterview = new Date(interview.scheduledDate) < new Date();

    return (
        <div className="container mx-auto p-4 max-w-5xl">
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-700 hover:text-purple-600 transition-colors"
                >
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Interviews
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-lg overflow-hidden">
                    {/* Banner section with interview type */}
                    <div className="bg-purple-900 bg-opacity-20 border-b border-white border-opacity-10 py-2 px-6">
                        <div className="flex justify-between items-center">
                            <span className="text-white font-medium flex items-center">
                                <Calendar size={15} className="mr-1.5" />
                                {formattedDate}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-purple-800 shadow-sm">
                                {getInterviewTypeLabel(interview.interviewType)}
                            </span>
                        </div>
                    </div>

                    {/* Main header content */}
                    <div className="px-6 py-5">
                        <div className="flex flex-col space-y-5">
                            {/* Top row - title and status */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="w-full md:w-auto">
                                    <div className="flex items-center mb-2">
                                        <h1 className="text-xl font-semibold text-white">Interview Details</h1>
                                        <div className="ml-3 transform transition-transform hover:scale-105">
                                            {getStatusBadge(interview.status)}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-white flex items-center group">
                                            <Briefcase size={16} className="mr-2 group-hover:text-indigo-200 transition-colors" />
                                            <span className="group-hover:text-indigo-100 transition-colors">
                                                {interview.jobId?.title || 'Unnamed Position'}
                                            </span>
                                        </p>

                                        <p className="text-white flex items-center group">
                                            <Clock size={16} className="mr-2 group-hover:text-indigo-200 transition-colors" />
                                            <span className="group-hover:text-indigo-100 transition-colors">
                                                {interview.startTime} - {interview.endTime}
                                            </span>
                                        </p>

                                        <div className="flex items-center group">
                                            <span className="text-indigo-200 mr-2">
                                                {getLocationIcon(interview.location)}
                                            </span>
                                            <span className="capitalize text-white group-hover:text-indigo-100 transition-colors">
                                                {interview.location}
                                            </span>
                                            {interview.location === 'online' && interview.meetingLink && (
                                                <a
                                                    href={interview.meetingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ml-3 text-sm text-white bg-indigo-500 hover:bg-indigo-400 transition-colors px-2 py-0.5 rounded-md flex items-center"
                                                >
                                                    <Video size={14} className="mr-1" />
                                                    Join Meeting
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Confirmation status card */}
                                <div className="px-4 py-3 backdrop-blur-sm bg-white bg-opacity-15 hover:bg-opacity-20 transition-all duration-300 
                    rounded-lg border border-white border-opacity-15 shadow-xl transform hover:-translate-y-1">
                                    {interview.userConfirmed ? (
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse shadow-lg shadow-green-400/30"></div>
                                            <span className="text-white font-medium">Candidate Confirmed</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2 shadow-lg shadow-yellow-400/30"></div>
                                            <span className="text-black font-medium">Awaiting Confirmation</span>
                                        </div>
                                    )}
                                    <div className="mt-1 text-xs text-black opacity-80">
                                        Updated: {new Date(interview.updatedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons with enhanced styling */}
                            <div className="flex flex-wrap gap-2">
                                {isEditable && !isPastInterview && !editMode && !feedbackMode && (
                                    <>
                                        <button
                                            onClick={() => setEditMode(true)}
                                            className="flex items-center px-3 py-1.5 bg-white bg-opacity-15 hover:bg-opacity-25 rounded-md text-sm border border-white border-opacity-15 
                                transition-all duration-300 hover:shadow-md text-black"
                                            disabled={submitting}
                                        >
                                            <Edit size={16} className="mr-1.5" />
                                            Edit Details
                                        </button>
                                        <button
                                            onClick={() => handleRescheduleClick(interview)}
                                            className="flex items-center px-3 py-1.5 bg-amber-500 bg-opacity-90 hover:bg-opacity-100 rounded-md text-sm border border-amber-400 border-opacity-30
                                transition-all duration-300 hover:shadow-md text-white"
                                        >
                                            <Calendar size={16} className="mr-1.5" />
                                            Reschedule
                                        </button>
                                        <button
                                            onClick={handleCancelInterview}
                                            className="flex items-center px-3 py-1.5 bg-pink-500 bg-opacity-90 hover:bg-opacity-100 rounded-md text-sm border border-pink-400 border-opacity-30
                                transition-all duration-300 hover:shadow-md text-white"
                                            disabled={submitting}
                                        >
                                            <X size={16} className="mr-1.5" />
                                            Cancel Interview
                                        </button>
                                    </>
                                )}

                                {(interview.status === 'confirmed' || interview.status === 'rescheduled') &&
                                    interview.userConfirmed &&
                                    new Date() > new Date(new Date(interview.scheduledDate).setHours(
                                        parseInt(interview.endTime.split(':')[0]),
                                        parseInt(interview.endTime.split(':')[1])
                                    )) &&
                                    !isPastInterview &&
                                    !editMode &&
                                    !feedbackMode && (
                                        <button
                                            onClick={handleCompleteInterview}
                                            className="flex items-center px-3 py-1.5 bg-emerald-500 bg-opacity-90 hover:bg-opacity-100 rounded-md text-sm border border-emerald-400 border-opacity-30
                            transition-all duration-300 hover:shadow-md text-white"
                                            disabled={submitting}
                                        >
                                            <Check size={16} className="mr-1.5" />
                                            Mark as Completed
                                        </button>
                                    )}

                                {interview.status === 'completed' && !feedbackMode && !editMode && (
                                    <button
                                        onClick={() => setFeedbackMode(true)}
                                        className="flex items-center px-3 py-1.5 bg-indigo-500 bg-opacity-90 hover:bg-opacity-100 rounded-md text-sm
                            transition-all duration-300 hover:shadow-md text-white"
                                    >
                                        <MessageSquare size={16} className="mr-1.5" />
                                        {interview.companyFeedback ? 'Edit Feedback' : 'Add Feedback'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-gray-50 p-6">
                    {editMode ? (
                        // Edit Form
                        <form onSubmit={handleUpdateInterview} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Interview</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Interview Date
                                    </label>
                                    <input
                                        type="date"
                                        name="scheduledDate"
                                        value={formData.scheduledDate}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                        required
                                    />
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
                                            className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                            required
                                        />
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
                                            className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Interview Type
                                    </label>
                                    <select
                                        name="interviewType"
                                        value={formData.interviewType}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                        required
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
                                        Location
                                    </label>
                                    <select
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                        required
                                    >
                                        <option value="online">Online</option>
                                        <option value="onsite">On-site</option>
                                        <option value="phone">Phone</option>
                                    </select>
                                </div>

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
                                            className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                            required
                                        />
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
                                            className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                            required
                                        />
                                    </div>
                                )}

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Notes for Candidate
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows={4}
                                        className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Add any notes or instructions for the candidate..."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setEditMode(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center transition-colors"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader size={16} className="mr-2 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} className="mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : feedbackMode ? (
                        // Feedback Form
                        <form onSubmit={handleSubmitFeedback} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
                            <div>
                                <label className="block text-xl font-semibold text-gray-800 mb-4">
                                    Interview Feedback
                                </label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    rows={6}
                                    className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="Add your feedback about the interview and the candidate..."
                                    required
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setFeedbackMode(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center transition-colors"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader size={16} className="mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} className="mr-2" />
                                            Submit Feedback
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        // View Mode
                        <div>
                            {/* Candidate & Job Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <User size={18} className="mr-2 text-purple-500" />
                                        Candidate Information
                                    </h2>
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <ImageWithFallback
                                                src={interview.userId?.image}
                                                alt={interview.userId?.name}
                                                className="h-16 w-16 rounded-full object-cover border border-gray-200"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-md font-medium text-gray-900">
                                                {interview.userId?.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">{interview.userId?.email}</p>

                                            <div className="mt-3 space-y-2">
                                                {interview.userId?.email && (
                                                    <a
                                                        href={`mailto:${interview.userId.email}`}
                                                        className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 transition-colors"
                                                    >
                                                        <Mail size={14} className="mr-1.5" />
                                                        Send Email
                                                    </a>
                                                )}
                                                {interview.applicationId?.resume && (
                                                    <a
                                                        href={interview.applicationId.resume}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block text-sm text-purple-600 hover:text-purple-800 transition-colors"
                                                    >
                                                        <FileText size={14} className="inline mr-1.5" />
                                                        View Resume
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                        <Briefcase size={18} className="mr-2 text-purple-500" />
                                        Job Information
                                    </h2>
                                    <div>
                                        <h3 className="text-md font-medium text-gray-900">
                                            {interview.jobId?.title}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {interview.jobId?.location}
                                        </p>
                                        <div className="mt-3">
                                            <Link
                                                to={`/dashboard/manage-jobs/${interview.jobId?._id}`}
                                                className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
                                            >
                                                View Job Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Interview Details */}
                            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-8 hover:shadow-md transition-shadow">
                                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <Calendar size={18} className="mr-2 text-purple-500" />
                                    Interview Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                                        <p className="flex items-center text-gray-800">
                                            <Calendar size={16} className="mr-2 text-gray-500" />
                                            {formattedDate}
                                        </p>
                                        <p className="flex items-center text-gray-800 mt-1">
                                            <Clock size={16} className="mr-2 text-gray-500" />
                                            {interview.startTime} - {interview.endTime}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Location</p>
                                        <p className="flex items-center text-gray-800">
                                            {getLocationIcon(interview.location)}
                                            <span className="ml-2 capitalize">{interview.location}</span>
                                        </p>
                                        {interview.location === 'online' && interview.meetingLink && (
                                            <a
                                                href={interview.meetingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-1 text-sm text-purple-600 hover:text-purple-800 block truncate transition-colors"
                                            >
                                                {interview.meetingLink}
                                            </a>
                                        )}
                                        {interview.location === 'onsite' && interview.meetingAddress && (
                                            <p className="mt-1 text-sm text-gray-800">
                                                {interview.meetingAddress}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {interview.notes && (
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-500 mb-1">Notes for Candidate</p>
                                        <p className="text-gray-800 text-sm p-3 bg-gray-50 rounded border border-gray-100">
                                            {interview.notes}
                                        </p>
                                    </div>
                                )}
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500 mb-1">Confirmation Status</p>
                                    <p className="text-gray-800">
                                        {interview.userConfirmed ? (
                                            <span className="text-green-600 flex items-center">
                                                <Check size={16} className="mr-1" />
                                                Candidate has confirmed attendance
                                            </span>
                                        ) : (
                                            <span className="text-amber-600 flex items-center">
                                                <Clock size={16} className="mr-1" />
                                                Waiting for candidate confirmation
                                            </span>
                                        )}
                                    </p>
                                    {interview.status === 'confirmed' && new Date() < new Date(interview.scheduledDate) && (
                                        <p className="text-sm text-gray-500 mt-2">
                                            You can mark the interview as completed after the interview end time.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Feedback Section */}
                            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                        <MessageSquare size={18} className="mr-2 text-purple-500" />
                                        Feedback
                                    </h2>

                                    {interview.status === 'completed' && !feedbackMode && (
                                        <button
                                            onClick={() => setFeedbackMode(true)}
                                            className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded flex items-center transition-colors"
                                        >
                                            {interview.companyFeedback ? 'Edit Feedback' : 'Add Feedback'}
                                        </button>
                                    )}
                                </div>

                                {interview.companyFeedback ? (
                                    <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                                        <p className="text-sm text-gray-500 mb-2">Your feedback:</p>
                                        <p className="text-gray-800">{interview.companyFeedback}</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-md border border-gray-200">
                                        {interview.status === 'completed' ? (
                                            <p>No feedback provided yet. Click 'Add Feedback' to provide your assessment.</p>
                                        ) : (
                                            <p>You can add feedback after the interview is completed.</p>
                                        )}
                                    </div>
                                )}

                                {interview.userFeedback && (
                                    <div className="mt-4 bg-gray-50 border border-gray-200 rounded-md p-4">
                                        <p className="text-sm text-gray-500 mb-2">Candidate feedback:</p>
                                        <p className="text-gray-800">{interview.userFeedback}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default InterviewDetail;

//     return (
//         <div className="container mx-auto p-4 max-w-5xl">
//             <div className="mb-6">
//                 <button
//                     onClick={() => navigate(-1)}
//                     className="flex items-center text-gray-600 hover:text-blue-600"
//                 >
//                     <ArrowLeft size={18} className="mr-2" />
//                     Back to Interviews
//                 </button>
//             </div>

//             {/* <div className="bg-white rounded-lg shadow-md overflow-hidden"> */}
//             <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-lg overflow-hidden">
//                 {/* Header */}

//                 {/* Header mới - thiết kế hiện đại và chuyên nghiệp hơn */}
//                 <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-lg overflow-hidden">
//                     {/* Banner section with interview type */}
//                     <div className="bg-indigo-900 bg-opacity-30 border-b border-white border-opacity-10 py-2 px-6">
//                         <div className="flex justify-between items-center">
//                             <span className="text-blue-100 font-medium flex items-center">
//                                 <Calendar size={15} className="mr-1.5" />
//                                 {formattedDate}
//                             </span>
//                             <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 shadow-sm">
//                                 {getInterviewTypeLabel(interview.interviewType)}
//                             </span>
//                         </div>
//                     </div>

//                     {/* Main header content */}
//                     <div className="px-6 py-5">
//                         <div className="flex flex-col space-y-5">
//                             {/* Top row - title and status */}
//                             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                                 <div className="w-full md:w-auto">
//                                     <div className="flex items-center mb-2">
//                                         <h1 className="text-xl font-semibold text-white">Chi tiết phỏng vấn</h1>
//                                         <div className="ml-3 transform transition-transform hover:scale-105">
//                                             {getStatusBadge(interview.status)}
//                                         </div>
//                                     </div>

//                                     <div className="space-y-2">
//                                         <p className="text-blue-100 flex items-center group">
//                                             <Briefcase size={16} className="mr-2 group-hover:text-blue-300 transition-colors" />
//                                             <span className="group-hover:text-white transition-colors">
//                                                 {interview.jobId?.title || 'Vị trí chưa đặt tên'}
//                                             </span>
//                                         </p>

//                                         <p className="text-blue-100 flex items-center group">
//                                             <Clock size={16} className="mr-2 group-hover:text-blue-300 transition-colors" />
//                                             <span className="group-hover:text-white transition-colors">
//                                                 {interview.startTime} - {interview.endTime}
//                                             </span>
//                                         </p>

//                                         <div className="flex items-center group">
//                                             <span className="text-blue-300 mr-2">
//                                                 {getLocationIcon(interview.location)}
//                                             </span>
//                                             <span className="capitalize text-blue-100 group-hover:text-white transition-colors">
//                                                 {interview.location}
//                                             </span>
//                                             {interview.location === 'online' && interview.meetingLink && (
//                                                 <a
//                                                     href={interview.meetingLink}
//                                                     target="_blank"
//                                                     rel="noopener noreferrer"
//                                                     className="ml-3 text-sm text-white bg-blue-500 hover:bg-blue-400 transition-colors px-2 py-0.5 rounded-md flex items-center"
//                                                 >
//                                                     <Video size={14} className="mr-1" />
//                                                     Tham gia
//                                                 </a>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Confirmation status card */}
//                                 <div className="px-4 py-3 backdrop-blur-sm bg-white bg-opacity-10 hover:bg-opacity-15 transition-all duration-300
//                     rounded-lg border border-white border-opacity-10 shadow-xl transform hover:-translate-y-1">
//                                     {interview.userConfirmed ? (
//                                         <div className="flex items-center">
//                                             <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse shadow-lg shadow-green-400/30"></div>
//                                             <span className="text-white font-medium">Ứng viên đã xác nhận</span>
//                                         </div>
//                                     ) : (
//                                         <div className="flex items-center">
//                                             <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2 shadow-lg shadow-yellow-400/30"></div>
//                                             <span className="text-black font-medium">Đang chờ xác nhận</span>
//                                         </div>
//                                     )}
//                                     <div className="mt-1 text-xs text-black-100">
//                                         Cập nhật: {new Date(interview.updatedAt).toLocaleDateString()}
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Action buttons with enhanced styling */}
//                             <div className="flex flex-wrap gap-2">
//                                 {isEditable && !isPastInterview && !editMode && !feedbackMode && (
//                                     <>
//                                         <button
//                                             onClick={() => setEditMode(true)}
//                                             className="flex items-center px-3 py-1.5 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-md text-sm border border-white border-opacity-10
//                                 transition-all duration-300 hover:shadow-md hover:shadow-blue-700/20"
//                                             disabled={submitting}
//                                         >
//                                             <Edit size={16} className="mr-1.5" />
//                                             Chỉnh sửa
//                                         </button>
//                                         <button
//                                             onClick={() => handleRescheduleClick(interview)}
//                                             className="flex items-center px-3 py-1.5 bg-orange-500 bg-opacity-80 hover:bg-opacity-100 rounded-md text-sm border border-orange-400 border-opacity-30
//                                 transition-all duration-300 hover:shadow-md hover:shadow-orange-700/20"
//                                         >
//                                             <Calendar size={16} className="mr-1.5" />
//                                             Lên lịch lại
//                                         </button>
//                                         <button
//                                             onClick={handleCancelInterview}
//                                             className="flex items-center px-3 py-1.5 bg-red-500 bg-opacity-80 hover:bg-opacity-100 rounded-md text-sm border border-red-400 border-opacity-30
//                                 transition-all duration-300 hover:shadow-md hover:shadow-red-700/20"
//                                             disabled={submitting}
//                                         >
//                                             <X size={16} className="mr-1.5" />
//                                             Hủy phỏng vấn
//                                         </button>
//                                     </>
//                                 )}

//                                 {(interview.status === 'confirmed' || interview.status === 'rescheduled') &&
//                                     interview.userConfirmed &&
//                                     new Date() > new Date(new Date(interview.scheduledDate).setHours(
//                                         parseInt(interview.endTime.split(':')[0]),
//                                         parseInt(interview.endTime.split(':')[1])
//                                     )) &&
//                                     !isPastInterview &&
//                                     !editMode &&
//                                     !feedbackMode && (
//                                         <button
//                                             onClick={handleCompleteInterview}
//                                             className="flex items-center px-3 py-1.5 bg-green-500 bg-opacity-80 hover:bg-opacity-100 rounded-md text-sm border border-green-400 border-opacity-30
//                             transition-all duration-300 hover:shadow-md hover:shadow-green-700/20"
//                                             disabled={submitting}
//                                         >
//                                             <Check size={16} className="mr-1.5" />
//                                             Đánh dấu hoàn thành
//                                         </button>
//                                     )}

//                                 {interview.status === 'completed' && !feedbackMode && !editMode && (
//                                     <button
//                                         onClick={() => setFeedbackMode(true)}
//                                         className="flex items-center px-3 py-1.5 bg-blue-400 bg-opacity-80 hover:bg-opacity-100 rounded-md text-sm
//                             transition-all duration-300 hover:shadow-md hover:shadow-blue-700/20"
//                                     >
//                                         <MessageSquare size={16} className="mr-1.5" />
//                                         {interview.companyFeedback ? 'Sửa đánh giá' : 'Thêm đánh giá'}
//                                     </button>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Main Content */}
//                 <div className="p-6">
//                     {editMode ? (
//                         // Edit Form
//                         <form onSubmit={handleUpdateInterview} className="space-y-6">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Interview Date
//                                     </label>
//                                     <input
//                                         type="date"
//                                         name="scheduledDate"
//                                         value={formData.scheduledDate}
//                                         onChange={handleChange}
//                                         className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                                         required
//                                     />
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Start Time
//                                         </label>
//                                         <input
//                                             type="time"
//                                             name="startTime"
//                                             value={formData.startTime}
//                                             onChange={handleChange}
//                                             className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                                             required
//                                         />
//                                     </div>

//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             End Time
//                                         </label>
//                                         <input
//                                             type="time"
//                                             name="endTime"
//                                             value={formData.endTime}
//                                             onChange={handleChange}
//                                             className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Interview Type
//                                     </label>
//                                     <select
//                                         name="interviewType"
//                                         value={formData.interviewType}
//                                         onChange={handleChange}
//                                         className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                                         required
//                                     >
//                                         <option value="screening">Screening</option>
//                                         <option value="technical">Technical</option>
//                                         <option value="hr">HR</option>
//                                         <option value="culture">Culture Fit</option>
//                                         <option value="final">Final</option>
//                                     </select>
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Location
//                                     </label>
//                                     <select
//                                         name="location"
//                                         value={formData.location}
//                                         onChange={handleChange}
//                                         className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                                         required
//                                     >
//                                         <option value="online">Online</option>
//                                         <option value="onsite">On-site</option>
//                                         <option value="phone">Phone</option>
//                                     </select>
//                                 </div>

//                                 {formData.location === 'online' && (
//                                     <div className="md:col-span-2">
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Meeting Link
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="meetingLink"
//                                             value={formData.meetingLink}
//                                             onChange={handleChange}
//                                             placeholder="e.g., https://zoom.us/j/..."
//                                             className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                                             required
//                                         />
//                                     </div>
//                                 )}

//                                 {formData.location === 'onsite' && (
//                                     <div className="md:col-span-2">
//                                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                                             Meeting Address
//                                         </label>
//                                         <input
//                                             type="text"
//                                             name="meetingAddress"
//                                             value={formData.meetingAddress}
//                                             onChange={handleChange}
//                                             placeholder="e.g., 123 Office Street, Suite 100"
//                                             className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                                             required
//                                         />
//                                     </div>
//                                 )}

//                                 <div className="md:col-span-2">
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Notes for Candidate
//                                     </label>
//                                     <textarea
//                                         name="notes"
//                                         value={formData.notes}
//                                         onChange={handleChange}
//                                         rows={4}
//                                         className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                                         placeholder="Add any notes or instructions for the candidate..."
//                                     />
//                                 </div>
//                             </div>

//                             <div className="flex justify-end space-x-3 mt-6">
//                                 <button
//                                     type="button"
//                                     onClick={() => setEditMode(false)}
//                                     className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                                     disabled={submitting}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
//                                     disabled={submitting}
//                                 >
//                                     {submitting ? (
//                                         <>
//                                             <Loader size={16} className="mr-2 animate-spin" />
//                                             Updating...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <Save size={16} className="mr-2" />
//                                             Save Changes
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         </form>
//                     ) : feedbackMode ? (
//                         // Feedback Form
//                         <form onSubmit={handleSubmitFeedback} className="space-y-6">
//                             <div>
//                                 <label className="block text-lg font-medium text-gray-700 mb-2">
//                                     Interview Feedback
//                                 </label>
//                                 <textarea
//                                     value={feedback}
//                                     onChange={(e) => setFeedback(e.target.value)}
//                                     rows={6}
//                                     className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                                     placeholder="Add your feedback about the interview and the candidate..."
//                                     required
//                                 />
//                             </div>

//                             <div className="flex justify-end space-x-3">
//                                 <button
//                                     type="button"
//                                     onClick={() => setFeedbackMode(false)}
//                                     className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                                     disabled={submitting}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
//                                     disabled={submitting}
//                                 >
//                                     {submitting ? (
//                                         <>
//                                             <Loader size={16} className="mr-2 animate-spin" />
//                                             Submitting...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <Save size={16} className="mr-2" />
//                                             Submit Feedback
//                                         </>
//                                     )}
//                                 </button>
//                             </div>
//                         </form>
//                     ) : (
//                         // View Mode
//                         <div>
//                             {/* Candidate & Job Information */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//                                 <div className="bg-gray-50 p-5 rounded-lg">
//                                     <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
//                                         <User size={18} className="mr-2 text-blue-500" />
//                                         Candidate Information
//                                     </h2>
//                                     <div className="flex items-start space-x-4">
//                                         <div className="flex-shrink-0">
//                                             <ImageWithFallback
//                                                 src={interview.userId?.image}
//                                                 alt={interview.userId?.name}
//                                                 className="h-16 w-16 rounded-full object-cover border border-gray-200"
//                                             />
//                                         </div>
//                                         <div>
//                                             <h3 className="text-md font-medium text-gray-900">
//                                                 {interview.userId?.name}
//                                             </h3>
//                                             <p className="text-sm text-gray-500">{interview.userId?.email}</p>

//                                             <div className="mt-3 space-y-2">
//                                                 {interview.userId?.email && (
//                                                     <a
//                                                         href={`mailto:${interview.userId.email}`}
//                                                         className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
//                                                     >
//                                                         <Mail size={14} className="mr-1.5" />
//                                                         Send Email
//                                                     </a>
//                                                 )}
//                                                 {interview.applicationId?.resume && (
//                                                     <a
//                                                         href={interview.applicationId.resume}
//                                                         target="_blank"
//                                                         rel="noopener noreferrer"
//                                                         className="block text-sm text-blue-600 hover:text-blue-800"
//                                                     >
//                                                         <FileText size={14} className="inline mr-1.5" />
//                                                         View Resume
//                                                     </a>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="bg-gray-50 p-5 rounded-lg">
//                                     <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
//                                         <Briefcase size={18} className="mr-2 text-blue-500" />
//                                         Job Information
//                                     </h2>
//                                     <div>
//                                         <h3 className="text-md font-medium text-gray-900">
//                                             {interview.jobId?.title}
//                                         </h3>
//                                         <p className="text-sm text-gray-500">
//                                             {interview.jobId?.location}
//                                         </p>
//                                         <div className="mt-3">
//                                             <Link
//                                                 to={`/dashboard/manage-jobs/${interview.jobId?._id}`}
//                                                 className="text-sm text-blue-600 hover:text-blue-800"
//                                             >
//                                                 View Job Details
//                                             </Link>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Interview Details */}
//                             <div className="bg-gray-50 p-5 rounded-lg mb-8">
//                                 <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
//                                     <Calendar size={18} className="mr-2 text-blue-500" />
//                                     Interview Details
//                                 </h2>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <div>
//                                         <p className="text-sm text-gray-500 mb-1">Date & Time</p>
//                                         <p className="flex items-center text-gray-800">
//                                             <Calendar size={16} className="mr-2 text-gray-500" />
//                                             {formattedDate}
//                                         </p>
//                                         <p className="flex items-center text-gray-800 mt-1">
//                                             <Clock size={16} className="mr-2 text-gray-500" />
//                                             {interview.startTime} - {interview.endTime}
//                                         </p>
//                                     </div>

//                                     <div>
//                                         <p className="text-sm text-gray-500 mb-1">Location</p>
//                                         <p className="flex items-center text-gray-800">
//                                             {getLocationIcon(interview.location)}
//                                             <span className="ml-2 capitalize">{interview.location}</span>
//                                         </p>
//                                         {interview.location === 'online' && interview.meetingLink && (
//                                             <a
//                                                 href={interview.meetingLink}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className="mt-1 text-sm text-blue-600 hover:text-blue-800 block truncate"
//                                             >
//                                                 {interview.meetingLink}
//                                             </a>
//                                         )}
//                                         {interview.location === 'onsite' && interview.meetingAddress && (
//                                             <p className="mt-1 text-sm text-gray-800">
//                                                 {interview.meetingAddress}
//                                             </p>
//                                         )}
//                                     </div>
//                                 </div>

//                                 {interview.notes && (
//                                     <div className="mt-4">
//                                         <p className="text-sm text-gray-500 mb-1">Notes for Candidate</p>
//                                         <p className="text-gray-800 text-sm p-3 bg-gray-100 rounded">
//                                             {interview.notes}
//                                         </p>
//                                     </div>
//                                 )}
//                                 <div className="mt-4">
//                                     <p className="text-sm text-gray-500 mb-1">Trạng thái xác nhận</p>
//                                     <p className="text-gray-800">
//                                         {interview.userConfirmed ? (
//                                             <span className="text-green-600 flex items-center">
//                                                 <Check size={16} className="mr-1" />
//                                                 Ứng viên đã xác nhận tham gia phỏng vấn
//                                             </span>
//                                         ) : (
//                                             <span className="text-yellow-600 flex items-center">
//                                                 <Clock size={16} className="mr-1" />
//                                                 Đang chờ ứng viên xác nhận
//                                             </span>
//                                         )}
//                                     </p>
//                                     {interview.status === 'confirmed' && new Date() < new Date(interview.scheduledDate) && (
//                                         <p className="text-sm text-gray-500 mt-2">
//                                             Bạn có thể đánh dấu phỏng vấn hoàn thành sau khi buổi phỏng vấn đã kết thúc.
//                                         </p>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Feedback Section */}
//                             <div className="bg-gray-50 p-5 rounded-lg">
//                                 <div className="flex justify-between items-center mb-4">
//                                     <h2 className="text-lg font-medium text-gray-900 flex items-center">
//                                         <MessageSquare size={18} className="mr-2 text-blue-500" />
//                                         Feedback
//                                     </h2>

//                                     {interview.status === 'completed' && !feedbackMode && (
//                                         <button
//                                             onClick={() => setFeedbackMode(true)}
//                                             className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded flex items-center"
//                                         >
//                                             {interview.companyFeedback ? 'Edit Feedback' : 'Add Feedback'}
//                                         </button>
//                                     )}
//                                 </div>

//                                 {interview.companyFeedback ? (
//                                     <div className="bg-white border border-gray-200 rounded-md p-4">
//                                         <p className="text-sm text-gray-500 mb-2">Your feedback:</p>
//                                         <p className="text-gray-800">{interview.companyFeedback}</p>
//                                     </div>
//                                 ) : (
//                                     <div className="text-center py-6 text-gray-500">
//                                         {interview.status === 'completed' ? (
//                                             <p>No feedback provided yet. Click 'Add Feedback' to provide your assessment.</p>
//                                         ) : (
//                                             <p>You can add feedback after the interview is completed.</p>
//                                         )}
//                                     </div>
//                                 )}

//                                 {interview.userFeedback && (
//                                     <div className="mt-4 bg-white border border-gray-200 rounded-md p-4">
//                                         <p className="text-sm text-gray-500 mb-2">Candidate feedback:</p>
//                                         <p className="text-gray-800">{interview.userFeedback}</p>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default InterviewDetail;