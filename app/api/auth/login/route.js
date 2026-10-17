import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

export async function POST(req) {
  try {
    await connectDB();
    const { username, password } = await req.json();

    let admin = await Admin.findOne({ username });

    // Auto-create default admin if none exists
    if (!admin && username === (process.env.ADMIN_SEED_USERNAME || 'admin')) {
      const defaultPassword = process.env.ADMIN_SEED_PASSWORD || 'password123';
      if (password === defaultPassword) {
        admin = await Admin.create({ username, password: defaultPassword });
      }
    }

    if (admin && (await admin.matchPassword(password))) {
      return NextResponse.json({
        _id: admin._id,
        username: admin.username,
        token: generateToken(admin._id),
      });
    }

    return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
