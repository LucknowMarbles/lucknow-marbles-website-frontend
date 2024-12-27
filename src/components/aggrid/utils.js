import pluralize from 'pluralize'
import { API_BASE_URL } from '../../config/config'


export function constructFilteredUrl(modelName, data) {
    const pluralModelName = pluralize(modelName)
    const baseUrl = `${API_BASE_URL}/api/${pluralModelName}`
    
    const id = Array.isArray(data) && data.length > 0 ? data[0].id : data?.id
    if (!id) return null
    
    return `${baseUrl}?populate=*&filters[id][$eq]=${id}`
}


export function isRelationalField(fieldName, value) {
    // Exclude Image field from being treated as a relation
    if (fieldName === 'Image') {
        return false
    }

    // Check for array of relations
    if (Array.isArray(value)) {
        return true
    }
    
    // Check for relation object (will have id)
    if (value && typeof value === 'object' && 'id' in value) {
        return true
    }

    return false
}


export function getRelationalValue(key, value) {
    if (Array.isArray(value)) {
        return `View ${value.length} ${key.toUpperCase()}`
    }
    
    // Check for single relation
    if (value && 'id' in value) {
        return `View ${key.toUpperCase()}`
    }

    return null
}