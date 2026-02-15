import React, { useState, useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'

const Prescriptions = () => {

  const { aToken, appointments, getAllAppointments } = useContext(AdminContext)
  const { currency, slotDateFormat } = useContext(AppContext)
  
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [prescriptionImage, setPrescriptionImage] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState(false) // false = upload, true = view
  const [followUpDate, setFollowUpDate] = useState('')

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  // Filter completed appointments only
  const completedAppointments = appointments.filter(app => app.isCompleted && !app.cancelled)

  // Filter by search term
  const filteredAppointments = completedAppointments.filter(app => 
    app.userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.docData.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB')
        return
      }
      setPrescriptionImage(file)
    }
  }

  const handleUploadPrescription = async () => {
    if (!selectedAppointment) {
      toast.error('Please select an appointment')
      return
    }
    if (!prescriptionImage) {
      toast.error('Please select a prescription image')
      return
    }

    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('appointmentId', selectedAppointment._id)
      formData.append('prescription', prescriptionImage)
      if (followUpDate) {
        formData.append('followUpDate', followUpDate)
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/upload-prescription`, {
        method: 'POST',
        headers: {
          'aToken': aToken
        },
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Prescription uploaded successfully!')
        setPrescriptionImage(null)
        setSelectedAppointment(null)
        setViewMode(false)
        setFollowUpDate('')
        getAllAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to upload prescription')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className='w-full max-w-6xl mx-auto px-4 py-8 overflow-x-hidden'>
      
      {/* Page Title */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>DRx - Prescriptions</h1>
        <p className='text-gray-500 text-sm'>Upload prescriptions for completed appointments</p>
      </div>

      {/* Search Bar */}
      <div className='mb-6'>
        <input
          type='text'
          placeholder='Search by patient or doctor name...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        
        {/* Appointments List */}
        <div className='bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-100 bg-gray-50'>
            <h2 className='font-semibold text-lg text-gray-800'>Completed Appointments</h2>
            <p className='text-xs text-gray-500 mt-1'>{filteredAppointments.length} appointments</p>
          </div>
          
          <div className='max-h-[600px] overflow-y-auto'>
            {filteredAppointments.length === 0 ? (
              <div className='text-center py-12 text-gray-500'>
                <p>No completed appointments found</p>
              </div>
            ) : (
              filteredAppointments.map((item, index) => (
                <div 
                  key={index}
                  onClick={() => {
                    setSelectedAppointment(item)
                    setViewMode(item.prescription ? true : false)
                    setPrescriptionImage(null)
                    setFollowUpDate(item.followUpDate || '')
                  }}
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
                      <p className='text-sm text-gray-600 truncate'>Dr. {item.docData.name}</p>
                      <p className='text-xs text-gray-500 mt-1'>
                        {slotDateFormat(item.slotDate)} • {item.slotTime}
                      </p>
                      {item.prescription && (
                        <span className='inline-block mt-2 px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded'>
                          ✓ Prescription Added
                        </span>
                      )}
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

        {/* Upload/View Section */}
        <div className='bg-white rounded-xl shadow-md border border-gray-100 p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='font-semibold text-lg text-gray-800'>
              {viewMode ? 'View Prescription' : 'Upload Prescription'}
            </h2>
            {selectedAppointment?.prescription && (
              <button
                onClick={() => setViewMode(!viewMode)}
                className='px-4 py-2 text-sm bg-emerald-100 text-primary rounded-lg hover:bg-emerald-200 transition-colors font-medium'
              >
                {viewMode ? 'Upload New' : 'View Existing'}
              </button>
            )}
          </div>
          
          {selectedAppointment ? (
            <div className='space-y-6'>
              {/* Selected Appointment Info */}
              <div className='bg-emerald-50 rounded-lg p-4 border border-emerald-200'>
                <p className='text-sm text-gray-600 mb-2'>Selected Appointment</p>
                <div className='flex items-center gap-3'>
                  <img 
                    src={selectedAppointment.userData.image} 
                    className='w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm' 
                    alt="" 
                  />
                  <div>
                    <p className='font-semibold text-gray-800'>{selectedAppointment.userData.name}</p>
                    <p className='text-sm text-gray-600'>Dr. {selectedAppointment.docData.name}</p>
                    <p className='text-xs text-gray-500'>
                      {slotDateFormat(selectedAppointment.slotDate)} • {selectedAppointment.slotTime}
                    </p>
                  </div>
                </div>
              </div>

              {viewMode && selectedAppointment.prescription ? (
                /* View Mode - Display Existing Prescription */
                <div className='space-y-4'>
                  {selectedAppointment.followUpDate && (
                    <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
                      <p className='text-sm font-medium text-amber-800 mb-1'>Follow-up Scheduled</p>
                      <p className='text-lg font-semibold text-amber-900'>{new Date(selectedAppointment.followUpDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  )}
                  
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
                  <div className='flex flex-col gap-3'>
                    {selectedAppointment.followUpDate && selectedAppointment.userData.phone && (
                      <a
                        href={`https://wa.me/${selectedAppointment.userData.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, your follow-up appointment is scheduled on ${new Date(selectedAppointment.followUpDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}. Please visit A Plus Polyclinic. Thank you!`)}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='w-full bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 transition-colors text-center flex items-center justify-center gap-2'
                      >
                        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                          <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'/>
                        </svg>
                        Send WhatsApp Reminder
                      </a>
                    )}
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
                        onClick={() => {
                          setSelectedAppointment(null)
                          setPrescriptionImage(null)
                          setViewMode(false)
                        }}
                        className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors'
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Upload Mode - Upload New Prescription */
                <>
                  {/* Follow-up Date */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Follow-up Date (Optional)
                    </label>
                    <input
                      type='date'
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Prescription Image
                    </label>
                    <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors'>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={handleImageChange}
                        className='hidden'
                        id='prescription-upload'
                      />
                      <label htmlFor='prescription-upload' className='cursor-pointer'>
                        {prescriptionImage ? (
                          <div className='space-y-2'>
                            <img 
                              src={URL.createObjectURL(prescriptionImage)} 
                              alt='Preview' 
                              className='max-h-64 mx-auto rounded-lg shadow-md'
                            />
                            <p className='text-sm text-gray-600'>{prescriptionImage.name}</p>
                            <p className='text-xs text-gray-500'>Click to change</p>
                          </div>
                        ) : (
                          <div className='space-y-2'>
                            <div className='flex justify-center'>
                              <svg className='w-12 h-12 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' />
                              </svg>
                            </div>
                            <p className='text-sm text-gray-600'>Click to upload prescription image</p>
                            <p className='text-xs text-gray-500'>PNG, JPG up to 5MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex gap-3'>
                    <button
                      onClick={handleUploadPrescription}
                      disabled={uploading || !prescriptionImage}
                      className='flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {uploading ? 'Uploading...' : selectedAppointment.prescription ? 'Update Prescription' : 'Upload Prescription'}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAppointment(null)
                        setPrescriptionImage(null)
                        setViewMode(false)
                        setFollowUpDate('')
                      }}
                      className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors'
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className='text-center py-12 text-gray-500'>
              <svg className='w-16 h-16 mx-auto text-gray-400 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
              <p>Select an appointment to upload prescription</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Prescriptions
