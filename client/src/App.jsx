import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
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
import 'quill/dist/quill.snow.css'

import Blog from './pages/Blog'
//import BlogCreate from './pages/BlogCreate'
import BlogDetail from './pages/BlogDetail'
//import BlogEdit from './pages/BlogEdit'

import AdminDashboard from "./pages/admin/AdminDashboard";
import CandidateManagement from "./pages/admin/CandidateManagement";
import RecruiterManagement from "./pages/admin/RecruiterManagement";
//import JobsManagement from "./pages/admin/JobsManagement";
//import UserDetails from "./pages/admin/UserDetails";


const App = () => {

  const { showRecruiterLogin } = useContext(AppContext)
  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/apply-job/:id' element={<ApplyJob />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path='/applications' element={<Applications />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path='/dashboard' element={<Dashboard />}>
          <Route path='add-job' element={<AddJob />}></Route>
          <Route path='manage-jobs' element={<ManageJobs />}></Route>
          <Route path='view-applications' element={<ViewApplications />}></Route>
        </Route>

        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        {/* <Route path="/blog/edit/:id" element={<BlogEdit />} /> */}

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/candidates" element={<CandidateManagement />} />
        {/* <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} /> */}
        {/* <Route path="/admin/candidates" element={<AdminRoute><CandidateManagement /></AdminRoute>} /> */}
        <Route path="/admin/recruiters" element={<RecruiterManagement />} />
        {/* <Route path="/admin/jobs" element={<AdminRoute><JobsManagement /></AdminRoute>} /> */}
        {/* <Route path="/admin/users/:id" element={<AdminRoute><UserDetails /></AdminRoute>} /> */}
      </Routes>
    </div>
  )
}

export default App