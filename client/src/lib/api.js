const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

let refreshPromise = null

const parseResponse = async (response) => {
    try{
        return await response.json()
    }catch{
        return {
            success: false,
            message: "Invalid server response"
        }
    }
}

const createApiError = (response, data) => {
    const error = new Error(
        data.message || "Something went wrong"
    )

    error.status = response.status
    error.data = data

    console.error(data.message)
    return error.message
}


const refreshAccessToken = async () => {
    if(!refreshPromise){
        refreshPromise = fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(async (response) => {
            const data = await parseResponse(response)

            if(!response.ok){
                throw createApiError(response, data)
            }

            return data
        }).finally(() => {
            refreshPromise = null
        })
    }

    return refreshPromise
}


export const api = async(
    endpoint,
    options = {},
    retry = false
) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        },
        credentials: "include"
    })

    const data = await parseResponse(response)

    if(response.ok) return data

    const skipRefresh =
        endpoint === "/auth/refresh" ||
        endpoint === "/auth/login" ||
        endpoint === "/auth/register" ||
        endpoint === "/auth/logout" ||
        endpoint === "/auth/forgot-password" ||
        endpoint === "/auth/reset-password"


    if(
        response.status === 401 &&
        !retry &&
        !skipRefresh
    ){
        try{
            await refreshAccessToken()

            return api(
                endpoint,
                options,
                true
            )
        } catch(refreshError){
            throw refreshError
        }
    }

    throw createApiError(response, data)
}