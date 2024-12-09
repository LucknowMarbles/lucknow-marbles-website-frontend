import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faTimes, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react'
import '../../styles/pages/features/ProductsPage.css'

export default function ProductsPage() {
    const [selectedAIOption, setSelectedAIOption] = useState('Product Description')
    const [generatedContent, setGeneratedContent] = useState('')
    const [isAIPanelVisible, setIsAIPanelVisible] = useState(false)

    const handleCopyContent = () => {
        navigator.clipboard.writeText(generatedContent)
    }

    const toggleAIPanel = () => {
        setIsAIPanelVisible(!isAIPanelVisible)
    }

    return (
        <div className="products-page">
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
                                <input type="text" id="productName" name="productName" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" name="description" rows="4" />
                            </div>
                        </div>

                        {/* Pricing and Inventory Card */}
                        <div className="form-card">
                            <h2>Pricing & Inventory</h2>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="price">Price</label>
                                    <input type="number" id="price" name="price" min="0" step="0.01" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="quantity">Quantity</label>
                                    <input type="number" id="quantity" name="quantity" min="0" />
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
                                    />
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
                                    <select id="category" name="category" required>
                                        <option value="">Select Category</option>
                                        <option value="furniture">Furniture</option>
                                        <option value="electronics">Electronics</option>
                                        <option value="clothing">Clothing</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="tags">Tags</label>
                                    <select id="tags" name="tags" required>
                                        <option value="">Select Tags</option>
                                        <option value="new">New</option>
                                        <option value="featured">Featured</option>
                                        <option value="sale">Sale</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="ecommerce">ECommerce</label>
                                <select id="ecommerce" name="ecommerce" required>
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
                                <input type="text" id="metaTitle" name="metaTitle" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="metaDescription">Meta Description</label>
                                <textarea id="metaDescription" name="metaDescription" rows="3" required />
                            </div>
                        </div>

                        <button type="submit" className="submit-btn">Add Product</button>
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