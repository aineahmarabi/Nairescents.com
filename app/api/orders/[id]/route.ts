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

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const db = await readDb();
  const order = db.orders.find(o => o.id === params.id);
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404, headers: cors });
  return NextResponse.json(order, { headers: cors });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const db = await readDb();
  const idx = db.orders.findIndex(o => o.id === params.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404, headers: cors });
  db.orders[idx] = { ...db.orders[idx], ...body, id: params.id, updatedAt: new Date().toISOString() };
  await writeDb(db);
  return NextResponse.json(db.orders[idx], { headers: cors });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const db = await readDb();
  db.orders = db.orders.filter(o => o.id !== params.id);
  await writeDb(db);
  return NextResponse.json({ ok: true }, { headers: cors });
}
