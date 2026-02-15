import React, { useState, useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'

const Patients = () => {

  const { aToken } = useContext(AdminContext)
  const { currency } = useContext(AppContext)
  
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showMobileModal, setShowMobileModal] = useState(false)

  const getAllPatients = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/all-patients`, {
        method: 'GET',
        headers: {
          'aToken': aToken
        }
      })

      const data = await response.json()

      if (data.success) {
        setPatients(data.patients)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to fetch patients')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const deleteAllPatients = async () => {
    const confirmed = window.confirm(
      `⚠️ WARNING: This will permanently delete ALL ${patients.length} patients from the database.\n\n• All patient appointments will be deleted\n• All prescriptions will be deleted\n\nThis action CANNOT be undone!\n\nAre you absolutely sure you want to continue?`
    )

    if (!confirmed) return

    // Double confirmation
    const doubleConfirmed = window.confirm(
      'FINAL CONFIRMATION:\n\nYou are about to delete ALL patient records, appointments, and prescriptions.\n\nClick OK to proceed with deletion.'
    )

    if (!doubleConfirmed) return

    try {
      setDeleting(true)
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/delete-all-patients`, {
        method: 'POST',
        headers: {
          'aToken': aToken
        }
      })

      const data = await response.json()

      if (data.success) {
        toast.success(data.message)
        setPatients([])
        setSelectedPatient(null)
        getAllPatients()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to delete patients')
      console.error(error)
    } finally {
      setDeleting(false)
    }
  }

  useEffect(() => {
    if (aToken) {
      getAllPatients()
    }
  }, [aToken])

  // Filter by search term
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient)
    setShowMobileModal(true)
  }

  const closeMobileModal = () => {
    setShowMobileModal(false)
  }

  return (
    <div className='w-full max-w-7xl mx-auto px-4 py-8 overflow-x-hidden'>
      
      {/* Page Title */}
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>All Patients</h1>
          <p className='text-gray-500 text-sm'>View patients and their prescription history</p>
        </div>
        <div className='flex items-center gap-3'>
          <button
            onClick={deleteAllPatients}
            disabled={deleting || loading || patients.length === 0}
            className='flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
            </svg>
            <span className='hidden sm:inline'>{deleting ? 'Deleting...' : 'Delete All'}</span>
          </button>
          <button
            onClick={getAllPatients}
            disabled={loading}
            className='flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50'
          >
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
            </svg>
            <span className='hidden sm:inline'>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className='mb-6'>
        <input
          type='text'
          placeholder='Search by patient name or email...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
        />
      </div>

      {loading ? (
        <div className='text-center py-12'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
          <p className='mt-4 text-gray-600'>Loading patients...</p>
        </div>
      ) : (
        <>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          
          {/* Patients List */}
          <div className='bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100 bg-gray-50'>
              <h2 className='font-semibold text-lg text-gray-800'>Patients</h2>
              <p className='text-xs text-gray-500 mt-1'>{filteredPatients.length} patients</p>
            </div>
            
            <div className='max-h-[600px] overflow-y-auto'>
              {filteredPatients.length === 0 ? (
                <div className='text-center py-12 text-gray-500'>
                  <p>No patients found</p>
                </div>
              ) : (
                filteredPatients.map((patient, index) => (
                  <div 
                    key={index}
                    onClick={() => handlePatientClick(patient)}
                    className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${selectedPatient?._id === patient._id ? 'bg-emerald-50 border-l-4 border-l-primary' : ''}`}
                  >
                    <div className='flex items-start gap-3'>
                      <img 
                        src={patient.image} 
                        className='w-12 h-12 rounded-full object-cover border-2 border-gray-200 flex-shrink-0' 
                        alt="" 
                      />
                      <div className='flex-1 min-w-0'>
                        <p className='font-semibold text-gray-800 truncate'>{patient.name}</p>
                        <p className='text-sm text-gray-600 truncate'>{patient.email}</p>
                        <p className='text-xs text-gray-500 mt-1'>
                          {patient.phone || 'No phone'}
                        </p>
                        <div className='flex items-center gap-2 mt-2'>
                          <span className='inline-block px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded'>
                            {patient.totalAppointments || 0} Appointments
                          </span>
                          <span className='inline-block px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded'>
                            {patient.prescriptions?.length || 0} Prescriptions
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Patient Details & Prescriptions - Hidden on mobile, shown on desktop */}
          <div className='hidden lg:block bg-white rounded-xl shadow-md border border-gray-100 p-6'>
            <h2 className='font-semibold text-lg text-gray-800 mb-4'>Patient Information</h2>
            
            {selectedPatient ? (
              <div className='space-y-6'>
                {/* Patient Info */}
                <div className='bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-lg p-4 border border-emerald-200'>
                  <div className='flex items-center gap-4'>
                    <img 
                      src={selectedPatient.image} 
                      className='w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm' 
                      alt="" 
                    />
                    <div>
                      <p className='font-semibold text-gray-800 text-lg'>{selectedPatient.name}</p>
                      <p className='text-sm text-gray-600'>{selectedPatient.email}</p>
                      <p className='text-xs text-gray-500 mt-1'>
                        Phone: {selectedPatient.phone || 'Not provided'}
                      </p>
                      {selectedPatient.dob && (
                        <p className='text-xs text-gray-500'>
                          DOB: {new Date(selectedPatient.dob).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
                    <p className='text-2xl font-bold text-gray-800'>{selectedPatient.totalAppointments || 0}</p>
                    <p className='text-sm text-gray-600'>Total Appointments</p>
                  </div>
                  <div className='bg-green-50 rounded-lg p-4 border border-green-200'>
                    <p className='text-2xl font-bold text-gray-800'>{selectedPatient.prescriptions?.length || 0}</p>
                    <p className='text-sm text-gray-600'>Prescriptions</p>
                  </div>
                </div>

                {/* Last 5 Prescriptions */}
                <div>
                  <h3 className='font-semibold text-gray-800 mb-3'>Last 5 Prescriptions</h3>
                  {!selectedPatient.prescriptions || selectedPatient.prescriptions.length === 0 ? (
                    <div className='text-center py-8 bg-gray-50 rounded-lg border border-gray-200'>
                      <svg className='w-12 h-12 mx-auto text-gray-400 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                      </svg>
                      <p className='text-gray-500 text-sm'>No prescriptions yet</p>
                    </div>
                  ) : (
                    <div className='space-y-3 max-h-[400px] overflow-y-auto'>
                      {selectedPatient.prescriptions.slice(0, 5).map((prescription, index) => (
                        <div key={index} className='border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow'>
                          <div className='flex items-start gap-3'>
                            <img 
                              src={prescription.docImage} 
                              className='w-10 h-10 rounded-full object-cover border-2 border-gray-200 flex-shrink-0' 
                              alt="" 
                            />
                            <div className='flex-1 min-w-0'>
                              <p className='font-medium text-gray-800 text-sm'>Dr. {prescription.docName}</p>
                              <p className='text-xs text-gray-600'>{prescription.speciality}</p>
                              <p className='text-xs text-gray-500 mt-1'>
                                {prescription.date} • {prescription.time}
                              </p>
                              {prescription.followUpDate && prescription.followUpDate !== '' && (
                                <div className='flex items-center justify-between mt-2 bg-amber-50 border border-amber-200 rounded px-2 py-1'>
                                  <div className='flex items-center gap-1'>
                                    <svg className='w-3 h-3 text-amber-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                    </svg>
                                    <span className='text-xs font-medium text-amber-800'>
                                      Follow-up: {new Date(prescription.followUpDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                  </div>
                                  {selectedPatient.phone && (
                                    <a
                                      href={`https://wa.me/${selectedPatient.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, your follow-up appointment is scheduled on ${new Date(prescription.followUpDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}. Please visit A Plus Polyclinic. Thank you!`)}`}
                                      target='_blank'
                                      rel='noopener noreferrer'
                                      className='flex items-center justify-center w-6 h-6 bg-green-500 hover:bg-green-600 rounded-full transition-colors'
                                      title='Send WhatsApp Reminder'
                                    >
                                      <svg className='w-4 h-4 text-white' fill='currentColor' viewBox='0 0 24 24'>
                                        <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'/>
                                      </svg>
                                    </a>
                                  )}
                                </div>
                              )}
                              <div className='mt-2'>
                                <a
                                  href={prescription.prescriptionUrl}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium'
                                >
                                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                                  </svg>
                                  View Prescription
                                </a>
                              </div>
                            </div>
                            <div className='text-right'>
                              <p className='text-sm font-semibold text-gray-700'>{currency}{prescription.amount}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className='text-center py-12 text-gray-500'>
                <svg className='w-16 h-16 mx-auto text-gray-400 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                </svg>
                <p>Select a patient to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Modal - Patient Details */}
        {showMobileModal && selectedPatient && (
          <div 
            className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:hidden'
            onClick={closeMobileModal}
          >
            <div 
              className='bg-white w-full rounded-t-2xl max-h-[90vh] overflow-y-auto animate-slide-up'
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className='sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between'>
                <h2 className='font-semibold text-lg text-gray-800'>Patient Information</h2>
                <button 
                  onClick={closeMobileModal}
                  className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                >
                  <svg className='w-6 h-6 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className='p-4 space-y-6'>
                {/* Patient Info */}
                <div className='bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-lg p-4 border border-emerald-200'>
                  <div className='flex items-center gap-4'>
                    <img 
                      src={selectedPatient.image} 
                      className='w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm' 
                      alt="" 
                    />
                    <div>
                      <p className='font-semibold text-gray-800 text-lg'>{selectedPatient.name}</p>
                      <p className='text-sm text-gray-600'>{selectedPatient.email}</p>
                      <p className='text-xs text-gray-500 mt-1'>
                        Phone: {selectedPatient.phone || 'Not provided'}
                      </p>
                      {selectedPatient.dob && selectedPatient.dob !== 'Not Selected' && (
                        <p className='text-xs text-gray-500'>
                          DOB: {new Date(selectedPatient.dob).toLocaleDateString()}
                        </p>
                      )}
                      {selectedPatient.gender && selectedPatient.gender !== 'Not Selected' && (
                        <p className='text-xs text-gray-500'>
                          Gender: {selectedPatient.gender}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
                    <p className='text-2xl font-bold text-gray-800'>{selectedPatient.totalAppointments || 0}</p>
                    <p className='text-sm text-gray-600'>Total Appointments</p>
                  </div>
                  <div className='bg-green-50 rounded-lg p-4 border border-green-200'>
                    <p className='text-2xl font-bold text-gray-800'>{selectedPatient.prescriptions?.length || 0}</p>
                    <p className='text-sm text-gray-600'>Prescriptions</p>
                  </div>
                </div>

                {/* Last 5 Prescriptions */}
                <div>
                  <h3 className='font-semibold text-gray-800 mb-3'>Last 5 Prescriptions</h3>
                  {!selectedPatient.prescriptions || selectedPatient.prescriptions.length === 0 ? (
                    <div className='text-center py-8 bg-gray-50 rounded-lg border border-gray-200'>
                      <svg className='w-12 h-12 mx-auto text-gray-400 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                      </svg>
                      <p className='text-gray-500 text-sm'>No prescriptions yet</p>
                    </div>
                  ) : (
                    <div className='space-y-3'>
                      {selectedPatient.prescriptions.slice(0, 5).map((prescription, index) => (
                        <div key={index} className='border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow'>
                          <div className='flex items-start gap-3'>
                            <img 
                              src={prescription.docImage} 
                              className='w-10 h-10 rounded-full object-cover border-2 border-gray-200 flex-shrink-0' 
                              alt="" 
                            />
                            <div className='flex-1 min-w-0'>
                              <p className='font-medium text-gray-800 text-sm'>Dr. {prescription.docName}</p>
                              <p className='text-xs text-gray-600'>{prescription.speciality}</p>
                              <p className='text-xs text-gray-500 mt-1'>
                                {prescription.date} • {prescription.time}
                              </p>
                              {prescription.followUpDate && prescription.followUpDate !== '' && (
                                <div className='flex items-center justify-between mt-2 bg-amber-50 border border-amber-200 rounded px-2 py-1'>
                                  <div className='flex items-center gap-1'>
                                    <svg className='w-3 h-3 text-amber-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                    </svg>
                                    <span className='text-xs font-medium text-amber-800'>
                                      Follow-up: {new Date(prescription.followUpDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                  </div>
                                  {selectedPatient.phone && (
                                    <a
                                      href={`https://wa.me/${selectedPatient.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, your follow-up appointment is scheduled on ${new Date(prescription.followUpDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}. Please visit A Plus Polyclinic. Thank you!`)}`}
                                      target='_blank'
                                      rel='noopener noreferrer'
                                      className='flex items-center justify-center w-6 h-6 bg-green-500 hover:bg-green-600 rounded-full transition-colors'
                                      title='Send WhatsApp Reminder'
                                    >
                                      <svg className='w-4 h-4 text-white' fill='currentColor' viewBox='0 0 24 24'>
                                        <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'/>
                                      </svg>
                                    </a>
                                  )}
                                </div>
                              )}
                              <div className='mt-2'>
                                <a
                                  href={prescription.prescriptionUrl}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium'
                                >
                                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                                  </svg>
                                  View Prescription
                                </a>
                              </div>
                            </div>
                            <div className='text-right'>
                              <p className='text-sm font-semibold text-gray-700'>{currency}{prescription.amount}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        </>
      )}
    </div>
  )
}

export default Patients
