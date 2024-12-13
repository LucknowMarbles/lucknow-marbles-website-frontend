import { TextInput, NumberInput, Select, FileInput, Button, Paper, Stack, Group, Textarea, LoadingOverlay, Image } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useState, useEffect } from 'react'
import { useAuth } from '../../../../contexts/AuthContext.jsx'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { MultiSelect } from '@mantine/core'
import { API_BASE_URL } from '../../../../config/config.js'
import PermissionGate from '../../../../components/auth/PermissionGate.jsx'

export default function EditProductPage() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [imageUrl, setImageUrl] = useState("")

    const form = useForm({
        initialValues: {
            name: '',
            description: '',
            price: 0,
            quantity: 0,
            category: '',
            tags: [],
            isEcommerce: '',
            metaTitle: '',
            metaDescription: ''
        },
        validate: {
            name: (value) => (
                !value ? 'Product name is required' :
                value.length < 3 ? 'Name must be at least 3 characters' :
                value.length > 100 ? 'Name cannot exceed 100 characters' : null
            ),
            description: (value) => (
                !value ? 'Description is required' :
                value.length < 5 ? 'Description must be at least 5 characters' :
                value.length > 1000 ? 'Description cannot exceed 1000 characters' : null
            ),
            price: (value) => (
                !value ? 'Price is required' :
                value < 0.01 ? 'Price must be at least 0.01' :
                value > 999999.99 ? 'Price cannot exceed 999999.99' : null
            ),
            quantity: (value) => (
                !value ? 'Quantity is required' :
                value < 0 ? 'Quantity must be positive' :
                value > 999999 ? 'Quantity cannot exceed 999999' : null
            ),
            category: (value) => (!value ? 'Category is required' : null),
            tags: (value) => (value.length === 0 ? 'At least one tag is required' : null),
            isEcommerce: (value) => (!value ? 'E-commerce option is required' : null),
            metaTitle: (value) => (
                !value ? 'Meta title is required' :
                value.length < 5 ? 'Meta title must be at least 5 characters' :
                value.length > 60 ? 'Meta title cannot exceed 60 characters' : null
            ),
            metaDescription: (value) => (
                !value ? 'Meta description is required' :
                value.length < 5 ? 'Meta description must be at least 5 characters' :
                value.length > 500 ? 'Meta description cannot exceed 500 characters' : null
            )
        }
    })

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/products/${id}`)
                const product = response.data

                form.setValues({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    quantity: product.quantity,
                    category: product.category,
                    tags: Array.isArray(product.tags) ? product.tags : [],
                    isEcommerce: product.isEcommerce ? 'yes' : 'no',
                    metaTitle: product.metaTitle,
                    metaDescription: product.metaDescription
                })

                setImageUrl(product.imageUrl || '')
            }
            catch (error) {
                notifications.show({
                    title: 'Error',
                    message: error.message || 'Failed to fetch product details',
                    color: 'red'
                })
                navigate('/products')
            }
            finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [id, navigate])

    async function handleImageUpload(file) {
        if (!file) return

        setLoading(true)
        const formData = new FormData()
        formData.append('image', file)

        try {
            const response = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            })

            setImageUrl(response.data.url)

            notifications.show({
                title: 'Success',
                message: 'Image uploaded successfully',
                color: 'teal'
            })
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to upload image',
                color: 'red'
            })
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(values) {
        setLoading(true)

        try {
            const productData = {
                ...values,
                imageUrl
            }

            await axios.put(`${API_BASE_URL}/api/products/${id}`, productData, {
                headers: { Authorization: `Bearer ${user.token}` }
            })

            notifications.show({
                title: 'Success',
                message: 'Product has been successfully updated',
                color: 'teal',
            })

            navigate(`/products/${id}`)
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: error.response?.data?.message || 'An unexpected error occurred',
                color: 'red',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <PermissionGate requiredPermission="editProducts">
            <Paper p="md" radius="md">
                <Button
                    variant="subtle"
                    leftSection={<FontAwesomeIcon icon={faArrowLeft} />}
                    onClick={() => navigate(`/products/${id}`)}
                    mb="xl"
                >
                    Back to Product
                </Button>

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack spacing="md">
                        <TextInput
                            label="Product Name"
                            placeholder="Enter product name"
                            {...form.getInputProps('name')}
                            required
                        />

                        <Textarea
                            label="Product Description"
                            placeholder="Enter product description"
                            {...form.getInputProps('description')}
                            required
                            minRows={4}
                            resize="vertical"
                        />

                        <Group grow>
                            <NumberInput
                                label="Price"
                                placeholder="Enter price"
                                min={0}
                                precision={2}
                                {...form.getInputProps('price')}
                                required
                            />

                            <NumberInput
                                label="Quantity"
                                placeholder="Enter quantity"
                                min={0}
                                {...form.getInputProps('quantity')}
                                required
                            />
                        </Group>

                        <FileInput
                            label="Product Image"
                            placeholder="Upload image"
                            accept="image/png,image/jpeg"
                            onChange={handleImageUpload}
                        />
                        
                        <LoadingOverlay visible={loading} />
                        
                        {imageUrl && (
                            <img 
                                src={imageUrl} 
                                alt="Product preview" 
                                style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} 
                            />
                        )}

                        <Group grow>
                            <Select
                                label="Category"
                                placeholder="Select category"
                                data={[
                                    { value: 'furniture', label: 'Furniture' },
                                    { value: 'electronics', label: 'Electronics' },
                                    { value: 'clothing', label: 'Clothing' }
                                ]}
                                {...form.getInputProps('category')}
                                required
                            />

                            <MultiSelect
                                label="Tags"
                                placeholder="Select tags"
                                data={[
                                    { value: 'new', label: 'New' },
                                    { value: 'featured', label: 'Featured' },
                                    { value: 'sale', label: 'Sale' }
                                ]}
                                {...form.getInputProps('tags')}
                                required
                                searchable
                                clearable
                            />
                        </Group>

                        <Select
                            label="E-commerce"
                            placeholder="Select e-commerce option"
                            data={[
                                { value: 'yes', label: 'Yes' },
                                { value: 'no', label: 'No' }
                            ]}
                            {...form.getInputProps('isEcommerce')}
                            required
                        />

                        <TextInput
                            label="Meta Title"
                            placeholder="Enter meta title"
                            {...form.getInputProps('metaTitle')}
                            required
                        />

                        <Textarea
                            label="Meta Description"
                            placeholder="Enter meta description"
                            {...form.getInputProps('metaDescription')}
                            required
                            minRows={4}
                            resize="vertical"
                        />

                        <Button type="submit" loading={loading}>
                            Update Product
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </PermissionGate>
    )
} 