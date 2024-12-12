import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Container, Stack, Title, Text, Button, Card } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

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
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
                const response = await fetch(`${API_BASE_URL}/users/permissions`, {
                    headers: {
                        "Authorization": `Bearer ${user.token}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Failed to fetch permissions")
                }

                const data = await response.json()
                setPermissions(data)
            }
            catch (err) {
                setError(err.message)
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