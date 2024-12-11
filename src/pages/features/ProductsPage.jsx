import { Container, Grid, Card, Image, Text, Title, Button, Group, Paper, Stack, Box, Select, MultiSelect, Badge } from '@mantine/core'
import { notifications } from "@mantine/notifications"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEye } from '@fortawesome/free-solid-svg-icons'
import axios from "axios"

export default function ProductsPage() {
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedTags, setSelectedTags] = useState([])

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/products')
                setProducts(response.data)
                setFilteredProducts(response.data)
            }
            catch (error) {
                notifications.show({
                    title: 'Error',
                    message: error.message || "Failed to fetch products",
                    color: 'red'
                })
            }
        }

        fetchProducts()
    
    }, [])


    // Get unique categories and tags
    const categories = [...new Set(products.map(p => p.category))]
        .filter(Boolean)
        .map(category => ({ value: category, label: category.charAt(0).toUpperCase() + category.slice(1) }))

    const tags = [...new Set(products.flatMap(p => p.tags))]
        .filter(Boolean)
        .map(tag => ({ value: tag, label: tag.charAt(0).toUpperCase() + tag.slice(1) }))


    // Filter products when category or tags change
    useEffect(() => {
        let filtered = [...products]
        
        if (selectedCategory) {
            filtered = filtered.filter(p => p.category === selectedCategory)
        }
        
        if (selectedTags.length > 0) {
            filtered = filtered.filter(p => 
                selectedTags.every(tag => p.tags.includes(tag))
            )
        }
        
        setFilteredProducts(filtered)
    
    }, [products, selectedCategory, selectedTags])


    return (
        <Container size="xl">
            <Paper 
                shadow="xs" 
                p="md" 
                mb="xl" 
                radius="md"
                style={{
                    background: 'linear-gradient(to right, #f8f9fa, #e9ecef)',
                    borderBottom: '1px solid #dee2e6'
                }}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Group spacing="xs">
                        <Title 
                            order={1}
                            style={{
                                fontSize: '2rem',
                                fontWeight: 600,
                                color: '#1a1b1e'
                            }}
                        >
                            Products
                        </Title>
                        <Text c="dimmed" size="lg" mt={5}>
                            ({filteredProducts.length})
                        </Text>
                    </Group>
                    <Button
                        onClick={() => navigate('/add-product')}
                        size="md"
                        radius="md"
                        variant="filled"
                        style={{
                            transition: 'transform 200ms ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                        }}
                    >
                        <Group spacing="xs">
                            <FontAwesomeIcon icon={faPlus} />
                            <span>Add Product</span>
                        </Group>
                    </Button>
                </div>
            </Paper>

            {/* Filters */}
            <Paper shadow="xs" p="md" mb="xl" radius="md">
                <Group>
                    <Select
                        label="Filter by Category"
                        placeholder="Select category"
                        data={categories}
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                        clearable
                        style={{ width: 200 }}
                    />
                    <MultiSelect
                        label="Filter by Tags"
                        placeholder="Select tags"
                        data={tags}
                        value={selectedTags}
                        onChange={setSelectedTags}
                        searchable
                        clearable
                        style={{ width: 300 }}
                    />
                </Group>
            </Paper>
            
            {/* Products */}
            <Grid gutter="xl">
                {filteredProducts.map((product) => (
                    <Grid.Col key={product._id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                        <Card 
                            shadow="sm" 
                            padding="xl" 
                            radius="md" 
                            withBorder
                            style={{ 
                                height: '100%',
                                transition: 'transform 200ms ease, box-shadow 200ms ease',
                                cursor: 'pointer'
                            }}
                            onClick={() => navigate(`/product/${product._id}`)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)'
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)'
                                e.currentTarget.style.boxShadow = ''
                            }}
                        >
                            <Card.Section>
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    height={200}
                                    fit="cover"
                                    fallbackSrc="https://placehold.co/600x400"
                                />
                            </Card.Section>
                            <Stack spacing={4} mt="xl" mb="xs">
                                <Title order={3} lineClamp={1}>{product.name}</Title>
                                <Text 
                                    size="xl" 
                                    weight={700} 
                                    c="blue"
                                    style={{ transition: 'color 200ms ease' }}
                                >
                                    ₹{product.price}
                                </Text>
                                <Group spacing="xs">
                                    {product.category && (
                                        <Badge 
                                            color="blue" 
                                            variant="light"
                                            radius="sm"
                                        >
                                            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                                        </Badge>
                                    )}
                                    {product.tags?.length > 0 && (
                                        <Group spacing={8}>
                                            {product.tags.map(tag => (
                                                <Badge 
                                                    key={tag}
                                                    color="gray" 
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </Group>
                                    )}
                                </Group>
                            </Stack>
                            <Text 
                                size="sm" 
                                c="dimmed" 
                                lineClamp={3} 
                                mb="xl"
                                mt="md"
                            >
                                {product.description}
                            </Text>
                            <Button
                                variant="light"
                                color="blue"
                                fullWidth
                                radius="md"
                                mt="auto"
                                style={{
                                    transition: 'transform 200ms ease, background-color 200ms ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.02)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)'
                                }}
                            >
                                <Group spacing="xs">
                                    <FontAwesomeIcon icon={faEye} />
                                    <span>View Details</span>
                                </Group>
                            </Button>
                        </Card>
                    </Grid.Col>
                ))}
            </Grid>
        </Container>
    )
}