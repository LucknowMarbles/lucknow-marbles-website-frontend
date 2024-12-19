import React, { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { Button } from '@mantine/core'
import axios from 'axios'


const CustomButtonComponent = (props) => {
    return <Button onClick={() => window.alert('clicked')}>{props.value}</Button>
}


export default function AgGridUI({ url }) {
    const [rowData, setRowData] = useState([{ greet: "Hello, world!" }])
    const [colDefs, setColDefs] = useState([{ field: "greet", filter: true, editable: true, cellRenderer: CustomButtonComponent }])

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get(url)
                const items = data.data
                
                // Set the row data
                const rows = []
                const nestedFields = []

                for (let i = 0; i < items.length; i++) {
                    const item = items[i]
                    const row = {}

                    for (let key in item) {
                        if (Array.isArray(item[key])) {
                            nestedFields.push(key)
                            row[key] = "View " + key.toUpperCase()
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

                    if (nestedFields.includes(key)) {
                        cols.push({ field: key, filter: true, cellRenderer: CustomButtonComponent })
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

    }, [])

    return (
        <div style={{ height: 500 }}>
            <AgGridReact
                rowData={rowData}
                columnDefs={colDefs}
            />
        </div>
    )
}
