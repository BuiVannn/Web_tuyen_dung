import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    FileText,
    Upload,
    Calendar,
    Search,
    Check,
    X,
    Clock,
    Filter
} from 'lucide-react';
import ImageWithFallback from '../ImageWithFallback';

const DashboardApplications = () => {
    const { backendUrl, userToken, userData, fetchUserData } = useContext(AppContext);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isResumeEdit, setIsResumeEdit] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (userToken) {
            fetchApplications();
        }
    }, [userToken, filterStatus]);

    const fetchApplications = async () => {
        try {
            setLoading(true);

            // Construct query string for status filter
            let url = `${backendUrl}/api/users/applications`;
            if (filterStatus !== 'all') {
                url += `?status=${filterStatus}`;
            }

            const { data } = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            if (data.success) {
                setApplications(data.applications);
            } else {
                toast.error(data.message || 'Failed to fetch applications');
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    };

    const updateResume = async () => {
        try {
            if (!resumeFile) {
                return toast.error('Please select a resume file');
            }

            setIsUploading(true);
            const formData = new FormData();
            formData.append('resume', resumeFile);

            const { data } = await axios.post(
                `${backendUrl}/api/users/update-resume`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (data.success) {
                toast.success('Resume updated successfully');
                fetchUserData();
                setIsResumeEdit(false);
                setResumeFile(null);
            } else {
                toast.error(data.message || 'Failed to update resume');
            }
        } catch (error) {
            console.error('Error updating resume:', error);
            toast.error('Failed to update resume');
        } finally {
            setIsUploading(false);
        }
    };

    const handleStatusFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
            viewed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Viewed' },
            shortlisted: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Shortlisted' },
            interviewing: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Interviewing' },
            hired: { bg: 'bg-green-100', text: 'text-green-800', label: 'Hired' },
            rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
        };

        const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };

        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} capitalize`}>
                {config.label}
            </span>
        );
    };

    // Filter applications by search term
    const filteredApplications = applications.filter(app => {
        const jobTitle = app.jobId?.title?.toLowerCase() || '';
        const companyName = app.companyId?.name?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        return jobTitle.includes(search) || companyName.includes(search);
    });

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">My Applications</h2>
                <p className="text-gray-600 mt-1">Track all your job applications</p>
            </div>

            {/* Resume Section */}
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Your Resume</h3>

                {isResumeEdit ? (
                    <div className="flex flex-wrap items-center gap-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors flex items-center">
                                <Upload size={16} className="mr-2" />
                                {resumeFile ? resumeFile.name : "Select PDF"}
                            </div>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setResumeFile(e.target.files[0])}
                                className="hidden"
                            />
                        </label>

                        <div className="flex space-x-2">
                            <button
                                onClick={updateResume}
                                disabled={isUploading || !resumeFile}
                                className={`px-4 py-2 rounded-md flex items-center ${isUploading || !resumeFile
                                        ? 'bg-green-100 text-green-400 cursor-not-allowed'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                            >
                                {isUploading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Check size={16} className="mr-2" />
                                        Save
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setIsResumeEdit(false);
                                    setResumeFile(null);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
                            >
                                <X size={16} className="mr-2" />
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-wrap items-center gap-4">
                        {userData?.resume ? (
                            <>
                                <a
                                    href={userData.resume}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                                >
                                    <FileText size={16} className="mr-2" />
                                    View Resume
                                </a>
                                <button
                                    onClick={() => setIsResumeEdit(true)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Update Resume
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsResumeEdit(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                            >
                                <Upload size={16} className="mr-2" />
                                Upload Resume
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Applications List */}
            <div className="p-6">
                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search applications..."
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter size={16} className="text-gray-400" />
                            </div>
                            <select
                                value={filterStatus}
                                onChange={handleStatusFilterChange}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
                            >
                                <option value="all">All Applications</option>
                                <option value="pending">Pending</option>
                                <option value="viewed">Viewed</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="interviewing">Interviewing</option>
                                <option value="hired">Hired</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No applications found</h3>
                        {filterStatus !== 'all' || searchTerm ? (
                            <p className="text-gray-500">Try changing your filters or search term</p>
                        ) : (
                            <div>
                                <p className="text-gray-500 mb-4">You haven't applied to any jobs yet</p>
                                <Link
                                    to="/"
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    <Search size={16} className="mr-2" />
                                    Browse Jobs
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Company
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Job Title
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Applied Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredApplications.map((application) => (
                                        <tr key={application._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <ImageWithFallback
                                                            src={application.companyId?.image}
                                                            alt={application.companyId?.name}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {application.companyId?.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{application.jobId?.title}</div>
                                                <div className="text-xs text-gray-500">{application.jobId?.location}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(application.date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(application.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {application.status === 'interviewing' && (
                                                    <Link
                                                        to="/dashboard/interviews"
                                                        className="text-blue-600 hover:text-blue-800 flex items-center"
                                                    >
                                                        <Calendar size={16} className="mr-1.5" />
                                                        View Interview
                                                    </Link>
                                                )}
                                                {application.status === 'pending' && (
                                                    <span className="flex items-center text-yellow-600">
                                                        <Clock size={16} className="mr-1.5" />
                                                        Pending Review
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DashboardApplications;