import { useState } from "react"
import { loginUser } from '../../services/authService'
import { validateEmail } from '../../utils/validation'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
    TextInput,
    PasswordInput,
    Button,
    Title,
    Stack,
    Text
} from '@mantine/core'

export default function LoginForm() {
    const { login } = useAuth()
    const navigate = useNavigate()
    
    const [formData, setFormData] = useState({
        email: "",
        password: "",
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
            const { message, ...userData } = response

            login(userData)
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
                <Title order={2} ta="center">Login</Title>

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

                <PasswordInput
                    required
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => handleChange(e.currentTarget.value, 'password')}
                    error={errors.password}
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
                    {isLoading ? "Logging in..." : "Login"}
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