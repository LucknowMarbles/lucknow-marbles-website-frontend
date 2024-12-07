import LoginForm from '../../components/auth/LoginForm'
import '../../styles/pages/auth/AuthPage.css'


export default function LoginPage() {
    return (
        <div className="auth-page">
            <div className="container">
                <LoginForm />
            </div>
        </div>
    )
}