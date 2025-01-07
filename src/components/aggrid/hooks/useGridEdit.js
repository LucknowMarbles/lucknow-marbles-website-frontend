import { useState } from 'react'

export function useGridEdit() {
    const [editingRowId, setEditingRowId] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null)

    function resetState() {
        setShowEditModal(false)
        setEditingRowId(null)
        setSelectedRow(null)
    }

    function handleOnCellDoubleClicked(params) {
        if (!editingRowId && !showEditModal) {
            setSelectedRow(params.node.data)
            setShowEditModal(true)
        }
    }

    function handleEditConfirm() {
        setShowEditModal(false)
        setEditingRowId(selectedRow.id)
    }

    function handleSaveChanges() {
        resetState()
    }

    function handleCancelEdit() {
        resetState()
    }

    return {
        editingRowId,
        showEditModal,
        handleOnCellDoubleClicked,
        handleEditConfirm,
        handleSaveChanges,
        handleCancelEdit,
        setShowEditModal
    }
}


export const getEditRowStyle = (editingRowId) => (params) => {
    if (params.data.id === editingRowId) {
        return { 
            backgroundColor: 'var(--mantine-color-blue-1)',
            borderBottom: '1px solid var(--mantine-color-blue-3)',
            borderTop: '1px solid var(--mantine-color-blue-3)'
        }
    }
    
    return null
}