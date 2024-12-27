import React, { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { notifications } from '@mantine/notifications'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import RelationCellRead from './custom-cells/RelationCellRead'
import { constructFilteredUrl, getRelationalValue, isRelationalField } from './utils'


export default function AgGridUI({ url, onButtonClick }) {
    const { user } = useAuth()
    const [rowData, setRowData] = useState([]) // [{ greet: "Hello, world!" }]
    const [colDefs, setColDefs] = useState([]) // [{ field: "greet", filter: true, editable: true, cellRenderer: RelationCellRead }]

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                })
                const items = data.data
                
                const rows = []
                const nestedColsData = {}
                const nestedItemsData = {}

                for (let i = 0; i < items.length; i++) {
                    const item = items[i]
                    const row = {}

                    for (let key in item) {
                        if (isRelationalField(key, item[key])) {
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
                        else if (key === 'Image' && Array.isArray(item[key])) {
                            row[key] = item[key][0]?.url || null
                        }
                        else {
                            row[key] = item[key]
                        }
                    }

                    rows.push(row)
                }

                setRowData(rows)

                // Set the column definitions
                let cols = []

                if (items.length > 0) {
                    const keys = Object.keys(items[0])
                    cols = keys.map(key => {
                        if (Object.keys(nestedColsData).includes(key)) {
                            return {
                                field: key,
                                filter: true,
                                cellRenderer: RelationCellRead,
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
        <div style={{ height: '100%' }}>
            <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
                domLayout="normal"
            />
        </div>
    )
}
