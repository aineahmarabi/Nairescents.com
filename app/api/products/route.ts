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

export async function GET(req: NextRequest) {
  const db = await readDb();
  const sp = new URL(req.url).searchParams;
  let products = [...db.products];

  const brand = sp.get('brand');
  const gender = sp.get('gender');
  const whenToWear = sp.get('whenToWear');
  const inStock = sp.get('inStock');
  const sort = sp.get('sort');
  const tag = sp.get('tag');
  const status = sp.get('status');

  if (brand) products = products.filter(p => p.brand === brand);
  if (gender) products = products.filter(p => p.gender === gender);
  if (whenToWear) products = products.filter(p => p.whenToWear?.includes(whenToWear as never));
  if (inStock !== null && inStock !== '') products = products.filter(p => p.inStock === (inStock === 'true'));
  if (tag === 'bestSeller') products = products.filter(p => p.tags?.bestSeller);
  if (tag === 'newIn') products = products.filter(p => p.tags?.newIn);
  if (tag === 'featured') products = products.filter(p => p.tags?.featured);
  if (status) products = products.filter(p => p.status === status);
  if (sort === 'price_asc') products.sort((a, b) => a.price - b.price);
  if (sort === 'price_desc') products.sort((a, b) => b.price - a.price);
  if (sort === 'newest') products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json(products, { headers: cors });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = await readDb();
  const product = {
    ...body,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.products.push(product);
  await writeDb(db);
  return NextResponse.json(product, { status: 201, headers: cors });
}
