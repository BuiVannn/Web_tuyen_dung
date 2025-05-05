// import React, { useContext, useState, Fragment, useEffect } from "react";
// import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
// import { AppContext } from "../context/AppContext";
// import { Menu, Transition } from '@headlessui/react';
// import {
//     ChevronDown, User, LogOut, Briefcase, Bookmark, FileText,
//     Building, LayoutDashboard, Newspaper, Loader2, Info, Users, PlusCircle,
//     Calendar, MessageSquare, Search, MapPin, BadgeHelp, ShieldCheck, LifeBuoy, GraduationCap
// } from 'lucide-react';
// import ImageWithFallback from './ImageWithFallback';

// const Navbar = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const contextValues = useContext(AppContext);

//     const {
//         userData,
//         companyData,
//         userToken,
//         companyToken,
//         logoutUser,
//         logoutCompany,
//         setShowRecruiterLogin,
//         isUserDataLoading,
//         setShowUserLogin,
//         isCompanyDataLoading
//     } = contextValues;

//     const profileData = userData;

//     // Check if we're in company dashboard
//     const isInCompanyDashboard = location.pathname.startsWith('/dashboard');

//     // Toggle dropdown for auth options
//     const [showAuthDropdown, setShowAuthDropdown] = useState(false);
//     // Toggle for resource dropdown
//     const [showResourcesDropdown, setShowResourcesDropdown] = useState(false);

//     // Close resource dropdown when clicking outside
//     useEffect(() => {
//         const handleClickOutside = () => {
//             if (showResourcesDropdown) {
//                 setShowResourcesDropdown(false);
//             }
//         };
//         document.addEventListener('click', handleClickOutside);
//         return () => {
//             document.removeEventListener('click', handleClickOutside);
//         };
//     }, [showResourcesDropdown]);

//     const handleRecruiterLogin = () => {
//         setShowRecruiterLogin(true);
//         setShowAuthDropdown(false);
//     };

//     const handleUserLogin = () => {
//         setShowUserLogin(true);
//         setShowAuthDropdown(false);
//     };

//     // Active NavLink style
//     const activeClassName = "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1";
//     const inactiveClassName = "text-gray-600 hover:text-blue-600 transition-colors duration-200 pb-1 border-b-2 border-transparent";

//     return (
//         <nav className="bg-white shadow-md sticky top-0 z-50">
//             <div className="container mx-auto px-1 sm:px-2 lg:px-4">
//                 <div className="flex justify-between items-center h-16">
//                     {/* Logo - positioning closer to left */}
//                     <div className="flex-shrink-0 -ml-1">
//                         <Link to="/" className="flex items-center">
//                             <div className="flex items-center">
//                                 <svg
//                                     className="h-8 w-8 text-blue-500"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     strokeWidth="2"
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                 >
//                                     <circle cx="12" cy="12" r="10" />
//                                     <path d="M8 14s1.5 2 4 2 4-2 4-2" />
//                                     <line x1="9" y1="9" x2="9.01" y2="9" />
//                                     <line x1="15" y1="9" x2="15.01" y2="9" />
//                                 </svg>
//                                 <span className="ml-1 text-xl font-semibold text-gray-900">JobPortal - Van</span>
//                             </div>
//                         </Link>
//                     </div>

//                     {/* Navigation Links */}
//                     <div className="hidden md:flex md:items-center md:space-x-5 lg:space-x-6">
//                         {companyToken && companyData ? (
//                             // Links for Recruiter - Hide duplicate links when in dashboard
//                             <>
//                                 {!isInCompanyDashboard ? (
//                                     <>
//                                         <NavLink
//                                             to="/dashboard"
//                                             className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
//                                         >
//                                             <span className="inline-flex items-center gap-1.5">
//                                                 <LayoutDashboard size={16} /> Dashboard
//                                             </span>
//                                         </NavLink>
//                                         <NavLink
//                                             to="/dashboard/manage-jobs"
//                                             className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
//                                         >
//                                             <span className="inline-flex items-center gap-1.5">
//                                                 <Briefcase size={16} /> Manage Jobs
//                                             </span>
//                                         </NavLink>
//                                         <NavLink
//                                             to="/dashboard/view-applications"
//                                             className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
//                                         >
//                                             <span className="inline-flex items-center gap-1.5">
//                                                 <Users size={16} /> Applications
//                                             </span>
//                                         </NavLink>
//                                         <NavLink
//                                             to="/dashboard/add-job"
//                                             className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
//                                         >
//                                             <span className="inline-flex items-center gap-1.5">
//                                                 <PlusCircle size={16} /> Post Job
//                                             </span>
//                                         </NavLink>
//                                     </>
//                                 ) : (
//                                     // Minimal links when in dashboard to avoid duplication
//                                     <NavLink
//                                         to="/"
//                                         className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
//                                     >
//                                         <span className="inline-flex items-center gap-1.5">
//                                             Home
//                                         </span>
//                                     </NavLink>
//                                 )}

