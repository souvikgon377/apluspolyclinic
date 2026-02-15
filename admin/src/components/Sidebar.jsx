import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useLocation } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'

const Sidebar = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)
  const location = useLocation()

  // Determine which sidebar to show based on current route
  const isAdminRoute = location.pathname.startsWith('/admin') || 
                       location.pathname.startsWith('/all-appointments') ||
                       location.pathname.startsWith('/add-doctor') ||
                       location.pathname.startsWith('/doctor-list') ||
                       location.pathname.startsWith('/gallery') ||
                       location.pathname.startsWith('/prescriptions') ||
                       location.pathname.startsWith('/patients')
  
  const isDoctorRoute = location.pathname.startsWith('/doctor')

  return (
    <div className='min-h-screen bg-white border-r flex-shrink-0 overflow-hidden'>
      {aToken && isAdminRoute && <ul className='text-[#515151] mt-5'>

        <NavLink to={'/admin-dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-2 md:px-9 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-primary' : ''}`}>
          <img className='min-w-5 w-5 flex-shrink-0' src={assets.home_icon} alt='' />
          <p className='hidden md:block whitespace-nowrap'>Dashboard</p>
        </NavLink>
        <NavLink to={'/all-appointments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-2 md:px-9 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-primary' : ''}`}>
          <img className='min-w-5 w-5 flex-shrink-0' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block whitespace-nowrap'>Appointments</p>
        </NavLink>
        <NavLink to={'/add-doctor'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-2 md:px-9 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-primary' : ''}`}>
          <img className='min-w-5 w-5 flex-shrink-0' src={assets.add_icon} alt='' />
          <p className='hidden md:block whitespace-nowrap'>Add Doctor</p>
        </NavLink>
        <NavLink to={'/doctor-list'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-2 md:px-9 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-primary' : ''}`}>
          <img className='min-w-5 w-5 flex-shrink-0' src={assets.people_icon} alt='' />
          <p className='hidden md:block whitespace-nowrap'>Doctors List</p>
        </NavLink>
        <NavLink to={'/gallery'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-2 md:px-9 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-primary' : ''}`}>
          <svg className='min-w-5 w-5 flex-shrink-0 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
          </svg>
          <p className='hidden md:block whitespace-nowrap'>Gallery</p>
        </NavLink>
        <NavLink to={'/prescriptions'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-2 md:px-9 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-primary' : ''}`}>
          <svg className='min-w-5 w-5 flex-shrink-0 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
          </svg>
          <p className='hidden md:block whitespace-nowrap'>DRx</p>
        </NavLink>
        <NavLink to={'/patients'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-2 md:px-9 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-primary' : ''}`}>
          <svg className='min-w-5 w-5 flex-shrink-0 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' />
          </svg>
          <p className='hidden md:block whitespace-nowrap'>Patients</p>
        </NavLink>
      </ul>}

      {dToken && isDoctorRoute && <ul className='text-[#515151] mt-5'>
        <NavLink to={'/doctor-dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-2 md:px-9 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-primary' : ''}`}>
          <img className='min-w-5 w-5 flex-shrink-0' src={assets.home_icon} alt='' />
          <p className='hidden md:block whitespace-nowrap'>Dashboard</p>
        </NavLink>
        <NavLink to={'/doctor-appointments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-2 md:px-9 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-primary' : ''}`}>
          <img className='min-w-5 w-5 flex-shrink-0' src={assets.appointment_icon} alt='' />
          <p className='hidden md:block whitespace-nowrap'>Appointments</p>
        </NavLink>
        <NavLink to={'/doctor-profile'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-2 md:px-9 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-primary' : ''}`}>
          <img className='min-w-5 w-5 flex-shrink-0' src={assets.people_icon} alt='' />
          <p className='hidden md:block whitespace-nowrap'>Profile</p>
        </NavLink>
        <NavLink to={'/doctor-prescriptions'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-2 md:px-9 cursor-pointer ${isActive ? 'bg-emerald-50 border-r-4 border-primary' : ''}`}>
          <svg className='min-w-5 w-5 flex-shrink-0 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
          </svg>
          <p className='hidden md:block whitespace-nowrap'>Prescriptions</p>
        </NavLink>
      </ul>}
    </div>
  )
}

export default Sidebar