import { fileURLToPath } from 'url'
import { dirname } from 'path'

const filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(filename)