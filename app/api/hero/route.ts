import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

const cors = {
  'Access-Control-Allow-Origin': 'http://localhost:3001',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: cors });
}

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.hero, { headers: cors });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const db = await readDb();
  db.hero = body;
  await writeDb(db);
  return NextResponse.json(db.hero, { headers: cors });
}
