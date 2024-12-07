import { useState } from "react"
import { loginUser } from '../../services/authService'
import { validateEmail } from '../../utils/validation'
import "../../styles/components/auth/SignupForm.css"

export default function LoginForm() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)


    function handleChange(e) {
        const { name, value } = e.target

        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }


    function validateForm() {
        const newErrors = {}

        if (!validateEmail(formData.email)) newErrors.email = "Invalid email address"
        if (!formData.password) newErrors.password = "Password is required"
        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }


    async function handleSubmit(e) {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)

        try {
            const response = await loginUser(formData)
            console.log(response)
        }
        catch (error) {
            setErrors({ submit: error.message })
        }
        finally {
            setIsLoading(false)
        }
    }


    return (
        <form onSubmit={handleSubmit} className="login-form">
            <h2>Login</h2>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                />
                {errors.password && <p className="error-message">{errors.password}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="submit-button">
                {isLoading ? "Logging in..." : "Login"}
            </button>

            {errors.submit && <p className="error-message">{errors.submit}</p>}
        </form>
    )
}