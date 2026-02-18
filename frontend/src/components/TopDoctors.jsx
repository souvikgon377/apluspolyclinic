import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { displaySpeciality } from '../lib/helpers'

const TopDoctors = () => {

    const navigate = useNavigate()

    const { doctors } = useContext(AppContext)

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-[#262626] md:mx-10 overflow-x-hidden'>
            <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
            <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0 overflow-x-hidden'>
                {doctors.slice(0, 10).map((item, index) => (
                    <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border border-emerald-100 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                        <div className='aspect-square w-full overflow-hidden bg-emerald-50'>
                            <img className='w-full h-full object-cover' src={item.image} alt="" />
                        </div>
                        <div className='p-4'>
                            <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-emerald-600' : "text-gray-500"}`}>
                                <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-emerald-600' : "bg-gray-500"}`}></p><p>{item.available ? 'Available' : "Not Available"}</p>
                            </div>
                            <p className='text-[#262626] text-lg font-medium break-words'>{item.name}</p>
                            <p className='text-[#5C5C5C] text-sm break-words'>{displaySpeciality(item.speciality)}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} className='bg-emerald-50 text-gray-700 px-12 py-3 rounded-full mt-10 hover:bg-primary hover:text-white transition-all duration-300'>more</button>
        </div>

    )
}

export default TopDoctors