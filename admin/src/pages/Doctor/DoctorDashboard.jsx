import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

const DoctorDashboard = () => {

  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, currency } = useContext(AppContext)
  const [loading, setLoading] = useState(false)

  const handleRefresh = async () => {
    setLoading(true)
    await getDashData()
    setTimeout(() => setLoading(false), 2000)
  }


  useEffect(() => {

    if (dToken) {
      getDashData()
    }

  }, [dToken])

  return dashData && (
    <div className='w-full max-w-7xl mx-auto px-4 py-8 overflow-x-hidden'>

      {/* Dashboard Title */}
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Dashboard</h1>
          <p className='text-gray-500 text-sm'>Overview of your practice statistics</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={loading}
          className='flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed'
          title='Refresh Dashboard'
        >
          <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
          </svg>
          <span className='font-medium hidden sm:inline'>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 overflow-x-hidden'>
        <div className='bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-md hover:shadow-lg transition-all'>
          <div className='flex items-center gap-4'>
            <div className='bg-white/80 p-3 rounded-full shadow-sm'>
              <img className='w-8 h-8' src={assets.earning_icon} alt="" />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800'>{currency} {dashData.earnings}</p>
              <p className='text-gray-600 text-sm font-medium'>Total Earnings</p>
            </div>
          </div>
        </div>

        <div className='bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 shadow-md hover:shadow-lg transition-all'>
          <div className='flex items-center gap-4'>
            <div className='bg-white/80 p-3 rounded-full shadow-sm'>
              <img className='w-8 h-8' src={assets.appointments_icon} alt="" />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800'>{dashData.appointments}</p>
              <p className='text-gray-600 text-sm font-medium'>Total Appointments</p>
            </div>
          </div>
        </div>

        <div className='bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 shadow-md hover:shadow-lg transition-all'>
          <div className='flex items-center gap-4'>
            <div className='bg-white/80 p-3 rounded-full shadow-sm'>
              <img className='w-8 h-8' src={assets.patients_icon} alt="" />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800'>{dashData.patients}</p>
              <p className='text-gray-600 text-sm font-medium'>Total Patients</p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Bookings Section */}
      <div className='bg-white w-full rounded-xl shadow-md border border-gray-100'>
        <div className='flex items-center gap-2.5 px-6 py-5 border-b border-gray-100'>
          <img className='w-5 h-5' src={assets.list_icon} alt="" />
          <p className='font-semibold text-lg text-gray-800'>Latest Bookings</p>
        </div>

        <div className=''>
          {dashData.latestAppointments.length === 0 ? (
            <div className='text-center py-12 text-gray-500'>
              <p>No appointments yet</p>
            </div>
          ) : (
            dashData.latestAppointments.slice(0, 5).map((item, index) => (
              <div className='flex flex-col sm:flex-row sm:items-center px-4 sm:px-6 py-4 gap-3 sm:gap-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0' key={index}>
                <div className='flex items-center gap-3 flex-1'>
                  <img className='rounded-full w-12 h-12 object-cover border-2 border-gray-200 flex-shrink-0' src={item.userData.image} alt="" />
                  <div className='flex-1 min-w-0'>
                    <p className='text-gray-800 font-semibold truncate'>{item.userData.name}</p>
                    <p className='text-gray-500 text-xs sm:text-sm truncate'>Booking on {slotDateFormat(item.slotDate)}</p>
                  </div>
                </div>
                <div className='flex items-center justify-between sm:justify-end gap-2 sm:gap-3 flex-wrap'>
                  {item.cancelled
                    ? <span className='px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full whitespace-nowrap'>Cancelled</span>
                    : item.isCompleted
                      ? <span className='px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full whitespace-nowrap'>Completed</span>
                      : <div className='flex gap-2'>
                        <button 
                          onClick={() => cancelAppointment(item._id)} 
                          className='w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-red-100 hover:bg-red-200 border-2 border-red-300 rounded-lg transition-all hover:shadow-lg'
                          title='Cancel Appointment'
                        >
                          <img className='w-6 h-6 sm:w-7 sm:h-7' src={assets.cancel_icon} alt="" />
                        </button>
                        <button 
                          onClick={() => completeAppointment(item._id)} 
                          className='w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-green-100 hover:bg-green-200 border-2 border-green-300 rounded-lg transition-all hover:shadow-lg'
                          title='Complete Appointment'
                        >
                          <img className='w-6 h-6 sm:w-7 sm:h-7' src={assets.tick_icon} alt="" />
                        </button>
                      </div>
                  }
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  )
}

export default DoctorDashboard