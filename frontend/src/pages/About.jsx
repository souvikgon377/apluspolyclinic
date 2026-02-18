import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className='overflow-x-hidden max-w-full'>
        <div className='text-center text-2xl pt-10 text-gray-500'>
            <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
        </div>
        <div className='my-10 flex flex-col md:flex-row gap-12 overflow-x-hidden'>
            <img className='w-full md:max-w-[360px] rounded-lg shadow-md object-cover' src={assets.amit_gupta} alt="Dr. Amit Gupta" />
            <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600 min-w-0'>
                <div>
                    <h3 className='text-xl font-bold text-gray-800 mb-2'>Meet Our Founder</h3>
                    <p className='text-lg text-primary font-semibold mb-1'>Dr. Amit Gupta</p>
                    <p className='text-sm text-gray-600 mb-3'>MS, DNB, MNAMS</p>
                    <p className='text-sm font-medium text-gray-700'>General & Laparoscopic Surgeon</p>
                </div>
                <p className='break-words'>Welcome to A Plus Polyclinic, founded by Dr. Amit Gupta with a vision to provide comprehensive, high-quality healthcare services to the community. With years of expertise in general and laparoscopic surgery, Dr. Gupta established A Plus Polyclinic to offer accessible, patient-centered medical care.
                </p>
                <p className='break-words'>A Plus Polyclinic is a multi-specialty healthcare facility equipped with modern medical technology and staffed by experienced healthcare professionals. We specialize in providing personalized treatment plans, advanced surgical procedures, and preventive care. Our clinic is committed to excellence in healthcare delivery, ensuring every patient receives compassionate and efficient medical attention.
                </p>
                <b className='text-gray-800'>Our Vision</b>
                <p className='break-words'>Our vision at A Plus Polyclinic is to create a seamless healthcare experience for every patient. We aim to bridge the gap between patients and healthcare providers through convenient online appointment booking, modern facilities, and expert medical care. We strive to make quality healthcare accessible, efficient, and reliable for everyone in our community.
                </p>
            </div>
        </div>
        <div className='text-xl my-4'>
            <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
        </div>
        <div className='flex flex-col md:flex-row mb-20 overflow-x-hidden'>
            <div className='border px-6 sm:px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer min-w-0'>
                <b>EFFICIENCY:</b>
                <p className='break-words'>Streamlined Appointment Scheduling That Fits Into Your Busy Lifestyle.</p>
            </div>
            <div className='border px-6 sm:px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer min-w-0'>
                <b>CONVENIENCE:</b>
                <p className='break-words'>Access To A Network Of Trusted HealthCare Professionals In Your Area.</p>
            </div>
            <div className='border px-6 sm:px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer min-w-0'>
                <b>PERSONALIZATION:</b>
                <p className='break-words'>Tailored Recommenations And Remainders To Help You Stay On Top Of Your Health.</p>
            </div>
        </div>
    </div>
  )
}

export default About
