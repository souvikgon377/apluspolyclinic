import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { displaySpeciality } from '../../lib/helpers'

const DoctorsList = () => {

  const { doctors, changeAvailability, aToken, getAllDoctors, removeDoctor } = useContext(AdminContext)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (aToken) {
      setLoading(true)
      getAllDoctors().finally(() => {
        setLoading(false)
      })
    }
  }, [aToken, getAllDoctors])

  const handleRemoveDoctor = (docId, docName) => {
    if (window.confirm(`Are you sure you want to remove Dr. ${docName}? This will also delete all their appointments.`)) {
      removeDoctor(docId)
    }
  }

  if (loading) {
    return (
      <div className='w-full max-w-6xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[400px]'>
        <div className='w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4'></div>
        <p className='text-gray-600 text-lg'>Loading doctors...</p>
      </div>
    )
  }

  return (
    <div className='w-full max-w-7xl mx-auto px-4 py-8 max-h-[90vh] overflow-y-scroll overflow-x-hidden'>
      {/* Page Title */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>All Doctors</h1>
        <p className='text-gray-500 text-sm'>Manage clinic doctors</p>
      </div>

      {loading ? (
        <div className='flex justify-center items-center py-20'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
        </div>
      ) : !doctors || doctors.length === 0 ? (
        <div className='text-center py-20'>
          <svg className='mx-auto h-12 w-12 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
          </svg>
          <h3 className='mt-4 text-lg font-medium text-gray-900'>No doctors found</h3>
          <p className='mt-2 text-sm text-gray-500'>Get started by adding a new doctor.</p>
        </div>
      ) : (
        <div className='w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 gap-y-6'>
          {doctors.map((item, index) => (
            <div className='border border-emerald-100 rounded-xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all max-w-[200px] mx-auto w-full' key={index}>
              <div className='w-full aspect-[3/4] overflow-hidden bg-emerald-50 group-hover:bg-primary transition-all duration-500'>
                <img className='w-full h-full object-cover' src={item.image} alt="" />
              </div>
              <div className='p-3 bg-white'>
                <p className='text-gray-800 text-sm font-semibold truncate' title={item.name}>{item.name}</p>
                <p className='text-gray-600 text-xs mb-2 h-8 overflow-hidden' title={displaySpeciality(item.speciality)}>{displaySpeciality(item.speciality)}</p>
                <div className='mt-2 flex items-center gap-2 text-xs bg-emerald-50 p-1.5 rounded-lg'>
                  <input 
                    onChange={() => changeAvailability(item._id)} 
                    type="checkbox" 
                    checked={item.available}
                    className='w-4 h-4 accent-primary cursor-pointer'
                  />
                  <p className='font-medium text-gray-700'>Available</p>
                </div>
                <button
                  onClick={() => handleRemoveDoctor(item._id, item.name)}
                  className='mt-2 w-full bg-red-50 text-red-600 border border-red-200 py-1.5 px-3 rounded-lg hover:bg-red-100 transition-colors text-xs font-semibold shadow-sm'
                >
                  Remove
                </button>
              </div>
            </div>
          ))}      
        </div>
      )}
    </div>
  )
}

export default DoctorsList