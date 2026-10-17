import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    whatsapp: process.env.OWNER_WHATSAPP || '7082628413'
  });
}
