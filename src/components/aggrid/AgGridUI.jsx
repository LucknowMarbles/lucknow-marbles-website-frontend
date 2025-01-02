import React, { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { notifications } from '@mantine/notifications'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import RelationCellRead from './custom-cells/RelationCellRead'
import { constructFilteredUrl, getRelationalValue, isRelationalField } from './utils'
import EditConfirmationModal from './modals/EditConfirmationModal'
import EditActions from './EditActions'
import { useGridEdit, getEditRowStyle } from './hooks/useGridEdit'


export default function AgGridUI({ url, onButtonClick }) {
    const { user } = useAuth()
    const [rowData, setRowData] = useState([]) // [{ greet: "Hello, world!" }]
    const [colDefs, setColDefs] = useState([]) // [{ field: "greet", filter: true, editable: true, cellRenderer: RelationCellRead }]
    const {
        editingRowId,
        showEditModal,
        selectedRow,
        handleOnCellDoubleClicked,
        handleEditConfirm,
        handleSaveChanges,
        handleCancelEdit,
        setShowEditModal
    } = useGridEdit()

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                })

                const rowArr = data.data
                const rows = []
                const allRelations = {}

                // Set rows data
                // Loop each value of the array
                for (const rowObj of rowArr) {
                    const row = {}

                    // Loops each key (column name) of the dictionary
                    for (const key in rowObj) {
                        if (isRelationalField(key, rowObj[key])) {
                            if (!allRelations[key]) {
                                allRelations[key] = {}
                            }

                            const relation = rowObj[key]

                            if (Array.isArray(relation)) {
                                // Relations of type - One-to-Many or Many-to-Many
                                // These will be a list of relations (objects). Even for a single object
                                //
                                // Structured as [column][row]
                                allRelations[key][rowObj.id] = relation.map(rl => {
                                    return {
                                        id: rl.id,
                                        url: constructFilteredUrl(key, rowObj[key]) || ""
                                    }
                                })

                                // Set cell display value
                                row[key] = getRelationalValue(key, relation)
                            }
                            else
                            {
                                // Relation of type - One-to-One or Many-to-One
                                // This will be a single relation object
                                //
                                // Structured as [column][row]
                                // Put this in a list, to keep things consistent
                                allRelations[key][rowObj.id] = [{
                                    "id": relation.id,
                                    "url": constructFilteredUrl(key, rowObj[key]) || ""
                                }]

                                // Set cell display value (make it array)
                                row[key] = getRelationalValue(key, [relation])
                            }
                        }

                        else if (key === "Image" && Array.isArray(rowObj[key])) {
                            row[key] = rowObj[key][0]?.url || null // Display image url if found
                        }

                        else {
                            row[key] = rowObj[key] // Simple string
                        }

                    }

                    rows.push(row)
                }

                setRowData(rows)

                // Set columns definitions
                let cols = []

                if (rowArr.length > 0) {
                    const keys = Object.keys(rowArr[0])

                    cols = keys.map(key => {
                        if (allRelations.hasOwnProperty(key)) {
                            return {
                                field: key,
                                filter: true,
                                cellRenderer: RelationCellRead,
                                cellRendererParams: {
                                    colRelations: allRelations[key],
                                    onButtonClick
                                }
                            }
                        }

                        return { field: key, filter: true, editable: false }
                    })
                }

                setColDefs(cols)
            }
            catch (error) {
                console.error('Error fetching data:', error)
                notifications.show({
                    title: 'Error',
                    message: error.message || 'Failed to fetch data',
                    color: 'red'
                })
            }
        }

        fetchData()

    }, [url, onButtonClick])

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {editingRowId && (
                <EditActions 
                    onSave={handleSaveChanges}
                    onCancel={() => handleCancelEdit(rowData, setRowData)}
                />
            )}
            <div style={{ flex: 1 }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    domLayout="normal"
                    onCellDoubleClicked={handleOnCellDoubleClicked}
                    getRowStyle={getEditRowStyle(editingRowId)}
                />
            </div>
            <EditConfirmationModal 
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onConfirm={() => setColDefs(handleEditConfirm(colDefs, selectedRow))}
            />
        </div>
    )
}
