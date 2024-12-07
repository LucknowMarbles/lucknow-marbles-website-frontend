import { useState } from "react"
import { registerUser } from '../../services/authService'
import { USER_TYPES } from '../../constants/userTypes'
import { validateEmail, validatePhone, validatePassword } from '../../utils/validation'
import "../../styles/components/auth/SignupForm.css"


export default function SignupForm() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        userType: USER_TYPES.CUSTOMER,
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

        if (!formData.username) newErrors.username = "Username is required"
        if (!validateEmail(formData.email)) newErrors.email = "Invalid email address"
        if (!validatePhone(formData.phoneNumber)) newErrors.phoneNumber = "Invalid mobile number"
        if (!validatePassword(formData.password)) newErrors.password = "Password must be at least 8 characters long"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }


    async function handleSubmit(e) {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)

        try {
            const response = await registerUser(formData)
            console.log(response)
        }
        catch (error) {
            setErrors({ submit: error.message })
        }
        finally {
            setIsLoading(false)
        }
    }


    return <form onSubmit={handleSubmit} className="signup-form">
        <h2>Sign Up</h2>


        <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />
            {errors.username && <p className="error-message">{errors.username}</p>}
        </div>

        <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="form-group">
            <label htmlFor="phoneNumber">Mobile Number</label>
            <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}
        </div>

        <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
            {errors.password && <p className="error-message">{errors.password}</p>}
        </div>

        <div className="form-group">
            <label htmlFor="userType">User Type</label>
            <select id="userType" name="userType" value={formData.userType} onChange={handleChange}>
                {Object.values(USER_TYPES).map(type => (
                    <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                ))}
            </select>
        </div>


        <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? "Signing up..." : "Sign Up"}
        </button>

        {errors.submit && <p className="error-message">{errors.submit}</p>}
    </form>
}