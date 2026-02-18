import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyProfile = () => {

    const [isEdit, setIsEdit] = useState(false)

    const [image, setImage] = useState(false)

    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

    // Function to update user profile data using API
    const updateUserProfileData = async () => {

        try {

            const formData = new FormData();

            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)

            image && formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { authorization: 'Bearer ' + token } })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    return userData ? (
        <div className='max-w-4xl mx-auto px-4 py-8 overflow-x-hidden'>
            
            {/* Page Heading */}
            <div className='mb-8'>
                <h1 className='text-3xl font-bold text-gray-800 mb-2'>Patient Profile</h1>
                <p className='text-gray-500 text-sm'>Manage your personal information and contact details</p>
            </div>

            {/* Profile Card */}
            <div className='bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-8 overflow-x-hidden'>
                
                {/* Profile Image and Name Section */}
                <div className='flex flex-col sm:flex-row items-start gap-6 mb-8'>
                    {isEdit
                        ? <label htmlFor='image' >
                            <div className='inline-block relative cursor-pointer group'>
                                <div className='w-32 h-32 overflow-hidden rounded-full border-4 border-primary/20 group-hover:border-primary/40 transition-all bg-gray-50'>
                                    <img className='w-full h-full object-cover' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
                                </div>
                                <div className='absolute bottom-0 right-0 bg-primary rounded-full p-2 shadow-lg'>
                                    <img className='w-5 h-5' src={assets.upload_icon} alt="" />
                                </div>
                            </div>
                            <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                        </label>
                        : <div className='w-32 h-32 overflow-hidden rounded-full border-4 border-primary/20 bg-gray-50'>
                            <img className='w-full h-full object-cover' src={userData.image} alt="" />
                        </div>
                    }

                    <div className='flex-1 min-w-0'>
                        {isEdit
                            ? <input className='bg-gray-50 text-xl sm:text-2xl font-semibold w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:outline-none transition-all' type="text" onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} value={userData.name} />
                            : <h2 className='text-xl sm:text-2xl font-semibold text-gray-800 break-words'>{userData.name}</h2>
                        }
                        <p className='text-sm text-gray-500 mt-1 break-all'>Patient ID: {userData._id?.slice(-8).toUpperCase()}</p>
                    </div>
                </div>

                <hr className='border-gray-200 my-8' />

                {/* Contact Information Section */}
                <div className='mb-8'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                        <span className='w-1 h-6 bg-primary rounded-full'></span>
                        Contact Information
                    </h3>
                    <div className='grid md:grid-cols-2 gap-5 bg-gray-50 p-6 rounded-lg'>
                        <div>
                            <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Email Address</label>
                            <p className='text-primary font-medium mt-1 break-all'>{userData.email}</p>
                        </div>
                        
                        <div>
                            <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Phone Number</label>
                            {isEdit
                                ? <input className='bg-white w-full px-3 py-2 mt-1 rounded-lg border border-gray-200 focus:border-primary focus:outline-none transition-all' type="text" onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} value={userData.phone} />
                                : <p className='text-primary font-medium mt-1'>{userData.phone}</p>
                            }
                        </div>

                        <div className='md:col-span-2'>
                            <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Address</label>
                            {isEdit
                                ? <div className='space-y-2 mt-1'>
                                    <input className='bg-white w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:outline-none transition-all' placeholder='Address Line 1' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userData.address.line1} />
                                    <input className='bg-white w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:outline-none transition-all' placeholder='Address Line 2' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userData.address.line2} />
                                </div>
                                : <p className='text-gray-700 mt-1'>{userData.address.line1} {userData.address.line1 && userData.address.line2 && <br />} {userData.address.line2}</p>
                            }
                        </div>
                    </div>
                </div>
                {/* Basic Information Section */}
                <div className='mb-8'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                        <span className='w-1 h-6 bg-primary rounded-full'></span>
                        Basic Information
                    </h3>
                    <div className='grid md:grid-cols-2 gap-5 bg-gray-50 p-6 rounded-lg'>
                        <div>
                            <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Gender</label>
                            {isEdit
                                ? <select className='bg-white w-full px-3 py-2 mt-1 rounded-lg border border-gray-200 focus:border-primary focus:outline-none transition-all' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender} >
                                    <option value="Not Selected">Not Selected</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                : <p className='text-gray-700 mt-1 font-medium'>{userData.gender}</p>
                            }
                        </div>

                        <div>
                            <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Date of Birth</label>
                            {isEdit
                                ? <input className='bg-white w-full px-3 py-2 mt-1 rounded-lg border border-gray-200 focus:border-primary focus:outline-none transition-all' type='date' onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob} />
                                : <p className='text-gray-700 mt-1 font-medium'>{userData.dob}</p>
                            }
                        </div>
                    </div>
                </div>
                {/* Action Buttons */}
                <div className='flex justify-end pt-4'>
                    {isEdit
                        ? <div className='flex gap-3'>
                            <button onClick={() => setIsEdit(false)} className='px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium'>Cancel</button>
                            <button onClick={updateUserProfileData} className='px-6 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all font-medium shadow-md hover:shadow-lg'>Save Changes</button>
                        </div>
                        : <button onClick={() => setIsEdit(true)} className='px-6 py-2.5 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all font-medium'>Edit Profile</button>
                    }
                </div>
            </div>
        </div>
    ) : null
}

export default MyProfile