import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"

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
        <div>

            <h1>Profile Page</h1>

            {isLoading && <p>Loading...</p>}

            {hasError && <p>Error fetching profile</p>}

            {profile && (
                <div>
                    <p>Username: {profile.username}</p>
                    <p>Email: {profile.email}</p>
                    <p>Phone Number: {profile.phoneNumber}</p>
                    <p>User Type: {profile.userType}</p>
                </div>
            )}

        </div>
    )
}