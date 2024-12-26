import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getApiUrls } from '../services/authService'


const AuthContext = createContext()

export function AuthProvider({ children }) {
    const navigate = useNavigate()

    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user')
            return savedUser ? JSON.parse(savedUser) : null
        }
        catch (error) {
            console.error('Error parsing user data:', error)
            localStorage.removeItem('user')
            return null
        }
    })

    const [apiUrls, setApiUrls] = useState([])


    function login(userData) {
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    function logout() {
        setUser(null)
        setApiUrls([])
        localStorage.removeItem('user')

        navigate('/')
    }

    async function fetchApiUrls() {
        if (!user) {
            setApiUrls([])
            return
        }

        const token = user["token"]
        const urls = await getApiUrls(token)
        setApiUrls(urls)
    }


    return (
        <AuthContext.Provider value={{ user, login, logout, apiUrls, fetchApiUrls }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
