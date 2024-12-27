import { Button, Modal, Stack } from '@mantine/core'
import React from 'react'

export default function RelationListModal({ isOpen, onClose, items, fieldName, onItemSelect }) {
    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            title={`Select ${fieldName}`}
            size="md"
        >
            <Stack>
                {items.map((item, index) => (
                    <Button
                        key={item.id || index}
                        variant="light"
                        onClick={() => {
                            onItemSelect(item)
                            onClose()
                        }}
                    >
                        {item.attributes?.name || `Item ${item.id || index + 1}`}
                    </Button>
                ))}
            </Stack>
        </Modal>
    )
}
