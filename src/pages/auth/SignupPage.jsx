import { Container, Paper } from '@mantine/core'
import SignupForm from './components/SignupForm'

export default function SignupPage() {
    return (
        <Container size="sm" py="xl">
            <Paper radius="md" p="xl" withBorder>
                <SignupForm />
            </Paper>
        </Container>
    )
}
