import React, { useEffect, useState, useCallback } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { notifications } from '@mantine/notifications'
import { LoadingOverlay } from '@mantine/core'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import CellRelationRead from './custom-cells/CellRelationRead'
import CellRelationWrite from './custom-cells/CellRelationWrite'
import CellRelationWriteMultiple from './custom-cells/CellRelationWriteMultiple'
import { constructUrl, constructFilteredUrl, getBasePopulateUrl, getRelationalValue, getAttributeType, normalizeData, isReservedColumn, isReservedAndDatetimeColumn } from './utils'
import EditConfirmationModal from './modals/EditConfirmationModal'
import { useGridEdit, getEditRowStyle } from './hooks/useGridEdit'
import CellEnumerationWrite from './custom-cells/CellEnumerationWrite'
import CellEnumerationRead from './custom-cells/CellEnumerationRead'
import CellDateRead from './custom-cells/CellDateRead'
import CellDateWrite from './custom-cells/CellDateWrite'
import Toolbar from './Toolbar'
import DeleteConfirmationModal from './modals/DeleteConfirmationModal'
import { useGridDelete } from './hooks/useGridDelete'
import { getAddRowStyle, useGridAdd } from './hooks/useGridAdd'
import CellMediaRead from './custom-cells/CellMediaRead'
import CellMediaWrite from './custom-cells/CellMediaWrite'
import { API_BASE_URL } from '../../config/config'


