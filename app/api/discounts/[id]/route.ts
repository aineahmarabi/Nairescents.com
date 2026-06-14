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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const db = await readDb();
  const idx = db.discounts.findIndex(d => d.id === params.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404, headers: cors });
  db.discounts[idx] = { ...db.discounts[idx], ...body, id: params.id };
  await writeDb(db);
  return NextResponse.json(db.discounts[idx], { headers: cors });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const db = await readDb();
  db.discounts = db.discounts.filter(d => d.id !== params.id);
  await writeDb(db);
  return NextResponse.json({ ok: true }, { headers: cors });
}
