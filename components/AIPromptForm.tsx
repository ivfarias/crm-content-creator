'use client'

import { useState, useEffect } from 'react'

export default function AIPromptForm() {
  const [prompt, setPrompt] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function fetchPrompt() {
      try {
        const response = await fetch('/api/ai-prompt');
        const data = await response.json();
        setPrompt(data.prompt);
      } catch (error) {
        console.error('Error fetching AI prompt:', error);
        setMessage('Failed to fetch AI prompt. Using default.');
      }
    }
    fetchPrompt();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/ai-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('AI prompt updated successfully!');
      } else {
        throw new Error(data.error || 'Failed to update AI prompt');
      }
    } catch (error) {
      console.error('Error updating AI prompt:', error);
      setMessage('Failed to update AI prompt. Please try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="ai-prompt" className="block text-sm font-bold mb-2 text-slate-700">
          AI Prompt
        </label>
        <textarea
          id="ai-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mt-1 block w-full rounded-md bg-gray-50 border-gray-300 shadow-sm focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 px-2 py-2"
          rows={3}
          required
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      >
        Update Prompt
      </button>
      {message && <p className="mt-2 text-sm text-emerald-600">{message}</p>}
    </form>
  )
}

