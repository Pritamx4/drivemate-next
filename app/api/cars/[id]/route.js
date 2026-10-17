import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';
import { verifyAdminToken } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const car = await Car.findById(id);
    if (!car) {
      return NextResponse.json({ message: 'Car not found' }, { status: 404 });
    }
    return NextResponse.json(car);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const car = await Car.findById(id);
    if (!car) {
      return NextResponse.json({ message: 'Car not found' }, { status: 404 });
    }

    const updates = await req.json();

    if (Object.prototype.hasOwnProperty.call(updates, 'available') && !Object.prototype.hasOwnProperty.call(updates, 'isAvailable')) {
      updates.isAvailable = updates.available;
    }
    if (Object.prototype.hasOwnProperty.call(updates, 'isAvailable') && typeof updates.isAvailable === 'string') {
      updates.isAvailable = updates.isAvailable === 'true';
    }
    delete updates.available;

    Object.assign(car, updates);
    const updatedCar = await car.save();
    return NextResponse.json(updatedCar);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const admin = verifyAdminToken(req);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const car = await Car.findById(id);
    if (!car) {
      return NextResponse.json({ message: 'Car not found' }, { status: 404 });
    }

    await car.deleteOne();
    return NextResponse.json({ message: 'Car removed' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
