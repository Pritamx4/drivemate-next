import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';
import { verifyAdminToken } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const cars = await Car.find({}).sort({ createdAt: -1 });
    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized - Admin token required' }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const car = new Car(body);
    const createdCar = await car.save();
    return NextResponse.json(createdCar, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
