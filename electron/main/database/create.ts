import fs from 'node:fs'
import path from 'node:path'
import { Level } from 'level'
import { appDir } from '../constants'

export function createDB(dbName: string) {
  const dbPath = path.join(appDir, `.db_${dbName}`)
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true })
  }
  return new Level<string, any>(dbPath, { valueEncoding: 'json' })
}

export function createSubDB(db: Level, subName: string) {
  return db.sublevel(subName, { valueEncoding: 'json' }) as unknown as Level<
    string,
    any
  >
}
