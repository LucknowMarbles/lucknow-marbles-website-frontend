import { Container, Title, Text, Button, Stack, Group } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
    const navigate = useNavigate()

    return (
        <Container size="md" py="xl">
            <Stack align="center" spacing="lg">
                <FontAwesomeIcon 
                    icon={faCircleExclamation} 
                    size="4x" 
                    style={{ color: 'var(--mantine-color-blue-6)' }}
                />
                
                <Title order={1} size="4rem" fw={900}>404</Title>
                
                <Group align="center" gap="xs">
                    <Title order={2}>Page Not Found</Title>
                </Group>

                <Text c="dimmed" size="lg" ta="center">
                    The page you're looking for doesn't exist or has been moved.
                </Text>

                <Button
                    size="md"
                    leftSection={<FontAwesomeIcon icon={faHome} />}
                    onClick={() => navigate('/')}
                >
                    Back to Home
                </Button>
            </Stack>
        </Container>
    )
}