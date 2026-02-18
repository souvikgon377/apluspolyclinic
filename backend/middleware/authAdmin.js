import admin from 'firebase-admin'

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const { authorization } = req.headers
        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.json({ success: false, message: 'Not Authorized Login Again' })
        }
        
        const token = authorization.split('Bearer ')[1]
        const decodedToken = await admin.auth().verifyIdToken(token)
        
        // Check if user has admin role (custom claim)
        if (decodedToken.role !== 'admin') {
            console.log(`⚠️ Auth failed: User ${decodedToken.uid} does not have admin role. Role: ${decodedToken.role || 'none'}`);
            return res.json({ success: false, message: 'Not Authorized - Admin access required' })
        }
        
        req.user = decodedToken
        next()
    } catch (error) {
        console.log('❌ Auth error:', error.message)
        res.json({ success: false, message: 'Authentication failed' })
    }
}

export default authAdmin;