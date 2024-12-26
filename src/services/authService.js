import axios from 'axios'
import { API_BASE_URL } from '../config/config.js'
import pluralize from 'pluralize'

export const loginUser = async (credentials) => {
    try {
        const { data } = await axios.post(`${API_BASE_URL}/api/auth/local`, credentials)
        return data
    }
    catch (error) {
        throw error.response?.data?.error || error.message || 'Failed to login'
    }
}


export const getContentTypes = async (token) => {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/api/content-type-builder/content-types`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        // Reduce and get only elements of type api with relevant information
        const contentTypes = data.data.reduce((result, ctype) => {
            const cTypeName = ctype.uid?.split("::")[0]

            if (cTypeName === "api") {
                result.push({
                    uid: ctype.uid,
                    apiID: ctype.apiID
                })
            }

            return result
        
        }, [])

        return contentTypes
    }
    catch (error) {
        throw error.response?.data?.error || error.message || "Failed to fetch content types"
    }
}


export const getApiUrls = async (token) => {
    const contentTypes = await getContentTypes(token)

    const apiUrls = contentTypes.map(cType => {
        const cTypeName = pluralize(cType.apiID)

        return {
            route: `/data/${cTypeName}`,
            url: `${API_BASE_URL}/api/${cTypeName}?populate=*`
        }
    })

    return apiUrls
}