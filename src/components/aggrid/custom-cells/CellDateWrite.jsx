import { DateTimePicker } from '@mantine/dates'
import { useEffect, useState } from "react"

export default function CellDateWrite(props) {
    const { data, colDef } = props

    // Get date from AG-Grid
    const dateData = colDef.cellRendererParams?.colDate || null

    // Initialize states
    const [selectedDate, setSelectedDate] = useState(null)


    useEffect(() => {
        const dateValue = dateData[data.id].date
        setSelectedDate(dateValue ? new Date(dateValue) : null)
    
    }, [dateData])


    const handleDateChange = (newDate) => {
        setSelectedDate(newDate)
        
        if (colDef.cellRendererParams?.colDate) {
            colDef.cellRendererParams.colDate[data.id] = { date: newDate?.toISOString() }
        }
    }


    return (
        <DateTimePicker
            withSeconds
            value={selectedDate}
            onChange={handleDateChange}
            clearable
            styles={{
                root: {
                    width: '100%',
                    height: '100%'
                },
                input: {
                    height: '100%',
                    minHeight: '36px',
                    border: 'none'
                }
            }}
        />
    )
}