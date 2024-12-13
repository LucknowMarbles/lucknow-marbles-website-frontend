import { Card, Stack, Title, Text } from '@mantine/core'
import { Link } from 'react-router-dom'

export function DashboardCard({ title, description, path }) {
    return (
        <Card
            component={Link}
            to={path}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ 
                textDecoration: 'none',
                color: 'inherit',
                height: '100%'
            }}
            styles={(theme) => ({
                root: {
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: theme.shadows.md
                    }
                }
            })}
        >
            <Stack gap="sm">
                <Title order={3}>{title}</Title>
                <Text size="sm" c="dimmed">
                    {description}
                </Text>
            </Stack>
        </Card>
    )
}