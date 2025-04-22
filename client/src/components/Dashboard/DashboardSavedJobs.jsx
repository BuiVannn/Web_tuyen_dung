import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import {
    Bookmark, Search, Trash2, Info, Filter, ExternalLink,
    RefreshCw, Briefcase, MapPin, DollarSign
} from 'lucide-react';
import ImageWithFallback from '../ImageWithFallback';

const DashboardSavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const navigate = useNavigate();
    const { backendUrl, userToken } = useContext(AppContext);

    useEffect(() => {
        loadSavedJobs();
    }, []);

    const loadSavedJobs = () => {
        setLoading(true);
        try {
            // Get saved jobs from localStorage
            const jobs = JSON.parse(localStorage.getItem("favoriteJobs")) || [];
            setSavedJobs(jobs);
        } catch (error) {
            console.error("Error loading saved jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    const removeJob = (jobId, e) => {
        e.stopPropagation();
        const updatedJobs = savedJobs.filter(job => job._id !== jobId);
        setSavedJobs(updatedJobs);
        localStorage.setItem("favoriteJobs", JSON.stringify(updatedJobs));
    };

    const clearAllSavedJobs = () => {
        if (window.confirm('Are you sure you want to remove all saved jobs?')) {
            localStorage.setItem("favoriteJobs", JSON.stringify([]));
            setSavedJobs([]);
        }
    };

    const handleViewJob = (jobId) => {
        navigate(`/apply-job/${jobId}`);
    };

    // Filter and search jobs
    const filteredJobs = savedJobs.filter(job => {
        const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.companyId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.location?.toLowerCase().includes(searchTerm.toLowerCase());

        if (filterType === 'all') return matchesSearch;
        return job.type?.toLowerCase().includes(filterType.toLowerCase()) && matchesSearch;
    });

    // Format salary function
    const formatSalary = (salary) => {
        if (!salary) return 'Negotiable';
        if (typeof salary === 'string') return salary;

        // Format as currency
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(salary);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                    <Bookmark size={20} className="text-blue-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">Saved Jobs</h2>
                    <span className="ml-3 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {savedJobs.length}
                    </span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => loadSavedJobs()}
                        className="text-gray-600 hover:text-gray-900"
                        title="Refresh saved jobs"
                    >
                        <RefreshCw size={18} />
                    </button>
                    {savedJobs.length > 0 && (
                        <button
                            onClick={clearAllSavedJobs}
                            className="text-red-600 hover:text-red-800 flex items-center"
                        >
                            <Trash2 size={18} className="mr-1" />
                            <span className="hidden sm:inline">Clear All</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Search by title, company or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter size={18} className="text-gray-400" />
                            </div>
                            <select
                                className="block w-full pl-10 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="all">All job types</option>
                                <option value="full-time">Full-time</option>
                                <option value="part-time">Part-time</option>
                                <option value="contract">Contract</option>
                                <option value="remote">Remote</option>
                                <option value="internship">Internship</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : savedJobs.length === 0 ? (
                <div className="p-12 text-center">
                    <div className="inline-flex justify-center items-center w-24 h-24 bg-blue-100 rounded-full mb-5">
                        <Bookmark size={40} className="text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No saved jobs yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        When you find jobs you like, click the bookmark icon to save them for later.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Search size={16} className="mr-2" />
                        Browse Jobs
                    </Link>
                </div>
            ) : filteredJobs.length === 0 ? (
                <div className="p-12 text-center">
                    <Info size={40} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No matches found</h3>
                    <p className="text-gray-600 mb-4">
                        No saved jobs match your search criteria.
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setFilterType('all');
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredJobs.map(job => (
                            <div
                                key={job._id}
                                className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                                {/* Job Card */}
                                <div className="p-5" onClick={() => handleViewJob(job._id)}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 flex-shrink-0 mr-3 overflow-hidden rounded bg-gray-100 border border-gray-200 flex items-center justify-center">
                                                <ImageWithFallback
                                                    src={job.companyId?.image}
                                                    alt={job.companyId?.name || 'Company'}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-1 hover:text-blue-600">
                                                    {job.title}
                                                </h3>
                                                <p className="text-sm text-gray-600">{job.companyId?.name}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => removeJob(job._id, e)}
                                            className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                                            title="Remove from saved jobs"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <MapPin size={16} className="text-gray-400 mr-1.5" />
                                            {job.location || 'Remote'}
                                        </div>

                                        <div className="flex items-center text-sm text-gray-600">
                                            <Briefcase size={16} className="text-gray-400 mr-1.5" />
                                            {job.type || 'Full-time'}
                                        </div>

                                        <div className="flex items-center text-sm text-gray-600">
                                            <DollarSign size={16} className="text-gray-400 mr-1.5" />
                                            {formatSalary(job.salary)}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {job.skills?.slice(0, 3).map((skill, index) => (
                                            <span key={index} className="inline-block bg-blue-50 text-blue-700 text-xs px-2.5 py-0.5 rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                        {job.skills?.length > 3 && (
                                            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2.5 py-0.5 rounded-full">
                                                +{job.skills.length - 3} more
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleViewJob(job._id)}
                                        className="w-full mt-2 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <ExternalLink size={16} className="mr-2" />
                                        View Job
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardSavedJobs;