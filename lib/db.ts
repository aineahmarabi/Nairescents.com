import fs from 'fs/promises';
import path from 'path';
import type { Db } from './types';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export async function readDb(): Promise<Db> {
  const raw = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(raw) as Db;
}

export async function writeDb(data: Db): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}
