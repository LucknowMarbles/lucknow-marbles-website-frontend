import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import '../styles/pages/ProfilePage.css'

export default function ProfilePage() {
    const { user } = useAuth()
    const [profile, setProfile] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        async function fetchProfile() {
            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
                const response = await fetch(`${API_BASE_URL}/users/profile`, {
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Failed to fetch profile")
                }

                const data = await response.json()
                setProfile(data)
            }
            catch (error) {
                setHasError(true)
                console.error("Error fetching profile:", error)
            }
            finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [])

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-card">
                    <h1>Profile Information</h1>

                    {isLoading && (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading profile...</p>
                        </div>
                    )}

                    {hasError && (
                        <div className="error-state">
                            <p>Error fetching profile information</p>
                            <button onClick={() => window.location.reload()} className="retry-button">
                                Retry
                            </button>
                        </div>
                    )}

                    {profile && (
                        <div className="profile-info">
                            <div className="info-group">
                                <label>Username</label>
                                <p>{profile.username}</p>
                            </div>

                            <div className="info-group">
                                <label>Email</label>
                                <p>{profile.email}</p>
                            </div>

                            <div className="info-group">
                                <label>Phone Number</label>
                                <p>{profile.phoneNumber}</p>
                            </div>

                            <div className="info-group">
                                <label>User Type</label>
                                <p className="user-type">{profile.userType}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}