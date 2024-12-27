import { Button } from '@mantine/core'
import React, { useState } from 'react'
import RelationListModal from '../modals/RelationListModal'
import { constructFilteredUrl } from '../utils'


export default function RelationCellRead(props) {
    const { value, data, colDef } = props
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleClick = () => {
        const items = colDef.cellRendererParams?.items?.[data.id]

        if (Array.isArray(items) && items.length > 1) {
            setIsModalOpen(true)
        }
        else {
            const url = colDef.cellRendererParams?.urls?.[data.id]

            if (url)
                props.onButtonClick?.(url)
        }
    }

    const handleItemSelect = (item) => {
        const url = constructFilteredUrl(colDef.field, [item])
        props.onButtonClick?.(url)
    }

    return (
        <>
            <Button
                onClick={handleClick}
                variant="light"
            >
                {value}
            </Button>

            <RelationListModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                items={colDef.cellRendererParams?.items?.[data.id] || []}
                fieldName={colDef.field}
                onItemSelect={handleItemSelect}
            />
        </>
    )
}
