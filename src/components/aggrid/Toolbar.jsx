import { Group, Button } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import EditActions from './EditActions'
import AddActions from './AddActions'

export default function Toolbar({ selectionData = {}, isEditing, isAdding, handleEdit, handleDelete, handleAdd, onSave, onCancel, onAddSave, onAddNew, onAddCancel, disabled }) {
  const selectedRows = selectionData.selectedRows
  const hasSelection = selectedRows? selectedRows.length > 0 : 0

  if (isEditing) {
    return <EditActions
      onSave={onSave}
      onCancel={onCancel}
      disabled={disabled}
    />
  }

  if (isAdding) {
    return <AddActions
      onSave={onAddSave}
      onAddNew={onAddNew}
      onCancel={onAddCancel}
      disabled={disabled}
    />
  }

  return (
    <Group p="xs" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
      {!hasSelection ? (
        <Button
          size="sm"
          leftSection={<FontAwesomeIcon icon={faPlus} />}
          onClick={handleAdd}
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
            onClick={handleDelete}
          >
            Delete {selectedRows?.length > 1 ? `(${selectedRows.length} items)` : ''}
          </Button>
        </>
      )}
    </Group>
  )
}