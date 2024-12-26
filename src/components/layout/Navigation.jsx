import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
    Group,
    Button,
    Text,
    Container,
    Menu,
    UnstyledButton
} from '@mantine/core'

export default function Navigation() {
    const { user, logout } = useAuth()

    return (
        <Container size="lg" h="100%">
            <Group h="100%" justify="space-between">
                <Text 
                    component={Link} 
                    to="/"
                    size="lg"
                    fw={700}
                    c="blue.6"
                    style={{ textDecoration: 'none' }}
                >
                    Lucknow Marbles
                </Text>

                <Group gap="sm">
                    {user ? (
                        <>
                            <Menu position="bottom-end" withArrow>
                                <Menu.Target>
                                    <UnstyledButton>
                                        <Text fw={500} c="blue.7">
                                            {user.username}
                                        </Text>
                                    </UnstyledButton>
                                </Menu.Target>

                                <Menu.Dropdown w={150}>
                                    <Menu.Item component={Link} to="/profile">
                                        Profile
                                    </Menu.Item>
                                    <Menu.Item c="red" onClick={logout}>
                                        Logout
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Button
                                component={Link}
                                to="/login"
                                variant="subtle"
                                color="blue"
                                size="sm"
                            >
                                Login
                            </Button>
                        </>
                    )}
                </Group>
            </Group>
        </Container>
    )
}