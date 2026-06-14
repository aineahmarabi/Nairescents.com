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
  return NextResponse.json(db.discounts, { headers: cors });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = await readDb();
  const discount = { ...body, id: crypto.randomUUID(), usageCount: 0, createdAt: new Date().toISOString() };
  db.discounts.push(discount);
  await writeDb(db);
  return NextResponse.json(discount, { status: 201, headers: cors });
}
