import { API_BASE_URL } from "./config"

export const apiUrls = [
    {
        route: "/data/addresses",
        url: `${API_BASE_URL}/api/addresses?populate=*`
    },
    {
        route: "/data/contacts",
        url: `${API_BASE_URL}/api/contacts?populate=*`
    },
    {
        route: "/data/products",
        url: `${API_BASE_URL}/api/products?populate=*`
    },
    {
        route: "/data/batches",
        url: `${API_BASE_URL}/api/batches?populate=*`
    },
    {
        route: "/data/transfers",
        url: `${API_BASE_URL}/api/transfers?populate=*`
    }
]