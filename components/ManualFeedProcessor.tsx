'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ManualFeedProcessor() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [maxArticles, setMaxArticles] = useState(10)
  const router = useRouter()

  const processFeedsManually = async () => {
    setIsProcessing(true)
    setResult(null)

    try {
      const response = await fetch('/api/process-feeds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maxArticles: maxArticles || 10,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to process feeds')
      }

      const data = await response.json()
      setResult(`Processed successfully. New summaries: ${data.newSummaries.length}`)

      // Refresh the page
      router.refresh()
    } catch (error) {
      console.error('Error processing feeds:', error)
      setResult('Error processing feeds. Check console for details.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="maxArticles" className="block text-sm font-medium text-slate-700">
          Max Articles per Feed
        </label>
        <input
          type="number"
          id="maxArticles"
          value={maxArticles}
          onChange={(e) => setMaxArticles(Number(e.target.value))}
          min="1"
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 py-2 px-2"
        />
      </div>
      <button
        onClick={processFeedsManually}
        disabled={isProcessing}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : 'Process Feeds Manually'}
      </button>
      {result && <p className="mt-2 text-sm text-emerald-600">{result}</p>}
    </div>
  )
}

