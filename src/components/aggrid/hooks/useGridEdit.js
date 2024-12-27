import { useState } from 'react'

export function useGridEdit() {
    const [editingRowId, setEditingRowId] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null)
    const [rowDataBeforeEdit, setRowDataBeforeEdit] = useState(null)

    function handleOnCellDoubleClicked(params) {
        if (!editingRowId && !showEditModal) {
            setSelectedRow(params.node.data)
            setShowEditModal(true)
        }
    }

    function handleEditConfirm(colDefs, selectedRow) {
        setShowEditModal(false)
        setEditingRowId(selectedRow.id)
        setRowDataBeforeEdit({ ...selectedRow })
        
        return colDefs.map(col => ({
            ...col,
            editable: (params) => {
                return params.data.id === selectedRow.id && 
                       !Object.keys(col.cellRendererParams || {}).includes('urls')
            }
        }))
    }

    function handleSaveChanges() {
        resetEditingState()
    }

    function handleCancelEdit(rowData, setRowData) {
        setRowData(rowData.map(row => 
            row.id === editingRowId ? rowDataBeforeEdit : row
        ))
        resetEditingState()
    }

    function resetEditingState() {
        setEditingRowId(null)
        setRowDataBeforeEdit(null)
        return (colDefs) => colDefs.map(col => ({
            ...col,
            editable: false
        }))
    }

    return {
        editingRowId,
        showEditModal,
        selectedRow,
        handleOnCellDoubleClicked,
        handleEditConfirm,
        handleSaveChanges,
        handleCancelEdit,
        resetEditingState,
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