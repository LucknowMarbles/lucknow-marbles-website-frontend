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
import { apiUrls } from '../../config/urls'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function Dashboard() {
    const { user } = useAuth()

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