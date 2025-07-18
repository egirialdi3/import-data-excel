'use client'

import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

export default function ImportAsset() {
  const [file, setFile] = useState<File | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('idle')
  const [progress, setProgress] = useState<number>(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) return Swal.fire('Error', 'File belum dipilih', 'error')

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/importExcel', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      return Swal.fire('Gagal', 'Gagal upload file', 'error')
    }

    const data = await res.json()
    setJobId(data.jobId)
    setStatus('processing')
    setProgress(0)
  }

  // Poll status setiap 3 detik
  useEffect(() => {
    if (!jobId || status === 'done' || status === 'failed') return

    const interval = setInterval(async () => {
      const res = await fetch(`/api/import/statusExcel?job_id=${jobId}`)
      const data = await res.json()

      setStatus(data.status || 'not_found')

      if (data.progress !== undefined) {
        setProgress(data.progress)
      }

      if (data.status === 'done' || data.status === 'failed') {
        clearInterval(interval)
        Swal.fire('Selesai', 'Proses import selesai', 'success')
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [jobId, status])

  return (
    <div className="p-5 space-y-4">
      <h2 className="text-xl font-bold">Import Data Asset</h2>

      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded">
        Upload & Import
      </button>

      {status !== 'idle' && (
        <div className="mt-4">
          <p>Status: {status}</p>
          <div className="w-full bg-gray-200 rounded h-4 mt-1">
            <div
              className="h-4 bg-green-500 rounded"
              style={{ width: `${progress}%`, transition: 'width 0.5s' }}
            ></div>
          </div>
          <p>{progress}%</p>
        </div>
      )}
    </div>
  )
}
