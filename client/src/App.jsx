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
import ViewApplicaions from './pages/ViewApplications'

import SavedJobs from "./pages/SavedJobs";

import 'quill/dist/quill.snow.css'
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
        <Route path='/dashboard' element={<Dashboard />}>
          <Route path='add-job' element={<AddJob />}></Route>
          <Route path='manage-jobs' element={<ManageJobs />}></Route>
          <Route path='view-applications' element={<ViewApplicaions />}></Route>
        </Route>


      </Routes>
    </div>
  )
}

export default App