import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'


const AuthContext = createContext()

export function AuthProvider({ children }) {
    const navigate = useNavigate()

    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user')
            return savedUser ? JSON.parse(savedUser) : null
        } catch (error) {
            console.error('Error parsing user data:', error)
            localStorage.removeItem('user')
            return null
        }
    })

    function login(userData) {
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    function logout() {
        setUser(null)
        localStorage.removeItem('user')
        navigate('/')
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
