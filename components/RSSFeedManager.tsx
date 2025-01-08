'use client'

import { useState, useEffect } from 'react'
import { getRSSFeeds, addRSSFeed, deleteRSSFeed, RSSFeed } from '../lib/db'

export default function RSSFeedManager() {
    const [feeds, setFeeds] = useState<RSSFeed[]>([])
    const [newFeedUrl, setNewFeedUrl] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetchFeeds()
    }, [])

    async function fetchFeeds() {
        try {
            const fetchedFeeds = await getRSSFeeds()
            setFeeds(fetchedFeeds)
        } catch (error) {
            console.error('Error fetching RSS feeds:', error)
            setMessage('Failed to fetch RSS feeds.')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await addRSSFeed(newFeedUrl)
            setNewFeedUrl('')
            setMessage('RSS feed added successfully!')
            fetchFeeds()
        } catch (error) {
            console.error('Error adding RSS feed:', error)
            setMessage('Failed to add RSS feed. Please try again.')
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await deleteRSSFeed(id)
            setMessage('RSS feed deleted successfully!')
            fetchFeeds()
        } catch (error) {
            console.error('Error deleting RSS feed:', error)
            setMessage('Failed to delete RSS feed. Please try again.')
        }
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="feed-url" className="block text-sm font-medium text-gray-700">
                        New Feed URL
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                            type="url"
                            id="feed-url"
                            value={newFeedUrl}
                            onChange={(e) => setNewFeedUrl(e.target.value)}
                            className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-gray-500 focus:border-gray-500 sm:text-sm border-gray-300"
                            placeholder="https://example.com/rss"
                            required
                        />
                        <button
                            type="submit"
                            className="inline-flex items-center px-3 py-2 border border-l-0 border-emerald-300 rounded-r-md bg-emerald-500 text-white text-sm"
                        >
                            Add Feed
                        </button>
                    </div>
                </div>
            </form>
            {message && <p className="text-sm text-emerald-600">{message}</p>}
            <ul className="divide-y divide-gray-200">
                {feeds.map((feed) => (
                    <li key={feed.id} className="py-4 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{feed.url}</span>
                        <button
                            onClick={() => handleDelete(feed.id)}
                            className="ml-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

