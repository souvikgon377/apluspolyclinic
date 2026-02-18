import React, { useEffect, useState, useContext } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllAppointments = () => {

  const { aToken, appointments, cancelAppointment, completeAppointment, getAllAppointments } = useContext(AdminContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({})

  const handleRefresh = async () => {
    setLoading(true)
    await getAllAppointments()
    setTimeout(() => setLoading(false), 2000)
  }

  const handleCancel = async (id) => {
    setActionLoading(prev => ({ ...prev, [id]: 'cancel' }))
    await cancelAppointment(id)
    setActionLoading(prev => ({ ...prev, [id]: null }))
  }

  const handleComplete = async (id) => {
    setActionLoading(prev => ({ ...prev, [id]: 'complete' }))
    await completeAppointment(id)
    setActionLoading(prev => ({ ...prev, [id]: null }))
  }

  useEffect(() => {
    if (aToken) {
      setInitialLoading(true)
      getAllAppointments().finally(() => setInitialLoading(false))
    }
  }, [aToken])

  if (initialLoading) {
    return (
      <div className='w-full max-w-6xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[400px]'>
        <div className='w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4'></div>
        <p className='text-gray-600 text-lg'>Loading appointments...</p>
      </div>
    )
  }

  return (
    <div className='w-full max-w-6xl mx-auto px-4 py-8 overflow-x-hidden'>

      {/* Page Title */}
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>All Appointments</h1>
          <p className='text-gray-500 text-sm'>Manage all clinic appointments</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={loading}
          className='flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed'
          title='Refresh Appointments'
        >
          <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
          </svg>
          <span className='font-medium hidden sm:inline'>Refresh</span>
        </button>
      </div>

      <div className='bg-white border border-gray-100 rounded-xl shadow-md text-sm max-h-[80vh] overflow-y-scroll overflow-x-hidden'>
        <div className='hidden sm:grid grid-cols-[0.5fr_2.5fr_1fr_1fr_3fr_2.5fr_1fr_1fr] grid-flow-col py-4 px-6 border-b border-gray-100 bg-gray-50 font-semibold text-gray-700'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {appointments.length === 0 ? (
          <div className='text-center py-12 text-gray-500'>
            <p>No appointments yet</p>
          </div>
        ) : (
          appointments.map((item, index) => (
            <div className='sm:grid sm:grid-cols-[0.5fr_2.5fr_1fr_1fr_3fr_2.5fr_1fr_1fr] items-center text-gray-500 py-4 px-4 sm:px-6 border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-b-0' key={index}>
              <p className='max-sm:hidden font-medium text-gray-600'>{index+1}</p>
              
              {/* Mobile Card Layout */}
              <div className='sm:contents'>
                <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2 mb-3 sm:mb-0'>
                  <div className='flex items-center gap-2'>
                    <img src={item.userData.image} className='w-10 h-10 rounded-full object-cover border-2 border-gray-200 flex-shrink-0' alt="" /> 
                    <p className='font-medium text-gray-700'>{item.userData.name}</p>
                  </div>
                </div>
                
                <div className='flex items-center gap-2 mb-2 sm:mb-0'>
                  <span className='text-xs inline border border-primary bg-emerald-50 text-primary px-2.5 py-1 rounded-full font-medium'>
                    {item.payment ? 'Online' : 'CASH'}
                  </span>
                  <p className='sm:hidden text-xs'>• Age: {calculateAge(item.userData.dob) || 'N/A'}</p>
                </div>
                
                <p className='max-sm:hidden'>{calculateAge(item.userData.dob) || 'N/A'}</p>
                
                <p className='text-gray-600 text-sm mb-2 sm:mb-0'>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
                
                <div className='flex items-center gap-2 mb-2 sm:mb-0'>
                  <img src={item.docData.image} className='w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-200 flex-shrink-0' alt="" /> 
                  <p className='font-medium text-gray-700 text-sm sm:text-base'>{item.docData.name}</p>
                </div>
                
                <p className='font-semibold text-gray-700 mb-2 sm:mb-0'>{currency}{item.amount}</p>
                
                <div className='flex items-center gap-2'>
                  {item.cancelled 
                    ? <span className='px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full whitespace-nowrap'>Cancelled</span> 
                    : item.isCompleted 
                      ? <span className='px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full whitespace-nowrap'>Completed</span> 
                      : <div className='flex gap-2'>
                          <button 
                            onClick={() => handleCancel(item._id)} 
                            disabled={actionLoading[item._id]}
                            className='w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-red-100 hover:bg-red-200 border-2 border-red-300 rounded-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                            title='Cancel Appointment'
                          >
                            {actionLoading[item._id] === 'cancel' ? (
                              <div className='w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin'></div>
                            ) : (
                              <img className='w-6 h-6 sm:w-7 sm:h-7' src={assets.cancel_icon} alt="" />
                            )}
                          </button>
                          <button 
                            onClick={() => handleComplete(item._id)} 
                            disabled={actionLoading[item._id]}
                            className='w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-green-100 hover:bg-green-200 border-2 border-green-300 rounded-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                            title='Complete Appointment'
                          >
                            {actionLoading[item._id] === 'complete' ? (
                              <div className='w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin'></div>
                            ) : (
                              <img className='w-6 h-6 sm:w-7 sm:h-7' src={assets.tick_icon} alt="" />
                            )}
                          </button>
                        </div>
                  }
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default AllAppointments