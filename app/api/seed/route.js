import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Car from '@/models/Car';
import Admin from '@/models/Admin';

const INITIAL_CARS = [
  {
    name: 'Hyundai i20',
    category: 'Hatchback',
    pricePerDay: 1500,
    seats: 5,
    fuelType: 'Petrol',
    fuel: 'Petrol',
    transmission: 'Manual',
    image: '/cars/i20.png',
    rating: 4.8,
    reviews: 42,
    isAvailable: true,
    tagline: 'The premium hatchback',
    description: 'Smooth, stylish, and perfect for city driving and weekend getaways with premium comfort.',
    minAge: 21,
    mileageLimit: 'Unlimited KMs',
  },
  {
    name: 'Mahindra Thar',
    category: 'SUV',
    pricePerDay: 2500,
    seats: 4,
    fuelType: 'Diesel',
    fuel: 'Diesel',
    transmission: 'Manual',
    image: '/cars/thar.png',
    rating: 4.9,
    reviews: 58,
    isAvailable: true,
    tagline: 'Built for adventure',
    description: 'Iconic 4x4 off-road SUV ready for mountain terrains, highway cruising, and rugged adventures.',
    minAge: 21,
    mileageLimit: 'Unlimited KMs',
  },
  {
    name: 'Hyundai Venue',
    category: 'SUV',
    pricePerDay: 2000,
    seats: 5,
    fuelType: 'Petrol',
    fuel: 'Petrol',
    transmission: 'Auto',
    image: '/cars/venue.png',
    rating: 4.7,
    reviews: 35,
    isAvailable: true,
    tagline: 'The connected compact SUV',
    description: 'Feature-packed compact SUV with high ground clearance, modern infotainment, and agile driving dynamics.',
    minAge: 21,
    mileageLimit: 'Unlimited KMs',
  },
  {
    name: 'Mahindra Scorpio N',
    category: 'SUV',
    pricePerDay: 2800,
    seats: 7,
    fuelType: 'Diesel',
    fuel: 'Diesel',
    transmission: 'Auto',
    image: '/cars/scorpio_n.png',
    rating: 4.9,
    reviews: 64,
    isAvailable: true,
    tagline: 'The #BigDaddyOfSUVs',
    description: 'Bold styling, 7-seater luxury, commanding driving position, and exceptional diesel performance.',
    minAge: 21,
    mileageLimit: 'Unlimited KMs',
  },
  {
    name: 'Mahindra Bolero',
    category: 'SUV',
    pricePerDay: 2300,
    seats: 7,
    fuelType: 'Diesel',
    fuel: 'Diesel',
    transmission: 'Manual',
    image: '/cars/bolero.png',
    rating: 4.6,
    reviews: 29,
    isAvailable: true,
    tagline: 'The rugged workhorse',
    description: 'Perfect for rural roads, long outstation trips, and group outings with unmatched durability.',
    minAge: 21,
    mileageLimit: 'Unlimited KMs',
  },
  {
    name: 'Maruti Swift',
    category: 'Hatchback',
    pricePerDay: 1300,
    seats: 5,
    fuelType: 'Petrol',
    fuel: 'Petrol',
    transmission: 'Manual',
    image: '/cars/swift.png',
    rating: 4.7,
    reviews: 51,
    isAvailable: true,
    tagline: 'The urban legend',
    description: 'Highly fuel efficient, compact, and remarkably agile for city traffic.',
    minAge: 21,
    mileageLimit: 'Unlimited KMs',
  },
  {
    name: 'Mercedes Benz C-Class',
    category: 'Sedan',
    pricePerDay: 8500,
    seats: 5,
    fuelType: 'Petrol',
    fuel: 'Petrol',
    transmission: 'Auto',
    image: '/cars/mercedes.png',
    rating: 5.0,
    reviews: 19,
    isAvailable: true,
    tagline: 'Luxury defined',
    description: 'Experience the pinnacle of comfort, prestige, and executive luxury.',
    minAge: 25,
    mileageLimit: '300 KMs/day',
  },
  {
    name: 'Audi Q7',
    category: 'SUV',
    pricePerDay: 9000,
    seats: 7,
    fuelType: 'Diesel',
    fuel: 'Diesel',
    transmission: 'Auto',
    image: '/cars/audi_q7.png',
    rating: 4.9,
    reviews: 22,
    isAvailable: true,
    tagline: 'Uncompromised luxury',
    description: 'The ultimate 7-seater luxury SUV for VIP travel and family celebrations.',
    minAge: 25,
    mileageLimit: '300 KMs/day',
  },
  {
    name: 'Porsche 911',
    category: 'Sports',
    pricePerDay: 15000,
    seats: 2,
    fuelType: 'Petrol',
    fuel: 'Petrol',
    transmission: 'Auto',
    image: '/cars/porsche_911.png',
    rating: 5.0,
    reviews: 16,
    isAvailable: true,
    tagline: 'Pure performance',
    description: 'Unmatched speed, precision steering, and exhilarating handling on every curve.',
    minAge: 25,
    mileageLimit: '200 KMs/day',
  },
  {
    name: 'Tesla Model 3',
    category: 'Sedan',
    pricePerDay: 4500,
    seats: 5,
    fuelType: 'Electric',
    fuel: 'Electric',
    transmission: 'Auto',
    image: '/cars/tesla.png',
    rating: 4.8,
    reviews: 31,
    isAvailable: true,
    tagline: 'The future of driving',
    description: 'Zero emissions, instant torque acceleration, and cutting-edge tech.',
    minAge: 23,
    mileageLimit: 'Unlimited KMs',
  },
];

export async function GET() {
  try {
    await connectDB();
    const count = await Car.countDocuments();
    if (count === 0) {
      const created = await Car.insertMany(INITIAL_CARS);
      return NextResponse.json({ message: 'Seeded initial cars', count: created.length });
    }
    return NextResponse.json({ message: 'Database already contains cars', count });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    await connectDB();
    await Car.deleteMany({});
    const created = await Car.insertMany(INITIAL_CARS);
    
    // Seed admin if not present
    const username = process.env.ADMIN_SEED_USERNAME || 'admin';
    const password = process.env.ADMIN_SEED_PASSWORD || 'password123';
    let admin = await Admin.findOne({ username });
    if (!admin) {
      await Admin.create({ username, password });
    }

    return NextResponse.json({ message: 'Database seeded successfully', count: created.length, adminSeeded: true });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
