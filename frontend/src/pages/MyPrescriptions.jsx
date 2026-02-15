import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const MyPrescriptions = () => {

  const { token, backendUrl, currency, slotDateFormat } = useContext(AppContext)
  const navigate = useNavigate()
  
  const [appointments, setAppointments] = useState([])
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [loading, setLoading] = useState(false)

  const getUserAppointments = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
      if (data.success) {
        // Filter only completed appointments with prescriptions
        const prescriptionAppointments = data.appointments
          .filter(app => app.isCompleted && !app.cancelled && app.prescription)
          .reverse()
        setAppointments(prescriptionAppointments)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      getUserAppointments()
    } else {
      navigate('/login')
    }
  }, [token])

  return (
    <div className='max-w-6xl mx-auto py-12'>
      
      {/* Page Title */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>My Prescriptions</h1>
        <p className='text-gray-500'>View prescriptions from your completed appointments</p>
      </div>

      {loading ? (
        <div className='text-center py-12'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
          <p className='mt-4 text-gray-600'>Loading prescriptions...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className='text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100'>
          <svg className='w-16 h-16 mx-auto text-gray-400 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
          </svg>
          <p className='text-gray-500'>No prescriptions available yet</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          
          {/* Appointments List */}
          <div className='space-y-4'>
            {appointments.map((item, index) => (
              <div 
                key={index}
                onClick={() => setSelectedAppointment(item)}
                className={`bg-white rounded-xl shadow-sm border transition-all cursor-pointer hover:shadow-md ${selectedAppointment?._id === item._id ? 'border-primary bg-emerald-50' : 'border-gray-100'}`}
              >
                <div className='p-5'>
                  <div className='flex items-start gap-4'>
                    <img 
                      src={item.docData.image} 
                      className='w-16 h-16 rounded-full object-cover border-2 border-gray-200 flex-shrink-0' 
                      alt="" 
                    />
                    <div className='flex-1 min-w-0'>
                      <p className='font-semibold text-gray-800 text-lg'>Dr. {item.docData.name}</p>
                      <p className='text-sm text-gray-600'>{item.docData.speciality}</p>
                      <div className='flex items-center gap-2 mt-2'>
                        <svg className='w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                        </svg>
                        <p className='text-xs text-gray-500'>
                          {slotDateFormat(item.slotDate)} • {item.slotTime}
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm font-semibold text-gray-700'>{currency}{item.amount}</p>
                      <span className='inline-block mt-2 px-2.5 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full'>
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Prescription View */}
          <div className='lg:sticky lg:top-4 h-fit'>
            {selectedAppointment ? (
              <div className='bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden'>
                <div className='px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-primary/10 to-primary/5'>
                  <h2 className='font-semibold text-lg text-gray-800'>Prescription Details</h2>
                </div>
                
                <div className='p-6 space-y-6'>
                  {/* Doctor Info */}
                  <div className='bg-gray-50 rounded-lg p-4'>
                    <p className='text-xs text-gray-600 mb-3'>Prescribed by</p>
                    <div className='flex items-center gap-3'>
                      <img 
                        src={selectedAppointment.docData.image} 
                        className='w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm' 
                        alt="" 
                      />
                      <div>
                        <p className='font-semibold text-gray-800'>Dr. {selectedAppointment.docData.name}</p>
                        <p className='text-sm text-gray-600'>{selectedAppointment.docData.speciality}</p>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <p className='text-xs text-gray-600 mb-1'>Date</p>
                      <p className='font-medium text-gray-800'>
                        {slotDateFormat(selectedAppointment.slotDate)}
                      </p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-600 mb-1'>Time</p>
                      <p className='font-medium text-gray-800'>{selectedAppointment.slotTime}</p>
                    </div>
                  </div>

                  {/* Prescription Image */}
                  <div>
                    <p className='text-sm font-medium text-gray-700 mb-3'>Prescription</p>
                    <div className='border border-gray-200 rounded-lg p-3 bg-gray-50'>
                      <img 
                        src={selectedAppointment.prescription} 
                        alt='Prescription' 
                        className='w-full rounded-lg shadow-md'
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='flex gap-3'>
                    <a
                      href={selectedAppointment.prescription}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors text-center'
                    >
                      Open Full Size
                    </a>
                    <a
                      href={selectedAppointment.prescription}
                      download={`prescription-${selectedAppointment._id}.jpg`}
                      className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors'
                    >
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center'>
                <svg className='w-16 h-16 mx-auto text-gray-400 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                </svg>
                <p className='text-gray-500'>Select an appointment to view prescription</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MyPrescriptions
