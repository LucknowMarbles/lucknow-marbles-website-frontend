import {
    Container,
    Title,
    Grid,
    Stack
} from '@mantine/core'
import { DashboardCard } from './components/DashboardCard'
import { apiUrls } from '../../config/urls'

export default function Dashboard() {
    return (
        <Container size="lg" py="xl">
            <Stack gap="xl">
                <Title order={1} ta="center">Welcome to Lucknow Marbles</Title>
                
                <Grid>
                    {apiUrls.map((urlData, index) => (
                        <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
                            <DashboardCard
                                title={urlData.route.split('/').pop().charAt(0).toUpperCase() + 
                                      urlData.route.split('/').pop().slice(1)}
                                description={`Manage ${urlData.route.split('/').pop()}`}
                                path={urlData.route}
                            />
                        </Grid.Col>
                    ))}
                </Grid>
            </Stack>
        </Container>
    )
}