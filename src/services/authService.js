import axios from 'axios'
import { API_BASE_URL } from '../config/config.js'

export const loginUser = async (credentials) => {
    try {
        const { data } = await axios.post(`${API_BASE_URL}/api/user/login`, credentials)
        return data
    }
    catch (error) {
        throw error.response?.data?.error || error.message || 'Failed to login'
    }
}