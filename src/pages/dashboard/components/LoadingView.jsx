import { Container, Stack, Grid, Skeleton } from '@mantine/core'

export function LoadingView() {
    return (
        <Container size="lg" py="xl">
            <Stack gap="xl">
                <Skeleton height={50} radius="md" />
                <Grid>
                    {[1, 2, 3].map((i) => (
                        <Grid.Col key={i} span={{ base: 12, sm: 6, md: 4 }}>
                            <Skeleton height={200} radius="md" />
                        </Grid.Col>
                    ))}
                </Grid>
            </Stack>
        </Container>
    )
}