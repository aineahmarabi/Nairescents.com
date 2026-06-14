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
  return NextResponse.json(db.customers, { headers: cors });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = await readDb();
  const customer = { ...body, id: crypto.randomUUID(), orders: 0, totalSpent: 0, createdAt: new Date().toISOString() };
  db.customers.push(customer);
  await writeDb(db);
  return NextResponse.json(customer, { status: 201, headers: cors });
}
