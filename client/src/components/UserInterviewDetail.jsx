import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    Calendar,
    Clock,
    MapPin,
    Building,
    Video,
    Phone,
    CheckCircle,
    XCircle,
    ArrowLeft,
    Briefcase,
    User,
    MessageSquare,
    Mail,
    ExternalLink,
    Loader
} from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';

const UserInterviewDetail = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const { backendUrl, userToken } = useContext(AppContext);
    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (userToken && interviewId) {
            fetchInterviewDetail();
        }
    }, [userToken, interviewId]);

    const fetchInterviewDetail = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/api/interviews/user/${interviewId}`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            if (data.success) {
                setInterview(data.interview);
                if (data.interview.userFeedback) {
                    setFeedback(data.interview.userFeedback);
                }
            } else {
                toast.error(data.message || 'Failed to fetch interview details');
                navigate('/interviews');
            }
        } catch (error) {
            console.error('Error fetching interview details:', error);
            toast.error('Failed to fetch interview details');
            navigate('/interviews');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmInterview = async () => {
        try {
            setSubmitting(true);
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
                fetchInterviewDetail(); // Refresh the data
            } else {
                toast.error(data.message || 'Failed to confirm interview');
            }
        } catch (error) {
            console.error('Error confirming interview:', error);
            toast.error('Failed to confirm interview');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitFeedback = async (e) => {
        e.preventDefault();
        if (!feedback.trim()) {
            toast.error('Please enter your feedback');
            return;
        }

        try {
            setSubmitting(true);
            const { data } = await axios.post(
                `${backendUrl}/api/interviews/user/${interviewId}/feedback`,
                { feedback },
                {
                    headers: {
                        'Authorization': `Bearer ${userToken}`
                    }
                }
            );

            if (data.success) {
                toast.success('Feedback submitted successfully');
                setShowFeedbackForm(false);
                fetchInterviewDetail(); // Refresh the data
            } else {
                toast.error(data.message || 'Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error('Failed to submit feedback');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'scheduled':
                return { label: 'Scheduled', color: 'yellow' };
            case 'confirmed':
                return { label: 'Confirmed', color: 'green' };
            case 'rescheduled':
                return { label: 'Rescheduled', color: 'orange' };
            case 'cancelled':
                return { label: 'Cancelled', color: 'red' };
            case 'completed':
                return { label: 'Completed', color: 'blue' };
            default:
                return { label: status, color: 'gray' };
        }
    };

    const getInterviewTypeLabel = (type) => {
        switch (type) {
            case 'technical':
                return 'Technical Interview';
            case 'hr':
                return 'HR Interview';
            case 'culture':
                return 'Culture Fit Interview';
            case 'screening':
                return 'Screening Interview';
            case 'final':
                return 'Final Interview';
            default:
                return type;
        }
    };

    const getLocationIcon = (location) => {
        switch (location) {
            case 'online':
                return <Video className="text-blue-500" size={20} />;
            case 'onsite':
                return <Building className="text-green-500" size={20} />;
            case 'phone':
                return <Phone className="text-purple-500" size={20} />;
            default:
                return <MapPin className="text-gray-500" size={20} />;
        }
    };

    const isUpcoming = interview && new Date(interview.scheduledDate) > new Date();
    const canConfirm = interview && ['scheduled', 'rescheduled'].includes(interview.status) && !interview.userConfirmed && isUpcoming;
    const canProvideFeedback = interview && interview.status === 'completed';
    const statusInfo = interview ? getStatusLabel(interview.status) : { label: '', color: 'gray' };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 py-10">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!interview) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gray-50 py-10">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Interview not found</h3>
                            <p className="text-gray-500 mb-6">
                                The interview you're looking for doesn't exist or you don't have permission to view it.
                            </p>
                            <button
                                onClick={() => navigate('/interviews')}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <ArrowLeft size={16} className="mr-2" />
                                Back to Interviews
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const formattedDate = new Date(interview.scheduledDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-10">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="mb-6">
                        <button
                            onClick={() => navigate('/interviews')}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                            <ArrowLeft size={16} className="mr-2" />
                            Back to Interviews
                        </button>
                    </div>

                    {/* Interview Header */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                        <div className={`bg-gradient-to-r from-${statusInfo.color}-600 to-${statusInfo.color}-700 px-6 py-4 text-white`}>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                <div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
                                        {statusInfo.label}
                                    </span>
                                    <h1 className="text-xl font-semibold mt-2">
                                        {getInterviewTypeLabel(interview.interviewType)}
                                    </h1>
                                    <p className="text-white text-opacity-90 mt-1">
                                        {interview.jobId?.title || 'Unknown Position'}
                                    </p>
                                </div>

                                {canConfirm && (
                                    <button
                                        onClick={handleConfirmInterview}
                                        disabled={submitting}
                                        className={`mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-${statusInfo.color}-700 bg-white hover:bg-gray-100`}
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader size={16} className="mr-2 animate-spin" />
                                                Confirming...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle size={16} className="mr-2" />
                                                Confirm Interview
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Interview Details */}
                        <div className="p-6">
                            {/* Company Info */}
                            <div className="flex items-start space-x-4 mb-6">
                                <div className="flex-shrink-0">
                                    <ImageWithFallback
                                        src={interview.companyId?.image}
                                        alt={interview.companyId?.name}
                                        className="h-16 w-16 rounded-lg object-cover"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900">
                                        {interview.companyId?.name || 'Unknown Company'}
                                    </h2>
                                    <div className="mt-1">
                                        {interview.companyId?.email && (
                                            <a
                                                href={`mailto:${interview.companyId.email}`}
                                                className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
                                            >
                                                <Mail size={14} className="mr-1" />
                                                Contact via Email
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Date and Time */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <h3 className="text-md font-medium text-gray-900 mb-3">Interview Schedule</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start">
                                        <Calendar className="mt-1 mr-3 text-gray-400" size={18} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Date</p>
                                            <p className="text-sm text-gray-900">{formattedDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Clock className="mt-1 mr-3 text-gray-400" size={18} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Time</p>
                                            <p className="text-sm text-gray-900">{interview.startTime} - {interview.endTime}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Location Details */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <h3 className="text-md font-medium text-gray-900 mb-3">Location</h3>
                                <div className="flex items-start">
                                    {getLocationIcon(interview.location)}
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-700 capitalize">{interview.location} Interview</p>

                                        {interview.location === 'online' && interview.meetingLink && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-600 mb-1">Meeting Link:</p>
                                                <a
                                                    href={interview.meetingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                                >
                                                    <ExternalLink size={14} className="mr-1" />
                                                    Join Meeting
                                                </a>
                                            </div>
                                        )}

                                        {interview.location === 'onsite' && interview.meetingAddress && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-600 mb-1">Address:</p>
                                                <p className="text-sm text-gray-900">{interview.meetingAddress}</p>
                                            </div>
                                        )}

                                        {interview.location === 'phone' && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                The employer will call you at the scheduled time.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {interview.notes && (
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <h3 className="text-md font-medium text-gray-900 mb-2">Additional Notes</h3>
                                    <p className="text-sm text-gray-700 whitespace-pre-line">
                                        {interview.notes}
                                    </p>
                                </div>
                            )}

                            {/* Feedback Section */}
                            <div className="mt-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Feedback</h3>

                                    {canProvideFeedback && !showFeedbackForm && (
                                        <button
                                            onClick={() => setShowFeedbackForm(true)}
                                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800"
                                        >
                                            <MessageSquare size={16} className="mr-1.5" />
                                            {interview.userFeedback ? 'Edit Feedback' : 'Add Feedback'}
                                        </button>
                                    )}
                                </div>

                                {showFeedbackForm ? (
                                    <form onSubmit={handleSubmitFeedback} className="space-y-4">
                                        <div>
                                            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                                                Your feedback about this interview
                                            </label>
                                            <textarea
                                                id="feedback"
                                                name="feedback"
                                                rows={4}
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                placeholder="Share your thoughts about this interview..."
                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowFeedbackForm(false)}
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                            >
                                                {submitting ? (
                                                    <>
                                                        <Loader size={16} className="mr-1.5 animate-spin" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    'Submit Feedback'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        {interview.userFeedback ? (
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <p className="text-sm text-gray-600 mb-2">Your feedback:</p>
                                                <p className="text-sm text-gray-900 whitespace-pre-line">{interview.userFeedback}</p>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                                {canProvideFeedback ? (
                                                    <p className="text-gray-500">
                                                        You haven't provided any feedback for this interview yet.
                                                    </p>
                                                ) : (
                                                    <p className="text-gray-500">
                                                        Feedback can be provided after the interview is completed.
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {interview.companyFeedback && (
                                            <div className="mt-4 bg-blue-50 rounded-lg p-4">
                                                <p className="text-sm text-gray-600 mb-2">Company feedback:</p>
                                                <p className="text-sm text-gray-900 whitespace-pre-line">{interview.companyFeedback}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Additional tips or preparation guidance */}
                    {isUpcoming && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="text-md font-medium text-blue-900 mb-2">Prepare for Your Interview</h3>
                            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                                <li>Research the company and the role thoroughly</li>
                                <li>Prepare examples of your relevant experience</li>
                                <li>Practice common interview questions</li>
                                <li>Prepare questions to ask the interviewer</li>
                                <li>Check your equipment if it's an online interview</li>
                                <li>Plan your journey if it's an on-site interview</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default UserInterviewDetail;