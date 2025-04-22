import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import {
    User, Briefcase, FileText, Calendar, ChevronRight,
    LayoutDashboard, Search, Bookmark, Bell
} from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import axios from 'axios';

const UserDashboardPreview = () => {
    const { userData, userToken, backendUrl } = useContext(AppContext);
    const [stats, setStats] = useState({
        applications: 0,
        interviews: 0,
        savedJobs: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userToken) {
            fetchStats();
        }
    }, [userToken]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/api/users/dashboard/stats`, {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });

            if (response.data.success) {
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    // Thêm savedJobs từ localStorage vào stats nếu API chưa làm xong
    useEffect(() => {
        if (!stats.savedJobs) {
            const savedJobs = JSON.parse(localStorage.getItem("favoriteJobs")) || [];
            setStats(prev => ({ ...prev, savedJobs: savedJobs.length }));
        }
    }, [stats.savedJobs]);

    return (
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div className="flex items-center mb-4 md:mb-0">
                    <div className="mr-4">
                        <ImageWithFallback
                            src={userData?.avatar}
                            alt={userData?.userId?.name || 'User'}
                            className="h-16 w-16 rounded-full object-cover border-4 border-gray-200"
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Welcome back, {userData?.userId?.name?.split(' ')[0] || 'User'}!
                        </h2>
                        <p className="text-gray-600">{userData?.title || 'Job Seeker'}</p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <LayoutDashboard size={16} className="mr-1.5" />
                        Go to Dashboard
                    </Link>
                    <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <Search size={16} className="mr-1.5" />
                        Find Jobs
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-blue-600">Applications</p>
                            <h3 className="text-2xl font-bold mt-1">
                                {loading ? '-' : stats.applications || 0}
                            </h3>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-md">
                            <FileText size={20} className="text-blue-600" />
                        </div>
                    </div>
                    <Link
                        to="/dashboard/applications"
                        className="mt-3 text-sm text-blue-600 inline-flex items-center hover:text-blue-700"
                    >
                        View all <ChevronRight size={14} className="ml-1" />
                    </Link>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-green-600">Interviews</p>
                            <h3 className="text-2xl font-bold mt-1">
                                {loading ? '-' : stats.interviews || 0}
                            </h3>
                        </div>
                        <div className="p-2 bg-green-100 rounded-md">
                            <Calendar size={20} className="text-green-600" />
                        </div>
                    </div>
                    <Link
                        to="/dashboard/interviews"
                        className="mt-3 text-sm text-green-600 inline-flex items-center hover:text-green-700"
                    >
                        View all <ChevronRight size={14} className="ml-1" />
                    </Link>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-purple-600">Saved Jobs</p>
                            <h3 className="text-2xl font-bold mt-1">
                                {loading ? '-' : stats.savedJobs || 0}
                            </h3>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-md">
                            <Bookmark size={20} className="text-purple-600" />
                        </div>
                    </div>
                    <Link
                        to="/dashboard/saved-jobs"
                        className="mt-3 text-sm text-purple-600 inline-flex items-center hover:text-purple-700"
                    >
                        View all <ChevronRight size={14} className="ml-1" />
                    </Link>
                </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Link
                        to="/profile"
                        className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                        <User size={20} className="text-gray-600 mb-2" />
                        <span className="text-sm text-gray-700">Update Profile</span>
                    </Link>
                    <Link
                        to="/dashboard/saved-jobs"
                        className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                        <Bookmark size={20} className="text-gray-600 mb-2" />
                        <span className="text-sm text-gray-700">Saved Jobs</span>
                    </Link>
                    <Link
                        to="/dashboard/interviews"
                        className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                        <Calendar size={20} className="text-gray-600 mb-2" />
                        <span className="text-sm text-gray-700">Interviews</span>
                    </Link>
                    <Link
                        to="/dashboard/settings"
                        className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                        <Bell size={20} className="text-gray-600 mb-2" />
                        <span className="text-sm text-gray-700">Notifications</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserDashboardPreview;