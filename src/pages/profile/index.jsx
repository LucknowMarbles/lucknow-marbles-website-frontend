import { useAuth } from "../../contexts/AuthContext.jsx"
import { Link } from 'react-router-dom'
import {
    Container,
    Paper,
    Title,
    Stack,
    Grid,
    Text,
    Alert,
    Button,
} from '@mantine/core'

export default function ProfilePage() {
    const { user } = useAuth()

    if (!user) {
        return (
            <Container size="sm" py="xl">
                <Alert
                    title="Error"
                    color="red"
                    radius="md"
                >
                    <Stack gap="md">
                        <Text>You must login to view profile.</Text>
                        <Button
                            component={Link}
                            to="/login"
                            variant="light"
                            color="red"
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
        <Container size="sm" py="xl">
            <Paper radius="md" p="xl" withBorder>
                <Stack gap="xl">
                    <Title order={2} ta="center">Profile Information</Title>

                    <Grid gutter="lg">
                        <Grid.Col span={12}>
                            <Stack gap={4}>
                                <Text size="sm" c="dimmed">First Name</Text>
                                <Text fw={500}>{user["user"]["firstname"]}</Text>
                            </Stack>
                        </Grid.Col>

                        <Grid.Col span={12}>
                            <Stack gap={4}>
                                <Text size="sm" c="dimmed">Last Name</Text>
                                <Text fw={500}>{user["user"]["lastname"]}</Text>
                            </Stack>
                        </Grid.Col>

                        <Grid.Col span={12}>
                            <Stack gap={4}>
                                <Text size="sm" c="dimmed">Email</Text>
                                <Text fw={500}>{user["user"]["email"]}</Text>
                            </Stack>
                        </Grid.Col>
                    </Grid>
                </Stack>
            </Paper>
        </Container>
    )
}