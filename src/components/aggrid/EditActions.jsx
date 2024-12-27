import { Group, Button } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons'

export default function EditActions({ onSave, onCancel }) {
  return (
    <Group p="xs" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
      <Button 
        size="sm"
        leftSection={<FontAwesomeIcon icon={faSave} />}
        onClick={onSave}
      >
        Save Changes
      </Button>
      <Button 
        size="sm"
        variant="light" 
        color="red"
        leftSection={<FontAwesomeIcon icon={faTimes} />}
        onClick={onCancel}
      >
        Cancel
      </Button>
    </Group>
  )
} 