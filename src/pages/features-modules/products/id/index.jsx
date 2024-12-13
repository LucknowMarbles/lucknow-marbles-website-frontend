import { Container, Paper, Image, Text, Title, Badge, Group, Stack, Button, LoadingOverlay, Grid } from '@mantine/core'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { notifications } from '@mantine/notifications'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { API_BASE_URL } from '../../../../config/config.js'
import axios from 'axios'
import { modals } from '@mantine/modals'
import { useAuth } from '../../../../contexts/AuthContext.jsx'

export default function ProductDetailsPage() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/products/${id}`)
                setProduct(response.data)
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

    const handleDelete = () => {
        modals.openConfirmModal({
            title: 'Delete Product',
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete this product? This action cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: async () => {
                try {
                    await axios.delete(`${API_BASE_URL}/api/products/${id}`, {
                        headers: { Authorization: `Bearer ${user.token}` }
                    })
                    
                    notifications.show({
                        title: 'Success',
                        message: 'Product deleted successfully',
                        color: 'green'
                    })
                    
                    navigate('/products')
                } catch (error) {
                    notifications.show({
                        title: 'Error',
                        message: error.response?.data?.message || 'Failed to delete product',
                        color: 'red'
                    })
                }
            }
        })
    }

    if (loading) {
        return (
            <Container size="md" py="xl">
                <LoadingOverlay visible={true} />
            </Container>
        )
    }

    if (!product) return null

    return (
        <Container size="md" py="xl">
            <Paper shadow="sm" radius="md" p="xl">
                {/* Navigation Header */}
                <Group justify="space-between" mb="xl">
                    <Button
                        variant="subtle"
                        leftSection={<FontAwesomeIcon icon={faArrowLeft} />}
                        onClick={() => navigate('/products')}
                    >
                        Back to Products
                    </Button>
                    <Group>
                        <Button
                            variant="filled"
                            color="blue"
                            leftSection={<FontAwesomeIcon icon={faEdit} />}
                            onClick={() => navigate(`/products/${id}/edit`)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="filled"
                            color="red"
                            leftSection={<FontAwesomeIcon icon={faTrash} />}
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </Group>
                </Group>

                {/* Primary Row: Image and Essential Details */}
                <Grid gutter="xl" mb="xl">
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            radius="md"
                            h={400}
                            w="100%"
                            fit="cover"
                            fallbackSrc="https://placehold.co/600x400"
                        />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Stack spacing="md">
                            <Title order={1}>{product.name}</Title>
                            
                            <Text size="xl" fw={700} c="blue">
                                ₹{product.price}
                            </Text>

                            <Group>
                                {product.category && (
                                    <Badge color="blue" size="lg" variant="light">
                                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                                    </Badge>
                                )}
                                {product.isEcommerce === 'yes' && (
                                    <Badge color="green" size="lg" variant="light">
                                        E-Commerce
                                    </Badge>
                                )}
                            </Group>

                            {product.tags?.length > 0 && (
                                <Group>
                                    {product.tags.map(tag => (
                                        <Badge 
                                            key={tag}
                                            variant="outline"
                                            size="md"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </Group>
                            )}

                            <Text size="sm" c="dimmed">
                                Stock: {product.quantity} units
                            </Text>

                            <Title order={3}>Description</Title>
                            <Text>{product.description}</Text>
                        </Stack>
                    </Grid.Col>
                </Grid>

                {/* Secondary Row: SEO Information */}
                <Paper withBorder p="xl" radius="md" mb="lg">
                    <Title order={3} mb="md">SEO Information</Title>
                    <Stack spacing="md">
                        <div>
                            <Text fw={500}>Meta Title</Text>
                            <Text size="sm" c="dimmed">{product.metaTitle}</Text>
                        </div>
                        <div>
                            <Text fw={500}>Meta Description</Text>
                            <Text size="sm" c="dimmed">{product.metaDescription}</Text>
                        </div>
                    </Stack>
                </Paper>

                {/* Third Row: Date Information */}
                <Paper withBorder p="md" radius="md">
                    <Group justify="flex-end" gap="xl">
                        <Text size="sm" c="dimmed">
                            Added on: {new Date(product.createdAt).toLocaleString('en-IN', {
                                timeZone: 'Asia/Kolkata',
                                dateStyle: 'medium',
                                timeStyle: 'medium'
                            })}
                        </Text>
                        <Text size="sm" c="dimmed">
                            Last updated: {new Date(product.updatedAt).toLocaleString('en-IN', {
                                timeZone: 'Asia/Kolkata',
                                dateStyle: 'medium',
                                timeStyle: 'medium'
                            })}
                        </Text>
                    </Group>
                </Paper>
            </Paper>
        </Container>
    )
} 