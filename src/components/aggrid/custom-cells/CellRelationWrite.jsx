import React, { useState, useEffect } from 'react'
import { Select, Loader } from '@mantine/core'
import { useAuth } from '../../../contexts/AuthContext'
import axios from 'axios'

export default function CellRelationWrite(props) {
    const { user } = useAuth()
    const { data, colDef } = props
    
    // Get the relation data from AG-Grid
    const relation = colDef.cellRendererParams?.colRelations || null

    // Initialize states
    const [selectedItem, setSelectedItem] = useState("")
    const [options, setOptions] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchOptions() {
            setIsLoading(true)

            try {
                // Get response data
                const response = await axios.get(relation.modelUrl, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                })

                // Get ids from response data
                const rowArr = response.data.data
                const ids = rowArr.map(row => row.id)

                if (ids) {
                    const relationOptions = ids.map(id => ({
                        value: id.toString(),
                        label: `ID: ${id}`
                    }))

                    setOptions(relationOptions)

                    // Set selected option
                    const selection = colDef.cellRendererParams?.colRelations?.[data.id]
                    setSelectedItem(selection[0].id.toString())
                }
            }
            catch (error) {
                console.error('Error loading options:', error)
            }
            finally {
                setIsLoading(false)
            }
        }

        fetchOptions()
    
    }, [relation])


    function handleChange(newValue) {
        setSelectedItem(newValue)
    }

    return (
        <Select
            data={options}
            value={selectedItem}
            onChange={handleChange}
            placeholder="Select an item..."
            searchable
            clearable
            rightSection={isLoading ? <Loader size="xs" /> : null}
            disabled={isLoading}
            styles={{
                root: {
                    width: '100%',
                    height: '100%'
                },
                input: {
                    height: '100%',
                    minHeight: '36px',
                    border: 'none'
                },
                rightSection: {
                    pointerEvents: 'none'
                }
            }}
        />
    )
}