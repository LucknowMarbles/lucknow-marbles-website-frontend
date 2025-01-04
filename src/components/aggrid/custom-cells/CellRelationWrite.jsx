import React, { useState, useEffect } from 'react'
import { Select, Loader } from '@mantine/core'

export default function CellRelationWrite(props) {
    const { data, colDef } = props
    
    // Get the relation data from AG-Grid
    const relation = colDef.cellRendererParams?.colRelations?.[data.id][0] || null

    // Initialize states
    const [selectedItem, setSelectedItem] = useState("")
    const [options, setOptions] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate API call
        async function fetchOptions() {
            setIsLoading(true)

            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1500))

                if (relation) {
                    const relationOption = {
                        value: relation.id.toString(),
                        label: `Item ${relation.id}`
                    }
                    
                    setOptions([relationOption])
                    setSelectedItem(relationOption.value)
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