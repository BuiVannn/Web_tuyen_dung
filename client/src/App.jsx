import React, { useContext } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Applications from './pages/Applications'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/AppContext'
import Dashboard from './pages/Dashboard'
import AddJob from './pages/AddJob'
import ManageJobs from './pages/ManageJobs'
import ViewApplications from './pages/ViewApplications'

import SavedJobs from "./pages/SavedJobs";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from './pages/EditProfilePage'
import ApplicationManagement from './pages/admin/ApplicationManagement';

import AdminLoginPage from './pages/AdminLoginPage'
import 'quill/dist/quill.snow.css'

import { ToastContainer } from 'react-toastify';

import AdminDashboard from "./pages/admin/AdminDashboard";
import CandidateManagement from "./pages/admin/CandidateManagement";
import RecruiterManagement from "./pages/admin/RecruiterManagement";
import JobsManagement from "./pages/admin/JobsManagement";
import AdminLayout from "./components/admin/AdminLayout";
import AdminProtectedRoute from './components/AdminProtectedRoute';
import BlogManagement from './pages/admin/BlogManagement';
import BlogCreate from './pages/admin/BlogCreate';
import BlogEdit from './pages/admin/BlogEdit';
import UserDetailPage from './pages/admin/UserDetailPage';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import ProtectedRoute from './components/ProtectedRoute';
import UserLogin from './components/UserLogin';
// Thêm import này ở đầu file
import JobDetailPage from './pages/admin/JobDetailPage';
import ResourceDetail from "./pages/resources/ResourceDetail";
import CompanyProfile from "./components/CompanyProfile"
import EditCompanyProfile from "./components/EditCompanyProfile";
import InterviewManagement from './components/InterviewManagement';
import InterviewDetail from './pages/InterviewDetail';
import ResourceManagement from './pages/admin/ResourceManagement';
import ResourceForm from './pages/admin/ResourceForm';
import ResourceItemDetail from './pages/resources/ResourceItemDetail';
import UserInterviews from './pages/UserInterviews';
import UserInterviewDetail from './components/UserInterviewDetail';
import UserDashboard from './pages/UserDashboard';
import AdminProfile from './pages/admin/AdminProfile';
import AdminActivity from './pages/admin/AdminActivity';
import AdminSettings from './pages/admin/AdminSettings';
// Chỉ giữ lại các component dashboard cần thiết
import DashboardOverview from './components/Dashboard/DashboardOverview';
import DashboardSettings from './components/Dashboard/DashboardSettings';
import BlogLayout from './components/BlogLayout';
import BlogPreview from './pages/admin/BlogPreview';
import JobApplicationForm from './components/JobApplicationForm';
import EditJob from './pages/EditJob';
const App = () => {
  const { showRecruiterLogin, companyToken, showUserLogin } = useContext(AppContext);

  return (
    <div>

      {showRecruiterLogin && <RecruiterLogin />}
      {showUserLogin && <UserLogin />}
      {/* <ToastContainer /> */}
      {/* <NotificationProvider> */}
      {/* <ToastContainer /> */}
      {/* </NotificationProvider> */}
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        {/* <Route path="/login" element={<UserLogin />} /> */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/resources/:resourceType" element={<ResourceDetail />} />
        <Route path="/resources/:resourceType/:itemSlug" element={<ResourceItemDetail />} />
        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path='/apply-job/:id' element={<ApplyJob />} />
          <Route path="/jobs/:id" element={<ApplyJob />} />
          <Route path="/jobs/:id/apply" element={<JobApplicationForm />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path='/applications' element={<Applications />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/interviews" element={<UserInterviews />} />
          <Route path="/interviews/:interviewId" element={<UserInterviewDetail />} />

          {/* Tối ưu User Dashboard Routes */}
          <Route path="/user-dashboard" element={<UserDashboard />}>
            <Route index element={<DashboardOverview />} />
            <Route path="overview" element={<DashboardOverview />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Route>
        </Route>

        {/* Protected Company Routes */}
        <Route
          path='/dashboard/*'
          element={
            companyToken ? <Dashboard /> :
              <Navigate to="/" state={{ showRecruiterLogin: true }} replace />
          }
        >
          <Route index element={<ManageJobs />} />
          <Route path="profile" element={<CompanyProfile />} />
          <Route path="edit-profile" element={<EditCompanyProfile />} />
          <Route path="add-job" element={<AddJob />} />
          <Route path="manage-jobs" element={<ManageJobs />} />
          <Route path="edit-job/:jobId" element={<EditJob />} />
          <Route path="view-applications" element={<ViewApplications />} />
          <Route path="manage-jobs/:jobId/applicants" element={<ViewApplications />} />
          <Route path="interviews" element={<InterviewManagement />} />
          <Route path="interviews/:interviewId" element={<InterviewDetail />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/candidates" element={<CandidateManagement />} />
            <Route path="/admin/candidates/:userId" element={<UserDetailPage />} />
            <Route path="/admin/jobs" element={<JobsManagement />} />
            <Route path="/admin/jobs/:jobId" element={<JobDetailPage />} />
            <Route path="/admin/recruiters" element={<RecruiterManagement />} />
            <Route path="/admin/applications" element={<ApplicationManagement />} />
            <Route path="/admin/blogs" element={<BlogManagement />} />
            <Route path="/admin/blogs/new" element={<BlogCreate />} />
            <Route path="/admin/blogs/edit/:id" element={<BlogEdit />} />
            <Route path="/admin/resources" element={<ResourceManagement />} />
            <Route path="/admin/resources/new" element={<ResourceForm />} />
            <Route path="/admin/resources/edit/:id" element={<ResourceForm />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/activity" element={<AdminActivity />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/blogs/preview/:id" element={<BlogPreview />} />
          </Route>
        </Route>
      </Routes>

    </div>
  );
};

export default App;

// import React, { useContext } from 'react'
// import { Route, Routes, Navigate } from 'react-router-dom'
// import Home from './pages/Home'
// import ApplyJob from './pages/ApplyJob'
// import Applications from './pages/Applications'
// import RecruiterLogin from './components/RecruiterLogin'
// import { AppContext } from './context/AppContext'
// import Dashboard from './pages/Dashboard'
// import AddJob from './pages/AddJob'
// import ManageJobs from './pages/ManageJobs'
// import ViewApplications from './pages/ViewApplications'

// import SavedJobs from "./pages/SavedJobs";
// import ProfilePage from "./pages/ProfilePage";
// import EditProfilePage from './pages/EditProfilePage'
// import ApplicationManagement from './pages/admin/ApplicationManagement';

// import AdminLoginPage from './pages/AdminLoginPage'
// import 'quill/dist/quill.snow.css'

// import { ToastContainer } from 'react-toastify';

// import AdminDashboard from "./pages/admin/AdminDashboard";
// import CandidateManagement from "./pages/admin/CandidateManagement";
// import RecruiterManagement from "./pages/admin/RecruiterManagement";
// import JobsManagement from "./pages/admin/JobsManagement";
// import AdminLayout from "./components/admin/AdminLayout";
// import AdminProtectedRoute from './components/AdminProtectedRoute';
// import BlogManagement from './pages/admin/BlogManagement';
// import BlogCreate from './pages/admin/BlogCreate';
// import BlogEdit from './pages/admin/BlogEdit';
// import UserDetailPage from './pages/admin/UserDetailPage';
// import Blog from './pages/Blog';
// import BlogDetail from './pages/BlogDetail';
// import UserLogin from './components/UserLogin'
// import ProtectedRoute from './components/ProtectedRoute';
// // Thêm import này ở đầu file
// import JobDetailPage from './pages/admin/JobDetailPage';
// import ResourceDetail from "./pages/resources/ResourceDetail";
// import CompanyProfile from "./components/CompanyProfile"
// import EditCompanyProfile from "./components/EditCompanyProfile";
// import InterviewManagement from './components/InterviewManagement';
// import InterviewDetail from './pages/InterviewDetail';
// import ResourceManagement from './pages/admin/ResourceManagement';
// import ResourceForm from './pages/admin/ResourceForm';
// import ResourceItemDetail from './pages/resources/ResourceItemDetail';
// import UserInterviews from './pages/UserInterviews';
// import UserInterviewDetail from './components/UserInterviewDetail';
// import UserDashboard from './pages/UserDashboard';
// import AdminProfile from './pages/admin/AdminProfile';
// import AdminActivity from './pages/admin/AdminActivity';
// import AdminSettings from './pages/admin/AdminSettings';
// // Chỉ giữ lại các component dashboard cần thiết
// import DashboardOverview from './components/Dashboard/DashboardOverview';
// import DashboardSettings from './components/Dashboard/DashboardSettings';
// import { NotificationProvider } from './context/NotificationContext';

// const App = () => {
//   const { showRecruiterLogin, companyToken } = useContext(AppContext);

//   return (
//     <div>
//       {showRecruiterLogin && <RecruiterLogin />}
//       <ToastContainer />
//       <Routes>
//         {/* Public Routes */}
//         <Route path='/' element={<Home />} />
//         {/* <Route path="/login" element={<UserLogin />} /> */}
//         <Route path="/blog" element={<Blog />} />
//         <Route path="/blog/:slug" element={<BlogDetail />} />
//         <Route path="/resources/:resourceType" element={<ResourceDetail />} />
//         <Route path="/resources/:resourceType/:itemSlug" element={<ResourceItemDetail />} />
//         {/* Protected User Routes */}
//         <Route element={<ProtectedRoute />}>
//           <Route path='/apply-job/:id' element={<ApplyJob />} />
//           <Route path="/jobs/:id" element={<ApplyJob />} />
//           <Route path="/saved-jobs" element={<SavedJobs />} />
//           <Route path='/applications' element={<Applications />} />
//           <Route path="/profile" element={<ProfilePage />} />
//           <Route path="/profile/edit" element={<EditProfilePage />} />
//           <Route path="/interviews" element={<UserInterviews />} />
//           <Route path="/interviews/:interviewId" element={<UserInterviewDetail />} />

//           {/* Tối ưu User Dashboard Routes */}
//           <Route path="/user-dashboard" element={<UserDashboard />}>
//             <Route index element={<DashboardOverview />} />
//             <Route path="overview" element={<DashboardOverview />} />
//             <Route path="settings" element={<DashboardSettings />} />
//           </Route>
//         </Route>

//         {/* Protected Company Routes */}
//         <Route
//           path='/dashboard/*'
//           element={
//             companyToken ? <Dashboard /> :
//               <Navigate to="/" state={{ showRecruiterLogin: true }} replace />
//           }
//         >
//           <Route index element={<ManageJobs />} />
//           <Route path="profile" element={<CompanyProfile />} />
//           <Route path="edit-profile" element={<EditCompanyProfile />} />
//           <Route path="add-job" element={<AddJob />} />
//           <Route path="manage-jobs" element={<ManageJobs />} />
//           <Route path="view-applications" element={<ViewApplications />} />
//           <Route path="manage-jobs/:jobId/applicants" element={<ViewApplications />} />
//           <Route path="interviews" element={<InterviewManagement />} />
//           <Route path="interviews/:interviewId" element={<InterviewDetail />} />
//         </Route>

//         {/* Admin Routes */}
//         <Route path="/admin/login" element={<AdminLoginPage />} />
//         <Route element={<AdminProtectedRoute />}>
//           <Route element={<AdminLayout />}>
//             <Route path="/admin/dashboard" element={<AdminDashboard />} />
//             <Route path="/admin/candidates" element={<CandidateManagement />} />
//             <Route path="/admin/candidates/:userId" element={<UserDetailPage />} />
//             <Route path="/admin/jobs" element={<JobsManagement />} />
//             <Route path="/admin/jobs/:jobId" element={<JobDetailPage />} />
//             <Route path="/admin/recruiters" element={<RecruiterManagement />} />
//             <Route path="/admin/applications" element={<ApplicationManagement />} />
//             <Route path="/admin/blogs" element={<BlogManagement />} />
//             <Route path="/admin/blogs/new" element={<BlogCreate />} />
//             <Route path="/admin/blogs/edit/:id" element={<BlogEdit />} />
//             <Route path="/admin/resources" element={<ResourceManagement />} />
//             <Route path="/admin/resources/new" element={<ResourceForm />} />
//             <Route path="/admin/resources/edit/:id" element={<ResourceForm />} />
//             <Route path="/admin/profile" element={<AdminProfile />} />
//             <Route path="/admin/activity" element={<AdminActivity />} />
//             <Route path="/admin/settings" element={<AdminSettings />} />
//           </Route>
//         </Route>
//       </Routes>
//     </div>
//   );
// };

// export default App;

