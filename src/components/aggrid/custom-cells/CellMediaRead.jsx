import { Anchor } from "@mantine/core"

export default function CellMediaRead(props) {
    const { data, colDef } = props

    // Get image data from AG-Grid
    const mediaData = colDef.cellRendererParams?.colMedia || null
    const { name, url } = mediaData[data.id]


    if (url === "") {
        return <p>{name}</p>
    }


    return (
        <Anchor
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            style={{ textDecoration: 'none' }}
        >
            {name}
        </Anchor>
    )
}