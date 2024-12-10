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

export default function ProductsPage() {
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
        <div className="products-page">
            <TopProgressBar isLoading={loading} />
            {!isAIPanelVisible && (
                <button className="toggle-ai-panel" onClick={toggleAIPanel}>
                    <FontAwesomeIcon icon={faLightbulb} />
                </button>
            )}
            <div className="main-content">
                <div className="container">
                    <h1>Add New Product</h1>

                    <form className="product-form">

                        {/* Basic Information Card */}
                        <div className="form-card">
                            <h2>Basic Information</h2>
                            <div className="form-group">
                                <label htmlFor="productName">Product Name</label>
                                <input
                                    type="text"
                                    id="productName"
                                    name="productName"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="4"
                                    value={productDescription}
                                    onChange={(e) => setProductDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Pricing and Inventory Card */}
                        <div className="form-card">
                            <h2>Pricing & Inventory</h2>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="price">Price</label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        min="0"
                                        step="0.01"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="quantity">Quantity</label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        min="0"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Media Card */}
                        <div className="form-card">
                            <h2>Product Image</h2>
                            <div className="form-group">
                                <div className="image-upload">
                                    <input
                                        type="file"
                                        accept=".jpg,.png"
                                        id="productImage"
                                        hidden
                                        onChange={handleImageSelect}
                                    />
                                    <label htmlFor="productImage" className="upload-label">
                                        {imageUrl && (
                                            <img src={imageUrl} alt="Product preview" className="image-preview" />
                                        )}
                                    </label>
                                    {imageUploadStatus.isUploading && (
                                        <div className="upload-progress">
                                            <div
                                                className="progress-bar"
                                                style={{ width: `${imageUploadStatus.progress}%` }}
                                            />
                                            <span>{imageUploadStatus.progress}%</span>
                                        </div>
                                    )}
                                    {imageUploadStatus.error && (
                                        <span className="error-message">{imageUploadStatus.error}</span>
                                    )}
                                    <span className="file-info">JPG or PNG, file size should not be more than 5MB</span>
                                </div>
                            </div>
                        </div>

                        {/* Categories and Tags Card */}
                        <div className="form-card">
                            <h2>Classification</h2>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="category">Category</label>
                                    <select id="category" name="category" required value={category} onChange={(e) => setCategory(e.target.value)}>
                                        <option value="">Select Category</option>
                                        <option value="furniture">Furniture</option>
                                        <option value="electronics">Electronics</option>
                                        <option value="clothing">Clothing</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="tags">Tags</label>
                                    <select id="tags" name="tags" required value={tags} onChange={(e) => setTags(e.target.value)}>
                                        <option value="">Select Tags</option>
                                        <option value="new">New</option>
                                        <option value="featured">Featured</option>
                                        <option value="sale">Sale</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="ecommerce">ECommerce</label>
                                <select id="ecommerce" name="ecommerce" required value={isEcommerce} onChange={(e) => setIsEcommerce(e.target.value)}>
                                    <option value="">Select Choice</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                        </div>

                        {/* SEO Card */}
                        <div className="form-card">
                            <h2>SEO Information</h2>
                            <div className="form-group">
                                <label htmlFor="metaTitle">Meta Title</label>
                                <input
                                    type="text"
                                    id="metaTitle"
                                    name="metaTitle"
                                    required
                                    value={metaTitle}
                                    onChange={(e) => setMetaTitle(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="metaDescription">Meta Description</label>
                                <textarea
                                    id="metaDescription"
                                    name="metaDescription"
                                    rows="3"
                                    required
                                    value={metaDescription}
                                    onChange={(e) => setMetaDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Adding Product...' : 'Add Product'}
                        </button>
                    </form>
                </div>
            </div>

            {isAIPanelVisible && (
                <div className="ai-panel">
                    <button className="close-ai-panel" onClick={toggleAIPanel}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <div className="ai-content form-group">
                        <h2>AI Content Generator</h2>
                        <div className="ai-controls">
                            <select
                                value={selectedAIOption}
                                onChange={(e) => setSelectedAIOption(e.target.value)}
                            >
                                <option>Product Description</option>
                                <option>SEO Content</option>
                                <option>Product Features</option>
                            </select>
                            <button type="button" className="generate-btn">Generate</button>
                        </div>
                        <div className="generated-content">
                            <textarea
                                value={generatedContent}
                                readOnly
                                rows="8"
                                placeholder="Generated content will appear here..."
                            />
                            <button
                                type="button"
                                className="copy-btn"
                                onClick={handleCopyContent}
                            >
                                <FontAwesomeIcon icon={faCopy} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}