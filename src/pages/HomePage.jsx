import '../styles/pages/HomePage.css'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function HomePage() {
    const { user } = useAuth()
    const [permissions, setPermissions] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchPermissions() {
            if (!user) return
            
            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
                const response = await fetch(`${API_BASE_URL}/users/permissions`, {
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Failed to fetch permissions")
                }

                const data = await response.json()
                setPermissions(data)
            } catch (err) {
                setError(err.message)
                console.error("Error fetching permissions:", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPermissions()
    }, [user])

    const getAuthorizedCards = () => {
        if (!permissions) return []

        const cards = []
        
        if (permissions.viewProducts) {
            cards.push({ title: 'Products', path: '/products' })
        }
        if (permissions.viewUsers) {
            cards.push({ title: 'Users', path: '/users' })
        }
        if (permissions.viewOrders) {
            cards.push({ title: 'Orders', path: '/orders' })
        }
        if (permissions.viewEnquiries) {
            cards.push({ title: 'Enquires', path: '/enquires' })
        }
        if (permissions.viewSalesReports) {
            cards.push({ title: 'Sales', path: '/sales' })
        }

        return cards
    }

    if (!user) {
        return (
            <div className="home-page">
                <div className="welcome-section">
                    <h1>Welcome to Lucknow Marbles</h1>
                    <p className="welcome-message">
                        Internal Management System for Lucknow Marbles staff and administrators.
                        Register or login to access inventory, sales, and business operations.
                    </p>
                    <div className="cta-buttons">
                        <Link to="/signup" className="cta-button primary">
                            Staff Registration
                        </Link>
                        <Link to="/login" className="cta-button secondary">
                            Staff Login
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="home-page">
                <div className="container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading dashboard...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="home-page">
                <div className="container">
                    <div className="error-state">
                        <h2>Error Loading Dashboard</h2>
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()} className="retry-button">
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const authorizedCards = getAuthorizedCards()

    return (
        <div className="home-page">
            <div className="container">
                <h1>Welcome to Lucknow Marbles</h1>
                {authorizedCards.length > 0 ? (
                    <div className="card-grid">
                        {authorizedCards.map((card, index) => (
                            <Link key={index} to={card.path} className="card">
                                <div className="card-icon-placeholder"></div>
                                <h2>{card.title}</h2>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="no-access-message">
                        <p>You don't have access to any modules. Please contact your administrator.</p>
                    </div>
                )}
            </div>
        </div>
    )
}