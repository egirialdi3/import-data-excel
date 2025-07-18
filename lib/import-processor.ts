import * as XLSX from 'xlsx'
import fs from 'fs/promises'

export async function parseExcelAndInsert(filePath: string, jobId: string, statusFile: string) {
    const fileBuffer = await fs.readFile(filePath)
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

    const total = data.length

    for (let i = 0; i < total; i++) {
        const row = data[i]

        // Simulasi insert ke DB
        await new Promise((res) => setTimeout(res, 100)) // delay 100ms tiap row

        const percent = Math.floor(((i + 1) / total) * 100)
        await fs.writeFile(statusFile, JSON.stringify({ status: 'processing', percent }))
    }

    await fs.writeFile(statusFile, JSON.stringify({ status: 'done', percent: 100 }))
}
