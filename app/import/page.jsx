'use client'
import { useState } from 'react'

export default function ImportPage() {
  const [jobId, setJobId] = useState(null)
  const [status, setStatus] = useState(null)

  const startImport = async () => {
    const res = await fetch('/api/import/start', { method: 'POST' })
    const data = await res.json()
    setJobId(data.jobId)
    pollStatus(data.jobId)
  }

  const pollStatus = (jobId) => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/import/status?job_id=${jobId}`)
      const data = await res.json()
      setStatus(data.status)

      if (data.status === 'done') {
        clearInterval(interval)
      }
    }, 5000)
  }

  return (
    <div>
      <button onClick={startImport}>Mulai Import</button>
      {jobId && (
        <div>
          <p>Job ID: {jobId}</p>
          <p>Status: {status}</p>
        </div>
      )}
    </div>
  )
}
