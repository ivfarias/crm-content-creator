'use server'

import { initDB } from '../lib/db'

export async function initializeDatabase() {
    try {
        await initDB()
        return { success: true, error: null }
    } catch (error) {
        console.error('Failed to initialize database:', error)
        return { success: false, error: 'Failed to initialize database. Please check your environment configuration.' }
    }
}

