import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import { FiEye, FiEyeOff } from 'react-icons/fi'

const ResetPassword = () => {
    const {token} = useParams()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: ""
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [error, setError] = useState("")
    const[success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const {name, value} = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError("")
        setSuccess("")

        if(!formData.newPassword || !formData.confirmPassword){
            setError("All fields are required")
            return
        }

        if(formData.newPassword.length < 8){
            setError("Password must be at least 8 characters")
            return
        }

        if(formData.newPassword !== formData.confirmPassword){
            setError("Passwords do not match")
            return
        }

        setLoading(true)

        try{
            const data = await api("/auth/reset-password", {
                method: "POST",
                body: JSON.stringify({
                    token,
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword
                })
            })

            setSuccess(data.message || "Password reset successfully")

            setTimeout(() => {
                navigate("/signin")
            }, 500)
        }catch(err){
            setError(err.message || err || "Unable to reset password")
        } finally {
            setLoading(false)
        }
    }
  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12'>
        <div className='w-full max-w-md'>
            <div className='mb-8 text-center'>
                <Link to={"/"} className='text-2xl font-bold text-slate-900'>
                    Auth {" "} 
                    
                    <span className='text-indigo-600'>App</span>
                </Link>

                <h1 className='mt-8 text-3xl font-semibold text-slate-900'>
                    Reset your password
                </h1>
                <p className='mt-2 text-sm text-slate-600'>
                    Create a new password for your account
                </p>
            </div>
            {
                error && (
                    <div className='mb-5 rounded-lg border border-red-200 bg-white px-4 py-3 text-red-600'>
                        {error}
                    </div>
                )
            }
            {
                success && (
                    <div className='mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-600'>
                        {success}
                    </div>
                )
            }

            <form onSubmit={handleSubmit} className='space-y-5'>
                <div>
                    <label htmlFor="newPassword" className='mb-2 block text-sm font-medium text-slate-700'>
                        New Password
                    </label>
                    <div className='relative'>
                        <input 
                            type={
                                showPassword ? "text" : "password"
                            }
                            id='newPassword'
                            name='newPassword'
                            value={formData.newPassword}
                            onChange={handleChange}
                            autoComplete='new-password'
                            className='w-full rounded-lg border border-slate-300 px-4 pr-20 py-3 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-indigo-100'
                            placeholder='Enter new password' 
                        />

                    <button 
                        type='button' 
                        onClick={() => setShowPassword(
                            (prev) => !prev
                        )}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-indigo-600'
                    >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                    </div>
                </div>

                <div>
                    <label htmlFor='confirmPassword' className='mb-2 block text-sm font-medium text-slate-700'>
                        Confirm password
                    </label>
                    <div className='relative'>
                        <input 
                            type={
                                showConfirmPassword ? "text" : "password"
                            }
                            id='confirmPassword'
                            name='confirmPassword'
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            autoComplete='new-password'
                            className='w-full rounded-lg border border-slate-300 px-4 py-3 pr-20 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                            placeholder='Confirm new password'
                        />

                    <button 
                        type='button' 
                        onClick={() => setShowConfirmPassword(
                            (prev) => !prev
                        )}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-indigo-600'
                    >
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                    </div>
                </div>

                <button 
                    type='submit'
                    disabled={loading}
                    className='w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60'
                >
                    {
                        loading ? "Resetting..." : "Reset password"
                    }
                </button>
            </form>
        </div>
    </div>
  )
}

export default ResetPassword