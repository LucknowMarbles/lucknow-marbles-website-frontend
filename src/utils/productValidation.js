// Validation rules
const VALIDATION_RULES = {
    productName: {
        required: true,
        minLength: 3,
        maxLength: 100
    },
    productDescription: {
        required: true,
        minLength: 5,
        maxLength: 1000
    },
    price: {
        required: true,
        min: 0.01,
        max: 999999.99
    },
    quantity: {
        required: true,
        min: 0,
        max: 999999
    },
    imageFile: {
        required: true,
        allowedTypes: ['image/jpeg', 'image/png'],
        maxSize: 5 * 1024 * 1024 // 5MB
    },
    category: {
        required: true,
        allowedValues: ['furniture', 'electronics', 'clothing']
    },
    tags: {
        required: true,
        allowedValues: ['new', 'featured', 'sale']
    },
    isEcommerce: {
        required: true,
        allowedValues: ['yes', 'no']
    },
    metaTitle: {
        required: true,
        minLength: 5,
        maxLength: 60
    },
    metaDescription: {
        required: true,
        minLength: 5,
        maxLength: 500
    }
}

// Validation functions
export function validateProduct(product) {
    const errors = {}

    // Product Name
    if (!product.name) {
        errors.productName = 'Product name is required'
    }
    else if (product.name.length < VALIDATION_RULES.productName.minLength) {
        errors.productName = `Product name must be at least ${VALIDATION_RULES.productName.minLength} characters`
    }
    else if (product.name.length > VALIDATION_RULES.productName.maxLength) {
        errors.productName = `Product name cannot exceed ${VALIDATION_RULES.productName.maxLength} characters`
    }

    // Product Description
    if (!product.description) {
        errors.productDescription = 'Product description is required'
    }
    else if (product.description.length < VALIDATION_RULES.productDescription.minLength) {
        errors.productDescription = `Description must be at least ${VALIDATION_RULES.productDescription.minLength} characters`
    }
    else if (product.description.length > VALIDATION_RULES.productDescription.maxLength) {
        errors.productDescription = `Description cannot exceed ${VALIDATION_RULES.productDescription.maxLength} characters`
    }

    // Price
    const priceNum = parseFloat(product.price)
    if (!product.price) {
        errors.price = 'Price is required'
    }
    else if (isNaN(priceNum) || priceNum < VALIDATION_RULES.price.min) {
        errors.price = `Price must be at least ${VALIDATION_RULES.price.min}`
    }
    else if (priceNum > VALIDATION_RULES.price.max) {
        errors.price = `Price cannot exceed ${VALIDATION_RULES.price.max}`
    }

    // Quantity
    const quantityNum = parseInt(product.quantity)
    if (!product.quantity) {
        errors.quantity = 'Quantity is required'
    }
    else if (isNaN(quantityNum) || quantityNum < VALIDATION_RULES.quantity.min) {
        errors.quantity = 'Quantity must be a positive number'
    }
    else if (quantityNum > VALIDATION_RULES.quantity.max) {
        errors.quantity = `Quantity cannot exceed ${VALIDATION_RULES.quantity.max}`
    }

    // Image
    if (!product.imageUrl) {
        errors.imageFile = 'Product image is required'
    }

    // Category
    if (!product.category) {
        errors.category = 'Category is required'
    }
    else if (!VALIDATION_RULES.category.allowedValues.includes(product.category)) {
        errors.category = 'Invalid category selected'
    }

    // Tags
    if (!product.tags) {
        errors.tags = 'Tags are required'
    }
    else if (!VALIDATION_RULES.tags.allowedValues.includes(product.tags)) {
        errors.tags = 'Invalid tag selected'
    }

    // E-commerce
    if (!product.isEcommerce) {
        errors.isEcommerce = 'E-commerce option is required'
    }
    else if (!VALIDATION_RULES.isEcommerce.allowedValues.includes(product.isEcommerce)) {
        errors.isEcommerce = 'Invalid e-commerce option selected'
    }

    // Meta Title
    if (!product.metaTitle) {
        errors.metaTitle = 'Meta title is required'
    }
    else if (product.metaTitle.length < VALIDATION_RULES.metaTitle.minLength) {
        errors.metaTitle = `Meta title must be at least ${VALIDATION_RULES.metaTitle.minLength} characters`
    }
    else if (product.metaTitle.length > VALIDATION_RULES.metaTitle.maxLength) {
        errors.metaTitle = `Meta title cannot exceed ${VALIDATION_RULES.metaTitle.maxLength} characters`
    }

    // Meta Description
    if (!product.metaDescription) {
        errors.metaDescription = 'Meta description is required'
    }
    else if (product.metaDescription.length < VALIDATION_RULES.metaDescription.minLength) {
        errors.metaDescription = `Meta description must be at least ${VALIDATION_RULES.metaDescription.minLength} characters`
    }
    else if (product.metaDescription.length > VALIDATION_RULES.metaDescription.maxLength) {
        errors.metaDescription = `Meta description cannot exceed ${VALIDATION_RULES.metaDescription.maxLength} characters`
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
} 