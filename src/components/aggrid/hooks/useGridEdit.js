import { useState } from 'react'
import CellRelationWriteMultiple from '../custom-cells/CellRelationWriteMultiple'
import CellRelationRead from '../custom-cells/CellRelationRead'

export function useGridEdit() {
    const [editingRowId, setEditingRowId] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null)
    const [rowDataBeforeEdit, setRowDataBeforeEdit] = useState(null)

    function resetState(params = {}) {
        const { colDefs, setColDefs, rowData, setRowData } = params
        
        // Reset modal and editing states
        setShowEditModal(false)
        setEditingRowId(null)
        setSelectedRow(null)
        setRowDataBeforeEdit(null)

        // Reset column definitions if provided
        if (colDefs && setColDefs) {
            setColDefs(colDefs.map(col => ({
                ...col,
                cellRenderer: col.cellRendererParams?.colRelations ? CellRelationRead : col.cellRenderer,
                editable: false
            })))
        }

        // Reset row data if provided
        if (rowData && setRowData && editingRowId && rowDataBeforeEdit) {
            setRowData(rowData.map(row => 
                row.id === editingRowId ? rowDataBeforeEdit : row
            ))
        }
    }

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
            cellRenderer: col.cellRendererParams?.colRelations ? col.cellRendererParams.colRelations.cellRenderer : col.cellRenderer,
            editable: (params) => {
                return params.data.id === selectedRow.id && 
                       !Object.keys(col.cellRendererParams || {}).includes('colRelations')
            }
        }))
    }

    function handleSaveChanges(colDefs, setColDefs) {
        resetState({ colDefs, setColDefs })
    }

    function handleCancelEdit(rowData, setRowData, colDefs, setColDefs) {
        resetState({ rowData, setRowData, colDefs, setColDefs })
    }

    return {
        editingRowId,
        showEditModal,
        selectedRow,
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