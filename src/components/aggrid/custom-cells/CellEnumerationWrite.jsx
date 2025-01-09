import { Select } from "@mantine/core"
import { useEffect, useState } from "react"

export default function CellEnumerationWrite(props) {
    const { data, colDef } = props

    // Get the enumeration data from AG-Grid
    const enumeration = colDef.cellRendererParams?.colEnumerations || null

    // Initialize states
    const [selectedItem, setSelectedItem] = useState("")
    const [options, setOptions] = useState([])


    useEffect(() => {
        // Get data
        const enumData = enumeration[data.id]

        const enumOptions = enumData.all.map(enumOp => {
            return {
                value: enumOp,
                label: enumOp
            }
        })

        const selection = enumData.selected

        // Set data
        setOptions(enumOptions)
        setSelectedItem(selection)

    }, [enumeration])


    function handleChange(newValue) {
        setSelectedItem(newValue)

        if (colDef.cellRendererParams?.colEnumerations) {
            colDef.cellRendererParams.colEnumerations[data.id].selected = newValue
        }
    }

    return (
        <Select
            data={options}
            value={selectedItem}
            onChange={handleChange}
            placeholder="Select an option..."
            searchable
            allowDeselect={false}
            styles={{
                root: {
                    width: "100%",
                    height: "100%"
                },
                input: {
                    height: "100%",
                    minHeight: "36px",
                    border: "none"
                }
            }}
        />
    )
}