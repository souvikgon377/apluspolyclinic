import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorProfile = () => {

    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
    const { currency, backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)
    const [selectedDays, setSelectedDays] = useState([])
    const [dayTimeSlots, setDayTimeSlots] = useState({})
    const [isSaving, setIsSaving] = useState(false)

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    // Initialize availability data when editing
    useEffect(() => {
        if (isEdit && profileData.availability) {
            parseAvailability(profileData.availability)
        }
    }, [isEdit])

    const parseAvailability = (availability) => {
        const days = []
        const slots = {}
        
        availability.forEach(slot => {
            const match = slot.match(/^(\w+):\s*(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/)
            if (match) {
                const [, day, startTime, endTime] = match
                if (!days.includes(day)) {
                    days.push(day)
                }
                if (!slots[day]) {
                    slots[day] = []
                }
                
                // Parse time to hour, minute, period format
                const parseTime = (time) => {
                    const [hour, minute] = time.split(':').map(Number)
                    const period = hour >= 12 ? 'PM' : 'AM'
                    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
                    return { hour: hour12.toString(), minute: minute.toString().padStart(2, '0'), period }
                }
                
                const start = parseTime(startTime)
                const end = parseTime(endTime)
                
                slots[day].push({
                    startHour: start.hour,
                    startMinute: start.minute,
                    startPeriod: start.period,
                    endHour: end.hour,
                    endMinute: end.minute,
                    endPeriod: end.period
                })
            }
        })
        
        setSelectedDays(days)
        setDayTimeSlots(slots)
    }

    const handleDayChange = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day))
            const updatedSlots = { ...dayTimeSlots }
            delete updatedSlots[day]
            setDayTimeSlots(updatedSlots)
        } else {
            setSelectedDays([...selectedDays, day])
            setDayTimeSlots({ ...dayTimeSlots, [day]: [{ startHour: '', startMinute: '00', startPeriod: 'AM', endHour: '', endMinute: '00', endPeriod: 'PM' }] })
        }
    }

    const addTimeSlot = (day) => {
        setDayTimeSlots({
            ...dayTimeSlots,
            [day]: [...(dayTimeSlots[day] || []), { startHour: '', startMinute: '00', startPeriod: 'AM', endHour: '', endMinute: '00', endPeriod: 'PM' }]
        })
    }

    const removeTimeSlot = (day, index) => {
        const updatedSlots = dayTimeSlots[day].filter((_, i) => i !== index)
        setDayTimeSlots({ ...dayTimeSlots, [day]: updatedSlots })
    }

    const updateTimeSlot = (day, index, field, value) => {
        const updatedSlots = [...dayTimeSlots[day]]
        updatedSlots[index][field] = value
        setDayTimeSlots({ ...dayTimeSlots, [day]: updatedSlots })
    }

    const formatTime = (hour, minute, period) => {
        if (!hour) return ''
        let hour24 = parseInt(hour)
        if (period === 'PM' && hour24 !== 12) hour24 += 12
        if (period === 'AM' && hour24 === 12) hour24 = 0
        return `${String(hour24).padStart(2, '0')}:${minute}`
    }

    const updateProfile = async () => {

        try {
            setIsSaving(true)

            // Build availability array from selectedDays and dayTimeSlots
            const availability = []
            selectedDays.forEach(day => {
                const slots = dayTimeSlots[day] || []
                slots.forEach(slot => {
                    const startTime = formatTime(slot.startHour, slot.startMinute, slot.startPeriod)
                    const endTime = formatTime(slot.endHour, slot.endMinute, slot.endPeriod)
                    if (startTime && endTime) {
                        availability.push(`${day}: ${startTime} - ${endTime}`)
                    }
                })
            })

            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available,
                availability: availability
            }

            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { authorization: 'Bearer ' + dToken } })

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }

            setIsEdit(false)

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        } finally {
            setIsSaving(false)
        }

    }

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    return profileData && (
        <div className='w-full max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8 overflow-x-hidden'>
            
            {/* Page Heading */}
            <div className='mb-6 sm:mb-8'>
                <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-2'>Doctor Profile</h1>
                <p className='text-gray-500 text-sm'>Manage your professional information and practice details</p>
            </div>

            {/* Profile Card */}
            <div className='bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6 md:p-8 overflow-x-hidden'>
                
                {/* Profile Image and Name Section */}
                <div className='flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8'>
                    <div className='w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden rounded-full border-4 border-primary/20 bg-gray-50'>
                        <img className='w-full h-full object-cover' src={profileData.image} alt={profileData.name} />
                    </div>

                    <div className='flex-1 text-center sm:text-left w-full overflow-hidden'>
                        <h2 className='text-xl sm:text-2xl font-semibold text-gray-800 break-words'>{profileData.name}</h2>
                        <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-2'>
                            <p className='text-sm sm:text-base text-gray-600 break-words'>{profileData.degree} - {profileData.speciality}</p>
                        </div>
                        <div className='inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs sm:text-sm rounded-full font-medium'>
                            {profileData.experience}
                        </div>
                    </div>
                </div>

                <hr className='border-gray-200 my-6 sm:my-8' />

                {/* About Section */}
                <div className='mb-6 sm:mb-8'>
                    <h3 className='text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2'>
                        <span className='w-1 h-5 sm:h-6 bg-primary rounded-full'></span>
                        About
                    </h3>
                    <div className='bg-gray-50 p-4 sm:p-6 rounded-lg'>
                        {isEdit
                            ? <textarea 
                                onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))} 
                                className='w-full bg-white px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:outline-none transition-all resize-none' 
                                rows={6} 
                                value={profileData.about}
                                placeholder='Write about your medical expertise and practice...'
                            />
                            : <p className='text-gray-700 whitespace-pre-line text-sm sm:text-base break-words'>{profileData.about}</p>
                        }
                    </div>
                </div>

                {/* Professional Details Section */}
                <div className='mb-6 sm:mb-8'>
                    <h3 className='text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2'>
                        <span className='w-1 h-5 sm:h-6 bg-primary rounded-full'></span>
                        Professional Details
                    </h3>
                    <div className='grid md:grid-cols-2 gap-4 sm:gap-5 bg-gray-50 p-4 sm:p-6 rounded-lg'>
                        <div>
                            <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Appointment Fee</label>
                            {isEdit 
                                ? <div className='flex items-center gap-2 mt-1'>
                                    <span className='text-gray-600'>{currency}</span>
                                    <input 
                                        type='number' 
                                        onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} 
                                        value={profileData.fees}
                                        className='bg-white flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:outline-none transition-all'
                                    />
                                </div>
                                : <p className='text-primary font-medium mt-1 text-lg'>{currency} {profileData.fees}</p>
                            }
                        </div>

                        <div>
                            <label className='text-xs font-medium text-gray-500 uppercase tracking-wide break-words'>Availability Status</label>
                            <div className='flex items-center gap-2 mt-2 flex-wrap'>
                                <input 
                                    type="checkbox" 
                                    onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} 
                                    checked={profileData.available}
                                    disabled={!isEdit}
                                    className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer disabled:cursor-not-allowed flex-shrink-0'
                                />
                                <label className={`font-medium text-sm ${profileData.available ? 'text-green-600' : 'text-gray-500'}`}>
                                    {profileData.available ? 'Available for Appointments' : 'Not Available'}
                                </label>
                            </div>
                        </div>

                        <div className='md:col-span-2'>
                            <label className='text-xs font-medium text-gray-500 uppercase tracking-wide'>Clinic Address</label>
                            {isEdit
                                ? <div className='space-y-2 mt-1'>
                                    <input 
                                        type='text' 
                                        onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} 
                                        value={profileData.address.line1}
                                        className='bg-white w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:outline-none transition-all'
                                        placeholder='Address Line 1'
                                    />
                                    <input 
                                        type='text' 
                                        onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} 
                                        value={profileData.address.line2}
                                        className='bg-white w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:outline-none transition-all'
                                        placeholder='Address Line 2'
                                    />
                                </div>
                                : <p className='text-gray-700 mt-1 text-sm sm:text-base break-words'>
                                    {profileData.address.line1}
                                    {profileData.address.line1 && profileData.address.line2 && <br />}
                                    {profileData.address.line2}
                                  </p>
                            }
                        </div>
                    </div>
                </div>

                {/* Working Schedule Section */}
                <div className='mb-6 sm:mb-8'>
                    <h3 className='text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2'>
                        <span className='w-1 h-5 sm:h-6 bg-primary rounded-full'></span>
                        Working Schedule
                    </h3>
                    {isEdit ? (
                        <div className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
                            {/* Days Selection */}
                            <div className='mb-4'>
                                <p className='text-sm font-medium text-gray-600 mb-2'>Select Working Days:</p>
                                <div className='flex flex-wrap gap-2'>
                                    {daysOfWeek.map((day, index) => (
                                        <label
                                            key={index}
                                            className={`flex items-center gap-2 py-2 px-4 cursor-pointer rounded-lg border transition-all text-sm
                                                ${selectedDays.includes(day)
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <input
                                                type='checkbox'
                                                checked={selectedDays.includes(day)}
                                                onChange={() => handleDayChange(day)}
                                                className='hidden'
                                            />
                                            <span className='font-medium'>{day}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Time Slots for Selected Days */}
                            {selectedDays.length > 0 && (
                                <div className='border-t pt-4'>
                                    <p className='text-sm font-medium text-gray-600 mb-3'>Set Time Slots:</p>
                                    {selectedDays.map((day, dayIndex) => (
                                        <div key={dayIndex} className='mb-4 last:mb-0 border border-gray-200 rounded-lg p-3 bg-white'>
                                            <div className='flex items-center justify-between mb-2'>
                                                <p className='font-semibold text-primary text-sm'>{day}</p>
                                                <button
                                                    type='button'
                                                    onClick={() => addTimeSlot(day)}
                                                    className='text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded hover:bg-emerald-100 transition-colors'
                                                >
                                                    + Add Slot
                                                </button>
                                            </div>
                                            {dayTimeSlots[day]?.map((slot, slotIndex) => (
                                                <div key={slotIndex} className='flex flex-wrap items-center gap-2 mb-3 p-2 bg-gray-50 rounded text-xs sm:text-sm'>
                                                    <div className='flex items-center gap-1'>
                                                        <select
                                                            value={slot.startHour}
                                                            onChange={(e) => updateTimeSlot(day, slotIndex, 'startHour', e.target.value)}
                                                            className='border border-gray-300 rounded px-1 py-1 text-xs focus:outline-none focus:border-primary w-12 sm:w-14'
                                                        >
                                                            <option value=''>Hr</option>
                                                            {[...Array(12)].map((_, i) => (
                                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                            ))}
                                                        </select>
                                                        <span className='text-gray-600'>:</span>
                                                        <select
                                                            value={slot.startMinute}
                                                            onChange={(e) => updateTimeSlot(day, slotIndex, 'startMinute', e.target.value)}
                                                            className='border border-gray-300 rounded px-1 py-1 text-xs focus:outline-none focus:border-primary w-12 sm:w-14'
                                                        >
                                                            <option value='00'>00</option>
                                                            <option value='30'>30</option>
                                                        </select>
                                                        <select
                                                            value={slot.startPeriod}
                                                            onChange={(e) => updateTimeSlot(day, slotIndex, 'startPeriod', e.target.value)}
                                                            className='border border-gray-300 rounded px-1 py-1 text-xs focus:outline-none focus:border-primary w-12 sm:w-14'
                                                        >
                                                            <option value='AM'>AM</option>
                                                            <option value='PM'>PM</option>
                                                        </select>
                                                    </div>
                                                    <span className='text-gray-500 font-medium text-xs'>to</span>
                                                    <div className='flex items-center gap-1'>
                                                        <select
                                                            value={slot.endHour}
                                                            onChange={(e) => updateTimeSlot(day, slotIndex, 'endHour', e.target.value)}
                                                            className='border border-gray-300 rounded px-1 py-1 text-xs focus:outline-none focus:border-primary w-12 sm:w-14'
                                                        >
                                                            <option value=''>Hr</option>
                                                            {[...Array(12)].map((_, i) => (
                                                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                            ))}
                                                        </select>
                                                        <span className='text-gray-600'>:</span>
                                                        <select
                                                            value={slot.endMinute}
                                                            onChange={(e) => updateTimeSlot(day, slotIndex, 'endMinute', e.target.value)}
                                                            className='border border-gray-300 rounded px-1 py-1 text-xs focus:outline-none focus:border-primary w-12 sm:w-14'
                                                        >
                                                            <option value='00'>00</option>
                                                            <option value='30'>30</option>
                                                        </select>
                                                        <select
                                                            value={slot.endPeriod}
                                                            onChange={(e) => updateTimeSlot(day, slotIndex, 'endPeriod', e.target.value)}
                                                            className='border border-gray-300 rounded px-1 py-1 text-xs focus:outline-none focus:border-primary w-12 sm:w-14'
                                                        >
                                                            <option value='AM'>AM</option>
                                                            <option value='PM'>PM</option>
                                                        </select>
                                                    </div>
                                                    {dayTimeSlots[day].length > 1 && (
                                                        <button
                                                            type='button'
                                                            onClick={() => removeTimeSlot(day, slotIndex)}
                                                            className='text-red-500 hover:text-red-700 text-sm px-2 ml-auto'
                                                        >
                                                            ✕
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='bg-gray-50 p-4 sm:p-6 rounded-lg'>
                            {profileData.availability && profileData.availability.length > 0 ? (
                                <div className='space-y-2'>
                                    {profileData.availability.map((slot, index) => (
                                        <div key={index} className='flex items-center gap-2 text-sm sm:text-base'>
                                            <span className='w-2 h-2 bg-primary rounded-full flex-shrink-0'></span>
                                            <span className='text-gray-700'>{slot}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className='text-gray-500 text-sm'>No working schedule set. Click Edit Profile to add your availability.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col sm:flex-row justify-end gap-3 pt-4'>
                    {isEdit
                        ? <>
                            <button 
                                onClick={() => setIsEdit(false)} 
                                className='w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium text-sm sm:text-base'
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={updateProfile} 
                                disabled={isSaving}
                                className='w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all font-medium shadow-md hover:shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                            >
                                {isSaving && (
                                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                )}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </>
                        : <button 
                            onClick={() => setIsEdit(true)} 
                            className='w-full sm:w-auto px-4 sm:px-6 py-2.5 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all font-medium text-sm sm:text-base'
                        >
                            Edit Profile
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}

export default DoctorProfile