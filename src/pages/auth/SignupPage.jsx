import SignupForm from '../../components/auth/SignupForm'
import '../../styles/pages/auth/AuthPage.css'


export default function SignupPage() {
  return (
    <div className="auth-page">
        <div className="container">
            <SignupForm />
        </div>
    </div>
  )
}
