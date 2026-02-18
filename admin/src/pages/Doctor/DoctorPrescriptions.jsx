import React, { useState, useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

const DoctorPrescriptions = () => {

  const { dToken, appointments, getAppointments } = useContext(DoctorContext)
  const { currency, slotDateFormat } = useContext(AppContext)
  
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (dToken) {
      setLoading(true)
      getAppointments().finally(() => setLoading(false))
    }
  }, [dToken])

  // Filter completed appointments with prescriptions
  const appointmentsWithPrescriptions = appointments.filter(app => app.isCompleted && !app.cancelled && app.prescription)

  // Filter by search term (name or phone)
  const filteredAppointments = appointmentsWithPrescriptions.filter(app => 
    app.userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (app.userData.phone && app.userData.phone.includes(searchTerm))
  )

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedAppointment(null)
  }

  return (
    <>
      <div className='w-full max-w-6xl mx-auto px-4 py-8 overflow-x-hidden'>
        
        {/* Page Title */}
        <div className='mb-6'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Prescription</h1>
          <p className='text-gray-500 text-sm'>View prescriptions for your completed appointments</p>
        </div>

      {/* Search Bar */}
      <div className='mb-6'>
        <input
          type='text'
          placeholder='Search by patient name or phone number...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200'
        />
      </div>

      {/* Appointments List */}
      <div className='bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-100 bg-gray-50'>
          <h2 className='font-semibold text-lg text-gray-800'>Patients with Prescriptions</h2>
          </div>
          
          <div className='max-h-[600px] overflow-y-auto'>
            {loading ? (
              <div className='flex flex-col items-center justify-center py-16'>
                <div className='w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4'></div>
                <p className='text-gray-600 text-sm'>Loading prescriptions...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className='text-center py-12 text-gray-500'>
                <svg className='w-16 h-16 mx-auto text-gray-400 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                </svg>
                <p className='font-medium text-gray-700'>No prescriptions found</p>
                <p className='text-sm text-gray-500 mt-1'>Prescriptions will appear here once appointments are completed</p>
              </div>
            ) : (
              filteredAppointments.map((item, index) => (
                <div 
                  key={index}
                  onClick={() => handleAppointmentClick(item)}
                  className='p-4 border-b border-gray-50 cursor-pointer transition-all duration-200 hover:bg-emerald-50 hover:shadow-md hover:-translate-y-0.5'
                >
                  <div className='flex items-start gap-3'>
                    <img 
                      src={item.userData.image} 
                      className='w-12 h-12 rounded-full object-cover border-2 border-gray-200 flex-shrink-0' 
                      alt="" 
                    />
                    <div className='flex-1 min-w-0'>
                      <p className='font-semibold text-gray-800 truncate'>{item.userData.name}</p>
                      <p className='text-sm text-gray-600 truncate'>{item.userData.email}</p>
                      {item.userData.phone && (
                        <p className='text-xs text-gray-500 mt-0.5'>Phone: {item.userData.phone}</p>
                      )}
                      <p className='text-xs text-gray-500 mt-1'>
                        {slotDateFormat(item.slotDate)} • {item.slotTime}
                      </p>
                    </div>
                    <div className='text-right flex-shrink-0'>
                      <p className='text-sm font-semibold text-gray-700'>{currency}{item.amount}</p>
                      <span className='inline-block mt-2 px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded transition-all duration-200 hover:bg-green-200 hover:shadow-sm'>View Rx</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && selectedAppointment && (
        <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fadeIn' onClick={closeModal}>
          <div className='bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scaleIn' onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className='flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-cyan-50'>
              <div>
                <h2 className='font-semibold text-2xl text-gray-800'>Prescription Details</h2>
                <p className='text-sm text-gray-600 mt-1'>Patient prescription information</p>
              </div>
              <button
                onClick={closeModal}
                className='p-2 hover:bg-gray-100 rounded-full transition-colors'
              >
                <svg className='w-6 h-6 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className='p-6 overflow-y-auto max-h-[calc(90vh-140px)] scroll-smooth'>
              <div className='space-y-6'>
                {/* Patient Information */}
                <div className='bg-emerald-50 rounded-lg p-5 border border-emerald-200 animate-fadeIn'>
                  <p className='text-sm font-medium text-gray-600 mb-3'>Patient Information</p>
                  <div className='flex items-center gap-4'>
                    <img 
                      src={selectedAppointment.userData.image} 
                      className='w-16 h-16 rounded-full object-cover border-2 border-white shadow-md transition-transform duration-200 hover:scale-110 flex-shrink-0' 
                      alt="" 
                    />
                    <div className='flex-1 min-w-0'>
                      <p className='font-semibold text-gray-800 text-lg truncate'>{selectedAppointment.userData.name}</p>
                      <p className='text-sm text-gray-600 mt-1 truncate'>{selectedAppointment.userData.email}</p>
                      {selectedAppointment.userData.phone && (
                        <p className='text-sm text-gray-600 mt-0.5'>Phone: {selectedAppointment.userData.phone}</p>
                      )}
                      <p className='text-xs text-gray-500 mt-2'>
                        📅 {slotDateFormat(selectedAppointment.slotDate)} • {selectedAppointment.slotTime}
                      </p>
                    </div>
                  </div>
                  <div className='mt-4 pt-4 border-t border-emerald-200 flex justify-between items-center'>
                    <p className='text-sm text-gray-600'>Amount Paid</p>
                    <p className='text-2xl font-bold text-primary'>{currency}{selectedAppointment.amount}</p>
                  </div>
                </div>

                {selectedAppointment.followUpDate && (
                  <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
                    <p className='text-sm font-medium text-amber-800 mb-1'>Follow-up Scheduled</p>
                    <p className='text-lg font-semibold text-amber-900'>
                      {new Date(selectedAppointment.followUpDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                )}

                {/* Prescription Image */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-3'>Prescription Image</label>
                  <div className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
                    <img 
                      src={selectedAppointment.prescription} 
                      alt='Prescription' 
                      className='max-h-[500px] w-full object-contain rounded-lg shadow-lg animate-fadeIn'
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex gap-3 pt-4'>
                  <a
                    href={selectedAppointment.prescription}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-center flex items-center justify-center gap-2'
                  >
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
                    </svg>
                    Open in New Tab
                  </a>
                  <button
                    onClick={closeModal}
                    className='px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:shadow-md hover:scale-[1.02] transition-all duration-200'
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DoctorPrescriptions
