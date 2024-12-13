import { Container, Stack, Title, Text, Button } from '@mantine/core'

export function ErrorView({ error }) {
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