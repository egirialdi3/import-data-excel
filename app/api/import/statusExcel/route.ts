import redis from '@/lib/redis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('job_id');

    if (!jobId) {
        return NextResponse.json({ error: 'Missing job_id parameter' }, { status: 400 });
    }

    const progress = await redis.get(`import:${jobId}:progress`);

    if (!progress) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const data = JSON.parse(progress);
    return NextResponse.json({ data });
}
