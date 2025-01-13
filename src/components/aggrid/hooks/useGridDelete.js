import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { API_BASE_URL } from "../../../config/config";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";

export function useGridDelete() {
    const { user } = useAuth()
    const [deletingRowDocIds, setDeletingRowDocIds] = useState(null)
    const [selectedRows, setSelectedRows] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)


    function resetState() {
        setDeletingRowDocIds(null)
        setSelectedRows(null)
    }


    function handleDeleteInitiate(selectionData) {
        if (!showDeleteModal) {
            setSelectedRows(selectionData.selectedRows)
            setShowDeleteModal(true)

            const docIds = selectionData.selectedRows.map(row => row.documentId)
            setDeletingRowDocIds(docIds)
        }
    }


    async function handleDelete(mainPluralName) {
        setShowDeleteModal(false)
        setIsDeleting(true)

        try {
            const deleteUrls = deletingRowDocIds.map(documentId => `${API_BASE_URL}/api/${mainPluralName}/${documentId}`)

            for (const url of deleteUrls) {
                await axios.delete(
                    url,
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`
                        }
                    }
                )
            }

            notifications.show({
                title: "Success",
                message: "Row(s) deleted successfully!",
                color: "green"
            })

            resetState()
        }
        catch (error) {
            console.error("Error deleting data:", error)
            notifications.show({
                title: "Error",
                message: error.response?.data?.message || error.message || "Failed to update data",
                color: "red"
            })
        }
        finally {
            setIsDeleting(false)
        }
    }


    function handleCancelDelete() {
        resetState()
    }


    return {
        isDeleting,
        showDeleteModal,
        deletingRowDocIds,
        handleDeleteInitiate,
        handleDelete,
        handleCancelDelete,
        setShowDeleteModal
    }
}
