import { useRef, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { notifications } from "@mantine/notifications";
import { constructUrl, isReservedAndDatetimeColumn, isReservedColumn } from "../utils";

export function useGridAdd() {
    const { user, apiUrls } = useAuth()
    const [newRowIds, setNewRowIds] = useState(null)
    const [isConfirming, setIsConfirming] = useState(false)
    const gridApiRef = useRef(null)

    function resetState() {
        setNewRowIds(null)
    }


    function addNewRow(mainPluralName, currentRowData, setRowData, colDefs, setColDefs) {
        // Add new row
        const lastRow = currentRowData[currentRowData.length - 1]
        const newRow = { ...lastRow }
        const newId = newRowIds?.length > 0 ? newRowIds[newRowIds.length - 1] - 1 : -1

        Object.keys(newRow).forEach(key => {
            if (key === "id") {
                newRow[key] = newId
            }
            else if (key === "documentId") {
                newRow[key] = "..."
            }
            else if (isReservedAndDatetimeColumn(key)) {
                newRow[key] = Date.now()
            }
        })

        setRowData([...currentRowData, newRow])

        // Set column definitions for the new row
        const newColDefs = colDefs.map(col => ({...col}))

        // Get attributes
        const basePopulateUrl = constructUrl(mainPluralName)
        const modelData = apiUrls.find(data => data.url === basePopulateUrl)
        const attributes = modelData.attributes

        // Set initial values
        for (const col of newColDefs) {
            if (isReservedColumn(col.field))
                continue

            if (attributes.hasOwnProperty(col.field) && col.cellRendererParams) {
                const schema = attributes[col.field]

                if (schema?.type === "enumeration" && col.cellRendererParams.colEnumerations) {
                    col.cellRendererParams.colEnumerations[newId] = {
                        all: schema?.enum || [],
                        selected: schema?.enum.length >= 1 ? schema.enum[0] : ""
                    }
                }

                else if (schema?.type === "datetime" && col.cellRendererParams.colDate) {
                    col.cellRendererParams.colDate[newId] = {
                        date: Date.now()
                    }
                }

                else if (schema?.type === "relation" && col.cellRendererParams.colRelations) {
                    col.cellRendererParams.colRelations[newId] = []
                }
            }
        }

        setColDefs(newColDefs)

        // Set new ids
        if (newRowIds) {
            setNewRowIds(prev => [...prev, newRow.id])
        }
        else {
            setNewRowIds([newRow.id])
        }
    }


    function removeNewRows(currentRowData, setRowData) {
        const originalRows = currentRowData.filter(row => row.id >= 0)
        setRowData(originalRows)
    }


    function handleAddInitiate(mainPluralName, currentRowData, setRowData, colDefs, setColDefs) {
        addNewRow(mainPluralName, currentRowData, setRowData, colDefs, setColDefs)
    }

    function handleAddMore(mainPluralName, currentRowData, setRowData, colDefs, setColDefs) {
        addNewRow(mainPluralName, currentRowData, setRowData, colDefs, setColDefs)
    }

    async function handleAddSaveChanges(mainPluralName) {
        setIsConfirming(true)

        try {

            await new Promise(resolve => setTimeout(resolve, 2000))
            resetState()
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
            setIsConfirming(false)
        }
    }

    function handleAddCancel(currentRowData, setRowData, colDefs, setColDefs) {
        removeNewRows(currentRowData, setRowData, colDefs, setColDefs)
        resetState()
    }

    return {
        newRowIds,
        isConfirming,
        handleAddInitiate,
        handleAddMore,
        handleAddSaveChanges,
        handleAddCancel
    }
}


export const getAddRowStyle = (newRowIds) => (params) => {
    if (newRowIds?.includes(params.data.id)) {
        return { 
            backgroundColor: 'var(--mantine-color-green-1)',
            borderBottom: '1px solid var(--mantine-color-green-3)',
            borderTop: '1px solid var(--mantine-color-green-3)'
        }
    }
    
    return null
}