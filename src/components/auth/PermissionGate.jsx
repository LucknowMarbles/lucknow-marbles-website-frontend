import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Container, Stack, Title, Text, Button, Card } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../config/config.js'
import axios from 'axios'

export default function PermissionGate({ requiredPermission, children }) {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [permissions, setPermissions] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchPermissions() {
            if (!user) {
                setIsLoading(false)
                return
            }
            
            try {
                const { data } = await axios.get(`${API_BASE_URL}/api/users/permissions`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                })
                
                setPermissions(data)
            }
            catch (err) {
                const errorMessage = err.response?.data?.message || err.message
                setError(errorMessage)
                console.error("Error fetching permissions:", err)
            }
            finally {
                setIsLoading(false)
            }
        }

        fetchPermissions()
    
    }, [user])

    
    if (!user) {
        return (
            <Container size="lg" py="xl">
                <Card withBorder p="xl" radius="md">
                    <Stack align="center" gap="md">
                        <Title order={2}>Access Denied</Title>
                        <Text c="dimmed" ta="center">
                            Please log in to access this page.
                        </Text>
                        <Button
                            onClick={() => navigate('/login')}
                            color="blue"
                        >
                            Login
                        </Button>
                    </Stack>
                </Card>
            </Container>
        )
    }

    if (isLoading) {
        return (
            <Container size="lg" py="xl">
                <Card withBorder p="xl" radius="md">
                    <Stack align="center" gap="md">
                        <Title order={2}>Checking Permissions...</Title>
                        <Text c="dimmed">Please wait while we verify your access.</Text>
                    </Stack>
                </Card>
            </Container>
        )
    }

    if (error) {
        return (
            <Container size="lg" py="xl">
                <Card withBorder p="xl" radius="md">
                    <Stack align="center" gap="md">
                        <Title order={2} c="red">Error</Title>
                        <Text c="dimmed">{error}</Text>
                        <Button 
                            onClick={() => window.location.reload()}
                            color="blue"
                        >
                            Retry
                        </Button>
                    </Stack>
                </Card>
            </Container>
        )
    }

    if (!permissions?.[requiredPermission]) {
        return (
            <Container size="lg" py="xl">
                <Card withBorder p="xl" radius="md">
                    <Stack align="center" gap="md">
                        <Title order={2}>Access Denied</Title>
                        <Text c="dimmed" ta="center">
                            You don't have permission to access this page.
                            Please contact your administrator.
                        </Text>
                        <Button
                            onClick={() => navigate('/')}
                            color="blue"
                        >
                            Back to Home
                        </Button>
                    </Stack>
                </Card>
            </Container>
        )
    }

    return children
} 