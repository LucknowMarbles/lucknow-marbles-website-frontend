const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to register user")
        }

        const data = await response.json()
        return data
    }
    catch (error) {
        throw error;
    }
}