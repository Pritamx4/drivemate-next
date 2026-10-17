import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { verifyAdminToken } from '@/lib/auth';

export async function POST(req) {
  try {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.formData();
    const file = data.get('image');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || '.png';
    const filename = `car-${Date.now()}${ext}`;
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    await writeFile(path.join(uploadsDir, filename), buffer);

    return NextResponse.json({
      message: 'Image Uploaded',
      url: `/uploads/${filename}`
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
