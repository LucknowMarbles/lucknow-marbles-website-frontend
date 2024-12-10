import {
    Container,
    Title,
    Text,
    Button,
    Card,
    Grid,
    Badge,
    Group
} from '@mantine/core';

function HomePage() {
    return (
        <Container size="lg" py="xl">
            <Title order={1} ta="center" mb="xl">
                Welcome to Our Platform
            </Title>

            <Grid>
                {/* Feature Cards */}
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Card.Section>
                            <Group justify="center" mt="md">
                                <Badge size="lg" variant="light">Feature 1</Badge>
                            </Group>
                        </Card.Section>

                        <Text mt="md" ta="center">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </Text>

                        <Button variant="light" color="blue" fullWidth mt="md" radius="md">
                            Learn More
                        </Button>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Card.Section>
                            <Group justify="center" mt="md">
                                <Badge size="lg" variant="light">Feature 2</Badge>
                            </Group>
                        </Card.Section>

                        <Text mt="md" ta="center">
                            Sed do eiusmod tempor incididunt ut labore et dolore.
                        </Text>

                        <Button variant="light" color="green" fullWidth mt="md" radius="md">
                            Explore
                        </Button>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Card.Section>
                            <Group justify="center" mt="md">
                                <Badge size="lg" variant="light">Feature 3</Badge>
                            </Group>
                        </Card.Section>

                        <Text mt="md" ta="center">
                            Ut enim ad minim veniam, quis nostrud exercitation.
                        </Text>

                        <Button variant="light" color="grape" fullWidth mt="md" radius="md">
                            Get Started
                        </Button>
                    </Card>
                </Grid.Col>
            </Grid>

            <Group justify="center" mt="xl">
                <Button size="lg" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                    Join Now
                </Button>
            </Group>
        </Container>
    );
}

export default HomePage;