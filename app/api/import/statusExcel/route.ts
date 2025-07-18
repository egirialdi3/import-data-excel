// app/api/import/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('job_id');
    const statusFile = path.join('/tmp', `import-${jobId}.status`);

    try {
        const content = await fs.readFile(statusFile, 'utf-8');
        return NextResponse.json(JSON.parse(content));
    } catch {
        return NextResponse.json({ status: 'not_found' }, { status: 404 });
    }
}
