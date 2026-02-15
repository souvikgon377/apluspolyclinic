import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { displaySpeciality } from '../../lib/helpers'

const DoctorsList = () => {

  const { doctors, changeAvailability, aToken, getAllDoctors, removeDoctor } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  const handleRemoveDoctor = (docId, docName) => {
    if (window.confirm(`Are you sure you want to remove Dr. ${docName}? This will also delete all their appointments.`)) {
      removeDoctor(docId)
    }
  }

  return (
    <div className='w-full max-w-7xl mx-auto px-4 py-8 max-h-[90vh] overflow-y-scroll overflow-x-hidden'>
      {/* Page Title */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>All Doctors</h1>
        <p className='text-gray-500 text-sm'>Manage clinic doctors</p>
      </div>
      <div className='w-full flex flex-wrap gap-4 gap-y-6'>
        {doctors.map((item, index) => (
          <div className='border border-emerald-100 rounded-xl max-w-56 overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all' key={index}>
            <div className='aspect-square w-full overflow-hidden bg-emerald-50 group-hover:bg-primary transition-all duration-500'>
              <img className='w-full h-full object-cover' src={item.image} alt="" />
            </div>
            <div className='p-4 bg-white'>
              <p className='text-gray-800 text-lg font-semibold'>{item.name}</p>
              <p className='text-gray-600 text-sm mb-3'>{displaySpeciality(item.speciality)}</p>
              <div className='mt-2 flex items-center gap-2 text-sm bg-emerald-50 p-2 rounded-lg'>
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
                className='mt-3 w-full bg-red-50 text-red-600 border border-red-200 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold shadow-sm'
              >
                Remove Doctor
              </button>
            </div>
          </div>
        ))}      
      </div>
    </div>
  )
}

export default DoctorsList