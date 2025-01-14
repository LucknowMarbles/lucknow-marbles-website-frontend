import { Modal, Text, Group, Button } from '@mantine/core'

export default function AddConfirmationModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title="Add Row(s)"
      size="sm"
    >
      <Text mb="xl">Do you want to add new row(s)?</Text>
      <Group justify="flex-end">
        <Button variant="light" onClick={onClose}>No</Button>
        <Button onClick={onConfirm}>Yes</Button>
      </Group>
    </Modal>
  )
}