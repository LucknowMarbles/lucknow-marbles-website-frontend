import '../styles/pages/NotFoundPage.css'

export default function NotFoundPage() {
    return (
        <div className="not-found-page">
            <div className="container">
                <h1>404</h1>
                <h2>Page Not Found</h2>
                <p>The page you're looking for doesn't exist or has been moved.</p>
                <a href="/" className="back-home">Back to Home</a>
            </div>
        </div>
    )
} 