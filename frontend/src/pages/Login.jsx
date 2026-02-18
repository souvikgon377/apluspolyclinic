import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { auth, googleProvider } from '../config/firebase'
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

const Login = () => {

  const [state, setState] = useState('Sign Up')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)
  const isFirstRender = useRef(true)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === 'Sign Up') {
        // Create Firebase user first
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        
        // Get Firebase ID token
        const idToken = await user.getIdToken()

        // Register user in backend
        const { data } = await axios.post(backendUrl + '/api/user/register', { 
          name, 
          email, 
          password,
          firebaseUid: user.uid 
        })

        if (data.success) {
          localStorage.setItem('token', idToken)
          setToken(idToken)
        } else {
          toast.error(data.message)
        }

      } else {
        // Sign in with Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        
        // Get Firebase ID token
        const idToken = await user.getIdToken()

        // Login user in backend
        const { data } = await axios.post(backendUrl + '/api/user/login', { 
          email, 
          password,
          firebaseUid: user.uid 
        })

        if (data.success) {
          localStorage.setItem('token', idToken)
          setToken(idToken)
        } else {
          toast.error(data.message)
        }

      }
    } catch (error) {
      console.log(error)
      toast.error(error.message || 'Something went wrong. Please try again.')
    }

  }

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      // Get Firebase ID token
      const idToken = await user.getIdToken()

      // Send user info to backend
      const { data } = await axios.post(backendUrl + '/api/user/google-auth', {
        email: user.email,
        name: user.displayName,
        firebaseUid: user.uid
      })

      if (data.success) {
        localStorage.setItem('token', idToken)
        setToken(idToken)
        toast.success('Successfully signed in with Google')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error('Failed to sign in with Google')
    }
  }

  useEffect(() => {
    // Skip redirect on first render to allow user to see the login page
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    
    // Only redirect if token was just set (after login/signup)
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center overflow-x-hidden px-4'>
      <div className='flex flex-col gap-3 m-auto items-start p-6 sm:p-8 w-full max-w-md border rounded-xl text-[#5E5E5E] text-sm shadow-lg overflow-x-hidden'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>
        {state === 'Sign Up'
          ? <div className='w-full '>
            <p>Full Name</p>
            <input onChange={(e) => setName(e.target.value)} value={name} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="text" required />
          </div>
          : null
        }
        <div className='w-full '>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>
        <div className='w-full '>
          <p>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
        </div>
        <button type='submit' className='bg-gradient-to-r from-emerald-500 to-cyan-500 text-white w-full py-2 my-2 rounded-md text-base font-medium hover:shadow-lg transition-all'>{state === 'Sign Up' ? 'Create account' : 'Login'}</button>
        
        <div className='flex items-center w-full my-2'>
          <div className='flex-1 h-px bg-[#DADADA]'></div>
          <span className='px-3 text-xs text-gray-500'>OR</span>
          <div className='flex-1 h-px bg-[#DADADA]'></div>
        </div>

        <button 
          type='button'
          onClick={handleGoogleSignIn}
          className='flex items-center justify-center gap-3 w-full py-2 border border-[#DADADA] rounded-md text-sm sm:text-base hover:bg-gray-50 transition-colors overflow-hidden'
        >
          <svg className='flex-shrink-0' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.8055 10.2292C19.8055 9.55156 19.7499 8.86719 19.6319 8.19531H10.2V12.0491H15.6014C15.3773 13.2911 14.6571 14.3898 13.6153 15.0875V17.5864H16.8264C18.7132 15.8449 19.8055 13.2729 19.8055 10.2292Z" fill="#4285F4"/>
            <path d="M10.2 20.0006C12.9564 20.0006 15.2618 19.1151 16.8297 17.5865L13.6186 15.0876C12.7364 15.697 11.5832 16.0431 10.2033 16.0431C7.54094 16.0431 5.30275 14.2823 4.52025 11.917H1.22656V14.4927C2.83391 17.6794 6.33219 20.0006 10.2 20.0006Z" fill="#34A853"/>
            <path d="M4.51696 11.917C4.07739 10.675 4.07739 9.32824 4.51696 8.08625V5.51055H1.22656C-0.407854 8.76793 -0.407854 12.2353 1.22656 15.4927L4.51696 11.917Z" fill="#FBBC04"/>
            <path d="M10.2 3.95802C11.6552 3.93602 13.0579 4.47245 14.1137 5.45802L16.9568 2.61489C15.1734 0.938692 12.7321 -0.0162391 10.2 0.00576087C6.33219 0.00576087 2.83391 2.32696 1.22656 5.51052L4.51696 8.08622C5.29614 5.71458 7.53764 3.95802 10.2 3.95802Z" fill="#EA4335"/>
          </svg>
          <span className='whitespace-nowrap overflow-hidden text-ellipsis'>Continue with Google</span>
        </button>

        {state === 'Sign Up'
          ? <p className='break-words w-full'>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p>
          : <p className='break-words w-full'>Create an new account? <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login