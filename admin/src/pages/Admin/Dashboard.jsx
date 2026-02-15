import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {

  const { aToken, getDashData, cancelAppointment, completeAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat, currency } = useContext(AppContext)
  const [loading, setLoading] = useState(false)

  const handleRefresh = async () => {
    setLoading(true)
    await getDashData()
    setTimeout(() => setLoading(false), 2000)
  }

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
    <div className='w-full max-w-7xl mx-auto px-4 py-8 overflow-x-hidden'>

      {/* Dashboard Title */}
      <div className='mb-8 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Admin Dashboard</h1>
          <p className='text-gray-500 text-sm'>Overview of clinic statistics</p>
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
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10 overflow-x-hidden'>
        <div className='bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 shadow-md hover:shadow-lg transition-all'>
          <div className='flex items-center gap-4'>
            <div className='bg-white/80 p-3 rounded-full shadow-sm'>
              <img className='w-8 h-8' src={assets.doctor_icon} alt="" />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800'>{dashData.doctors}</p>
              <p className='text-gray-600 text-sm font-medium'>Total Doctors</p>
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

        <div className='bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200 shadow-md hover:shadow-lg transition-all'>
          <div className='flex items-center gap-4'>
            <div className='bg-white/80 p-3 rounded-full shadow-sm'>
              <svg className='w-8 h-8 text-amber-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-800'>{currency}{dashData.totalIncome || 0}</p>
              <p className='text-gray-600 text-sm font-medium'>Total Income</p>
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
                  <img className='rounded-full w-12 h-12 object-cover border-2 border-gray-200 flex-shrink-0' src={item.docData.image} alt="" />
                  <div className='flex-1 min-w-0'>
                    <p className='text-gray-800 font-semibold truncate'>{item.docData.name}</p>
                    <p className='text-gray-500 text-xs sm:text-sm truncate'>Booking on {slotDateFormat(item.slotDate)}</p>
                  </div>
                </div>
                <div className='flex items-center justify-between sm:justify-end gap-2 sm:gap-3'>
                  <span className='text-xs inline border border-primary bg-emerald-50 text-primary px-2.5 py-1 rounded-full font-medium'>
                    {item.payment ? 'Online' : 'CASH'}
                  </span>
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

export default Dashboard