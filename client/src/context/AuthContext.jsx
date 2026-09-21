import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api.js";

const AuthContext = createContext(null)

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [sessions, setSessions] = useState([])

    const getSessions = async () => {
        try{
            const data = await api("/auth/sessions")
            setSessions(data.sessions)
        }catch(err){
            console.error("Failed to fetch sessions", err)
            setSessions([])
        }
    }

    const getMe = async () => {
        try{
            const data = await api("/auth/me")
            setUser(data.user)

            await getSessions()

            return data.user

        } catch(err){
            console.error("Authentication check failed", err)
            setUser(null)
            setSessions([])

            throw err
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        getMe()
    }, [])

     const clearUser = () => {
        setUser(null)
        setSessions([])
    }

    const logout = async () => {
        try{
            await api("/auth/logout", {method: "POST"})
            
            clearUser()

        } catch(err){
            console.error("Logout failed", err)

            if(err?.status === 401) clearUser()
        }
    }

    const updateProfile = async(profileData) => {
        const data = await api("/auth/profile", {
            method: "PUT",
            body: JSON.stringify(profileData)
        })

        setUser(data.user)

        return data
    }


    return (
        <AuthContext.Provider value={{
                user, 
                loading, 
                logout, 
                getMe, 
                isAuthenticated : !!user, 
                updateProfile,
                sessions,
                getSessions,
                clearUser
                }}>
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = () => {
    return useContext(AuthContext)
}