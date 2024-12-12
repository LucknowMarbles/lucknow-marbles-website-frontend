import { TextInput, NumberInput, Select, FileInput, Button, Paper, Stack, Group, Textarea, LoadingOverlay } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import AIContentGeneratorModal from '../../components/modals/AIContentGenerator/AIContentGeneratorModal'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons'
import { MultiSelect } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import PermissionGate from '../../components/auth/PermissionGate'

export default function AddProductPage() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)

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

    async function handleImageUpload(file) {
        if (!file) return

        setLoading(true)
        const formData = new FormData()
        formData.append('image', file)

        try {
            const response = await axios.post('http://localhost:5001/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            })

            if (response.data.success) {
                setImageUrl(response.data.imageUrl)
                notifications.show({
                    title: 'Success',
                    message: 'Image uploaded successfully',
                    color: 'green'
                })
            }
        }
        catch (error) {
            console.error('Error uploading image:', error)
            notifications.show({
                title: 'Error',
                message: 'Failed to upload image',
                color: 'red'
            })
        }
        finally {
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

            await axios.post('http://localhost:5001/api/products', productData, {
                headers: { Authorization: `Bearer ${user.token}` }
            })

            notifications.show({
                title: 'Product Added',
                message: 'Product has been successfully created',
                color: 'teal',
            })
            
            navigate('/products')
        }
        catch (error) {
            notifications.show({
                title: 'Error',
                message: error.response?.data?.message || 'An unexpected error occurred',
                color: 'red',
            })
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <PermissionGate requiredPermission="addProducts">
            <Paper p="md" radius="md">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <Button
                        variant="light"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Group spacing="xs">
                            <FontAwesomeIcon icon={faMagicWandSparkles} />
                            <span>AI Assistant</span>
                        </Group>
                    </Button>
                </div>

                <AIContentGeneratorModal
                    opened={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
                
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
                            required
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
                            Add Product
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </PermissionGate>
    )
}