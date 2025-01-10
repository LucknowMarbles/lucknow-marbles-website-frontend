import axios from 'axios'
import { useState, useRef } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { API_BASE_URL } from '../../../config/config'
import { notifications } from '@mantine/notifications'
import { isReservedColumn } from '../utils'

export function useGridEdit() {
    const { user } = useAuth()
    const [editingRowIds, setEditingRowIds] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedRows, setSelectedRows] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const gridApiRef = useRef(null)

    function resetState() {
        setShowEditModal(false)
        setEditingRowIds(null)
        setSelectedRows(null)
    }

    function handleEditInitiate(selectionData) {
        if (!editingRowIds && !showEditModal) {
            setSelectedRows(selectionData.selectedRows)
            setShowEditModal(true)
            
            // Store grid API reference
            gridApiRef.current = selectionData.gridApi
        }
    }

    function handleEditConfirm() {
        setShowEditModal(false)
        
        const ids = selectedRows.map(row => row.id)
        setEditingRowIds(ids)
    }

    async function handleSaveChanges(mainPluralName) {
        setIsSaving(true)

        // Get the updated row data using AG Grid's API
        try {
            for (const editRowId of editingRowIds) {
                const rowNodes = []
            
                // Collect all row nodes
                gridApiRef.current.forEachNode(node => rowNodes.push(node))
                
                // Find the target row node
                const targetNode = rowNodes.find(node => node.data.id === editRowId)

                // Check if targetNode exists (it should exist, otherwise there's some problem)
                if (!targetNode) {
                    throw new Error("Could not find the row being edited")
                }
                
                // Setup updatedData; omit fields that are not to be updated, and assign remaining data to updatedData
                const updatedData = Object.keys(targetNode.data)
                    .reduce((acc, key) => {
                        if (!isReservedColumn(key)) {
                            acc[key] = targetNode.data[key]
                        }

                        return acc
                    
                    }, {})

                // Get custom cells value
                const columns = gridApiRef.current.getAllGridColumns()

                columns.forEach(column => {
                    const colDef = column.getColDef()
                    const field = column.getColId()

                    if (colDef.cellRendererSelector && colDef.cellRendererParams) {
                        // Relations
                        if ("colRelations" in colDef.cellRendererParams) {
                            const relations = colDef.cellRendererParams.colRelations || {}
                            updatedData[field] = relations[targetNode.data.id]?.map(r => r.id) || []
                        }

                        // Enumerations
                        if ("colEnumerations" in colDef.cellRendererParams) {
                            const enumerations = colDef.cellRendererParams.colEnumerations || {}
                            updatedData[field] = enumerations[targetNode.data.id]?.selected
                        }

                        // Dates
                        if ("colDate" in colDef.cellRendererParams) {
                            const dateData = colDef.cellRendererParams.colDate || {}
                            updatedData[field] = dateData[targetNode.data.id]?.date
                        }
                    }
                })

                // Make PUT request to backend
                await axios.put(
                    `${API_BASE_URL}/api/${mainPluralName}/${targetNode.data.documentId}`,
                    { data: updatedData },
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`
                        }
                    }
                )

                notifications.show({
                    title: "Success",
                    message: "Data updated successfully!",
                    color: "green"
                })

                resetState()
            }
        }
        catch (error) {
            console.error("Error updating data:", error)
            notifications.show({
                title: "Error",
                message: error.response?.data?.message || error.message || "Failed to update data",
                color: "red"
            })
        }
        finally {
            setIsSaving(false)
        }
    }

    function handleCancelEdit() {
        resetState()
    }

    return {
        editingRowIds,
        showEditModal,
        isSaving,
        handleEditInitiate,
        handleEditConfirm,
        handleSaveChanges,
        handleCancelEdit,
        setShowEditModal
    }
}


export const getEditRowStyle = (editingRowIds) => (params) => {
    if (editingRowIds?.includes(params.data.id)) {
        return { 
            backgroundColor: 'var(--mantine-color-blue-1)',
            borderBottom: '1px solid var(--mantine-color-blue-3)',
            borderTop: '1px solid var(--mantine-color-blue-3)'
        }
    }
    
    return null
}