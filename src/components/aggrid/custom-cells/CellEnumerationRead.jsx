import { Badge } from "@mantine/core"

export default function CellEnumerationRead(props) {
    const { value } = props

    return (
        <Badge variant="light">
            {value}
        </Badge>
    )
}