import { NextRequest, NextResponse } from "next/server";
import { sendMessageEmail, MessageEmailData } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const data: MessageEmailData = await req.json();
    await sendMessageEmail(data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[notify/message]", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
