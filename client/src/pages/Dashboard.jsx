import {
    FiActivity,
    FiClock,
    FiEdit,
    FiLock,
    FiMail,
    FiShield,
    FiUser,
    FiX
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext.jsx'
import { useState } from 'react'
import { api } from '../lib/api.js'
import PasswordInput from '../components/PasswordInput.jsx'
import {useNavigate} from "react-router-dom"

const Dashboard = () => {
    const { loading, user, sessions,updateProfile, clearUser } = useAuth()

    const navigate = useNavigate()

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [passwordError, setPasswordError] = useState({})
    const [passwordSuccess, setPasswordSuccess] = useState("")
    const [changePassword, setPasswordChange] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: ""
    })
    const [fieldErrors, setFieldErrors] = useState({})
    const [formError, setFormError] = useState("")
    const [success, setSuccess] = useState("")
    const [saving, setSaving] = useState(false)


    const getFieldErrors = (error) => {
        if (!error.data?.errors) {
            return {}
        }

        return Object.fromEntries(
            error.data.errors.map(({ field, message }) => [field, message])
        )
    }


    const handleEditProfile = () => {
        setFormData({
            name: user?.name || "",
            email: user?.email || ""
        })

        setFieldErrors({})
        setFormError("")
        setSuccess("")
        setIsEditing(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev, [name]: value
        }))
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target

        setPasswordData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleOpenPasswordModal = () => {
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        })

        setPasswordError("")
        setPasswordSuccess("")
        setIsPasswordModalOpen(true)
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()

        setPasswordError("")
        setPasswordSuccess("")

        if (
            !passwordData.newPassword ||
            !passwordData.currentPassword ||
            !passwordData.confirmPassword
        ) {
            setPasswordError("All password fields are required")
            return
        }

        if (passwordData.newPassword.length < 8) {
            setPasswordError("New password must be at least 8 characters")
            return
        }


        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("New passwords do not match")
            return
        }

        setPasswordChange(true)

        try {
            const data = await api("/auth/password", {
                method: "PUT",
                body: JSON.stringify(passwordData)
            })
            setPasswordSuccess(data.message)

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            })

            setTimeout(() => {
                setIsPasswordModalOpen(false)
                setPasswordSuccess("")
                clearUser()
                navigate("/signin", {replace: true})
            }, 1200)
            
        } catch (err) {
            setPasswordError(err.message || err || "Something went wrong")
        } finally {
            setPasswordChange(false)
            //     setPasswordData({
            //     newPassword: "",
            //     currentPassword: "",
            //     confirmPassword: ""
            // })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setFieldErrors({})
        setFormError("")
        setSuccess("")
        setSaving(true)

        try {
            const data = await updateProfile({
                name: formData.name,
                email: formData.email
            })

            setSuccess(data.message || "Profile updated successfully")

            setIsEditing(false)

        } catch (err) {
            const errors = getFieldErrors(err)

            if (Object.keys(errors).length > 0) {
                setFieldErrors(errors)
            } else {
                setFormError(err.message || err || "Failed to update profile")
            }
        } finally {
            setSaving(false)
        }
    }
    if (loading) {
        return (
            <main className='flex min-h-[calc(100vh - 4rem)] items-center justify-center bg-slate-50'>
                <p className=' text-sm font-medium text-slate-500'>
                    Loading dashboard...
                </p>
            </main>
        )
    }

    const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
    }) : "Unknown"

    const lastLoginAt = user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "First Login"

    return (
        <main className='min-h-[calc(100vh-4rem)] bg-slate-50'>
            <div className='mx-auto max-w-7xl px-6 py-10 lg:px-8'>

                {/* Welcome */}

                <section className='mb-8'>
                    <p className='text-sm font-semibold uppercase tracking-wider text-indigo-600'>
                        Dashboard
                    </p>
                    <h1 className='mt-2 text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl'>
                        Hello, {user?.name}
                    </h1>
                    <p className='mt-3 text-slate-600'>
                        Manage your account and keep track of your security.
                    </p>
                </section>

                {/* User summary */}

                <section className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8'>
                    <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='flex items-center gap-4'>

                            {/* Avatar */}

                            <div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white'>
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className='text-xl font-bold text-slate-900'>{user?.name}</h2>
                                <p className='mt-1 text-sm text-slate-500'>{user?.email}</p>
                                <div className='mt-2 flex items-center gap-2'>
                                    <span className='h-2 w-2 rounded-full bg-emerald-500' />
                                    <span className='text-xs font-medium text-emerald-600'>
                                        Account active
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button className='flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50' onClick={handleEditProfile}>
                            <FiEdit size={16} />
                            Edit profile
                        </button>
                    </div>
                </section>

                {/* Edit Profile moodal */}

                {
                    isEditing && (
                        <div onClick={() => setIsEditing(false)} className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm'>
                            <div onClick={(e) => e.stopPropagation()} className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>

                                {/* Modal header */}

                                <div className='mb-6 flex items-center justify-between'>
                                    <div>
                                        <h2 className='text-xl font-bold text-slate-900'>Edit Profile</h2>
                                        <p className='mt-1 text-sm text-slate-500'>
                                            Update your account information
                                        </p>
                                    </div>

                                    <button
                                        type='button'
                                        onClick={() => setIsEditing(false)}
                                        className='rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600'
                                        aria-label='Close modal'
                                    >
                                        <FiX />
                                    </button>
                                </div>

                                {/* Error */}

                                {
                                    formError && (
                                        <div className='mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>
                                            {formError}
                                        </div>
                                    )
                                }

                                {/* Form */}

                                <form onSubmit={handleSubmit} className='space-y-5'>
                                    <div>
                                        <label htmlFor="profile-name" className='mb-2 block text-sm font-medium text-slate-700'>
                                            Full name
                                        </label>

                                        <input
                                            type="text"
                                            id='profile-name'
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            autoComplete='name'
                                            aria-invalid={Boolean(fieldErrors.name)}
                                            aria-describedby={fieldErrors.name ? "profile-name-error" : "undefined"}
                                            className={`w-full rounded-lg border px-4 py-3 outline-none transition focus:ring-2 ${fieldErrors.name ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-300 focus-within:border-indigo-500 focus:ring-indigo-100"}`}
                                        />
                                        {
                                            fieldErrors.name && (
                                                <p id='profile-name-error' className='mt-1 text-sm text-red-600'>
                                                    {fieldErrors.name}
                                                </p>
                                            )
                                        }
                                    </div>

                                    <div>
                                        <label htmlFor="profile-email" className='mb-2 block text-sm font-medium text-slate-700'>
                                            Email address
                                        </label>

                                        <input
                                            type="text"
                                            id='profile-email'
                                            name='email'
                                            value={formData.email}
                                            onChange={handleChange}
                                            autoComplete='email'
                                            aria-invalid={Boolean(fieldErrors.email)}
                                            aria-describedby={fieldErrors.email ? "profile-email-error" : "undefined"}
                                            className={`w-full rounded-lg border px-4 py-3 outline-none transition focus:ring-2 ${fieldErrors.email ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-300 focus-within:border-indigo-500 focus:ring-indigo-100"}`}
                                        />
                                        {
                                            fieldErrors.email && (
                                                <p id='profile-email-error' className='mt-1 text-sm text-red-600'>
                                                    {fieldErrors.email}
                                                </p>
                                            )
                                        }
                                    </div>

                                    {/* Actions */}

                                    <div className='flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end'>
                                        <button
                                            type='button'
                                            onClick={() => setIsEditing(false)}
                                            disabled={saving}
                                            className='rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50'
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type='submit'
                                            disabled={saving}
                                            className='rounded-lg bg-indigo-600 px-5 py-3  text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60'
                                        >
                                            {saving ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }

                {/* statistics */}

                <section className='mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>

                    {/* Account */}

                    <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
                        <div className='flex items-center justify-between'>
                            <div className='flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600'>
                                <FiUser size={21} />
                            </div>
                            <span className='text-sm font-semibold text-emerald-600'>
                                {user?.accountStatus || "Unknown"}
                            </span>
                        </div>
                        <p className='text-sm mt-5 font-semibold text-emerald-500'>
                            Account status
                        </p>
                        <h3 className='mt-1 text-2xl font-bold text-slate-900'>
                            {user?.accountStatus || "unknown"}
                        </h3>
                    </div>

                    {/* Security */}

                    <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
                        <div className='flex items-center justify-between'>
                            <div className='flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600'>
                                <FiShield size={21} />
                            </div>
                            <span className='text-sm font-semibold text-emerald-600'>
                                Protected
                            </span>
                        </div>
                        <p className='text-sm mt-5 font-semibold text-slate-500'>
                            Security
                        </p>
                        <h3 className='mt-1 text-2xl font-bold text-slate-900'>
                            {user?.passwordChangedAt ? "Password updated" : "Protected"}
                        </h3>
                    </div>

                    {/* Session */}

                    <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
                        <div className='flex items-center justify-between'>
                            <div className='flex h-11 w-11 items-center justify-center rounded-lg bg-violet-50 text-violet-600'>
                                <FiActivity />
                            </div>
                            <span className='text-sm font-semibold text-slate-500'>
                                Current
                            </span>
                        </div>
                        <p className='text-sm mt-5 font-semibold text-slate-500'>
                            Active sessions
                        </p>
                        <h3 className='mt-1 text-2xl font-bold text-slate-900'>
                            {sessions.length} {sessions.length === 1 ? "session" : "sessions"}
                        </h3>
                    </div>
                </section>

                {/* Account informations + security */}

                <section className='mt-6 grid gap-6 lg:grid-cols-2'>

                    {/* Account information */}

                    <div className='rounded-2xl border border-slate-200 bg-white shadow-sm'>
                        <div className='border-b border-slate-100 px-6 py-5'>
                            <div className='flex items-center gap-3'>
                                <FiUser size={20} className='text-indigo-600' />
                                <div>
                                    <h2 className='font-semibold text-slate-900'>
                                        Account information
                                    </h2>
                                    <p className='mt-1 text-sm text-slate-500'>
                                        Your basic account details
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className='divide-y divide-slate-100'>
                            <div className='flex items-center gap-4 px-6 py-5'>
                                <FiUser className='text-shadow-slate-400' size={19} />
                                <div>
                                    <p className='text-xs text-slate-500'>
                                        Full name
                                    </p>
                                    <p className='mt-1 text-sm font-medium text-slate-900'>
                                        {user?.name}
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-center gap-4 px-6 py-5'>
                                <FiMail size={19} className='text-slate-400' />
                                <div>
                                    <p className='text-xs text-slate-500'>
                                        Email Address
                                    </p>
                                    <p className='mt-1 text-sm font-medium text-slate-900'>
                                        {user?.email}
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-center gap-4 px-6 py-5'>
                                <FiClock size={19} className='text-slate-400' />
                                <div>
                                    <p className='text-xs text-slate-500'>
                                        Member since
                                    </p>
                                    <p className='mt-1 text-sm font-medium text-slate-900'>
                                        {memberSince}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security */}

                    <div className='rounded-2xl border border-slate-200 bg-white shadow-sm'>
                        <div className='border-b border-slate-100 px-6 py-5'>
                            <div className='flex items-center gap-3'>
                                <FiLock size={20} className='text-indigo-600' />
                                <div>
                                    <h2 className='font-semibold text-slate-900'>
                                        Security
                                    </h2>
                                    <p className='mt-1 text-sm text-slate-500'>
                                        Manage your account security
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className='p-6'>
                            <div className='flex items-center justify-between rounded-xl bg-emerald-50 p-4'>
                                <div className='flex gap-3 items-center'>
                                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-white text-emerald-600'>
                                        <FiShield size={18} />
                                    </div>
                                    <div>
                                        <p className='text-sm font-semibold text-slate-900'>
                                            Password
                                        </p>
                                        <p className='text-xs text-slate-500'>
                                            Your password is protected
                                        </p>
                                    </div>
                                </div>
                                <span className='text-xs font-semibold text-emerald-600'>
                                    Secure
                                </span>
                            </div>
                            <button className='mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 text-sm py-3 font-semibold text-slate-700 transition hover:bg-slate-50' onClick={handleOpenPasswordModal}>
                                <FiLock size={16} />
                                Change password
                            </button>
                        </div>
                    </div>
                </section>

                {/* Change Password Modal */}

                {
                    isPasswordModalOpen && (
                        <div onClick={() => setIsPasswordModalOpen(false)} className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm'>
                            <div onClick={(e) => e.stopPropagation()} className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>

                                {/* Header */}

                                <div className='mb-6 flex items-start justify-between'>
                                    <div>
                                        <div className='mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600'>
                                            <FiLock size={20} />
                                        </div>
                                        <h2 className='text-xl font-bold text-slate-900'>
                                            Change Password
                                        </h2>
                                        <p className='mt-1 text-sm text-slate-500'>
                                            Keep your account secure with a strong password
                                        </p>
                                    </div>

                                    <button
                                        type='button'
                                        onClick={() => setIsPasswordModalOpen(false)}
                                        className='rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600'
                                    >
                                        <FiX size={20} />
                                    </button>
                                </div>

                                {/* Error */}

                                {
                                    passwordError && (
                                        <div className='mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>
                                            {passwordError}
                                        </div>
                                    )
                                }

                                {/* Success */}

                                {
                                    passwordSuccess && (
                                        <div className='mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600'>
                                            {passwordSuccess}
                                        </div>
                                    )
                                }

                                {/* Form */}

                                <form onSubmit={handlePasswordSubmit} className='space-y-5'>
                                    <div>
                                        <label htmlFor="currentPassword"
                                            className='mb-2 block text-sm font-medium text-slate-700'
                                        >
                                            Current Password
                                        </label>
                                        <PasswordInput 
                                            type="password"
                                            id="currentPassword"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            autoComplete="current-password"
                                            placeholder="Enter your current password"
                                            disabled={changePassword}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="newPassword" className='mb-2 block text-sm font-medium text-slate-700'>
                                            New Password
                                        </label>

                                        <PasswordInput 
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            autoComplete="new-password"
                                            placeholder="Enter your new password"
                                            disabled={changePassword}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className='mb-2 block text-sm font-medium text-slate-700'>
                                            Confirm new password
                                        </label>
                                        <PasswordInput 
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            autoComplete="new-password"
                                            placeholder="Confirm your new password"
                                            disabled={changePassword}
                                        />
                                    </div>

                                    {/* Actions */}

                                    <div className='flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end'>
                                        <button
                                            type='button'
                                            onClick={() => setIsPasswordModalOpen(false)}
                                            disabled={changePassword}
                                            className='border rounded-lg border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50'
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type='submit'
                                            disabled={changePassword}
                                            className='rounded-lg bg-indigo-600 px-5 py-3 text-white text-sm font-semibold transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60'
                                        >
                                            {changePassword ? "Changing..." : "Change password"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }

                {/* Recent activity */}

                <section className='mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm'>
                    <div className='border-b border-slate-100 px-6 py-5'>
                        <h2 className='font-semibold text-slate-900'>
                            Recent activity
                        </h2>
                        <p className='mt-1 text-sm text-slate-500'>
                            Recent activity on your account
                        </p>
                    </div>

                    <div className='divide-y divide-slate-100'>
                        <div className='flex items-center gap-4 px-6 py-5'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600'>
                                <FiActivity size={17} />
                            </div>
                            <div className='flex-1'>
                                <p className='text-sm font-medium text-slate-900'>
                                    Last successfuly login
                                </p>
                                <p className='mt-1 text-xs text-slate-500'>
                                    Account authentication
                                </p>
                            </div>
                            <span className='text-xs text-slate-400'>
                                {lastLoginAt}
                            </span>
                        </div>

                        <div className='flex items-center gap-4 px-6 py-5'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600'>
                                <FiShield size={17} />
                            </div>
                            <div className='flex-1'>
                                <p className='text-sm font-medium text-slate-900'>
                                    Account created
                                </p>
                                <p className='mt-1 text-sm text-slate-500'>
                                    Member since
                                </p>
                            </div>
                            <span className='text-xs text-slate-400'>
                                {memberSince}
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Dashboard
