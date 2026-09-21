import { Link, NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

const Navbar = () => {

    const navLink = ({isActive}) => `text-sm font-medium transition ${isActive ? "text-indigo-600" : "text-slate-600 hover:text-slate-900"}`

    const {user, loading, logout} = useAuth()

    const handleLogout = () =>{
        logout()
    }
  return (
    <header className='border-b border-slate-200 bg-white'>
        <nav className="flex justify-between max-w-7xl mx-auto p-6 items-center h-16">
            <Link to={"/"}>
                <h1 className="font-bold text-xl text-slate-900 tracking-tight">Auth <span className="text-indigo-600">App</span></h1>
            </Link>

            <ul className="flex gap-8 items-center font-medium">
                <NavLink to={'/'} className={navLink}>
                    <li>Home</li>
                </NavLink>
                <NavLink to={'/about'} className={navLink}>
                    <li>About</li>
                </NavLink>

                {
                    !loading && user ? (
                    <>
                        <NavLink to={"/dashboard"} className={navLink}>
                            Dashboard
                        </NavLink>

                        <li>
                            <button onClick={handleLogout} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                <>
                    <Link to={'/signin'} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
                    <li>Sign In</li>
                </Link>
                </>
                )
                }
            </ul>
        </nav>
    </header>
  )
}

export default Navbar