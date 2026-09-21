import {Link} from "react-router-dom"
import { api } from "../lib/api.js"
import { useState } from "react"

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async(e) => {
        e.preventDefault()

        setError("")
        setSuccess("")

        if(!email){
            setError("Email address is required")
            return
        }

        setLoading(true)
        try{
            const data = await api("/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({email})
            })

            setSuccess(
                data.message || 
                "If an account exists, a reset link has been sent"
            )

            setEmail("")
        }catch(err){
            setError(err.message || "Unable to process request")
        }finally {
            setLoading(false)
        }
    }
  return (
    <div className="flex max-h-screen items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-md">
            <div className="mb-8 text-center">
                <Link to={"/"} className="text-2xl font-bold">
                    Auth  {" "}  
                    <span className="text-indigo-600">
                         App
                    </span>
                </Link>

                <h1 className="mt-8 text-3xl font-bold">
                    Forgot your password?
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                    Enter your email and we'll send you  password reset link.
                </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                {
                    error && (
                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )
                }
                {
                    success && (
                        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                            {success}
                        </div>
                    )
                }

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Email address
                        </label>
                        <input 
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            placeholder="you@example.com" 
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                            {
                                loading ? "Sending..."
                                : "Send reset link"
                            }
                        </button>
                </form>
                <p className="mt-6 text-center text-sm text-slate-600">
                    Remember your password{" "}
                    <Link className="font-semibold text-indigo-600 hover:text-indigo-700" to={"/signin"}>
                            Sign in
                    </Link>
                </p>
            </div>
        </div>
    </div>
  )
}

export default ForgotPassword