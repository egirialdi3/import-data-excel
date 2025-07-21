// import redis from '@/lib/redis';
import { redis } from '@/lib/redisUpstash';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('job_id');

    if (!jobId) {
        return NextResponse.json({ error: 'Missing job_id parameter' }, { status: 400 });
    }

    const progress = await redis.get(`import:${jobId}:progress`);

    console.log(progress)
    // if (typeof progress !== 'string') {
    //     return NextResponse.json({ error: 'Invalid progress data' }, { status: 500 });
    // }

    // const data = JSON.parse(progress);
    return NextResponse.json({ data: progress });
}
