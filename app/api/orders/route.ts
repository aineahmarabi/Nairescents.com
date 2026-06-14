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
  const sorted = [...db.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json(sorted, { headers: cors });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = await readDb();
  const order = {
    ...body,
    id: crypto.randomUUID(),
    orderNumber: `#${1000 + db.orders.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.orders.push(order);
  await writeDb(db);
  return NextResponse.json(order, { status: 201, headers: cors });
}
