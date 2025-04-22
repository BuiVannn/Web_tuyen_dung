import React, { useContext, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Dashboard = () => {
    const navigate = useNavigate();
    const { companyData, setCompanyData, setCompanyToken, companyToken } = useContext(AppContext);

    // Logout function
    const logout = () => {
        setCompanyToken(null);
        setCompanyData(null);
        localStorage.removeItem('companyToken');
        navigate('/');
    };

    // Redirect to login if not authenticated
    if (!companyToken) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
                <p className="text-gray-600 mb-4">Please login as a recruiter to access the dashboard</p>
                <button
                    onClick={() => navigate('/', { state: { showRecruiterLogin: true } })}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Login as Recruiter
                </button>
            </div>
        );
    }

    // Show loading spinner while company data is being fetched
    if (!companyData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="shadow py-4">
                <div className="px-5 flex justify-between items-center">
                    <img
                        onClick={() => navigate('/')}
                        className="max-sm:w-32 cursor-pointer"
                        src={assets.logo}
                        alt=""
                    />
                    <div className="flex items-center gap-3">
                        {/* Removed notification bell */}

                        <p className="max-sm:hidden">Welcome, {companyData.name}</p>
                        <button onClick={logout} className="text-sm text-red-600">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 min-h-screen bg-gray-50 border-r">
                    <nav className="py-4">
                        <NavLink
                            to="/dashboard/profile"
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`
                            }
                        >
                            Company Profile
                        </NavLink>
                        <NavLink
                            to="/dashboard/manage-jobs"
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`
                            }
                        >
                            Manage Jobs
                        </NavLink>
                        <NavLink
                            to="/dashboard/add-job"
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`
                            }
                        >
                            Add New Job
                        </NavLink>
                        <NavLink
                            to="/dashboard/view-applications"
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`
                            }
                        >
                            View Applications
                        </NavLink>
                        <NavLink
                            to="/dashboard/interviews"
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`
                            }
                        >
                            Interviews
                        </NavLink>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;