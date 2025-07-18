import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get('job_id')

    const tmpDir = path.resolve('D:/imp') // ✅ pastikan sama dengan POST
    const statusFile = path.join(tmpDir, `import-${jobId}.status`)

    try {
        const status = await fs.readFile(statusFile, 'utf-8')
        return NextResponse.json({ status })
    } catch (err: unknown) {
        return NextResponse.json({ status: 'not_found' }, { status: 404 })
    }
}
