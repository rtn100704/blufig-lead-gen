import { useState, useEffect, useRef } from 'react'
import Sidebar from './Sidebar.jsx'
import RunForm from './RunForm.jsx'
import ProcessingCard from './ProcessingCard.jsx'
import ResultCard from './ResultCard.jsx'

const SHEETS_API_KEY = import.meta.env.VITE_SHEETS_API_KEY
const SHEET_ID = import.meta.env.VITE_SHEET_ID
const SHEET_NAME = 'Runs'
const POLL_INTERVAL = 10000

export default function Dashboard() {
  const [page, setPage] = useState('home')
  const [appState, setAppState] = useState('idle') // idle | processing | completed | error
  const [runData, setRunData] = useState(null) // { runId, startTime, icpConfig, fileName }
  const [result, setResult] = useState(null) // { driveLink, errorDetails }
  const pollRef = useRef(null)

  // On mount - check localStorage for active run
  useEffect(() => {
    const saved = localStorage.getItem('blufig_run')
    if (saved) {
      const parsed = JSON.parse(saved)
      setRunData(parsed)
      setAppState('processing')
    }
  }, [])

  // Polling
  useEffect(() => {
    if (appState === 'processing' && runData?.runId) {
      pollRef.current = setInterval(() => pollSheets(runData.runId), POLL_INTERVAL)
      // Poll immediately too
      pollSheets(runData.runId)
    }
    return () => clearInterval(pollRef.current)
  }, [appState, runData?.runId])

  const pollSheets = async (runId) => {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${SHEETS_API_KEY}`
      const res = await fetch(url)
      const data = await res.json()
      const rows = data.values || []
      if (rows.length < 2) return

      const headers = rows[0]
      const runIdIdx = headers.indexOf('runId')
      const statusIdx = headers.indexOf('status')
      const driveLinkIdx = headers.indexOf('driveLink')
      const errorIdx = headers.indexOf('errorDetails')

      const row = rows.slice(1).find(r => r[runIdIdx] === runId)
      if (!row) return

      const status = row[statusIdx]

      if (status === 'Completed') {
        clearInterval(pollRef.current)
        setResult({ driveLink: row[driveLinkIdx] || '' })
        setAppState('completed')
      } else if (status === 'error') {
        clearInterval(pollRef.current)
        setResult({ errorDetails: row[errorIdx] || 'Unknown error' })
        setAppState('error')
      }
    } catch (e) {
      console.error('Poll error:', e)
    }
  }

  const handleRunStart = ({ runId, icpConfig, fileName }) => {
    const data = { runId, startTime: Date.now(), icpConfig, fileName }
    setRunData(data)
    localStorage.setItem('blufig_run', JSON.stringify(data))
    setAppState('processing')
  }

  const handleReset = (prefill = false) => {
    clearInterval(pollRef.current)
    if (!prefill) {
      localStorage.removeItem('blufig_run')
      setRunData(null)
    }
    setResult(null)
    setAppState('idle')
  }

  const handleCancel = () => {
    clearInterval(pollRef.current)
    localStorage.removeItem('blufig_run')
    setRunData(null)
    setResult(null)
    setAppState('idle')
  }

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <Sidebar activePage={page} onNavigate={setPage} />

      <main className="flex-1 overflow-y-auto">
        {appState === 'idle' && (
          <RunForm
            prefillData={runData?.icpConfig}
            prefillFileName={runData?.fileName}
            onRunStart={handleRunStart}
          />
        )}
        {appState === 'processing' && (
          <ProcessingCard
            runId={runData?.runId}
            startTime={runData?.startTime}
            onCancel={handleCancel}
          />
        )}
        {(appState === 'completed' || appState === 'error') && (
          <ResultCard
            status={appState}
            runId={runData?.runId}
            startTime={runData?.startTime}
            icpConfig={runData?.icpConfig}
            fileName={runData?.fileName}
            driveLink={result?.driveLink}
            errorDetails={result?.errorDetails}
            onNewRun={() => handleReset(false)}
            onTryAgain={() => handleReset(true)}
          />
        )}
      </main>
    </div>
  )
}
