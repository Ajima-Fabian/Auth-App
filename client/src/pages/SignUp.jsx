import PasswordInput from '../components/PasswordInput.jsx'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'

const SignUp = () => {

  const navigate = useNavigate()
  const [formData, setFromData] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const {name, value} = e.target

    setFromData((prev) => ({
      ...prev, [name]:value
    }))
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Basic frontend validation

    if(!formData.name || !formData.email || !formData.password){
      setError("All fields are required")
      return
    }

    if(formData.password.length < 8){
      setError("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)

    try{
      const data = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify(formData)
      })

      setSuccess(
        data.message || "Account created successfully"
      )

      // Clear form
      setFromData({
        name: "",
        email: "",
        password: ""
      })

      setTimeout(() => {
        navigate("/signin")
      },500)
    } catch (err){
        setError(
          err.message|| err || "Something went wrong, Please try again."
        )
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12'>
      <div className='w-full max-w-md'>

        {/* Header */}

        <div className='mb-8 text-center'>
          <Link to={"/"} className='text-2xl font-bold text-slate-900'>
            Auth <span className='text-indigo-600'>App</span>
          </Link>

          <h1 className='mt-8 text-3xl font-bold text-slate-900'>
            Create your account
          </h1>
          <p className='mt-2 text-sm text-slate-600'>
            Create an account to get started with AuthApp
          </p>
        </div>

        {/* Card */}

        <div className='rounded-2xl border border-slate-200 bg-white p-8 shadow-sm'>

          {/* Error */}
        {
          error && (
            <div className='mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-400'>
              {error}
            </div>
          )
        }
          {/* Success */}
        {
          success && (
            <div className='mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600'>
              {success}
            </div>
          )
        }

          <form className='space-y-5' onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className='mb-2 block text-sm font-medium text-slate-700'>Full name</label>
              <input
               type="text" 
               id='name'
               value={formData.name}
               onChange={handleChange}
               name='name'
               autoComplete='name'
               placeholder='John Doe'
               className='w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
               />
            </div>

            <div>
              <label htmlFor="email" className='mb-2 block text-sm font-medium text-slate-700'>Email address</label>
              <input
               type="text" 
               id='email'
               name='email'
               value={formData.email}
               onChange={handleChange}
               autoComplete='email'
               placeholder='you@example.com'
               className='w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
               />
            </div>

            <div>
              <label htmlFor="password" className='mb-2 block text-sm font-medium text-slate-700'>Password</label>
              <PasswordInput 
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="Create a password"
                disabled={loading}
              />
            </div>

            <button type='submit' disabled={loading} className='w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700'>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
          
          <p className='mt-6 text-center text-sm text-slate-600'>
            Already have an account?{""}
            <Link to={"/signin"} className='font-semibold text-indigo-600 hover:text-indigo-700'>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp