import React, { useContext, useEffect } from 'react'
import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import Gallery from './pages/Admin/Gallery';
import Login from './pages/Login';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorPrescriptions from './pages/Doctor/DoctorPrescriptions';
import Prescriptions from './pages/Admin/Prescriptions';
import Patients from './pages/Admin/Patients';

const App = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Only redirect from root path
    if (location.pathname === '/') {
      if (aToken && dToken) {
        // If both tokens exist, default to admin dashboard
        navigate('/admin-dashboard')
      } else if (dToken) {
        navigate('/doctor-dashboard')
      } else if (aToken) {
        navigate('/admin-dashboard')
      }
    } else {
      // Protect routes - redirect if no appropriate token
      const isAdminRoute = location.pathname.startsWith('/admin') || 
                           location.pathname.startsWith('/all-appointments') ||
                           location.pathname.startsWith('/add-doctor') ||
                           location.pathname.startsWith('/doctor-list') ||
                           location.pathname.startsWith('/prescriptions') ||
                           location.pathname.startsWith('/gallery') ||
                           location.pathname.startsWith('/patients')
      
      const isDoctorRoute = location.pathname.startsWith('/doctor')
      
      if (isAdminRoute && !aToken) {
        navigate('/')
      } else if (isDoctorRoute && !dToken) {
        navigate('/')
      }
    }
  }, [dToken, aToken, location.pathname, navigate])

  return dToken || aToken ? (
    <div className='bg-[#F8F9FD] overflow-x-hidden min-h-screen max-w-full'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start overflow-x-hidden w-full'>
        <Sidebar />
        <div className='flex-1 overflow-x-hidden min-w-0'>
          <Routes>
            <Route path='/admin-dashboard' element={<Dashboard />} />
            <Route path='/all-appointments' element={<AllAppointments />} />
            <Route path='/add-doctor' element={<AddDoctor />} />
            <Route path='/doctor-list' element={<DoctorsList />} />
            <Route path='/gallery' element={<Gallery />} />
            <Route path='/prescriptions' element={<Prescriptions />} />
            <Route path='/patients' element={<Patients />} />
            <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
            <Route path='/doctor-appointments' element={<DoctorAppointments />} />
            <Route path='/doctor-profile' element={<DoctorProfile />} />
            <Route path='/doctor-prescriptions' element={<DoctorPrescriptions />} />
          </Routes>
        </div>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App