import { Link } from "react-router-dom"
import {useAuth} from '../context/AuthContext.jsx'

const Home = () => {
  const {isAuthenticated} = useAuth()
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
        <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
          Secure authentication made simple
        </span>

        <h1 className="mt-8 max-w-4xl text-5xl font-bold tracking-tight text-slate-900 md:text-6xl">
          Your account
          <br />
          <span className="text-indigo-600">
            Your security
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          A modern authentication platform built with React, Nodejs, Express and MongoDB
        </p>

        <div className="mt-10 flex gap-4">
          <Link to={isAuthenticated ? "/dashboard" : "/register"} className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm hover:bg-indigo-700">
            Create account
          </Link>

          <Link to={"/about"} className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50">
            Learn more
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Home