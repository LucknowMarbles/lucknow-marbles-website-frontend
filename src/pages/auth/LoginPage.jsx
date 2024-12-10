import { Container, Paper } from '@mantine/core'
import LoginForm from '../../components/auth/LoginForm'

export default function LoginPage() {
    return (
        <Container size="sm" py="xl">
            <Paper radius="md" p="xl" withBorder>
                <LoginForm />
            </Paper>
        </Container>
    )
}