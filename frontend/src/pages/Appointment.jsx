import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'
import { displaySpeciality, parseSpeciality } from '../lib/helpers'

const Appointment = () => {

    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctosData, userData } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [docInfo, setDocInfo] = useState(false)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')

    const navigate = useNavigate()

    // Helper function to get first speciality
    const getFirstSpeciality = (spec) => {
        if (Array.isArray(spec)) return spec[0]
        if (typeof spec === 'string') {
            try {
                const parsed = JSON.parse(spec)
                return Array.isArray(parsed) ? parsed[0] : spec
            } catch {
                return spec
            }
        }
        return ''
    }

    const fetchDocInfo = async () => {
        const docInfo = doctors.find((doc) => doc._id === docId)
        setDocInfo(docInfo)
    }

    // Parse doctor's availability schedule
    const getDoctorSchedule = () => {
        const schedule = {}
        const dayMap = {
            'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
            'Thursday': 4, 'Friday': 5, 'Saturday': 6
        }

        if (!docInfo.availability || docInfo.availability.length === 0) {
            // Default schedule if not set (10 AM - 9 PM all days)
            return null
        }

        docInfo.availability.forEach(slot => {
            // Parse format: "Monday: 09:00 - 17:00"
            const match = slot.match(/^(\w+):\s*(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/)
            if (match) {
                const [, day, startTime, endTime] = match
                const dayIndex = dayMap[day]
                if (dayIndex !== undefined) {
                    if (!schedule[dayIndex]) {
                        schedule[dayIndex] = []
                    }
                    schedule[dayIndex].push({ startTime, endTime })
                }
            }
        })

        return schedule
    }

    const getAvailableSolts = async () => {

        setDocSlots([])

        const doctorSchedule = getDoctorSchedule()

        // getting current date
        let today = new Date()

        for (let i = 0; i < 7; i++) {

            // getting date with index 
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            const dayOfWeek = currentDate.getDay()

            // Check if doctor works on this day
            let workingHours = null
            if (doctorSchedule && doctorSchedule[dayOfWeek]) {
                workingHours = doctorSchedule[dayOfWeek]
            } else if (!doctorSchedule) {
                // Default hours if no schedule set
                workingHours = [{ startTime: '10:00', endTime: '21:00' }]
            } else {
                // Doctor doesn't work on this day
                setDocSlots(prev => ([...prev, []]))
                continue
            }

            let timeSlots = []

            // Generate slots for each working period
            workingHours.forEach(({ startTime, endTime }) => {
                let slotDate = new Date(currentDate)
                const [startHour, startMinute] = startTime.split(':').map(Number)
                const [endHour, endMinute] = endTime.split(':').map(Number)

                slotDate.setHours(startHour, startMinute, 0, 0)

                let endDateTime = new Date(currentDate)
                endDateTime.setHours(endHour, endMinute, 0, 0)

                // If it's today, start from current time or scheduled start, whichever is later
                if (today.getDate() === currentDate.getDate() && today.getMonth() === currentDate.getMonth()) {
                    let now = new Date()
                    now.setHours(now.getHours() + 1)
                    now.setMinutes(now.getMinutes() > 30 ? 30 : 0)
                    if (now > slotDate) {
                        slotDate = now
                    }
                }

                while (slotDate < endDateTime) {
                    let formattedTime = slotDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                    let day = currentDate.getDate()
                    let month = currentDate.getMonth() + 1
                    let year = currentDate.getFullYear()

                    const slotDateKey = day + "_" + month + "_" + year
                    const slotTime = formattedTime

                    const isSlotAvailable = docInfo.slots_booked[slotDateKey] && docInfo.slots_booked[slotDateKey].includes(slotTime) ? false : true

                    if (isSlotAvailable) {
                        // Add slot to array
                        timeSlots.push({
                            datetime: new Date(slotDate),
                            time: formattedTime
                        })
                    }

                    // Increment current time by 30 minutes
                    slotDate.setMinutes(slotDate.getMinutes() + 30)
                }
            })

            setDocSlots(prev => ([...prev, timeSlots]))
        }

    }

    const bookAppointment = async () => {

        if (!token) {
            toast.warning('Login to book appointment')
            return navigate('/login')
        }

        // Check if user has updated phone and gender
        if (!userData || userData.phone === '000000000' || userData.gender === 'Not Selected') {
            toast.warning('Please update your mobile number and gender in your profile before booking an appointment')
            return navigate('/my-profile')
        }

        const date = docSlots[slotIndex][0].datetime

        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()

        const slotDate = day + "_" + month + "_" + year

        try {

            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
                getDoctosData()
                navigate('/my-appointments')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    useEffect(() => {
        if (doctors.length > 0) {
            fetchDocInfo()
        }
    }, [doctors, docId])

    useEffect(() => {
        if (docInfo) {
            getAvailableSolts()
        }
    }, [docInfo])

    return docInfo ? (
        <div>

            {/* ---------- Doctor Details ----------- */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div className='w-full sm:max-w-72'>
                    <div className='aspect-square w-full overflow-hidden bg-primary rounded-lg'>
                        <img className='w-full h-full object-cover' src={docInfo.image} alt="" />
                    </div>
                </div>

                <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>

                    {/* ----- Doc Info : name, degree, experience ----- */}

                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{docInfo.name} <img className='w-5' src={assets.verified_icon} alt="" /></p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{docInfo.degree} - {displaySpeciality(docInfo.speciality)}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
                    </div>

                    {/* ----- Doc About ----- */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>About <img className='w-3' src={assets.info_icon} alt="" /></p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{docInfo.about}</p>
                    </div>

                    <p className='text-gray-600 font-medium mt-4'>Appointment fee: <span className='text-gray-800'>{currencySymbol}{docInfo.fees}</span> </p>
                </div>
            </div>

            {/* Booking slots */}
            <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]'>
                <p >Booking slots</p>
                <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                    {docSlots.length && docSlots.map((item, index) => {
                        const date = new Date()
                        date.setDate(date.getDate() + index)
                        const hasSlots = item.length > 0
                        
                        return (
                            <div 
                                onClick={() => hasSlots && setSlotIndex(index)} 
                                key={index} 
                                className={`text-center py-6 min-w-16 rounded-full ${
                                    hasSlots ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                                } ${
                                    slotIndex === index && hasSlots ? 'bg-primary text-white' : 'border border-[#DDDDDD]'
                                }`}
                            >
                                <p>{daysOfWeek[date.getDay()]}</p>
                                <p>{date.getDate()}</p>
                                {!hasSlots && <p className='text-xs mt-1'>Unavailable</p>}
                            </div>
                        )
                    })}
                </div>

                <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4 min-h-[50px]'>
                    {docSlots.length && docSlots[slotIndex].length > 0 ? (
                        docSlots[slotIndex].map((item, index) => (
                            <p onClick={() => setSlotTime(item.time)} key={index} className={`text-sm font-light  flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-[#949494] border border-[#B4B4B4]'}`}>{item.time.toLowerCase()}</p>
                        ))
                    ) : (
                        <p className='text-gray-500 text-sm'>Doctor is not available on this day</p>
                    )}
                </div>

                {docSlots.length && docSlots[slotIndex].length > 0 && (
                    <button onClick={bookAppointment} className='bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-sm font-medium px-20 py-3 rounded-full my-6 hover:shadow-lg hover:scale-105 transition-all duration-300'>Book an appointment</button>
                )}
            </div>

            {/* Listing Releated Doctors */}
            <RelatedDoctors speciality={getFirstSpeciality(docInfo.speciality)} docId={docId} />
        </div>
    ) : null
}

export default Appointment