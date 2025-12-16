export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3333"
export const API_KEY = import.meta.env.VITE_API_KEY || "pharmaser_secure_api_key_2025"

export const getAuthHeaders = () => {
    const token = localStorage.getItem("token")
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "x-api-key": API_KEY
    }
}

export const getPublicHeaders = () => {
    return {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
    }
}
