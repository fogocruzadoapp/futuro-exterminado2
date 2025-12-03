// server/api/fogo-cruzado.ts
import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async () => {
  const filePath = join(process.cwd(), 'public/fogo-cruzado.json')
  const file = await readFile(filePath, 'utf-8')
  return JSON.parse(file)
})