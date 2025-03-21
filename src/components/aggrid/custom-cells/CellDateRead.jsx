import { Badge } from "@mantine/core"

export default function CellDateRead(props) {
    const { value } = props
    
    const formattedDate = value 
    ? new Date(value).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'medium'
    }) 
    : "-"

    return (
        <Badge 
            variant="transparent"
            size="lg"
            color="black"
            styles={{
                root: {
                    textTransform: 'none',
                    fontWeight: 'normal',
                    width: '100%',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }
            }}
        >
            {formattedDate}
        </Badge>
    )
}