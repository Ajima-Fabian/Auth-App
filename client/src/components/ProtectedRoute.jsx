import {Navigate} from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const ProtectedRoute = ({children}) => {
    const {user, loading} = useAuth()

    if(loading){
        return (
            <div className='flex min-h-screen items-center justify-center bg-slate-50'>
                <p className='text-sm font-medium text-slate-500'>
                    Checking Authentication...
                </p>
            </div>
        )
    }

    if(!user){
        return <Navigate to={"/signin"} replace/>
    }

    return children

}

export default ProtectedRoute