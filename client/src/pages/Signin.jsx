import {Link, useNavigate} from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../lib/api.js'
import PasswordInput from '../components/PasswordInput.jsx'

const Signin = () => {
  const {getMe} = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isloading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const {name, value} = e.target

    setFormData((prev) => ({
      ...prev, [name]:value
    }))
  }

   const handleSubmit = async(e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Basic frontend validation
    if(!formData.email || !formData.password){
      setError("Email and password are required")
      return
    }

    if(formData.password.length < 8){
      setError("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)

    try{
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(formData)
      })
      
      await getMe()

      setSuccess(
        data.message || "Login successful"
      )

      // Clear form
      setFormData({
        email: "",
        password: ""
      })

      setTimeout(() => {
        navigate("/dashboard")
      },500)
    } catch (err){
        console.log("Login failed", err)
        setError(
          err?.data?.message || err?.message || err ||"Something went wrong, Please try again."
        )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12'>
      <div className='w-full max-w-md'>
        <div className='mb-8 text-center'>
          <Link to={"/"} className='text-2xl font-bold text-slate-900'>
            Auth
            <span className='text-indigo-600'>
              App
            </span>
          </Link>

          <h1 className='mt-8 text-3xl font-bold text-slate-900'>
            Welcome back
          </h1>

          <p className='mt-2 text-slate-600'>
            Sign in to continue to your account
          </p>
        </div>

        <div className='rounded-2xl border border-slate-200 bg-white p-8 shadow-sm'>

          {/* Error */}

          {
          error && (
            <div className='mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-400'>
              {error}
            </div>
          )
        }

        {/* success */}

           {
          success && (
            <div className='mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600'>
              {success}
            </div>
          )
        }

          <form className='space-y-5'onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email" className='mb-2 block text-sm font-medium text-slate-700'>Email address</label>
              <input
               type="email"
               value={formData.email}
               onChange={handleChange}
               id='email'
               name='email'
               autoComplete='email'
               placeholder='you@example.com'
               className='w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
               />
            </div>

             <div>
             <div className='mb-2 flex justify-between'>
               <label htmlFor="password" className='mb-2 block text-sm font-medium text-slate-700'>Password</label>
               <Link to={"/forgot-password"} className='text-sm font-medium text-indigo-600 hover:text-indigo-700'>
                forgot password?
               </Link>
             </div>
              <PasswordInput 
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                placeholder="Enter your password"
                disabled={isloading}
              />
            </div>
              <button type='submit' disabled={isloading} className='w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-700'>
                {isloading ? "Signing in..." : "Sign In"}
              </button>
          </form>

          <p className='mt-6 text-center text-sm text-slate-600'>
            Don't have an account? {""}
            <Link to={"/register"} className='font-semibold text-indigo-600 hover:text-indigo-700'>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signin