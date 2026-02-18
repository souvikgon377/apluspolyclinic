import admin from 'firebase-admin';
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

// API for doctor Login 
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {
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
                            emailVerified: true,
                            displayName: doctor.name
                        });
                        console.log(`✅ Created doctor user in Firebase Auth: ${firebaseUser.uid}`);
                    } else {
                        throw error;
                    }
                }

                // Link Firebase UID to doctor account
                if (!doctor.firebaseUid || doctor.firebaseUid !== firebaseUser.uid) {
                    await doctorModel.findByIdAndUpdate(doctor._id, { firebaseUid: firebaseUser.uid });
                }

                // Set custom claims for doctor role
                await admin.auth().setCustomUserClaims(firebaseUser.uid, { role: 'doctor' });
                console.log(`✅ Doctor custom claims set for UID: ${firebaseUser.uid}`);

                // Create custom token
                const customToken = await admin.auth().createCustomToken(firebaseUser.uid, { role: 'doctor' });

                res.json({ 
                    success: true, 
                    message: 'Login successful',
                    customToken: customToken
                });
            } catch (firebaseError) {
                console.error('❌ Firebase error:', firebaseError);
                return res.json({ success: false, message: 'Failed to set doctor privileges' });
            }
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
        const { email, firebaseUid } = req.body;

        if (!email || !firebaseUid) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        // Check if doctor already exists
        let doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, message: 'Doctor account not found. Please contact admin to create your account first.' })
        }

        // Link Firebase UID to doctor account
        if (!doctor.firebaseUid) {
            await doctorModel.findByIdAndUpdate(doctor._id, { firebaseUid })
        }

        // Set custom claims for doctor role
        try {
            await admin.auth().setCustomUserClaims(firebaseUid, { role: 'doctor' });
            console.log(`✅ Doctor custom claims set for UID: ${firebaseUid} (Google Auth)`);
        } catch (claimError) {
            console.error('❌ Error setting custom claims:', claimError);
            return res.json({ success: false, message: 'Failed to set doctor privileges' });
        }
        
        res.json({ success: true, message: 'Google auth successful' })

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