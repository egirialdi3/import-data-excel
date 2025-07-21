
import { NextRequest, NextResponse } from 'next/server';
import { read, utils } from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';
import redis from '@/lib/redis';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = read(buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json(worksheet);

    const jobId = uuidv4();

    // Inisialisasi progres
    await redis.set(`import:${jobId}:progress`, JSON.stringify({
        status: 'processing',
        progress: 0,
    }));

    // Proses async
    setTimeout(async () => {
        for (let i = 0; i < jsonData.length; i++) {
            const row = jsonData[i] as {
                'No Register': string;
                'Nama Aset': string;
                Lokasi: string;
                Department: string;
                'Harga Perolehan': number;
                'Asset User': string;
            };

            try {
                await prisma.registrasi.create({
                    data: {
                        no_register: String(row['No Register']).trim(),
                        tgl_register: new Date(),
                        nama_aset: String(row['Nama Aset']).trim(),
                        lokasi: String(row.Lokasi).trim(),
                        department: String(row.Department).trim(),
                        harga_perolehan: Number(row['Harga Perolehan']),
                        asset_user: String(row['Asset User']).trim()
                    }
                });
            } catch (err) {
                console.error(`Error on row ${i}:`, err);
                continue; // Lanjutkan ke baris berikutnya jika error
            }

            await new Promise(resolve => setTimeout(resolve, 200)); // Delay opsional

            const progress = Math.round(((i + 1) / jsonData.length) * 100);

            await redis.set(`import:${jobId}:progress`, JSON.stringify({
                status: 'processing',
                progress,
            }));
        }

        await redis.set(`import:${jobId}:progress`, JSON.stringify({
            status: 'done',
            progress: 100,
        }));
    }, 100);

    return NextResponse.json({ jobId });
}
