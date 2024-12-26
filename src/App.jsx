import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { MantineProvider, AppShell } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import Navigation from './components/layout/Navigation'
import AppRoutes from './AppRoutes'


ModuleRegistry.registerModules([AllCommunityModule])


export default function App() {
    return (
        <MantineProvider>
            <ModalsProvider>
                <BrowserRouter>
                    <AuthProvider>
                        <Notifications position="top-center" />
                        <AppShell
                            header={{ height: 60 }}
                            padding="md"
                        >
                            <AppShell.Header>
                                <Navigation />
                            </AppShell.Header>

                            <AppShell.Main>
                                <AppRoutes />
                            </AppShell.Main>
                        </AppShell>
                    </AuthProvider>
                </BrowserRouter>
            </ModalsProvider>
        </MantineProvider>
    )
}
