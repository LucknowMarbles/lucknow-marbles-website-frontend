import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import axios from 'axios'
import { API_BASE_URL } from '../../../config/config'
import { 
    Container, 
    Paper, 
    Title, 
    Text, 
    Group, 
    Stack, 
    Badge, 
    Button, 
    MultiSelect,
    Divider,
    LoadingOverlay,
    Box
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faArrowLeft, 
    faUser, 
    faShieldHalved, 
    faKey,
    faSave
} from '@fortawesome/free-solid-svg-icons'

export default function UserDetailsPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [userData, setUserData] = useState(null)
    const [selectedRoles, setSelectedRoles] = useState([])
    const [selectedPermissions, setSelectedPermissions] = useState([])
    
    // Fetch user permissions data
    useEffect(() => {
        async function fetchUserData() {
            try {
                const { data } = await axios.get(
                    `${API_BASE_URL}/api/user/roles-permissions/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`
                        }
                    }
                )
                setUserData(data)
                
                // Set initial selections
                setSelectedRoles(data.roles.map(role => role.name))
                setSelectedPermissions(data.customPermissions.map(perm => perm.code))
            } catch (error) {
                notifications.show({
                    title: 'Error',
                    message: error.response?.data?.message || 'Failed to fetch user data',
                    color: 'red'
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchUserData()
    }, [id, user.token])

    // Handle role updates
    async function handleRolesUpdate() {
        setIsSaving(true)
        try {
            await axios.put(
                `${API_BASE_URL}/api/user/roles/${id}`,
                { roleNames: selectedRoles },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            )
            
            notifications.show({
                title: 'Success',
                message: 'Roles updated successfully',
                color: 'green'
            })
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to update roles',
                color: 'red'
            })
        } finally {
            setIsSaving(false)
        }
    }

    // Handle custom permissions updates
    async function handlePermissionsUpdate() {
        setIsSaving(true)
        try {
            await axios.put(
                `${API_BASE_URL}/api/user/custom-permissions/${id}`,
                { permissionCodes: selectedPermissions },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }
            )
            
            notifications.show({
                title: 'Success',
                message: 'Custom permissions updated successfully',
                color: 'green'
            })
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to update permissions',
                color: 'red'
            })
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading || !userData) {
        return (
            <Container size="lg" py="xl">
                <LoadingOverlay visible={true} />
            </Container>
        )
    }

    // Prepare data for MultiSelect components
    const roleOptions = [
        ...userData.roles.map(role => ({ value: role.name, label: role.name })),
        ...userData.unsetRoles.map(role => ({ value: role.name, label: role.name }))
    ]

    const permissionOptions = [
        ...userData.customPermissions.map(perm => ({ 
            value: perm.code, 
            label: perm.name,
            description: perm.description 
        })),
        ...userData.unsetPermissions.map(perm => ({ 
            value: perm.code, 
            label: perm.name,
            description: perm.description
        }))
    ]

    return (
        <Container size="lg" py="xl">
            <Stack gap="xl">
                <Group justify="space-between">
                    <Button 
                        variant="subtle" 
                        leftSection={<FontAwesomeIcon icon={faArrowLeft} />}
                        onClick={() => navigate('/users')}
                    >
                        Back to Users
                    </Button>
                </Group>

                <Paper shadow="sm" p="xl" radius="md" withBorder>
                    <Stack gap="md">
                        <Group align="center" gap="xs">
                            <FontAwesomeIcon icon={faUser} />
                            <Title order={3}>{userData.username}</Title>
                        </Group>
                        
                        <Box>
                            <Text size="sm" c="dimmed">Email</Text>
                            <Text>{userData.email}</Text>
                        </Box>
                        
                        <Divider />

                        <Stack gap="lg">
                            <Group align="center" gap="xs">
                                <FontAwesomeIcon icon={faShieldHalved} />
                                <Title order={4}>Roles</Title>
                            </Group>

                            <MultiSelect
                                data={roleOptions}
                                value={selectedRoles}
                                onChange={setSelectedRoles}
                                label="Assigned Roles"
                                placeholder="Select roles"
                                searchable
                            />

                            <Button 
                                onClick={handleRolesUpdate}
                                loading={isSaving}
                                leftSection={<FontAwesomeIcon icon={faSave} />}
                            >
                                Update Roles
                            </Button>
                        </Stack>

                        <Divider />

                        <Stack gap="lg">
                            <Group align="center" gap="xs">
                                <FontAwesomeIcon icon={faKey} />
                                <Title order={4}>Custom Permissions</Title>
                            </Group>

                            <MultiSelect
                                data={permissionOptions}
                                value={selectedPermissions}
                                onChange={setSelectedPermissions}
                                label="Custom Permissions"
                                placeholder="Select permissions"
                                searchable
                                description="These permissions are assigned directly to the user"
                            />

                            <Button 
                                onClick={handlePermissionsUpdate}
                                loading={isSaving}
                                leftSection={<FontAwesomeIcon icon={faSave} />}
                            >
                                Update Custom Permissions
                            </Button>
                        </Stack>

                        <Divider />

                        <Stack gap="md">
                            <Title order={4}>Permissions Summary</Title>
                            <Group gap="xs">
                                <Badge color="blue">
                                    {userData.summary.totalRoles} Roles
                                </Badge>
                                <Badge color="teal">
                                    {userData.summary.totalRolePermissions} Role Permissions
                                </Badge>
                                <Badge color="grape">
                                    {userData.summary.totalCustomPermissions} Custom Permissions
                                </Badge>
                            </Group>
                        </Stack>
                    </Stack>
                </Paper>
            </Stack>
        </Container>
    )
}
