import axios from "axios";
import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";


export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [aToken, setAToken] = useState(sessionStorage.getItem('aToken') ? sessionStorage.getItem('aToken') : '')

    const [appointments, setAppointments] = useState([])
    const [doctors, setDoctors] = useState([])
    const [dashData, setDashData] = useState(false)

    // Sync token with sessionStorage
    useEffect(() => {
        if (aToken) {
            sessionStorage.setItem('aToken', aToken)
        } else {
            sessionStorage.removeItem('aToken')
        }
    }, [aToken])

    // Getting all Doctors data from Database using API
    const getAllDoctors = useCallback(async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', { headers: { authorization: 'Bearer ' + aToken } })
            
            if (data.success) {
                setDoctors(data.doctors || [])
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error fetching doctors:', error)
            toast.error(error.message)
        }
    }, [aToken, backendUrl])

    // Function to change doctor availablity using API
    const changeAvailability = useCallback(async (docId) => {
        try {

            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { authorization: 'Bearer ' + aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }, [aToken, backendUrl, getAllDoctors])


    // Getting all appointment data from Database using API
    const getAllAppointments = useCallback(async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { authorization: 'Bearer ' + aToken } })
            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }, [aToken, backendUrl])

    // Function to cancel appointment using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { authorization: 'Bearer ' + aToken } })

            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
                getDashData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Function to mark appointment as completed using API
    const completeAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/admin/complete-appointment', { appointmentId }, { headers: { authorization: 'Bearer ' + aToken } })

            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
                getDashData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Getting Admin Dashboard data from Database using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { authorization: 'Bearer ' + aToken } })

            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    // Function to remove doctor using API
    const removeDoctor = async (docId) => {
        try {

            const { data } = await axios.post(backendUrl + '/api/admin/delete-doctor', { docId }, { headers: { authorization: 'Bearer ' + aToken } })

            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value = {
        aToken, 
        setAToken,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        getAllAppointments,
        getDashData,
        cancelAppointment,
        completeAppointment,
        dashData,
        removeDoctor
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider