import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import {
    Container,
    Paper,
    Title,
    Stack,
    Grid,
    Text,
    Skeleton,
    Alert,
    Button,
    Badge
} from '@mantine/core'
import { API_BASE_URL } from '../config/config.js'
import axios from 'axios'

export default function ProfilePage() {
    const { user } = useAuth()
    const [profile, setProfile] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        async function fetchProfile() {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/api/users/profile`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                })
                
                setProfile(data)
            }
            catch (error) {
                setHasError(true)
                console.error("Error fetching profile:", error.response?.data || error.message)
            }
            finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    
    }, [user.token])

    if (isLoading) {
        return (
            <Container size="sm" py="xl">
                <Paper radius="md" p="xl" withBorder>
                    <Stack gap="md">
                        <Skeleton height={30} width="50%" radius="md" />
                        <Skeleton height={20} radius="md" />
                        <Skeleton height={20} radius="md" />
                        <Skeleton height={20} radius="md" />
                        <Skeleton height={20} radius="md" />
                    </Stack>
                </Paper>
            </Container>
        )
    }

    if (hasError) {
        return (
            <Container size="sm" py="xl">
                <Alert
                    title="Error"
                    color="red"
                    radius="md"
                >
                    <Stack gap="md">
                        <Text>Failed to load profile information</Text>
                        <Button 
                            onClick={() => window.location.reload()}
                            variant="light"
                            color="red"
                            size="sm"
                        >
                            Retry
                        </Button>
                    </Stack>
                </Alert>
            </Container>
        )
    }

    return (
        <Container size="sm" py="xl">
            <Paper radius="md" p="xl" withBorder>
                <Stack gap="xl">
                    <Title order={2} ta="center">Profile Information</Title>

                    <Grid gutter="lg">
                        <Grid.Col span={12}>
                            <Stack gap={4}>
                                <Text size="sm" c="dimmed">Username</Text>
                                <Text fw={500}>{profile.username}</Text>
                            </Stack>
                        </Grid.Col>

                        <Grid.Col span={12}>
                            <Stack gap={4}>
                                <Text size="sm" c="dimmed">Email</Text>
                                <Text fw={500}>{profile.email}</Text>
                            </Stack>
                        </Grid.Col>

                        <Grid.Col span={12}>
                            <Stack gap={4}>
                                <Text size="sm" c="dimmed">Phone Number</Text>
                                <Text fw={500}>{profile.phoneNumber}</Text>
                            </Stack>
                        </Grid.Col>

                        <Grid.Col span={12}>
                            <Stack gap={4}>
                                <Text size="sm" c="dimmed">User Type</Text>
                                <Badge 
                                    color="blue" 
                                    variant="light"
                                    size="lg"
                                    radius="sm"
                                >
                                    {profile.userType}
                                </Badge>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </Stack>
            </Paper>
        </Container>
    )
}