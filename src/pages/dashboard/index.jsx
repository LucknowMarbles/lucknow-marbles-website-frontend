import {
    Container,
    Title,
    Grid,
    Stack,
    Alert,
    Button,
    Text
} from '@mantine/core'
import { DashboardCard } from './components/DashboardCard'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Dashboard() {
    const { user, apiUrls, fetchApiUrls } = useAuth()
    const [errorMessage, setErrorMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        async function fetchApiUrlsForRoutes() {
            setIsLoading(true)

            try {
                await fetchApiUrls()
            }
            catch (error) {
                setErrorMessage(error.message)
            }
            finally {
                setIsLoading(false)
            }
        }

        if (user)
            fetchApiUrlsForRoutes()

    }, [])


    if (isLoading) {
        return <p>Loading...</p>
    }


    if (errorMessage) {
        return (
            <Container size="sm" py="xl">
                <Alert
                    title="Unable to fetch content types"
                    color="blue"
                    radius="md"
                >
                    <Text>{errorMessage}</Text>
                </Alert>
            </Container>
        )
    }


    if (!user) {
        return (
            <Container size="sm" py="xl">
                <Alert
                    title="Not Authenticated"
                    color="blue"
                    radius="md"
                >
                    <Stack gap="md">
                        <Text>You must login to continue ahead.</Text>
                        <Button
                            component={Link}
                            to="/login"
                            variant="light"
                            color="blue"
                            size="sm"
                        >
                            Login
                        </Button>
                    </Stack>
                </Alert>
            </Container>
        )
    }

    return (
        <Container size="lg" py="xl">
            <Stack gap="xl">
                <Title order={1} ta="center">Welcome to Lucknow Marbles</Title>

                <Grid>
                    {apiUrls.map((urlData, index) => (
                        <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
                            <DashboardCard
                                title={urlData.route.split('/').pop().charAt(0).toUpperCase() +
                                    urlData.route.split('/').pop().slice(1)}
                                description={`Manage ${urlData.route.split('/').pop()}`}
                                path={urlData.route}
                            />
                        </Grid.Col>
                    ))}
                </Grid>
            </Stack>
        </Container>
    )
}