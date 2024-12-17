import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import axios from 'axios'
import { API_BASE_URL } from '../../../config/config'
import {
  Container,
  Title,
  Paper,
  Stack,
  Group,
  Text,
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
  faUser,
  faEnvelope,
  faPhone,
  faUserTag,
  faSave
} from '@fortawesome/free-solid-svg-icons'

export default function UserDetailsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // State for role and permission selection
  const [selectedRoles, setSelectedRoles] = useState([])
  const [selectedCustomPermissions, setSelectedCustomPermissions] = useState([])

  useEffect(() => {
    fetchUserPermissions()
  }, [id])

  async function fetchUserPermissions() {
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
      setSelectedCustomPermissions(data.customPermissions.map(perm => perm.code))
    }
    catch (error) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to fetch user permissions',
        color: 'red'
      })
    }
    finally {
      setIsLoading(false)
    }
  }

  async function handleSavePermissions() {
    setIsSaving(true)
    try {
      // Update roles
      await axios.put(
        `${API_BASE_URL}/api/user/roles/${id}`,
        { roleNames: selectedRoles },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )

      // Update custom permissions
      await axios.put(
        `${API_BASE_URL}/api/user/custom-permissions/${id}`,
        { permissionCodes: selectedCustomPermissions },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      )

      notifications.show({
        title: 'Success',
        message: 'Permissions updated successfully',
        color: 'green'
      })

      // Refresh data
      await fetchUserPermissions()
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
    ...new Set([
      ...selectedRoles,
      ...userData.roles.map(role => role.name)
    ])
  ].map(role => ({
    value: role,
    label: role.charAt(0).toUpperCase() + role.slice(1)
  }))

  const permissionOptions = [
    ...userData.customPermissions,
    ...userData.unsetPermissions
  ].map(perm => ({
    value: perm.code,
    label: perm.name,
    description: perm.description
  }))

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Paper shadow="sm" p="md" withBorder>
          <Stack gap="md">
            <Title order={2}>
              <Group gap="xs">
                <FontAwesomeIcon icon={faUser} />
                <Text>User Details</Text>
              </Group>
            </Title>

            <Group gap="xl">
              <Group gap="xs">
                <FontAwesomeIcon icon={faUser} />
                <Text fw={500}>{userData.username}</Text>
              </Group>
              <Group gap="xs">
                <FontAwesomeIcon icon={faEnvelope} />
                <Text>{userData.email}</Text>
              </Group>
              {userData.phoneNumber && (
                <Group gap="xs">
                  <FontAwesomeIcon icon={faPhone} />
                  <Text>{userData.phoneNumber}</Text>
                </Group>
              )}
            </Group>
          </Stack>
        </Paper>

        <Paper shadow="sm" p="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={3}>
                <Group gap="xs">
                  <FontAwesomeIcon icon={faUserTag} />
                  <Text>Roles & Permissions</Text>
                </Group>
              </Title>
              <Button
                leftSection={<FontAwesomeIcon icon={faSave} />}
                onClick={handleSavePermissions}
                loading={isSaving}
              >
                Save Changes
              </Button>
            </Group>

            <Box>
              <Text fw={500} mb="xs">Roles</Text>
              <MultiSelect
                data={roleOptions}
                value={selectedRoles}
                onChange={setSelectedRoles}
                placeholder="Select roles"
                searchable
                clearable
              />
            </Box>

            <Divider />

            <Box>
              <Text fw={500} mb="xs">Custom Permissions</Text>
              <MultiSelect
                data={permissionOptions}
                value={selectedCustomPermissions}
                onChange={setSelectedCustomPermissions}
                placeholder="Select permissions"
                searchable
                clearable
              />
            </Box>

            <Box>
              <Text fw={500} mb="xs">Permission Summary</Text>
              <Group gap="xs">
                <Badge color="blue">
                  {userData.summary.totalRoles} Roles
                </Badge>
                <Badge color="green">
                  {userData.summary.totalRolePermissions} Role Permissions
                </Badge>
                <Badge color="violet">
                  {userData.summary.totalCustomPermissions} Custom Permissions
                </Badge>
                <Badge color="gray">
                  {userData.summary.totalUnsetPermissions} Unset Permissions
                </Badge>
              </Group>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}
