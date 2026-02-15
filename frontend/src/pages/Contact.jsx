import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-[#707070]'>
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
        <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className=' font-semibold text-lg text-gray-600'>CLINIC ADDRESS</p>
          <p className=' text-gray-500'>Sahana apartment, lower chelidanga,<br /> mother Teresa road, near volvo bus stand</p>
          <p className=' text-gray-500'>Tel: +91 8250857277 <br /> Email: aplusclinicasansol@gmail.com</p>
          {/* <p className=' font-semibold text-lg text-gray-600'>CAREERS AT A PLUS POLYCLINIC</p>
          <p className=' text-gray-500'>Learn more about our teams and job openings.</p>
          <button className='border border-primary px-8 py-4 text-sm hover:bg-primary hover:text-white transition-all duration-500'>Explore Jobs</button> */}
        </div>
      </div>

    </div>
  )
}

export default Contact
