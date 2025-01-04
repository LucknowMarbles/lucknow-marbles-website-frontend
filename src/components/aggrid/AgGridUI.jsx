import React, { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { notifications } from '@mantine/notifications'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import CellRelationRead from './custom-cells/CellRelationRead'
import CellRelationWrite from './custom-cells/CellRelationWrite'
import CellRelationWriteMultiple from './custom-cells/CellRelationWriteMultiple'
import { constructUrl, constructFilteredUrl, getBasePopulateUrl, getRelationalValue, isRelationalField } from './utils'
import EditConfirmationModal from './modals/EditConfirmationModal'
import EditActions from './EditActions'
import { useGridEdit, getEditRowStyle } from './hooks/useGridEdit'


export default function AgGridUI({ url, onButtonClick }) {
    const { user, apiUrls } = useAuth()
    const [rowData, setRowData] = useState([]) // [{ greet: "Hello, world!" }]
    const [colDefs, setColDefs] = useState([]) // [{ field: "greet", filter: true, editable: true, cellRenderer: CellRelationRead }]
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

                // Get attributes (cols type)
                const basePopulateUrl = getBasePopulateUrl(url)
                const modelData = apiUrls.find(data => data.url === basePopulateUrl)
                const attributes = modelData.attributes

                // Set rows data
                // Loop each value of the array
                for (const rowObj of rowArr) {
                    const row = {}

                    // Loops each key (column name) of the dictionary
                    for (const key in rowObj) {
                        if (isRelationalField(key, rowObj[key])) {
                            // Get correct model pluralName
                            const target = attributes[key]?.target
                            const modelName = target.split(".").pop()
                            const modelData = apiUrls.find(data => data.singularName === modelName)
                            const pluralName = modelData.pluralName

                            if (!allRelations[key]) {
                                allRelations[key] = {}
                                allRelations[key]["modelUrl"] = constructUrl(pluralName)
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
                                        url: constructFilteredUrl(pluralName, rowObj[key]) || ""
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
                                    "url": constructFilteredUrl(pluralName, rowObj[key]) || ""
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
                                cellRenderer: CellRelationRead,
                                autoHeight: true,
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
                    onSave={() => handleSaveChanges(colDefs, setColDefs)}
                    onCancel={() => handleCancelEdit(rowData, setRowData, colDefs, setColDefs)}
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
