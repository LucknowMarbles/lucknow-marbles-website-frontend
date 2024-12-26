import { Container, Stack, Title, Text, Group, Button } from '@mantine/core'
import { Link } from 'react-router-dom'

export function UnauthorizedView() {
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
                    Login to access inventory, sales, and business operations.
                </Text>

                <Group justify="center" mt="md">
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