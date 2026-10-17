'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, Users, Fuel, Zap, Bluetooth, MapPin, Camera, Thermometer, Wind, Calendar, ArrowRight } from 'lucide-react';
import { useCars, formatINR } from '@/context/CarContext';

const EXTRA_FEATURES = [
  { icon: <Bluetooth size={18} />, label: 'Bluetooth Audio' },
  { icon: <MapPin size={18} />, label: 'GPS Navigation' },
  { icon: <Camera size={18} />, label: 'Reverse Camera' },
  { icon: <Thermometer size={18} />, label: 'Heated Seats' },
  { icon: <Wind size={18} />, label: 'Climate Control' },
  { icon: <Zap size={18} />, label: 'Fast Charge / USB' },
];

const REVIEWS = [
  { name: 'Arjun Sharma', rating: 5, date: 'Feb 2024', text: 'Amazing rental experience! The car was in spotless condition and the pick-up process was super smooth. Will use Drive Mate again!' },
  { name: 'Priya Mehta', rating: 5, date: 'Jan 2024', text: 'Booked the SUV for a weekend trip to Rajasthan. Incredible comfort, zero issues, and return was effortless.' },
  { name: 'Rohan Kapoor', rating: 4, date: 'Dec 2023', text: 'Great selection of premium self-drive cars. Competitive pricing and very responsive support on WhatsApp!' },
];

export default function CarDetailClient({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { cars, loading } = useCars();
  const [pickup, setPickup] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const car = cars.find(c => String(c.id) === resolvedParams.id || String(c._id) === resolvedParams.id);

  const days = pickup && returnDate
    ? Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickup)) / 86400000))
    : 1;

  if (loading) {
    return <div className="loading-box" style={{ padding: '160px 24px' }}>Loading car details...</div>;
  }

  if (!car) {
    return (
      <div style={{ padding: '160px 24px', textAlign: 'center' }}>
        <h2>Car not found</h2>
        <Link href="/cars" className="btn-primary" style={{ marginTop: '20px' }}>Browse Cars</Link>
      </div>
    );
  }

  const handleBookNow = () => {
    if (pickup) localStorage.setItem('drivemate_pickup_date', pickup);
    if (returnDate) localStorage.setItem('drivemate_return_date', returnDate);
    router.push(`/booking/${car.id}`);
  };

  return (
    <main className="detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/cars">Rent a Car</Link>
          <span>/</span>
          <span className="bc-current">{car.name}</span>
        </div>

        {car.available === false && (
          <div className="unavail-banner">
            ⚠️ This car is currently unavailable for rental. Please check back later or browse other cars.
          </div>
        )}

        <div className="detail-layout">
          {/* Left Column: Showcase & Details */}
          <div className="detail-left">
            <div className="card detail-car-showcase">
              <span className="badge detail-cat-badge">{car.category}</span>
              <img
                src={car.image}
                alt={car.name}
                className="detail-car-real-img"
              />
            </div>

            <div className="card detail-desc-card">
              <h3>About This Rental</h3>
              <p>{car.description || car.desc}</p>
              <div className="rental-meta">
                <span>📅 Min. age: {car.minAge}+</span>
                <span>🛣️ {car.mileageLimit}</span>
                <span>🔄 Free cancellation 24h prior</span>
              </div>
            </div>

            <div className="card detail-features-card">
              <h3>Included Features</h3>
              <div className="features-list">
                {EXTRA_FEATURES.map(f => (
                  <div key={f.label} className="feature-item">
                    <span className="feat-icon">{f.icon}</span>
                    <span>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card detail-reviews-card">
              <h3>Customer Reviews</h3>
              <div className="reviews-list">
                {REVIEWS.map(r => (
                  <div key={r.name} className="review-item">
                    <div className="review-top">
                      <strong>{r.name}</strong>
                      <span className="review-date">{r.date}</span>
                    </div>
                    <div className="review-stars">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="#f5a623" color="#f5a623" />
                      ))}
                    </div>
                    <p className="review-text">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Quick Booking Widget */}
          <div className="detail-right">
            <div className="card detail-pricing-card">
              <div className="dp-header">
                <div>
                  <h1 className="detail-car-name">{car.name}</h1>
                  <div className="detail-rating-row">
                    <Star size={16} fill="#f5a623" color="#f5a623" />
                    <strong>{car.rating}</strong>
                    <span className="review-count">({car.reviews} reviews)</span>
                  </div>
                </div>
                <div className="dp-price-wrap">
                  <div className="dp-price">
                    {formatINR(car.pricePerDay)}
                  </div>
                  <span className="dp-per-day">per day</span>
                </div>
              </div>

              <div className="dp-dates-box">
                <h4>Select Dates</h4>
                <div className="date-pickers-grid">
                  <div className="date-field">
                    <label>Pickup Date</label>
                    <input
                      type="date"
                      value={pickup}
                      onChange={e => setPickup(e.target.value)}
                    />
                  </div>
                  <div className="date-field">
                    <label>Return Date</label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={e => setReturnDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Cost Summary */}
              <div className="cost-summary-list">
                <div className="cost-row">
                  <span>Duration</span>
                  <span>{days} {days === 1 ? 'day' : 'days'}</span>
                </div>
                <div className="cost-row">
                  <span>Base Rate</span>
                  <span>{formatINR(car.pricePerDay)} × {days}</span>
                </div>
                <div className="cost-row">
                  <span>Insurance & Roadside Aid</span>
                  <span style={{ color: '#25D366' }}>Included Free</span>
                </div>
                <div className="cost-row total-row">
                  <span>Total Payable</span>
                  <span className="total-amount">{formatINR(car.pricePerDay * days)}</span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                disabled={car.available === false}
                className="btn-primary w-full book-btn"
                style={{ opacity: car.available === false ? 0.5 : 1 }}
              >
                Proceed to Booking <ArrowRight size={18} />
              </button>

              <p className="instant-notice">
                ⚡ Instant WhatsApp confirmation · No prepayment required
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
