import { API_BASE_URL } from '../../config/config'


export function constructUrl(pluralName) {
    return `${API_BASE_URL}/api/${pluralName}?populate=*`
}


export function constructFilteredUrl(modelName, data) {
    const baseUrl = `${API_BASE_URL}/api/${modelName}`
    
    const id = Array.isArray(data) && data.length > 0 ? data[0].id : data?.id
    if (!id) return null
    
    return `${baseUrl}?populate=*&filters[id][$eq]=${id}`
}


export function getBasePopulateUrl(url) {
    try {
        const urlObj = new URL(url)
        const populate = urlObj.searchParams.get('populate')
        return populate ? `${urlObj.origin}${urlObj.pathname}?populate=${populate}` : `${urlObj.origin}${urlObj.pathname}`
    }
    catch(error) {
        console.log("Invalid URL:", error)
        return null
    }
}


export function getRelationalValue(key, value) {
    if (Array.isArray(value)) {
        return `View ${value.length} ${key.toUpperCase()}`
    }

    return null
}