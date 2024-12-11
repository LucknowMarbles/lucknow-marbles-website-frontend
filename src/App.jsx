import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { MantineProvider, AppShell } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'
import ProductsPage from './pages/features/ProductsPage'
import AddProductPage from './pages/features/AddProductPage'
import ProductDetailsPage from './pages/features/ProductDetailsPage'

export default function App() {
    return (
        <MantineProvider>
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
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/signup" element={<SignupPage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/products" element={<ProductsPage />} />
                                <Route path="/add-product" element={<AddProductPage />} />
                                <Route path="/product/:id" element={<ProductDetailsPage />} />
                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                        </AppShell.Main>
                    </AppShell>
                </AuthProvider>
            </BrowserRouter>
        </MantineProvider>
    )
}
