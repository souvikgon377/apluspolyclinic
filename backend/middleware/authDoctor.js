import admin from 'firebase-admin'
import doctorModel from '../models/doctorModel.js'

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
    try {
        const { authorization } = req.headers
        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        
        const token = authorization.split('Bearer ')[1]
        const decodedToken = await admin.auth().verifyIdToken(token)
        
        // Check if user has doctor role
        if (decodedToken.role !== 'doctor') {
            console.log(`⚠️ Auth failed: User ${decodedToken.uid} does not have doctor role. Role: ${decodedToken.role || 'none'}`);
            return res.json({ success: false, message: 'Not Authorized - Doctor access required' })
        }
        
        // Find doctor by Firebase UID and get their MongoDB ID
        const doctor = await doctorModel.findOne({ firebaseUid: decodedToken.uid })
        if (!doctor) {
            console.log(`⚠️ Doctor not found for UID: ${decodedToken.uid}`);
            return res.json({ success: false, message: 'Doctor not found' })
        }
        
        req.body.docId = doctor._id
        req.user = decodedToken
        next()
    } catch (error) {
        console.log('❌ Auth error:', error.message)
        res.json({ success: false, message: 'Authentication failed' })
    }
}

export default authDoctor;