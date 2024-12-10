import {
    Container,
    Title,
    Text,
    Button,
    Card,
    Grid,
    Group,
    Stack,
    Skeleton
} from '@mantine/core'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'

export default function HomePage() {
    const { user } = useAuth()
    const [permissions, setPermissions] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchPermissions() {
            if (!user) return
            
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
            } catch (err) {
                setError(err.message)
                console.error("Error fetching permissions:", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPermissions()
    }, [user])

    const getAuthorizedCards = () => {
        if (!permissions) return []

        const cards = []
        
        if (permissions.viewProducts) {
            cards.push({ title: 'Products', path: '/products', description: 'Manage product inventory and categories' })
        }
        if (permissions.viewUsers) {
            cards.push({ title: 'Users', path: '/users', description: 'Manage staff and user accounts' })
        }
        if (permissions.viewOrders) {
            cards.push({ title: 'Orders', path: '/orders', description: 'View and manage customer orders' })
        }
        if (permissions.viewEnquiries) {
            cards.push({ title: 'Enquiries', path: '/enquiries', description: 'Handle customer enquiries' })
        }
        if (permissions.viewSalesReports) {
            cards.push({ title: 'Sales', path: '/sales', description: 'View sales reports and analytics' })
        }

        return cards
    }

    if (!user) {
        return (
            <Container size="lg" py="xl">
                <Stack gap="xl" align="center">
                    <Title
                        order={1}
                        ta="center"
                        variant="gradient"
                        gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                    >
                        Welcome to Lucknow Marbles
                    </Title>

                    <Text size="lg" c="dimmed" ta="center" maw={580}>
                        Internal Management System for Lucknow Marbles staff and administrators.
                        Register or login to access inventory, sales, and business operations.
                    </Text>

                    <Group justify="center" mt="md">
                        <Button
                            component={Link}
                            to="/signup"
                            size="lg"
                            color="blue.6"
                            styles={(theme) => ({
                                root: {
                                    backgroundColor: theme.colors.blue[6],
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: theme.colors.blue[7],
                                        transform: 'translateY(-2px)',
                                        boxShadow: theme.shadows.md
                                    },
                                    '&:active': {
                                        transform: 'translateY(0)',
                                        backgroundColor: theme.colors.blue[8]
                                    }
                                }
                            })}
                        >
                            Staff Registration
                        </Button>
                        <Button
                            component={Link}
                            to="/login"
                            size="lg"
                            variant="outline"
                            color="blue"
                            styles={(theme) => ({
                                root: {
                                    borderColor: theme.colors.blue[6],
                                    color: theme.colors.blue[6],
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: theme.colors.blue[0],
                                        transform: 'translateY(-2px)',
                                        boxShadow: theme.shadows.sm,
                                        borderColor: theme.colors.blue[7]
                                    },
                                    '&:active': {
                                        transform: 'translateY(0)',
                                        backgroundColor: theme.colors.blue[1],
                                        borderColor: theme.colors.blue[8]
                                    }
                                }
                            })}
                        >
                            Staff Login
                        </Button>
                    </Group>
                </Stack>
            </Container>
        )
    }

    if (isLoading) {
        return (
            <Container size="lg" py="xl">
                <Stack gap="xl">
                    <Skeleton height={50} radius="md" />
                    <Grid>
                        {[1, 2, 3].map((i) => (
                            <Grid.Col key={i} span={{ base: 12, sm: 6, md: 4 }}>
                                <Skeleton height={200} radius="md" />
                            </Grid.Col>
                        ))}
                    </Grid>
                </Stack>
            </Container>
        )
    }

    if (error) {
        return (
            <Container size="lg" py="xl">
                <Stack align="center" gap="md">
                    <Title order={2} c="red">Error Loading Dashboard</Title>
                    <Text c="dimmed">{error}</Text>
                    <Button 
                        onClick={() => window.location.reload()}
                        color="blue"
                    >
                        Retry
                    </Button>
                </Stack>
            </Container>
        )
    }

    const authorizedCards = getAuthorizedCards()

    return (
        <Container size="lg" py="xl">
            <Stack gap="xl">
                <Title order={1} ta="center">Welcome to Lucknow Marbles</Title>
                
                {authorizedCards.length > 0 ? (
                    <Grid>
                        {authorizedCards.map((card, index) => (
                            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
                                <Card
                                    component={Link}
                                    to={card.path}
                                    shadow="sm"
                                    padding="lg"
                                    radius="md"
                                    withBorder
                                    style={{ 
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        height: '100%'
                                    }}
                                    styles={(theme) => ({
                                        root: {
                                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                boxShadow: theme.shadows.md
                                            }
                                        }
                                    })}
                                >
                                    <Stack gap="sm">
                                        <Title order={3}>{card.title}</Title>
                                        <Text size="sm" c="dimmed">
                                            {card.description}
                                        </Text>
                                    </Stack>
                                </Card>
                            </Grid.Col>
                        ))}
                    </Grid>
                ) : (
                    <Card withBorder p="xl" radius="md">
                        <Text ta="center" fw={500} size="lg">
                            You don't have access to any modules. Please contact your administrator.
                        </Text>
                    </Card>
                )}
            </Stack>
        </Container>
    )
}