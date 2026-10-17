import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  carName: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  license: { type: String, required: true },
  pickupDate: { type: String, required: true },
  returnDate: { type: String, required: true },
  days: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  status: { type: String, default: 'Pending' }, // Pending, Confirmed, Cancelled, Completed
}, { timestamps: true });

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;
