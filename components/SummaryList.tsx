'use client'

import { useState, useEffect } from 'react'
import { getSummaries, deleteSummary, Summary } from '../lib/db'
import ReactMarkdown from 'react-markdown'

export default function SummaryList() {
  const [summaries, setSummaries] = useState<Summary[]>([])

  useEffect(() => {
    fetchSummaries()
  }, [])

  async function fetchSummaries() {
    const storedSummaries = await getSummaries()
    setSummaries(storedSummaries)
  }

  const handleDeleteSummary = async (id: number) => {
    await deleteSummary(id)
    await fetchSummaries()
  }

  return (
    <div className="space-y-6">
      {summaries.length === 0 ? (
        <p className="text-gray-500 text-center">No summaries available.</p>
      ) : (
        <ul className="space-y-8">
          {summaries.map((summary) => (
            <li key={summary.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-700">{summary.title}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  <a href={summary.link} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-700">
                    Original Article
                  </a>
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <div className="sm:px-6 sm:py-5">
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <ReactMarkdown>{summary.summary}</ReactMarkdown>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                <button
                  onClick={() => handleDeleteSummary(summary.id)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

