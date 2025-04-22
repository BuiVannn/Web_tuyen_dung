import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Briefcase, Users, FileText, ChevronRight, TrendingUp, Calendar,
    Star, Clock, Award, CheckCircle, PlusCircle, LineChart, Search,
    BarChart4, ArrowUpRight, Target, Mail, AlertCircle, Zap, CreditCard
} from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import RecruitmentAnalytics from './RecruitmentAnalytics';
import JobPostSuggestion from './JobPostSuggestion';

const RecruiterDashboardPreview = ({ companyData }) => {
    const { companyToken, backendUrl } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        activeJobs: 0,
        totalApplications: 0,
        hiredCandidates: 0,
        newApplications: 0,
        viewCount: 0,
        conversionRate: 0,
        topPerformingJob: null,
        pendingReviews: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [upcomingInterviews, setUpcomingInterviews] = useState([]);
    const [showAIHelper, setShowAIHelper] = useState(false);

    useEffect(() => {
        if (companyToken) {
            fetchDashboardData();
        }
    }, [companyToken]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch company stats
            const statsResponse = await axios.get(`${backendUrl}/api/companies/stats`, {
                headers: {
                    'Authorization': `Bearer ${companyToken}`
                }
            });

            if (statsResponse.data.success) {
                setStats(statsResponse.data.stats);

                // Prepare analytics data from stats
                const analyticsData = {
                    applications: statsResponse.data.stats.applicationTimeline || generateDummyTimeline('applications', 4),
                    jobViews: statsResponse.data.stats.viewsTimeline || generateDummyTimeline('views', 4),
                    conversionByJob: statsResponse.data.stats.conversionByJob || generateDummyConversionData(),
                    topSkills: statsResponse.data.stats.topSkills || generateDummySkillsData()
                };

                setAnalyticsData(analyticsData);
            }

            // Fetch recent applications
            const applicationsResponse = await axios.get(`${backendUrl}/api/companies/applicants`, {
                headers: {
                    'Authorization': `Bearer ${companyToken}`
                }
            });

            if (applicationsResponse.data.success && applicationsResponse.data.applications) {
                // Get only the 5 most recent applications
                const recent = applicationsResponse.data.applications
                    .slice(0, 5)
                    .map(app => ({
                        id: app._id,
                        type: 'application',
                        title: `New application for ${app.jobId?.title || 'a job'}`,
                        name: app.userId?.name || 'A candidate',
                        date: new Date(app.date || app.createdAt).toLocaleDateString(),
                        image: app.userId?.image || null
                    }));
                setRecentActivity(recent);

                // Generate dummy upcoming interviews (in a real app, this would be from a dedicated API)
                const interviews = applicationsResponse.data.applications
                    .filter(app => app.status === 'interviewing' || Math.random() > 0.7)
                    .slice(0, 3)
                    .map((app, index) => {
                        const futureDate = new Date();
                        futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 7) + 1);
                        return {
                            id: app._id,
                            candidate: app.userId?.name || 'Candidate Name',
                            position: app.jobId?.title || 'Position Title',
                            date: futureDate,
                            time: `${10 + index}:00 ${index % 2 === 0 ? 'AM' : 'PM'}`,
                            image: app.userId?.image || null
                        };
                    });
                setUpcomingInterviews(interviews);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // Helper function to generate dummy timeline data
    const generateDummyTimeline = (type, weeks) => {
        const result = [];
        for (let i = 1; i <= weeks; i++) {
            result.push({
                name: `Week ${i}`,
                [type]: Math.floor(Math.random() * 15) + 5
            });
        }
        return result;
    };

    // Helper function to generate dummy conversion data
    const generateDummyConversionData = () => {
        const titles = ['Frontend Developer', 'UI Designer', 'Project Manager', 'DevOps Engineer', 'Marketing Specialist'];
        return titles.map(name => ({
            name,
            value: Math.floor(Math.random() * 30) + 5
        }));
    };

    // Helper function to generate dummy skills data
    const generateDummySkillsData = () => {
        const skills = ['React', 'JavaScript', 'Node.js', 'SQL', 'Python'];
        return skills.map(name => ({
            name,
            count: Math.floor(Math.random() * 20) + 5
        }));
    };

    return (
        <div className="space-y-8">
            {/* Welcome Section with Quick Actions */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-8 md:px-10 md:py-12">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                        <div className="mb-6 md:mb-0">
                            <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">
                                Welcome back, {companyData?.name || 'Recruiter'}
                            </h1>
                            <p className="text-blue-100 mb-4">
                                Your recruiting dashboard is ready. Here's what's happening today.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    to="/dashboard/add-job"
                                    className="flex items-center bg-white text-blue-600 hover:bg-blue-50 transition font-medium px-4 py-2 rounded-md"
                                >
                                    <PlusCircle size={18} className="mr-2" />
                                    Post a New Job
                                </Link>
                                <Link
                                    to="/dashboard/manage-jobs"
                                    className="flex items-center bg-blue-800 bg-opacity-30 text-white hover:bg-opacity-40 transition font-medium px-4 py-2 rounded-md"
                                >
                                    <Briefcase size={18} className="mr-2" />
                                    Manage Jobs
                                </Link>
                                <Link
                                    to="/dashboard/view-applications"
                                    className="flex items-center bg-blue-800 bg-opacity-30 text-white hover:bg-opacity-40 transition font-medium px-4 py-2 rounded-md"
                                >
                                    <Users size={18} className="mr-2" />
                                    View Applications
                                </Link>
                            </div>
                        </div>
                        {companyData?.image && (
                            <div className="hidden md:block">
                                <div className="relative">
                                    <ImageWithFallback
                                        src={companyData.image}
                                        alt={companyData.name}
                                        className="w-24 h-24 rounded-lg object-cover bg-white p-1"
                                    />
                                    <span className="absolute -bottom-2 -right-2 bg-green-500 rounded-full w-5 h-5 border-2 border-white"></span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Recruiting Assistant Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg">
                <div className="absolute right-0 top-0 w-64 h-full opacity-10">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#FFFFFF" d="M40.8,-49.7C54.7,-40.1,68.7,-28.5,74.6,-12.9C80.5,2.8,78.4,22.3,68.5,36.1C58.7,49.9,41.2,57.9,23.7,63.3C6.2,68.7,-11.3,71.5,-28.2,67.2C-45.1,62.9,-61.3,51.5,-70.1,35.9C-78.9,20.3,-80.3,0.6,-74.4,-16.3C-68.6,-33.1,-55.5,-47.1,-41.1,-56.5C-26.7,-65.9,-11.1,-70.7,2.3,-73.5C15.7,-76.3,27,-59.3,40.8,-49.7Z" transform="translate(100 100)" />
                    </svg>
                </div>
                <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-4 md:mb-0 md:mr-8">
                        <div className="flex items-center mb-2">
                            <Zap className="text-yellow-300 mr-2" size={24} />
                            <h2 className="text-white text-xl font-bold">AI Recruiting Assistant</h2>
                        </div>
                        <p className="text-indigo-100 max-w-2xl">
                            Boost your hiring process with AI-powered tools. Get smart job description templates, candidate screening assistance, and interview question suggestions.
                        </p>
                        <button
                            onClick={() => setShowAIHelper(!showAIHelper)}
                            className="mt-4 bg-white text-indigo-700 hover:bg-indigo-50 font-medium px-4 py-2 rounded-md transition-colors flex items-center"
                        >
                            {showAIHelper ? 'Hide AI Assistant' : 'Try AI Assistant'}
                            <ChevronRight size={16} className="ml-1" />
                        </button>
                    </div>
                    <div className="flex-shrink-0">
                        <div className="bg-white bg-opacity-20 p-3 rounded-full">
                            <div className="bg-white bg-opacity-20 p-3 rounded-full">
                                <div className="bg-white bg-opacity-90 p-2 rounded-full w-14 h-14 flex items-center justify-center">
                                    <Robot className="text-indigo-600" size={32} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Helper Section - Conditionally rendered */}
            {showAIHelper && (
                <JobPostSuggestion companyData={companyData} />
            )}

            {/* Stats Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Active Jobs</p>
                            <p className="text-2xl font-semibold">{loading ? '...' : stats.activeJobs}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">New Applications</p>
                            <p className="text-2xl font-semibold">{loading ? '...' : stats.newApplications}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                            <FileText size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Applications</p>
                            <p className="text-2xl font-semibold">{loading ? '...' : stats.totalApplications}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Hired Candidates</p>
                            <p className="text-2xl font-semibold">{loading ? '...' : stats.hiredCandidates}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Job Views</p>
                            <p className="text-2xl font-semibold">{loading ? '...' : stats.viewCount || '238'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-pink-100 text-pink-600 mr-4">
                            <Target size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Conversion Rate</p>
                            <p className="text-2xl font-semibold">{loading ? '...' : `${stats.conversionRate || '18'}%`}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-teal-100 text-teal-600 mr-4">
                            <ArrowUpRight size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Top Performing Job</p>
                            <p className="text-lg font-semibold truncate max-w-[160px]">
                                {loading ? '...' : (stats.topPerformingJob ? stats.topPerformingJob.title : 'Frontend Developer')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area: Analytics + Activity + Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Analytics Section - Left 2/3 */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow border border-gray-100 p-6 mb-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Recruitment Analytics</h2>
                            <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                                View Full Reports <ChevronRight size={16} />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <RecruitmentAnalytics data={analyticsData} />
                        )}
                    </div>

                    {/* Recent Activity Section */}
                    <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-semibold text-lg">Recent Activity</h2>
                            <Link to="/dashboard/view-applications" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                                View all <ChevronRight size={16} />
                            </Link>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : recentActivity.length > 0 ? (
                                recentActivity.map((activity, index) => (
                                    <div key={index} className="px-6 py-4 hover:bg-gray-50">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 mr-4">
                                                <ImageWithFallback
                                                    src={activity.image}
                                                    alt={activity.name}
                                                    className="h-10 w-10 rounded-full"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {activity.title}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {activity.name} - {activity.date}
                                                </p>
                                            </div>
                                            <div className="ml-2">
                                                <Link
                                                    to={`/dashboard/view-applications`}
                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-6 py-8 text-center text-gray-500">
                                    <p>No recent activity to display</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - 1/3 */}
                <div className="space-y-6">
                    {/* Upcoming Interviews */}
                    <div className="bg-white rounded-lg shadow border border-gray-100">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-semibold text-lg">Upcoming Interviews</h2>
                            <Link to="/dashboard/calendar" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                                Calendar <ChevronRight size={16} />
                            </Link>
                        </div>

                        <div className="p-4">
                            {upcomingInterviews.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingInterviews.map((interview, idx) => (
                                        <div key={idx} className="flex p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                            <div className="mr-3 flex-shrink-0">
                                                <div className="bg-blue-100 rounded-lg w-12 h-12 flex flex-col items-center justify-center text-center">
                                                    <span className="text-xs text-blue-800">{new Intl.DateTimeFormat('en-US', { month: 'short' }).format(interview.date)}</span>
                                                    <span className="text-sm font-bold text-blue-800">{interview.date.getDate()}</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800 text-sm">{interview.candidate}</p>
                                                <p className="text-xs text-gray-500">{interview.position}</p>
                                                <p className="text-xs text-blue-600 mt-1">{interview.time}</p>
                                            </div>
                                            <div className="flex-shrink-0 self-center">
                                                <button className="text-gray-400 hover:text-gray-600">
                                                    <Calendar size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-500">
                                    <Calendar className="mx-auto mb-2 text-gray-400" size={24} />
                                    <p>No upcoming interviews</p>
                                </div>
                            )}

                            <div className="mt-4">
                                <button className="w-full py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors">
                                    Schedule New Interview
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Shortcuts */}
                    <div className="bg-white rounded-lg shadow border border-gray-100">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="font-semibold text-lg">Quick Actions</h2>
                        </div>

                        <div className="p-4">
                            <div className="grid grid-cols-1 gap-3">
                                <Link to="/dashboard/add-job" className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors">
                                    <div className="p-2 bg-blue-100 rounded-md text-blue-600 mr-3">
                                        <PlusCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Post a New Job</p>
                                        <p className="text-xs text-gray-500">Create a new job listing</p>
                                    </div>
                                </Link>

                                <Link to="/dashboard/manage-jobs" className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors">
                                    <div className="p-2 bg-purple-100 rounded-md text-purple-600 mr-3">
                                        <Briefcase size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Manage Jobs</p>
                                        <p className="text-xs text-gray-500">Edit or update your listings</p>
                                    </div>
                                </Link>

                                <Link to="/dashboard/view-applications" className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors">
                                    <div className="p-2 bg-green-100 rounded-md text-green-600 mr-3">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">View Applications</p>
                                        <p className="text-xs text-gray-500">Review candidate applications</p>
                                    </div>
                                </Link>

                                <Link to="/dashboard/profile" className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors">
                                    <div className="p-2 bg-yellow-100 rounded-md text-yellow-600 mr-3">
                                        <Star size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Company Profile</p>
                                        <p className="text-xs text-gray-500">Update your company details</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Status */}
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs font-semibold bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full">FREE PLAN</span>
                                    <h3 className="text-white font-bold mt-2">Upgrade for more features</h3>
                                    <p className="text-gray-300 text-sm mt-1">Unlock premium tools to enhance your recruiting</p>
                                </div>
                                <div className="bg-gray-700 p-2 rounded-full">
                                    <CreditCard className="text-yellow-400" size={24} />
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                    <div className="bg-yellow-400 h-full" style={{ width: '30%' }}></div>
                                </div>
                                <p className="text-gray-400 text-xs mt-2">3/10 job posts used this month</p>
                            </div>

                            <button className="mt-4 bg-white hover:bg-gray-100 text-gray-900 w-full py-2 rounded font-medium text-sm transition-colors">
                                Upgrade Plan
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recruiting Tips */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Recruiting Tips</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center mb-3">
                            <Clock className="text-blue-600 mr-2" size={20} />
                            <h3 className="font-medium">Respond Quickly</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                            Candidates are 4x more likely to consider your job when you respond within a day.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center mb-3">
                            <Award className="text-blue-600 mr-2" size={20} />
                            <h3 className="font-medium">Highlight Benefits</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                            Jobs that list benefits attract 75% more qualified applicants.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center mb-3">
                            <Search className="text-blue-600 mr-2" size={20} />
                            <h3 className="font-medium">Keyword Optimize</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                            Include industry-specific keywords in your job titles and descriptions to attract qualified candidates.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Create a Robot icon component since it's not included in lucide-react
const Robot = ({ size = 24, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <rect x="9" y="7" width="6" height="4" />
        <circle cx="9" cy="15" r="1" />
        <circle cx="15" cy="15" r="1" />
        <path d="M5 11V7a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v4" />
    </svg>
);

export default RecruiterDashboardPreview;
// import React, { useState, useEffect, useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { AppContext } from '../context/AppContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import {
//     Briefcase, Users, FileText, ChevronRight, TrendingUp,
//     Star, Clock, Award, CheckCircle, PlusCircle, LineChart,
//     BarChart4, ArrowUpRight, Target
// } from 'lucide-react';
// import ImageWithFallback from './ImageWithFallback';
// import RecruitmentAnalytics from './RecruitmentAnalytics';

// const RecruiterDashboardPreview = ({ companyData }) => {
//     const { companyToken, backendUrl } = useContext(AppContext);
//     const [loading, setLoading] = useState(true);
//     const [stats, setStats] = useState({
//         activeJobs: 0,
//         totalApplications: 0,
//         hiredCandidates: 0,
//         newApplications: 0,
//         viewCount: 0,
//         conversionRate: 0,
//         topPerformingJob: null
//     });
//     const [recentActivity, setRecentActivity] = useState([]);
//     const [analyticsData, setAnalyticsData] = useState(null);

//     useEffect(() => {
//         if (companyToken) {
//             fetchDashboardData();
//         }
//     }, [companyToken]);

//     const fetchDashboardData = async () => {
//         setLoading(true);
//         try {
//             // Fetch company stats
//             const statsResponse = await axios.get(`${backendUrl}/api/companies/stats`, {
//                 headers: {
//                     'Authorization': `Bearer ${companyToken}`
//                 }
//             });

//             if (statsResponse.data.success) {
//                 setStats(statsResponse.data.stats);

//                 // Prepare analytics data from stats
//                 const analyticsData = {
//                     applications: statsResponse.data.stats.applicationTimeline || [],
//                     jobViews: statsResponse.data.stats.viewsTimeline || [],
//                     conversionByJob: statsResponse.data.stats.conversionByJob || [],
//                     topSkills: statsResponse.data.stats.topSkills || []
//                 };

//                 setAnalyticsData(analyticsData);
//             }

//             // Fetch recent applications
//             const applicationsResponse = await axios.get(`${backendUrl}/api/companies/applicants`, {
//                 headers: {
//                     'Authorization': `Bearer ${companyToken}`
//                 }
//             });

//             if (applicationsResponse.data.success && applicationsResponse.data.applications) {
//                 // Get only the 5 most recent applications
//                 const recent = applicationsResponse.data.applications
//                     .slice(0, 5)
//                     .map(app => ({
//                         id: app._id,
//                         type: 'application',
//                         title: `New application for ${app.jobId?.title || 'a job'}`,
//                         name: app.userId?.name || 'A candidate',
//                         date: new Date(app.date || app.createdAt).toLocaleDateString(),
//                         image: app.userId?.image || null
//                     }));
//                 setRecentActivity(recent);
//             }
//         } catch (error) {
//             console.error('Error fetching dashboard data:', error);
//             toast.error('Failed to load dashboard data');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="space-y-8">
//             {/* Welcome Section */}
//             <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden">
//                 <div className="px-6 py-8 md:px-10 md:py-12">
//                     <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
//                         <div className="mb-6 md:mb-0">
//                             <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">
//                                 Welcome back, {companyData?.name || 'Recruiter'}
//                             </h1>
//                             <p className="text-blue-100 mb-4">
//                                 Your recruiting dashboard is ready. Here's what's happening today.
//                             </p>
//                             <div className="flex space-x-3">
//                                 <Link
//                                     to="/dashboard/add-job"
//                                     className="flex items-center bg-white text-blue-600 hover:bg-blue-50 transition font-medium px-4 py-2 rounded-md"
//                                 >
//                                     <PlusCircle size={18} className="mr-2" />
//                                     Post a New Job
//                                 </Link>
//                                 <Link
//                                     to="/dashboard/manage-jobs"
//                                     className="flex items-center bg-blue-800 bg-opacity-30 text-white hover:bg-opacity-40 transition font-medium px-4 py-2 rounded-md"
//                                 >
//                                     <Briefcase size={18} className="mr-2" />
//                                     Manage Jobs
//                                 </Link>
//                             </div>
//                         </div>
//                         {companyData?.image && (
//                             <div className="hidden md:block">
//                                 <ImageWithFallback
//                                     src={companyData.image}
//                                     alt={companyData.name}
//                                     className="w-24 h-24 rounded-lg object-cover bg-white p-1"
//                                 />
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Performance Metrics */}
//             <div className="p-6 bg-white rounded-lg shadow border border-gray-100">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-xl font-semibold text-gray-800">Recruitment Performance</h2>
//                     <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
//                         Full Analytics <ChevronRight size={16} />
//                     </Link>
//                 </div>

//                 {loading ? (
//                     <div className="flex justify-center items-center h-64">
//                         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//                     </div>
//                 ) : (
//                     <RecruitmentAnalytics data={analyticsData} />
//                 )}
//             </div>

//             {/* Stats Section */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
//                     <div className="flex items-center">
//                         <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
//                             <Briefcase size={24} />
//                         </div>
//                         <div>
//                             <p className="text-sm text-gray-500">Active Jobs</p>
//                             <p className="text-2xl font-semibold">{loading ? '...' : stats.activeJobs}</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
//                     <div className="flex items-center">
//                         <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
//                             <Users size={24} />
//                         </div>
//                         <div>
//                             <p className="text-sm text-gray-500">New Applications</p>
//                             <p className="text-2xl font-semibold">{loading ? '...' : stats.newApplications}</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
//                     <div className="flex items-center">
//                         <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
//                             <FileText size={24} />
//                         </div>
//                         <div>
//                             <p className="text-sm text-gray-500">Total Applications</p>
//                             <p className="text-2xl font-semibold">{loading ? '...' : stats.totalApplications}</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
//                     <div className="flex items-center">
//                         <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
//                             <CheckCircle size={24} />
//                         </div>
//                         <div>
//                             <p className="text-sm text-gray-500">Hired Candidates</p>
//                             <p className="text-2xl font-semibold">{loading ? '...' : stats.hiredCandidates}</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Additional Metrics Row */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
//                     <div className="flex items-center">
//                         <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
//                             <TrendingUp size={24} />
//                         </div>
//                         <div>
//                             <p className="text-sm text-gray-500">Job Views</p>
//                             <p className="text-2xl font-semibold">{loading ? '...' : stats.viewCount || 0}</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
//                     <div className="flex items-center">
//                         <div className="p-3 rounded-full bg-pink-100 text-pink-600 mr-4">
//                             <Target size={24} />
//                         </div>
//                         <div>
//                             <p className="text-sm text-gray-500">Conversion Rate</p>
//                             <p className="text-2xl font-semibold">{loading ? '...' : `${stats.conversionRate || 0}%`}</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
//                     <div className="flex items-center">
//                         <div className="p-3 rounded-full bg-teal-100 text-teal-600 mr-4">
//                             <ArrowUpRight size={24} />
//                         </div>
//                         <div>
//                             <p className="text-sm text-gray-500">Top Performing Job</p>
//                             <p className="text-lg font-semibold truncate w-36">
//                                 {loading ? '...' : (stats.topPerformingJob ? stats.topPerformingJob.title : 'No data')}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Recent Activity & Shortcuts */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
//                     <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
//                         <h2 className="font-semibold text-lg">Recent Activity</h2>
//                         <Link to="/dashboard/view-applications" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
//                             View all <ChevronRight size={16} />
//                         </Link>
//                     </div>

//                     <div className="divide-y divide-gray-100">
//                         {loading ? (
//                             <div className="flex justify-center items-center h-64">
//                                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//                             </div>
//                         ) : recentActivity.length > 0 ? (
//                             recentActivity.map((activity, index) => (
//                                 <div key={index} className="px-6 py-4 hover:bg-gray-50">
//                                     <div className="flex items-center">
//                                         <div className="flex-shrink-0 mr-4">
//                                             <ImageWithFallback
//                                                 src={activity.image}
//                                                 alt={activity.name}
//                                                 className="h-10 w-10 rounded-full"
//                                             />
//                                         </div>
//                                         <div className="flex-1 min-w-0">
//                                             <p className="text-sm font-medium text-gray-900 truncate">
//                                                 {activity.title}
//                                             </p>
//                                             <p className="text-sm text-gray-500 truncate">
//                                                 {activity.name} - {activity.date}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))
//                         ) : (
//                             <div className="px-6 py-8 text-center text-gray-500">
//                                 <p>No recent activity to display</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <div className="bg-white rounded-lg shadow border border-gray-100">
//                     <div className="px-6 py-4 border-b border-gray-100">
//                         <h2 className="font-semibold text-lg">Quick Shortcuts</h2>
//                     </div>

//                     <div className="p-4">
//                         <div className="grid grid-cols-1 gap-3">
//                             <Link to="/dashboard/add-job" className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors">
//                                 <div className="p-2 bg-blue-100 rounded-md text-blue-600 mr-3">
//                                     <PlusCircle size={20} />
//                                 </div>
//                                 <div>
//                                     <p className="font-medium text-gray-800">Post a New Job</p>
//                                     <p className="text-xs text-gray-500">Create a new job listing</p>
//                                 </div>
//                             </Link>

//                             <Link to="/dashboard/manage-jobs" className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors">
//                                 <div className="p-2 bg-purple-100 rounded-md text-purple-600 mr-3">
//                                     <Briefcase size={20} />
//                                 </div>
//                                 <div>
//                                     <p className="font-medium text-gray-800">Manage Jobs</p>
//                                     <p className="text-xs text-gray-500">Edit or update your listings</p>
//                                 </div>
//                             </Link>

//                             <Link to="/dashboard/view-applications" className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors">
//                                 <div className="p-2 bg-green-100 rounded-md text-green-600 mr-3">
//                                     <Users size={20} />
//                                 </div>
//                                 <div>
//                                     <p className="font-medium text-gray-800">View Applications</p>
//                                     <p className="text-xs text-gray-500">Review candidate applications</p>
//                                 </div>
//                             </Link>

//                             <Link to="/dashboard/profile" className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors">
//                                 <div className="p-2 bg-yellow-100 rounded-md text-yellow-600 mr-3">
//                                     <Star size={20} />
//                                 </div>
//                                 <div>
//                                     <p className="font-medium text-gray-800">Company Profile</p>
//                                     <p className="text-xs text-gray-500">Update your company details</p>
//                                 </div>
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Recruiting Tips */}
//             <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg shadow p-6">
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800">Recruiting Tips</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="bg-white rounded-lg p-4 shadow-sm">
//                         <div className="flex items-center mb-3">
//                             <Clock className="text-blue-600 mr-2" size={20} />
//                             <h3 className="font-medium">Respond Quickly</h3>
//                         </div>
//                         <p className="text-sm text-gray-600">
//                             Candidates are 4x more likely to consider your job when you respond within a day.
//                         </p>
//                     </div>

//                     <div className="bg-white rounded-lg p-4 shadow-sm">
//                         <div className="flex items-center mb-3">
//                             <Award className="text-blue-600 mr-2" size={20} />
//                             <h3 className="font-medium">Highlight Benefits</h3>
//                         </div>
//                         <p className="text-sm text-gray-600">
//                             Jobs that list benefits attract 75% more qualified applicants.
//                         </p>
//                     </div>

//                     <div className="bg-white rounded-lg p-4 shadow-sm">
//                         <div className="flex items-center mb-3">
//                             <LineChart className="text-blue-600 mr-2" size={20} />
//                             <h3 className="font-medium">Track Performance</h3>
//                         </div>
//                         <p className="text-sm text-gray-600">
//                             Regularly check your job performance to optimize your hiring strategy.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RecruiterDashboardPreview;




// import React, { useState, useEffect, useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { AppContext } from '../context/AppContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import {
//     Briefcase, Users, FileText, ChevronRight, TrendingUp,
//     Star, Clock, Award, CheckCircle, PlusCircle, LineChart
// } from 'lucide-react';
// import ImageWithFallback from './ImageWithFallback';

// const RecruiterDashboardPreview = ({ companyData }) => {
//     const { companyToken, backendUrl } = useContext(AppContext);
//     const [loading, setLoading] = useState(true);
//     const [stats, setStats] = useState({
//         activeJobs: 0,
//         totalApplications: 0,
//         hiredCandidates: 0,
//         newApplications: 0
//     });
//     const [recentActivity, setRecentActivity] = useState([]);

//     useEffect(() => {
//         if (companyToken) {
//             fetchDashboardData();
//         }
//     }, [companyToken]);

//     const fetchDashboardData = async () => {
//         setLoading(true);
//         try {
//             // Fetch company stats
//             const statsResponse = await axios.get(`${backendUrl}/api/companies/stats`, {
//                 headers: {
//                     'Authorization': `Bearer ${companyToken}`
//                 }
//             });

//             if (statsResponse.data.success) {
//                 setStats(statsResponse.data.stats);
//             }

//             // Fetch recent applications (can be modified to fetch actual recent activity)
//             const applicationsResponse = await axios.get(`${backendUrl}/api/companies/applicants`, {
//                 headers: {
//                     'Authorization': `Bearer ${companyToken}`
//                 }
//             });

//             if (applicationsResponse.data.success && applicationsResponse.data.applications) {
//                 // Get only the 5 most recent applications
//                 const recent = applicationsResponse.data.applications
//                     .slice(0, 5)
//                     .map(app => ({
//                         id: app._id,
//                         type: 'application',
//                         title: `New application for ${app.jobId?.title || 'a job'}`,
//                         name: app.userId?.name || 'A candidate',
//                         date: new Date(app.date || app.createdAt).toLocaleDateString(),
//                         image: app.userId?.image || null
//                     }));
//                 setRecentActivity(recent);
//             }
//         } catch (error) {
//             console.error('Error fetching dashboard data:', error);
//             toast.error('Failed to load dashboard data');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="space-y-8">
//             {/* Welcome Section */}
//             <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden">
//                 <div className="px-6 py-8 md:px-10 md:py-12">
//                     <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
//                         <div className="mb-6 md:mb-0">
//                             <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">
//                                 Welcome back, {companyData?.name || 'Recruiter'}
//                             </h1>
//                             <p className="text-blue-100 mb-4">
//                                 Your recruiting dashboard is ready. Here's what's happening today.
//                             </p>
//                             <div className="flex space-x-3">
//                                 <Link
//                                     to="/dashboard/add-job"
//                                     className="flex items-center bg-white text-blue-600 hover:bg-blue-50 transition font-medium px-4 py-2 rounded-md"
//                                 >
//                                     <PlusCircle size={18} className="mr-2" />
//                                     Post a New Job
//                                 </Link>
//                                 <Link
//                                     to="/dashboard/manage-jobs"
//                                     className="flex items-center bg-blue-800 bg-opacity-30 text-white hover:bg-opacity-40 transition font-medium px-4 py-2 rounded-md"
//                                 >
//                                     <Briefcase size={18} className="mr-2" />
//                                     Manage Jobs
//                                 </Link>
//                             </div>
//                         </div>
//                         {companyData?.image && (
//                             <div className="hidden md:block">
//                                 <ImageWithFallback
//                                     src={companyData.image}
//                                     alt={companyData.name}
//                                     className="w-24 h-24 rounded-lg object-cover bg-white p-1"
//                                 />
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Stats Section */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
//                     <div className="flex items-center">
//                         <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
//                             <Briefcase size={24} />
//                         </div>
//                         <div>
//                             <p className="text-sm text-gray-500">Active Jobs</p>
//                             <p className="text-2xl font-semibold">{loading ? '...' : stats.activeJobs}</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
//                     <div className="flex items-center">
//                         <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
//                             <Users size={24} />
//                         </div>
//                         <div>
//                             <p className="text-sm text-gray-500">New Applications</p>
//                             <p className="text-2xl font-semibold">{loading ? '...' : stats.newApplications}</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
//                     <div className="flex items-center">
//                         <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
//                             <FileText size={24} />
//                         </div>
//                         <div>
//                             <p className="text-sm text-gray-500">Total Applications</p>
//                             <p className="text-2xl font-semibold">{loading ? '...' : stats.totalApplications}</p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
//                     <div className="flex items-center">
//                         <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
//                             <CheckCircle size={24} />
//                         </div>
//                         <div>
//                             <p className="text-sm text-gray-500">Hired Candidates</p>
//                             <p className="text-2xl font-semibold">{loading ? '...' : stats.hiredCandidates}</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Recent Activity & Shortcuts */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
//                     <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
//                         <h2 className="font-semibold text-lg">Recent Activity</h2>
//                         <Link to="/dashboard/view-applications" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
//                             View all <ChevronRight size={16} />
//                         </Link>
//                     </div>

//                     <div className="divide-y divide-gray-100">
//                         {loading ? (
//                             <div className="flex justify-center items-center h-64">
//                                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//                             </div>
//                         ) : recentActivity.length > 0 ? (
//                             recentActivity.map((activity, index) => (
//                                 <div key={index} className="px-6 py-4 hover:bg-gray-50">
//                                     <div className="flex items-center">
//                                         <div className="flex-shrink-0 mr-4">
//                                             <ImageWithFallback
//                                                 src={activity.image}
//                                                 alt={activity.name}
//                                                 className="h-10 w-10 rounded-full"
//                                             />
//                                         </div>
//                                         <div className="flex-1 min-w-0">
//                                             <p className="text-sm font-medium text-gray-900 truncate">
//                                                 {activity.title}
//                                             </p>
//                                             <p className="text-sm text-gray-500 truncate">
//                                                 {activity.name} - {activity.date}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))
//                         ) : (
//                             <div className="px-6 py-8 text-center text-gray-500">
//                                 <p>No recent activity to display</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <div className="bg-white rounded-lg shadow border border-gray-100">
//                     <div className="px-6 py-4 border-b border-gray-100">
//                         <h2 className="font-semibold text-lg">Quick Shortcuts</h2>
//                     </div>

//                     <div className="p-4">
//                         <div className="grid grid-cols-1 gap-3">
//                             <Link to="/dashboard/add-job" className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors">
//                                 <div className="p-2 bg-blue-100 rounded-md text-blue-600 mr-3">
//                                     <PlusCircle size={20} />
//                                 </div>
//                                 <div>
//                                     <p className="font-medium text-gray-800">Post a New Job</p>
//                                     <p className="text-xs text-gray-500">Create a new job listing</p>
//                                 </div>
//                             </Link>

//                             <Link to="/dashboard/manage-jobs" className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors">
//                                 <div className="p-2 bg-purple-100 rounded-md text-purple-600 mr-3">
//                                     <Briefcase size={20} />
//                                 </div>
//                                 <div>
//                                     <p className="font-medium text-gray-800">Manage Jobs</p>
//                                     <p className="text-xs text-gray-500">Edit or update your listings</p>
//                                 </div>
//                             </Link>

//                             <Link to="/dashboard/view-applications" className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors">
//                                 <div className="p-2 bg-green-100 rounded-md text-green-600 mr-3">
//                                     <Users size={20} />
//                                 </div>
//                                 <div>
//                                     <p className="font-medium text-gray-800">View Applications</p>
//                                     <p className="text-xs text-gray-500">Review candidate applications</p>
//                                 </div>
//                             </Link>

//                             <Link to="/dashboard/profile" className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors">
//                                 <div className="p-2 bg-yellow-100 rounded-md text-yellow-600 mr-3">
//                                     <Star size={20} />
//                                 </div>
//                                 <div>
//                                     <p className="font-medium text-gray-800">Company Profile</p>
//                                     <p className="text-xs text-gray-500">Update your company details</p>
//                                 </div>
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Top Talent Preview or Recruitment Tips */}
//             <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg shadow p-6">
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800">Recruiting Tips</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="bg-white rounded-lg p-4 shadow-sm">
//                         <div className="flex items-center mb-3">
//                             <Clock className="text-blue-600 mr-2" size={20} />
//                             <h3 className="font-medium">Respond Quickly</h3>
//                         </div>
//                         <p className="text-sm text-gray-600">
//                             Candidates are 4x more likely to consider your job when you respond within a day.
//                         </p>
//                     </div>

//                     <div className="bg-white rounded-lg p-4 shadow-sm">
//                         <div className="flex items-center mb-3">
//                             <Award className="text-blue-600 mr-2" size={20} />
//                             <h3 className="font-medium">Highlight Benefits</h3>
//                         </div>
//                         <p className="text-sm text-gray-600">
//                             Jobs that list benefits attract 75% more qualified applicants.
//                         </p>
//                     </div>

//                     <div className="bg-white rounded-lg p-4 shadow-sm">
//                         <div className="flex items-center mb-3">
//                             <LineChart className="text-blue-600 mr-2" size={20} />
//                             <h3 className="font-medium">Track Performance</h3>
//                         </div>
//                         <p className="text-sm text-gray-600">
//                             Regularly check your job performance to optimize your hiring strategy.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RecruiterDashboardPreview;