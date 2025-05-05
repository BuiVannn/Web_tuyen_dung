import React, { useContext, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";
import { Building, Briefcase, PlusCircle, Users, Calendar } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const { companyData, setCompanyData, setCompanyToken, companyToken } = useContext(AppContext);

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
        <div className="min-h-screen bg-gray-50">
            {/* Navbar chung */}
            <Navbar />

            {/* Main Layout */}
            <div className="flex min-h-[calc(100vh-64px)]">
                {/* Sidebar cố định - desktop */}
                <div className="hidden md:block w-56 bg-white shadow-sm border-r border-gray-200 fixed top-16 bottom-0 left-0 overflow-y-auto">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="text-lg font-medium text-gray-800">Dashboard</h2>
                        <p className="text-sm text-gray-500 mt-1 truncate" title={companyData.name}>{companyData.name}</p>
                    </div>

                    <nav className="p-2">
                        <NavLink
                            to="/dashboard/profile"
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2.5 mb-1 rounded-md ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`
                            }
                        >
                            <Building size={18} className="mr-3" />
                            Company Profile
                        </NavLink>
                        <NavLink
                            to="/dashboard/manage-jobs"
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2.5 mb-1 rounded-md ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`
                            }
                        >
                            <Briefcase size={18} className="mr-3" />
                            Manage Jobs
                        </NavLink>
                        <NavLink
                            to="/dashboard/add-job"
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2.5 mb-1 rounded-md ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`
                            }
                        >
                            <PlusCircle size={18} className="mr-3" />
                            Add New Job
                        </NavLink>
                        <NavLink
                            to="/dashboard/view-applications"
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2.5 mb-1 rounded-md ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`
                            }
                        >
                            <Users size={18} className="mr-3" />
                            View Applications
                        </NavLink>
                        <NavLink
                            to="/dashboard/interviews"
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2.5 mb-1 rounded-md ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`
                            }
                        >
                            <Calendar size={18} className="mr-3" />
                            Interviews
                        </NavLink>
                    </nav>
                </div>

                {/* Main Content with padding to account for fixed sidebar */}
                <div className="w-full md:pl-56 pt-2">
                    {/* Mobile Navigation */}
                    <div className="md:hidden bg-white rounded-lg shadow-sm mb-3 mx-2 overflow-x-auto">
                        <div className="flex p-2 space-x-2">
                            <NavLink
                                to="/dashboard/profile"
                                className={({ isActive }) =>
                                    `flex flex-col items-center px-3 py-2 rounded-md ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`
                                }
                            >
                                <Building size={20} />
                                <span className="text-xs mt-1">Profile</span>
                            </NavLink>
                            <NavLink
                                to="/dashboard/manage-jobs"
                                className={({ isActive }) =>
                                    `flex flex-col items-center px-3 py-2 rounded-md ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`
                                }
                            >
                                <Briefcase size={20} />
                                <span className="text-xs mt-1">Jobs</span>
                            </NavLink>
                            <NavLink
                                to="/dashboard/add-job"
                                className={({ isActive }) =>
                                    `flex flex-col items-center px-3 py-2 rounded-md ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`
                                }
                            >
                                <PlusCircle size={20} />
                                <span className="text-xs mt-1">Add Job</span>
                            </NavLink>
                            <NavLink
                                to="/dashboard/view-applications"
                                className={({ isActive }) =>
                                    `flex flex-col items-center px-3 py-2 rounded-md ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`
                                }
                            >
                                <Users size={20} />
                                <span className="text-xs mt-1">Applications</span>
                            </NavLink>
                            <NavLink
                                to="/dashboard/interviews"
                                className={({ isActive }) =>
                                    `flex flex-col items-center px-3 py-2 rounded-md ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`
                                }
                            >
                                <Calendar size={20} />
                                <span className="text-xs mt-1">Interviews</span>
                            </NavLink>
                        </div>
                    </div>

                    {/* Content Container */}
                    <div className="px-2 pb-4 max-w-[1400px] mx-auto">
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

// import React, { useContext, useState } from "react";
// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import { assets } from "../assets/assets";
// import { AppContext } from "../context/AppContext";

// const Dashboard = () => {
//     const navigate = useNavigate();
//     const { companyData, setCompanyData, setCompanyToken, companyToken } = useContext(AppContext);

//     // Logout function
//     const logout = () => {
//         setCompanyToken(null);
//         setCompanyData(null);
//         localStorage.removeItem('companyToken');
//         navigate('/');
//     };

//     // Redirect to login if not authenticated
//     if (!companyToken) {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center">
//                 <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
//                 <p className="text-gray-600 mb-4">Please login as a recruiter to access the dashboard</p>
//                 <button
//                     onClick={() => navigate('/', { state: { showRecruiterLogin: true } })}
//                     className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                 >
//                     Login as Recruiter
//                 </button>
//             </div>
//         );
//     }

//     // Show loading spinner while company data is being fetched
//     if (!companyData) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen">
//             {/* Header */}
//             <div className="shadow py-4">
//                 <div className="px-5 flex justify-between items-center">
//                     <img
//                         onClick={() => navigate('/')}
//                         className="max-sm:w-32 cursor-pointer"
//                         src={assets.logo}
//                         alt=""
//                     />
//                     <div className="flex items-center gap-3">
//                         {/* Removed notification bell */}

//                         <p className="max-sm:hidden">Welcome, {companyData.name}</p>
//                         <button onClick={logout} className="text-sm text-red-600">
//                             Logout
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Dashboard Content */}
//             <div className="flex">
//                 {/* Sidebar */}
//                 <div className="w-64 min-h-screen bg-gray-50 border-r">
//                     <nav className="py-4">
//                         <NavLink
//                             to="/dashboard/profile"
//                             className={({ isActive }) =>
//                                 `flex items-center px-4 py-2 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`
//                             }
//                         >
//                             Company Profile
//                         </NavLink>
//                         <NavLink
//                             to="/dashboard/manage-jobs"
//                             className={({ isActive }) =>
//                                 `flex items-center px-4 py-2 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`
//                             }
//                         >
//                             Manage Jobs
//                         </NavLink>
//                         <NavLink
//                             to="/dashboard/add-job"
//                             className={({ isActive }) =>
//                                 `flex items-center px-4 py-2 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`
//                             }
//                         >
//                             Add New Job
//                         </NavLink>
//                         <NavLink
//                             to="/dashboard/view-applications"
//                             className={({ isActive }) =>
//                                 `flex items-center px-4 py-2 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`
//                             }
//                         >
//                             View Applications
//                         </NavLink>
//                         <NavLink
//                             to="/dashboard/interviews"
//                             className={({ isActive }) =>
//                                 `flex items-center px-4 py-2 ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`
//                             }
//                         >
//                             Interviews
//                         </NavLink>
//                     </nav>
//                 </div>

//                 {/* Main Content */}
//                 <div className="flex-1 p-8">
//                     <Outlet />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;