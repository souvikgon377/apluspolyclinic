import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState([])
    const [degree, setDegree] = useState('')
    const [selectedDays, setSelectedDays] = useState([])
    const [dayTimeSlots, setDayTimeSlots] = useState({})

    const { backendUrl } = useContext(AppContext)
    const { aToken, getAllDoctors, getDashData } = useContext(AdminContext)

    const specialityOptions = [
        'General physician',
        'Gynecologist',
        'Dermatologist',
        'Pediatricians',
        'Neurologist',
        'Gastroenterologist'
    ]

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    
    const handleSpecialityChange = (spec) => {
        if (speciality.includes(spec)) {
            setSpeciality(speciality.filter(s => s !== spec))
        } else {
            setSpeciality([...speciality, spec])
        }
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

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {

            if (!docImg) {
                return toast.error('Image Not Selected')
            }

            if (speciality.length === 0) {
                return toast.error('Please select at least one speciality')
            }

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

            const formData = new FormData();

            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', JSON.stringify(speciality))
            formData.append('degree', degree)
            formData.append('availability', JSON.stringify(availability))

            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setDegree('')
                setAbout('')
                setFees('')
                setSpeciality([])
                setSelectedDays([])
                setDayTimeSlots({})
                // Refresh doctors list and dashboard
                getAllDoctors()
                getDashData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    return (
        <form onSubmit={onSubmitHandler} className='w-full max-w-5xl mx-auto px-4 py-8 overflow-x-hidden'>

            {/* Page Title */}
            <div className='mb-6'>
                <h1 className='text-3xl font-bold text-gray-800 mb-2'>Add Doctor</h1>
                <p className='text-gray-500 text-sm'>Add a new doctor to the clinic</p>
            </div>

            <div className='bg-white px-6 sm:px-8 py-8 border border-gray-100 rounded-xl shadow-md w-full max-h-[80vh] overflow-y-scroll overflow-x-hidden'>
                <div className='flex items-center gap-4 mb-8 text-gray-600'>
                    <label htmlFor="doc-img" className='cursor-pointer'>
                        <img className='w-20 h-20 bg-emerald-50 rounded-full border-2 border-emerald-200 hover:border-emerald-400 transition-colors object-cover' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" name="" id="doc-img" hidden />
                    <div>
                        <p className='font-semibold text-gray-800'>Upload doctor picture</p>
                        <p className='text-sm text-gray-500'>Click to select image</p>
                    </div>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p className='font-medium text-gray-700 mb-1'>Doctor Name</p>
                            <input onChange={e => setName(e.target.value)} value={name} className='border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary transition-colors' type="text" placeholder='Name' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p className='font-medium text-gray-700 mb-1'>Doctor Email</p>
                            <input onChange={e => setEmail(e.target.value)} value={email} className='border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary transition-colors' type="email" placeholder='Email' required />
                        </div>


                        <div className='flex-1 flex flex-col gap-1'>
                            <p className='font-medium text-gray-700 mb-1'>Set Password</p>
                            <input onChange={e => setPassword(e.target.value)} value={password} className='border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary transition-colors' type="password" placeholder='Password' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p className='font-medium text-gray-700 mb-1'>Experience</p>
                            <select onChange={e => setExperience(e.target.value)} value={experience} className='border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary transition-colors' >
                                <option value="1 Year">1 Year</option>
                                <option value="2 Year">2 Years</option>
                                <option value="3 Year">3 Years</option>
                                <option value="4 Year">4 Years</option>
                                <option value="5 Year">5 Years</option>
                                <option value="6 Year">6 Years</option>
                                <option value="8 Year">8 Years</option>
                                <option value="9 Year">9 Years</option>
                                <option value="10 Year">10 Years</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p className='font-medium text-gray-700 mb-1'>Consultation Fees</p>
                            <input onChange={e => setFees(e.target.value)} value={fees} className='border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary transition-colors' type="number" placeholder='Doctor fees' required />
                        </div>

                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p className='font-medium text-gray-700 mb-2'>Speciality (Select multiple)</p>
                            <div className='border border-gray-300 rounded-lg px-3 py-3 max-h-48 overflow-y-auto'>
                                {specialityOptions.map((spec, index) => (
                                    <label key={index} className='flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50 px-2 rounded'>
                                        <input
                                            type='checkbox'
                                            checked={speciality.includes(spec)}
                                            onChange={() => handleSpecialityChange(spec)}
                                            className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary'
                                        />
                                        <span className='text-gray-700'>{spec}</span>
                                    </label>
                                ))}
                            </div>
                            {speciality.length > 0 && (
                                <p className='text-sm text-gray-500 mt-1'>
                                    Selected: {speciality.join(', ')}
                                </p>
                            )}
                        </div>


                        <div className='flex-1 flex flex-col gap-1'>
                            <p className='font-medium text-gray-700 mb-1'>Education</p>
                            <input onChange={e => setDegree(e.target.value)} value={degree} className='border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-primary transition-colors' type="text" placeholder='Degree' required />
                        </div>

                    </div>

                </div>

                <div>
                    <p className='mt-4 mb-2 font-medium text-gray-700'>About Doctor</p>
                    <textarea onChange={e => setAbout(e.target.value)} value={about} className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors' rows={5} placeholder='Write about doctor...' required></textarea>
                </div>

                <div className='mt-6'>
                    <p className='mb-3 font-medium text-gray-700'>Available Days & Time Slots</p>
                    <div className='border border-gray-300 rounded-lg p-4'>
                        {/* Days Selection */}
                        <div className='mb-4'>
                            <p className='text-sm font-medium text-gray-600 mb-2'>Select Days:</p>
                            <div className='flex flex-wrap gap-2'>
                                {daysOfWeek.map((day, index) => (
                                    <label
                                        key={index}
                                        className={`flex items-center gap-2 py-2 px-4 cursor-pointer rounded-lg border transition-all
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
                                <p className='text-sm font-medium text-gray-600 mb-3'>Set Time Slots for Selected Days:</p>
                                {selectedDays.map((day, dayIndex) => (
                                    <div key={dayIndex} className='mb-4 last:mb-0 border border-gray-200 rounded-lg p-3'>
                                        <div className='flex items-center justify-between mb-2'>
                                            <p className='font-semibold text-primary'>{day}</p>
                                            <button
                                                type='button'
                                                onClick={() => addTimeSlot(day)}
                                                className='text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded hover:bg-emerald-100 transition-colors'
                                            >
                                                + Add Slot
                                            </button>
                                        </div>
                                        {dayTimeSlots[day]?.map((slot, slotIndex) => (
                                            <div key={slotIndex} className='flex flex-wrap items-center gap-2 mb-3 p-2 bg-gray-50 rounded'>
                                                <div className='flex items-center gap-1'>
                                                    <select
                                                        value={slot.startHour}
                                                        onChange={(e) => updateTimeSlot(day, slotIndex, 'startHour', e.target.value)}
                                                        className='border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-primary w-16'
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
                                                        className='border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-primary w-16'
                                                    >
                                                        <option value='00'>00</option>
                                                        <option value='30'>30</option>
                                                    </select>
                                                    <select
                                                        value={slot.startPeriod}
                                                        onChange={(e) => updateTimeSlot(day, slotIndex, 'startPeriod', e.target.value)}
                                                        className='border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-primary w-16'
                                                    >
                                                        <option value='AM'>AM</option>
                                                        <option value='PM'>PM</option>
                                                    </select>
                                                </div>
                                                <span className='text-gray-500 font-medium'>to</span>
                                                <div className='flex items-center gap-1'>
                                                    <select
                                                        value={slot.endHour}
                                                        onChange={(e) => updateTimeSlot(day, slotIndex, 'endHour', e.target.value)}
                                                        className='border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-primary w-16'
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
                                                        className='border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-primary w-16'
                                                    >
                                                        <option value='00'>00</option>
                                                        <option value='30'>30</option>
                                                    </select>
                                                    <select
                                                        value={slot.endPeriod}
                                                        onChange={(e) => updateTimeSlot(day, slotIndex, 'endPeriod', e.target.value)}
                                                        className='border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-primary w-16'
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
                    {selectedDays.length > 0 && (
                        <p className='text-sm text-gray-500 mt-2'>
                            {selectedDays.length} day(s) selected
                        </p>
                    )}
                </div>

                <button type='submit' className='bg-gradient-to-r from-emerald-500 to-cyan-500 px-10 py-3 mt-6 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all'>Add Doctor</button>

            </div>


        </form>
    )
}

export default AddDoctor