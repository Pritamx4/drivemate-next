import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(req) {
  try {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const bookings = await Booking.find({}).sort('-createdAt');
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const booking = new Booking(body);
    const createdBooking = await booking.save();

    return NextResponse.json({
      message: 'Booking saved',
      booking: createdBooking,
      ownerWhatsApp: process.env.OWNER_WHATSAPP || '7082628413'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
