// app/api/import/route.ts
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import * as XLSX from 'xlsx';

export async function POST(req: Request) {
    const jobId = uuidv4();
    const tmpDir = path.resolve('/tmp');
    const statusFile = path.join(tmpDir, `import-${jobId}.status`);

    try {
        await fs.mkdir(tmpDir, { recursive: true });
        await fs.writeFile(statusFile, JSON.stringify({ status: 'processing', progress: 0 }));

        // Simpan buffer dari upload file
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Simulasi proses import secara async
        setTimeout(async () => {
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(sheet);

            const total = data.length;

            for (let i = 0; i < total; i++) {
                const row = data[i];
                console.log(row)

                // Simulasi insert ke database
                await new Promise((res) => setTimeout(res, 300)); // delay 300ms

                // Update progres status
                const progress = Math.floor(((i + 1) / total) * 100);
                await fs.writeFile(statusFile, JSON.stringify({ status: 'processing', progress }));
            }

            // Simpan status selesai
            await fs.writeFile(statusFile, JSON.stringify({ status: 'done', progress: 100 }));
        }, 100); // Delay kecil sebelum mulai

        return NextResponse.json({ jobId });
    } catch (err) {
        console.error('Import error:', err);
        return NextResponse.json({ error: 'Failed to start import job' }, { status: 500 });
    }
}
