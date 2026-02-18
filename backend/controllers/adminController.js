import admin from 'firebase-admin';
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";

// API for admin login - Verify credentials and set custom claims
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            try {
                // Create or get Firebase user
                let firebaseUser;
                try {
                    firebaseUser = await admin.auth().getUserByEmail(email);
                } catch (error) {
                    if (error.code === 'auth/user-not-found') {
                        // Create user in Firebase Auth
                        firebaseUser = await admin.auth().createUser({
                            email: email,
                            password: password,
                            emailVerified: true
                        });
                        console.log(`✅ Created admin user in Firebase Auth: ${firebaseUser.uid}`);
                    } else {
                        throw error;
                    }
                }

                // Set custom claims for admin role
                await admin.auth().setCustomUserClaims(firebaseUser.uid, { role: 'admin' });
                console.log(`✅ Admin custom claims set for UID: ${firebaseUser.uid}`);

                // Create custom token
                const customToken = await admin.auth().createCustomToken(firebaseUser.uid, { role: 'admin' });

                res.json({ 
                    success: true, 
                    message: 'Admin verified successfully',
                    customToken: customToken
                });
            } catch (firebaseError) {
                console.error('❌ Firebase error:', firebaseError);
                return res.json({ success: false, message: 'Failed to set admin privileges' });
            }
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}


// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true }, { runValidators: false })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for marking appointment completed
const appointmentComplete = async (req, res) => {
    try {

        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true }, { runValidators: false })

        res.json({ success: true, message: 'Appointment Completed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for adding Doctor
const addDoctor = async (req, res) => {

    try {

        const { name, email, password, speciality, degree, experience, about, fees, address, availability } = req.body
        const imageFile = req.file

        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees) {
            return res.json({ success: false, message: "Missing Details" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary or use placeholder
        let imageUrl = 'https://via.placeholder.com/150'
        try {
            if (imageFile) {
                const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
                imageUrl = imageUpload.secure_url
            }
        } catch (cloudinaryError) {
            console.log('Cloudinary upload failed, using placeholder:', cloudinaryError.message)
        }

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality: JSON.parse(speciality),
            degree,
            experience,
            about,
            fees,
            availability: availability ? JSON.parse(availability) : [],
            address: address ? JSON.parse(address) : { line1: '', line2: '' },
            date: Date.now()
        }

        await doctorModel.create(doctorData)
        res.json({ success: true, message: 'Doctor Added' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password')
        
        // Normalize speciality data to ensure it's always an array
        const normalizedDoctors = doctors.map(doctor => {
            const docObj = { ...doctor }
            let speciality = docObj.speciality
            
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
            
            return docObj
        })
        
        res.json({ success: true, doctors: normalizedDoctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        // Calculate total income from completed appointments
        const totalIncome = appointments
            .filter(app => app.isCompleted && !app.cancelled)
            .reduce((sum, app) => sum + (Number(app.amount) || 0), 0)

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            totalIncome,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to delete doctor
const deleteDoctor = async (req, res) => {
    try {
        const { docId } = req.body

        // Check if doctor exists
        const doctor = await doctorModel.findById(docId)
        if (!doctor) {
            return res.json({ success: false, message: 'Doctor not found' })
        }

        // Delete all appointments related to this doctor
        await appointmentModel.deleteMany({ docId })

        // Delete the doctor
        await doctorModel.findByIdAndDelete(docId)

        res.json({ success: true, message: 'Doctor removed successfully' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to upload prescription for an appointment
const uploadPrescription = async (req, res) => {
    try {
        const { appointmentId, followUpDate } = req.body
        const prescriptionFile = req.file

        if (!appointmentId || !prescriptionFile) {
            return res.json({ success: false, message: "Missing Details" })
        }

        // Upload prescription to cloudinary
        const imageUpload = await cloudinary.uploader.upload(prescriptionFile.path, { resource_type: "image" })
        const prescriptionUrl = imageUpload.secure_url

        // Update appointment with prescription URL and follow-up date
        const updateData = { prescription: prescriptionUrl }
        if (followUpDate) {
            updateData.followUpDate = followUpDate
        }
        await appointmentModel.findByIdAndUpdate(appointmentId, updateData)

        res.json({ success: true, message: 'Prescription uploaded successfully' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all patients with their prescription history
const getAllPatients = async (req, res) => {
    try {
        // Get all users
        const users = await userModel.find({})

        // For each user, get their appointments and prescription history
        const patientsData = await Promise.all(users.map(async (user) => {
            // Get all appointments for this user
            const appointments = await appointmentModel.find({ userId: user._id })
            
            // Get appointments with prescriptions (last 5)
            const prescriptions = appointments
                .filter(app => app.prescription && app.isCompleted && !app.cancelled)
                .sort((a, b) => b.date - a.date)
                .slice(0, 5)
                .map(app => ({
                    docName: app.docData.name,
                    docImage: app.docData.image,
                    speciality: app.docData.speciality,
                    date: app.slotDate,
                    time: app.slotTime,
                    amount: app.amount,
                    prescriptionUrl: app.prescription,
                    followUpDate: app.followUpDate
                }))

            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                image: user.image,
                dob: user.dob,
                gender: user.gender,
                address: user.address,
                totalAppointments: appointments.length,
                prescriptions: prescriptions
            }
        }))

        // Sort by total appointments (most active patients first)
        patientsData.sort((a, b) => b.totalAppointments - a.totalAppointments)

        res.json({ success: true, patients: patientsData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to delete all patients (users) and their appointments
const deleteAllPatients = async (req, res) => {
    try {
        // Get all user IDs first
        const users = await userModel.find({})
        const userIds = users.map(user => user._id)
        
        // Delete all appointments for these users (includes prescriptions)
        const appointmentsResult = await appointmentModel.deleteMany({ userId: { $in: userIds } })
        
        // Delete all patients
        const patientsResult = await userModel.deleteMany({})
        
        res.json({ 
            success: true, 
            message: `Deleted ${patientsResult.deletedCount} patients and ${appointmentsResult.deletedCount} appointments successfully` 
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    appointmentComplete,
    addDoctor,
    allDoctors,
    adminDashboard,
    deleteDoctor,
    uploadPrescription,
    getAllPatients,
    deleteAllPatients
}