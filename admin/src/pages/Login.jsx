import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'
import { auth, googleProvider } from '../config/firebase'
import { signInWithPopup, signInWithCustomToken } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [state, setState] = useState('Admin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      setIsLoading(true)
      if (state === 'Admin') {
        // For admin, verify with backend first
        const { data } = await axios.post(backendUrl + '/api/admin/login', { 
          email, 
          password
        })
        
        if (data.success) {
          // Use the custom token from backend to sign in to Firebase
          if (data.customToken) {
            const userCredential = await signInWithCustomToken(auth, data.customToken)
            const user = userCredential.user
            const firebaseToken = await user.getIdToken()
            
            setAToken(firebaseToken)
            sessionStorage.setItem('aToken', firebaseToken)
          } else {
            // Fallback: if backend doesn't provide custom token, use the token from backend
            setAToken(data.token)
            sessionStorage.setItem('aToken', data.token)
          }
          
          toast.success('Admin login successful')
          navigate('/admin-dashboard')
        } else {
          toast.error(data.message)
        }

      } else {
        // For doctor, verify with backend first
        const { data } = await axios.post(backendUrl + '/api/doctor/login', { 
          email, 
          password
        })
        
        if (data.success) {
          // Use the custom token from backend to sign in to Firebase
          if (data.customToken) {
            const userCredential = await signInWithCustomToken(auth, data.customToken)
            const user = userCredential.user
            const firebaseToken = await user.getIdToken()
            
            setDToken(firebaseToken)
            sessionStorage.setItem('dToken', firebaseToken)
          } else {
            // Fallback: if backend doesn't provide custom token, use the token from backend
            setDToken(data.token)
            sessionStorage.setItem('dToken', data.token)
          }
          
          toast.success('Doctor login successful')
          navigate('/doctor-dashboard')
        } else {
          toast.error(data.message)
        }
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message || 'Failed to sign in')
    } finally {
      setIsLoading(false)
    }

  }

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true)
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      if (state === 'Doctor') {
        // Send doctor info to backend for Google auth
        const { data } = await axios.post(backendUrl + '/api/doctor/google-auth', {
          email: user.email,
          name: user.displayName,
          firebaseUid: user.uid
        })

        if (data.success) {
          // Get fresh token with custom claims
          const firebaseToken = await user.getIdToken(true)
          
          setDToken(firebaseToken)
          sessionStorage.setItem('dToken', firebaseToken)
          toast.success('Successfully signed in with Google')
          navigate('/doctor-dashboard')
        } else {
          toast.error(data.message)
        }
      } else {
        toast.error('Google Sign-In is only available for Doctor login')
      }

    } catch (error) {
      console.log(error)
      toast.error('Failed to sign in with Google')
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto mb-2'>Login</p>
        
        {/* Role Selection Tabs */}
        <div className='w-full flex gap-2 mb-4'>
          <button
            type='button'
            onClick={() => setState('Admin')}
            className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
              state === 'Admin'
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Admin
          </button>
          <button
            type='button'
            onClick={() => setState('Doctor')}
            className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
              state === 'Doctor'
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Doctor
          </button>
        </div>

        <div className='w-full '>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>
        <div className='w-full '>
          <p>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
        </div>
        <button 
          type='submit'
          disabled={isLoading}
          className='bg-gradient-to-r from-emerald-500 to-cyan-500 text-white w-full py-2 rounded-md text-base font-medium hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2'
        >
          {isLoading && (
            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
          )}
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        
        {state === 'Doctor' && (
          <>
            <div className='flex items-center w-full my-2'>
              <div className='flex-1 h-px bg-[#DADADA]'></div>
              <span className='px-3 text-xs text-gray-500'>OR</span>
              <div className='flex-1 h-px bg-[#DADADA]'></div>
            </div>

            <button 
              type='button'
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className='flex items-center justify-center gap-3 w-full py-2 border border-[#DADADA] rounded-md text-base hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
            >
              {isGoogleLoading ? (
                <div className='w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin'></div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.8055 10.2292C19.8055 9.55156 19.7499 8.86719 19.6319 8.19531H10.2V12.0491H15.6014C15.3773 13.2911 14.6571 14.3898 13.6153 15.0875V17.5864H16.8264C18.7132 15.8449 19.8055 13.2729 19.8055 10.2292Z" fill="#4285F4"/>
                  <path d="M10.2 20.0006C12.9564 20.0006 15.2618 19.1151 16.8297 17.5865L13.6186 15.0876C12.7364 15.697 11.5832 16.0431 10.2033 16.0431C7.54094 16.0431 5.30275 14.2823 4.52025 11.917H1.22656V14.4927C2.83391 17.6794 6.33219 20.0006 10.2 20.0006Z" fill="#34A853"/>
                  <path d="M4.51696 11.917C4.07739 10.675 4.07739 9.32824 4.51696 8.08625V5.51055H1.22656C-0.407854 8.76793 -0.407854 12.2353 1.22656 15.4927L4.51696 11.917Z" fill="#FBBC04"/>
                  <path d="M10.2 3.95802C11.6552 3.93602 13.0579 4.47245 14.1137 5.45802L16.9568 2.61489C15.1734 0.938692 12.7321 -0.0162391 10.2 0.00576087C6.33219 0.00576087 2.83391 2.32696 1.22656 5.51052L4.51696 8.08622C5.29614 5.71458 7.53764 3.95802 10.2 3.95802Z" fill="#EA4335"/>
                </svg>
              )}
              {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
            </button>
          </>
        )}
      </div>
    </form>
  )
}

export default Login