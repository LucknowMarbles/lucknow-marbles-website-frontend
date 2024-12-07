import LoginForm from '../../components/auth/LoginForm'
import '../../styles/pages/auth/SignupPage.css'

export default function LoginPage() {
    return (
        <div className="login-page">
            <div className="container">
                <LoginForm />
            </div>
        </div>
    )
}