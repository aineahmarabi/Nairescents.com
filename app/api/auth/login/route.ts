import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { readDb } from '@/lib/db';

function hashPassword(password: string, salt: string): string {
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email?.trim() || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const db = await readDb();
  const user = (db.users ?? []).find(u => u.email.toLowerCase() === email.toLowerCase().trim());

  if (!user || hashPassword(password, user.salt) !== user.passwordHash) {
    return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 });
  }

  return NextResponse.json({ id: user.id, name: user.name, email: user.email });
}
