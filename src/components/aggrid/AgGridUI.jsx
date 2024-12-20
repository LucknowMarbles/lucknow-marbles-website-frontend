import React, { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { Button, Modal, Stack } from '@mantine/core'
import axios from 'axios'

const RelationListModal = ({ isOpen, onClose, items, fieldName, onItemSelect }) => {
    return (
        <Modal 
            opened={isOpen} 
            onClose={onClose}
            title={`Select ${fieldName}`}
            size="md"
        >
            <Stack>
                {items.map((item, index) => (
                    <Button
                        key={item.id || index}
                        variant="light"
                        onClick={() => {
                            onItemSelect(item)
                            onClose()
                        }}
                    >
                        {item.attributes?.name || `Item ${item.id || index + 1}`}
                    </Button>
                ))}
            </Stack>
        </Modal>
    )
}

const CustomButtonComponent = (props) => {
    const { value, data, colDef } = props
    const [isModalOpen, setIsModalOpen] = useState(false)
    
    const handleClick = () => {
        const items = colDef.cellRendererParams?.items?.[data.id]

        if (Array.isArray(items) && items.length > 1) {
            setIsModalOpen(true)
        }
        else {
            const url = colDef.cellRendererParams?.urls?.[data.id]
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

function isRelationalField(value) {
    // Check for array of relations
    if (Array.isArray(value)) {
        return true
    }
    
    // Check for relation object (will have id)
    if (value && typeof value === 'object' && 'id' in value) {
        return true
    }

    return false
}

function getRelationalValue(key, value) {
    if (Array.isArray(value)) {
        return `View ${value.length} ${key.toUpperCase()}`
    }
    
    // Check for single relation
    if (value && 'id' in value) {
        return `View ${key.toUpperCase()}`
    }

    return null
}

function constructFilteredUrl(modelName, data) {
    // Get plural model name
    // TODO: This is a hack to get the plural form of the model name
    const pluralModelName = modelName.endsWith('s') ? modelName : `${modelName}s`
    const baseUrl = `http://localhost:1337/api/${pluralModelName}`
    
    // Get id from data
    const id = Array.isArray(data) ? data[0].id : data?.id

    if (!id) return null
    return `${baseUrl}?populate=*&filters[id][$eq]=${id}`
}


export default function AgGridUI({ url, onButtonClick }) {
    const [rowData, setRowData] = useState([{ greet: "Hello, world!" }])
    const [colDefs, setColDefs] = useState([{ field: "greet", filter: true, editable: true, cellRenderer: CustomButtonComponent }])

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(url)
                const items = data.data
                
                const rows = []
                const nestedColsData = {}
                const nestedItemsData = {}

                for (let i = 0; i < items.length; i++) {
                    const item = items[i]
                    const row = {}

                    for (let key in item) {
                        if (isRelationalField(item[key])) {
                            const displayValue = getRelationalValue(key, item[key])
                            row[key] = displayValue
                            
                            if (!nestedColsData[key]) {
                                nestedColsData[key] = []
                                nestedItemsData[key] = {}
                            }

                            // Handle both array and single relation cases
                            const relationData = item[key]
                            if (Array.isArray(relationData)) {
                                // For array relations (like pieces)
                                nestedItemsData[key][item.id] = relationData
                            }
                            else {
                                // For single relations (like product)
                                nestedItemsData[key][item.id] = [relationData]
                            }

                            const url = constructFilteredUrl(key, item[key])
                            if (url) {
                                nestedColsData[key].push(url)
                            }
                        }
                        else {
                            row[key] = item[key]
                        }
                    }

                    rows.push(row)
                }

                setRowData(rows)

                // Set the column definitions
                const keys = Object.keys(items[0])
                const cols = keys.map(key => {
                    if (Object.keys(nestedColsData).includes(key)) {
                        return {
                            field: key,
                            filter: true,
                            cellRenderer: CustomButtonComponent,
                            cellRendererParams: {
                                urls: nestedColsData[key].reduce((acc, url, index) => {
                                    acc[items[index].id] = url
                                    return acc
                                }, {}),
                                items: nestedItemsData[key],
                                onButtonClick
                            }
                        }
                    }

                    return { field: key, filter: true, editable: true }
                })

                setColDefs(cols)
            }
            catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()

    }, [url, onButtonClick])

    return (
        <div style={{ height: '100%' }}>
            <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                domLayout="normal"
            />
        </div>
    )
}
