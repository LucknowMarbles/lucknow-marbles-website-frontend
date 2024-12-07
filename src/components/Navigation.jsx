import { Link } from 'react-router-dom'
import '../styles/components/Navigation.css'

export default function Navigation() {
    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li><Link to="/" className="nav-link">Home</Link></li>
                <li><Link to="/login" className="nav-link">Login</Link></li>
                <li><Link to="/signup" className="nav-link">Signup</Link></li>
            </ul>
        </nav>
    )
}