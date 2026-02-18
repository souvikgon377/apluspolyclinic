# Admin & Doctor Login Troubleshooting Guide

## Overview
The admin and doctor login system uses Firebase Authentication combined with custom claims for role-based access control.

## Login Flow (Updated - February 18, 2026)

### 1. Admin Login
```
User enters credentials → Backend verifies admin credentials →
Backend creates/gets Firebase user → Sets custom claim (role: 'admin') →
Backend generates custom token → Frontend signs in with custom token →
Navigates to admin dashboard
```

### 2. Doctor Login (Email/Password)
```
User enters credentials → Backend verifies doctor in database →
Backend creates/gets Firebase user → Sets custom claim (role: 'doctor') →
Backend generates custom token → Frontend signs in with custom token →
Navigates to doctor dashboard
```

### 3. Doctor Login (Google)
```
User clicks Google Sign-In → Firebase Google auth →
Backend verifies doctor exists in database → Sets custom claim (role: 'doctor') →
Frontend refreshes token → Token includes doctor claim →
Navigates to doctor dashboard
```

## Recent Fixes (February 18, 2026 - Auth/Invalid-Credential Fix)

### Issue: Firebase auth/invalid-credential Error
**Problem**: Users couldn't log in because they didn't exist in Firebase Auth. The frontend tried to sign in with Firebase first, but the accounts only existed in the backend database.

**Root Cause**: 
- Admin credentials were stored in backend .env file, not in Firebase Auth
- Doctor accounts were created in database but not in Firebase Auth
- Login flow required Firebase authentication first, causing failures

**Solution**: 
- Changed login flow: Backend verifies credentials first
- Backend automatically creates Firebase users if they don't exist
- Backend generates custom tokens with role claims
- Frontend uses custom tokens to sign in to Firebase
- No more "auth/invalid-credential" errors

### Changes Made:

#### Frontend (admin/src/pages/Login.jsx)
- Changed from `signInWithEmailAndPassword` to `signInWithCustomToken`
- Backend verification happens first
- Uses custom tokens from backend to sign in
- Automatically handles users who don't exist in Firebase yet

#### Backend Controllers
- **Admin Login**: Creates Firebase user if doesn't exist, generates custom token
- **Doctor Login**: Creates Firebase user if doesn't exist, generates custom token
- Automatic Firebase account creation on first login
- Custom tokens include role claims immediately

#### Key Benefits:
1. ✅ Users don't need to exist in Firebase Auth beforehand
2. ✅ No more "auth/invalid-credential" errors
3. ✅ Seamless first-time login experience
4. ✅ Role claims included in custom tokens
5. ✅ Works for both admin and doctor accounts

## Common Issues & Solutions

### Issue 1: "Not Authorized - Admin access required"
**Cause**: Token doesn't have admin custom claim
**Solutions**:
1. Make sure you're using the correct admin credentials (check backend/.env)
2. Clear localStorage and login again
3. Check backend console for claim setting logs
4. Verify Firebase Admin SDK is properly initialized

### Issue 2: "Not Authorized - Doctor access required"
**Cause**: Token doesn't have doctor custom claim
**Solutions**:
1. Verify doctor account exists in database
2. Make sure Firebase UID is linked to doctor account
3. Clear localStorage and login again
4. Check backend console for claim setting logs

### Issue 3: "Doctor account not found"
**Cause**: Doctor trying to use Google Sign-In but account doesn't exist
**Solutions**:
1. Doctor account must be created by admin first
2. Use the same email address for Google Sign-In as in the doctor database
3. Contact admin to create doctor account if needed

### Issue 4: Token Expired or Invalid
**Cause**: Token stored in localStorage is expired
**Solutions**:
1. Clear localStorage: `localStorage.clear()`
2. Logout and login again
3. Check browser console for specific error messages

## Testing the Login Flow

### Test Admin Login
1. Open admin panel: `http://localhost:5174`
2. Select "Admin" tab
3. Enter admin credentials from backend/.env:
   - Email: `aplusclinicasansol@gmail.com`
   - Password: `Aplus@1977`
4. Click "Login"
5. Check backend console for: `✅ Admin custom claims set for UID: ...`
6. Should redirect to admin dashboard

### Test Doctor Login (Email/Password)
1. Doctor account must exist in database first
2. Open admin panel: `http://localhost:5174`
3. Select "Doctor" tab
4. Enter doctor credentials
5. Click "Login"
6. Check backend console for: `✅ Doctor custom claims set for UID: ...`
7. Should redirect to doctor dashboard

### Test Doctor Login (Google)
1. Doctor account must exist in database with matching email
2. Open admin panel: `http://localhost:5174`
3. Select "Doctor" tab
4. Click "Continue with Google"
5. Select Google account with same email as doctor account
6. Check backend console for: `✅ Doctor custom claims set for UID: ... (Google Auth)`
7. Should redirect to doctor dashboard

## Environment Variables

### Backend (.env)
```env
ADMIN_EMAIL=aplusclinicasansol@gmail.com
ADMIN_PASSWORD=Aplus@1977
```

### Admin Panel (.env)
```env
VITE_BACKEND_URL=http://localhost:4000
```

## Debugging Tips

1. **Open Browser Console** - Check for JavaScript errors
2. **Check Backend Logs** - Look for custom claim setting messages
3. **Inspect Token** - Use jwt.io to decode the token and check claims
4. **Clear Cache** - Clear localStorage and cookies
5. **Test Backend Directly** - Use Postman/Thunder Client to test API endpoints

## Token Structure

After successful login, the token should contain:
```json
{
  "iss": "https://securetoken.google.com/a-plus-polyclinic-asansol",
  "aud": "a-plus-polyclinic-asansol",
  "auth_time": 1708272000,
  "user_id": "firebase_uid_here",
  "sub": "firebase_uid_here",
  "iat": 1708272000,
  "exp": 1708275600,
  "email": "user@example.com",
  "email_verified": true,
  "role": "admin" // or "doctor"
}
```

The `role` claim is critical for authorization.

## Additional Notes

- Admin credentials are stored in environment variables (not in database)
- Doctor accounts are stored in Firestore/MongoDB
- Firebase UID links the Firebase Auth user to the doctor document
- Custom claims are set server-side only (security)
- Tokens expire after 1 hour and need to be refreshed
