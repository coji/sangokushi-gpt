import crypto from 'node:crypto'
import { v7 as uuidV7 } from 'uuid'

export function hashChunk(chunk: string): string {
  const hash = crypto.createHash('sha256')
  hash.update(chunk)
  const hashBuffer = hash.digest()
  const uuid = uuidV7({ random: hashBuffer })
  return uuid
}
