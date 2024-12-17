import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { MantineProvider, AppShell } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'
import Navigation from './components/layout/Navigation'
import Dashboard from './pages/dashboard'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import ProfilePage from './pages/profile'
import NotFoundPage from './pages/NotFoundPage'
import Products from './pages/features-modules/products'
import AddProductPage from './pages/features-modules/products/add'
import ProductDetailsPage from './pages/features-modules/products/id'
import EditProductPage from './pages/features-modules/products/id/edit'
import Users from './pages/users'
import UserDetailsPage from './pages/users/id'

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
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/signup" element={<SignupPage />} />
                                    <Route path="/profile" element={<ProfilePage />} />
                                    <Route path="/users" element={<Users />} />
                                    <Route path="/users/:id" element={<UserDetailsPage />} />
                                    <Route path="/products">
                                        <Route index element={<Products />} />
                                        <Route path="add" element={<AddProductPage />} />
                                        <Route path=":id">
                                            <Route index element={<ProductDetailsPage />} />
                                            <Route path="edit" element={<EditProductPage />} />
                                        </Route>
                                    </Route>
                                    <Route path="*" element={<NotFoundPage />} />
                                </Routes>
                            </AppShell.Main>
                        </AppShell>
                    </AuthProvider>
                </BrowserRouter>
            </ModalsProvider>
        </MantineProvider>
    )
}
