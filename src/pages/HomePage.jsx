import '../styles/pages/HomePage.css'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function HomePage() {
    const { user } = useAuth()

    const cards = [
        { title: 'Warehouse', path: '/warehouse' },
        { title: 'Products', path: '/products' },
        { title: 'Enquires', path: '/enquires' },
        { title: 'Sales', path: '/sales' },
        { title: 'Users', path: '/users' },
    ]

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

    return (
        <div className="home-page">
            <div className="container">
                <h1>Welcome to Lucknow Marbles</h1>
                <div className="card-grid">
                    {cards.map((card, index) => (
                        <a key={index} href={card.path} className="card">
                            <div className="card-icon-placeholder"></div>
                            <h2>{card.title}</h2>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}