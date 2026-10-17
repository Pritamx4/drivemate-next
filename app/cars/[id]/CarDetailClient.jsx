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
    return <div style={{ padding: '160px 24px', textAlign: 'center' }}>Loading car details...</div>;
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
    <main style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '80px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#888', marginBottom: '24px' }}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/cars">Rent a Car</Link>
          <span>/</span>
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{car.name}</span>
        </div>

        {car.available === false && (
          <div style={{ background: 'rgba(255, 68, 68, 0.1)', border: '1px solid rgba(255, 68, 68, 0.3)', color: '#ff6666', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
            ⚠️ This car is currently unavailable for rental. Please check back later or browse other cars.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '36px', alignItems: 'start' }}>
          {/* Left Column: Showcase & Details */}
          <div>
            <div className="card" style={{ padding: '40px', borderRadius: '20px', position: 'relative', textAlign: 'center', marginBottom: '28px' }}>
              <span className="badge" style={{ position: 'absolute', top: '20px', left: '20px' }}>{car.category}</span>
              <img
                src={car.image}
                alt={car.name}
                style={{ width: '100%', maxHeight: '340px', objectFit: 'contain', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.8))' }}
              />
            </div>

            <div className="card" style={{ padding: '30px', borderRadius: '16px', marginBottom: '28px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '14px' }}>About This Rental</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '20px' }}>{car.description || car.desc}</p>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '14px', color: '#bbb' }}>
                <span>📅 Min. age: {car.minAge}+</span>
                <span>🛣️ {car.mileageLimit}</span>
                <span>🔄 Free cancellation 24h prior</span>
              </div>
            </div>

            <div className="card" style={{ padding: '30px', borderRadius: '16px', marginBottom: '28px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '18px' }}>Included Features</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                {EXTRA_FEATURES.map(f => (
                  <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#ccc' }}>
                    <span style={{ color: 'var(--primary)' }}>{f.icon}</span>
                    <span>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: '30px', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Customer Reviews</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {REVIEWS.map(r => (
                  <div key={r.name} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '15px' }}>{r.name}</strong>
                      <span style={{ fontSize: '12px', color: '#888' }}>{r.date}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="#f5a623" color="#f5a623" />
                      ))}
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Quick Booking Widget */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div className="card" style={{ padding: '32px', borderRadius: '20px', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>{car.name}</h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f5a623', fontSize: '14px' }}>
                    <Star size={16} fill="#f5a623" color="#f5a623" />
                    <strong>{car.rating}</strong>
                    <span style={{ color: '#888' }}>({car.reviews} reviews)</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-tech)' }}>
                    {formatINR(car.pricePerDay)}
                  </div>
                  <span style={{ fontSize: '12px', color: '#888' }}>per day</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '20px 0', margin: '20px 0' }}>
                <h4 style={{ fontSize: '14px', color: '#888', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.5px' }}>Select Dates</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px' }}>Pickup Date</label>
                    <input
                      type="date"
                      value={pickup}
                      onChange={e => setPickup(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', colorScheme: 'dark' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px' }}>Return Date</label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={e => setReturnDate(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#fff', colorScheme: 'dark' }}
                    />
                  </div>
                </div>
              </div>

              {/* Cost Summary */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa' }}>
                  <span>Duration</span>
                  <span>{days} {days === 1 ? 'day' : 'days'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa' }}>
                  <span>Base Rate</span>
                  <span>{formatINR(car.pricePerDay)} × {days}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#aaa' }}>
                  <span>Insurance & Roadside Aid</span>
                  <span style={{ color: '#25D366' }}>Included Free</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800, color: '#fff', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span>Total Payable</span>
                  <span style={{ color: 'var(--primary)' }}>{formatINR(car.pricePerDay * days)}</span>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                disabled={car.available === false}
                className="btn-primary"
                style={{ width: '100%', padding: '16px', fontSize: '16px', opacity: car.available === false ? 0.5 : 1 }}
              >
                Proceed to Booking <ArrowRight size={18} />
              </button>

              <p style={{ textAlign: 'center', fontSize: '12px', color: '#777', marginTop: '16px' }}>
                ⚡ Instant WhatsApp confirmation · No prepayment required
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
