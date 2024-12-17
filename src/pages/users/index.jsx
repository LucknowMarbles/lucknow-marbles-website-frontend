import { Container, Title, Paper, Table, Text, Group, Stack, Badge } from "@mantine/core"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { notifications } from "@mantine/notifications"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
import { useAuth } from "../../contexts/AuthContext"
import { API_BASE_URL } from "../../config/config"

export default function Users() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchUsers() {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/api/user/all`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                })
                setUsers(data)
            }
            catch (error) {
                notifications.show({
                    title: 'Error',
                    message: error.response?.data?.message || 'Failed to fetch users',
                    color: 'red'
                })
            }
            finally {
                setIsLoading(false)
            }
        }

        fetchUsers()
    
    }, [user.token])

    return (
        <Container size="lg">
            <Stack gap="xl">
                <Group justify="space-between" align="center">
                    <Title order={2}>
                        <Group gap="xs">
                            <FontAwesomeIcon icon={faUser} />
                            <Text>Users</Text>
                        </Group>
                    </Title>
                </Group>

                <Paper shadow="sm" radius="md" p="md" withBorder>
                    {isLoading ? (
                        <Text ta="center" py="xl">Loading users...</Text>
                    ) : (
                        <Table highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Username</Table.Th>
                                    <Table.Th>Email</Table.Th>
                                    <Table.Th>Phone Number</Table.Th>
                                    <Table.Th>Roles</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {users.map((user) => (
                                    <Table.Tr 
                                        key={user._id}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/users/${user._id}`)}
                                    >
                                        <Table.Td>{user.username}</Table.Td>
                                        <Table.Td>{user.email}</Table.Td>
                                        <Table.Td>{user.phoneNumber}</Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                {user.roles.map(role => (
                                                    <Badge 
                                                        key={role._id}
                                                        variant="light"
                                                        color="blue"
                                                    >
                                                        {role.name}
                                                    </Badge>
                                                ))}
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    )}
                </Paper>
            </Stack>
        </Container>
    )
}