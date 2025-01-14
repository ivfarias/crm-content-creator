'use client'

import { useState, useEffect } from 'react'
import { getRSSFeeds, addRSSFeed, deleteRSSFeed, RSSFeed } from '../lib/db'
import { Trash2 } from 'lucide-react'

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

  const handleDelete = async (id: number) => {
    try {
      await deleteRSSFeed(id);
      setMessage('RSS feed deleted successfully!');
      fetchFeeds();
    } catch (error) {
      console.error('Error deleting RSS feed:', error);
      setMessage('Failed to delete RSS feed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="feed-url" className="block text-sm font-medium text-gray-700">
            Add RSS Feed
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="url"
              id="feed-url"
              value={feedUrl}
              onChange={(e) => setFeedUrl(e.target.value)}
              placeholder="Enter RSS feed URL"
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
              required
            />
            <button
              type="submit"
              className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Feed
            </button>
          </div>
        </div>
      </form>
      {message && <p className="text-sm text-green-600">{message}</p>}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Current RSS Feeds</h3>
        {feeds.length === 0 ? (
          <p className="text-sm text-gray-500">No feeds added yet.</p>
        ) : (
          <ul className="space-y-2">
            {feeds.map((feed) => (
              <li key={feed.id} className="flex justify-between items-center text-sm text-gray-600">
                <span>{feed.url}</span>
                <button
                  onClick={() => handleDelete(feed.id)}
                  className="ml-2 text-red-600 hover:text-red-800"
                  aria-label="Delete feed"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

