import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { verifyAdminToken } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const { status } = await req.json();

    const allowedStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ message: 'Invalid booking status' }, { status: 400 });
    }

    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    if (!booking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