//                                 {/* Always show the following links */}
//                                 <NavLink
//                                     to="/blog"
//                                     className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
//                                 >
//                                     <span className="inline-flex items-center gap-1.5">
//                                         <Newspaper size={16} /> Blog
//                                     </span>
//                                 </NavLink>
//                             </>
//                         ) : userToken && profileData ? (
//                             // Links for Job Seeker
//                             <>
//                                 <NavLink to="/" end className={({ isActive }) => isActive ? activeClassName : inactiveClassName}>
//                                     <span className="inline-flex items-center gap-1.5">
//                                         Home
//                                     </span>
//                                 </NavLink>
//                                 <NavLink
//                                     to="/jobs"
//                                     className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
//                                 >
//                                     <span className="inline-flex items-center gap-1.5">
//                                         <Briefcase size={16} /> Find Jobs
//                                     </span>
//                                 </NavLink>
//                                 <NavLink
//                                     to="/companies"
//                                     className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
//                                 >
//                                     <span className="inline-flex items-center gap-1.5">
//                                         <Building size={16} /> Companies
//                                     </span>
//                                 </NavLink>
//                                 <NavLink
//                                     to="/blog"
//                                     className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
//                                 >
//                                     <span className="inline-flex items-center gap-1.5">
//                                         <Newspaper size={16} /> Blog
//                                     </span>
//                                 </NavLink>
//                                 <div className="relative" onClick={(e) => e.stopPropagation()}>
//                                     <button
//                                         onClick={() => setShowResourcesDropdown(!showResourcesDropdown)}
//                                         className={`flex items-center ${inactiveClassName}`}
//                                     >
//                                         <span className="inline-flex items-center gap-1.5">
//                                             <BadgeHelp size={16} /> Resources
//                                             <ChevronDown size={14} className={`transition-transform duration-200 ${showResourcesDropdown ? 'rotate-180' : ''}`} />
//                                         </span>
//                                     </button>
//                                     {showResourcesDropdown && (
//                                         <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
//                                             <Link to="/career-advice" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
//                                                 Career Advice
//                                             </Link>
//                                             <Link to="/resume-tips" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
//                                                 Resume Tips
//                                             </Link>
//                                             <Link to="/interview-prep" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
//                                                 Interview Prep
//                                             </Link>
//                                         </div>
//                                     )}
//                                 </div>
//                             </>
//                         ) : (
//                             // Links for guests
//                             <>
//                                 <NavLink to="/" end className={({ isActive }) => isActive ? activeClassName : inactiveClassName}>
//                                     <span className="inline-flex items-center gap-1.5">
//                                         Home
//                                     </span>
//                                 </NavLink>
//                                 <NavLink
//                                     to="/jobs"
//                                     className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
//                                 >
//                                     <span className="inline-flex items-center gap-1.5">
//                                         <Briefcase size={16} /> Find Jobs
//                                     </span>
//                                 </NavLink>
//                                 <NavLink
//                                     to="/companies"
//                                     className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
//                                 >
//                                     <span className="inline-flex items-center gap-1.5">
//                                         <Building size={16} /> Companies
//                                     </span>
//                                 </NavLink>
//                                 <NavLink
//                                     to="/blog"
//                                     className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
//                                 >
//                                     <span className="inline-flex items-center gap-1.5">
//                                         <Newspaper size={16} /> Blog
//                                     </span>
//                                 </NavLink>
//                                 <NavLink
//                                     to="/for-employers"
//                                     className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
//                                 >
//                                     <span className="inline-flex items-center gap-1.5">
//                                         <Building size={16} /> For Employers
//                                     </span>
//                                 </NavLink>
//                             </>
//                         )}
//                     </div>

//                     {/* Right Section: Login/User Menu + Search - positioned closer to right */}
//                     <div className="flex items-center space-x-2">
//                         {/* Only show search when not in dashboard */}
//                         {!isInCompanyDashboard && (
//                             <button
//                                 className="text-gray-500 hover:text-blue-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
//                                 onClick={() => navigate('/search')}
//                                 aria-label="Search"
//                             >
//                                 <Search size={20} />
//                             </button>
//                         )}

//                         {/* User authentication section */}
//                         {!userToken && !companyToken ? (
//                             // Not logged in - Show login dropdown button
//                             <div className="relative">
//                                 <button
//                                     onClick={() => setShowAuthDropdown(!showAuthDropdown)}
//                                     className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                                 >
//                                     <span>Sign In</span>
//                                     <ChevronDown size={16} className={`transition-transform duration-200 ${showAuthDropdown ? 'rotate-180' : ''}`} />
//                                 </button>

//                                 {/* Dropdown menu */}
//                                 {showAuthDropdown && (
//                                     <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5 focus:outline-none">
//                                         <div className="px-4 py-3 border-b border-gray-100">
//                                             <p className="text-sm font-medium text-gray-900">Choose account type</p>
//                                             <p className="text-xs text-gray-500 mt-1">Sign in based on your role</p>
//                                         </div>

//                                         <button
//                                             onClick={handleUserLogin}
//                                             className="w-full text-left px-4 py-3 flex items-center hover:bg-gray-50 transition-colors duration-150"
//                                         >
//                                             <div className="p-2 bg-blue-100 rounded-full mr-3">
//                                                 <User size={20} className="text-blue-600" />
//                                             </div>
//                                             <div>
//                                                 <p className="text-sm font-medium text-gray-900">Job Seeker</p>
//                                                 <p className="text-xs text-gray-500">Find and apply for jobs</p>
//                                             </div>
//                                         </button>

