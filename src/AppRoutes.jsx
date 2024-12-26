import React from 'react'
import { useAuth } from './contexts/AuthContext'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import LoginPage from './pages/auth/LoginPage'
import ProfilePage from './pages/profile'
import NotFoundPage from './pages/NotFoundPage'
import AgGridContainer from './components/aggrid/AgGridContainer'

export default function AppRoutes() {
    const { apiUrls } = useAuth()

    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {apiUrls.map((urlData) => (
                <Route
                    key={urlData.route}
                    path={urlData.route}
                    element={<AgGridContainer url={urlData.url} />}
                />
            ))}

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}
