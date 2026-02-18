import admin from 'firebase-admin'
import userModel from '../models/userModel.js'

// user authentication middleware
const authUser = async (req, res, next) => {
    try {
        const { authorization } = req.headers
        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        
        const token = authorization.split('Bearer ')[1]
        const decodedToken = await admin.auth().verifyIdToken(token)
        
        // Find user by Firebase UID and get their MongoDB ID
        const user = await userModel.findOne({ firebaseUid: decodedToken.uid })
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }
        
        req.body.userId = user._id
        req.user = decodedToken
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Authentication failed' })
    }
}

export default authUser;