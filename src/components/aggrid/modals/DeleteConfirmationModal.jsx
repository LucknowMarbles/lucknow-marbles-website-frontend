import { Modal, Text, Group, Button } from '@mantine/core'

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Delete Row(s)"
      size="sm"
    >
      <Text mb="xl">Do you want to delete selected rows?</Text>
      <Group justify="flex-end">
        <Button variant="light" onClick={onClose}>No</Button>
        <Button onClick={onConfirm}>Yes</Button>
      </Group>
    </Modal>
  )
} 