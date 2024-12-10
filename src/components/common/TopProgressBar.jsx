import { useEffect, useState } from 'react'
import '../../styles/components/common/TopProgressBar.css'

export default function TopProgressBar({ isLoading }) {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        let intervalId

        if (isLoading) {
            setProgress(0)
            
            // Quickly move to 70%
            intervalId = setInterval(() => {
                setProgress(prev => {
                    if (prev < 70) {
                        return prev + 5
                    }

                    clearInterval(intervalId)
                    return 70
                })
            
            }, 100)
        }
        else {
            // When loading completes, quickly fill to 100% and fade out
            setProgress(100)
        }

        return () => {
            if (intervalId) clearInterval(intervalId)
        }
    
    }, [isLoading])

    if (!isLoading && progress === 0) return null

    return (
        <div className={`top-progress-bar ${progress === 100 ? 'complete' : ''}`}>
            <div 
                className="progress-fill"
                style={{ width: `${progress}%` }}
            />
        </div>
    )
} 