import React, { useState, useEffect } from 'react'
import { MultiSelect, Loader } from '@mantine/core'
import axios from 'axios'
import { useAuth } from '../../../contexts/AuthContext'
import { constructFilteredUrl } from '../utils'

export default function CellRelationWriteMultiple(props) {
    const { user } = useAuth()
    const { data, colDef } = props

    // Get the relation data from AG-Grid
    const relations = colDef.cellRendererParams?.colRelations || null

    // Initialize states
    const [selectedItems, setSelectedItems] = useState([])
    const [options, setOptions] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchOptions() {
            setIsLoading(true)

            try {
                // Get response data
                const response = await axios.get(relations.modelUrl, {
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

                    // Set selected options
                    const selections = colDef.cellRendererParams?.colRelations?.[data.id]
                    setSelectedItems(selections.map(s => s.id.toString()))
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

        if (colDef.cellRendererParams?.colRelations) {
            colDef.cellRendererParams.colRelations[data.id] = newValues.map(value => ({
                id: parseInt(value),
                url: constructFilteredUrl(colDef.cellRendererParams.colRelations.modelPluralName, value)
            }))
        }
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