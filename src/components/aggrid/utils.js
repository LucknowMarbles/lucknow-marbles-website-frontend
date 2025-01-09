import { API_BASE_URL } from '../../config/config'


export function normalizeData(data) {
    if (!data?.data) {
        throw new Error("Invalid data structure: missing data property")
    }

    // Helper to validate object structure
    function isValidDocument(obj) {
        return obj && typeof obj === "object" && "documentId" in obj
    }

    let rowArr
    const rawData = data.data

    // Handle array vs single object
    if (Array.isArray(rawData)) {
        if (!rawData.every(isValidDocument)) {
            throw new Error("Invalid data structure: array contains invalid documents")
        }

        rowArr = rawData
    }
    else if (isValidDocument(rawData)) {
        rowArr = [rawData]
    }
    else {
        throw new Error("Invalid data structure: expected an array of documents or a single document")
    }

    return rowArr
}


export function constructUrl(pluralName) {
    return `${API_BASE_URL}/api/${pluralName}?populate=*`
}


export function constructFilteredUrl(modelName, documentId) {
    const baseUrl = `${API_BASE_URL}/api/${modelName}`
    return `${baseUrl}/${documentId}?populate=*`
}


export function getBasePopulateUrl(url) {
    try {
        const urlObj = new URL(url)

        // /api/transfers/w0oi6ry85c9q4vblmgf6cuiv => ["", "api", "transfers", "w0oi6ry85c9q4vblmgf6cuiv"]
        const pathSegments = urlObj.pathname.split("/")

        if (pathSegments.length === 4) {
            pathSegments.pop()
        }

        const updatedPathname = pathSegments.join("/")

        // populate=* => *
        const populate = urlObj.searchParams.get('populate')

        return populate ?
            `${urlObj.origin}${updatedPathname}?populate=${populate}` :
            `${urlObj.origin}${updatedPathname}`
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


export function getAttributeType(key, attributes) {
    if (key in attributes)
        return attributes[key].type

    return null
}


export function isReservedColumn(colName) {
    const reservedColNames = ["id", "documentId", "publishedAt", "createdAt", "updatedAt"]
    return reservedColNames.includes(colName)
}


// Have to do this manually, because schema attributes don't contain information for these columns
export function isReservedAndDatetimeColumn(colName) {
    const reservedAndDatetimeColNames = ["publishedAt", "createdAt", "updatedAt"]
    return reservedAndDatetimeColNames.includes(colName)
}