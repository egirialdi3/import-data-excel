import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs/promises'
import path from 'path'

export async function POST() {
    const jobId = uuidv4()
    const tmpDir = path.resolve('D:/imp') // simpan status di sini
    const statusFile = path.join(tmpDir, `import-${jobId}.status`)

    try {
        await fs.mkdir(tmpDir, { recursive: true })
        await fs.writeFile(statusFile, `processing 0%`)

        // Simulasikan progres bertahap
        let progress = 0
        const interval = setInterval(async () => {
            progress += 10
            if (progress >= 100) {
                clearInterval(interval)
                await fs.writeFile(statusFile, 'done')
            } else {
                await fs.writeFile(statusFile, `processing ${progress}%`)
            }
        }, 10000) // update tiap 10 detik

        return NextResponse.json({ jobId })
    } catch (err: unknown) {
        console.error('Gagal menulis file:', err)
        return NextResponse.json({ error: 'Failed to start job' }, { status: 500 })
    }
}
