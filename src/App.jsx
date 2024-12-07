import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'

function App() {
    return (
        <BrowserRouter>
            <Navigation />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
