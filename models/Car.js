import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // Luxury, SUV, Hatchback, Sedan, Sports, Electric
  transmission: { type: String, default: 'Automatic' },
  fuelType: { type: String, default: 'Petrol' },
  fuel: { type: String },
  seats: { type: Number, default: 5 },
  pricePerDay: { type: Number, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 4.8 },
  reviews: { type: Number, default: 25 },
  isAvailable: { type: Boolean, default: true },
  tagline: { type: String },
  description: { type: String },
  minAge: { type: Number, default: 21 },
  mileageLimit: { type: String, default: 'Unlimited KMs' },
}, { timestamps: true });

const Car = mongoose.models.Car || mongoose.model('Car', carSchema);
export default Car;
