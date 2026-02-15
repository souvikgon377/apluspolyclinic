import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

// API for doctor Login 
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await doctorModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for Google login/register for doctor
const googleAuthDoctor = async (req, res) => {
    try {
        const { email, name, googleId } = req.body;

        if (!email || !name) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        // Check if doctor already exists
        let doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, message: 'Doctor account not found. Please contact admin to create your account first.' })
        }

        // Update password with Google ID if not already using Google auth
        if (doctor.password && !doctor.password.includes('google_')) {
            const hashedPassword = await bcrypt.hash('google_' + googleId + process.env.JWT_SECRET, 10)
            await doctorModel.findByIdAndUpdate(doctor._id, { password: hashedPassword })
        }

        const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {

        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true }, { runValidators: false })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true }, { runValidators: false })
            return res.json({ success: true, message: 'Appointment Completed' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        
        // Normalize speciality data to ensure it's always an array
        const normalizedDoctors = doctors.map(doctor => {
            // Firestore returns plain objects, no need for .toObject()
            let speciality = doctor.speciality
            
            // If speciality is a string, try to parse it as JSON
            if (typeof speciality === 'string') {
                try {
                    const parsed = JSON.parse(speciality)
                    if (Array.isArray(parsed)) {
                        doctor.speciality = parsed
                    } else {
                        doctor.speciality = [speciality]
                    }
                } catch {
                    // Not JSON, wrap as single item array
                    doctor.speciality = [speciality]
                }
            } else if (!Array.isArray(speciality)) {
                // Fallback to empty array if neither string nor array
                doctor.speciality = []
            }
            
            return doctor
        })
        
        res.json({ success: true, doctors: normalizedDoctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor profile for  Doctor Panel
const doctorProfile = async (req, res) => {
    try {

        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        if (profileData) {
            // Firestore returns plain objects, no need for .toObject()
            const docObj = { ...profileData }
            let speciality = docObj.speciality
            
            // Normalize speciality to ensure it's always an array
            if (typeof speciality === 'string') {
                try {
                    const parsed = JSON.parse(speciality)
                    if (Array.isArray(parsed)) {
                        docObj.speciality = parsed
                    } else {
                        docObj.speciality = [speciality]
                    }
                } catch {
                    docObj.speciality = [speciality]
                }
            } else if (!Array.isArray(speciality)) {
                docObj.speciality = []
            }
            
            res.json({ success: true, profileData: docObj })
        } else {
            res.json({ success: false, message: 'Doctor not found' })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update doctor profile data from  Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {

        const { docId, fees, address, available, about, availability } = req.body

        const updateData = { fees, address, available }
        
        // Add optional fields if provided
        if (about !== undefined) updateData.about = about
        if (availability !== undefined) updateData.availability = availability

        await doctorModel.findByIdAndUpdate(docId, updateData)

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {

        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += Number(item.amount) || 0
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginDoctor,
    googleAuthDoctor,
    appointmentsDoctor,
    appointmentCancel,
    doctorList,
    changeAvailablity,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile
}