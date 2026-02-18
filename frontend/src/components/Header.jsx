import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
    return (
        <div className='flex flex-col md:flex-row flex-wrap bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg px-6 md:px-10 lg:px-20 '>

            {/* --------- Header Left --------- */}
            <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
                <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
                    Book Appointment <br />  With Trusted Doctors
                </p>
                <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
                    <img className='w-28' src={assets.group_profiles} alt="" />
                    <p>Simply browse through our extensive list of trusted doctors, <br className='hidden sm:block' /> schedule your appointment hassle-free.</p>
                </div>
                <a href='#speciality' className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-emerald-600 text-sm font-medium m-auto md:m-0 hover:scale-105 hover:shadow-lg transition-all duration-300'>
                    Book appointment <img className='w-3' src={assets.arrow_icon} alt="" />
                </a>
            </div>

            {/* --------- Header Right --------- */}
            <div className='md:w-1/2 relative flex items-center justify-center md:justify-end pb-6 md:pb-0'>
                <img className='w-3/5 md:w-3/4 h-auto object-cover rounded-3xl border-4 border-white shadow-lg' src={assets.header_img} alt="" />
            </div>
        </div>
    )
}

export default Header