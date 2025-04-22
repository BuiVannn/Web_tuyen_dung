import React, { useState, useEffect, useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    User,
    FileText,
    Calendar,
    Bookmark,
    Settings,
    LogOut,
    Briefcase
} from 'lucide-react';
import ImageWithFallback from '../components/ImageWithFallback';

const UserDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userToken, userData, logoutUser } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        // Set active tab based on path
        const path = location.pathname.split('/').pop();
        if (path === 'dashboard') {
            setActiveTab('overview');
        } else {
            setActiveTab(path);
        }
    }, [location.pathname]);

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 min-h-screen pt-6 pb-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Dashboard Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
                        <p className="text-gray-600">Overview and account settings</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Sidebar */}
                        <div className="lg:w-1/4">
                            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                <div className="flex items-center mb-6">
                                    <ImageWithFallback
                                        src={userData?.avatar}
                                        alt={userData?.userId?.name || 'User'}
                                        className="w-16 h-16 rounded-full mr-4 object-cover"
                                    />
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-900">{userData?.userId?.name || 'User'}</h2>
                                        <p className="text-sm text-gray-500">{userData?.title || 'Job Seeker'}</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <nav className="space-y-1">
                                        <Link
                                            to="/user-dashboard"
                                            className={`flex items-center px-3 py-2.5 rounded-md ${activeTab === 'overview' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                            onClick={() => setActiveTab('overview')}
                                        >
                                            <Briefcase size={18} className="mr-3" />
                                            Overview
                                        </Link>
                                        <Link
                                            to="/profile"
                                            className="flex items-center px-3 py-2.5 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            <User size={18} className="mr-3" />
                                            My Profile
                                        </Link>
                                        <Link
                                            to="/applications"
                                            className="flex items-center px-3 py-2.5 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            <FileText size={18} className="mr-3" />
                                            Applications
                                        </Link>
                                        <Link
                                            to="/interviews"
                                            className="flex items-center px-3 py-2.5 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            <Calendar size={18} className="mr-3" />
                                            Interviews
                                        </Link>
                                        <Link
                                            to="/saved-jobs"
                                            className="flex items-center px-3 py-2.5 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            <Bookmark size={18} className="mr-3" />
                                            Saved Jobs
                                        </Link>
                                        <Link
                                            to="/user-dashboard/settings"
                                            className={`flex items-center px-3 py-2.5 rounded-md ${activeTab === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                            onClick={() => setActiveTab('settings')}
                                        >
                                            <Settings size={18} className="mr-3" />
                                            Settings
                                        </Link>
                                        <button
                                            onClick={logoutUser}
                                            className="flex items-center px-3 py-2.5 rounded-md text-red-600 hover:bg-red-50 w-full text-left"
                                        >
                                            <LogOut size={18} className="mr-3" />
                                            Logout
                                        </button>
                                    </nav>
                                </div>
                            </div>

                            {userData?.resume && (
                                <div className="bg-white rounded-lg shadow-sm p-6">
                                    <h3 className="text-md font-medium text-gray-900 mb-3">Your Resume</h3>
                                    <div className="flex flex-col space-y-2">
                                        <a
                                            href={userData.resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center text-blue-600 hover:text-blue-800"
                                        >
                                            <FileText size={16} className="mr-2" />
                                            View Resume
                                        </a>
                                        <Link
                                            to="/profile/edit"
                                            className="text-sm text-gray-600 hover:text-gray-800"
                                        >
                                            Update Resume
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Main Content */}
                        <div className="lg:w-3/4">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default UserDashboard;