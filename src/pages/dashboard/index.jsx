import {
    Container,
    Title,
    Text,
    Card,
    Grid,
    Stack
} from '@mantine/core'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../config/config.js'
import axios from 'axios'

// Import new components
import { DashboardCard } from './components/DashboardCard'
import { LoadingView } from './components/LoadingView'
import { ErrorView } from './components/ErrorView'
import { UnauthorizedView } from './components/UnauthorizedView'

export default function Dashboard() {
    const { user } = useAuth()
    const [permissions, setPermissions] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchPermissions() {
            if (!user) return
            
            try {
                const { data } = await axios.get(`${API_BASE_URL}/api/users/permissions`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                })
                
                setPermissions(data)
            }
            catch (err) {
                const message = err.response?.data?.message || "Failed to fetch permissions"
                setError(message)
                console.error("Error fetching permissions:", err)
            }
            finally {
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
        return <UnauthorizedView />
    }


    if (isLoading) {
        return <LoadingView />
    }


    if (error) {
        return <ErrorView error={error} />
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
                                <DashboardCard
                                    title={card.title}
                                    description={card.description}
                                    path={card.path}
                                />
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