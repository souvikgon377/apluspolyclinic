import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import { displaySpeciality, parseSpeciality } from '../lib/helpers'

const Doctors = () => {

  const { speciality } = useParams()

  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => {
        const docSpecs = parseSpeciality(doc.speciality)
        return docSpecs.includes(speciality)
      }))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div className='overflow-x-hidden max-w-full'>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button onClick={() => setShowFilter(!showFilter)} className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}>Filters</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'} w-full sm:w-auto`}>
          <p onClick={() => navigate('/doctors')} className={`w-full sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${!speciality ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}`}>All Doctors</p>
          <p onClick={() => speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-full sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'General physician' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}`}>General physician</p>
          <p onClick={() => speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-full sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gynecologist' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}`}>Gynecologist</p>
          <p onClick={() => speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-full sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Dermatologist' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}`}>Dermatologist</p>
          <p onClick={() => speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-full sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Pediatricians' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}`}>Pediatricians</p>
          <p onClick={() => speciality === 'Neurologist' ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-full sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Neurologist' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}`}>Neurologist</p>
          <p onClick={() => speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-full sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gastroenterologist' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}`}>Gastroenterologist</p>
        </div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {filterDoc.length > 0 ? (
            filterDoc.map((item, index) => (
              <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border border-emerald-100 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                <div className='aspect-square w-full overflow-hidden bg-emerald-50'>
                  <img className='w-full h-full object-cover' src={item.image} alt="" />
                </div>
                <div className='p-4'>
                  <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-emerald-600' : "text-gray-500"}`}>
                    <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-emerald-600' : "bg-gray-500"}`}></p><p>{item.available ? 'Available' : "Not Available"}</p>
                  </div>
                  <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                  <p className='text-[#5C5C5C] text-sm'>{displaySpeciality(item.speciality)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className='col-span-full flex flex-col items-center justify-center py-16 text-center'>
              <svg className='w-20 h-20 text-gray-400 mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              <p className='text-gray-600 text-xl font-medium mb-2'>No Doctors Available</p>
              <p className='text-gray-500 text-sm'>There are currently no doctors available in this specialty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Doctors