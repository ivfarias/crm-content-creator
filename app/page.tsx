import AIPromptForm from '../components/AIPromptForm'
import RSSFeedForm from '../components/RSSFeedForm'
import SummaryList from '../components/SummaryList'
import ManualFeedProcessor from '../components/ManualFeedProcessor'
import { initDB } from '../lib/db'

initDB().catch(console.error)

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <svg
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 142 142"
              className="h-10 w-10 mr-3"
            >
              <defs>
                <style>
                  {`.cls-1{fill:#fff;}.cls-2{fill:#2dd1ac;}`}
                </style>
              </defs>
              <rect className="cls-2" width="142" height="142" rx="10" ry="10" />
              <polygon className="cls-1" points="30.41 67.62 44.34 84.53 52.29 84.53 36.54 65.59 51.53 48.27 44.29 48.27 30.41 64.73 30.41 48.32 23.67 48.32 23.67 84.53 30.41 84.53 30.41 67.62" />
              <polygon className="cls-1" points="76.41 58.05 70.43 58.05 63.95 75.11 56.91 58.05 50.28 58.05 60.76 81.85 47.67 114.84 53.84 114.84 76.41 58.05" />
              <path className="cls-1" d="M87.18,84.99c1.88,0,3.19-.3,4.15-.66v-4.86c-.86.35-1.77.51-2.99.51-1.93,0-3.04-1.06-3.04-3.39v-13.93h5.82v-4.61h-5.82v-5.83h-6.13v24.92c0,5.01,2.73,7.85,8,7.85Z" />
              <path className="cls-1" d="M107.24,85.04c6.79,0,11.3-3.04,12.15-8.61h-5.92c-.46,2.58-2.38,4.05-6.08,4.05-4.56,0-7.09-2.84-7.3-7.85h19.4v-1.77c0-9.47-5.93-13.37-12.51-13.37-7.55,0-13.17,5.47-13.17,13.67v.4c0,8.36,5.62,13.47,13.42,13.47ZM106.99,61.95c3.8,0,6.13,2.03,6.43,6.58h-13.22c.61-4.1,3.09-6.58,6.79-6.58Z" />
            </svg>
            <h1 className="text-2xl font-semibold text-slate-800">Kyte AI for CRM</h1>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">1. Engineer your prompt</h2>
                <AIPromptForm />
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">2. Manage your feed sources</h2>
                <RSSFeedForm />
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">3. Process feeds manually</h2>
                <ManualFeedProcessor />
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Article Summaries</h2>
              <SummaryList />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