//                                         <button
//                                             onClick={handleRecruiterLogin}
//                                             className="w-full text-left px-4 py-3 flex items-center hover:bg-gray-50 transition-colors duration-150"
//                                         >
//                                             <div className="p-2 bg-green-100 rounded-full mr-3">
//                                                 <Building size={20} className="text-green-600" />
//                                             </div>
//                                             <div>
//                                                 <p className="text-sm font-medium text-gray-900">Recruiter</p>
//                                                 <p className="text-xs text-gray-500">Post jobs and hire candidates</p>
//                                             </div>
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         ) : isUserDataLoading || isCompanyDataLoading ? (
//                             // Loading state
//                             <div className="flex items-center space-x-2">
//                                 <Loader2 className="animate-spin h-5 w-5 text-blue-500" />
//                                 <span className="text-sm text-gray-600">Loading...</span>
//                             </div>
//                         ) : userToken && profileData ? (
//                             // User logged in - Show user menu - positioned closer to right
//                             <Menu as="div" className="relative">
//                                 <div>
//                                     <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//                                         <span className="sr-only">Open user menu</span>
//                                         <div className="relative">
//                                             <ImageWithFallback
//                                                 src={profileData?.avatar}
//                                                 alt={profileData?.userId?.name || 'User Avatar'}
//                                                 className="w-9 h-9 rounded-full object-cover border-2 border-blue-100"
//                                             />
//                                             <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-400"></span>
//                                         </div>
//                                         <span className="hidden sm:inline-block ml-2 text-gray-700 font-medium">
//                                             {profileData?.userId?.name || 'User'}
//                                         </span>
//                                         <ChevronDown size={18} className="ml-1 text-gray-500 hidden sm:inline-block" />
//                                     </Menu.Button>
//                                 </div>
//                                 <Transition
//                                     as={Fragment}
//                                     enter="transition ease-out duration-100"
//                                     enterFrom="transform opacity-0 scale-95"
//                                     enterTo="transform opacity-100 scale-100"
//                                     leave="transition ease-in duration-75"
//                                     leaveFrom="transform opacity-100 scale-100"
//                                     leaveTo="transform opacity-0 scale-95"
//                                 >
//                                     <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
//                                         {/* User info section */}
//                                         <div className="px-4 py-3">
//                                             <p className="text-sm font-medium text-gray-900 truncate">{profileData?.userId?.name || 'User Name'}</p>
//                                             <p className="text-sm text-gray-500 truncate">{profileData?.userId?.email || 'user@example.com'}</p>
//                                         </div>

//                                         {/* Main links */}
//                                         <div className="py-1">
//                                             <Menu.Item>
//                                                 {({ active }) => (
//                                                     <Link
//                                                         to="/profile"
//                                                         className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
//                                                     >
//                                                         <User size={16} className="mr-3 text-gray-500 group-hover:text-gray-700" />
//                                                         My Profile
//                                                     </Link>
//                                                 )}
//                                             </Menu.Item>
//                                             <Menu.Item>
//                                                 {({ active }) => (
//                                                     <Link
//                                                         to="/applications"
//                                                         className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
//                                                     >
//                                                         <FileText size={16} className="mr-3 text-gray-500 group-hover:text-gray-700" />
//                                                         My Applications
//                                                     </Link>
//                                                 )}
//                                             </Menu.Item>
//                                             <Menu.Item>
//                                                 {({ active }) => (
//                                                     <Link
//                                                         to="/saved-jobs"
//                                                         className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
//                                                     >
//                                                         <Bookmark size={16} className="mr-3 text-gray-500 group-hover:text-gray-700" />
//                                                         Saved Jobs
//                                                     </Link>
//                                                 )}
//                                             </Menu.Item>
//                                         </div>

//                                         {/* Logout */}
//                                         <div className="py-1">
//                                             <Menu.Item>
//                                                 {({ active }) => (
//                                                     <button
//                                                         onClick={logoutUser}
//                                                         className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-red-600 hover:text-red-700`}
//                                                     >
//                                                         <LogOut size={16} className="mr-3" />
//                                                         Logout
//                                                     </button>
//                                                 )}
//                                             </Menu.Item>
//                                         </div>
//                                     </Menu.Items>
//                                 </Transition>
//                             </Menu>
//                         ) : companyToken && companyData ? (
//                             // Company logged in - Show company menu
//                             <Menu as="div" className="relative">
//                                 <div>
//                                     <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//                                         <span className="sr-only">Open company menu</span>
//                                         <div className="relative">
//                                             <ImageWithFallback
//                                                 src={companyData?.image}
//                                                 alt={companyData?.name || 'Company Logo'}
//                                                 className="w-9 h-9 rounded-full object-cover bg-gray-200 border-2 border-green-100"
//                                             />
//                                             <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-400"></span>
//                                         </div>
//                                         <span className="hidden sm:inline-block ml-2 text-gray-700 font-medium truncate max-w-[140px]">
//                                             {companyData?.name || 'Company'}
//                                         </span>
//                                         <ChevronDown size={18} className="ml-1 text-gray-500 hidden sm:inline-block" />
//                                     </Menu.Button>
//                                 </div>
//                                 <Transition
//                                     as={Fragment}
//                                     enter="transition ease-out duration-100"
//                                     enterFrom="transform opacity-0 scale-95"
//                                     enterTo="transform opacity-100 scale-100"
//                                     leave="transition ease-in duration-75"
//                                     leaveFrom="transform opacity-100 scale-100"
//                                     leaveTo="transform opacity-0 scale-95"
//                                 >
//                                     <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
//                                         {/* Company info */}
//                                         <div className="px-4 py-3">
//                                             <p className="text-sm font-medium text-gray-900 truncate">{companyData?.name || 'Company Name'}</p>
//                                             <p className="text-sm text-gray-500 truncate">{companyData?.email || 'company@example.com'}</p>
//                                         </div>

//                                         {/* Main dashboard links */}
//                                         <div className="py-1">
//                                             <Menu.Item>
//                                                 {({ active }) => (
//                                                     <Link
//                                                         to="/dashboard"
//                                                         className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
//                                                     >
//                                                         <LayoutDashboard size={16} className="mr-3 text-gray-500 group-hover:text-gray-700" />
//                                                         Dashboard
//                                                     </Link>
//                                                 )}
//                                             </Menu.Item>
//                                             <Menu.Item>
//                                                 {({ active }) => (
//                                                     <Link
//                                                         to="/dashboard/profile"
//                                                         className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
//                                                     >
//                                                         <Building size={16} className="mr-3 text-gray-500 group-hover:text-gray-700" />
//                                                         Company Profile
//                                                     </Link>
//                                                 )}
//                                             </Menu.Item>
//                                             <Menu.Item>
//                                                 {({ active }) => (
//                                                     <Link
//                                                         to="/dashboard/manage-jobs"
//                                                         className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
//                                                     >
//                                                         <Briefcase size={16} className="mr-3 text-gray-500 group-hover:text-gray-700" />
//                                                         Manage Jobs
//                                                     </Link>
//                                                 )}
//                                             </Menu.Item>
//                                         </div>

//                                         {/* Logout */}
//                                         <div className="py-1">
//                                             <Menu.Item>
//                                                 {({ active }) => (
//                                                     <button
//                                                         onClick={logoutCompany}
//                                                         className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-red-600 hover:text-red-700`}
//                                                     >
//                                                         <LogOut size={16} className="mr-3" />
//                                                         Logout
//                                                     </button>
//                                                 )}
//                                             </Menu.Item>
//                                         </div>
//                                     </Menu.Items>
//                                 </Transition>
//                             </Menu>
//                         ) : (
//                             // Fallback for token exists but no data (error state)
//                             <div className="flex items-center space-x-3">
//                                 {userToken && (
//                                     <button
//                                         onClick={logoutUser}
//                                         className="text-sm text-red-500 hover:text-red-700"
//                                     >
//                                         Error loading data. Logout?
//                                     </button>
//                                 )}
//                                 {companyToken && (
//                                     <button
//                                         onClick={logoutCompany}
//                                         className="text-sm text-red-500 hover:text-red-700"
//                                     >
//                                         Error loading data. Logout?
//                                     </button>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Mobile menu - simplified for reduced duplication */}
//             <div className="md:hidden bg-white border-t border-gray-200">
//                 {userToken && profileData ? (
//                     <div className="px-2 pt-2 pb-3 space-y-1">
//                         <NavLink
//                             to="/"
//                             end
//                             className={({ isActive }) =>
//                                 `block px-3 py-2 rounded-md text-base font-medium ${isActive
//                                     ? 'bg-blue-50 text-blue-600'
//                                     : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
//                             }
//                         >
//                             <span className="flex items-center">
//                                 Home
//                             </span>
//                         </NavLink>
//                         <NavLink
//                             to="/jobs"
//                             className={({ isActive }) =>
//                                 `block px-3 py-2 rounded-md text-base font-medium ${isActive
//                                     ? 'bg-blue-50 text-blue-600'
//                                     : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
//                             }
//                         >
//                             <span className="flex items-center">
//                                 <Briefcase size={18} className="mr-2" /> Find Jobs
//                             </span>
//                         </NavLink>
//                         <NavLink
//                             to="/applications"
//                             className={({ isActive }) =>
//                                 `block px-3 py-2 rounded-md text-base font-medium ${isActive
//                                     ? 'bg-blue-50 text-blue-600'
//                                     : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
//                             }
//                         >
//                             <span className="flex items-center">
//                                 <FileText size={18} className="mr-2" /> Applications
//                             </span>
//                         </NavLink>
//                         <NavLink
//                             to="/saved-jobs"
//                             className={({ isActive }) =>
//                                 `block px-3 py-2 rounded-md text-base font-medium ${isActive
//                                     ? 'bg-blue-50 text-blue-600'
//                                     : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
//                             }
//                         >
//                             <span className="flex items-center">
//                                 <Bookmark size={18} className="mr-2" /> Saved Jobs
//                             </span>
//                         </NavLink>
//                     </div>
//                 ) : companyToken && companyData ? (
//                     <div className="px-2 pt-2 pb-3 space-y-1">
//                         {!isInCompanyDashboard ? (
//                             // When outside dashboard
//                             <>
//                                 <NavLink
//                                     to="/dashboard"
//                                     className={({ isActive }) =>
//                                         `block px-3 py-2 rounded-md text-base font-medium ${isActive
//                                             ? 'bg-blue-50 text-blue-600'
//                                             : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
//                                     }
//                                 >
//                                     <span className="flex items-center">
//                                         <LayoutDashboard size={18} className="mr-2" /> Dashboard
//                                     </span>
//                                 </NavLink>
//                                 <NavLink
//                                     to="/dashboard/manage-jobs"
//                                     className={({ isActive }) =>
//                                         `block px-3 py-2 rounded-md text-base font-medium ${isActive
//                                             ? 'bg-blue-50 text-blue-600'
//                                             : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
//                                     }
//                                 >
//                                     <span className="flex items-center">
//                                         <Briefcase size={18} className="mr-2" /> Manage Jobs
//                                     </span>
//                                 </NavLink>
//                                 <NavLink
//                                     to="/dashboard/view-applications"
//                                     className={({ isActive }) =>
//                                         `block px-3 py-2 rounded-md text-base font-medium ${isActive
//                                             ? 'bg-blue-50 text-blue-600'
//                                             : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
//                                     }
//                                 >
//                                     <span className="flex items-center">
//                                         <Users size={18} className="mr-2" /> Applications
//                                     </span>
//                                 </NavLink>
//                             </>
//                         ) : (
//                             // Just show Home when inside dashboard
//                             <NavLink
//                                 to="/"
//                                 className={({ isActive }) =>
//                                     `block px-3 py-2 rounded-md text-base font-medium ${isActive
//                                         ? 'bg-blue-50 text-blue-600'
//                                         : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
//                                 }
//                             >
//                                 <span className="flex items-center">
//                                     Home
//                                 </span>
//                             </NavLink>
//                         )}
//                         <NavLink
//                             to="/blog"
//                             className={({ isActive }) =>
//                                 `block px-3 py-2 rounded-md text-base font-medium ${isActive
//                                     ? 'bg-blue-50 text-blue-600'
//                                     : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
//                             }
//                         >
//                             <span className="flex items-center">
//                                 <Newspaper size={18} className="mr-2" /> Blog
//                             </span>
//                         </NavLink>
//                     </div>
//                 ) : (
//                     // Guest mobile menu
//                     <div className="px-2 pt-2 pb-3 space-y-1">
//                         <NavLink
//                             to="/"
//                             end
//                             className={({ isActive }) =>
//                                 `block px-3 py-2 rounded-md text-base font-medium ${isActive
//                                     ? 'bg-blue-50 text-blue-600'
//                                     : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
//                             }
//                         >
//                             <span className="flex items-center">
//                                 Home
//                             </span>
//                         </NavLink>
//                         <NavLink
//                             to="/jobs"
//                             className={({ isActive }) =>
//                                 `block px-3 py-2 rounded-md text-base font-medium ${isActive
//                                     ? 'bg-blue-50 text-blue-600'
//                                     : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
//                             }
//                         >
//                             <span className="flex items-center">
//                                 <Briefcase size={18} className="mr-2" /> Find Jobs
//                             </span>
//                         </NavLink>
//                         <NavLink
//                             to="/companies"
//                             className={({ isActive }) =>
//                                 `block px-3 py-2 rounded-md text-base font-medium ${isActive
//                                     ? 'bg-blue-50 text-blue-600'
//                                     : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
//                             }
//                         >
//                             <span className="flex items-center">
//                                 <Building size={18} className="mr-2" /> Companies
//                             </span>
//                         </NavLink>
//                         <NavLink
//                             to="/blog"
//                             className={({ isActive }) =>
//                                 `block px-3 py-2 rounded-md text-base font-medium ${isActive
//                                     ? 'bg-blue-50 text-blue-600'
//                                     : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
//                             }
//                         >
//                             <span className="flex items-center">
//                                 <Newspaper size={18} className="mr-2" /> Blog
//                             </span>
//                         </NavLink>
//                     </div>
//                 )}
//             </div>
//         </nav>
//     );
// };

// export default Navbar;

import React, { useContext, useState, Fragment } from "react";
import { assets } from '../assets/assets';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Menu, Transition } from '@headlessui/react';
import {
    ChevronDown, User, LogOut, Briefcase, Bookmark, FileText,
    Building, LayoutDashboard, Newspaper, Loader2, Info, Users, PlusCircle,
    Calendar, MessageSquare, Search, MapPin, BadgeHelp, ShieldCheck, LifeBuoy, GraduationCap
} from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';

