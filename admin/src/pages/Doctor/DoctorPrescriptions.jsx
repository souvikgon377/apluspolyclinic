import React, { useState, useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

const DoctorPrescriptions = () => {

  const { dToken, appointments, getAppointments } = useContext(DoctorContext)
  const { currency, slotDateFormat } = useContext(AppContext)
  
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  // Filter completed appointments with prescriptions
  const appointmentsWithPrescriptions = appointments.filter(app => app.isCompleted && !app.cancelled && app.prescription)

  // Filter by search term
  const filteredAppointments = appointmentsWithPrescriptions.filter(app => 
    app.userData.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='w-full max-w-6xl mx-auto px-4 py-8 overflow-x-hidden'>
      
      {/* Page Title */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>My Prescriptions</h1>
        <p className='text-gray-500 text-sm'>View prescriptions for your completed appointments</p>
      </div>

      {/* Search Bar */}
      <div className='mb-6'>
        <input
          type='text'
          placeholder='Search by patient name...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        
        {/* Appointments List */}
        <div className='bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-100 bg-gray-50'>
            <h2 className='font-semibold text-lg text-gray-800'>Appointments with Prescriptions</h2>
            <p className='text-xs text-gray-500 mt-1'>{filteredAppointments.length} prescriptions</p>
          </div>
          
          <div className='max-h-[600px] overflow-y-auto'>
            {filteredAppointments.length === 0 ? (
              <div className='text-center py-12 text-gray-500'>
                <p>No prescriptions found</p>
              </div>
            ) : (
              filteredAppointments.map((item, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedAppointment(item)}
                  className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${selectedAppointment?._id === item._id ? 'bg-emerald-50 border-l-4 border-l-primary' : ''}`}
                >
                  <div className='flex items-start gap-3'>
                    <img 
                      src={item.userData.image} 
                      className='w-12 h-12 rounded-full object-cover border-2 border-gray-200 flex-shrink-0' 
                      alt="" 
                    />
                    <div className='flex-1 min-w-0'>
                      <p className='font-semibold text-gray-800 truncate'>{item.userData.name}</p>
                      <p className='text-xs text-gray-500 mt-1'>
                        {slotDateFormat(item.slotDate)} • {item.slotTime}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm font-semibold text-gray-700'>{currency}{item.amount}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* View Section */}
        <div className='bg-white rounded-xl shadow-md border border-gray-100 p-6'>
          <h2 className='font-semibold text-lg text-gray-800 mb-4'>Prescription Details</h2>
          
          {selectedAppointment ? (
            <div className='space-y-6'>
              {/* Selected Appointment Info */}
              <div className='bg-emerald-50 rounded-lg p-4 border border-emerald-200'>
                <p className='text-sm text-gray-600 mb-2'>Patient Information</p>
                <div className='flex items-center gap-3'>
                  <img 
                    src={selectedAppointment.userData.image} 
                    className='w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm' 
                    alt="" 
                  />
                  <div>
                    <p className='font-semibold text-gray-800'>{selectedAppointment.userData.name}</p>
                    <p className='text-sm text-gray-600'>{selectedAppointment.userData.email}</p>
                    <p className='text-xs text-gray-500'>
                      {slotDateFormat(selectedAppointment.slotDate)} • {selectedAppointment.slotTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Prescription Image */}
              <div className='space-y-4'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Prescription Image
                </label>
                <div className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
                  <img 
                    src={selectedAppointment.prescription} 
                    alt='Prescription' 
                    className='max-h-96 w-full object-contain rounded-lg shadow-md'
                  />
                </div>
                <div className='flex gap-3'>
                  <a
                    href={selectedAppointment.prescription}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors text-center'
                  >
                    Open in New Tab
                  </a>
                  <button
                    onClick={() => setSelectedAppointment(null)}
                    className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors'
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className='text-center py-12 text-gray-500'>
              <svg className='w-16 h-16 mx-auto text-gray-400 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
              <p>Select an appointment to view prescription</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorPrescriptions
