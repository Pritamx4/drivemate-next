'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, CheckCircle, Car, ArrowRight } from 'lucide-react';
import { useCars, formatINR } from '@/context/CarContext';

export default function BookingClient({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { cars } = useCars();
  const car = cars.find(c => String(c.id) === resolvedParams.id || String(c._id) === resolvedParams.id) || cars[0];

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    license: '',
    pickupDate: '',
    returnDate: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPickup = localStorage.getItem('drivemate_pickup_date');
      const storedReturn = localStorage.getItem('drivemate_return_date');
      if (storedPickup || storedReturn) {
        setForm(prev => ({
          ...prev,
          pickupDate: storedPickup || '',
          returnDate: storedReturn || ''
        }));
      }
    }
  }, []);

  if (!car) {
    return <div className="loading-box" style={{ padding: '160px 24px' }}>Loading vehicle details...</div>;
  }

  const days = form.pickupDate && form.returnDate
    ? Math.max(1, Math.ceil((new Date(form.returnDate) - new Date(form.pickupDate)) / 86400000))
    : 3;

  const total = (car.pricePerDay || 2000) * days;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const bookingData = {
      carId: car.id || car._id,
      carName: car.name,
      ...form,
      days,
      totalCost: total
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      const data = await res.json();

      if (res.ok) {
        const msg = [
          `🚗 *New Car Rental Request — DriveMate*`,
          ``,
          `*Car:* ${car.name} (${car.category})`,
          `*Pickup Date:* ${form.pickupDate}`,
          `*Return Date:* ${form.returnDate}`,
          `*Duration:* ${days} day${days > 1 ? 's' : ''}`,
          `*Total Cost:* ${formatINR(total)}`,
          ``,
          `*Customer Details*`,
          `*Name:* ${form.fullName}`,
          `*Phone:* ${form.phone}`,
          `*Driving Licence:* ${form.license}`,
          `*Address:* ${form.address}`,
          ``,
          `_Booking ID: ${data.booking?._id || 'N/A'}_`,
        ].join('\n');

        const waNumber = data.ownerWhatsApp || '7082628413';
        const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
        
        window.open(waUrl, '_blank');
        router.push('/confirmation');
      } else {
        alert('Booking failed: ' + (data.message || 'Server error'));
      }
    } catch (err) {
      alert('Could not submit booking request. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="booking-page">
      <div className="container booking-container">
        <div className="booking-header">
          <h1 className="booking-title">Complete Your <span className="gradient-text">Rental</span></h1>
          <p className="booking-sub">Fill in your contact and trip details — your request connects directly to our team via WhatsApp</p>
        </div>

        <div className="booking-layout">
          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="card booking-form-card">
            <h3>Renter Information</h3>

            <div className="form-fields-wrap">
              <div className="form-field full">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Rahul Sharma"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit mobile"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Email (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-field full">
                <label>Driving Licence Number *</label>
                <input
                  type="text"
                  name="license"
                  placeholder="e.g. DL-0420110012345"
                  value={form.license}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field full">
                <label>Delivery Address / Location *</label>
                <input
                  type="text"
                  name="address"
                  placeholder="City, Area or Hotel for pickup"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label>Pickup Date *</label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={form.pickupDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Return Date *</label>
                  <input
                    type="date"
                    name="returnDate"
                    value={form.returnDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full submit-booking-btn"
              >
                {loading ? 'Submitting Request...' : 'Send Rental Request via WhatsApp 💬'}
              </button>
            </div>
          </form>

          {/* Booking Summary Box */}
          <div className="card booking-summary-card">
            <h4>Rental Vehicle</h4>
            
            <div className="summary-car-box">
              <img src={car.image} alt={car.name} className="summary-car-img" />
              <h3>{car.name}</h3>
              <span className="badge">{car.category}</span>
            </div>

            <div className="summary-pricing-list">
              <div className="summary-row">
                <span>Rate per day:</span>
                <span>{formatINR(car.pricePerDay)}</span>
              </div>
              <div className="summary-row">
                <span>Total Days:</span>
                <span>{days}</span>
              </div>
              <div className="summary-row">
                <span>Security Deposit:</span>
                <span style={{ color: '#25D366' }}>Pay at Pickup</span>
              </div>
              <div className="summary-row total">
                <span>Estimated Total:</span>
                <span className="price-accent">{formatINR(total)}</span>
              </div>
            </div>

            <div className="summary-trust-notice">
              <p>🛡️ <strong>No instant online charges:</strong> We confirm vehicle availability with you on WhatsApp first before payment.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
