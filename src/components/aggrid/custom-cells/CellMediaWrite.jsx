import { Badge, Button, FileButton } from "@mantine/core"
import { useAuth } from "../../../contexts/AuthContext"
import { useState } from "react"
import { notifications } from "@mantine/notifications"
import axios from "axios"
import { API_BASE_URL } from "../../../config/config"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUpload } from "@fortawesome/free-solid-svg-icons"

export default function CellMediaWrite(props) {
    const { user } = useAuth()
    const { data, colDef } = props
    const [isUploading, setIsUploading] = useState(false)

    // Get image data from AG-Grid
    const mediaData = colDef.cellRendererParams?.colMedia || null
    const { mediaId } = mediaData[data.id]


    async function handleUpload(file) {
        if (!file)
            return

        setIsUploading(true)

        const formData = new FormData()
        formData.append("files", file)

        try {
            const response = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${user.token}`
                }
            })

            // Update the media data in AG-Grid
            if (colDef.cellRendererParams?.colMedia) {
                const uploadedFile = response.data[0]

                colDef.cellRendererParams.colMedia[data.id] = {
                    mediaId: uploadedFile.id,
                    name: uploadedFile.name,
                    url: `${API_BASE_URL}${uploadedFile.formats.large.url}`
                }
            }

            notifications.show({
                title: "Success",
                message: "Image uploaded successfully",
                color: "green"
            })
        }
        catch(error) {
            notifications.show({
                title: "Error",
                message: error.response?.data?.message || "Failed to upload image",
                color: "red"
            })
        }
        finally {
            setIsUploading(false)
        }
    }


    return (
        <>
            {mediaId ? (
                <Badge
                    variant="light"
                    size="lg"
                >
                    ID: {mediaId}
                </Badge>
            ) : (
                <FileButton
                    onChange={handleUpload}
                    accept="image/png,image/jpeg"
                    loading={isUploading}
                >
                    {(props) => (
                        <Button
                            {...props}
                            size="xs"
                            variant="light"
                            leftSection={<FontAwesomeIcon icon={faUpload} />}
                            loading={isUploading}
                        >
                            Upload
                        </Button>
                    )}
                </FileButton>
            )}
        </>
    )
}