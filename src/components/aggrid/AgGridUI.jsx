import React, { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { Button } from '@mantine/core'
import axios from 'axios'


const CustomButtonComponent = (props) => {
    const { value, data, colDef, onButtonClick } = props
    const url = colDef.cellRendererParams?.urls?.[data.id]

    return (
        <Button 
            onClick={() => onButtonClick?.(url)}
            variant="light"
        >
            {value}
        </Button>
    )
}


function constructFilteredUrl(modelName, data) {
    const baseUrl = `http://localhost:1337/api/${modelName}`
    const id = data[0].id

    return `${baseUrl}?filters[id][$eq]=${id}`
}


export default function AgGridUI({ url, onButtonClick }) {
    const [rowData, setRowData] = useState([{ greet: "Hello, world!" }])
    const [colDefs, setColDefs] = useState([{ field: "greet", filter: true, editable: true, cellRenderer: CustomButtonComponent }])

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(url)
                const items = data.data
                
                // Set the row data
                const rows = []
                const nestedColsData = {}

                for (let i = 0; i < items.length; i++) {
                    const item = items[i]
                    const row = {}

                    for (let key in item) {
                        if (Array.isArray(item[key])) {
                            row[key] = "View " + key.toUpperCase()
                            
                            if (!nestedColsData[key]) {
                                nestedColsData[key] = []
                            
                            }

                            nestedColsData[key].push(constructFilteredUrl(key, item[key]))
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
                const cols = []

                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i]

                    if (Object.keys(nestedColsData).includes(key)) {
                        cols.push({
                            field: key,
                            filter: true,
                            cellRenderer: CustomButtonComponent,
                            cellRendererParams: {
                                urls: nestedColsData[key].reduce((acc, url, index) => {
                                    acc[items[index].id] = url
                                    return acc
                                }, {}),
                                onButtonClick
                            }
                        })
                    }
                    else {
                        cols.push({ field: key, filter: true, editable: true })
                    }
                }

                setColDefs(cols)
            }
            catch (error) {

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
