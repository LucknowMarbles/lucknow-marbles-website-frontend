import { Group, Button } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'

export default function AddActions({ onSave, onAddNew, onCancel, disabled }) {
  return (
    <Group p="xs" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
      <Button
        size="sm"
        leftSection={<FontAwesomeIcon icon={faSave} />}
        onClick={onSave}
        loading={disabled}
      >
        Save
      </Button>
      <Button
        size="sm"
        leftSection={<FontAwesomeIcon icon={faPlus} />}
        onClick={onAddNew}
        loading={disabled}
      >
        Add More
      </Button>
      <Button
        size="sm"
        variant="light" 
        color="red"
        leftSection={<FontAwesomeIcon icon={faTimes} />}
        onClick={onCancel}
        disabled={disabled}
      >
        Cancel
      </Button>
    </Group>
  )
}