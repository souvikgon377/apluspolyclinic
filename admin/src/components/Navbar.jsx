import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {

  const { dToken, setDToken } = useContext(DoctorContext)
  const { aToken, setAToken } = useContext(AdminContext)

  const navigate = useNavigate()

  const location = useLocation()

  const logout = () => {
    // Determine which token to clear based on current route
    const isAdminRoute = location.pathname.startsWith('/admin') || 
                         location.pathname.startsWith('/all-appointments') ||
                         location.pathname.startsWith('/add-doctor') ||
                         location.pathname.startsWith('/doctor-list') ||
                         location.pathname.startsWith('/prescriptions') ||
                         location.pathname.startsWith('/patients')
    
    if (isAdminRoute && aToken) {
      setAToken('')
      localStorage.removeItem('aToken')
      // If doctor is also logged in, go to doctor dashboard, else login
      if (dToken) {
        navigate('/doctor-dashboard')
      } else {
        navigate('/')
      }
    } else if (dToken) {
      setDToken('')
      localStorage.removeItem('dToken')
      // If admin is also logged in, go to admin dashboard, else login
      if (aToken) {
        navigate('/admin-dashboard')
      } else {
        navigate('/')
      }
    } else {
      navigate('/')
    }
  }

  return (
    <div className='flex justify-between items-center px-2 sm:px-4 md:px-10 py-3 border-b bg-white w-full overflow-x-hidden max-w-full'>
      <div className='flex items-center gap-1.5 sm:gap-2.5 text-xs flex-shrink min-w-0'>
        <img onClick={() => navigate('/')} className='w-24 sm:w-28 md:w-36 lg:w-40 cursor-pointer flex-shrink-0' src={assets.logo} alt="A Plus Polyclinic" />
        {aToken ? (
          <div className='flex items-center gap-1.5 px-2.5 sm:px-3 md:px-3.5 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-md hover:shadow-lg transition-all flex-shrink-0'>
            <svg className='w-3 h-3 sm:w-3.5 sm:h-3.5 text-white' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z' clipRule='evenodd' />
            </svg>
            <span className='text-white font-semibold text-[10px] sm:text-xs whitespace-nowrap'>Admin</span>
          </div>
        ) : (
          <div className='flex items-center gap-1.5 px-2.5 sm:px-3 md:px-3.5 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 shadow-md hover:shadow-lg transition-all flex-shrink-0'>
            <svg className='w-3 h-3 sm:w-3.5 sm:h-3.5 text-white' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z' />
            </svg>
            <span className='text-white font-semibold text-[10px] sm:text-xs whitespace-nowrap'>Doctor</span>
          </div>
        )}
      </div>
      <button onClick={() => logout()} className='bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-[10px] sm:text-xs md:text-sm px-4 sm:px-6 md:px-10 py-2 rounded-full font-medium hover:shadow-lg transition-all flex-shrink-0'>Logout</button>
    </div>
  )
}

export default Navbar