const Navbar = () => {
    const navigate = useNavigate();
    const contextValues = useContext(AppContext);

    const {
        userData,
        companyData,
        userToken,
        companyToken,
        logoutUser,
        logoutCompany,
        setShowRecruiterLogin,
        isUserDataLoading,
        setShowUserLogin,
        isCompanyDataLoading
    } = contextValues;

    const profileData = userData;

    // Toggle dropdown for auth options
    const [showAuthDropdown, setShowAuthDropdown] = useState(false);
    // Toggle for resource dropdown
    const [showResourcesDropdown, setShowResourcesDropdown] = useState(false);

    const handleRecruiterLogin = () => {
        setShowRecruiterLogin(true);
        setShowAuthDropdown(false);
    };

    const handleUserLogin = () => {
        //navigate('/login');
        setShowUserLogin(true);
        setShowAuthDropdown(false);
    };

    // Active NavLink style
    const activeClassName = "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1";
    const inactiveClassName = "text-gray-600 hover:text-blue-600 transition-colors duration-200 pb-1 border-b-2 border-transparent";

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            {/* <div className="container mx-auto px-4 sm:px-6 lg:px-8"> */}
            <div className="container mx-auto px-1 sm:px-2 lg:px-3">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 -ml-2">
                        <Link to="/" className="flex items-center">
                            <div className="flex items-center">
                                <svg
                                    className="h-8 w-8 text-blue-500"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                    <line x1="9" y1="9" x2="9.01" y2="9" />
                                    <line x1="15" y1="9" x2="15.01" y2="9" />
                                </svg>
                                <span className="ml-1 text-xl font-semibold text-gray-900">JobPortal - Van</span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex md:items-center md:space-x-6 lg:space-x-8">
                        {companyToken && companyData ? (
                            // Links for Recruiter
                            <>
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        <LayoutDashboard size={16} /> Dashboard
                                    </span>
                                </NavLink>
                                <NavLink
                                    to="/dashboard/manage-jobs"
                                    className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        <Briefcase size={16} /> Manage Jobs
                                    </span>
                                </NavLink>
                                <NavLink
                                    to="/dashboard/view-applications"
                                    className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        <Users size={16} /> Applications
                                    </span>
                                </NavLink>
                                <NavLink
                                    to="/dashboard/interviews"
                                    className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        <Calendar size={16} /> Interviews
                                    </span>
                                </NavLink>
                                <NavLink
                                    to="/dashboard/add-job"
                                    className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        <PlusCircle size={16} /> Post Job
                                    </span>
                                </NavLink>
                                <NavLink
                                    to="/blog"
                                    className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        <Newspaper size={16} /> Blog
                                    </span>
                                </NavLink>
                                {/* Resources dropdown for recruiters */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowResourcesDropdown(!showResourcesDropdown)}
                                        className={`flex items-center ${inactiveClassName}`}
                                    >
                                        <span className="inline-flex items-center gap-1.5">
                                            <BadgeHelp size={16} /> Resources
                                            <ChevronDown size={14} className={`transition-transform duration-200 ${showResourcesDropdown ? 'rotate-180' : ''}`} />
                                        </span>
                                    </button>
                                    {showResourcesDropdown && (
                                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                                            <Link to="/hiring-guides" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                Hiring Guides
                                            </Link>
                                            <Link to="/salary-data" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                Salary Data
                                            </Link>
                                            <Link to="/recruitment-tips" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                Recruitment Tips
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : userToken && profileData ? (
                            // Links for Job Seeker
                            <>
                                <NavLink to="/" end className={({ isActive }) => isActive ? activeClassName : inactiveClassName}>
                                    <span className="inline-flex items-center gap-1.5">
                                        Home
                                    </span>
                                </NavLink>
                                <NavLink
                                    to="/jobs"
                                    className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        <Briefcase size={16} /> Find Jobs
                                    </span>
                                </NavLink>
                                <NavLink
                                    to="/companies"
                                    className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        <Building size={16} /> Companies
                                    </span>
                                </NavLink>
                                <NavLink
                                    to="/blog"
                                    className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        <Newspaper size={16} /> Blog
                                    </span>
                                </NavLink>
                                {/* Resources dropdown for job seekers */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowResourcesDropdown(!showResourcesDropdown)}
                                        className={`flex items-center ${inactiveClassName}`}
                                    >
                                        <span className="inline-flex items-center gap-1.5">
                                            <BadgeHelp size={16} /> Resources
                                            <ChevronDown size={14} className={`transition-transform duration-200 ${showResourcesDropdown ? 'rotate-180' : ''}`} />
                                        </span>
                                    </button>
                                    {showResourcesDropdown && (
                                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                                            <Link to="/career-advice" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                Career Advice
                                            </Link>
                                            <Link to="/resume-tips" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                Resume Tips
                                            </Link>
                                            <Link to="/interview-prep" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                Interview Prep
                                            </Link>
                                            <Link to="/salary-guide" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                Salary Guide
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            // Links for guests
                            <>
                                <NavLink to="/" end className={({ isActive }) => isActive ? activeClassName : inactiveClassName}>
                                    <span className="inline-flex items-center gap-1.5">
                                        Home
                                    </span>
                                </NavLink>
                                <NavLink
                                    to="/jobs"
                                    className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        <Briefcase size={16} /> Find Jobs
                                    </span>
                                </NavLink>
                                <NavLink
                                    to="/companies"
                                    className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        <Building size={16} /> Companies
                                    </span>
                                </NavLink>
                                <NavLink
                                    to="/blog"
                                    className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        <Newspaper size={16} /> Blog
                                    </span>
                                </NavLink>
                                <a
                                    href="#how-it-works"
                                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 pb-1 border-b-2 border-transparent"
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        <Info size={16} /> How It Works
                                    </span>
                                </a>
                                <NavLink
                                    to="/for-employers"
                                    className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        <Building size={16} /> For Employers
                                    </span>
                                </NavLink>
                            </>
                        )}
                    </div>

                    {/* Right Section: Login/User Menu + Search */}
                    <div className="flex items-center space-x-1">
                        {/* Search button for all users */}
                        <button
                            className="text-gray-500 hover:text-blue-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                            onClick={() => navigate('/search')}
                            aria-label="Search"
                        >
                            <Search size={20} />
                        </button>

                        {/* User authentication section */}
                        {!userToken && !companyToken ? (
                            // Not logged in - Show login dropdown button
                            <div className="relative">
                                <button
                                    onClick={() => setShowAuthDropdown(!showAuthDropdown)}
                                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    <span>Sign In</span>
                                    <ChevronDown size={16} className={`transition-transform duration-200 ${showAuthDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown menu */}
                                {showAuthDropdown && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">Choose account type</p>
                                            <p className="text-xs text-gray-500 mt-1">Sign in based on your role</p>
                                        </div>

                                        <button
                                            onClick={handleUserLogin}
                                            className="w-full text-left px-4 py-3 flex items-center hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            <div className="p-2 bg-blue-100 rounded-full mr-3">
                                                <User size={20} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Job Seeker</p>
                                                <p className="text-xs text-gray-500">Find and apply for jobs</p>
                                            </div>
                                        </button>

                                        <button
                                            onClick={handleRecruiterLogin}
                                            className="w-full text-left px-4 py-3 flex items-center hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            <div className="p-2 bg-green-100 rounded-full mr-3">
                                                <Building size={20} className="text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">Recruiter</p>
                                                <p className="text-xs text-gray-500">Post jobs and hire candidates</p>
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : isUserDataLoading || isCompanyDataLoading ? (
                            // Loading state
                            <div className="flex items-center space-x-2">
                                <Loader2 className="animate-spin h-5 w-5 text-blue-500" />
                                <span className="text-sm text-gray-600">Loading...</span>
                            </div>
                        ) : userToken && profileData ? (
                            // User logged in - Show user menu
                            <Menu as="div" className="relative -mr-2">
                                <div>
                                    <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        <span className="sr-only">Open user menu</span>
                                        <div className="relative">
                                            <ImageWithFallback
                                                src={profileData?.avatar}
                                                alt={profileData?.userId?.name || 'User Avatar'}
                                                className="w-9 h-9 rounded-full object-cover border-2 border-blue-100"
                                            />
                                            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-400"></span>
                                        </div>
                                        <span className="hidden sm:inline-block ml-2 text-gray-700 font-medium">
                                            {profileData?.userId?.name || 'User'}
                                        </span>
                                        <ChevronDown size={18} className="ml-1 text-gray-500 hidden sm:inline-block" />
                                    </Menu.Button>
                                </div>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
                                        {/* User info section */}
                                        <div className="px-4 py-3">
                                            <p className="text-sm font-medium text-gray-900 truncate">{profileData?.userId?.name || 'User Name'}</p>
                                            <p className="text-sm text-gray-500 truncate">{profileData?.userId?.email || 'user@example.com'}</p>
                                        </div>

                                        {/* Dashboard & Profile links */}
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to="/user-dashboard"
                                                        className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        <LayoutDashboard size={16} className="mr-3 text-gray-500 group-hover:text-gray-700" />
                                                        Dashboard
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to="/profile"
                                                        className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        <User size={16} className="mr-3 text-gray-500 group-hover:text-gray-700" />
                                                        My Profile
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        </div>

                                        {/* Job-related links */}
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to="/applications"
                                                        className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        <FileText size={16} className="mr-3 text-gray-500 group-hover:text-gray-700" />
                                                        My Applications
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to="/interviews"
                                                        className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        <Calendar size={16} className="mr-3 text-gray-500 group-hover:text-gray-700" />
                                                        My Interviews
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to="/saved-jobs"
                                                        className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        <Bookmark size={16} className="mr-3 text-gray-500 group-hover:text-gray-700" />
                                                        Saved Jobs
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        </div>

                                        {/* Additional resources & logout */}
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to="/blog"
                                                        className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        <Newspaper size={16} className="mr-3 text-gray-500 group-hover:text-gray-700" />
                                                        Blog
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to="/help-center"
                                                        className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        <LifeBuoy size={16} className="mr-3 text-gray-500 group-hover:text-gray-700" />
                                                        Help Center
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={logoutUser}
                                                        className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-red-600 hover:text-red-700`}
                                                    >
                                                        <LogOut size={16} className="mr-3" />
                                                        Logout
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        ) : companyToken && companyData ? (
                            // Company logged in - Show company menu
                            <Menu as="div" className="relative -mr-2">
                                <div>
                                    <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        <span className="sr-only">Open company menu</span>
                                        <div className="relative">
                                            <ImageWithFallback
                                                src={companyData?.image}
                                                alt={companyData?.name || 'Company Logo'}
                                                className="w-9 h-9 rounded-full object-cover bg-gray-200 border-2 border-green-100"
                                            />
                                            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-400"></span>
                                        </div>
                                        <span className="hidden sm:inline-block ml-2 text-gray-700 font-medium">
                                            {companyData?.name || 'Company'}
                                        </span>
                                        <ChevronDown size={18} className="ml-1 text-gray-500 hidden sm:inline-block" />
                                    </Menu.Button>
                                </div>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
                                        {/* Company info */}
                                        <div className="px-4 py-3">
                                            <p className="text-sm font-medium text-gray-900 truncate">{companyData?.name || 'Company Name'}</p>
                                            <p className="text-sm text-gray-500 truncate">{companyData?.email || 'company@example.com'}</p>
                                        </div>

                                        {/* Dashboard & Profile */}
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to="/dashboard"
                                                        className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        <LayoutDashboard size={16} className="mr-3 text-gray-500 group-hover:text-gray-700" />
                                                        Dashboard
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to="/dashboard/profile"
                                                        className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        <Building size={16} className="mr-3 text-gray-500 group-hover:text-gray-700" />
                                                        Company Profile
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        </div>

                                        {/* Job management */}
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to="/dashboard/manage-jobs"
                                                        className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        <Briefcase size={16} className="mr-3 text-gray-500 group-hover:text-gray-700" />
                                                        Manage Jobs
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to="/dashboard/add-job"
                                                        className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        <PlusCircle size={16} className="mr-3 text-gray-500 group-hover:text-gray-700" />
                                                        Post New Job
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to="/dashboard/view-applications"
                                                        className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        <FileText size={16} className="mr-3 text-gray-500 group-hover:text-gray-700" />
                                                        Applications
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to="/dashboard/interviews"
                                                        className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        <Calendar size={16} className="mr-3 text-gray-500 group-hover:text-gray-700" />
                                                        Interviews
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        </div>

                                        {/* Additional options & logout */}
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to="/blog"
                                                        className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        <Newspaper size={16} className="mr-3 text-gray-500 group-hover:text-gray-700" />
                                                        Blog
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to="/support"
                                                        className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        <LifeBuoy size={16} className="mr-3 text-gray-500 group-hover:text-gray-700" />
                                                        Support
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={logoutCompany}
                                                        className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-red-600 hover:text-red-700`}
                                                    >
                                                        <LogOut size={16} className="mr-3" />
                                                        Logout
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        ) : (
                            // Fallback for token exists but no data (error state)
                            <div className="flex items-center space-x-3">
                                {userToken && (
                                    <button
                                        onClick={logoutUser}
                                        className="text-sm text-red-500 hover:text-red-700"
                                    >
                                        Error loading data. Logout?
                                    </button>
                                )}
                                {companyToken && (
                                    <button
                                        onClick={logoutCompany}
                                        className="text-sm text-red-500 hover:text-red-700"
                                    >
                                        Error loading data. Logout?
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className="md:hidden bg-white border-t border-gray-200">
                {userToken && profileData ? (
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <NavLink
                            to="/user-dashboard"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
                            }
                        >
                            <span className="flex items-center">
                                <LayoutDashboard size={18} className="mr-2" /> Dashboard
                            </span>
                        </NavLink>
                        <NavLink
                            to="/jobs"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
                            }
                        >
                            <span className="flex items-center">
                                <Briefcase size={18} className="mr-2" /> Find Jobs
                            </span>
                        </NavLink>
                        <NavLink
                            to="/companies"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
                            }
                        >
                            <span className="flex items-center">
                                <Building size={18} className="mr-2" /> Companies
                            </span>
                        </NavLink>
                        <NavLink
                            to="/blog"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
                            }
                        >
                            <span className="flex items-center">
                                <Newspaper size={18} className="mr-2" /> Blog
                            </span>
                        </NavLink>
                        <NavLink
                            to="/applications"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
                            }
                        >
                            <span className="flex items-center">
                                <FileText size={18} className="mr-2" /> Applications
                            </span>
                        </NavLink>
                        <NavLink
                            to="/interviews"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
                            }
                        >
                            <span className="flex items-center">
                                <Calendar size={18} className="mr-2" /> Interviews
                            </span>
                        </NavLink>
                        <NavLink
                            to="/saved-jobs"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
                            }
                        >
                            <span className="flex items-center">
                                <Bookmark size={18} className="mr-2" /> Saved Jobs
                            </span>
                        </NavLink>
                        <NavLink
                            to="/career-resources"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
                            }
                        >
                            <span className="flex items-center">
                                <GraduationCap size={18} className="mr-2" /> Career Resources
                            </span>
                        </NavLink>
                    </div>
                ) : companyToken && companyData ? (
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
                            }
                        >
                            <span className="flex items-center">
                                <LayoutDashboard size={18} className="mr-2" /> Dashboard
                            </span>
                        </NavLink>
                        <NavLink
                            to="/dashboard/manage-jobs"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
                            }
                        >
                            <span className="flex items-center">
                                <Briefcase size={18} className="mr-2" /> Manage Jobs
                            </span>
                        </NavLink>
                        <NavLink
                            to="/dashboard/view-applications"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
                            }
                        >
                            <span className="flex items-center">
                                <Users size={18} className="mr-2" /> Applications
                            </span>
                        </NavLink>
                        <NavLink
                            to="/dashboard/interviews"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
                            }
                        >
                            <span className="flex items-center">
                                <Calendar size={18} className="mr-2" /> Interviews
                            </span>
                        </NavLink>
                        <NavLink
                            to="/dashboard/add-job"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
                            }
                        >
                            <span className="flex items-center">
                                <PlusCircle size={18} className="mr-2" /> Post Job
                            </span>
                        </NavLink>
                        <NavLink
                            to="/blog"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
                            }
                        >
                            <span className="flex items-center">
                                <Newspaper size={18} className="mr-2" /> Blog
                            </span>
                        </NavLink>
                        <NavLink
                            to="/recruitment-resources"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
                            }
                        >
                            <span className="flex items-center">
                                <BadgeHelp size={18} className="mr-2" /> Resources
                            </span>
                        </NavLink>
                    </div>
                ) : (
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
                            }
                        >
                            <span className="flex items-center">
                                Home
                            </span>
                        </NavLink>
                        <NavLink
                            to="/jobs"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
                            }
                        >
                            <span className="flex items-center">
                                <Briefcase size={18} className="mr-2" /> Find Jobs
                            </span>
                        </NavLink>
                        <NavLink
                            to="/companies"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
                            }
                        >
                            <span className="flex items-center">
                                <Building size={18} className="mr-2" /> Companies
                            </span>
                        </NavLink>
                        <NavLink
                            to="/blog"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
                            }
                        >
                            <span className="flex items-center">
                                <Newspaper size={18} className="mr-2" /> Blog
                            </span>
                        </NavLink>
                        <NavLink
                            to="/for-employers"
                            className={({ isActive }) =>
                                `block px-3 py-2 rounded-md text-base font-medium ${isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'}`
                            }
                        >
                            <span className="flex items-center">
                                <Building size={18} className="mr-2" /> For Employers
                            </span>
                        </NavLink>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

