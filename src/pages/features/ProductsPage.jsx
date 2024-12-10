import '../../styles/pages/features/ProductsPage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faTimes, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext';
import { ValidationError } from '../../utils/errorTypes';
import { Toast } from '../../utils/toast';
import axios from 'axios'
import { validateProduct } from '../../utils/productValidation'
import TopProgressBar from '../../components/common/TopProgressBar'

export default function AddProductPage() {
    const { user } = useAuth()

    const [selectedAIOption, setSelectedAIOption] = useState('Product Description')
    const [generatedContent, setGeneratedContent] = useState('')
    const [isAIPanelVisible, setIsAIPanelVisible] = useState(false)
    const [loading, setLoading] = useState(false)

    const [productName, setProductName] = useState("")
    const [productDescription, setProductDescription] = useState("")
    const [price, setPrice] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const [imageUrl, setImageUrl] = useState("")
    const [category, setCategory] = useState("")
    const [tags, setTags] = useState("")
    const [isEcommerce, setIsEcommerce] = useState("")
    const [metaTitle, setMetaTitle] = useState("")
    const [metaDescription, setMetaDescription] = useState("")

    const [imageUploadStatus, setImageUploadStatus] = useState({
        isUploading: false,
        progress: 0,
        error: null
    })


    function handleCopyContent() {
        navigator.clipboard.writeText(generatedContent)
        Toast.success('Content copied to clipboard')
    }


    function toggleAIPanel() {
        setIsAIPanelVisible(!isAIPanelVisible)
    }


    function resetFields() {
        setProductName("")
        setProductDescription("")
        setPrice(0)
        setQuantity(0)
        setImageUrl("")
        setCategory("")
        setTags("")
        setIsEcommerce("")
        setMetaTitle("")
        setMetaDescription("")
    }


    async function handleImageSelect(e) {
        const file = e.target.files[0]
        if (!file) return

        setImageUploadStatus({
            isUploading: true,
            progress: 0,
            error: null
        })

        try {
            const formData = new FormData()
            formData.append('image', file)

            const response = await axios.post('http://localhost:5001/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    )

                    setImageUploadStatus(prev => ({
                        ...prev,
                        progress
                    }))
                }
            })

            if (response.data.success) {
                setImageUrl(response.data.imageUrl)

                setImageUploadStatus({
                    isUploading: false,
                    progress: 100,
                    error: null
                })
            }
        }
        catch (error) {
            console.error('Error uploading image:', error)

            setImageUploadStatus({
                isUploading: false,
                progress: 0,
                error: error.response?.data?.error || 'Failed to upload image'
            })

            Toast.error('Failed to upload image')
        }
    }


    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)

        const productData = {
            name: productName,
            description: productDescription,
            price: price,
            quantity: quantity,
            imageUrl: imageUrl,
            category: category,
            tags: tags,
            isEcommerce: isEcommerce,
            metaTitle: metaTitle,
            metaDescription: metaDescription
        }

        try {
            const { isValid, errors } = validateProduct(productData)

            if (!isValid) {
                const firstError = Object.values(errors)[0]
                throw new ValidationError(firstError)
            }

            await axios.post('http://localhost:5001/api/products', productData, {
                headers: { Authorization: `Bearer ${user.token}` }
            })

            Toast.success('Product added successfully')
            resetFields()
        }
        catch (error) {
            if (error instanceof ValidationError) {
                Toast.error(error.message)
            }
            else {
                console.error('Error adding product:', error)
                Toast.error('An unexpected error occurred')
            }
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {/* Add a horizontal progress bar at top, when loading=true */}

            {/* Add a button to toggle the AI panel */}

            <h1>Add Product</h1>
            <form onSubmit={handleSubmit}>
                {/* Product Name and Description */}
                <input type="text" placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} required />
                <input type="text" placeholder="Product Description" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} required />
                
                {/* Price and Quantity */}
                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                
                {/* Image Upload */}
                <input type="file" accept=".jpg,.png" id="productImage" hidden onChange={handleImageSelect} />
                <label htmlFor="productImage" className="upload-label">
                    {imageUrl && (
                        <img src={imageUrl} alt="Product preview" className="image-preview" />
                    )}
                </label>
                
                {/* Category and Tags */}
                <select id="category" name="category" required value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    <option value="furniture">Furniture</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                </select>

                <select id="tags" name="tags" required value={tags} onChange={(e) => setTags(e.target.value)}>
                    <option value="">Select Tags</option>
                    <option value="new">New</option>
                    <option value="featured">Featured</option>
                    <option value="sale">Sale</option>
                </select>

                <select id="ecommerce" name="ecommerce" required value={isEcommerce} onChange={(e) => setIsEcommerce(e.target.value)}>
                    <option value="">Select E-commerce</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
                
                {/* AI Panel */}
                <select value={selectedAIOption} onChange={(e) => setSelectedAIOption(e.target.value)}>
                    <option>Product Description</option>
                    <option>SEO Content</option>
                    <option>Product Features</option>
                </select>
                <input type="text" placeholder="Meta Title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} required />
                <input type="text" placeholder="Meta Description" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} required />
                <button type="submit">Add Product</button>
            </form>
        </div>
    )
}