export default function AgGridUI({ url, onButtonClick }) {
    const { user, apiUrls } = useAuth()
    const [gridApi, setGridApi] = useState(null)
    const [mainPluralName, setMainPluralName] = useState("")
    const [rowData, setRowData] = useState([]) // [{ greet: "Hello, world!" }]
    const [colDefs, setColDefs] = useState([]) // [{ field: "greet", filter: true, editable: true, cellRenderer: CellRelationRead }]
    const [selectionData, setSelectionData] = useState({})
    const {
        editingRowIds,
        showEditModal,
        isSaving,
        handleEditInitiate,
        handleEditConfirm,
        handleSaveChanges,
        handleCancelEdit,
        setShowEditModal
    } = useGridEdit()

    const {
        isDeleting,
        showDeleteModal,
        deletingRowDocIds,
        handleDeleteInitiate,
        handleDelete,
        handleCancelDelete,
        setShowDeleteModal
    } = useGridDelete()

    const {
        newRowIds,
        isConfirming,
        addRefresh,
        handleAddInitiate,
        handleAddMore,
        handleAddSaveChanges,
        handleAddCancel
    } = useGridAdd()

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                })

                const rowArr = normalizeData(data)
                const rows = []
                const allRelations = {}
                const allEnumerations = {}
                const allDates = {}
                const allMedias = {}

                // Get attributes (cols type)
                const basePopulateUrl = getBasePopulateUrl(url)
                const modelData = apiUrls.find(data => data.url === basePopulateUrl)
                const attributes = modelData.attributes

                // To be used for creating URL that are endpoints to update data
                setMainPluralName(modelData.pluralName)

                // Set rows data
                // Loop each value of the array
                for (const rowObj of rowArr) {
                    const row = {}

                    // Loops each key (column name) of the dictionary
                    for (const key in rowObj) {
                        const attributeType = getAttributeType(key, attributes)

                        if (attributeType === "relation" && rowObj[key]) {
                            // Get correct model pluralName
                            const target = attributes[key]?.target
                            const modelName = target.split(".").pop()
                            const modelData = apiUrls.find(data => data.singularName === modelName)
                            const pluralName = modelData.pluralName

                            if (!allRelations[key]) {
                                allRelations[key] = {}
                                allRelations[key]["modelPluralName"] = pluralName
                                allRelations[key]["modelUrl"] = constructUrl(pluralName)
                            }

                            const relation = rowObj[key]
                            const relationType = attributes[key].relation

                            if (relationType === "oneToMany" || relationType === "manyToMany") {
                                // Relations of type - One-to-Many or Many-to-Many
                                // These will be a list of relations (objects). Even for a single object
                                //
                                // Structured as [column][row]
                                allRelations[key][rowObj.id] = relation.map(rl => {
                                    return {
                                        id: rl.id,
                                        url: constructFilteredUrl(pluralName, rl.documentId) || ""
                                    }
                                })

                                // Set cell display value
                                row[key] = getRelationalValue(key, relation)

                                // Add cellRenderer information (for edit mode)
                                allRelations[key]["cellRenderer"] = CellRelationWriteMultiple
                            }
                            else
                            {
                                // Relation of type - One-to-One or Many-to-One
                                // This will be a single relation object
                                //
                                // Structured as [column][row]
                                // Put this in a list, to keep things consistent
                                allRelations[key][rowObj.id] = [{
                                    id: relation.id,
                                    url: constructFilteredUrl(pluralName, relation.documentId) || ""
                                }]

                                // Set cell display value (make it array)
                                row[key] = getRelationalValue(key, [relation])

                                // Add cellRenderer information (for edit mode)
                                allRelations[key]["cellRenderer"] = CellRelationWrite
                            }
                        }

                        else if (attributeType === "enumeration" && rowObj[key]) {
                            const enumValues = attributes[key].enum
                            
                            if (!allEnumerations[key]) {
                                allEnumerations[key] = {}
                            }

                            allEnumerations[key][rowObj.id] = {
                                "all": enumValues,
                                "selected": rowObj[key]
                            }

                            // Set cell display value
                            row[key] = rowObj[key]

                            // Add cellRenderer information (for edit mode)
                            allEnumerations[key]["cellRenderer"] = CellEnumerationWrite
                        }

                        else if (attributeType === "datetime" && rowObj[key]) {
                            if (!allDates[key]) {
                                allDates[key] = {}
                            }

                            allDates[key][rowObj.id] = {
                                "date": rowObj[key]
                            }

                            // Set cell display value
                            row[key] = rowObj[key]

                            // Add cellRenderer information (for edit mode)
                            allDates[key]["cellRenderer"] = CellDateWrite
                        }

                        else if (attributeType === "media") {
                            let mediaId = null
                            let mediaName = "Not Set"
                            let mediaUrl = ""
                            
                            if (rowObj[key] && Array.isArray(rowObj[key]) && rowObj[key].length > 0) {
                                const mediaData = rowObj[key][0]
                                mediaId = mediaData?.id
                                mediaName = mediaData?.formats?.large?.name
                                mediaUrl = mediaData?.formats?.large?.url
                            }

                            if (!allMedias[key]) {
                                allMedias[key] = {}
                            }

                            allMedias[key][rowObj.id] = {
                                "mediaId": mediaId,
                                "name": mediaName,
                                "url": mediaUrl === ""? "" : `${API_BASE_URL}${mediaUrl}`
                            }

                            // Set cell display value
                            row[key] = mediaName

                            // Add cellRenderer information (for edit mode)
                            allMedias[key]["cellRenderer"] = CellMediaWrite
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
                        if (isReservedColumn(key)) {
                            return {
                                field: key,
                                filter: true,
                                editable: false,
                                cellRenderer: isReservedAndDatetimeColumn(key) && CellDateRead,
                                ...(key === "createdAt" && { sort: "desc" })
                            }
                        }

                        if (allRelations.hasOwnProperty(key)) {
                            return {
                                field: key,
                                filter: true,
                                cellRendererSelector: params => {
                                    const cellRenderer = params.colDef.cellRendererParams.colRelations.cellRenderer

                                    if (editingRowIds?.includes(params.data.id) || params.data.id < 0) {
                                        return {
                                            component: cellRenderer
                                        }
                                    }
                                    else {
                                        return {
                                            component: CellRelationRead
                                        }
                                    }
                                },
                                cellRendererParams: {
                                    colRelations: allRelations[key],
                                    onButtonClick
                                },
                                autoHeight: true
                            }
                        }

                        if (allEnumerations.hasOwnProperty(key)) {
                            return {
                                field: key,
                                filter: true,
                                cellRendererSelector: params => {
                                    const cellRenderer = params.colDef.cellRendererParams.colEnumerations.cellRenderer

                                    if (editingRowIds?.includes(params.data.id) || params.data.id < 0) {
                                        return {
                                            component: cellRenderer
                                        }
                                    }
                                    else {
                                        return {
                                            component: CellEnumerationRead
                                        }
                                    }
                                },
                                cellRendererParams: {
                                    colEnumerations: allEnumerations[key]
                                },
                                autoHeight: true
                            }
                        }

                        if (allDates.hasOwnProperty(key)) {
                            return {
                                field: key,
                                filter: true,
                                cellRendererSelector: params => {
                                    const cellRenderer = params.colDef.cellRendererParams.colDate.cellRenderer

                                    if (editingRowIds?.includes(params.data.id) || params.data.id < 0) {
                                        return {
                                            component: cellRenderer
                                        }
                                    }
                                    else {
                                        return {
                                            component: CellDateRead
                                        }
                                    }
                                },
                                cellRendererParams: {
                                    colDate: allDates[key]
                                },
                                autoHeight: true
                            }
                        }

                        if (allMedias.hasOwnProperty(key)) {
                            return {
                                field: key,
                                filter: true,
                                cellRendererSelector: params => {
                                    const cellRenderer = params.colDef.cellRendererParams.colMedia.cellRenderer

                                    if (editingRowIds?.includes(params.data.id) || params.data.id < 0) {
                                        return {
                                            component: cellRenderer
                                        }
                                    }
                                    else {
                                        return {
                                            component: CellMediaRead
                                        }
                                    }
                                },
                                cellRendererParams: {
                                    colMedia: allMedias[key]
                                },
                                autoHeight: true
                            }
                        }

                        return {
                            field: key,
                            filter: true,
                            editable: params => editingRowIds?.includes(params.data.id) || params.data.id < 0
                        }
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

    }, [url, onButtonClick, editingRowIds, deletingRowDocIds, addRefresh])

    const onSelectionChanged = () => {
        const selectedNodes = gridApi.getSelectedNodes()

        setSelectionData({
            selectedRows: selectedNodes.map(node => node.data),
            gridApi: gridApi
        })
    }

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <LoadingOverlay 
                visible={isSaving || isDeleting || isConfirming} 
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
                loaderProps={{ color: 'blue', type: 'bars' }}
            />
            <Toolbar
                selectionData={selectionData}
                isEditing={editingRowIds !== null}
                isAdding={newRowIds !== null}
                handleEdit={() => handleEditInitiate(selectionData)}
                handleDelete={() => handleDeleteInitiate(selectionData)}
                handleAdd={() => handleAddInitiate(mainPluralName, rowData, setRowData, colDefs, setColDefs)}

                onSave={() => handleSaveChanges(mainPluralName)}
                onCancel={handleCancelEdit}

                onAddSave={() => handleAddSaveChanges(mainPluralName, gridApi)}
                onAddNew={() => handleAddMore(mainPluralName, rowData, setRowData, colDefs, setColDefs)}
                onAddCancel={() => handleAddCancel(rowData, setRowData, colDefs, setColDefs)}

                disabled={isSaving || isDeleting || isConfirming}
            />
            <div style={{ flex: 1 }}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    domLayout="normal"
                    rowSelection={editingRowIds === null && newRowIds === null ? { mode: "multiRow" } : false}
                    getRowStyle={editingRowIds && getEditRowStyle(editingRowIds) || newRowIds && getAddRowStyle(newRowIds)}
                    onSelectionChanged={onSelectionChanged}
                    onGridReady={params => setGridApi(params.api)}
                />
            </div>
            <EditConfirmationModal 
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onConfirm={() => handleEditConfirm()}
            />
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={() => handleDelete(mainPluralName)}
            />
        </div>
    )
}
