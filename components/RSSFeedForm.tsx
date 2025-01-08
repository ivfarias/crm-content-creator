'use client'

import { useState, useEffect } from 'react'
import { getRSSFeeds, addRSSFeed, RSSFeed } from '../lib/db'

export default function RSSFeedForm() {
  const [feedUrl, setFeedUrl] = useState('')
  const [feeds, setFeeds] = useState<RSSFeed[]>([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchFeeds()
  }, [])

  async function fetchFeeds() {
    try {
      const storedFeeds = await getRSSFeeds()
      setFeeds(storedFeeds)
    } catch (error) {
      console.error('Error fetching RSS feeds:', error)
      setMessage('Failed to fetch RSS feeds.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (feedUrl) {
      try {
        await addRSSFeed(feedUrl)
        setFeedUrl('')
        setMessage('RSS feed added successfully!')
        fetchFeeds()
      } catch (error) {
        console.error('Error adding RSS feed:', error)
        setMessage('Failed to add RSS feed. Please try again.')
      }
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="feed-url" className="block text-sm font-medium text-slate-700">
            Add RSS Feed
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="url"
              id="feed-url"
              value={feedUrl}
              onChange={(e) => setFeedUrl(e.target.value)}
              placeholder="Enter RSS feed URL"
              className="flex-1 min-w-0 block w-full px-3 py-2 bg-gray-50 rounded-none rounded-l-md focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm border-gray-300"
              required
            />
            <button
              type="submit"
              className="inline-flex items-center px-3 py-2 border border-l-0 border-emerald-300 rounded-r-md bg-emerald-500 text-white text-sm hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Add Feed
            </button>
          </div>
        </div>
      </form>
      {message && <p className="text-sm text-emerald-600">{message}</p>}
      <div>
        <h3 className="text-lg font-medium text-slate-700 mb-2">Current RSS Feeds</h3>
        {feeds.length === 0 ? (
          <p className="text-sm text-slate-500">No feeds added yet.</p>
        ) : (
          <ul className="space-y-2">
            {feeds.map((feed, index) => (
              <li key={feed.id} className="text-sm text-slate-600">
                {feed.url}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

