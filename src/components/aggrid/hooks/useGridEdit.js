import { useState, useRef } from 'react'

export function useGridEdit() {
    const [editingRowId, setEditingRowId] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const gridApiRef = useRef(null)

    function resetState() {
        setShowEditModal(false)
        setEditingRowId(null)
        setSelectedRow(null)
    }

    function handleOnCellDoubleClicked(params) {
        if (!editingRowId && !showEditModal) {
            setSelectedRow(params.node.data)
            setShowEditModal(true)
            
            // Store grid API reference
            gridApiRef.current = params.api
        }
    }

    function handleEditConfirm() {
        setShowEditModal(false)
        setEditingRowId(selectedRow.id)
    }

    async function handleSaveChanges() {
        setIsSaving(true)

        // Get the updated row data using AG Grid's API
        try {
            const rowNodes = []
            
            // Collect all row nodes
            gridApiRef.current.forEachNode(node => rowNodes.push(node))
            
            // Find the target row node
            const targetNode = rowNodes.find(node => node.data.id === editingRowId)
            
            // Get updatedData
            let updatedData = null

            if (targetNode) {
                updatedData = { ...targetNode.data }

                // Get relational cells value
                const columns = gridApiRef.current.getAllGridColumns()

                columns.forEach(column => {
                    const colDef = column.getColDef()
                    const field = column.getColId()

                    if (colDef.cellRendererSelector) {
                        const relations = colDef.cellRendererParams?.colRelations || {}
                        updatedData[field] = relations[targetNode.data.id]?.map(r => r.id) || []
                    }
                })
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))
            resetState()
        }
        finally {
            setIsSaving(false)
        }
    }

    function handleCancelEdit() {
        resetState()
    }

    return {
        editingRowId,
        showEditModal,
        isSaving,
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