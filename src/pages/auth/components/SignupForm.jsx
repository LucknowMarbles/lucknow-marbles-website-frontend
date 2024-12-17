import { useState } from "react"
import { registerUser } from '../../../services/authService'
import { USER_TYPES } from '../../../constants/userTypes'
import { validateEmail, validatePhone, validatePassword } from '../../../utils/validation'
import { useAuth } from '../../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
    TextInput,
    PasswordInput,
    Select,
    Button,
    Title,
    Stack,
    Text
} from '@mantine/core'

export default function SignupForm() {
    const { login } = useAuth()
    const navigate = useNavigate()
    
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        userType: USER_TYPES.CUSTOMER,
    })

    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    function handleChange(value, name) {
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
            const { message, ...authData } = response

            login(authData)
            console.log(message)

            navigate('/')
        }
        catch (error) {
            setErrors({ submit: error.message })
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="md">
                <Title order={2} ta="center">Sign Up</Title>

                <TextInput
                    required
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={(e) => handleChange(e.currentTarget.value, 'username')}
                    error={errors.username}
                    size="md"
                />

                <TextInput
                    required
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange(e.currentTarget.value, 'email')}
                    error={errors.email}
                    size="md"
                />

                <TextInput
                    required
                    label="Mobile Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange(e.currentTarget.value, 'phoneNumber')}
                    error={errors.phoneNumber}
                    size="md"
                />

                <PasswordInput
                    required
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => handleChange(e.currentTarget.value, 'password')}
                    error={errors.password}
                    size="md"
                />

                <Select
                    label="User Type"
                    name="userType"
                    value={formData.userType}
                    onChange={(value) => handleChange(value, 'userType')}
                    data={Object.values(USER_TYPES).map(type => ({
                        value: type,
                        label: type.charAt(0).toUpperCase() + type.slice(1)
                    }))}
                    size="md"
                />

                <Button
                    type="submit"
                    loading={isLoading}
                    size="md"
                    fullWidth
                    color="blue"
                    styles={(theme) => ({
                        root: {
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: theme.shadows.md
                            },
                            '&:active': {
                                transform: 'translateY(0)',
                            }
                        }
                    })}
                >
                    {isLoading ? "Signing up..." : "Sign Up"}
                </Button>

                {errors.submit && (
                    <Text c="red" size="sm" ta="center">
                        {errors.submit}
                    </Text>
                )}
            </Stack>
        </form>
    )
}