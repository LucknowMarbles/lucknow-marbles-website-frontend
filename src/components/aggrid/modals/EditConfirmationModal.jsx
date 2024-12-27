import { Modal, Text, Group, Button } from '@mantine/core'

export default function EditConfirmationModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Edit Row"
      size="sm"
    >
      <Text mb="xl">Do you want to edit fields in this row?</Text>
      <Group justify="flex-end">
        <Button variant="light" onClick={onClose}>No</Button>
        <Button onClick={onConfirm}>Yes</Button>
      </Group>
    </Modal>
  )
} 