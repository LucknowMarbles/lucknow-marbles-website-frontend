import { Group, Button } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import EditActions from './EditActions'

export default function Toolbar({ selectionData = {}, isEditing, handleEdit, onSave, onCancel, disabled }) {
  const selectedRows = selectionData.selectedRows
  const hasSelection = selectedRows? selectedRows.length > 0 : 0

  if (isEditing) {
    return <EditActions
      onSave={onSave}
      onCancel={onCancel}
      disabled={disabled}
    />
  }

  return (
    <Group p="xs" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
      {!hasSelection ? (
        <Button
          size="sm"
          leftSection={<FontAwesomeIcon icon={faPlus} />}
        >
          Add Item
        </Button>
      ) : (
        <>
          <Button
            size="sm"
            leftSection={<FontAwesomeIcon icon={faPen} />}
            onClick={handleEdit}
          >
            Edit {selectedRows?.length > 1 ? `(${selectedRows.length} items)` : ''}
          </Button>
          <Button
            size="sm"
            color="red"
            variant="light"
            leftSection={<FontAwesomeIcon icon={faTrash} />}
          >
            Remove {selectedRows?.length > 1 ? `(${selectedRows.length} items)` : ''}
          </Button>
        </>
      )}
    </Group>
  )
}