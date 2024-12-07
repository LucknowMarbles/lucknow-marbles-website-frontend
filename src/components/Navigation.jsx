import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../styles/components/Navigation.css'

export default function Navigation() {
    const { user, logout } = useAuth()

    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li><Link to="/" className="nav-link">Home</Link></li>
                {user ? (
                    <>
                        <li><Link to="/profile" className="nav-link">{user.username}</Link></li>
                        <li>
                            <button onClick={logout} className="nav-link">
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login" className="nav-link">Login</Link></li>
                        <li><Link to="/signup" className="nav-link">Signup</Link></li>
                    </>
                )}
            </ul>
        </nav>
    )
}