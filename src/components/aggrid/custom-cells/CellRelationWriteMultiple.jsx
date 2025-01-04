import React, { useState, useEffect } from 'react'
import { MultiSelect, Loader } from '@mantine/core'

export default function CellRelationWriteMultiple(props) {
    const { data, colDef } = props

    // Get the relation data from AG-Grid
    const relations = colDef.cellRendererParams?.colRelations?.[data.id] || null

    // Initialize states
    const [selectedItems, setSelectedItems] = useState([])
    const [options, setOptions] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate API call
        async function fetchOptions() {
            setIsLoading(true)

            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1500))

                if (relations) {
                    const relationOptions = relations.map(relation => ({
                        value: relation.id.toString(),
                        label: `Item ${relation.id}`
                    }))

                    setOptions(relationOptions)
                    setSelectedItems(relationOptions.map(relationOp => relationOp.value))
                }
            }
            catch(error) {
                console.error("Error loading options:", error)
            }
            finally {
                setIsLoading(false)
            }
        }

        fetchOptions()

    }, [relations])


    function handleChange(newValues) {
        setSelectedItems(newValues)
    }

    return (
        <MultiSelect
            data={options}
            value={selectedItems}
            onChange={handleChange}
            placeholder="Select items..."
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