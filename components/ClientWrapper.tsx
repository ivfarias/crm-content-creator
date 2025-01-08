'use client'

import { useEffect, useState } from 'react'
import { initializeDatabase } from '../app/actions'

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    const [dbInitialized, setDbInitialized] = useState(false)
    const [dbError, setDbError] = useState<string | null>(null)

    useEffect(() => {
        async function initialize() {
            const result = await initializeDatabase()
            if (result.success) {
                setDbInitialized(true)
            } else {
                setDbError(result.error || 'Unknown error occurred')
            }
        }
        initialize()
    }, [])

    if (dbError) {
        return <div className="text-red-500">{dbError}</div>
    }

    if (!dbInitialized) {
        return <div>Initializing database...</div>
    }

    return <>{children}</>
}

