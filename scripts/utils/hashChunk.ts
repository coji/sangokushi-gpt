import crypto from 'crypto'
import { v4 as uuidV4 } from 'uuid'

export function hashChunk(chunk: string): string {
  const hash = crypto.createHash('sha256')
  hash.update(chunk)
  const hashBuffer = hash.digest()
  const uuid = uuidV4({ random: hashBuffer })
  return uuid
}
